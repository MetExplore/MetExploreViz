/**
 * @author JCG
 * (a)description fluxMappingForm : Display flux value caption
 */
Ext.define('metExploreViz.view.form.fluxMappingForm.FluxMappingForm', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.fluxMappingForm',
    requires: [
        "metExploreViz.view.form.fluxMappingForm.FluxMappingFormController",
        "metExploreViz.view.form.fluxMappingForm.FluxMappingFormModel"
    ],
    controller: "form-fluxMappingForm-fluxMappingForm",
    viewModel: {
        type: "form-fluxMappingForm-fluxMappingForm"
    },
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
    disabled: true,
    id: "fluxMappingID",


    items: [
        {
            xtype: 'label',
            html: 'Select file',
            margin: '15 15 5 15'
        },

        {
            border: false,
            xtype:'panel',
            autoScroll: true,
            layout:{
                type:'hbox',
                align:'stretch'
            },
            items: [
                {
                    store: {
                        fields: ['file']
                    },
                    xtype: 'combobox',
                    displayField: 'file',
                    valueField: 'file',
                    queryMode: 'local',
                    editable: false,
                    emptyText: '-- Select file --',
                    margin: '5 5 5 5',
                    width: '100%',
                    anyMatch: true,
                    reference: 'selectFile'
                }
            ]
        },

        {
            xtype: 'label',
            html: 'Select number of value to visualize',
            margin: '15 15 5 15'
        },

        {
            border: false,
            xtype:'panel',
            autoScroll: true,
            layout:{
                type:'hbox',
                align:'stretch'
            },
            items: [
                {
                    store: {
                        fields: ['nbCol'],
                        data: [
                            {'nbCol':'one'},
                            {'nbCol':'two'}
                        ]
                    },
                    xtype: 'combobox',
                    displayField: 'nbCol',
                    valueField: 'nbCol',
                    queryMode: 'local',
                    editable: false,
                    emptyText: '-- Number of value --',
                    margin: '5 5 5 5',
                    width: '100%',
                    anyMatch: true,
                    reference: 'selectColNumber'
                }
            ]
        },

        {
            xtype: 'label',
            html: 'Select condition to visualize',
            margin: '15 15 5 15'
        },

        {
            border: false,
            xtype: 'panel',
            autoScroll: true,
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            items: [
                {
                    store: {
                        fields: ['fluxCond']
                    },
                    xtype: 'combobox',
                    displayField: 'fluxCond',
                    valueField: 'fluxCond',
                    queryMode: 'local',
                    editable: false,
                    emptyText: '-- Select Condition --',
                    margin: '5 5 5 5',
                    width: '100%',
                    anyMatch: true,
                    reference: 'selectConditionFlux'
                }
            ]
        },

        {
            xtype: 'button',
            html: 'Display',
            width: '100%',
            margin: '15 5 5 5',
            reference: 'runFluxVizu'
        },

        {
            xtype: 'panel',
            layout: 'vbox',
            margin: "15 5 5 5",
            items: [
                {
                    flex: 1,
                    html: "<div id='graphDistrib' height='100%' width='100%'></div>"
                }
            ]
        }
    ]
});
