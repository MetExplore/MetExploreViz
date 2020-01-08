/**
 * @author MC
 * @description CycleDetectionForm : Display Settings
 */
Ext.define('metExploreViz.view.form.cycleDetectionForm.CycleDetectionForm', {
    extend: 'Ext.panel.Panel',  
    alias: 'widget.cycleDetectionForm',
    requires: [
        "metExploreViz.view.form.cycleDetectionForm.CycleDetectionFormController",
        "metExploreViz.view.form.SelectDisplayReactionLabel",
        "metExploreViz.view.form.SelectDisplayMetaboliteLabel"
    ],
    controller: "form-cycleDetectionForm-cycleDetectionForm",
    
    region:'north',
    margins:'0 0 0 0',
    flex:1,
    width:'100%',
    border:false,
    autoScroll:true,
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    autoHeight: true,
    disabled: true,
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
});