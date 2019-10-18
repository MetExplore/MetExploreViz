/**
 * @author MC
 * (a)description 
 */
Ext.define('metExploreViz.view.form.selectConditionForm.SelectConditionForm', {
    extend: 'Ext.panel.Panel',  
    alias: 'widget.selectConditionForm',
    requires: [
        'metExploreViz.view.form.SelectConditionType',
        'metExploreViz.view.form.selectCondition.SelectCondition',
        'metExploreViz.view.form.selectMapping.SelectMapping',
        "metExploreViz.view.form.selectConditionForm.SelectConditionFormController",
        "metExploreViz.view.form.selectConditionForm.SelectConditionFormModel"
    ],
    controller: "form-selectConditionForm-selectConditionForm",
    viewModel: {
        type: "form-selectConditionForm-selectConditionForm"
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
    autoHeight: true,

    items: [
    {
        reference:'selectMappingVisu',
        xtype:'selectMapping',
        disabled:true
    },
    {
        border:false,
        reference:'chooseCondition',
        xtype:'panel',
        autoScroll: true,
        layout:{
            type:'hbox',
            align:'stretch'
        },
        items:[{
            xtype:'selectCondition',
            reference:'selectCondition',
            disabled:true
        }
        ]
    },
    {
        xtype: 'menuseparator'
    },
    {
        reference:'selectConditionType',
        xtype:'selectConditionType',
        reference:'selectConditionType',
        disabled:true
    }
    ]  
});