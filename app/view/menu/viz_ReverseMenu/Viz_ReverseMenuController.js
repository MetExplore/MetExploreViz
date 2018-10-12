Ext.define('metExploreViz.view.menu.viz_ReverseMenu.Viz_ReverseMenuController', {
	extend: 'Ext.app.ViewController',
	alias: 'controller.menu-vizReverseMenu-vizReverseMenu',

/**
 * Aplies event linsteners to the view
 */
	init:function(){
		var me 		= this,
		viewModel   = me.getViewModel(),
		view      	= me.getView();
		
		view.lookupReference('horizontalReverse').on({
			click :function () {
                metExploreD3.GraphFunction.horizontalReverse("viz");
            },
			scope : me
		});

        view.lookupReference('verticalReverse').on({
            click :function () {
                metExploreD3.GraphFunction.verticalReverse("viz");
            },
			scope : me
		});
	}
});