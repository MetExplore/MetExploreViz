/**
 * @author Fabien Jourdan
 * (a)description Menu to call graph algorithms on Cytoscape network
 */

Ext.define('metExploreViz.view.menu.viz_MiningMenu.Viz_MiningMenu', {
        extend: 'Ext.menu.Menu', 
        alias: 'widget.vizMiningMenu',
        
        requires: [
            'metExploreViz.view.menu.viz_MiningMenu.Viz_MiningMenuController',
            'metExploreViz.view.menu.viz_MiningMenu.Viz_MiningMenuModel'
        ],

        controller: "menu-vizMiningMenu-vizMiningMenu",
        viewModel: {
            type: "menu-vizMiningMenu-vizMiningMenu"
        },

        items:  [
             {
                text: 'Algorithm', 
                scale: 'large',
                menu:{id:'vizIdAlgorithmMenu',xtype: 'vizAlgorithmMenu'},
                id:'vizAlgorithmMenuID',
                reference:'vizAlgorithmMenuID',
                padding:'0 0 0 0',
                iconCls:'algorithm',
                hidden:true
             },
            {
                text: 'Highlight Subnetwork',
                reference :'highlightSubnetwork',
                id :'highlightSubnetwork',
                tooltip:'Highlight sub-network based on node selection or mapped nodes',
                iconCls:'highlightSubnetwork',
                hidden:true
            },
            {
                text: 'Highlight sink',
                reference :'highlightSink',
                id :'highlightSink',
                tooltip:'Highlight Sink',
                iconCls:'highlightSink'
            },
            {
                text: 'Highlight source',
                reference :'highlightSource',
                id :'highlightSource',
                tooltip:'Highlight Source',
                iconCls:'highlightSource'
            },{
                text: 'Extract Subnetwork',
                scale: 'large',
                menu:{id:'vizIdExtractSubNetworkMenu',xtype: 'vizExtractSubNetworkMenu'},
                id:'vizExtractSubNetworkID',
                reference:'vizExtractSubNetworkID',
                padding:'0 0 0 0',
                iconCls:'subnetwork',
                tooltip:'Extract sub-network based on node selection or node mapping'
            }
            //  {
            //     text: 'Extract Subnetwork',action:'subnetwork',tooltip:'Extract sub-network based on node selection',iconCls:'subnetwork',
            //  },
            //  '-',
            // {
            //     text: 'Make Acyclic',action:'makeAcyclic',tooltip:'Delete edges to get an acyclic network',iconCls:'makeAcyclic',
            //  },

        ]
});