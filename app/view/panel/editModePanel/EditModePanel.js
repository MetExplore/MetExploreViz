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
    //layout:'accordion',
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
                        ['sans-serif', 'sans-serif'],
                        ['Times', 'Times'],
                        ['Helvetica', 'Helvetica']
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
                /*{
                    xtype: 'colorpicker',
                    value: '993300',
                    width: 500,
                    height: 500,
                    listeners: {
                        select: function(picker, selColor) {
                            alert(selColor);
                        }
                    }
                },*/
                /*{
                    xtype: 'pickerfield',
                    requires: [
                        'Ext.picker.Color'
                    ],
                    editable: false,
                    colorPicker: null,
                    value: 'FFFFFF',
                    createPicker: function () {
                        console.log('ok');
                        var me = this,
                            picker;
                        picker = Ext.create('Ext.picker.Color', {
                            value: me.getValue(),
                            renderTo: me.el.up(),
                            listeners: {
                                select: {
                                    fn: me.onColorPickerChange,
                                    scope: me
                                }
                            }
                        });
                        return me.colorPicker = picker;
                    },
                    onColorPickerChange: function (colorPicker, color) {
                        this.setValue(color);
                        this.inputEl.setStyle({
                            backgroundColor: '#' + color
                        });
                    }
                },*/
                /*{
                    xtype: 'menu',
                    //width: 300,
                    margin: '0 0 0 0',
                    floating: false,  // usually you want this set to True (default)
                    items: [{
                        text: 'Choose a color',
                        menu: {
                            xtype: 'colormenu',
                            value: '000000'
                        }
                    }]
                },*/
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
                        ['sans-serif', 'sans-serif'],
                        ['Times', 'Times'],
                        ['Helvetica', 'Helvetica']
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
                        ['sans-serif', 'sans-serif'],
                        ['Times', 'Times'],
                        ['Helvetica', 'Helvetica']
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
        /*{
            xtype: 'panel',
            title: 'Color Picker Components',
            bodyPadding: 5,
            frame: true,
            resizable: true,
            width: 600,
            minWidth: 550,
            layout: {
                type: 'vbox',
                align: 'stretch'
            },

            viewModel: {
                data: {
                    color: '#0f0',
                    full: false
                }
            },

            header: {
                items: [{
                    xtype: 'component',
                    cls: 'x-panel-header-title-default-framed',
                    html: 'colorbutton &#8680;'
                },{
                    xtype: 'colorbutton',
                    bind: '{color}',
                    width: 15,
                    height: 15,
                    listeners: {
                        change: function(picker) {
                            console.log(picker.getId() + '.color: ' + picker.getValue());
                        }
                    }
                }]
            },

            items: [{
                xtype: 'colorfield',
                fieldLabel: 'Color Field',
                labelWidth: 75,
                bind: '{color}',
                listeners: {
                    change: function(picker) {
                        console.log(picker.getId() + '.color: ' + picker.getValue());
                    }
                }
            },{
                xtype: 'colorselector',
                hidden: true,
                flex: 1,
                bind: {
                    value: '{color}',
                    visible: '{full}'
                }
            }],

            buttons: [{
                text: 'Show colorselector &gt;&gt;',
                bind: {
                    visible: '{!full}'
                },
                value: true,
                listeners: {
                    click: function (button) {
                        this.getViewModel().set('full', button.value);
                    }
                }
            },{
                text: 'Hide colorselector &lt;&lt;',
                bind: {
                    visible: '{full}'
                },
                value: false,
                listeners: {
                    click: function (button) {
                        this.getViewModel().set('full', button.value);
                    }
                }
            }]
        },*/
    ]
});
