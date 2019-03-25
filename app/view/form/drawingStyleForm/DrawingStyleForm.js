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
        border: false,
        items: [
            {
                xtype: 'slider',

                reference:'forceCharge',
                fieldLabel: "Charge :",
                margin:'5 5 5 5',
                width:"80%",
                value: -250,
                increment: 20,
                minValue: -3000,
                maxValue: -50,
                listeners: {
                    changecomplete: function(slider, newValue){
                        var session = _metExploreViz.getSessionById('viz');
                        var force = session.getForce();
                        force.charge(newValue);
                        var anim = metExploreD3.GraphNetwork.isAnimated('viz');
                        if (anim === "true"){
                            force.restart();
                        }
                        this.lastValue = newValue;
                    }
                }
            },
            {
                xtype: 'slider',
                value:6,
                reference:'forceGravity',
                fieldLabel: "Gravity :",
                margin:'5 5 5 5',
                width:"80%",
                increment: 1,
                minValue: 0,
                maxValue: 100,
                listeners: {
                    changecomplete: function(slider, newValue){
                        var session = _metExploreViz.getSessionById('viz');
                        var force = session.getForce();
                        force.gravity(newValue/100);
                        var anim = metExploreD3.GraphNetwork.isAnimated('viz');
                        if (anim === "true"){
                            force.restart();
                        }
                        this.lastValue = newValue;
                    }
                }
            },
            {
                xtype: 'slider',
                reference:'forceLinkDistance',
                fieldLabel: "Link distance :",
                margin:'5 5 5 5',
                width:"80%",
                value:20,
                increment: 1,
                minValue: 0,
                maxValue: 100,
                listeners: {
                    changecomplete: function(slider, newValue){
                        var linkStyle = metExploreD3.getLinkStyle();
                        linkStyle.setSize(newValue);
                        var generalStyle = metExploreD3.getGeneralStyle();
                        var metaboliteStyle = metExploreD3.getMetaboliteStyle();
                        var reactionStyle = metExploreD3.getReactionStyle();

                        var maxDimRea = Math.max(reactionStyle.getWidth(),reactionStyle.getHeight());
                        var maxDimMet = Math.max(metaboliteStyle.getWidth(),metaboliteStyle.getHeight());
                        var maxDim = Math.max(maxDimRea, maxDimMet);
                        // Initiate the D3 force drawing algorithm
                        var session = _metExploreViz.getSessionById('viz');
                        var force = session.getForce();

                        force.linkDistance(function(link){
                            if(link.getSource().getIsSideCompound() || link.getTarget().getIsSideCompound())
                                return linkStyle.getSize()/2+maxDim;
                            else
                                return linkStyle.getSize()+maxDim;
                        });

                        var session = _metExploreViz.getSessionById('viz');
                        var anim = metExploreD3.GraphNetwork.isAnimated('viz');
                        if (anim === "true"){
                            force.restart();
                        }
                        this.lastValue = newValue;

                    }
                }
            },
            {
                xtype: 'slider',
                reference:'forceLinkStrength',
                fieldLabel: "Link strength :",
                margin:'5 5 5 5',
                width:"80%",
                value:10,
                increment: 1,
                minValue: 0,
                maxValue: 1000,
                listeners: {
                    changecomplete: function(slider, newValue){
                        var session = _metExploreViz.getSessionById('viz');
                        var force = session.getForce();

                        force.linkStrength(newValue/100);

                        var session = _metExploreViz.getSessionById('viz');
                        var anim = metExploreD3.GraphNetwork.isAnimated('viz');
                        if (anim === "true"){
                            force.restart();
                        }
                        this.lastValue = newValue;

                    }
                }
            }
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