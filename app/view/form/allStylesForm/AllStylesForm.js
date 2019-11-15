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
        "metExploreViz.view.form.allStylesByTypeForm.AllStylesByTypeForm",
        "metExploreViz.view.form.metaboliteStyleForm.MetaboliteStyleForm",
        "metExploreViz.view.form.reactionStyleForm.ReactionStyleForm",
        "metExploreViz.view.form.linkStyleForm.LinkStyleForm"
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
    height:'20%',
    maxHeight:'20%',
    margins:'0 0 0 0',
    autoScroll: true,
    tabBar:{
        cls:"vizTBarStyle"
    },
    items: [
        {
            title:'Metabolite',
            id:'metaboliteStyleForm',
            xtype: "metaboliteStyleForm"
        },
        {
            title:'Reaction',
            id:'reactionStyleForm',
            xtype: "reactionStyleForm"
        },
        {
            title:'Link',
            id:'linkStyleForm',
            xtype: "linkStyleForm"
        }
    ]
});