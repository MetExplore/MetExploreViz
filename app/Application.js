/**
 * The main application class. An instance of this class is created by app.js when it
 * calls Ext.application(). This is the ideal place to handle application launch and
 * initialization details.
 */
Ext.define('metExploreViz.Application', {
    extend: 'Ext.app.Application',
    
    name: 'metExploreViz',

    stores: [
        'metExploreViz.view.form.selectMapping.MappingStore',
        'mappingStore',
        'metExploreViz.view.form.selectCondition.ConditionStore',
        'conditionStore'

        // TODO: add global / shared stores here
    ],
    
    launch: function () {
        Ext.create('metExploreViz.view.form.selectCondition.ConditionStore');
        Ext.create('metExploreViz.view.form.selectMapping.MappingStore');

        // TODO - Launch the application
    },

    onAppUpdate: function () {
        Ext.Msg.confirm('Application Update', 'This application has an update, reload?',
            function (choice) {
                if (choice === 'yes') {
                    window.location.reload();
                }
            }
        );
    }
});
