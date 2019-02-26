/**
 * @author FJ
 * ButtonImportGML : Allows importing coordinates from a GML file
 */
Ext.define('metExploreViz.view.button.buttonImportGML.ButtonImportGML', {
    extend: 'Ext.form.Panel',
    alias:'widget.buttonImportGML',
	controller : 'buttonImportGML',
    requires: [
    	'metExploreViz.view.button.buttonImportGML.ButtonImportGMLController'
    ],
    hideLabel: true,
    items: [{
        xtype: 'filefield',
        name : 'fileData',
        buttonOnly: true,
        reference : 'importGML',
        buttonConfig: {
            id : 'IDimportGML'
        }
    }]
});