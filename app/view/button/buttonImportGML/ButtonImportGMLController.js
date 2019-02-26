/**
 * @author MC
 * ButtonImportCoordinatesController : Allows side compounds import from a tab file
 * This class is the controller for the ButtonImportCoordinates view
 */
Ext.define('metExploreViz.view.button.buttonImportGML.ButtonImportGMLController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.buttonImportGML',
   
    init: function() {
		var me=this,
		view      = me.getView();

        // Listener which allows opening file manager of client side
		view.lookupReference('importGML').on({
			change:function(){
                metExploreD3.GraphUtils.handleFileSelect(view.lookupReference('importGML').fileInputEl.dom, function(gml){
                    // Allows to reload the same file
                    metExploreD3.GraphPanel.refreshCoordinatesFromGML(gml, view.lookupReference('importGML').reset());
                });
			},
			scope:me
		});

	},

	/*****************************************************
	 * Load data from file and launch setting of SC
	 * Parse file and map data
     * @param tabTxt : file content
     */
	loadData : function(tabTxt) {
		tabTxt = tabTxt.replace(/\r/g, "");
	    var sideCompounds = tabTxt.split('\n');
	    var find = metExploreD3.GraphNode.loadCoordinates(sideCompounds);

      	if(find)
	    	metExploreD3.displayMessage("MetExploreViz", "Side compounds are imported!");
	    else	    
	    	metExploreD3.displayMessage("MetExploreViz Warning", "Side compounds not found!");
	
	}
});
