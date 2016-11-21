/**
 * @author Fabien Jourdan
 * @description Menu export network viz
 */

Ext.define('metExploreViz.view.menu.viz_HelpMenu.Viz_HelpMenu', {
    extend: 'Ext.menu.Menu', 
    alias: 'widget.vizHelpMenu',
    
    requires: [
        'metExploreViz.view.menu.viz_HelpMenu.Viz_HelpMenuController',
        'metExploreViz.view.menu.viz_HelpMenu.Viz_HelpMenuModel'
    ],

    controller: "menu-vizHelpMenu-vizHelpMenu",
    viewModel: {
        type: "menu-vizHelpMenu-vizHelpMenu"
    },
   
    items:  [
        {
            text: 'Documentation',
            reference:'documentation',
            tooltip:'Link to MetExploreViz website',
            iconCls:'documentation'
        },
        {
            text: 'Request',
            reference:'request',
            tooltip:'Write request to MetExploreViz developers',
            iconCls:'help'
        }
    ]
});

