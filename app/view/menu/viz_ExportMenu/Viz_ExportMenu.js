/**
 * @author Fabien Jourdan
 * (a)description Menu export network viz
 */

Ext.define('metExploreViz.view.menu.viz_ExportMenu.Viz_ExportMenu', {
        extend: 'Ext.menu.Menu', 
        alias: 'widget.vizExportMenu',
        
        requires: [
            'metExploreViz.view.menu.viz_ExportMenu.Viz_ExportMenuController',
            'metExploreViz.view.menu.viz_ExportMenu.Viz_ExportMenuModel',

        ],

        controller: "menu-vizExportMenu-vizExportMenu",
        viewModel: {
            type: "menu-vizExportMenu-vizExportMenu"
        },
        
        items:  [
             {
                 text: 'Export Viz as svg',
                 reference:'exportSVG',
                 tooltip:'Export network viz as a svg file',
                 iconCls:'exportSvg'
                },
            {
                text: 'Export Viz as png',
                scale: 'large',
                menu:{id:'vizExportPNG',xtype: 'vizExportPNG'},
                id:'vizExportPNGID',
                reference:'vizExportPNGID',
                padding:'0 0 0 0',
                iconCls:'exportPng',
                tooltip:'Export network viz as a png file'
            },
            {
                text: 'Export Viz as jpeg',
                scale: 'large',
                menu:{id:'vizExportJPG',xtype: 'vizExportJPG'},
                id:'vizExportJPGID',
                reference:'vizExportJPGID',
                padding:'0 0 0 0',
                iconCls:'exportJpg',
                tooltip:'Export network viz as a jpeg file'
            }
            // ,
            //     {
            //      text: 'Export Comparison of Condition',
            //      reference:'exportComparison',
            //      tooltip:'Export Comparison of Condition as a png file',
            //      iconCls:'exportComparePng'
            //     }
        ]
});

