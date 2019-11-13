
/**
 * @author MC
 * @description class to control settings or configs
 */

Ext.define('metExploreViz.view.form.allStylesByTypeForm.AllStylesByTypeFormController', {
	extend: 'Ext.app.ViewController',
	alias: 'controller.form-allStylesByTypeForm-allStylesByTypeForm',

	/**
	 * Init function Checks the changes on drawing style
	 */
	init : function() {
		var me 		= this,
		viewModel   = me.getViewModel(),
		view      	= me.getView();

		view.store.data.forEach(function (styleBar) {
			// console.log(me);
			// console.log(view);

			var myPanel = Ext.create('metExploreViz.view.form.aStyleForm.AStyleForm', {
				title: styleBar.title,
				access: styleBar.access,
				biologicalType: styleBar.biologicalType,
				styleType: styleBar.type,
				default: styleBar.default,
				styleName: styleBar.style,
				attrName: styleBar.attr,
				attrType: styleBar.attrType,
				target: styleBar.target
			});
			view.add(myPanel);
			console.log(view);
		});

		view.on(
		{
			afterStyleLoading : me.upadateForm,
			scope:me
		});
	},
    upadateForm : function(panel, func){
		console.log("upadateForm");
		var me = this;
		var view = me.getView();
		Ext.getCmp("metaboliteStyleForm").query("aStyleForm").forEach(function (aStyleForm) {
			metExploreD3.fireEvent(aStyleForm.id, "afterStyleLoading");
		});

	}
});

