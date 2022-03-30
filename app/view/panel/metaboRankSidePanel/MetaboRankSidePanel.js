/**
 * @author JCG
 * (a)description
 */
Ext.define('metExploreViz.view.panel.metaboRankSidePanel.MetaboRankSidePanel', {
	extend: 'Ext.tab.Panel',
	alias: 'widget.metaboRankSidePanel',
	requires: [
        "metExploreViz.view.panel.metaboRankSidePanel.MetaboRankSidePanelController",
        "metExploreViz.view.form.girForm.GirForm",
        "metExploreViz.view.form.girPathwaysForm.GirPathwaysForm"
    ],
 	controller: "panel-metaboRankSidePanel-metaboRankSidePanel",

	collapsible: true,
	collapsed:true,

	width: '30%',
	height: '100%',
	margins:'0 0 2 0',
	split:true,
	closable: false,
    hidden: true,
    open: false,
	region: 'west',
	tabBar:{
		cls:"vizTBar"
	},
	items: [
        {
            title: 'Parameters',
            id: 'girParams',
            xtype: 'girForm'
        },
        {
            title: 'Pathways',
            id: 'girPathwaysParams',
            xtype: 'girPathwaysForm'
        }
	]
});