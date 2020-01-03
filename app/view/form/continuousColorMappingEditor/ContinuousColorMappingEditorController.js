/**
 * @author MC
 * (a)description class to control contion selection panel and to draw mapping in the mapping story
 */

Ext.define('metExploreViz.view.form.continuousColorMappingEditor.ContinuousColorMappingEditorController', {
	extend: 'Ext.app.ViewController',
	alias: 'controller.form-continuousColorMappingEditor-continuousColorMappingEditor',

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
				var margin = 50;
				var width = 450 - margin;
				var height = 145 - margin;

				var svg = d3.select(that.el.dom).select("#svgScaleEditor");

				var colorButton = view.lookupReference('colorButton');
				var delButton = view.lookupReference('delButton');
				var textfieldValue = view.lookupReference('textfieldValue');
				var colorButtonEl = colorButton.getEl().dom.querySelector("#html5colorpicker");

				view.aStyleFormParent.graphColorScaleEditor.createColorScaleEditor(
					svg,
					width,
					height,
					margin,
					colorButtonEl,
					textfieldValue,
					delButton,
					view.aStyleFormParent.scaleRange);

				colorButtonEl
					.addEventListener("change", function (evt) {
						view.aStyleFormParent.graphColorScaleEditor.updateColor(evt.target.value, svg);
					});
			}
		});

		view.lookupReference('addButton').on({
			click : function(that){
				view.aStyleFormParent.graphColorScaleEditor.addColor();
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
						view.aStyleFormParent.graphColorScaleEditor.updateValues(value);
					}
				}
			}
		});

		view.lookupReference('resetButton').on({
			click : function(that){
				view.aStyleFormParent.graphColorScaleEditor.reset();
			}
		});

		view.lookupReference('delButton').on({
			click : function(that){
				view.aStyleFormParent.graphColorScaleEditor.delColor();
			}
		});

		view.lookupReference('okButton').on({
			click : function(){
				view.aStyleFormParent.scaleRange = view.aStyleFormParent.graphColorScaleEditor.getScaleRange();
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