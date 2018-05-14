/**
 * @author MC
 * (a)description class to control contion selection panel and to draw mapping in the mapping story
 */

Ext.define('metExploreViz.view.form.selectCondition.SelectConditionController', {
	extend: 'Ext.app.ViewController',
	alias: 'controller.form-selectCondition-selectCondition',

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
	},

	// To choose directly a condition (pimp use it)
	setConditionProgramaticaly:function(conditionName){
		if(this.getView().getRawValue()==""){
			this.getView().setValue(conditionName);
		}
	}
});