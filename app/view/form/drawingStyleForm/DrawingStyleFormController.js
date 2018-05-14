
/**
 * @author MC
 * @description class to control settings or configs
 */

Ext.define('metExploreViz.view.form.drawingStyleForm.DrawingStyleFormController', {
	extend: 'Ext.app.ViewController',
	alias: 'controller.form-drawingStyleForm-drawingStyleForm',

	/**
	 * Init function Checks the changes on drawing style
	 */
	init : function() {
		var me 		= this,
		viewModel   = me.getViewModel(),
		view      	= me.getView();
		
		// view.on({
		// 	setDrawingStyle : function(){
		// 		var s_DrawingStyle = _metExploreViz.getDrawingStyle();
		// 		view.lookupReference('chooseMaxNodes').setValue(s_DrawingStyle.getReactionThreshold());
		// 		view.lookupReference('chooseDisplayForOpt').items.get("name").setValue(s_DrawingStyle.isDisplayedLabelsForOpt());
		// 		view.lookupReference('chooseDisplayForOpt').items.get("links").setValue(s_DrawingStyle.isDisplayedLinksForOpt());
		// 	},
		// 	scope:me
		// });

		// view.lookupReference('refreshDrawingConf').on({
		// 	click : function()
		// 	{
		// 		var s_DrawingStyle = metExploreD3.getDrawingStyle();
		// 		var isset = false;
		//
		// 		var threshold = view.lookupReference('chooseMaxNodes').getValue();
		// 		var newThreshold = ((!isNaN(threshold) && threshold>0) ? threshold : s_DrawingStyle.getReactionThreshold());
		//
		// 		var newname = view.lookupReference('chooseDisplayForOpt').items.get("name").getValue();
		// 		var newlinks = view.lookupReference('chooseDisplayForOpt').items.get("links").getValue();
        //
		// 		if(
		// 			(newThreshold != s_DrawingStyle.getReactionThreshold())
		// 			|| (newname != s_DrawingStyle.isDisplayedLabelsForOpt())
		// 			|| (newlinks != s_DrawingStyle.isDisplayedLinksForOpt())
		// 		){
		// 			isset=true;
		//
		// 			if(newlinks != s_DrawingStyle.isDisplayedLinksForOpt() ){
		// 				if(!newlinks){
		// 					metExploreD3.GraphLink.reloadLinks(
		// 						"viz",
		// 						_metExploreViz.getSessionById("viz").getD3Data(),
		// 						metExploreD3.getLinkStyle(),
		// 						metExploreD3.getMetaboliteStyle());
        //
		// 				}
		// 				else
		// 				{
		// 					d3.selectAll("path.link").remove();
		// 				}
		// 				metExploreD3.GraphLink.tick("viz",metExploreD3.getScaleById("viz"));
		// 			}
		// 			s_DrawingStyle.setReactionThreshold(parseFloat(newThreshold));
		// 			s_DrawingStyle.setDisplayLabelsForOpt(newname);
		// 			s_DrawingStyle.setDisplayLinksForOpt(newlinks);
		//
		// 		}
		// 	},
		// 	scope : me
		// });
        //
		// view.lookupReference('chooseMaxNodes').on({
		// 	afterrender: function(me){
		// 		var s_DrawingStyle = metExploreD3.getDrawingStyle();
		//
		//         view.lookupReference('chooseMaxNodes').setValue(s_DrawingStyle.getReactionThreshold());
		//     },
		// 	scope : me
		// });
        //
		// view.lookupReference('chooseDisplayForOpt').items.get("name").on({
		// 	afterrender: function(me){
		// 		var s_DrawingStyle = metExploreD3.getDrawingStyle();
		//
		//         view.lookupReference('chooseDisplayForOpt').items.get("name").setValue(s_DrawingStyle.isDisplayedLabelsForOpt());
		//     },
		// 	scope : me
		// });
        //
		// view.lookupReference('chooseDisplayForOpt').items.get("links").on({
		// 	afterrender: function(me){
		// 		var s_DrawingStyle = metExploreD3.getDrawingStyle();
		//
		//         view.lookupReference('chooseDisplayForOpt').items.get("links").setValue(s_DrawingStyle.isDisplayedLinksForOpt());
		//     },
		// 	scope : me
		// });
	}
});

