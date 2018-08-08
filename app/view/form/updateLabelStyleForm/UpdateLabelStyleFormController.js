/**
 * @author Adrien Rohan
 * Controller class for UpdateLabelStyleForm
 */

Ext.define('metExploreViz.view.form.updateLabelStyleForm.UpdateLabelStyleFormController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.form-updateLabelStyleForm-updateLabelStyleForm',


    init : function() {

        this.control({
            'updateLabelStyleForm combobox[action=changeObject]':
                {
                    change : function(that, newValue, oldValue){
                        var newCombo = Ext.getCmp(newValue);
                        if(newCombo)
                            newCombo.setVisible(true);

                        if(oldValue)
                        {
                            var oldCombo = Ext.getCmp(oldValue);
                            if(oldCombo)
                                oldCombo.setVisible(false);
                        }
                    }
                }
        });
    }
});