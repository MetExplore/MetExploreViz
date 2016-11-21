Ext.define('metExploreViz.view.menu.viz_HelpMenu.Viz_HelpMenuController', {
	extend: 'Ext.app.ViewController',
	alias: 'controller.menu-vizHelpMenu-vizHelpMenu',

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
     	
		view.lookupReference('documentation').on({
			click : function(){
				window.open('http://metexplore.toulouse.inra.fr/metexploreViz/doc/');
			},
			scope : me
		});

		view.lookupReference('request').on({
			click : function(){
				window.open('http://vm-metexplore-dev.toulouse.inra.fr:3000/MetExplore/MetExploreViz/issues');
			},
			scope : me
		});
	}
});