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
    region:'north',
    width:'100%', 
    margins:'0 0 0 0',
    split:true,
    animation: true,
    autoScroll: true,
    autoHeight: true,

    items: [
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
            reference:'selectCondition'
        }
        ]
    },
    {
        reference:'selectConditionType',
        xtype:'selectConditionType'
    },
    {
        xtype: 'menuseparator'
    },
    {
        border:false,
        reference:'delConditionPanel',
        xtype:'panel',
        region:'north',
        hidden:true,
        margins:'0 0 0 0',
        border:false,
        bbar: [
            '->',//spliter to shift next component up to end of right
            {
                xtype: 'button',
                iconCls:'download',
                align:"right",
                scale   : 'small',
                margin:'5 5 5 0',
                reference: 'saveScale',
                tooltip: "Save scale"
            },
            {
                xtype: 'filefield',
                buttonOnly: true,
                buttonText: '',
                iconCls:'save',
                scale   : 'small',
                margin:'5 5 5 0',
                maxHeight:"50px",
                maxWidth:"50px",
                buttonConfig: {
                    cls:["x-toolbar-item","x-btn-default-toolbar-small"],
                    iconCls:'save',
                    align:"right",
                    scale   : 'small',
                    margin:'5 5 5 0'
                },
                reference: 'importScale'
            },
            {
                xtype: 'button',
                iconCls:'junk',
                align:"right",
                scale   : 'small',
                margin:'5 5 5 0',
                reference: 'delCondition'
            }
        ]
    },
    {
        xtype:"panel",
        reference:'discreteCaptions',
        region:'north',
        margins:'0 0 0 0',
        hidden:true,
        border:false
    },
    {
        xtype: "panel",
        reference: "scaleCaption",
        height: 110,
        hidden:true,
        width: 550,
        html: "<svg id='scaleCaption' height='110' width='250px'> </svg>"
    }
    ]  
});