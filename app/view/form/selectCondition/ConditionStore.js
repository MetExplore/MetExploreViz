/**
 * @author MC
 * (a)description class to control contion selection panel and to draw mapping in the mapping story
 */

Ext.define('metExploreViz.view.form.selectCondition.ConditionStore', {
	extend: 'Ext.data.Store',
	alias: 'store.ConditionStore',
	requires: [
		"metExploreViz.view.form.selectCondition.ConditionModel"
	],
	model: 'metExploreViz.view.form.selectCondition.ConditionModel',
	data : [
		{"name":"Map1_c1"},
		{"name":"Map2_c1"},
		{"name":"Map2_c2"},
		{"name":"Map2_c3"}
	]
});