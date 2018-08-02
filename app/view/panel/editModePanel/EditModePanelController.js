/**
 * @author Adrien Rohan
 * The editModePanel component's controller
 */
Ext.define('metExploreViz.view.panel.editModePanel.EditModePanelController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.panel-editModePanel-editModePanel',


    /**
     * Applies event listeners to the view
     */
    init:function(){
        var me 		= this,
            viewModel   = me.getViewModel(),
            view      	= me.getView();

        view.on({
            //newMapping : me.drawCaption,
            scope:me
        });

        view.lookupReference('refreshCurve').on({
            click : function()
            {
                var curveBundling = view.lookupReference('EdgeBundling').getValue();
                if (curveBundling == true) {
                    metExploreD3.GraphStyleEdition.curvedPath = true;
                    metExploreD3.GraphStyleEdition.bundleLinks("viz");
                }
                else {
                    metExploreD3.GraphStyleEdition.curvedPath = false;
                    d3.select("#viz").select("#D3viz").select("#graphComponent").selectAll("path.link").attr("marker-end", "none");
                    metExploreD3.GraphCaption.drawCaption();
                    metExploreD3.GraphLink.tick("viz");
                }
            },
            scope : me
        });

    },

    drawCaption : function(){
        metExploreD3.GraphCaption.drawCaption();
    }
});