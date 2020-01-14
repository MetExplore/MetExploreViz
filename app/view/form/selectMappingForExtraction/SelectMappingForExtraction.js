/**
 * @author MC
 * (a)description combobox to select condition in mapping
 * selectMappingForExtraction
 */
Ext.define('metExploreViz.view.form.selectMappingForExtraction.SelectMappingForExtraction', {
    extend: 'Ext.window.Window',
	alias: 'widget.selectMappingForExtraction',
	requires: [
	    "metExploreViz.view.form.selectMappingForExtraction.SelectMappingForExtractionController"
    ],
    controller: "form-selectMappingForExtraction-selectMappingForExtraction",

    title: 'Continuous color scale mapping editor',
    height: "400px",
    maxWidth: 600,
    minWidth: 600,
    x: 100,
    y: 100,
    maxHeight: 365,
    minHeight: 365,
    layout:{
        type:'vbox',
        align:'stretch'
    },
    items: [
        {
            margin: "10 10 10 10",
            xtype: "selectMapping",
            multiSelect: true,
            reference: "selectMappingForExtraction"
        },
        {
            xtype: "panel",
            reference: "buttonPanel",
            layout:{
                type:'hbox',
                pack : 'end'
            },
            items:[
                {
                    margin: "5 5 5 5",
                    xtype: 'button',
                    reference: 'okButton',
                    text : 'OK'
                },
                {
                    margin: "5 15 5 5",
                    xtype: 'button',
                    reference: 'cancelButton',
                    text : 'Cancel'
                }
            ]
        }
    ]
});