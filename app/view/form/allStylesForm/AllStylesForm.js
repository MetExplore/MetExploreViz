/**
 * @author MC
 * (a)description AllStylesForm : Display pathway and compartment caption
 */
Ext.define('metExploreViz.view.form.allStylesForm.AllStylesForm', {
    extend: 'Ext.tab.Panel',
    alias: 'widget.allStylesForm',
    requires: [
        "metExploreViz.view.form.allStylesForm.AllStylesFormController",
        "metExploreViz.view.form.allStylesForm.AllStylesFormModel",
        "metExploreViz.view.form.allStylesByTypeForm.AllStylesByTypeForm"
    ],
    controller: "form-allStylesForm-allStylesForm",
    viewModel: {
        type: "form-allStylesForm-allStylesForm"
    },
    layout:{
       type:'vbox',
       align:'stretch'
    },
    region:'north',
    width:'100%', 
    margins:'0 0 0 0',
    autoScroll: true,
    // height: '100%',
    tabBar:{
        cls:"vizTBarStyle"
    },
    items: [
        {
            title:'Metabolite',
            xtype: "allStylesByTypeForm"
        },
        {
            title:'Reaction',
            xtype: "allStylesByTypeForm"
        },
        {
            title:'Link',
            xtype: "allStylesByTypeForm"
        }
    ]
});