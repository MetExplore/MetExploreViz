
/**
 * @author MC
 * @description class to control settings or configs
 */

Ext.define('metExploreViz.view.form.aStyleForm.AStyleFormController', {
	extend: 'Ext.app.ViewController',
	alias: 'controller.form-aStyleForm-aStyleForm',

	/**
	 * Init function Checks the changes on drawing style
	 */
	init : function() {
		var me 		= this,
		viewModel   = me.getViewModel(),
		view      	= me.getView();

		view.on(
		{
			afterrender: function (panel) {

				// WARNING Header render is executed afterrender view
				// As a result, render and afterrender can't be used on header
				var header = panel.down('header');

				var bypassButton = header.lookupReference('bypassButton');

				if(view.styleType==="number"){
					var numberButton = header.lookupReference('numberButton');
					var numberButtonBypass = header.lookupReference('numberButtonBypass');
					var numberButtonBypassEl = numberButtonBypass.el.dom.querySelector("#textNumberButton");

					numberButton.show();

					me.resizeText(numberButton.el.dom);

					numberButton.on({
						click: function(){
							// OPEN WINDOWS
						},
						scope : me
					});

					bypassButton.on({
						click: function(target){
							target.hide();
							numberButtonBypassEl.setAttribute("value", "20");
							numberButtonBypass.show();

							me.resizeText(numberButtonBypass.el.dom);
						},
						scope : me
					});
				}

				if(view.styleType==="color"){
					var colorButton = header.lookupReference('colorButton');
					var colorButtonEl = colorButton.el.dom.querySelector("#html5colorpicker");
					var colorButtonBypass = header.lookupReference('colorButtonBypass');
					var colorButtonBypassEl = colorButtonBypass.el.dom.querySelector("#html5colorpicker");

					colorButton.show();

					colorButtonEl
						.addEventListener("change", function (evt) {
							var color = evt.target.value;
							colorButtonEl.setAttribute("value", color);
						});

					bypassButton.on({
						click: function(target){
							target.hide();
							colorButtonBypassEl.setAttribute("value", "#666666");
							colorButtonBypass.show();
						},
						scope : me
					});

					colorButtonBypassEl
						.addEventListener("change", function (evt, newVal) {
							console.log(this);
							console.log(newVal);
							console.log(evt);
						});
				}
				
				header.lookupReference('mappingButton').on({
					click: function(){
						if(view.collapsed){
							view.expand();
						}
						else{
							view.collapse();
						}
					},
					scope : me
				});
			},
			expand: function (panel) {
				var header = panel.down('header');
				header.lookupReference('mappingButton').addCls('focus');
			},
			collapse: function (panel) {
				var header = panel.down('header');
				header.lookupReference('mappingButton').removeCls('focus');
			}
		});
	},

	resizeText : function(target){
		d3.select(target).select("#textNumberButton").style("font-size", function(){
			var initialValue = parseFloat(d3.select(this).style("font-size").replace("px", ""));
			correspondingLenght = this.getComputedTextLength();
			attendingLenght = 30;

			return Math.min(attendingLenght*initialValue/correspondingLenght-2, 15);
		});
	}

});

