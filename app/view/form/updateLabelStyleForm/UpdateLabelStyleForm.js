/**
 * @author Adrien Rohan
 * A panel including various style options for label
 */
Ext.define('metExploreViz.view.form.updateLabelStyleForm.UpdateLabelStyleForm', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.updateLabelStyleForm',
    requires: [
        "metExploreViz.view.form.allLabelStyleForm.AllLabelStyleForm",
        "metExploreViz.view.form.updateLabelStyleForm.UpdateLabelStyleFormController"
    ],

    controller: "form-updateLabelStyleForm-updateLabelStyleForm",

    height: 200,
    width:'100%',
    margin:'0 0 0 0',
    split:true,
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    animation: true,

    items: [{
        id:'selectLabelObject',
        xtype:'combobox',
        editable: false,
        margin:'5 5 5 5',
        action:'changeObject',
        emptyText:'-- Choose an object --',
        store: [
            ['allLabelStyleForm', 'All'],
            ['selectionLabelStyleForm', 'Selection'],
            ['metaboliteLabelStyleForm', 'Metabolite'],
            ['reactionLabelStyleForm', 'Reaction']
        ]
    }, {
        xtype: 'menuseparator'
    },{
        id:'allLabelStyleForm',
        xtype:'allLabelStyleForm',
        hidden:true
    },{
        id:'selectionLabelStyleForm',
        xtype:'allLabelStyleForm',
        hidden:true
    },{
        id:'metaboliteLabelStyleForm',
        xtype:'allLabelStyleForm',
        hidden:true
    },{
        id:'reactionLabelStyleForm',
        xtype:'allLabelStyleForm',
        hidden:true
    }]
});