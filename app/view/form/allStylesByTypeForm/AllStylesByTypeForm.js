/**
 * @author MC
 * @description AllStylesByTypeForm : Display Settings
 */
Ext.define('metExploreViz.view.form.allStylesByTypeForm.AllStylesByTypeForm', {
    extend: 'Ext.panel.Panel',  
    alias: 'widget.allStylesByTypeForm',
    requires: [
        "metExploreViz.view.form.allStylesByTypeForm.AllStylesByTypeFormController",
        "metExploreViz.view.form.aStyleForm.AStyleForm"
    ],
    controller: "form-allStylesByTypeForm-allStylesByTypeForm",

    autoScroll: true,

    items: [
        {
            xtype:'toolbar',
            //reference: 'caption',
            region:'north',
            reference:"captiontoolbar",
            cls:"captiontoolbar",
            border:false,
            height: 38,
            disabled: true,
            title: false,
            items: [
                { xtype: 'tbspacer',reference: 'caption', width: 150 },
                '->',//spliter to shift next component up to end of right
                {
                    xtype: 'button',
                    reference: 'saveAllScales',
                    iconCls:'saveStyle',
                    align:"right",
                    scale   : 'small',
                    margin:'5 5 5 0',
                    tooltip: "Save scale"
                },
                {
                    xtype: 'filefield',
                    reference: 'importAllScales',
                    buttonOnly: true,
                    buttonText: '',
                    scale   : 'small',
                    buttonConfig: {
                        cls:["x-toolbar-item","x-btn-default-toolbar-small"],
                        iconCls:'importStyle',
                        align:"right",
                        scale   : 'small',
                        margin:'0 5 0 0'
                    }
                }
            ]
        },
        {
            reference: 'listPanel',
            xtype:'panel',
            title: false,
            layout: {
                type: 'accordion',
                fill: false,
                multi: true,
                animate: true,
                titleCollapse: false,
                expandedItem: false
            },
            defaults: {

                padding:'0',
                width: '100%',
                collapsible: true,
                collapsed: true,
                reorderable: true
            },
            items: [
                {
                    collapsed: false,
                    border: 0,
                    height: 0,
                    minHeight: 0
                }]
        }]
});