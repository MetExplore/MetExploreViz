/**
 * @author Maxime Chazalviel
 * (a)description Menu export network viz
 */

Ext.define('metExploreViz.view.menu.viz_ReverseMenu.Viz_ReverseMenu', {
        extend: 'Ext.menu.Menu', 
        alias: 'widget.vizReverseMenu',
        
        requires: [
            'metExploreViz.view.menu.viz_ReverseMenu.Viz_ReverseMenuController',
            'metExploreViz.view.menu.viz_ReverseMenu.Viz_ReverseMenuModel'
        ],

        controller: "menu-vizReverseMenu-vizReverseMenu",
        viewModel: {
            type: "menu-vizReverseMenu-vizReverseMenu"
        },

           // <-- submenu by nested config object
        items: [
            {
                text: 'Reverse horizontally  (Click Alt + H)',
                reference:'horizontalReverse',
                iconCls:'horizontalreverse'
            }, {
                text: 'Reverse vertically  (Click Alt + V)',
                reference:'verticalReverse',
                iconCls:'verticalreverse'
            }
        ]
});

