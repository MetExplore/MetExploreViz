/**
 * @author MC
 * (a)description combobox to select condition in mapping
 * linkStyles
 */
Ext.define('metExploreViz.view.form.linkStyles.LinkStyles', {
    extend: 'Ext.window.Window',
	alias: 'widget.linkStyles',
	requires: [
	    "metExploreViz.view.form.linkStyles.LinkStylesController"
    ],
    controller: "form-linkStyles-linkStyles",

    height: "400px",
    maxWidth: 600,
    minWidth: 600,
    x: 100,
    y: 100,
    maxHeight: 460,
    minHeight: 460,
    layout:{
        type:'vbox',
        align:'stretch'
    },
    items: [
        {
            xtype: "combobox",
            reference: "selectStyles",
            displayField: 'name',
            valueField: 'name',
            width: 150,
            queryMode: 'local',
            multiSelect:true,
            editable:false,
            emptyText:'-- Select styles to link --',
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