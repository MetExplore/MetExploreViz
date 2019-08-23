Ext.define('metExploreViz.view.menu.viz_ExportJPGMenu.Viz_ExportJPGMenuController', {
	extend: 'Ext.app.ViewController',
	alias: 'controller.menu-vizExportJPGMenu-vizExportJPGMenu',

/**
 * Aplies event linsteners to the view
 */
	init:function(){
		var me 		= this,
		viewModel   = me.getViewModel(),
		view      	= me.getView();

		view.lookupReference('exportJPGX1').on({
			click : function(size){
				metExploreD3.GraphUtils.exportJPG(1);
			},
			scope : me
		});

		view.lookupReference('exportJPGX2').on({
			click : function(size){
				metExploreD3.GraphUtils.exportJPG(2);
			},
			scope : me
		});

		view.lookupReference('exportJPGX4').on({
			click : function(size){
				metExploreD3.GraphUtils.exportJPG(4);
			},
			scope : me
		});
	}
});