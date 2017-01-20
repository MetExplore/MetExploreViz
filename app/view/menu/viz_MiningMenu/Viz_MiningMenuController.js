Ext.define('metExploreViz.view.menu.viz_MiningMenu.Viz_MiningMenuController', {
	extend: 'Ext.app.ViewController',
	alias: 'controller.menu-vizMiningMenu-vizMiningMenu',

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

	    
		view.lookupReference('highlightSubnetwork').on({
			click : me.highlightSubnetwork,
			scope : me
		});


		view.lookupReference('vizAlgorithmMenuID').on({
			setUser : function(){
				if(metExploreD3.Features.isEnabled('algorithm', metExploreD3.getUser())){
					view.lookupReference('vizAlgorithmMenuID').setHidden(false);
				}
				else
				{
					view.lookupReference('vizAlgorithmMenuID').setHidden(true);
				}
			},
			scope : me
		});
		
		view.lookupReference('highlightSubnetwork').on({
			setUser : function(){
				if(metExploreD3.Features.isEnabled('highlightSubnetwork', metExploreD3.getUser())){
					view.lookupReference('highlightSubnetwork').setHidden(false);
				}
				else
				{
					view.lookupReference('vizAlgorithmMenuID').setHidden(true);
				}
			},
			scope : me
		});
		
		view.lookupReference('keepOnlySubnetwork').on({
			click : me.keepOnlySubnetwork,
			scope : me
		});
	},
	highlightSubnetwork : function(){
		metExploreD3.GraphFunction.highlightSubnetwork();
	},
	keepOnlySubnetwork : function(){
		metExploreD3.GraphFunction.keepOnlySubnetwork();
	}
});