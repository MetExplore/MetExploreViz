/**
 * @author MC
 * (a)description class to control contion selection panel and to draw mapping in the mapping story
 */

Ext.define('metExploreViz.view.form.selectMappingForExtraction.SelectMappingForExtractionController', {
	extend: 'Ext.app.ViewController',
	alias: 'controller.form-selectMappingForExtraction-selectMappingForExtraction',

/**
 * Aplies event linsteners to the view
 */
	init:function(){
		var me 		= this,
		viewModel   = me.getViewModel(),
		view      	= me.getView();

		view.on({
			show : function(that){
				var store = Ext.getStore("mappingStore");
				store.filter(function (mapping) {
					console.log(mapping.get("name"));
					return mapping.get("name")!=="None";
				})
			},
			close :  function(that){
				var store = Ext.getStore("mappingStore");
				store.clearFilter();
			}
		});

		view.lookupReference('okButton').on({
			click : function(that){
				if(view.lookupReference('selectMappingForExtraction').getValue() && view.lookupReference('selectMappingForExtraction').getValue()!=="None"){
					var selectedMappings = view.lookupReference('selectMappingForExtraction').getValue();
					var nodesToLinks = _metExploreViz.getSessionById("viz").getD3Data().getNodes()
						.filter(function(node){ return node.mappingDatas.length!==0;})
						.filter(function (node) {
							return node.getMappingDatas()
								.filter(map => selectedMappings.includes(map.getMappingName())).length !==0;
						})
						.map(node => node.getId());
					console.log(nodesToLinks);

					metExploreD3.GraphFunction.keepOnlySubnetwork(nodesToLinks);
				}
				view.close();
			}
		});

		view.lookupReference('cancelButton').on({
			click : function(that){
				view.close();
			}
		});
	}
});