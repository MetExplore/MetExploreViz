/**
 * @author MC
 * (a)description combobox to select condition in mapping
 * label
 */
Ext.define('metExploreViz.view.form.label.Label', {
    extend: 'Ext.window.Window',
	alias: 'widget.label',
	requires: [
	    "metExploreViz.view.form.label.LabelController"
    ],
    controller: "form-label-label",

    height: "200px",
    maxWidth: 600,
    minWidth: 600,
    x: 100,
    y: 100,
    maxHeight: 200,
    minHeight: 200,
    layout:{
        type:'vbox',
        align:'stretch'
    },
    items: [
        {
            xtype: "combobox",
            reference: "selectLabel",
            displayField: 'name',
            valueField: 'name',
            width: 150,
            queryMode: 'local',
            multiSelect:false,
            editable:false,
            emptyText:'-- Select label --',
            margin:'5 5 5 5'
        },
        {
            xtype: "panel",
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