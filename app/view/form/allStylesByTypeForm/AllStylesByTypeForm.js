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
    title: 'listPanel',
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
    //     {
    //     xtype:"panel",
    //     layout: 'hbox',
    //     width: '100%',
    //     collapsible: false,
    //     collapsed: false,
    //     items:[
    //         {
    //             xtype:'label',
    //             forId: 'version',
    //             text: 'Default',
    //             margin: '0 0 0 10',
    //             flex:1,
    //             border:false
    //         },{
    //             xtype:'label',
    //             forId: 'version',
    //             text: 'Default',
    //             margin: '0 0 0 10',
    //             flex:1,
    //             border:false
    //         },{
    //             xtype:'label',
    //             forId: 'version',
    //             text: 'Default',
    //             margin: '0 0 0 10',
    //             flex:1,
    //             border:false
    //         }
    //     ]
    // },
        {
        collapsed: false,
        border: 0,
        height: 0,
        minHeight: 0
    }]
});