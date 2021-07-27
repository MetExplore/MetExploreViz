/**
 * @author JCG
 * (a)description Window to edit scale for flux
 * fluxScaleEditor
 */
Ext.define('metExploreViz.view.form.fluxScaleEditor.FluxScaleEditor', {
    extend: 'Ext.window.Window',
	alias: 'widget.fluxScaleEditor',
	requires: [
	    "metExploreViz.view.form.fluxScaleEditor.FluxScaleEditorController"
    ],
    controller: "form-fluxScaleEditor-fluxScaleEditor",

    title: 'flux scale editor',
    id: 'fluxScaleEditorID',
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
                },
                {
                    margin: "10 0 10 0",
                    xtype: 'label',
                    html: 'Number :'
                },
                {
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
                },
                {
                    xtype: 'numberfield',
                    html: 'Number :',
                    reference: "numberButton",
                    hidden: false,
                    border: false,
                    cls: "aStyleFormNumber",
                    margin: "5 40 5 10",
                    height:"30px",
                    width:"100px"
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
                    text : 'Close'
                }
            ]
        }
    ]
});
