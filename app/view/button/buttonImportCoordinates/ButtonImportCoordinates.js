/**
 * @author MC
 * ButtonImportCoordinates : Allows side compounds import from a tab file
 */
Ext.define('metExploreViz.view.button.buttonImportCoordinates.ButtonImportCoordinates', {
    extend: 'Ext.form.Panel',
    alias:'widget.buttonImportCoordinates',
	controller : 'buttonImportCoordinates',
    requires: [
    	'metExploreViz.view.button.buttonImportCoordinates.ButtonImportCoordinatesController'
    ],
    hideLabel: true,
    items: [{
        xtype: 'filefield',
        name : 'fileData',
        buttonOnly: true,
        reference : 'importCoordinates',
        buttonConfig: {
            id : 'IDimportCoordinates'
        }
    }]
});