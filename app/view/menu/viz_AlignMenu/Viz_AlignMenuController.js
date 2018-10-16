Ext.define('metExploreViz.view.menu.viz_AlignMenu.Viz_AlignMenuController', {
	extend: 'Ext.app.ViewController',
	alias: 'controller.menu-vizAlignMenu-vizAlignMenu',

/**
 * Aplies event linsteners to the view
 */
	init:function(){
		var me 		= this,
		viewModel   = me.getViewModel(),
		view      	= me.getView();

		view.on({
			show: function( menu, e, eOpts){
				if(metExploreD3.GraphStyleEdition.curvedPath)
                	view.lookupReference('wsAlign').show();
				else
                	view.lookupReference('wsAlign').hide();
			},
			scope:me
		});

		view.lookupReference('horizontalAlign').on({
			click :function () {
                metExploreD3.GraphFunction.horizontalAlign("viz");
            },
			scope : me
		});

        view.lookupReference('verticalAlign').on({
            click :function () {
                metExploreD3.GraphFunction.verticalAlign("viz");
            },
			scope : me
		});

        view.lookupReference('wsAlign').on({
            click :function () {
                metExploreD3.GraphFunction.alignWallSource();
            },
			scope : me
		});
	}
});