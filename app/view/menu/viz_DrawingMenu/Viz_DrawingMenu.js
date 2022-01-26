/**
 * @author Fabien Jourdan
 * (a)description Menu to call mapping functions on cytoscape view
 */

Ext.define('metExploreViz.view.menu.viz_DrawingMenu.Viz_DrawingMenu', {
        extend: 'Ext.menu.Menu',
        alias: 'widget.vizDrawingMenu',

        requires: [
            'metExploreViz.view.menu.viz_DrawingMenu.Viz_DrawingMenuController',
            'metExploreViz.view.menu.viz_DrawingMenu.Viz_DrawingMenuModel'
        ],

        controller: "menu-vizDrawingMenu-vizDrawingMenu",
        viewModel: {
            type: "menu-vizDrawingMenu-vizDrawingMenu"
        },

        items:  [
             {
                 text: 'Remove side compounds',
                 reference:'removeSideCompounds',
                 tooltip:'Remove metabolites annotated as side compounds',
                 iconCls:'delete-sideCompounds'
             },
             {
                text: 'Layout',
                scale: 'large',
                menu:{id:'vizIdLayoutMenu',xtype: 'vizLayoutMenu'},
                id:'vizLayoutMenuID',
                reference:'vizLayoutMenuID',
                padding:'0 0 0 0',
                iconCls:'drawhierarchicallayout',
                hidden:true
             },
             {
                text: 'Align',
                scale: 'large',
                menu:{id:'vizIdAlignMenu',xtype: 'vizAlignMenu'},
                id:'vizAlignMenuID',
                reference:'vizAlignMenuID',
                padding:'0 0 0 0',
                iconCls:'horizontalalign',
                hidden:true
             },
             {
                text: 'Reverse',
                scale: 'large',
                menu:{id:'vizIdReverseMenu',xtype: 'vizReverseMenu'},
                id:'vizReverseMenuID',
                reference:'vizReverseMenuID',
                padding:'0 0 0 0',
                iconCls:'horizontalreverse'
             },
             {
                 text: 'Duplicate side compounds',
                 reference:'duplicateSideCompounds',
                 tooltip:'Duplicate metabolites annotated as side compounds',
                 iconCls:'duplicate-sideCompounds'
             },
             {
                text: 'Color',
                scale: 'large',
                menu:{id:'vizIdColorMenu',xtype: 'vizColorMenu'},
                id:'vizColorMenuID',
                reference:'vizColorMenuID',
                padding:'0 0 0 0',
                iconCls:'color'
             },
             {
                text: 'Highlight component',
                scale: 'large',
                menu:{id:'vizIdConvexHullMenu',xtype: 'vizConvexHullMenu'},
                id:'vizConvexHullMenuID',
                reference:'vizConvexHullMenuID',
                padding:'0 0 0 0',
                iconCls:'highlightCompartments'
             },
             {
                 text: 'Make clusters',
                 reference:'makeClusters',
                 tooltip:'Make clusters in function of highlighted component',
                 iconCls:'makeClusters',
                 disabled:true,
                 hidden:true
             },
            {
                text: 'Hierarchical layout',
               // scale: 'large',
               // menu:{id:'hierarchicalLayoutMenu',xtype: 'hierarchicalLayoutMenu'},
              //  id:'hierarchicalLayoutMenuID',
                reference:'hierarchicalLayout',
                tooltip:'Apply hierarchical drawing algorithm on the network',
                iconCls:'hierarchicalDrawing'
              //  padding:'0 0 0 0',
              //  iconCls:'hierarchicalLayoutMenu'
          },
          {
              text: 'Unfix all nodes',
              reference: 'unfixAll',
              tooltip: 'Unfix all nodes in the network',
              iconCls: 'unlock_font_awesome'
          }
        ]
});
