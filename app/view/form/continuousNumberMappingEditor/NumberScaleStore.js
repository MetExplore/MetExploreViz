/**
 * @author MC
 * (a)description class to control contion selection panel and to draw mapping in the mapping story
 */

Ext.define('metExploreViz.view.form.continuousNumberMappingEditor.NumberScaleStore', {
	extend: 'Ext.data.Store',
	alias: 'store.NumberScaleStore',
	requires: [
		"metExploreViz.view.form.continuousNumberMappingEditor.NumberScaleModel"
	],
	model: 'metExploreViz.view.form.continuousNumberMappingEditor.NumberScaleModel',
	data : [
		{"name":"Map1_c1"},
		{"name":"Map2_c1"},
		{"name":"Map2_c2"},
		{"name":"Map2_c3"}
	]
});