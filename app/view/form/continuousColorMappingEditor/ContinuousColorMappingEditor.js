/**
 * @author MC
 * (a)description combobox to select condition in mapping
 * continuousColorMappingEditor
 */
Ext.define('metExploreViz.view.form.continuousColorMappingEditor.ContinuousColorMappingEditor', {
    extend: 'Ext.window.Window',
	alias: 'widget.continuousColorMappingEditor',
	requires: [
	    "metExploreViz.view.form.continuousColorMappingEditor.ContinuousColorMappingEditorController"
    ],
    controller: "form-continuousColorMappingEditor-continuousColorMappingEditor",

    title: 'Continuous color scale mapping editor',
    height: "400px",
    maxWidth: 600,
    minWidth: 600,
    x: 100,
    y: 100,
    maxHeight: 365,
    minHeight: 365,
    layout:{
        type:'vbox',
        align:'stretch'
    },
    items: [
        {
            xtype: "panel",
            reference: "scaleEditor",
            height: 165,
            width: 550,
            html: "<svg id='svgScaleEditor' height='170px' width='600px'> </svg>"
        },
        {
            xtype: 'fieldset',
            title: 'Edit color or map value of selected color',
            instructions: 'Edit color or map value of selected color',
            layout:{
                type:'hbox'
            },
            margin: "5 15 5 15",
            items: [
                {
                    margin: "10 0 10 0",
                    xtype: 'label',
                    html: 'Value :'
                },
                {
                    margin: "5 15 5 15",
                    reference: "textfieldValue",
                    xtype: 'numberfield',
                    label: 'Position',
                    value: ''
                },{
                    margin: "10 0 10 0",
                    xtype: 'label',
                    html: 'Color :'
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
                                c.setTooltip("To set the color property, select a slider");
                        },
                        disable: function(c) {
                            c.setTooltip("To set the color property, select a slider");
                        },
                        enable: function(c) {
                            c.setTooltip("");
                        }
                    }
                },{
                    xtype: 'panel',
                    html: 'Color :',
                    reference: "colorButton",
                    hidden: false,
                    border: false,
                    cls: "aStyleFormColor",
                    margin: "5 40 5 10",
                    height:"30px",
                    width:"30px",
                    html: '<input ' +
                        'type="color" ' +
                        'id="html5colorpicker" ' +
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
            xtype: "panel",
            layout:{
                type:'hbox',
                pack : 'end'
            },
            items:[
                {
                    margin: "5 5 5 5",
                    xtype: 'button',
                    reference: 'addButton',
                    text : 'Add'
                },
                {
                    margin: "5 5 5 5",
                    xtype: 'button',
                    reference: 'resetButton',
                    text : 'Reset'
                },
                {
                    margin: "5 5 5 5",
                    xtype: 'button',
                    reference: 'okButton',
                    text : 'OK'
                },
                {
                    margin: "5 15 5 5",
                    xtype: 'button',
                    reference: 'cancelButton',
                    text : 'Cancel'
                }
            ]
        }
    ]
});