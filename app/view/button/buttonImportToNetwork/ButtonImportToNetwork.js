/**
 * @author MC
 * ButtonImportToNetwork : Allows network import from a json file
 */
Ext.define('metExploreViz.view.button.buttonImportToNetwork.ButtonImportToNetwork', {
    extend: 'Ext.form.Panel',
    alias:'widget.buttonImportToNetwork',
	controller : 'buttonImportToNetwork',
    requires: [
    	'metExploreViz.view.button.buttonImportToNetwork.ButtonImportToNetworkController'
    ],
    text: 'Import mapping from tab file',
            
    items: [{
        // Allows opening file manager of client side
        xtype: 'filefield',
        name : 'fileData',
        buttonOnly: true,
        height:'100%',
        width:'100px',
        reference : 'importNetwork',
        // Allows button GUI
        buttonConfig: {
            id : 'IDimportNetwork'
        }
    }],
    hideLabel: true
});
