/**
 * @author JCG
 * (a)description fluxMappingFormController : Control displaying flux value caption
 */

Ext.define('metExploreViz.view.form.fluxMappingForm.FluxMappingFormController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.form-fluxMappingForm-fluxMappingForm',

    /**
     * Aplies event linsteners to the view
     */
    init:function(){
        var me 		= this,
            viewModel   = me.getViewModel(),
            view      	= me.getView();

        // Regex to remove bad chars in dom ids
        me.regexpPanel=/\.|>|<| |,|\/|=|\(|\)/g;
    },
});
