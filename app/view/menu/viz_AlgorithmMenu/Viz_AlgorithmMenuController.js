/**
 * @author Maxime Chazalviel
 * @description Menu controller with Tulip graph algorithms
 */

Ext.define('metExploreViz.view.menu.viz_AlgorithmMenu.Viz_AlgorithmMenuController', {
	extend: 'Ext.app.ViewController',
	alias: 'controller.menu-vizAlgorithmMenu-vizAlgorithmMenu',

	/**
	 * Aplies event linsteners to the view
	 */
	init:function(){
		var me 		= this,
		viewModel   = me.getViewModel(),
		view      	= me.getView();

        view.lookupReference('betweennessCentrality').on({
			click : metExploreD3.GraphFunction.betweennessCentrality,
			scope : me
		});
	}
});