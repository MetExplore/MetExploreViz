
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
				biologicalType: styleBar.biologicalType,
				styleType: styleBar.type,
				default: styleBar.default,
				styleName: styleBar.style,
				attrName: styleBar.attr,
				attrType: styleBar.attrType,
				target: styleBar.target
			});
			view.add(myPanel);
		})
	}
});

