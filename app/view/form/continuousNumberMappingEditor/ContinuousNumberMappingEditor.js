/**
 * @author MC
 * (a)description combobox to select condition in mapping
 * continuousNumberMappingEditor
 */
Ext.define('metExploreViz.view.form.continuousNumberMappingEditor.ContinuousNumberMappingEditor', {
    extend: 'Ext.window.Window',
	alias: 'widget.continuousNumberMappingEditor',
	requires: [
	    "metExploreViz.view.form.continuousNumberMappingEditor.ContinuousNumberMappingEditorController"
    ],
    controller: "form-continuousNumberMappingEditor-continuousNumberMappingEditor",

    title: 'Continuous number scale mapping editor',
    height: "400px",
    maxWidth: 600,
    minWidth: 600,
    x: 100,
    y: 100,
    maxHeight: 460,
    minHeight: 460,
    layout:{
        type:'vbox',
        align:'stretch'
    },
    items: [
        {
            xtype: "panel",
            reference: "scaleEditor",
            height: 150,
            width: 550,
            html: "<svg id='svgScaleEditor' height='150' width='600px'> </svg>"
        },
        {
            xtype: 'fieldset',
            title: 'Edit position and value of selected number',
            instructions: 'Edit position and value of selected number',
            layout:{
                type:'hbox'
            },
            margin: "5 15 0 15",
            items: [
                {
                    margin: "10 0 10 0",
                    xtype: 'label',
                    html: 'Position :'
                },
                {
                    margin: "5 15 5 15",
                    xtype: 'textfield',
                    label: 'Position',
                    value: 'Ed Spencer'
                },{
                    margin: "10 0 10 0",
                    xtype: 'label',
                    html: 'Number :'
                },{
                    xtype: 'button',
                    margin: "5 40 5 10",
                    disabled: true,
                    hidden: true,
                    cls: "aStyleFormButton",
                    reference: "disabledButton",
                    border: "1px",
                    text: '',
                    height:"30px",
                    width:"30px",
                    listeners : {
                        render: function(c) {
                            if(c.isDisabled())
                                c.setTooltip("To set the number property, select a slider");
                        },
                        disable: function(c) {
                            c.setTooltip("To set the number property, select a slider");
                        },
                        enable: function(c) {
                            c.setTooltip("");
                        }
                    }
                },{
                    xtype: 'panel',
                    html: 'Number :',
                    reference: "numberButton",
                    hidden: false,
                    border: false,
                    cls: "aStyleFormNumber",
                    margin: "5 40 5 10",
                    height:"30px",
                    width:"30px",
                    html: '<input ' +
                        'type="number" ' +
                        'id="html5numberpicker" ' +
                        'value="#1698ff" ' +
                        'style="width:30px; height:30px;">'
                },
                {
                    margin: "5 15 5 15",
                    xtype: 'button',
                    reference: 'delButton',
                    text: 'Remove'
                }
            ]
        }
        ,
        {
            xtype: 'fieldset',
            margin: "5 15 5 15",
            title: 'Min / Max / Add',
            instructions: 'Min / Max / Add /',
            layout:{
                type:'hbox'
            },
            items: [
                {
                    margin: "10 0 10 0",
                    xtype: 'label',
                    html: 'Min :'
                },
                {
                    margin: "5 15 5 15",
                    xtype: 'textfield',
                    label: 'Min',
                    width: "100px"
                },
                {
                    margin: "10 0 10 0",
                    xtype: 'label',
                    html: 'Max :'
                },
                {
                    margin: "5 15 5 15",
                    xtype: 'textfield',
                    label: 'Max',
                    width: "100px"
                },
                {
                    margin: "5 15 5 15",
                    xtype: 'button',
                    reference: 'addButton',
                    text : 'Add'
                },
                {
                    margin: "5 15 5 15",
                    reference: 'resetButton',
                    xtype: 'button',
                    text : 'Reset'
                }
            ]
        },
        {
            xtype: "panel",
            layout:{
                type:'hbox'
            },
            padding: "0 0 0 460",
            items:[
                {
                    margin: "5 5 5 5",
                    xtype: 'button',
                    reference: 'okButton',
                    text : 'OK'
                },
                {
                    margin: "5 5 5 5",
                    xtype: 'button',
                    reference: 'cancelButton',
                    text : 'Cancel'
                }
            ]
        }
    ]
});