/**
 * @author JCG
 * (a)description MetaboRankForm : Manage GIR
 */
Ext.define('metExploreViz.view.form.girForm.GirForm', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.girForm',
    requires: [
        "metExploreViz.view.form.girForm.GirFormController"
    ],
    controller: "form-girForm-girForm",
    layout:{
       type:'vbox',
       align:'stretch'
    },
    region:'north',
    width:'100%',
    margins:'0 0 0 0',
    split:true,
    animation: true,
    autoScroll: true,
    autoHeight: true,
    id: "girID",

    items: [
        {
            xtype: 'label',
            html: 'Parameters :',
            margin: '15 15 5 15'
        },

        {
            border: false,
            xtype:'panel',
            layout:{
                type:'hbox',
                align:'stretch'
            },
            items: [
                // {
                //     store: {
                //         fields: ['file']
                //     },
                //     xtype: 'combobox',
                //     displayField: 'file',
                //     valueField: 'file',
                //     queryMode: 'local',
                //     editable: false,
                //     emptyText: '-- Select file --',
                //     margin: '5 5 5 5',
                //     width: '75%',
                //     anyMatch: true,
                //     reference: 'selectFile'
                // },
                {
                    xtype: 'textfield',
                    emptyText: '-- Import file --',
                    margin: '5 5 5 5',
                    width: '75%',
                    reference: 'selectFile',
                    editable: false
                },
                {
                    xtype: 'filefield',
                    buttonOnly: true,
                    buttonText: 'import file',
                    width: '25%',
                    margin: '5 5 5 5',
                    reference: 'loadRankFile'
                }
            ]
        },

        // {
        //     xtype: 'panel',
        //     layout: {
        //         type: 'hbox'
        //     },
        //     reference: 'miBox',
        //     items: [
        //         {
        //             store: {
        //                 fields: ['metabolites']
        //             },
        //             xtype: 'combobox',
        //             displayField: 'metabolites',
        //             valueField: 'metabolites',
        //             queryMode: 'local',
        //             editable: false,
        //             emptyText: '-- Select metabolite --',
        //             margin: '5 5 5 5',
        //             width: '75%',
        //             anyMatch: true,
        //             reference: 'selectStart'
        //         },
        //         {
        //             xtype: 'button',
        //             width: '35px',
        //             margin: '5 5 5 5',
        //             iconCls: 'plus',
        //             reference: 'addMi'
        //         }
        //     ]
        // },
        {
            xtype: 'panel',
            reference: 'miBox',
            width: '50%',
            items: [
                {
                    xtype: 'panel',
                    layout: {
                        type: 'hbox'
                    },
                    reference: 'box1',
                    items: [
                        {
                            store: {
                                fields: ['metabolites']
                            },
                            xtype: 'combobox',
                            displayField: 'metabolites',
                            valueField: 'metabolites',
                            queryMode: 'local',
                            editable: false,
                            emptyText: '-- Select metabolite --',
                            margin: '5 5 5 5',
                            width: '75%',
                            anyMatch: true,
                            reference: 'selectStart1'
                        },
                        {
                            xtype: 'button',
                            width: '35px',
                            margin: '5 5 5 5',
                            iconCls: 'plus',
                            reference: 'addMi'
                        },
                        {
                            xtype: 'button',
                            width: '35px',
                            margin: '5 5 5 5',
                            iconCls: 'minus',
                            reference: 'delMi'
                        }
                    ]
                }
            ]
        },

        {
            xtype: 'panel',
            layout: {
                type: 'hbox'
            },
            items: [
                {
                    xtype: 'button',
                    html: 'launch GIR',
                    width: '50%',
                    margin: '5 5 5 5',
                    reference: 'launchGIR'
                },
                {
                    xtype: 'button',
                    html: 'extract & quit',
                    width: '50%',
                    margin: '5 5 5 5',
                    disabled: true,
                    reference: 'extractNQuit'
                }
            ]
        }

    ]
});
