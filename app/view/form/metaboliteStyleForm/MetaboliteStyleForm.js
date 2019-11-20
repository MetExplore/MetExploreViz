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
    style : {
        padding:'0px 0px 0px 0px'
    },
    store: {
        data: [{
            "type": "color",
            "biologicalType":"metabolite",
            "target": ["rect.metabolite"],
            "attrType": "style",
            "attr": "fill",
            "title": "Node background",
            "default": "#FFFFFF",
            "access":"backgroundColor"
        }, {
            "type": "int",
            "biologicalType":"metabolite",
            "target": ["rect.metabolite", "rect.fontSelected"],
            "attrType": "attrEditor",
            "attr": "width",
            "title": "Width",
            "min": 1,
            "max": 100,
            "default": 5,
            "access":"width"
        }, {
            "type": "int",
            "biologicalType":"metabolite",
            "target": ["rect.metabolite", "rect.fontSelected"],
            "attrType": "attrEditor",
            "attr": "height",
            "title": "Height",
            "access": "height",
            "min": 1,
            "max": 100,
            "default": 5
        }, {
            "type": "int",
            "biologicalType":"metabolite",
            "target": ["rect.metabolite", "rect.fontSelected"],
            "attrType": "attr",
            "attr": "rx",
            "access": "rx",
            "title": "Rx",
            "min": 1,
            "max": 100,
            "default": 5
        }, {
            "type": "int",
            "biologicalType":"metabolite",
            "target": ["rect.metabolite", "rect.fontSelected"],
            "attrType": "attr",
            "attr": "ry",
            "access": "ry",
            "title": "Ry",
            "min": 1,
            "max": 100,
            "default": 5
        }, {
            "type": "float",
            "target": ["rect.metabolite", "rect.fontSelected"],
            "attrType": "style",
            "biologicalType":"metabolite",
            "attr": "opacity",
            "access": "opacity",
            "title": "Transparency",
            "min": 0.0,
            "max": 1.0,
            "default": 1.0
        }
        ,{
            "type": "color",
            "target": ["rect.metabolite", "rect.fontSelected"],
            "attrType": "style",
            "biologicalType":"metabolite",
            "attr": "stroke",
            "access": "strokeColor",
            "title": "Border color",
            "default": "#000000"
        }, {
            "type": "int",
            "target": ["rect.metabolite", "rect.fontSelected"],
            "attrType": "style",
            "attr": "stroke-width",
            "access": "strokeWidth",
            "biologicalType":"metabolite",
            "title": "Border width",
            "min": 0,
            "max": 50,
            "default": 1
        }
        ,{
            "type": "color",
            "target": ["text.metabolite"],
            "attrType": "attr",
            "attr": "fill",
            "access": "fontColor",
            "biologicalType":"metabolite",
            "title": "Label color",
            "default": "#000000"
        },{
            "type": "int",
            "target": ["text.metabolite"],
            "attrType": "style",
            "attr": "font-size",
            "access": "fontSize",
            "biologicalType":"metabolite",
            "title": "Label font size",
            "min": 1,
            "max": 200,
            "default": 20
        },{
            "type": "int",
            "target": ["text.metabolite"],
            "attrType": "style",
            "attr": "font-weight",
            "access": "fontWeight",
            "biologicalType":"metabolite",
            "title": "Label font weight",
            "min": 100,
            "max": 1000,
            "default": 500
        },{
            "type": "float",
            "target": ["text.metabolite"],
            "attrType": "style",
            "attr": "opacity",
            "access": "labelOpacity",
            "title": "Label transparency",
            "min": 0.0,
            "biologicalType":"metabolite",
            "max": 1.0,
            "default": 1.0
        }]
    },
});
