/**
 * @author MC
 * (a)description  ReactionStyleForm : Display reactions config
 */
Ext.define('metExploreViz.view.form.reactionStyleForm.ReactionStyleForm', {
    extend: 'metExploreViz.view.form.allStylesByTypeForm.AllStylesByTypeForm',
    alias: 'widget.reactionStyleForm',
    requires: [
        "metExploreViz.view.form.allStylesByTypeForm.AllStylesByTypeForm"
    ],
    style : {
        padding:'0px 0px 0px 0px'
    },
    store: {
        data: [{
            "type": "color",
            "biologicalType":"reaction",
            "target": ["rect.reaction"],
            "attrType": "style",
            "attr": "fill",
            "title": "Node background",
            "default": "#FFFFFF",
            "min": "#ffff00",
            "max": "#0000ff",
            "access":"backgroundColor"
        }, {
            "type": "int",
            "biologicalType":"reaction",
            "target": ["rect.reaction", "rect.fontSelected"],
            "attrType": "attrEditor",
            "attr": "width",
            "title": "Width",
            "min": 1,
            "max": 100,
            "default": 5,
            "access":"width"
        }, {
            "type": "int",
            "biologicalType":"reaction",
            "target": ["rect.reaction", "rect.fontSelected"],
            "attrType": "attrEditor",
            "attr": "height",
            "title": "Height",
            "access": "height",
            "min": 1,
            "max": 100,
            "default": 5
        }, {
            "type": "int",
            "biologicalType":"reaction",
            "target": ["rect.reaction", "rect.fontSelected"],
            "attrType": "attr",
            "attr": "rx",
            "access": "rx",
            "title": "Rx",
            "min": 1,
            "max": 100,
            "default": 5
        }, {
            "type": "int",
            "biologicalType":"reaction",
            "target": ["rect.reaction", "rect.fontSelected"],
            "attrType": "attr",
            "attr": "ry",
            "access": "ry",
            "title": "Ry",
            "min": 1,
            "max": 100,
            "default": 5
        }, {
            "type": "float",
            "target": ["rect.reaction", "rect.fontSelected"],
            "attrType": "style",
            "biologicalType":"reaction",
            "attr": "opacity",
            "access": "opacity",
            "title": "Transparency",
            "min": 0.0,
            "max": 1.0,
            "default": 1.0
        }
        ,{
            "type": "color",
            "target": ["rect.reaction", "rect.fontSelected"],
            "attrType": "style",
            "biologicalType":"reaction",
            "attr": "stroke",
            "access": "strokeColor",
            "title": "Border color",
            "min": "#ff0000",
            "max": "#00ffff",
            "default": "#000000"
        }, {
            "type": "int",
            "target": ["rect.reaction", "rect.fontSelected"],
            "attrType": "style",
            "attr": "stroke-width",
            "access": "strokeWidth",
            "biologicalType":"reaction",
            "title": "Border width",
            "min": 0,
            "max": 50,
            "default": 1
        }, {
            "type": "string",
            "target": ["text.reaction"],
            "attrType": "style",
            "attr": "label",
            "access": "label",
            "biologicalType":"reaction",
            "title": "Label",
            "choices":"",
            "default":"name"
        }, {
            "type": "color",
            "target": ["text.reaction"],
            "attrType": "attr",
            "attr": "fill",
            "access": "fontColor",
            "biologicalType":"reaction",
            "title": "Label color",
            "min": "#ff00ff",
            "max": "#00ff00",
            "default": "#000000"
        },{
            "type": "int",
            "target": ["text.reaction"],
            "attrType": "style",
            "attr": "font-size",
            "access": "fontSize",
            "biologicalType":"reaction",
            "title": "Label font size",
            "min": 1,
            "max": 200,
            "default": 20
        },{
            "type": "int",
            "target": ["text.reaction"],
            "attrType": "style",
            "attr": "font-weight",
            "access": "fontWeight",
            "biologicalType":"reaction",
            "title": "Label font weight",
            "min": 100,
            "max": 1000,
            "default": 500
        },{
            "type": "float",
            "target": ["text.reaction"],
            "attrType": "style",
            "attr": "opacity",
            "access": "labelOpacity",
            "title": "Label transparency",
            "min": 0.0,
            "biologicalType":"reaction",
            "max": 1.0,
            "default": 1.0
        }]
    }
});
