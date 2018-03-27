Ext.define('metExploreViz.view.panel.editModePanel.EditModePanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.editModePanel',
    requires: [
        "metExploreViz.view.panel.editModePanel.EditModePanelController",
        "metExploreViz.view.form.captionForm.CaptionForm",
    ],
    controller: "panel-editModePanel-editModePanel",
    /*requires: ['MetExplore.view.form.V_SelectConditionForm',
               'MetExplore.view.form.V_UpdateStyleForm'
               ],
*/
    collapsible: true,
    collapsed:true,
    width: '20%',
    height: '100%',
    margins:'0 0 2 0',
    split:true,
    layout:'accordion',
    closable: false,
    region: 'east',
    // hidden:true,
    items: [
        {
            title:'Pathways',
            id:'captionFormPathways',
            xtype:'captionForm'
        }
    ]
});