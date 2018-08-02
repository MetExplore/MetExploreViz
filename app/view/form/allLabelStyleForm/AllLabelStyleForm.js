/**
 * @author Adrien Rohan
 * Display label style edition option for all nodes
 */
Ext.define('metExploreViz.view.form.allLabelStyleForm.AllLabelStyleForm', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.allLabelStyleForm',
    requires: [
        "metExploreViz.view.form.allLabelStyleForm.AllLabelStyleFormController"
    ],
    controller: "form-allLabelStyleForm-allLabelStyleForm",

    region:'north',
    height: '100%',
    width:'100%',
    margin:'0 0 0 0',
    flex:1,
    border:false,
    autoScroll:true,
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    items: [
        {
            xtype: 'combo',
            reference: 'chooseFontType',
            fieldLabel: 'Font type:',
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
                    reference:'checkBoldFont'
                },{
                    boxLabel:'Italic',
                    checked:false,
                    reference:'checkItalicFont'
                },{
                    boxLabel:'Underline',
                    checked:false,
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
});