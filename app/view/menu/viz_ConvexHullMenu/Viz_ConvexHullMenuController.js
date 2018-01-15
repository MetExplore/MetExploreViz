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
		
		view.on({
			setGeneralStyle : function(){
				var s_GeneralStyle = _metExploreViz.getGeneralStyle();
				if(s_GeneralStyle.isDisplayedConvexhulls()=="Compartments"){
					view.lookupReference('highlightCompartments').setChecked(true);  
					metExploreD3.fireEvent("vizIdDrawing", "enableMakeClusters");
					
					if(s_GeneralStyle.useClusters()){
						Ext.getCmp("vizIdDrawing").lookupReference('makeClusters').setIconCls("unmakeClusters");
						Ext.getCmp("vizIdDrawing").lookupReference('makeClusters').setTooltip('Release force for clusters');
						Ext.getCmp("vizIdDrawing").lookupReference('makeClusters').setText("Unmake clusters");
					}
					else
					{
						Ext.getCmp("vizIdDrawing").lookupReference('makeClusters').setIconCls("makeClusters");
						Ext.getCmp("vizIdDrawing").lookupReference('makeClusters').setTooltip('Make clusters in function of highlighted component');
						Ext.getCmp("vizIdDrawing").lookupReference('makeClusters').setText("Make clusters");
					}
				} 
				else
				{
					if(s_GeneralStyle.isDisplayedConvexhulls()=="Pathways"){
						view.lookupReference('highlightPathways').setChecked(true);  
						metExploreD3.fireEvent("vizIdDrawing", "enableMakeClusters");
						
						if(s_GeneralStyle.useClusters()){
							Ext.getCmp("vizIdDrawing").lookupReference('makeClusters').setIconCls("unmakeClusters");
							Ext.getCmp("vizIdDrawing").lookupReference('makeClusters').setTooltip('Release force for clusters');
							Ext.getCmp("vizIdDrawing").lookupReference('makeClusters').setText("Unmake clusters");
						}
						else
						{
							Ext.getCmp("vizIdDrawing").lookupReference('makeClusters').setIconCls("makeClusters");
							Ext.getCmp("vizIdDrawing").lookupReference('makeClusters').setTooltip('Make clusters in function of highlighted component');
							Ext.getCmp("vizIdDrawing").lookupReference('makeClusters').setText("Make clusters");
						}
					}
					else
					{
						view.lookupReference('highlightCompartments').setChecked(false);  
						view.lookupReference('highlightPathways').setChecked(false);  
						metExploreD3.fireEvent("vizIdDrawing", "disableMakeClusters");

						Ext.getCmp("vizIdDrawing").lookupReference('makeClusters').setIconCls("makeClusters");
						Ext.getCmp("vizIdDrawing").lookupReference('makeClusters').setTooltip('Make clusters in function of highlighted component');
						Ext.getCmp("vizIdDrawing").lookupReference('makeClusters').setText("Make clusters");
					}
				}
			},
			scope:me
		});

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
        var checkboxC=Ext.getCmp('highlightCheckboxCompartments');
        var checkboxP=Ext.getCmp('highlightCheckboxPathways');
        var me 		= this;
        if(item.checked){
            var checkbox = Ext.getCmp('highlightCheckbox'+item.text);
			checkbox.suspendEvent('change');
            checkbox.setValue(true);
            checkbox.resumeEvent('change');
            me.highlightComponents(item.text);

            item.parentMenu.items.items
                .filter(function(anItem){
                    return anItem!=item;
                })
                .forEach(function(anItem){
                    anItem.setChecked(false);
                    var checkboxf = Ext.getCmp('highlightCheckbox'+anItem.text);
                    checkboxf.suspendEvent('change');
                    checkboxf.setValue(false);
                    checkboxf.resumeEvent('change');
                }
            );       
        }
        else
        {
            checkboxC.suspendEvent('change');
            checkboxP.suspendEvent('change');
            checkboxP.setValue(false);
            checkboxC.setValue(false);
            checkboxP.resumeEvent('change');
            checkboxC.resumeEvent('change');
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

		s_GeneralStyle.setDisplayCaption(component);
		metExploreD3.GraphCaption.majCaption();
		
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

		s_GeneralStyle.setDisplayCaption(false);
		metExploreD3.GraphCaption.majCaption();

		metExploreD3.fireEvent("generalStyleForm", "setGeneralStyle");
		metExploreD3.fireEvent("vizIdDrawing", "disableMakeClusters");
	}
});