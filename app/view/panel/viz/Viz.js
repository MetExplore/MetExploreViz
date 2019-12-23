/**
 * @author MC
 * (a)description 
 */
 Ext.define('metExploreViz.view.panel.viz.Viz', {
    extend: 'Ext.panel.Panel', 
    alias: 'widget.viz',
    requires: [
        'metExploreViz.view.panel.viz.VizController',
        'metExploreViz.view.panel.viz.VizModel'
    ],

    controller: "panel-viz-viz",
    viewModel: {
        type: "panel-viz-viz"
    },
    margins:'0 0 0 0',
	closable: false,
	region:'center',
	height:'100%',
	width:'100%', 
	flex:1,
    split:true,
    tbar: [
         {
             xtype: 'button',
             iconCls:'play',
             align:"right",
             scale   : 'large',
             margin:'5 10 5 0',
             padding:'2 2 2 2',
             reference: 'animation',
             tooltip: "Play /stop animation"
         },
        '-',
        {
            xtype: 'button',
            iconCls:'edgesSelection',
            align:"right",
            scale   : 'large',
            margin:'5 10 5 0',
            padding:'2 2 2 2',
            reference: 'edgesSelection',
            tooltip: "Allows to select edges"
        },
        {
            xtype: 'button',
            iconCls:'metaboliteSelection',
            align:"right",
            scale   : 'large',
            margin:'5 10 5 0',
            padding:'2 2 2 2',
            reference: 'metaboliteSelection',
            tooltip: "Allows to select metabolites"
        },
        {
            xtype: 'button',
            iconCls:'reactionSelection',
            align:"right",
            scale   : 'large',
            margin:'5 10 5 0',
            padding:'2 2 2 2',
            reference: 'reactionSelection',
            tooltip: "Allows to select reactions"
        },
        {
            xtype: 'button',
            iconCls:'fontStyle',
            align:"right",
            scale   : 'large',
            margin:'5 10 5 0',
            padding:'2 2 2 2',
            id:'enterEditMode',
            reference: 'textSelection',
            tooltip: "Allows to select labels"
        },'-',
        {
            xtype: 'button',
            iconCls:'curve',
            align:"right",
            scale   : 'large',
            margin:'5 10 5 0',
            padding:'2 2 2 2',
            reference: 'curve',
            tooltip: "Drawing curvy edges"
        },
        '->',//spliter to shift next component up to end of right
        {
            xtype: 'button',
            iconCls:'rescale',
            align:"right",
            scale   : 'large',
            margin:'5 10 5 0',
            padding:'2 2 2 2',
            reference: 'rescale',
            tooltip: "Fit visualisation with windows"
        },
        '-',
        {
            xtype: 'button',
            iconCls:'handcursor',
            align:"right",
            scale   : 'large',
            margin:'5 10 5 0',
            padding:'2 2 2 2',
            reference: 'handcursor',
            tooltip: "Pan visualisation"
        },{
            xtype: 'button',
            iconCls:'zoomin',
            align:"right",
            scale   : 'large',
            margin:'5 10 5 0',
            padding:'2 2 2 2',
            reference: 'zoomin'
        },{
            xtype: 'button',
            iconCls:'zoomout',
            align:"right",
            scale   : 'large',
            margin:'5 10 5 0',
            padding:'2 2 2 2',
            reference: 'zoomout'
        }
    ],
    layout:{
       type:'vbox',
       align:'stretch',
       pack: 'center'
    }
    // ,
    // items: [
    //     {
    //         xtype: 'panel',
    //         html: '<center><img src="resources/icons/logoViz.png" alt="panoramic image" border="0"></center>'
    //     },
    //     {
    //         xtype: 'panel',
    //         html: '<div style="text-align: center;"">This panel permits to visualize metabolic network.</div>'
    //     }
    // ]
});