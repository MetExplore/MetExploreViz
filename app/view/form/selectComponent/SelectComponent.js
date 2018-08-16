/**
 * @author MC
 * (a)description selection of pathway or compartments
 * SelectComponent
 */
Ext.define('metExploreViz.view.form.selectComponent.SelectComponent', {
        extend: 'Ext.form.field.ComboBox',
        alias: 'widget.selectComponent',
        requires: [
                "metExploreViz.view.form.selectComponent.SelectComponentController",
                "metExploreViz.view.form.selectComponent.SelectComponentModel"
        ],
        controller: "form-selectComponent-selectComponent",
        viewModel: {
            type: "form-selectComponent-selectComponent"
        },
        store: {
            fields: ['name']
        },
        listeners: {
            render: function(c) {
                new Ext.ToolTip({
                    target: c.getEl(),
                    html: 'Select a component'
                });
            }
        }, 
        displayField: 'name',
        valueField: 'name',
        width: 150,
        queryMode: 'local',
        multiSelect:false,
        editable:false,
        emptyText:'-- Select Component --',
        margin:'5 0 5 0'
});