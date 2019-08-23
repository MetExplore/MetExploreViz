Ext.define('metExploreViz.view.menu.viz_ExportPNGMenu.Viz_ExportPNGMenuController', {
	extend: 'Ext.app.ViewController',
	alias: 'controller.menu-vizExportPNGMenu-vizExportPNGMenu',

/**
 * Aplies event linsteners to the view
 */
	init:function(){
		var me 		= this,
		viewModel   = me.getViewModel(),
		view      	= me.getView();

		view.lookupReference('exportPNGX1').on({
			click : function(size){
				metExploreD3.GraphUtils.exportPNG(1);
			},
			scope : me
		});

		view.lookupReference('exportPNGX2').on({
			click : function(size){
				metExploreD3.GraphUtils.exportPNG(2);
			},
			scope : me
		});

		view.lookupReference('exportPNGX4').on({
			click : function(size){
				metExploreD3.GraphUtils.exportPNG(4);
			},
			scope : me
		});
	}
});