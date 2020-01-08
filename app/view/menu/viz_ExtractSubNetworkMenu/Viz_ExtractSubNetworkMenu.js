/**
 * @author Maxime Chazalviel
 * (a)description Menu export network viz
 */

Ext.define('metExploreViz.view.menu.viz_ExtractSubNetworkMenu.Viz_ExtractSubNetworkMenu', {
        extend: 'Ext.menu.Menu', 
        alias: 'widget.vizExtractSubNetworkMenu',
        
        requires: [
            'metExploreViz.view.menu.viz_ExtractSubNetworkMenu.Viz_ExtractSubNetworkMenuController',
            'metExploreViz.view.menu.viz_ExtractSubNetworkMenu.Viz_ExtractSubNetworkMenuModel'
        ],

        controller: "menu-vizExtractSubNetworkMenu-vizExtractSubNetworkMenu",
        viewModel: {
            type: "menu-vizExtractSubNetworkMenu-vizExtractSubNetworkMenu"
        },

           // <-- submenu by nested config object
        items: [
            {
                text: 'From Mapping',
                reference:'keepOnlySubnetworkFromMapping'
            }, {
                text: 'From Selection',
                reference:'keepOnlySubnetworkFromSelection'
            }
        ]
});

