/**
 * @author MC
 * (a)description class to control caption selection
 * C_SelectComponent
 */

Ext.define('metExploreViz.view.form.selectComponent.SelectComponentController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.form-selectComponent-selectComponent',

    /**
     * Aplies event linsteners to the view
     */
    init:function(){
        var me 		= this,
            view   	= me.getView();

        view.on({
            jsoninit : function(componentJSON){
                me.initCaption(componentJSON);
            },
            change : function(that, newComponent){
                me.changeCaption(newComponent);
            },
            scope:me
        });
    },

    changeCaption:function(component){
        switch(component) {
            case "Pathways":
                Ext.getCmp("captionForm")
                    .fireEvent("afterColorCalculating");
                break;
            case "Compartments":
                Ext.getCmp("captionForm")
                    .fireEvent("afterColorCalculating");
                break;
            default:
                var generalStyle = _metExploreViz.getGeneralStyle();
                generalStyle.setDisplayCaption(false);
                metExploreD3.GraphCaption.majCaption();
        }
    },

    initCaption:function(componentJSON){

        console.log(componentJSON);

        var comboComponent = Ext.getCmp('selectComponentVisu');

        var store = comboComponent.getStore();

        store.add(componentJSON);

        if(store.getCount()===1)
            comboComponent.setDisabled(false);
    }
});