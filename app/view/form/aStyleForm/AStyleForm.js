/**
 * @author MC
 * @description AStyleForm : Display Settings
 */
Ext.define('metExploreViz.view.form.aStyleForm.AStyleForm', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.aStyleForm',
    requires: [
        "metExploreViz.view.form.aStyleForm.AStyleFormController"
    ],
    controller: "form-aStyleForm-aStyleForm",
    region:'north',
    margin :'0 0 5 0',
    flex:0,
    border:false,
    scrollable:true,
    cls: "aStyleForm",
    layout: {
        type: 'vbox'
    },
    header:{
        referenceHolder: true,
        style:{
            padding:'5px 5px 5px 5px'
        },
        items:[{
            xtype: 'button',
            reference: "numberButton",
            hidden: true,
            cls: "aStyleFormButton",
            // text: '2000',
            html:"<svg width='30px' height='30px'><text id='textNumberButton' font-family='Verdana' font-size='10' text-anchor='middle' x='46%' y='50%' dominant-baseline='middle'></text></svg>",
            height:"30px",
            width:"30px"
        },{
            xtype: 'panel',
            reference: "colorButton",
            hidden: true,
            border: false,
            cls: "aStyleFormColor",
            height:"30px",
            width:"30px",
            html: '<input ' +
                'type="color" ' +
                'id="html5colorpicker" ' +
                'value="#1698ff" ' +
                'style="width:30px; height:30px;">',
            listeners : {
                render: function(c) {
                    var tipColorButton = Ext.create('Ext.tip.ToolTip', {
                        target: c.getEl(),
                        html: '"Color : "',
                        listeners : {
                            beforeshow: function(tooltip) {
                                var color = tooltip.target.el.dom.querySelector("#html5colorpicker").getAttribute("value");
                                tooltip.update(color);
                            }
                        }
                    });
                    c.tip = tipColorButton;
                }
            }

        },{
            xtype: 'button',
            reference: "mappingButton",
            cls: "aStyleFormButton",
            text: '',
            height:"30px",
            width:"30px"
        },{
            xtype: 'button',
            disabled: false,
            cls: "aStyleFormButton",
            reference: "bypassButton",
            border: "1px",
            text: '',
            height:"30px",
            width:"30px",
            listeners : {
                render: function(c) {
                    if(c.isDisabled())
                        c.setTooltip("To override the visual property, select one or more nodes");
                },
                disable: function(c) {
                    c.setTooltip("To override the visual property, select one or more nodes");
                },
                enable: function(c) {
                    c.setTooltip("");
                }
            }
        },{
            xtype: 'panel',
            reference: "colorButtonBypass",
            hidden: true,
            border: false,
            cls: "aStyleFormColor",
            height:"30px",
            width:"30px",
            html: '<div id="colorPromptBypass"><input ' +
                'type="color" ' +
                'id="html5colorpicker" ' +
                'value="#1698ff" ' +
                'disabled=true ' +
                'style="width:30px; height:30px;"></div>'
        },{
            xtype: 'button',
            reference: "numberButtonBypass",
            hidden: true,
            cls: "aStyleFormButton",
            // text: '2000',
            html:"<svg width='30px' height='30px'><text id='textNumberButton' font-family='Verdana' font-size='10' text-anchor='middle' x='46%' y='50%' dominant-baseline='middle'></text></svg>",
            height:"30px",
            width:"30px"
        }],
        titlePosition: 6
    },
    items: [
        {
            xtype: 'form',
            itemId: 'slider',
            bodyStyle: 'background-color:inherit',
            width: "100%",
            top:'10',
            border: false,
            items: [
                {
                    reference: "selectConditionForm",
                    xtype:'selectConditionForm'
                }
            ]
        }
    ]

});
