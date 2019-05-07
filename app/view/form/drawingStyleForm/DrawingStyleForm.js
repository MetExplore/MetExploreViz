/**
 * @author MC
 * @description DrawingStyleForm : Display Settings
 */
Ext.define('metExploreViz.view.form.drawingStyleForm.DrawingStyleForm', {
    extend: 'Ext.panel.Panel',  
    alias: 'widget.drawingStyleForm',
    requires: [
        "metExploreViz.view.form.drawingStyleForm.DrawingStyleFormController",
        "metExploreViz.view.form.SelectDisplayReactionLabel",
        "metExploreViz.view.form.SelectDisplayMetaboliteLabel"
    ],
    controller: "form-drawingStyleForm-drawingStyleForm",
    
    region:'north',
    margin :'0 0 0 0',
    flex:1,
    width:'100%',
    border:false,
    autoScroll:true,
    layout: {
        type: 'vbox',
        align: 'stretch'
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
                xtype: 'label',
                forId: 'myFieldId',
                // text: 'Charge',
                html:" <h2>Charge</h2> Attracts (+) or repels (-) nodes to/from each other.\n",
                // style: " font-size:20px;",
                margin:'5 5 5 5',
            },
            {
                xtype: 'slider',

                reference:'chargeStrength',
                fieldLabel: "Strength :",
                margin:'5 5 5 15',
                width:"80%",
                value: -250,
                increment: 10,
                minValue: -1000,
                maxValue: 100,
                listeners: {
                    changecomplete: function(slider, newValue){
                        var session = _metExploreViz.getSessionById('viz');
                        var force = session.getForce();
                        force.force("charge").strength(newValue);
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

                reference:'distanceMin',
                fieldLabel: "Distance Min  :",
                margin:'5 5 5 15',
                width:"80%",
                value: 1,
                increment: 1,
                minValue: 0,
                maxValue: 50,
                listeners: {
                    changecomplete: function(slider, newValue){
                        var session = _metExploreViz.getSessionById('viz');
                        var force = session.getForce();
                        force.force("charge").distanceMin(newValue);
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

                reference:'distanceMax',
                fieldLabel: "Distance Max  :",
                margin:'5 5 5 15',
                width:"80%",
                value: 1000,
                increment: 1,
                minValue: 0,
                maxValue: 2000,
                listeners: {
                    changecomplete: function(slider, newValue){
                        var session = _metExploreViz.getSessionById('viz');
                        var force = session.getForce();
                        force.force("charge").distanceMax(newValue);
                        var anim = metExploreD3.GraphNetwork.isAnimated('viz');
                        if (anim === "true"){
                            force.alphaTarget(0.3).restart();
                        }
                        this.lastValue = newValue;
                    }
                }
            },
            {
                xtype: 'box',
                margin:'15 0 0 0',
                autoEl: {tag: 'hr'}
            },
            {
                xtype: 'label',
                forId: 'myFieldId',
                html:" <h2>Collide</h2> Prevents nodes from overlapping\n",
                margin:'5 5 5 5',
            },
            {
                xtype: 'slider',

                reference:'collideStrength',
                fieldLabel: "Strength :",
                margin:'5 5 5 15',
                width:"80%",
                value: 15,
                increment: 1,
                minValue: 0,
                maxValue: 20,
                listeners: {
                    changecomplete: function(slider, newValue){
                        var session = _metExploreViz.getSessionById('viz');
                        var force = session.getForce();
                        force.force("collide").strength(newValue/10);
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
                reference:'radius',
                fieldLabel: "Radius :",
                margin:'5 5 5 15',
                width:"80%",
                value: 15,
                increment: 1,
                minValue: 0,
                maxValue: 100,
                listeners: {
                    changecomplete: function(slider, newValue){
                        var session = _metExploreViz.getSessionById('viz');
                        var force = session.getForce();
                        force.force("collide").radius(newValue);
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
                reference:'iterationsCollide',
                fieldLabel: "Iterations :",
                margin:'5 5 5 15',
                width:"80%",
                value: 1,
                increment: 1,
                minValue: 1,
                maxValue: 10,
                listeners: {
                    changecomplete: function(slider, newValue){
                        var session = _metExploreViz.getSessionById('viz');
                        var force = session.getForce();
                        force.force("collide").iterations(newValue);
                        var anim = metExploreD3.GraphNetwork.isAnimated('viz');
                        if (anim === "true"){
                            force.alphaTarget(0.3).restart();
                        }
                        this.lastValue = newValue;
                    }
                }
            },
            {
                xtype: 'box',
                margin:'15 0 0 0',
                autoEl: {tag: 'hr'}
            },
            {
                xtype: 'label',
                forId: 'myFieldId',
                html:" <h2>Gravity</h2> Pulls all points towards window center\n",
                margin:'5 5 5 5',
            },
            {
                xtype: 'slider',
                value:6,
                reference:'forceGravity',
                fieldLabel: "Strength :",
                margin:'5 5 5 15',
                width:"80%",
                increment: 1,
                minValue: 0,
                maxValue: 500,
                listeners: {
                    changecomplete: function(slider, newValue){
                        var session = _metExploreViz.getSessionById('viz');
                        var force = session.getForce();
                        force.force("x").strength(newValue/1000);
                        force.force("y").strength(newValue/1000);
                        var anim = metExploreD3.GraphNetwork.isAnimated('viz');
                        if (anim === "true"){
                            force.alpha(1).restart();
                        }
                        this.lastValue = newValue;
                    }
                }
            },
            {
                xtype: 'box',
                margin:'15 0 0 0',
                autoEl: {tag: 'hr'}
            },
            {
                xtype: 'label',
                forId: 'myFieldId',
                html:" <h2>Link</h2> Sets link length\n",
                margin:'5 5 5 5',
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
                maxValue: 100,
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
                maxValue: 10,
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
    // ,
    // {
    //     xtype      : 'fieldcontainer',
    //     fieldLabel : 'Remove from visualisation if reaction threeshold is exceed.',
    //     reference:'chooseDisplayForOpt',
    //     margin:'5 5 5 5',
    //     defaultType: 'checkboxfield',
    //     items: [
    //         {
    //             boxLabel  : 'Name on nodes',
    //             name      : 'display',
    //             inputValue: '1',
    //             checked   : true,
    //             id        : 'name'
    //         }, {
    //             boxLabel  : 'Links',
    //             name      : 'display',
    //             inputValue: '2',
    //             checked   : true,
    //             id        : 'links'
    //         }
    //     ]
    // }
    // ,
    // {
    //     xtype:'button',
    //     iconCls:'refresh',
    //     margin:'5 5 5 0',
    //     reference: 'refreshDrawingConf',
    //     action: 'refreshDrawingConf'
    // }
    ]  
});