/**
 * @author MC
 * (a)description GeneralStyleForm : Reaction style configs
 */
Ext.define('metExploreViz.view.form.reactionStyleForm.ReactionStyleForm', {
    extend: 'metExploreViz.view.form.allStylesByTypeForm.AllStylesByTypeForm',
    alias: 'widget.reactionStyleForm',
    requires: [
        "metExploreViz.view.form.allStylesByTypeForm.AllStylesByTypeForm"
    ],

    store: {
        data: [{
            "type": "color",
            "biologicalType":"reaction",
            "target": ["rect.reaction"],
            "attrType": "style",
            "attr": "fill",
            "title": "Node background",
            "default": "#FFFFFF"
        }, {
            "type": "number",
            "biologicalType":"reaction",
            "target": ["rect.reaction", "rect.fontSelected"],
            "attrType": "attr",
            "attr": "width",
            "title": "Width",
            "min": 1,
            "max": 100,
            "default": 5
        }, {
            "type": "number",
            "biologicalType":"reaction",
            "target": ["rect.reaction", "rect.fontSelected"],
            "attrType": "attr",
            "attr": "height",
            "title": "Height",
            "min": 1,
            "max": 100,
            "default": 5
        }, {
            "type": "number",
            "biologicalType":"reaction",
            "target": ["rect.reaction", "rect.fontSelected"],
            "attrType": "attr",
            "attr": "rx",
            "title": "Rx",
            "min": 1,
            "max": 100,
            "default": 5
        }, {
            "type": "number",
            "biologicalType":"reaction",
            "target": ["rect.reaction", "rect.fontSelected"],
            "attrType": "attr",
            "attr": "ry",
            "title": "Ry",
            "min": 1,
            "max": 100,
            "default": 5
        }, {
            "type": "number",
            "target": ["rect.reaction", "rect.fontSelected"],
            "attrType": "style",
            "biologicalType":"reaction",
            "attr": "opacity",
            "title": "Transparency",
            "min": 0,
            "max": 1,
            "default": 1
        }
            ,{
                "type": "color",
                "target": ["rect.reaction", "rect.fontSelected"],
                "attrType": "style",
                "biologicalType":"reaction",
                "attr": "stroke",
                "title": "Border color",
                "default": "#000000"
            }, {
                "type": "number",
                "target": ["rect.reaction", "rect.fontSelected"],
                "attrType": "style",
                "attr": "stroke-width",
                "biologicalType":"reaction",
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
                "target": ["text.reaction"],
                "attrType": "attr",
                "attr": "fill",
                "biologicalType":"reaction",
                "title": "Label color",
                "default": "#000000"
            }, {
                "type": "number",
                "target": ["text.reaction"],
                "attrType": "style",
                "attr": "font-size",
                "biologicalType":"reaction",
                "title": "Label font size",
                "min": 1,
                "max": 200,
                "default": 20
            }, {
                "type": "number",
                "target": ["text.reaction"],
                "attrType": "style",
                "attr": "opacity",
                "title": "Label transparency",
                "min": 0,
                "biologicalType":"reaction",
                "max": 1,
                "default": 1
            }]
    }
});