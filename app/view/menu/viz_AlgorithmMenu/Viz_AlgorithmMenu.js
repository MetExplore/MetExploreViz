/**
 * @author Maxime Chazalviel
 * (a)description Menu with Tulip graph algorithms
 */

Ext.define('metExploreViz.view.menu.viz_AlgorithmMenu.Viz_AlgorithmMenu', {
        extend: 'Ext.menu.Menu', 
        alias: 'widget.vizAlgorithmMenu',
        
        requires: [
            'metExploreViz.view.menu.viz_AlgorithmMenu.Viz_AlgorithmMenuController',
            'metExploreViz.view.menu.viz_AlgorithmMenu.Viz_AlgorithmMenuModel'
        ],

        controller: "menu-vizAlgorithmMenu-vizAlgorithmMenu",
        viewModel: {
            type: "menu-vizAlgorithmMenu-vizAlgorithmMenu"
        },

        items: [
            {
                text: 'Betweenness Centrality',
                reference:'betweennessCentrality',
                iconCls:'betweennessCentrality'
            }
        ]
});

