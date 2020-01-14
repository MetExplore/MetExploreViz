Ext.define('metExploreViz.view.menu.viz_ExtractSubNetworkMenu.Viz_ExtractSubNetworkMenuController', {
	extend: 'Ext.app.ViewController',
	alias: 'controller.menu-vizExtractSubNetworkMenu-vizExtractSubNetworkMenu',
	requires: [
		"metExploreViz.view.form.selectMappingForExtraction.SelectMappingForExtraction"
	],
/**
 * Aplies event linsteners to the view
 */
	init:function(){
		var me 		= this,
		viewModel   = me.getViewModel(),
		view      	= me.getView();
	var win =
		view.lookupReference('keepOnlySubnetworkFromMapping').on({
			click : function(){

				var win = Ext.create("metExploreViz.view.form.selectMappingForExtraction.SelectMappingForExtraction");

				win.show();

			},
			scope : me
		});

        view.lookupReference('keepOnlySubnetworkFromSelection').on({
			click : function () {
                var session = _metExploreViz.getSessionById('viz');
                metExploreD3.GraphFunction.keepOnlySubnetwork(session.getSelectedNodes());
            },
			scope : me
		});
	}
});