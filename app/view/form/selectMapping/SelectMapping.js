/**
 * @author MC
 * (a)description selection panel
 * SelectMapping
 */
Ext.define('metExploreViz.view.form.selectMapping.SelectMapping', {
        extend: 'Ext.form.field.ComboBox',
        alias: 'widget.selectMapping',
        requires: [
                "metExploreViz.view.form.selectMapping.SelectMappingController",
                "metExploreViz.view.form.selectMapping.MappingStore",
                "metExploreViz.view.form.selectMapping.SelectMappingModel"
        ],
        controller: "form-selectMapping-selectMapping",
        viewModel: {
            type: "form-selectMapping-selectMapping"
        },
    listeners: {
        beforerender: function(c) {
            this.setStore(Ext.getStore("mappingStore"));
        },
        render: function(c) {
            new Ext.ToolTip({
                target: c.getEl(),
                html: 'Select a mapping'
            });
        }
    },
    displayField: 'name',
    valueField: 'name',
    width: 150,
    queryMode: 'local',
    multiSelect:false,
    editable:false,
    emptyText:'-- Select Mapping --',
    margin:'5 0 5 0'
});