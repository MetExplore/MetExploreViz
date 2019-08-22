/**
 * @author Fabien Jourdan
 * (a)description Menu export network viz
 */

Ext.define('metExploreViz.view.menu.viz_LoadMenu.Viz_LoadMenu', {
    extend: 'Ext.menu.Menu', 
    alias: 'widget.vizLoadMenu',
    
    requires: [
        'metExploreViz.view.menu.viz_LoadMenu.Viz_LoadMenuController',
        'metExploreViz.view.menu.viz_LoadMenu.Viz_LoadMenuModel'
    ],

    controller: "menu-vizLoadMenu-vizLoadMenu",
    viewModel: {
        type: "menu-vizLoadMenu-vizLoadMenu"
    },
    id:"viz_LoadMenu",
    items:  [
        {
            text: 'Load network from saved session',
            reference:'loadNetworkFromJSON',
            tooltip:'Load network from saved session',
            iconCls:'importToRsxFromJSON'
        }
        ,
        {
            text: 'Load network from website selection',
            reference:'loadNetworkFromWebsite',
            tooltip:'Load network from website selection',
            iconCls:'importToRsxFromWS',
            disabled:true,
            hidden:false
        }
    ]
});

