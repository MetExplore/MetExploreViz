/**
 * @author MC
 * (a)description CaptionFormController : Control displaying pathway and compartment caption
 */

Ext.define('metExploreViz.view.form.captionForm.CaptionFormController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.form-captionForm-captionForm',

    /**
     * Aplies event linsteners to the view
     */
    init:function(){
        var me 		= this,
            viewModel   = me.getViewModel(),
            view      	= me.getView();

        // Regex to remove bad chars in dom ids
        me.regexpPanel=/\.|>|<| |,|\/|=|\(|\)/g;

        view.on({
            afterColorCalculating : this.addComponentCaptionForm,
            scope:me
        });
    },
    /*******************************************
     * Add the panel caption corresponding to shown component
     * @param {} type : component type (Pathway, Compartment)
     */
    addComponentCaptionForm : function() {
        var me 		= this,
            viewModel   = me.getViewModel(),
            view      	= me.getView();

        // We add form corresponding to the component data type
        var captionForm = view;
        if(view.getTitle()=="Pathways")
            var components = metExploreD3.getPathwaysSet('viz')
        else
            var components = metExploreD3.getCompartmentInBiosourceSet();

        if(Ext.getCmp('panel' + view.getTitle().replace(me.regexpPanel, "")))
            view.removeAll();

        if(captionForm !=undefined) {

            var idColors = [];
            var listComponentCaptionForm = [];

            var that = this;

            // For each value we add corresponding color caption
            components.forEach(function (component, i) {
                    var colorName = component.getName();

                    var parser = new DOMParser;
                    var dom = parser.parseFromString(colorName, 'text/html');
                    var value = dom.body.textContent;
                    var newId = i;
                    var that=me;
                    var newComponentCaptionForm = Ext.create('metExploreViz.view.form.ComponentCaptionForm', {

                        itemId: 'componentCaptionForm' + newId,

                        margin: '0 0 10 0',
                        padding: '0 0 0 0',
                        border: false,
                        items:
                            [
                                {
                                    itemId: 'chooseColorReaction' + newId,
                                    xtype: 'panel',
                                    border: false,
                                    layout: {
                                        type: 'hbox',
                                        align: 'stretch'
                                    },
                                    items: [
                                        {
                                            xtype: 'checkbox',
                                            forId: 'componentCheckbox',
                                            margin: '0 0 0 10',
                                            checked: !component.hidden(),
                                            listeners: {
                                                change: function (that, newValue, oldValue) {

                                                    var activePanel = _MyThisGraphNode.activePanel;
                                                    if(!activePanel) activePanel='viz';

                                                    metExploreD3.applyTolinkedNetwork(
                                                        activePanel,
                                                        function(panelLinked, sessionLinked) {
                                                            if (view.getTitle() == "Pathways")
                                                                var comp = metExploreD3.getPathwayByName(component.getName(), panelLinked);
                                                            else
                                                                var comp = metExploreD3.getCompartmentByName(component.getName());

                                                            comp.setHidden(!newValue);
                                                            d3.select("#" + panelLinked).select("#D3viz").selectAll("path.convexhull")
                                                                .classed("hide", function (conv) {
                                                                    if (view.getTitle() == "Pathways")
                                                                        var com = metExploreD3.getPathwayByName(conv.key, panelLinked);
                                                                    else
                                                                        var com = metExploreD3.getCompartmentByName(conv.key);
                                                                    return com.hidden();
                                                                });
                                                            if (view.getTitle() == "Pathways"){
                                                                d3.select("#" + panelLinked).select("#D3viz").selectAll("path.link.pathway")
                                                                    .filter(function(link){
                                                                        var reaction;
                                                                        if(link.getSource().getBiologicalType()==="reaction")
                                                                            reaction=link.getSource();
                                                                        else
                                                                            reaction=link.getTarget();

                                                                        return reaction.getPathways().indexOf(component.getName())!==-1 && this.getAttribute("id")===component.getName().replace(/[.*+?^${}()|[\]\-\\]/g, "");

                                                                    })
                                                                    .classed("hide", function () {
                                                                        return comp.hidden();
                                                                    });
                                                            }
                                                        });
                                                }
                                            }
                                        },
                                        {
                                            xtype: 'label',
                                            forId: 'color',
                                            text: value + ' :',
                                            margin: '0 0 0 10',
                                            flex: 1,
                                            border: false
                                        }, {
                                            border: false,
                                            xtype: 'hiddenfield',
                                            itemId: 'hidden' + newId,
                                            value: component.getColor(),
                                            listeners: {
                                                change: function (that) {
                                                    this.lastValue = that.value;
                                                    component.setColor(that.value);
                                                    metExploreD3.GraphCaption.majCaptionColor(components, view.getTitle());
                                                }
                                            }
                                        },
                                        {
                                            border: false,
                                            margin: '0 10 0 0',
                                            width: "40%",
                                            html: '<input ' +
                                            'type="color" ' +
                                            'id="html5colorpicker" ' +
                                            'onchange="Ext.getCmp(\'captionForm'+view.getTitle()+'\').down(\'#hidden'+newId+'\').fireEvent(\'change\',this, \''+component.getColor()+'\')" ' +
                                            'value="'+component.getColor()+'" ' +
                                            'style="width:85%;">'
                                        }
                                    ]
                                }
                            ]
                    });

                    listComponentCaptionForm.push(newComponentCaptionForm);
                    idColors.push(newId);
                }
            );

            var newConditionPanel = Ext.create('Ext.panel.Panel', {
                id: 'panel' + view.getTitle().replace(me.regexpPanel, ""),
                border: false,
                width: '100%',
                bodyBorder: false,
                xtype: 'panel',
                layout: {
                    type: 'hbox',
                    align: 'stretch'
                }
            });

            // Create checkbox to display convex hull around each components
            var highlightCheckbox = Ext.create('Ext.form.field.Checkbox', {
                tooltip: 'Display convex hull around each ' + view.getTitle(),
                boxLabel: 'Highlight '+view.getTitle().toLowerCase(),
                margin: '0 0 0 10',
                id: 'highlightCheckbox' + view.getTitle()
            });

            highlightCheckbox.on({
                change : function (that, newV, oldVV, e) {

                    switch (view.getTitle()) {
                        case "Pathways":
                            Ext.getCmp("vizIdConvexHullMenu").lookupReference('highlightPathways').setChecked(newV);
                            Ext.getCmp("vizIdConvexHullMenu").lookupReference('highlightPathways')
                                .fireEvent("click", Ext.getCmp("vizIdConvexHullMenu").lookupReference('highlightPathways'));
                            break;
                        case "Compartments":
                            Ext.getCmp("vizIdConvexHullMenu").lookupReference('highlightCompartments').setChecked(newV);
                            Ext.getCmp("vizIdConvexHullMenu").lookupReference('highlightCompartments')
                                .fireEvent("click", Ext.getCmp("vizIdConvexHullMenu").lookupReference('highlightCompartments'));

                            break;
                        default:
                    }
                },
                scope:highlightCheckbox
            });
            newConditionPanel.add(highlightCheckbox);



            // Add component caption to captionForm panel
            if (captionForm != undefined) {
                captionForm.add(newConditionPanel);
                // Create checkbox to display convex hull around each components
                var line = Ext.create('Ext.Component', {
                    hidden: false,
                    autoEl: {
                        tag: 'hr'
                    }
                });
                captionForm.add(line);

                // Create checkbox to display convex hull around each components
                var selectAllButton = Ext.create('Ext.button.Button', {
                    tooltip: 'selectAllButton',
                    text: 'Select/Unselect all',
                    margin: '10 10 10 10',
                    id: 'selectAllButton' + view.getTitle()
                });

                selectAllButton.on({
                    click : function (that, newV, oldVV, e) {
                        var arrayCheckBox = Ext.getCmp("captionFormPathways").query('checkbox[forId=componentCheckbox]');
                        var allIsSelected = arrayCheckBox.every(function(checkbox){return checkbox.checked});
                        if(allIsSelected){
                            arrayCheckBox.forEach(function (checkBox) {
                                checkBox.setValue(false);
                            })
                        }
                        else {
                            arrayCheckBox.forEach(function (checkBox) {
                                checkBox.setValue(true);
                            })
                        }

                    },
                    scope:selectAllButton
                });

                captionForm.add(selectAllButton);
                listComponentCaptionForm.forEach(function (aComponentCaptionForm) {
                    captionForm.add(aComponentCaptionForm);
                });
            }
        }
    }
});