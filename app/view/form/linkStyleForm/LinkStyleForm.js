/**
 * @author MC
 * (a)description GeneralStyleForm : Link style configs
 */
Ext.define('metExploreViz.view.form.linkStyleForm.LinkStyleForm', {
    extend: 'metExploreViz.view.form.allStylesByTypeForm.AllStylesByTypeForm',
    alias: 'widget.linkStyleForm',
    requires: [
        "metExploreViz.view.form.allStylesByTypeForm.AllStylesByTypeForm"
    ],

    store: {
        data: [{
            "type": "color",
            "biologicalType":"link",
            "target": [".link"],
            "attrType": "style",
            "attr": "stroke",
            "access":"strokeColor",
            "title": "Link color",
            "default": "#FFFFFF"
        }, {
            "type": "int",
            "biologicalType":"link",
            "target": [".link"],
            "attrType": "style",
            "access":"lineWidth",
            "attr": "stroke-width",
            "title": "Width",
            "min": 0,
            "max": 50,
            "default": 4
        }, {
            "type": "float",
            "biologicalType":"link",
            "target": [".link"],
            "attrType": "style",
            "attr": "opacity",
            "access":"opacity",
            "title": "Transparency",
            "default": 1,
            "min": 0,
            "max": 1
        },
            //     {
            //     "type": "text",
            //     "attr": "text",
            //     "title": "Label"
            // },
            {
                "type": "color",
                "biologicalType":"link",
                "target": ["text.link"],
                "attrType": "style",
                "access":"fontColor",
                "attr": "fill",
                "title": "Label color",
                "default": "#000000"
            }, {
                "type": "int",
                "target": ["text.link"],
                "attrType": "style",
                "attr": "font-size",
                "access":"fontSize",
                "biologicalType":"link",
                "title": "Label font size",
                "min": 1,
                "max": 200,
                "default": 20
            }, {
                "type": "float",
                "target": ["text.link"],
                "attrType": "style",
                "access":"labelOpacity",
                "attr": "opacity",
                "title": "Label transparency",
                "min": 0.0,
                "biologicalType":"link",
                "max": 1.0,
                "default": 1.0
            }]
    }
});
