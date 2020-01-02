/**
 * @author MC
 * ButtonImportToNetworkController : Allows network import from a json file
 * This class is the controller for the ButtonImportToNetwork view
 */
Ext.define('metExploreViz.view.button.buttonImportToNetwork.ButtonImportToNetworkController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.buttonImportToNetwork',
   
    init: function() {
		var me=this,
		view      = me.getView();

        // Listener which allows opening file manager of client side
        view.lookupReference('importNetwork').on({
			change: function () {
                var sessions = _metExploreViz.getSessionsSet();
                var accord = Ext.getCmp("comparePanel");
                for (var key in sessions) {
                    if (key != 'viz') {
                        var id = key.replace("-body", "");
                        accord.remove(Ext.getCmp(id));
                    }
                }
                metExploreD3.GraphUtils.handleFileSelect(view.lookupReference('importNetwork').fileInputEl.dom, function(json){
                	// Allows to reload the same file
                	metExploreD3.GraphPanel.refreshPanel(json, function(){
                		view.lookupReference('importNetwork').reset();
					});
                });
			},
            scope : me
		});

		view.on({
			reloadMapping:me.reloadMapping,
			scope:me
		});
	},

    /*****************************************************
     * Close and reload  or not mapping
     * @param bool : reload or not
     */
	reloadMapping : function(bool){
	    if(_metExploreViz.getMappingsLength()!=0){
	    	var component = Ext.getCmp('comparisonSidePanel');
	        if(component!= undefined){
				
				var comboMapping = Ext.getCmp('selectMappingVisu');
				var store = comboMapping.getStore();
				store.loadData([], false);
				comboMapping.clearValue();
	            //take an array to store the object that we will get from the ajax response
				var records = [];
				
				// comboMapping.bindStore(store);
				if(bool){

					var mappings = _metExploreViz.getMappingsSet();
					mappings.forEach(function(mapping){
						records.push(new Ext.data.Record({
		                    name: mapping.getName()
		                }));

						store.each(function(mappingName){
							records.push(new Ext.data.Record({
			                    name: mappingName.getData().name
			                }));
						});
					});

					store.loadData(records, false);
				}        	

                if(store.getCount()==0)
                	comboMapping.setDisabled(true);
	        }
	    }

		var comboCond = Ext.getCmp('selectCondition');
		var addCondition = Ext.getCmp('addCondition');
		var selectConditionType = Ext.getCmp('selectConditionType');
		
		if(addCondition!=undefined && selectCondition!=undefined && selectConditionType!=undefined){					
			comboCond.clearValue();

			addCondition.setDisabled(true);
			addCondition.setTooltip('You must choose a condition to add it');
				
			comboCond.setDisabled(true);
			selectConditionType.setDisabled(true);
		}
	}
});
