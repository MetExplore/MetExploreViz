Ext.define('metExploreViz.view.menu.viz_SaveMenu.Viz_SaveMenuController', {
	extend: 'Ext.app.ViewController',
	alias: 'controller.menu-vizSaveMenu-vizSaveMenu',

/**
 * Aplies event linsteners to the view
 */
	init:function(){
		var me 		= this,
		viewModel   = me.getViewModel(),
		view      	= me.getView();
		
		view.on({
			mouseleave: function( menu, e, eOpts){
				menu.hide();
			},
	  		scope:me
     	});
     	
		view.lookupReference('exportJSON').on({
			click : me.exportJSON,
			scope : me
		});

		view.lookupReference('exportCoordinates').on({
			click : me.exportCoordinates,
			scope : me
		});

		view.lookupReference('exportCycles').on({
			click : me.exportCycles,
			scope : me
		});

		view.lookupReference('exportDOT').on({
			click : me.exportDOT,
			scope : me
		});

		view.lookupReference('exportGML').on({
			click : me.exportGML,
			scope : me
		});
	},
    exportCoordinates : function(){
		metExploreD3.GraphUtils.saveNetworkCoordinates();
	},
	exportDOT : function(){
		metExploreD3.GraphUtils.saveNetworkDot();
	},
	exportGML : function(){
		metExploreD3.GraphUtils.saveNetworkGml();
	},
	exportJSON : function(){
		metExploreD3.GraphUtils.saveNetworkJSON();
	},
	exportCycles : function () {
		metExploreD3.GraphUtils.saveCyclesList();
    }
});