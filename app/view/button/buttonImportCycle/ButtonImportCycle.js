/**
 * @author Adrien Rohan
 * Allows loading cycle from text file
 */
Ext.define('metExploreViz.view.button.buttonImportCycle.ButtonImportCycle', {
    extend: 'Ext.form.Panel',
    alias:'widget.buttonImportCycle',
    controller : 'buttonImportCycle',
    requires: [
        'metExploreViz.view.button.buttonImportCycle.ButtonImportCycleController'
    ],
    hideLabel: true,
    items: [{
        xtype: 'filefield',
        name : 'fileData',
        buttonOnly: true,
        id : 'IDimportC',
        reference : 'importCycleHidden',
        buttonConfig: {
            id : 'IDimportCycle'
        }
    }]
});