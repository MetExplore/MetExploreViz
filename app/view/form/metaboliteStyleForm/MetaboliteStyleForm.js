/**
 * @author MC
 * (a)description  MetaboliteStyleForm : Display metabolites config
 */
Ext.define('metExploreViz.view.form.metaboliteStyleForm.MetaboliteStyleForm', {
    extend: 'metExploreViz.view.form.allStylesByTypeForm.AllStylesByTypeForm',
    alias: 'widget.metaboliteStyleForm',
    requires: [
        "metExploreViz.view.form.allStylesByTypeForm.AllStylesByTypeForm"
    ],

    store: {
        data: [{
            "type": "color",
            "biologicalType":"metabolite",
            "target": ["rect.metabolite"],
            "attrType": "style",
            "attr": "fill",
            "title": "Node background",
            "default": "#FFFFFF"
        }, {
            "type": "number",
            "biologicalType":"metabolite",
            "target": ["rect.metabolite", "rect.fontSelected"],
            "attrType": "attr",
            "attr": "width",
            "title": "Width",
            "min": 1,
            "max": 100,
            "default": 5
        }, {
            "type": "number",
            "biologicalType":"metabolite",
            "target": ["rect.metabolite", "rect.fontSelected"],
            "attrType": "attr",
            "attr": "height",
            "title": "Height",
            "min": 1,
            "max": 100,
            "default": 5
        }, {
            "type": "number",
            "biologicalType":"metabolite",
            "target": ["rect.metabolite", "rect.fontSelected"],
            "attrType": "attr",
            "attr": "rx",
            "title": "Rx",
            "min": 1,
            "max": 100,
            "default": 5
        }, {
            "type": "number",
            "biologicalType":"metabolite",
            "target": ["rect.metabolite", "rect.fontSelected"],
            "attrType": "attr",
            "attr": "ry",
            "title": "Ry",
            "min": 1,
            "max": 100,
            "default": 5
        }, {
            "type": "number",
            "target": ["rect.metabolite", "rect.fontSelected"],
            "attrType": "style",
            "biologicalType":"metabolite",
            "attr": "opacity",
            "title": "Transparency",
            "min": 0,
            "max": 1,
            "default": 1
        }
        ,{
            "type": "color",
            "target": ["rect.metabolite", "rect.fontSelected"],
            "attrType": "style",
            "biologicalType":"metabolite",
            "attr": "stroke",
            "title": "Border color",
            "default": "#000000"
        }, {
            "type": "number",
            "target": ["rect.metabolite", "rect.fontSelected"],
            "attrType": "style",
            "attr": "stroke-width",
            "biologicalType":"metabolite",
            "title": "Border width",
            "min": 0,
            "max": 50,
            "default": 1
        }
            // , {
            //     "type": "text",
            //     "attr": "text",
            //     "title": "Label"
            // }
        , {
            "type": "color",
            "target": ["text.metabolite"],
            "attrType": "attr",
            "attr": "fill",
            "biologicalType":"metabolite",
            "title": "Label color",
            "default": "#000000"
        }, {
            "type": "number",
            "target": ["text.metabolite"],
            "attrType": "style",
            "attr": "font-size",
            "biologicalType":"metabolite",
            "title": "Label font size",
            "min": 1,
            "max": 200,
            "default": 20
        }, {
            "type": "number",
            "target": ["text.metabolite"],
            "attrType": "style",
            "attr": "opacity",
            "title": "Label transparency",
            "min": 0,
            "biologicalType":"metabolite",
            "max": 1,
            "default": 1
        }]
    }
});
