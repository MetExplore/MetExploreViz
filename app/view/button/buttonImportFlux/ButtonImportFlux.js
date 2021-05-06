/**
 * @author JCG
 * ButtonImportFlux : Allows flux data import from a tab file
 */
Ext.define('metExploreViz.view.button.buttonImportFlux.ButtonImportFlux', {
    extend: 'Ext.form.Panel',
    alias:'widget.buttonImportFlux',
	controller : 'buttonImportFlux',
    requires: [
    	'metExploreViz.view.button.buttonImportFlux.ButtonImportFluxController'
    ],
    hideLabel: true,
    items: [{
        // Allows opening file manager of client side
        xtype: 'filefield',
        name : 'fileData',
        buttonOnly: true,
        id : 'IDimportFL',
        reference : 'importFluxHidden',
        // Allows button GUI
        buttonConfig: {
            id : 'IDimportFlux'
        }
    }]
});
