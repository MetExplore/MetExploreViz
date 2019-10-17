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
    autoScroll:true,
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
            html:"<svg width='30px' height='30px'><text id='textNumberButton' font-family='Verdana' font-size='10' text-anchor='middle' x='46%' y='50%' dominant-baseline='middle'>test</text></svg>",
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
                                console.log(tooltip.target.el.dom.querySelector("#html5colorpicker"));
                                console.log(color);
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
            html: '<input ' +
                'type="color" ' +
                'id="html5colorpicker" ' +
                'value="#1698ff" ' +
                'style="width:30px; height:30px;">'
        },{
            xtype: 'button',
            reference: "numberButtonBypass",
            hidden: true,
            cls: "aStyleFormButton",
            html:"<svg width='30px' height='30px'><text id='textNumberButton' font-family='Verdana' font-size='10' text-anchor='middle' x='46%' y='50%' dominant-baseline='middle'>test</text></svg>",
            height:"30px",
            width:"30px"
        }],
        titlePosition: 6
    },
    html: "Mapping",
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
                    xtype: 'box',
                    margin:'15 0 0 0',
                    autoEl: {tag: 'hr'}
                },
                {
                    xtype: 'label',
                    forId: 'myFieldId',
                    html:" <h2>Link</h2> Sets link length\n",
                    margin:'5 5 5 5'
                },
                {
                    xtype: 'slider',
                    reference:'linkDistance',
                    fieldLabel: "Distance :",
                    margin:'5 5 5 15',
                    width:"80%",
                    value: 30,
                    increment: 1,
                    minValue: 0,
                    maxValue: 1000,
                    listeners: {
                        changecomplete: function(slider, newValue){
                            var session = _metExploreViz.getSessionById('viz');
                            var force = session.getForce();
                            force.force("link").distance(newValue);
                            var anim = metExploreD3.GraphNetwork.isAnimated('viz');
                            if (anim === "true"){
                                force.alphaTarget(0.3).restart();
                            }
                            this.lastValue = newValue;
                        }
                    }
                },
                {
                    xtype: 'slider',
                    reference:'linkIterations',
                    fieldLabel: "Iterations :",
                    margin:'5 5 5 15',
                    width:"80%",
                    value: 1,
                    increment: 1,
                    minValue: 1,
                    maxValue: 100,
                    listeners: {
                        changecomplete: function(slider, newValue){
                            var session = _metExploreViz.getSessionById('viz');
                            var force = session.getForce();
                            force.force("link").iterations(newValue);
                            var anim = metExploreD3.GraphNetwork.isAnimated('viz');
                            if (anim === "true"){
                                force.alphaTarget(0.3).restart();
                            }
                            this.lastValue = newValue;
                        }
                    }
                }
                // {
                //     xtype: 'box',
                //     margin:'15 0 15 0',
                //     autoEl: {tag: 'hr'}
                // },{
                //     xtype: 'label',
                //     forId: 'myFieldId',
                //     text: 'Collide',
                //     style: " font-size:20px;",
                //     margin:'15 5 5 5'
                // },
                // {
                //     xtype: 'label',
                //     forId: 'myFieldId',
                //     text: 'Prevents nodes from overlapping',
                //     padding:'5 5 5 5'
                // },
                // {
                //     xtype: 'slider',
                //     value:6,
                //     reference:'forceGravity',
                //     fieldLabel: "Gravity :",
                //     margin:'5 5 5 5',
                //     width:"80%",
                //     increment: 1,
                //     minValue: 0,
                //     maxValue: 100,
                //     listeners: {
                //         changecomplete: function(slider, newValue){
                //             var session = _metExploreViz.getSessionById('viz');
                //             var force = session.getForce();
                //             force.gravity(newValue/100);
                //             var anim = metExploreD3.GraphNetwork.isAnimated('viz');
                //             if (anim === "true"){
                //                 force.alpha(1).restart();
                //             }
                //             this.lastValue = newValue;
                //         }
                //     }
                // },
            ]
        }
    ]

});