/**
 * @author JCG
 * (a)description GirFormController : Control GIR pathways parameters
 */

Ext.define('metExploreViz.view.form.girPathwaysForm.GirPathwaysFormController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.form-girPathwaysForm-girPathwaysForm',

    /**
     * Aplies event linsteners to the view
     */
    init:function(){
        var me 		= this,
            viewModel   = me.getViewModel(),
            view      	= me.getView();

        // Regex to remove bad chars in dom ids
        me.regexPanel=/\.|>|<| |,|\/|=|\(|\)/g;

        view.on({
            afterColorCalculating : this.addComponentCaptionForm,
            onStart : this.updatePathways,
            scope:me
        });
    },

    addComponentCaptionForm : function() {
        var me 		    = this,
            viewModel   = me.getViewModel(),
            view      	= me.getView();

        var components = metExploreD3.getPathwaysSet('viz');
        var s_GeneralStyle = _metExploreViz.getGeneralStyle();

        if(view !== undefined) {
            view.removeAll(true);
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

            // Highlight checkbox
            var highlightLinkCheckbox = Ext.create('Ext.form.field.Checkbox', {
                tooltip: 'Display convex hull around each ' + view.getTitle(),
                boxLabel: 'Highlight '+view.getTitle().toLowerCase() +' on links' ,
                margin: '0 0 20 10',
                id: 'highlightCheckbox' + view.getTitle() + "LinkForGIR",
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
            view.add(highlightLinkCheckbox);

            // separation line
            var line = Ext.create('Ext.Component', {
                hidden: false,
                autoEl: {
                    tag: 'hr'
                }
            });
            view.add(line);

            // Select / unselect all button
            var selectAllButton = Ext.create('Ext.button.Button', {
                tooltip: 'select / unselect all pathways on the list',
                text: 'Select/Unselect all',
                margin: '10 10 10 10',
                id: 'selectAllButton'
            });

            selectAllButton.on({
                click : function (that, newV, oldVV, e) {
                    var arrayCheckBox = Ext.getCmp("girPathwaysParams").query('checkbox[forId=componentCheckbox]');

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

            view.add(selectAllButton);

            // Pathways
            components.forEach(function(cmpt, i) {
                // pathways iteration start
                var colorName = cmpt.getName();

                var ref = colorName.replaceAll(me.regexPanel, "");

                var parser = new DOMParser;
                var dom = parser.parseFromString(colorName, 'text/html');
                var value = dom.body.textContent;
                var newId = i;
                var that=me;

                var newBox = new Ext.panel.Panel({
                    layout: {
                        width: '100%'
                    },
                    // reference: ref,
                    margin: '5 5 5 5',
                    items: [
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
                                    checked: !cmpt.hidden(),
                                    listeners: {
                                        change: function (that, newValue, oldValue) {

                                            var activePanel = _MyThisGraphNode.activePanel;
                                            if(!activePanel) activePanel='viz';

                                            metExploreD3.applyTolinkedNetwork(
                                                activePanel,
                                                function(panelLinked, sessionLinked) {
                                                    var comp = metExploreD3.getPathwayByName(cmpt.getName(), panelLinked);

                                                    comp.setHidden(!newValue);
                                                    metExploreD3.GraphLink.majConvexhullsVisibility(panelLinked, view.getTitle());
                                                    metExploreD3.GraphCaption.majCaptionPathwayOnLink();
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
                                    value: cmpt.getColor(),
                                    listeners: {
                                        change: function (that) {

                                            var activePanel = _MyThisGraphNode.activePanel;
                                            if(!activePanel) activePanel='viz';

                                            this.lastValue = that.value;
                                            metExploreD3.applyTolinkedNetwork(
                                                activePanel,
                                                function(panelLinked, sessionLinked) {
                                                    var componentsLinked = metExploreD3.getPathwaysSet(panelLinked);

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
                                    'onchange="Ext.getCmp(\'captionForm'+view.getTitle()+'\').down(\'#hidden'+newId+'\').fireEvent(\'change\',this, \''+cmpt.getColor()+'\')" ' +
                                    'value="'+cmpt.getColor()+'" ' +
                                    'style="width:85%;">'
                                }
                            ]
                        }
                    ]
                });
                view.add(newBox);
                // pathways iteration end
            });
        }
    },

    updatePathways: function() {
        var me = this;
        var view = me.getView();

        var components = metExploreD3.getPathwaysSet('viz');
        var nodes = d3.select("#viz").select("#D3viz").select("#graphComponent").selectAll("g.node");

        var visiblePathways = [];

        nodes.each(function(node){
            if (node.getBiologicalType() === "reaction"){
                var thisPath = node.getPathways();
                thisPath.forEach(function(pathway){
                    visiblePathways.push(pathway);
                });
            }
        });

        components.forEach(function(cmpt){
            var ref = cmpt.getName().replaceAll(me.regexPanel, "");
            var panel = view.lookupReference(ref);

            if (visiblePathways.includes(cmpt.getName())) {
                panel.setHidden(false);
            }
            else {
                panel.setHidden(true);
            }
        });
    }

});
