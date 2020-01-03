/**
 * @author Adrien Rohan
 * Controller class for EditModePanel
 */
Ext.define('metExploreViz.view.panel.editModePanel.EditModePanelController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.panel-editModePanel-editModePanel',


    /**
     * Applies event listeners to the view
     */
    // init:function(){
    //     var me 		= this,
    //         viewModel   = me.getViewModel(),
    //         view      	= me.getView();
    //
    //     view.on({
    //         //newMapping : me.drawCaption,
    //         scope:me
    //     });
    //
    //     view.lookupReference('refreshCurve').on({
    //         click : function()
    //         {
    //             var curveBundling = view.lookupReference('EdgeBundling').getValue();
    //             var flux = _metExploreViz.getSessionById('viz').getMappingDataType()=="Flux";
    //             if (flux){
    //                 metExploreD3.displayWarning("Can't draw curves", 'The edges bundling option is unavailable with flux visualisation');
    //             }
    //             else if (curveBundling == true) {
    //                 metExploreD3.GraphStyleEdition.curvedPath = true;
    //                 metExploreD3.GraphLink.bundleLinks("viz");
    //             }
    //             else {
    //                 metExploreD3.GraphStyleEdition.curvedPath = false;
    //                 metExploreD3.GraphNetwork.removeMarkerEnd();
    //                 metExploreD3.GraphCaption.drawCaption();
    //                 metExploreD3.GraphLink.tick("viz");
    //             }
    //         },
    //         scope : me
    //     });
    //
    // },
    //
    // drawCaption : function(){
    //     metExploreD3.GraphCaption.drawCaption();
    // }
});