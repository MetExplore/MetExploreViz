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
            html: 'Select file :',
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
            html: 'Select number of value to visualize :',
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
            html: 'Select condition to visualize :',
            margin: '15 15 5 15'
        },

        {
            xtype: 'label',
            html: 'First condition',
            margin: '5 15 5 15',
            hidden: true,
            reference: 'firstConditionLabel'
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
                    width: '90%',
                    anyMatch: true,
                    reference: 'selectConditionFlux'
                },
                {
                    xtype: 'panel',
                    reference: "colorFirstCondition",
                    border: false,
                    margin: "5 5 5 5",
                    cls: "aStyleFormColor",
                    height:"30px",
                    width:"30px",
                    html: '<input ' +
                        'type="color" ' +
                        'id="html5colorpickerFlux1" ' +
                        'value="#0000ff" ' +
                        'style="width:30px; height:30px;">'
                }
            ]
        },

        {
            xtype: 'label',
            html: 'Second condition',
            margin: '5 15 5 15',
            hidden: true,
            reference: 'secondConditionLabel'
        },

        {
            border: false,
            xtype: 'panel',
            autoScroll: true,
            hidden: true,
            reference: 'secondConditionBox',
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
                    width: '90%',
                    anyMatch: true,
                    reference: 'selectConditionFlux2'
                },
                {
                    xtype: 'panel',
                    reference: "colorSecondCondition",
                    margin: "5 5 5 5",
                    border: false,
                    cls: "aStyleFormColor",
                    height:"30px",
                    width:"30px",
                    html: '<input ' +
                        'type="color" ' +
                        'id="html5colorpickerFlux2" ' +
                        'value="#ff0000" ' +
                        'style="width:30px; height:30px;">'
                }
            ]
        },

        {
            xtype: 'checkboxfield',
            boxLabel: 'Distribution graph : only display data',
            reference: 'displayGraphDistrib',
            margin: '5 5 5 5'
        },

        {
            xtype: 'checkboxfield',
            boxLabel: 'Add flux values on network',
            margin: '0 0 0 5',
            reference: 'addValueNetwork'
        },

        {
            xtype: 'textfield',
            value: '10',
            fieldLabel: 'Font size ',
            scale: 'large',
            hidden: true,
            reference: 'fontSize',
            margin: '5 5 5 5',
            enableKeyEvents: true
        },

        {
            border: false,
            xtype: 'panel',
            autoScroll: true,
            hidden: true,
            reference: 'selectLabel',
            layout: {
                type: 'hbox',
                align: 'stretch'
                    },
            items: [
                {
                    store: {
                        fields: ['labels'],
                        data: [
                            {"labels":"Reaction Name"},
                            {"labels":"Reaction Identifier"},
                            {"labels":"None"}
                        ]
                    },
                    xtype: 'combobox',
                    fieldLabel: 'Label ',
                    displayField: 'labels',
                    valueField: 'labels',
                    queryMode: 'local',
                    editable: false,
                    emptyText: '-- Select Label --',
                    value: 'Reaction Name',
                    margin: '5 5 5 5',
                    width: '100%',
                    anyMatch: true,
                    reference: 'selectLabelDisplayed'
                }]
        },

        {
            xtype: 'panel',
            layout: {
                type: 'hbox'
            },
            items: [
                {
                    xtype: 'button',
                    html: 'Display',
                    width: '75%',
                    margin: '5 5 5 5',
                    reference: 'runFluxVizu'
                },
                {
                    xtype: 'button',
                    html: 'Refresh',
                    width: '25%',
                    margin: '5 5 5 5',
                    reference: 'runNewParams',
                    disabled: true
                }
            ]
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
