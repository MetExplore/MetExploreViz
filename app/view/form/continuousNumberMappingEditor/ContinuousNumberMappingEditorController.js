/**
 * @author MC
 * (a)description class to control contion selection panel and to draw mapping in the mapping story
 */

Ext.define('metExploreViz.view.form.continuousNumberMappingEditor.ContinuousNumberMappingEditorController', {
	extend: 'Ext.app.ViewController',
	alias: 'controller.form-continuousNumberMappingEditor-continuousNumberMappingEditor',

/**
 * Aplies event linsteners to the view
 */
	init:function(){
		var me 		= this,
		viewModel   = me.getViewModel(),
		view      	= me.getView();

		view.on({
				setConditionProgramaticaly : me.setConditionProgramaticaly,
				scope:me
			});

		view.on({
			afterrender : function(that){
				var width = 450;
				var height = 85;

				var svg = d3.select(that.el.dom).select("#svgScaleEditor");


				var numberButton = view.lookupReference('numberButton');
				var delButton = view.lookupReference('delButton');
				var textfieldValue = view.lookupReference('textfieldValue');

				view.aStyleFormParent.graphNumberScaleEditor.createNumberScaleEditor(
					svg,
					width,
					height,
					numberButton,
					textfieldValue,
					delButton,
					view.aStyleFormParent.scaleRange);
			}
		});

		view.lookupReference('addButton').on({
			click : function(that){
				view.aStyleFormParent.graphNumberScaleEditor.addNumber();
			}
		});

		view.lookupReference('textfieldValue').on({
			focusleave : function(that){

				var value =parseFloat(that.getRawValue());

				if(value==="< min" || value==="> max")
					that.disable();
				else
				{
					that.enable();
					if(isNaN(parseFloat(value))){
						Ext.Msg.show({
							title:'Warning',
							msg: "Please enter a number.",
							icon: Ext.Msg.WARNING
						});
					}
					else
					{
						view.aStyleFormParent.graphNumberScaleEditor.updateValue(value);
					}
				}
			}
		});

		view.lookupReference('numberButton').on({
			focusleave : function(that){

				var value =parseFloat(that.getRawValue());

				if(value==="< min" || value==="> max")
					that.disable();
				else
				{
					that.enable();
					if(isNaN(parseFloat(value))){
						Ext.Msg.show({
							title:'Warning',
							msg: "Please enter a number.",
							icon: Ext.Msg.WARNING
						});
					}
					else
					{
						view.aStyleFormParent.graphNumberScaleEditor.updateSize(value);
					}
				}
			}
		});


		view.lookupReference('resetButton').on({
			click : function(that){
				view.aStyleFormParent.graphNumberScaleEditor.reset();
			}
		});

		view.lookupReference('delButton').on({
			click : function(that){
				view.aStyleFormParent.graphNumberScaleEditor.delNumber();
			}
		});


		view.lookupReference('okButton').on({
			click : function(){
				view.aStyleFormParent.scaleRange = view.aStyleFormParent.graphNumberScaleEditor.getScaleRange();
				view.aStyleFormParent.getController().updateContinuousCaption();
				view.aStyleFormParent.getController().updateContinuousMapping();

				view.close();
			}
		});

		view.lookupReference('cancelButton').on({
			click : function(that){
				view.close();
			}
		});
	},
	// To choose directly a condition (pimp use it)
	setConditionProgramaticaly:function(conditionName){
		if(this.getView().getRawValue()==""){
			this.getView().setValue(conditionName);
		}
	}
});