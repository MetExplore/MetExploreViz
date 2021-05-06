/**
 * @author JCG
 * (a)description fluxMappingForm : Display flux value caption
 */
Ext.define('metExploreViz.view.form.fluxMappingForm.FluxMappingForm', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.fluxMappingForm',
    requires: [
        "metExploreViz.view.form.fluxMappingForm.FluxMappingFormController",
        "metExploreViz.view.form.fluxMappingForm.FluxMappingFormModel"
    ],
    controller: "form-fluxMappingForm-fluxMappingForm",
    viewModel: {
        type: "form-fluxMappingForm-fluxMappingForm"
    },
    layout:{
       type:'vbox',
       align:'stretch'
    },
    region:'north',
    width:'100%',
    margins:'0 0 0 0',
    split:true,
    animation: true,
    autoScroll: true,
    autoHeight: true
});
