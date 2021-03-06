/**
 * This class is the controller for the main view for the application. It is specified as
 * the "controller" of the Main view class.
 *
 * TODO - Replace this content of this view to suite the needs of your application.
 */
Ext.define('metExploreViz.view.main.MainController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.main',
    stores: [
        'metExploreViz.view.form.selectMapping.MappingStore',
        'mappingStore',
        'metExploreViz.view.form.selectCondition.ConditionStore',
        'conditionStore'

        // TODO: add global / shared stores here
    ],

    onItemSelected: function (sender, record) {
        Ext.Msg.confirm('Confirm', 'Are you sure?', 'onConfirm', this);
    },

    onConfirm: function (choice) {
        if (choice === 'yes') {
            //
        }
    }
});
