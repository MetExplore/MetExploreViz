Ext.define('metExploreViz.view.panel.editModePanel.EditModePanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.editModePanel',
    requires: [
        "metExploreViz.view.panel.editModePanel.EditModePanelController"//,
        //"metExploreViz.view.form.captionForm.CaptionForm"
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
            title: "Label edition",
            xtype: 'panel',
            collapsible: true,
            collapsed:true,
            autoScroll: true,
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items : [
                {
                    xtype:'combobox',
                    reference: 'comboChoseLabelItem',
                    editable: false,
                    margin:'5 5 5 5',
                    action:'changeObject',
                    emptyText:'-- Choose an object --',
                    store: [
                        ['labelForm','All'],
                        ['labelSelectionForm','Selection'],
                        ['labelMetaboliteForm', 'Metabolite'],
                        ['labelReactionForm', 'Reaction']
                    ]
                },
                {
                    xtype: 'menuseparator'
                },
                {
                    id: "labelForm",
                    xtype: 'panel',
                    collapsible: false,
                    hidden: true,
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
                            xtype:'fieldcontainer',
                            margin:'5 5 5 5',
                            fieldLabel:'Hide label',
                            defaultType:'checkboxfield',
                            items: [
                                {
                                    boxLabel:'Yes',
                                    name:'label',
                                    checked:false,
                                    reference:'checkHideLabel'
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
                    id: "labelSelectionForm",
                    xtype: 'panel',
                    collapsible: false,
                    hidden: true,
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
                            xtype:'fieldcontainer',
                            margin:'5 5 5 5',
                            fieldLabel:'Hide label',
                            defaultType:'checkboxfield',
                            items: [
                                {
                                    boxLabel:'Yes',
                                    name:'label',
                                    checked:false,
                                    reference:'checkHideSelectionLabel'
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
                    id: "labelMetaboliteForm",
                    xtype: 'panel',
                    collapsible: false,
                    hidden: true,
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
                            xtype:'fieldcontainer',
                            margin:'5 5 5 5',
                            fieldLabel:'Hide label',
                            defaultType:'checkboxfield',
                            items: [
                                {
                                    boxLabel:'Yes',
                                    name:'label',
                                    checked:false,
                                    reference:'checkHideMetaboliteLabel'
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
                    id: "labelReactionForm",
                    xtype: 'panel',
                    collapsible: false,
                    hidden: true,
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
                            xtype:'fieldcontainer',
                            margin:'5 5 5 5',
                            fieldLabel:'Hide label',
                            defaultType:'checkboxfield',
                            items: [
                                {
                                    boxLabel:'Yes',
                                    name:'label',
                                    checked:false,
                                    reference:'checkHideReactionLabel'
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
        },
        /*{
            title: 'upload',
            xtype: 'panel',
            collapsible: true,
            collapsed:true,
            items: [
                {
                    xtype:'menu',
                    width: '100%',
                    margin: '0 0 10 0',
                    floating: false,
                    items: [{
                        text: 'Test loading',
                        reference:'loadTest'
                    }]
                },
                {
                    xtype: 'fieldset',
                    title: 'My Uploader',
                    items: [
                        {
                            xtype: 'filefield',
                            label: "MyPhoto:",
                            name: 'photo',
                            accept: 'image',
                            multiple: true
                        }
                    ]
                },
                {
                    xtype: 'filebutton',
                    multiple: true
                }
            ]
        },*/
        {
            xtype: 'panel',
            //plugins: 'viewport',
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [{
                xtype: 'textfield',
                fieldLabel: 'FileName',
                name: 'fileNames',
                readOnly: true,
                labelAlign: 'top',
                allowBlank: false,
                anchor: '100%',
                submitValue: false
            }, {
                xtype: 'buttonImportImage',
                cls: 'browse-file-button',
                name: 'file',
                anchor: '100%',
                multiple: true,
                hideLabel: true,
                buttonOnly: true,
                buttonText: 'Choose files'
            }]
        }
    ]
});
