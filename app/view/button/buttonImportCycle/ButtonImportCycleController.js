/**
 * @author Adrien Rohan
 * Controller class for ButtonImportCycle
 */
Ext.define('metExploreViz.view.button.buttonImportCycle.ButtonImportCycleController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.buttonImportCycle',

    init: function() {
        var me=this,
            viewModel = me.getViewModel(),
            view      = me.getView();

        // Listener which allows opening file manager of client side
        view.lookupReference('importCycleHidden').on({
            change:function(){
                metExploreD3.GraphUtils.handleFileSelect(view.lookupReference('importCycleHidden').fileInputEl.dom, me.loadData);
            },
            scope:me
        });

    },

    /*****************************************************
     * Parse file and map data
     * @param tabTxt : file content
     */
    loadData : function(tabTxt) {
        var data = tabTxt;
        tabTxt = tabTxt.replace(/\r/g, "");
        var lines = tabTxt.split('\n');
        for (var i=0; i<lines.length; i++){
            if (lines[i].length){
                var line = lines[i].split(",");
                var result = metExploreD3.GraphFunction.drawMetaboliteCycle(line);
                if (result === -1){
                    metExploreD3.displayWarning('Cycle not found', 'Some cycles given as input dont exist');
                }
            }
        }
    }
});