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
        width: '100%',
        collapsible: true,
        collapsed: true,
        reorderable: true
    },
    store: {
        data: [{
            "type": "color",
            "selector": "fill",
            "title": "Node background"
        }, {
            "type": "color",
            "selector": "fill",
            "title": "Border color"
        }, {
            "type": "number",
            "selector": "stroke-width",
            "title": "Border width"
        }]
    },
    items: [{
        collapsed: false,
        border: 0,
        height: 0,
        minHeight: 0
    }]
});