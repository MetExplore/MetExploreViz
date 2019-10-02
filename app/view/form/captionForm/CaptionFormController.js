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
            var components = metExploreD3.getPathwaysSet('viz');
        else
            var components = metExploreD3.getCompartmentInBiosourceSet();

        if(Ext.getCmp('panel' + view.getTitle().replace(me.regexpPanel, "")))
            view.removeAll();

        if(captionForm !=undefined) {

            var idColors = [];
            var listComponentCaptionForm = [];

            var that = this;

            components=components.sort(function (comp, comp2) {
                if (comp.getName()<comp2.getName())
                    return -1;
                if (comp.getName()>comp2.getName())
                    return 1;
                // a doit être égal à b
                return 0;
            });

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
                                                            metExploreD3.GraphLink.majConvexhullsVisibility(panelLinked, view.getTitle());
                                                            if (view.getTitle() == "Pathways"){
                                                                metExploreD3.GraphCaption.majCaptionPathwayOnLink();
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

                                                    var activePanel = _MyThisGraphNode.activePanel;
                                                    if(!activePanel) activePanel='viz';

                                                    this.lastValue = that.value;
                                                    metExploreD3.applyTolinkedNetwork(
                                                        activePanel,
                                                        function(panelLinked, sessionLinked) {
                                                            if (view.getTitle() === "Pathways"){
                                                                var componentsLinked = metExploreD3.getPathwaysSet(panelLinked);
                                                            }
                                                            else
                                                            {
                                                                var componentsLinked = metExploreD3.getCompartmentInBiosourceSet();
                                                            }

                                                            component.setColor(that.value);
                                                            metExploreD3.GraphCaption.majCaptionColor(componentsLinked, view.getTitle(), panelLinked);
                                                        });
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
                    type: 'vbox',
                    align: 'stretch'
                }
            });

            var s_GeneralStyle = _metExploreViz.getGeneralStyle();
            var checkComponent = false;
            if(s_GeneralStyle.isDisplayedConvexhulls()===view.getTitle())
                checkComponent=true;

            // Create checkbox to display convex hull around each components
            var highlightCheckbox = Ext.create('Ext.form.field.Checkbox', {
                tooltip: 'Display convex hull around each ' + view.getTitle(),
                boxLabel: 'Highlight '+view.getTitle().toLowerCase(),
                margin: '0 0 0 10',
                id: 'highlightCheckbox' + view.getTitle(),
                checked: checkComponent
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

            if(view.getTitle()=="Pathways"){

                // Create checkbox to display convex hull around each components
                var highlightLinkCheckbox = Ext.create('Ext.form.field.Checkbox', {
                    tooltip: 'Display convex hull around each ' + view.getTitle(),
                    boxLabel: 'Highlight '+view.getTitle().toLowerCase() +' on links' ,
                    margin: '0 0 20 10',
                    id: 'highlightCheckbox' + view.getTitle() + "Link",
                    checked: s_GeneralStyle.isDisplayedPathwaysOnLinks()
                });

                highlightLinkCheckbox.on({
                    change : function (that, newV, oldVV, e) {

                        switch (view.getTitle()) {
                            case "Pathways":
                                Ext.getCmp("vizIdConvexHullMenu").lookupReference('highlightPathwaysLink').setChecked(newV);
                                Ext.getCmp("vizIdConvexHullMenu").lookupReference('highlightPathwaysLink')
                                    .fireEvent("click", Ext.getCmp("vizIdConvexHullMenu").lookupReference('highlightPathwaysLink'));
                                break;
                            default:
                        }
                    },
                    scope:highlightLinkCheckbox
                });
                newConditionPanel.add(highlightLinkCheckbox);
            }


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