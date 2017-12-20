Ext.define('metExploreViz.view.menu.viz_ExtractSubNetworkMenu.Viz_ExtractSubNetworkMenuController', {
	extend: 'Ext.app.ViewController',
	alias: 'controller.menu-vizExtractSubNetworkMenu-vizExtractSubNetworkMenu',

/**
 * Aplies event linsteners to the view
 */
	init:function(){
		var me 		= this,
		viewModel   = me.getViewModel(),
		view      	= me.getView();

		view.lookupReference('keepOnlySubnetworkFromMapping').on({
			click : function(){
                var session = _metExploreViz.getSessionById('viz');
                console.log(session.getNodesMap());
                metExploreD3.GraphFunction.keepOnlySubnetwork(session.getNodesMap());
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