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

        view.lookupReference('highlightPathwaysLink').on({
			click : me.pathwaysOnLinkDrawing,
			scope : me
		});
	},
	checkHandler: function (item, checked){
        var checkboxC=Ext.getCmp('highlightCheckboxCompartments');
        var checkboxP=Ext.getCmp('highlightCheckboxPathways');
        var checkboxLinkP=Ext.getCmp('highlightCheckboxPathwaysLink');

        var me 		= this;
        if(item.checked){
            var checkbox = Ext.getCmp('highlightCheckbox'+item.text);
            checkbox.suspendEvent('change');
            checkbox.setValue(true);
            checkbox.resumeEvent('change');
            me.highlightComponents(item.text);
            Ext.getCmp('comparisonSidePanel').expand();
            Ext.getCmp('captionForm'+item.text).expand();
            item.parentMenu.items.items
                .filter(function(anItem){
                    return anItem!=item && anItem.text!=="PathwaysLink";
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
	pathwaysOnLinkDrawing : function (item, checked){

        var checkboxLinkP=Ext.getCmp('highlightCheckboxPathwaysLink');

        var me 		= this;
        if(item.checked){
            var checkbox = Ext.getCmp('highlightCheckboxPathwaysLink');
            checkbox.suspendEvent('change');
            checkbox.setValue(true);
            checkbox.resumeEvent('change');
            me.highlightPathwaysOnLink();
            Ext.getCmp('comparisonSidePanel').expand();
            Ext.getCmp('captionFormPathways').expand();
        }
        else
        {
            me.hidePathwaysOnLink();
            checkboxLinkP.suspendEvent('change');
            checkboxLinkP.setValue(false);
            checkboxLinkP.resumeEvent('change');
		}


    },
    highlightComponents : function(component){
    	var me 		= this,
		viewModel   = me.getViewModel(),
		view      	= me.getView();

		var s_GeneralStyle = _metExploreViz.getGeneralStyle();

		var activePanel = _MyThisGraphNode.activePanel;
        if(!activePanel) activePanel='viz';
        metExploreD3.applyTolinkedNetwork(
            activePanel,
            function(panelLinked, sessionLinked) {
                metExploreD3.GraphCaption.majCaption(panelLinked);

				s_GeneralStyle.setDisplayConvexhulls(false);
				metExploreD3.GraphLink.displayConvexhulls(panelLinked);
				metExploreD3.GraphNetwork.tick(panelLinked);

				s_GeneralStyle.setDisplayConvexhulls(component);
				metExploreD3.GraphLink.displayConvexhulls(panelLinked);
				metExploreD3.GraphNetwork.tick(panelLinked);

				s_GeneralStyle.setDisplayCaption(component);
				metExploreD3.GraphCaption.majCaption(panelLinked);

            });
        metExploreD3.fireEvent("vizIdDrawing", "enableMakeClusters");

    },
    highlightPathwaysOnLink : function(){

    	var me 		= this,
		viewModel   = me.getViewModel(),
		view      	= me.getView();

		var s_GeneralStyle = _metExploreViz.getGeneralStyle();

		s_GeneralStyle.setDisplayPathwaysOnLinks(true);

		metExploreD3.GraphNetwork.tick(_MyThisGraphNode.activePanel);

		s_GeneralStyle.setDisplayCaption("Pathways");
        metExploreD3.GraphCaption.majCaptionPathwayOnLink();
	},

    hideComponents : function(){

    	var me 		= this,
		viewModel   = me.getViewModel(),
		view      	= me.getView();
		var s_GeneralStyle = _metExploreViz.getGeneralStyle();
		
		s_GeneralStyle.setDisplayConvexhulls(false);

        var activePanel = _MyThisGraphNode.activePanel;
        if(!activePanel) activePanel='viz';
        metExploreD3.applyTolinkedNetwork(
            activePanel,
            function(panelLinked, sessionLinked) {
                metExploreD3.GraphLink.displayConvexhulls(panelLinked);
                metExploreD3.GraphNetwork.tick(panelLinked);

                s_GeneralStyle.setDisplayCaption(false);
                metExploreD3.GraphCaption.majCaption(panelLinked);
            });


		metExploreD3.fireEvent("vizIdDrawing", "disableMakeClusters");
		metExploreD3.fireEvent("vizIdDrawing", "disableMakeClusters");
	},

    hidePathwaysOnLink  : function(){

        var me 		= this,
            viewModel   = me.getViewModel(),
            view      	= me.getView();

        var s_GeneralStyle = _metExploreViz.getGeneralStyle();

        s_GeneralStyle.setDisplayPathwaysOnLinks(false);
        metExploreD3.GraphCaption.majCaptionPathwayOnLink();
	}
});