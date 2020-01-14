/**
 * @author MC
 * (a)description class to control contion selection panel and to draw mapping in the mapping story
 */

Ext.define('metExploreViz.view.form.selectMapping.MappingStore', {
	extend: 'Ext.data.Store',
	alias: 'store.MappingStore',
	requires: [
		"metExploreViz.view.form.selectMapping.MappingModel"
	],
	model: 'metExploreViz.view.form.selectMapping.MappingModel',
	storeId: 'mappingStore',
	data: [{name:'None'}],
	listeners: {
		add: function(store, records) {
			// if(store.count()==1)

		}
	}
});