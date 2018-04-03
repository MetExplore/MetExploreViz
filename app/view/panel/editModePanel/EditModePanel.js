Ext.define('metExploreViz.view.panel.editModePanel.EditModePanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.editModePanel',
    requires: [
        "metExploreViz.view.panel.editModePanel.EditModePanelController",
<<<<<<< HEAD
        "metExploreViz.view.form.captionForm.CaptionForm"
=======
        "metExploreViz.view.form.captionForm.CaptionForm",
>>>>>>> EditLabel_Test
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
<<<<<<< HEAD
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
                    listeners: {
                        change: function(newValue, oldValue){
                            this.lastValue = newValue;
                        }
                    }
                },
                {
                    xtype:'fieldcontainer',
                    margin:'5 5 5 5',
                    fieldLabel:'Font style:',
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
                    xtype: "button",
                    text: 'Color',
                    menu: Ext.create('Ext.menu.Menu', {
                        items: [{
                            text: 'Choose a color',
                            menu: Ext.create('Ext.menu.ColorPicker', {
                                value: '000000',
                                listeners: {
                                    select: function(picker, selColor) {
                                        alert(selColor);
                                    }
                                }
                            })
                        }]
                    })
                },*/
                {
                    xtype: 'menuseparator'
                },
                {
                    xtype:'fieldcontainer',
                    margin:'5 5 5 5',
                    fieldLabel:'Font style:',
                    defaultType:'checkboxfield',
                    items: [
                        {
                            boxLabel:'Bold',
                            checked:true,
                            //id:'checkboxBoldFont',
                            reference:'checkBoldFont'
                        },{
                            boxLabel:'Italic',
                            checked:false,
                            //id:'checkboxItalicFont',
                            reference:'checkItalicFont'
                        },{
                            boxLabel:'Underline',
                            checked:false,
                            //id:'checkboxUnderlineFont',
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
=======
    layout:'accordion',
    closable: false,
    region: 'east',
    // hidden:true,
    items: [
        {
            title:'Pathways',
            id:'captionFormPathways',
            xtype:'captionForm'
>>>>>>> EditLabel_Test
        }
    ]
});