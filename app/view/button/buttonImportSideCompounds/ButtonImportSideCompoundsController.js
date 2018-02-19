/**
 * @author MC
 * ButtonImportSideCompoundsController : Allows side compounds import from a tab file
 * This class is the controller for the ButtonImportSideCompounds view
 */
Ext.define('metExploreViz.view.button.buttonImportSideCompounds.ButtonImportSideCompoundsController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.buttonImportSideCompounds',
   
    init: function() {
		var me=this,
		viewModel = me.getViewModel(),
		view      = me.getView();

        // Listener which allows opening file manager of client side
		view.lookupReference('importSideCompoundsHidden').on({
			change:function(){
				metExploreD3.GraphUtils.handleFileSelect(view.lookupReference('importSideCompoundsHidden').fileInputEl.dom, me.loadData);
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
	    var find = metExploreD3.GraphNode.loadSideCompounds(sideCompounds);

      	if(find)
	    	metExploreD3.displayMessage("MetExploreViz", "Side compounds are imported!");
	    else	    
	    	metExploreD3.displayMessage("MetExploreViz Warning", "Side compounds not found!");
	
	}
});
