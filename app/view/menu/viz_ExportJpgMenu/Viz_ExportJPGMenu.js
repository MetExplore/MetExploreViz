/**
 * @author Maxime Chazalviel
 * (a)description Menu export network viz
 */

Ext.define('metExploreViz.view.menu.viz_ExportJPGMenu.Viz_ExportJPGMenu', {
        extend: 'Ext.menu.Menu', 
        alias: 'widget.vizExportJPG',
        
        requires: [
            'metExploreViz.view.menu.viz_ExportJPGMenu.Viz_ExportJPGMenuController',
            'metExploreViz.view.menu.viz_ExportJPGMenu.Viz_ExportJPGMenuModel'
        ],

        controller: "menu-vizExportJPGMenu-vizExportJPGMenu",
        viewModel: {
            type: "menu-vizExportJPGMenu-vizExportJPGMenu"
        },

           // <-- submenu by nested config object
        items: [
            {
                text: 'original resolution',
                reference:'exportJPGX1',
                tooltip:'Export network viz as a png file'
            }, {
                text: 'original resolution * 2',
                reference:'exportJPGX2',
                tooltip:'Export network viz as a png file (resolution * 2)'
            }, {
                text: 'original resolution * 4',
                reference:'exportJPGX4',
                tooltip:'Export network viz as a png file (resolution * 4)'
            }
        ]
});

