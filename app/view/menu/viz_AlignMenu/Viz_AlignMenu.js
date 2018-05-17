/**
 * @author Maxime Chazalviel
 * (a)description Menu export network viz
 */

Ext.define('metExploreViz.view.menu.viz_AlignMenu.Viz_AlignMenu', {
        extend: 'Ext.menu.Menu', 
        alias: 'widget.vizAlignMenu',
        
        requires: [
            'metExploreViz.view.menu.viz_AlignMenu.Viz_AlignMenuController',
            'metExploreViz.view.menu.viz_AlignMenu.Viz_AlignMenuModel'
        ],

        controller: "menu-vizAlignMenu-vizAlignMenu",
        viewModel: {
            type: "menu-vizAlignMenu-vizAlignMenu"
        },

           // <-- submenu by nested config object
        items: [
            {
                text: 'Horizontal alignment',
                reference:'horizontalAlign',
                iconCls:'horizontalalign'
            }, {
                text: 'Vertical alignment',
                reference:'verticalAlign',
                iconCls:'verticalalign'
            }
        ]
});

