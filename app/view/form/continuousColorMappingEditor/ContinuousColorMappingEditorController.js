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

		view.lookupReference('scaleEditor').on({
			afterrender : function(that){
				var margin = 50;
				var width = 450 - margin;
				var height = 150 - margin;

				var svg = d3.select(that.el.dom).select("#svgScaleEditor");

				metExploreD3.GraphColorScaleEditor.createColorScaleEditor(svg, width, height, margin);

			}
		});

		view.lookupReference('colorButton').on({
			click : function(that){
				metExploreD3.GraphColorScaleEditor.addColor();
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