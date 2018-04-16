Ext.define('metExploreViz.view.panel.editModePanel.EditModePanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.editModePanel',
    requires: [
        "metExploreViz.view.panel.editModePanel.EditModePanelController",
        "metExploreViz.view.form.captionForm.CaptionForm"
    ],
    controller: "panel-editModePanel-editModePanel",
    /*requires: ['MetExplore.view.form.V_SelectConditionForm',
               'MetExplore.view.form.V_UpdateStyleForm'
               ],
*/
    collapsible: true,
    collapsed:true,
    width: '20%',
    height: '100%',
    margins:'0 0 2 0',
    split:true,
    layout:'accordion',
    closable: false,
    region: 'east',
    hidden:true,
    items: [
        {
            title: "All text",
            xtype: 'panel',
            collapsible: true,
            collapsed:true,
            /*layout: {
                type: 'vbox',
                align: 'stretch'
            },*/
            items: [
                {
                    xtype: 'combo',
                    reference: 'chooseFontType',
                    fieldLabel: 'Font type:',
                    //hiddenName: 'font-style',
                    width:'95%',
                    margin:'5 5 5 5',
                    emptyText:'-- Choose a font --',
                    store: [
                        ['Open Sans', 'Open Sans'],
                        ['Arial', 'Arial'],
                        ['Helvetica', 'Helvetica'],
                        ['Times', 'Times'],
                        ['Verdana', 'Verdana']
                    ],
                    editable: false
                },
                {
                    xtype: 'textfield',
                    reference:'chooseFontSize',
                    margin:'5 5 5 5',
                    fieldLabel: "Font size:",
                    displayField: 'stroke',
                    editable:true,
                    width:'95%',
                    emptyText:'10',
                    listeners: {
                        change: function(newValue, oldValue){
                            this.lastValue = newValue;
                        }
                    }
                },
                {
                    xtype:'fieldcontainer',
                    margin:'5 5 5 5',
                    fieldLabel:'Font style',
                    defaultType:'checkboxfield',
                    items: [
                        {
                            boxLabel:'Bold',
                            checked:true,
                            id:'checkboxBoldFont',
                            reference:'checkBoldFont'
                        },{
                            boxLabel:'Italic',
                            checked:false,
                            id:'checkboxItalicFont',
                            reference:'checkItalicFont'
                        },{
                            boxLabel:'Underline',
                            checked:false,
                            id:'checkboxUnderlineFont',
                            reference:'checkUnderlineFont'
                        }
                    ]
                },
                {
                    xtype: 'menuseparator'
                },
                {
                    xtype:'button',
                    iconCls:'refresh',
                    width:'100%',
                    margin:'5 5 5 0',
                    reference: 'refreshLabelStyle',
                    action: 'refreshLabelStyle'

                }
            ]
        },
        {
            title: "Selection",
            xtype: 'panel',
            collapsible: true,
            collapsed:true,
            /*layout: {
                type: 'vbox',
                align: 'stretch'
            },*/
            items: [
                {
                    xtype: 'combo',
                    reference: 'chooseFontTypeSelection',
                    fieldLabel: 'Font type:',
                    //hiddenName: 'font-style',
                    width:'95%',
                    margin:'5 5 5 5',
                    emptyText:'-- Choose a font --',
                    store: [
                        ['Open Sans', 'Open Sans'],
                        ['Arial', 'Arial'],
                        ['Helvetica', 'Helvetica'],
                        ['Times', 'Times'],
                        ['Verdana', 'Verdana']
                    ],
                    editable: false
                },
                {
                    xtype: 'textfield',
                    reference:'chooseFontSizeSelection',
                    margin:'5 5 5 5',
                    fieldLabel: "Font size:",
                    displayField: 'stroke',
                    editable:true,
                    width:'95%',
                    emptyText:'10',
                    listeners: {
                        change: function(newValue, oldValue){
                            this.lastValue = newValue;
                        }
                    }
                },
                {
                    xtype:'fieldcontainer',
                    margin:'5 5 5 5',
                    fieldLabel:'Font style',
                    defaultType:'checkboxfield',
                    items: [
                        {
                            boxLabel:'Bold',
                            checked:true,
                            reference:'checkBoldFontSelection'
                        },{
                            boxLabel:'Italic',
                            checked:false,
                            reference:'checkItalicFontSelection'
                        },{
                            boxLabel:'Underline',
                            checked:false,
                            reference:'checkUnderlineFontSelection'
                        }
                    ]
                },
                {
                    xtype: 'menuseparator'
                },
                {
                    xtype:'button',
                    iconCls:'refresh',
                    width:'100%',
                    margin:'5 5 5 0',
                    reference: 'refreshLabelStyleSelection',
                    action: 'refreshLabelStyleSelection'

                }
            ]
        },
        {
            title: "Metabolites",
            xtype: 'panel',
            collapsible: true,
            collapsed:true,
            /*layout: {
                type: 'vbox',
                align: 'stretch'
            },*/
            items: [
                {
                    xtype: 'combo',
                    reference: 'chooseFontTypeMetabolite',
                    fieldLabel: 'Font type:',
                    //hiddenName: 'font-style',
                    width:'95%',
                    margin:'5 5 5 5',
                    emptyText:'-- Choose a font --',
                    store: [
                        ['Open Sans', 'Open Sans'],
                        ['Arial', 'Arial'],
                        ['Helvetica', 'Helvetica'],
                        ['Times', 'Times'],
                        ['Verdana', 'Verdana']
                    ],
                    editable: false
                },
                {
                    xtype: 'textfield',
                    reference:'chooseFontSizeMetabolite',
                    margin:'5 5 5 5',
                    fieldLabel: "Font size:",
                    displayField: 'stroke',
                    editable:true,
                    width:'95%',
                    emptyText:'10',
                    listeners: {
                        change: function(newValue, oldValue){
                            this.lastValue = newValue;
                        }
                    }
                },
                {
                    xtype:'fieldcontainer',
                    margin:'5 5 5 5',
                    fieldLabel:'Font style',
                    defaultType:'checkboxfield',
                    items: [
                        {
                            boxLabel:'Bold',
                            checked:true,
                            reference:'checkBoldFontMetabolite'
                        },{
                            boxLabel:'Italic',
                            checked:false,
                            reference:'checkItalicFontMetabolite'
                        },{
                            boxLabel:'Underline',
                            checked:false,
                            reference:'checkUnderlineFontMetabolite'
                        }
                    ]
                },
                {
                    xtype: 'menuseparator'
                },
                {
                    xtype:'button',
                    iconCls:'refresh',
                    width:'100%',
                    margin:'5 5 5 0',
                    reference: 'refreshLabelStyleMetabolite',
                    action: 'refreshLabelStyleMetaboolite'

                }
            ]
        },
        {
            title: "Reactions",
            xtype: 'panel',
            collapsible: true,
            collapsed:true,
            items: [
                {
                    xtype: 'combo',
                    reference: 'chooseFontTypeReaction',
                    fieldLabel: 'Font type:',
                    //hiddenName: 'font-style',
                    width:'95%',
                    margin:'5 5 5 5',
                    emptyText:'-- Choose a font --',
                    store: [
                        ['Open Sans', 'Open Sans'],
                        ['Arial', 'Arial'],
                        ['Helvetica', 'Helvetica'],
                        ['Times', 'Times'],
                        ['Verdana', 'Verdana']
                    ],
                    editable: false
                },
                {
                    xtype: 'textfield',
                    reference:'chooseFontSizeReaction',
                    margin:'5 5 5 5',
                    fieldLabel: "Font size:",
                    displayField: 'stroke',
                    editable:true,
                    width:'95%',
                    emptyText:'10',
                    listeners: {
                        change: function(newValue, oldValue){
                            this.lastValue = newValue;
                        }
                    }
                },
                {
                    xtype:'fieldcontainer',
                    margin:'5 5 5 5',
                    fieldLabel:'Font style',
                    defaultType:'checkboxfield',
                    items: [
                        {
                            boxLabel:'Bold',
                            checked:true,
                            reference:'checkBoldFontReaction'
                        },{
                            boxLabel:'Italic',
                            checked:false,
                            reference:'checkItalicFontReaction'
                        },{
                            boxLabel:'Underline',
                            checked:false,
                            reference:'checkUnderlineFontReaction'
                        }
                    ]
                },
                {
                    xtype: 'menuseparator'
                },
                {
                    xtype:'button',
                    iconCls:'refresh',
                    width:'100%',
                    margin:'5 5 5 0',
                    reference: 'refreshLabelStyleReaction',
                    action: 'refreshLabelStyleReaction'

                }
            ]
        },
        {
            title: "Curve",
            xtype: 'panel',
            collapsible: true,
            collapsed:true,
            items: [
                {
                    xtype:'fieldcontainer',
                    margin:'5 5 5 5',
                    fieldLabel:'Curve',
                    defaultType:'checkboxfield',
                    items: [
                        {
                            boxLabel:'Edge Bundling',
                            checked:false,
                            reference:'EdgeBundling'
                        }
                    ]
                },
                {
                    xtype: 'menuseparator'
                },
                {
                    xtype:'button',
                    iconCls:'refresh',
                    width:'100%',
                    margin:'5 5 5 0',
                    reference: 'refreshCurve',
                    action: 'refreshCurve'

                }
            ]
        }
    ]
});
