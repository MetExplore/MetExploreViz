/**
 * @author Maxime Chazalviel
 * (a)description Menu export network viz
 */

Ext.define('metExploreViz.view.menu.viz_ExportPNGMenu.Viz_ExportPNGMenu', {
        extend: 'Ext.menu.Menu', 
        alias: 'widget.vizExportPNG',
        
        requires: [
            'metExploreViz.view.menu.viz_ExportPNGMenu.Viz_ExportPNGMenuController',
            'metExploreViz.view.menu.viz_ExportPNGMenu.Viz_ExportPNGMenuModel'
        ],

        controller: "menu-vizExportPNGMenu-vizExportPNGMenu",
        viewModel: {
            type: "menu-vizExportPNGMenu-vizExportPNGMenu"
        },

           // <-- submenu by nested config object
        items: [
            {
                text: 'original resolution',
                reference:'exportPNGX1',
            }, {
                text: 'original resolution * 2',
                reference:'exportPNGX2',
            }, {
                text: 'original resolution * 4',
                reference:'exportPNGX4',
            }
        ]
});

