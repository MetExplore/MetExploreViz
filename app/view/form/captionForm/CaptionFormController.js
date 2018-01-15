/**
 * @author MC
 * @description class to control contion selection panel and to draw component in the component story
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
        me.regexpPanel=/\.| |=|\(|\)/g;

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



        var networkVizSession = _metExploreViz.getSessionById("viz");

        if(view.getTitle()=="Pathways")
            var components = metExploreD3.getPathwaysSet()
        else
            var components = metExploreD3.getCompartmentInBiosourceSet();



        if(captionForm !=undefined) {

            var idColors = [];
            var listComponentCaptionForm = [];

            var that = this;

            // For each value we add corresponding color caption

            components.forEach(function (component) {
                    var colorName = component.getName();
                    var value = colorName;

                    var newId = colorName.toString().replace(me.regexpPanel, "_");
                    var that=me;
                    var newComponentCaptionForm = Ext.create('metExploreViz.view.form.ComponentCaptionForm', {

                        itemId: 'componentCaptionForm' + newId,

                        margin: '0 0 0 0',
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
                                                change: function (newValue, oldValue) {
                                                    console.log(newValue.value);
                                                    this.lastValue = newValue.value;

                                                }
                                            }
                                        },
                                        {
                                            border: false,
                                            margin: '0 10 0 0',
                                            width: "40%",
                                            // Object to change color var field= Ext.ComponentQuery.query('#theField')[0];
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
                },
                items: [{
                    xtype: 'label',
                    forId: 'condName',
                    margin: '8 5 5 10',
                    flex: 1
                }]
            });

            // Create checkbox to display convex hull around each components
            var highlightCheckbox = Ext.create('Ext.form.field.Checkbox', {
                tooltip: 'Display convex hull around each ' + view.getTitle(),
                //formBind: true,
                margin: '5 5 5 0',
                id: 'highlightCheckbox' + view.getTitle().replace(me.regexpPanel, ""),
                action: 'highlightCheckbox' + view.getTitle().replace(me.regexpPanel, ""),
                handler: function (item) {

                    switch (view.getTitle()) {
                        case "Pathways":
                            Ext.getCmp("vizIdConvexHullMenu").lookupReference('highlightPathways').setChecked(item.checked);
                            Ext.getCmp("vizIdConvexHullMenu").lookupReference('highlightPathways')
                                .fireEvent("click", Ext.getCmp("vizIdConvexHullMenu").lookupReference('highlightPathways'));
                            break;
                        case "Compartments":
                            Ext.getCmp("vizIdConvexHullMenu").lookupReference('highlightCompartments').setChecked(item.checked);
                            Ext.getCmp("vizIdConvexHullMenu").lookupReference('highlightCompartments')
                                .fireEvent("click", Ext.getCmp("vizIdConvexHullMenu").lookupReference('highlightCompartments'));

                            break;
                        default:
                    }
                }
            });
            newConditionPanel.add(highlightCheckbox);

            var mapp = view.getTitle();

            // Add button to change colors
            var refreshColorButton = Ext.create('Ext.Button', {
                iconCls: 'refresh',
                margin: '5 5 5 0',
                id: 'refreshColor' + view.getTitle().replace(me.regexpPanel, ""),
                action: 'refreshColor' + view.getTitle().replace(me.regexpPanel, ""),
                handler: function () {
                    var component = mapp;

                    components.forEach(function (color) {
                        var newId = color.getName().toString().replace(me.regexpPanel, "_");
                        if (captionForm.down("#hidden" + newId) != null) {
                            if (color.getColor() != captionForm.down("#hidden" + newId).lastValue) {
                                color.setColor(captionForm.down("#hidden" + newId).lastValue);
                            }
                        }
                    });

                    metExploreD3.GraphCaption.majCaptionColor(components, view.getTitle());

                }
            });
            newConditionPanel.add(refreshColorButton);


            // Add component caption to captionForm panel

            if (captionForm != undefined) {
                captionForm.add(newConditionPanel);
                listComponentCaptionForm.forEach(function (aComponentCaptionForm) {
                    captionForm.add(aComponentCaptionForm);
                });
            }
        }
    }
});