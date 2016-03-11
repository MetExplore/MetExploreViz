Ext.define('metExploreViz.view.menu.viz_ConvexHullMenu.Viz_ConvexHullMenuController', {
	extend: 'Ext.app.ViewController',
	alias: 'controller.menu-vizConvexHullMenu-vizConvexHullMenu',

/**
 * Aplies event linsteners to the view
 */
	init:function(){
		var me 		= this,
		viewModel   = me.getViewModel(),
		view      	= me.getView();

		view.lookupReference('highlightCompartments').on({
			click : me.checkHandler,
			scope : me
		});

        view.lookupReference('highlightPathways').on({
			click : me.checkHandler,
			scope : me
		});
	},
	checkHandler: function (item, checked){
        var me 		= this;
        if(item.checked){
        	me.highlightComponents(item.text);
        	item.parentMenu.items.items
                .filter(function(anItem){
                    return anItem!=item;
                })  
                .forEach(function(anItem){
                    anItem.setChecked(false);
                }
            );       
        }
        else
        {
        	me.hideComponents();
        }
    },
    highlightComponents : function(component){

    	var me 		= this,
		viewModel   = me.getViewModel(),
		view      	= me.getView();

		var s_GeneralStyle = _metExploreViz.getGeneralStyle();
		
		s_GeneralStyle.setDisplayConvexhulls(false);
		metExploreD3.GraphLink.displayConvexhulls('viz');
		metExploreD3.GraphNetwork.tick('viz');	

		s_GeneralStyle.setDisplayConvexhulls(component);
		metExploreD3.GraphLink.displayConvexhulls('viz');
		metExploreD3.GraphNetwork.tick('viz');	
		metExploreD3.fireEvent("vizIdDrawing", "enableMakeClusters");
	},
    hideComponents : function(){

    	var me 		= this,
		viewModel   = me.getViewModel(),
		view      	= me.getView();

		var s_GeneralStyle = _metExploreViz.getGeneralStyle();
		
		s_GeneralStyle.setDisplayConvexhulls(false);
		metExploreD3.GraphLink.displayConvexhulls('viz');
		metExploreD3.GraphNetwork.tick('viz');	
		metExploreD3.fireEvent("generalStyleForm", "setGeneralStyle");
		metExploreD3.fireEvent("vizIdDrawing", "disableMakeClusters");
	}
});