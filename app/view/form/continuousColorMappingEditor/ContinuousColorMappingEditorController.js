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
				var height = 160 - margin;

				var svg = d3.select(that.el.dom).select("#svgScaleEditor");

				var colorButton = view.lookupReference('colorButton');
				var colorButtonEl = colorButton.getEl().dom.querySelector("#html5colorpicker");

				metExploreD3.GraphColorScaleEditor.createColorScaleEditor(svg, width, height, margin, colorButtonEl);

				colorButtonEl
					.addEventListener("change", function (evt) {
						metExploreD3.GraphColorScaleEditor.updateColor(evt.target.value, svg);
					});
			}
		});

		view.lookupReference('addButton').on({
			click : function(that){
				metExploreD3.GraphColorScaleEditor.addColor();
			}
		});

		view.lookupReference('resetButton').on({
			click : function(that){
				metExploreD3.GraphColorScaleEditor.reset();
			}
		});

		view.lookupReference('delButton').on({
			click : function(that){
				metExploreD3.GraphColorScaleEditor.delColor();
			}
		});

		view.lookupReference('okButton').on({
			click : function(that){
				//Set color caption and nodes
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