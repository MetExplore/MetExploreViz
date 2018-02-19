/**
 * @author MC
 * ButtonImportSideCompounds : Allows side compounds import from a tab file
 */
Ext.define('metExploreViz.view.button.buttonImportSideCompounds.ButtonImportSideCompounds', {
    extend: 'Ext.form.Panel',
    alias:'widget.buttonImportSideCompounds',
	controller : 'buttonImportSideCompounds',
    requires: [
    	'metExploreViz.view.button.buttonImportSideCompounds.ButtonImportSideCompoundsController'
    ],
    hideLabel: true,
    items: [{
        xtype: 'filefield',
        name : 'fileData',
        buttonOnly: true,   
        id : 'IDimportSC',
        reference : 'importSideCompoundsHidden',
        buttonConfig: {
            id : 'IDimportSideCompounds'
        }
    }]
});