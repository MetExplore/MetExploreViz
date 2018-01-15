/**
 * @author MC
 * @description class to control contion selection panel
 * C_SelectComponent
 */

Ext.define('metExploreViz.view.form.selectComponent.SelectComponentController', {
	extend: 'Ext.app.ViewController',
	alias: 'controller.form-selectComponent-selectComponent',

	// config : {
	// 	stores : [ 'S_ComponentInfo' ],
	// 	views : [ 'view.form.SelectComponent']
	// },
	/**
 * Aplies event linsteners to the view
 */
	init:function(){
		var me 		= this,
		viewModel   = me.getViewModel(),
		view      	= me.getView();

		view.on({
			jsoninit : function(componentJSON){
				me.initCaption(componentJSON);
			},
			removecomponent : function(component){
				me.removeCaption(component);
			},
            change : function(that, newComponent, old){
                me.changeCaption(newComponent);
            },
			scope:me
		});
	},

    setCaption:function(componentJSON){
        console.log('set caption');
    },
    changeCaption:function(component){
        console.log('change selected component');

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

		if(store.getCount()==1)
			comboComponent.setDisabled(false);
    }
});