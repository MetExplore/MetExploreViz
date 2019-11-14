
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

			var myPanel = Ext.create('metExploreViz.view.form.aStyleForm.AStyleForm', {
				title: styleBar.title,
				access: styleBar.access,
				biologicalType: styleBar.biologicalType,
				styleType: styleBar.type,
				default: styleBar.default,
				min: styleBar.min,
				max: styleBar.max,
				styleName: styleBar.style,
				attrName: styleBar.attr,
				attrType: styleBar.attrType,
				target: styleBar.target
			});
			view.add(myPanel);
		});

		view.on(
		{
			afterStyleLoading : me.updateForm,
			updateSelectionSet : me.updateSelection,
			scope:me
		});
	},
    updateForm : function(){
		var me = this;
		var view = me.getView();
		if(view)
		{
			view.query("aStyleForm").forEach(function (aStyleForm) {
				metExploreD3.fireEvent(aStyleForm.id, "afterStyleLoading");
			});
		}
	},
	updateSelection : function(){
		var me = this;
		var view = me.getView();
		if(view)
		{
			if(view.rendered)
			{
				view.query("aStyleForm").forEach(function (aStyleForm) {
					metExploreD3.fireEvent(aStyleForm.id, "updateSelectionSet");
				});
			}
		}
	}
});

