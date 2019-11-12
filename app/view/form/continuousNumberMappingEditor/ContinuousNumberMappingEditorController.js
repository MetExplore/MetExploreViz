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
				var numberButtonEl = numberButton.getEl().dom.querySelector("#html5numberpicker");

				metExploreD3.GraphNumberScaleEditor.createNumberScaleEditor(svg, width, height, numberButtonEl);

				numberButtonEl
					.addEventListener("change", function (evt) {
						metExploreD3.GraphNumberScaleEditor.updateNumber(evt.target.value, svg);
					});
			}
		});

		view.lookupReference('addButton').on({
			click : function(that){
				metExploreD3.GraphNumberScaleEditor.addNumber();
			}
		});

		view.lookupReference('resetButton').on({
			click : function(that){
				metExploreD3.GraphNumberScaleEditor.reset();
			}
		});

		view.lookupReference('delButton').on({
			click : function(that){
				metExploreD3.GraphNumberScaleEditor.delNumber();
			}
		});

		view.lookupReference('okButton').on({
			click : function(that){
				//Set number caption and nodes
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