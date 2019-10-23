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
    // maxHeight: 600,
    minHeight: 450,
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
            title: 'Edit position and value of selected color',
            instructions: 'Edit position and value of selected color',
            layout:{
                type:'hbox'
            },
            margin: "15 15 0 15",
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
                    text: 'Remove'
                }
            ]
        }
        ,
        {
            xtype: 'fieldset',
            margin: "15 15 15 15",
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
                    label: 'Min'
                },
                {
                    margin: "10 0 10 0",
                    xtype: 'label',
                    html: 'Max :'
                },
                {
                    margin: "5 15 5 15",
                    xtype: 'textfield',
                    label: 'Max'
                },
                {
                    margin: "5 15 5 15",
                    xtype: 'button',
                    text : 'Reset'
                }
            ]
        }
    ]
});