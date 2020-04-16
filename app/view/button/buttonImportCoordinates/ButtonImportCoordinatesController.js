/**
 * @author MC
 * ButtonImportCoordinatesController : Allows side compounds import from a tab file
 * This class is the controller for the ButtonImportCoordinates view
 */
Ext.define('metExploreViz.view.button.buttonImportCoordinates.ButtonImportCoordinatesController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.buttonImportCoordinates',
   
    init: function() {
		var me=this,
		view      = me.getView();

        // Listener which allows opening file manager of client side
		view.lookupReference('importCoordinates').on({
			change:function(){
                metExploreD3.GraphUtils.handleFileSelect(view.lookupReference('importCoordinates').fileInputEl.dom, function(json){
                    // Allows to reload the same file
                    metExploreD3.GraphNetwork.refreshCoordinates(json, view.lookupReference('importCoordinates').reset());
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
