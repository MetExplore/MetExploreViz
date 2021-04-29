Ext.define('metExploreViz.view.panel.comparisonSidePanel.ComparisonSidePanelController', {
	extend: 'Ext.app.ViewController',
	alias: 'controller.panel-comparisonSidePanel-comparisonSidePanel',

/**
 * Aplies event linsteners to the view
 */
	init:function(){
		var me 		= this,
		viewModel   = me.getViewModel(),
		view      	= me.getView();

		view.on({
			newMapping : me.drawCaption,
			scope:me
		});

		view.on({
			expand : function(){
				var viz = Ext.getCmp('viz');
				if(viz.lookupReference('handcursor').hasCls('focus')){
					metExploreD3.GraphNetwork.moveGraph();
					metExploreD3.GraphNetwork.moveGraph();
				}
			}
		});

		view.on({
			collapse : function(){
				var viz = Ext.getCmp('viz');
				if(viz.lookupReference('handcursor').hasCls('focus')){
					metExploreD3.GraphNetwork.moveGraph();
					metExploreD3.GraphNetwork.moveGraph();
				}
			}
		});
    },

    drawCaption : function(){
        metExploreD3.GraphCaption.drawCaption();
    }
});
