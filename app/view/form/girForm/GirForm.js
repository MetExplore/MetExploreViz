/**
 * @author JCG
 * (a)description GirForm : Manage GIR
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
            html: 'Parameters:',
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
                    emptyText: '-- Import metaborank score file --',
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

        {
            xtype: 'panel',
            reference: 'miBox',
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
                            xtype: 'panel',
                            layout: {
                                type: 'hbox'
                            },
                            width: '25%',
                            margin: '5 5 5 5',
                            items: [
                                {
                                    xtype: 'button',
                                    width: '50%',
                                    margin: '0 5 0 5',
                                    iconCls: 'plus',
                                    reference: 'addMi'
                                },
                                {
                                    xtype: 'button',
                                    width: '50%',
                                    margin: '0 5 0 5',
                                    iconCls: 'minus',
                                    reference: 'delMi'
                                }
                            ]
                        }
                    ]
                }
            ]
        },

        {
            xtype: 'button',
            html: 'add / remove starting node(s)',
            reference: 'refreshStart',
            margin: '5 5 5 5',
            hidden: true
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
                    html: 'extract subnetwork & quit GIR',
                    width: '50%',
                    margin: '5 5 5 5',
                    disabled: true,
                    reference: 'extractNQuit'
                }
            ]
        },

        {
            xtype: 'label',
            html: 'Legend :',
            margin: '5 5 5 5'
        },

        {
            xtype: 'label',
            html: '<svg width="600" height="40">'+
                        '<circle cx="30" cy="20" r="10px" style="fill: white; stroke-width: 4px; stroke: red"></circle>'+
                        '<text x="50" y="25"'+
                              'font-size="15">'+
                            'MetaboRank out < 25'+
                        '</text>'+
                    '</svg>'
        },

        {
            xtype: 'label',
            html: '<svg width="600" height="40">'+
                        '<circle cx="30" cy="20" r="10px" style="fill: white; stroke-width: 4px; stroke: green"></circle>'+
                        '<text x="50" y="25"'+
                              'font-size="15">'+
                            'MetaboRank in < 25'+
                        '</text>'+
                    '</svg>'
        },

        {
            xtype: 'label',
            html: '<svg width="600" height="40">'+
                        '<circle cx="30" cy="20" r="10px" style="fill: white; stroke-width: 4px; stroke: purple"></circle>'+
                        '<text x="50" y="25"'+
                              'font-size="15">'+
                            'MetaboRank Out < 25 & MetaboRank In < 25'+
                        '</text>'+
                    '</svg>'
        },

        {
            xtype: 'label',
            html: '<svg width="600" height="40">'+
                        '<circle cx="30" cy="20" r="17px" style="fill: #00aa00; opacity: 0.5"></circle>'+
                        '<circle cx="30" cy="20" r="10px" style="fill: white; stroke-width: 5px; stroke: #00aa00"></circle>'+
                        '<text x="50" y="25"'+
                              'font-size="15">'+
                            'Starting node'+
                        '</text>'+
                    '</svg>'
        },

        {
            xtype: 'label',
            html: '<svg width="600" height="40">'+
                        '<circle cx="30" cy="20" r="10px" style="fill: white; stroke-width: 2px; stroke: black"></circle>'+
                        '<text x="50" y="25"'+
                              'font-size="15">'+
                            'MetaboRank Out > 25 & MetaboRank In > 25'+
                        '</text>'+
                    '</svg>'
        },

        {
            xtype: 'label',
            html: '<svg width="600" height="40">'+
                        '<circle cx="30" cy="20" r="5px" style="fill: white; stroke-width: 3px; stroke: grey"></circle>'+
                        '<text x="50" y="25"'+
                              'font-size="15">'+
                            'Side compounds'+
                        '</text>'+
                    '</svg>'
        },

        {
            xtype: 'label',
            html: '<svg width="600" height="40">'+
                        '<circle cx="30" cy="20" r="10px" style="fill: black; stroke-width: 4px; stroke: green"></circle>'+
                        '<text x="50" y="25"'+
                              'font-size="15">'+
                            'Black background when you visited the node'+
                        '</text>'+
                    '</svg>'
        },

        {
            xtype: 'label',
            html: '<svg width="600" height="40">'+
                        '<circle cx="30" cy="20" r="10px" style="fill: rgb(255, 73, 73); "></circle>'+
                        '<rect height="10px" width="10px" x="30" y="20" style="fill: rgb(255, 73, 73); "></rect>'+
                        '<text x="50" y="25"'+
                              'font-size="15">'+
                            'Number of reactions not expanded from this metabolite'+
                        '</text>'+
                    '</svg>'
        }

    ]
});
