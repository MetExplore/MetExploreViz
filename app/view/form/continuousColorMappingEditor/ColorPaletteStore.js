/**
 * @author MC
 * (a)description class to control contion selection panel and to draw mapping in the mapping story
 */

Ext.define('metExploreViz.view.form.continuousColorMappingEditor.ColorPaletteStore', {
	extend: 'Ext.data.Store',
	alias: 'store.ColorPaletteStore',
	requires: [
		"metExploreViz.view.form.continuousColorMappingEditor.ColorPaletteModel"
	],
	model: 'metExploreViz.view.form.continuousColorMappingEditor.ColorPaletteModel',
	data : [
		{"name":"Map1_c1"},
		{"name":"Map2_c1"},
		{"name":"Map2_c2"},
		{"name":"Map2_c3"}
	]
});