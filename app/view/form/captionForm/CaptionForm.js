/**
 * @author MC
 * @description 
 */
Ext.define('metExploreViz.view.form.captionForm.CaptionForm', {
    extend: 'Ext.panel.Panel',  
    alias: 'widget.captionForm',
    requires: [
        "metExploreViz.view.form.selectComponent.SelectComponent",
        "metExploreViz.view.form.ComponentCaptionForm",
        "metExploreViz.view.form.captionForm.CaptionFormController",
        "metExploreViz.view.form.captionForm.CaptionFormModel"
    ],
    controller: "form-captionForm-captionForm",
    viewModel: {
        type: "form-captionForm-captionForm"
    },
    layout:{
       type:'vbox',
       align:'stretch'
    },
    // collapsible: true,
    // collapsed:false,
    region:'north',
    width:'100%', 
    margins:'0 0 0 0',
    split:true,
    animation: true,
    autoScroll: true,
    autoHeight: true

});