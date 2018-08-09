/**
 * @author Adrien Rohan
 * A panel including subpanels for various style options
 */
Ext.define('metExploreViz.view.panel.editModePanel.EditModePanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.editModePanel',
    requires: [
        "metExploreViz.view.panel.editModePanel.EditModePanelController",
        "metExploreViz.view.form.updateStyleForm.UpdateStyleForm",
        "metExploreViz.view.form.updateLabelStyleForm.UpdateLabelStyleForm"
    ],
    controller: "panel-editModePanel-editModePanel",


    collapsible: true,
    collapsed:true,
    width: '20%',
    height: '100%',
    margins:'0 0 2 0',
    split:true,
    layout:'accordion',
    closable: false,
    region: 'east',
    hidden:true,
    items: [
        {
            title:'Label Style',
            id:'updateLabelStyleForm',
            xtype:'updateLabelStyleForm',
            layout:{
                type:'vbox',
                align:'stretch'
            }
        },
        {
            title:'Style',
            id:'updateStyleForm',
            xtype:'updateStyleForm',
            layout:{
                type:'vbox',
                align:'stretch'
            }
        },
        {
            title: "Curve",
            xtype: 'panel',
            collapsible: true,
            collapsed:true,
            items: [
                {
                    xtype:'fieldcontainer',
                    margin:'5 5 5 5',
                    fieldLabel:'Curve',
                    defaultType:'checkboxfield',
                    items: [
                        {
                            boxLabel:'Edges Bundling',
                            checked:false,
                            reference:'EdgeBundling'
                        }
                    ]
                },
                {
                    xtype: 'menuseparator'
                },
                {
                    xtype:'button',
                    iconCls:'refresh',
                    width:'100%',
                    margin:'5 5 5 0',
                    reference: 'refreshCurve',
                    action: 'refreshCurve'

                }
            ]
        }
    ]
});
