Ext.define('metExploreViz.view.menu.viz_DrawingMenu.Viz_DrawingMenuController', {
	extend: 'Ext.app.ViewController',
	alias: 'controller.menu-vizDrawingMenu-vizDrawingMenu',

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

		view.lookupReference('removeSideCompounds').on({
			click : me.removeSideCompounds,
			scope : me
		});

		view.lookupReference('duplicateSideCompounds').on({
			click : me.duplicateSideCompounds,
			scope : me
		});

		view.lookupReference('vizLayoutMenuID').on({
			setUser : function(){
				if(metExploreD3.Features.isEnabled('layouts', metExploreD3.getUser())){
					view.lookupReference('vizLayoutMenuID').setHidden(false);
				}
				else
				{
					view.lookupReference('vizLayoutMenuID').setHidden(true);
				}
			},
			scope : me
		});

		view.lookupReference('vizAlignMenuID').on({
			setUser : function(){
				if(metExploreD3.Features.isEnabled('align', metExploreD3.getUser())){
					view.lookupReference('vizAlignMenuID').setHidden(false);
				}
				else
				{
					view.lookupReference('vizAlignMenuID').setHidden(true);
				}
			},
            render : function(){
                if(metExploreD3.Features.isEnabled('align', metExploreD3.getUser())){
                    view.lookupReference('vizAlignMenuID').setHidden(false);
                }
                else
                {
                    view.lookupReference('vizAlignMenuID').setHidden(true);
                }
            },
			scope : me
		});

		view.lookupReference('makeClusters').on({
			click : me.makeClusters,
			scope : me
		});

		view.lookupReference('hierarchicalLayout').on({
			click : me.hierarchicalLayout,
			scope : me
		});

		view.lookupReference('unfixAll').on({
			click : me.unfixAll,
			scope : me
		});

		view.on({
			enableMakeClusters : function(){
				this.lookupReference('makeClusters').setDisabled(false);
			},
			scope : me
		});
		view.on({
			disableMakeClusters : function(){
				this.lookupReference('makeClusters').setDisabled(true);
			},
			scope : me
		});
	},
	duplicateSideCompounds : function(){
		metExploreD3.GraphNetwork.duplicateSideCompounds('viz');
	},

	makeClusters : function(){
		var useClusters = metExploreD3.getGeneralStyle().useClusters();
		metExploreD3.getGeneralStyle().setUseClusters(!useClusters);

		if(!useClusters){
			this.getView().lookupReference('makeClusters').setIconCls("unmakeClusters");
			this.getView().lookupReference('makeClusters').setTooltip('Release force for clusters');
			this.getView().lookupReference('makeClusters').setText("Unmake clusters");
		}
		else
		{
			this.getView().lookupReference('makeClusters').setIconCls("makeClusters");
			this.getView().lookupReference('makeClusters').setTooltip('Make clusters in function of highlighted component');
			this.getView().lookupReference('makeClusters').setText("Make clusters");
		}
		var session = _metExploreViz.getSessionById('viz');
		if(metExploreD3.GraphNetwork.isAnimated(session.getId()))
			session.getForce().restart();

	},
	removeSideCompounds : function(){
		metExploreD3.GraphNetwork.removeSideCompounds();
	},
	hierarchicalLayout : function(){
		console.log("--- start hierarchical drawing");
		metExploreD3.GraphFunction.hierarchicalDrawing();
	},
	unfixAll : function(){
		var nodes = d3.select("#viz").select("#D3viz").select("#graphComponent").selectAll("g.node");

		nodes.each(function(node) {
			node.setLocked(false);
			metExploreD3.GraphNode.unfixNode(node);
		});
		
		metExploreD3.GraphNetwork.updateNetwork("viz", _metExploreViz.getSessionById("viz"));
	}
});
