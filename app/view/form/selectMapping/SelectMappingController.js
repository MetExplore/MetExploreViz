/**
 * @author MC
 * (a)description class to control contion selection panel
 * C_SelectMapping
 */

Ext.define('metExploreViz.view.form.selectMapping.SelectMappingController', {
	extend: 'Ext.app.ViewController',
	alias: 'controller.form-selectMapping-selectMapping',

	/**
	 * Aplies event linsteners to the view
	 */
	init:function(){
		var me 		= this,
		view      	= me.getView();

		view.on({
			jsonmapping : function(mappingJSON){
				me.initMapping(mappingJSON);
			},
			scope:me
		});
	},

	initMapping:function(mappingJSON){
		var me 		= this,
			view      	= me.getView();

		if(_metExploreViz.getMappingsLength()!==0 ){
			var component = Ext.getCmp('comparisonSidePanel');
	        if(component){
	        	if(component.isHidden())
	           		component.setHidden(false);
				component.expand();

				var store = Ext.getStore("mappingStore");

				store.add({name: mappingJSON.getName()});
				//
	            // //take an array to store the object that we will get from the ajax response
				// var records = [];
				//
				// records.push(new Ext.data.Record({
                //     name: mappingJSON.getName()
                // }));
				//
				// store.each(function(mappingName){
				// 	records.push(new Ext.data.Record({
	            //         name: mappingName.getData().name
	            //     }));
				// });
				// store.loadData(records, false);

				var comboMapping = view;
                if(store.getCount()===1)
                	comboMapping.setDisabled(false);
	        }
	    }
	}
});