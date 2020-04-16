/**
 * @author MC
 * (a)description class to control contion selection panel and to draw mapping in the mapping story
 */

Ext.define('metExploreViz.view.form.label.LabelController', {
	extend: 'Ext.app.ViewController',
	alias: 'controller.form-label-label',

/**
 * Aplies event linsteners to the view
 */
	init:function(){
		var me 		= this,
		viewModel   = me.getViewModel(),
		view      	= me.getView();

		view.lookupReference('selectLabel').on({
			beforerender: function(c) {
				var session = _metExploreViz.getSessionById('viz');
				var metabKeys;

				metabKeys = Object.keys(session.getD3Data().getNodes().filter(function(n) {return n.getBiologicalType() === view.aStyleFormParent.biologicalType;})[0]);

				metabKeys = metabKeys.filter(function(key){
					return key!=="isSideCompound" && key!=="reactionReversibility" && key!=="reactionReversibility" && key!=="selected" && key!=="duplicated" && key!=="labelVisible" &&
						key!=="svg" && key!=="svgWidth" && key!=="svgHeight" && key!=="pathways" && key!=="compartment" && key!=="mappingDatas" &&
						key!=="locked" && key!=="label" && key!=="labelFont" && key!=="index" && key!=="vy" && key!=="vx" && key!=="y" && key!=="x" && key!=="y";
				});
				view.lookupReference('selectLabel').setStore(metabKeys);

				if(metabKeys.length>0) {
					view.lookupReference('selectLabel').setValue(view.aStyleFormParent.default);
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
			aStyleForm.lookupReference('selectConditionForm').lookupReference('label').addCls('focus');
			aStyleForm.lookupReference('selectConditionForm').lookupReference('label').setIconCls('link');
		}
		else
		{
			aStyleForm.lookupReference('selectConditionForm').lookupReference('label').setIconCls('unlink');
			aStyleForm.lookupReference('selectConditionForm').lookupReference('label').removeCls('focus');
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