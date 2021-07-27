/**
 * @author JCG
 * (a)description class to control scale editor for flux values
 */

Ext.define('metExploreViz.view.form.fluxScaleEditor.FluxScaleEditorController', {
	extend: 'Ext.app.ViewController',
	alias: 'controller.form-fluxScaleEditor-fluxScaleEditor',

    /**
     * Aplies event linsteners to the view
     */

    init: function(){
        var me 		= this,
		viewModel   = me.getViewModel(),
		view      	= me.getView();

        view.on({
            afterrender: function(that){
                var width = 450;
                var height = 85;

                var svg = d3.select(that.el.dom).select("#svgScaleEditor");

                var numberButton = view.lookupReference('numberButton');
				var delButton = view.lookupReference('delButton');
				var textfieldValue = view.lookupReference('textfieldValue');

                metExploreD3.GraphNumberScaleEditor.createNumberScaleEditor(
					svg,
					width,
					height,
					numberButton,
					textfieldValue,
					delButton,
					view.scaleRange);
            }
        });

        view.lookupReference('cancelButton').on({
            click: function(){
                view.close();
            }
        });

        view.lookupReference('addButton').on({
			click : function(that){
				metExploreD3.GraphNumberScaleEditor.addNumber();
			}
		});

        view.lookupReference('textfieldValue').on({
			focusleave : function(that){
				var value = parseFloat(that.getRawValue());

				if(value==="< min" || value==="> max")
					that.disable();
				else
				{
					that.enable();
					if(isNaN(parseFloat(value))){
						Ext.Msg.show({
							title:'Warning',
							msg: "Please enter a number.",
							icon: Ext.Msg.WARNING
						});
					}
					else
					{
						metExploreD3.GraphNumberScaleEditor.updateValue(value);
					}
				}
			},
            change: function(that){
                var value = parseFloat(that.getRawValue());
                that.setMinValue(value);
                that.setMaxValue(value);
            }
		});

        view.lookupReference('numberButton').on({
			focusleave : function(that){

				var value = parseFloat(that.getRawValue());

				if(value==="< min" || value==="> max")
					that.disable();
				else
				{
					that.enable();
					if(isNaN(parseFloat(value))){
						Ext.Msg.show({
							title:'Warning',
							msg: "Please enter a number.",
							icon: Ext.Msg.WARNING
						});
					}
					else
					{
						metExploreD3.GraphNumberScaleEditor.updateSize(value);
					}
				}
			}
		});

        view.lookupReference('delButton').on({
			click : function(that){
				metExploreD3.GraphNumberScaleEditor.delNumber();
			}
		});

        view.lookupReference('okButton').on({
			click : function(){
				view.scaleRange = metExploreD3.GraphNumberScaleEditor.getScaleRange();
                metExploreD3.fireEvent("fluxMapping","updateScaleEditor");
				view.close();
			}
		});

        view.lookupReference('resetButton').on({
			click : function(){
                metExploreD3.fireEvent2Arg("fluxMapping", "resetScale", view.cond, view);

                var width = 450;
                var height = 85;

                var svg = d3.select(view.el.dom).select("#svgScaleEditor");

                var numberButton = view.lookupReference('numberButton');
				var delButton = view.lookupReference('delButton');
				var textfieldValue = view.lookupReference('textfieldValue');

                metExploreD3.GraphNumberScaleEditor.createNumberScaleEditor(
					svg,
					width,
					height,
					numberButton,
					textfieldValue,
					delButton,
					view.scaleRange);
			}
		});

    }

});
