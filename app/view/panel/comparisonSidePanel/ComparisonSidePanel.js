/**
 * @author MC
 * (a)description 
 */
Ext.define('metExploreViz.view.panel.comparisonSidePanel.ComparisonSidePanel', {
	extend: 'Ext.tab.Panel',
	alias: 'widget.comparisonSidePanel',
	requires: [
        "metExploreViz.view.panel.comparisonSidePanel.ComparisonSidePanelController",
        "metExploreViz.view.panel.comparisonSidePanel.ComparisonSidePanelController",
        "metExploreViz.view.form.selectConditionForm.SelectConditionForm",
        "metExploreViz.view.form.drawingStyleForm.DrawingStyleForm",
        "metExploreViz.view.form.captionForm.CaptionForm",
        "metExploreViz.view.form.allStylesForm.AllStylesForm"
    ],
 	controller: "panel-comparisonSidePanel-comparisonSidePanel",
	/*requires: ['MetExplore.view.form.V_SelectConditionForm',
	           'MetExplore.view.form.V_UpdateStyleForm'
	           ],
*/
	collapsible: true,
	collapsed:true,

	width: '30%',
	height: '100%',
	margins:'0 0 2 0',
	split:true,
	closable: false,
	region: 'west',
	// hidden:true,
	tabBar:{
		cls:"vizTBar"
	},
	items: [
	// {
	//    title:'Omics',
	//    id:'selectConditionForm',
	//    xtype:'selectConditionForm'
	// }
	//{
	//  title:'Compare',
	//  id:'updateSelectionForm',
	//  xtype:'updateSelectionForm',
	//  layout:{
	//   type:'vbox',
	//   align:'stretch'
	//  }
	// }
	// ,
	{
		title:'Styles',
		id:'allStylesForm',
		xtype:'allStylesForm'
	},
	{
		title:'Pathways',
		id:'captionFormPathways',
		xtype:'captionForm'
	}
	,
	{
		title:'Compartments',
		id:'captionFormCompartments',
		xtype:'captionForm'
	},
	{
        title:'Drawing param.',
        id:'drawingStyleForm',
		xtype:'drawingStyleForm'
	},
	{
		title:'Cycle',
		reference: 'cycleDetection',
		id:'cycleDetection',
		xtype:'panel',
		autoScroll: true,
		autoHeight: true,
		collapsed: true,
		hidden: true,
		items:[{
			xtype:'button',
			text:'Draw Cycle',
			margin: '10 10 10 10',
			align:'stretch',
			width:'95%',
			reference:'buttonDrawCycle',
			hidden: true
		},{
			xtype:'menuseparator'
		},{
			xtype:'fieldcontainer',
			id:'cycleDetectionPanel',
			reference:'cycleDetectionPanel'
		},{
			xtype:'button',
			text:'Hide cycle',
			margin: '10 10 10 10',
			align:'stretch',
			width:'50%',
			reference:'buttonHideCycle',
			hidden: true
		}]
	}
	]
});