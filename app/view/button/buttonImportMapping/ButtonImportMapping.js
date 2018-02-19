/**
 * @author MC
 * ButtonImportMapping : Allows mapping import from a tab file
 */
Ext.define('metExploreViz.view.button.buttonImportMapping.ButtonImportMapping', {
    extend: 'Ext.form.Panel',
    alias:'widget.buttonImportMapping',
	controller : 'buttonImportMapping',
    requires: [
    	'metExploreViz.view.button.buttonImportMapping.ButtonImportMappingController'
    ],
    hideLabel: true,
    items: [{
        // Allows opening file manager of client side
        xtype: 'filefield',
        name : 'fileData',
        buttonOnly: true,   
        id : 'IDimport',
        reference : 'importMappingHidden',
        // Allows button GUI
        buttonConfig: {
            id : 'IDimportMapping'
        }
    }]
});