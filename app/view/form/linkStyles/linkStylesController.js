/**
 * @author MC
 * (a)description class to control contion selection panel and to draw mapping in the mapping story
 */

Ext.define('metExploreViz.view.form.linkStyles.LinkStylesController', {
	extend: 'Ext.app.ViewController',
	alias: 'controller.form-linkStyles-linkStyles',

/**
 * Aplies event linsteners to the view
 */
	init:function(){
		var me 		= this,
		viewModel   = me.getViewModel(),
		view      	= me.getView();

		view.lookupReference('okButton').on({
			click : function(){
				me.setLinkedStyles(view.lookupReference('selectStyles').getValue());
				view.close();
			},
			scope:me
		});

		view.lookupReference('cancelButton').on({
			click : function(that){
				view.close();
			},
			scope:me
		});

		view.lookupReference('selectStyles').on({
			beforerender: function(c) {
				var bioStyleForm = Ext.getCmp(view.aStyleFormParent.biologicalType+"StyleForm");

				var scales = [];
				var partOfAllScales = bioStyleForm.query("aStyleForm")
					.map(function (aStyleForm) {
						return aStyleForm.title;
					})
					.filter(function (aStyleFormTitle) {
						return aStyleFormTitle!==view.aStyleFormParent.title;
					});

				scales = scales.concat(partOfAllScales);
				view.lookupReference('selectStyles').setStore(scales);

				var linkedStyles = view.aStyleFormParent.linkedStyles;

				if(linkedStyles.length>0) {
					view.lookupReference('selectStyles').setValue(linkedStyles);
				}
			},
			scope:me
		});
	},

	updateFocus : function(aStyleForm){
		var me = this,
			view = me.getView();

		var linkedStyles = aStyleForm.linkedStyles;

		if(linkedStyles.length>0){
			aStyleForm.lookupReference('selectConditionForm').lookupReference('linkStyles').addCls('focus');
			aStyleForm.lookupReference('selectConditionForm').lookupReference('linkStyles').setIconCls('link');
		}
		else
		{
			aStyleForm.lookupReference('selectConditionForm').lookupReference('linkStyles').setIconCls('unlink');
			aStyleForm.lookupReference('selectConditionForm').lookupReference('linkStyles').removeCls('focus');
		}
	},

	setLinkedStyles:function(arrayStyles){
		var me 		= this,
			view      	= me.getView();

		var oldIncludesNew = view.aStyleFormParent.linkedStyles.every(function(item){ return arrayStyles.includes(item)});
		var newIncludesOld = arrayStyles.every(function(item){ return view.aStyleFormParent.linkedStyles.includes(item)});

		var removedStylesTitle = view.aStyleFormParent.linkedStyles.filter(function(item){ return !arrayStyles.includes(item)});

		if(!(oldIncludesNew && newIncludesOld)){
			view.aStyleFormParent.linkedStyles=arrayStyles;
			var bioStyleForm = Ext.getCmp(view.aStyleFormParent.biologicalType+"StyleForm");

			var partOfAllStyles = bioStyleForm.query("aStyleForm")
				.filter(function (aStyleForm) {
					return view.aStyleFormParent.linkedStyles.includes(aStyleForm.title);
				});

			partOfAllStyles.forEach(function(styleForm){
				styleForm.expand();

				var mappingNameToPropagate = view.aStyleFormParent.lookupReference('selectConditionForm').lookupReference('selectCondition').getValue();
				var dataTypeToPropagate = view.aStyleFormParent.lookupReference('selectConditionForm').lookupReference('selectConditionType').getValue();
				styleForm.lookupReference('selectConditionForm').lookupReference('selectCondition').setValue(mappingNameToPropagate);
				styleForm.lookupReference('selectConditionForm').lookupReference('selectConditionType').setValue(dataTypeToPropagate);
				styleForm.linkedStyles.push(view.aStyleFormParent.title);
				me.updateFocus(styleForm);
			});

			var removedStyles = bioStyleForm.query("aStyleForm")
				.filter(function (aStyleForm) {
					return removedStylesTitle.includes(aStyleForm.title);
				});

			removedStyles.forEach(function(styleForm){
				styleForm.linkedStyles = styleForm.linkedStyles.filter(function (title) {
					return view.aStyleFormParent.title !== title
				});
				console.log(styleForm.linkedStyles);
				me.updateFocus(styleForm);
			});

			me.updateFocus(view.aStyleFormParent);
		}
	}
});