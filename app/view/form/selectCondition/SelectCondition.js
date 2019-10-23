/**
 * @author MC
 * (a)description combobox to select condition in mapping
 * selectCondition
 */
Ext.define('metExploreViz.view.form.selectCondition.SelectCondition', {
    extend: 'Ext.form.field.ComboBox',
	alias: 'widget.selectCondition',
	requires: [
	    "metExploreViz.view.form.selectCondition.SelectConditionController",
        "metExploreViz.view.form.selectCondition.ConditionStore"
    ],
    controller: "form-selectCondition-selectCondition",
    store: Ext.create('metExploreViz.view.form.selectCondition.ConditionStore'),
    listeners: {
        render: function(c) {
            new Ext.ToolTip({
                target: c.getEl(),
                html: 'Select a condition'
            });
        }
    }, 
    flex:1,
	displayField: 'name',
	valueField: 'name',
	queryMode: 'local',
	editable:false,
	emptyText:'-- Select a condition --',
	margin:'5 0 5 0',
	anyMatch : true
});