
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

				header.lookupReference('mappingButton').on({
					click: function(){
						if(view.collapsed){
							view.expand();
						}
						else{
							view.collapse();
						}
					},
					setIcon: function(type){
						header.lookupReference('mappingButton').removeCls('continue');
						header.lookupReference('mappingButton').removeCls('discrete');
						header.lookupReference('mappingButton').removeCls('alias');
						header.lookupReference('mappingButton').addCls(type);
					},
					scope : me
				});

				header.lookupReference('mappingButton').fireEvent("setIcon", "continue");

				if(view.styleType==="number"){
					var numberButton = header.lookupReference('numberButton');
					var numberButtonBypass = header.lookupReference('numberButtonBypass');
					var numberButtonBypassEl = numberButtonBypass.el.dom.querySelector("#textNumberButton");

					numberButton.show();

					me.resizeText(numberButton.el.dom);

					numberButton.on({
						click: function(){
							me.numberPrompt(numberButton.el.dom);
							// OPEN WINDOWS
						},
						scope : me
					});

					numberButtonBypass.on({
						click: function(){
							me.numberPrompt(numberButtonBypass.el.dom);
							// OPEN WINDOWS
						},
						scope : me
					});

					bypassButton.on({
						click: function(target){
							target.hide();
							numberButtonBypass.show();

							me.replaceText(numberButtonBypass.el.dom, "2000");
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
	numberPrompt : function(target, func){
		var me = this;
		var view = me.getView();

		Ext.Msg.prompt(view.title, 'Enter a number >= 0.0 :',
			function(btn, text){
				if (btn == 'ok'){
					if(text!="") {
						me.replaceText(target, text);
					}
					else
					{
						alert("Please enter a valid number");
						me.numberPrompt(target);
					}
				}
			}, this, false);
	},
	resizeText : function(target){
		d3.select(target).select("#textNumberButton").style("font-size", function(){
			var initialValue = parseFloat(d3.select(this).style("font-size").replace("px", ""));
			correspondingLenght = this.getComputedTextLength();
			attendingLenght = 30;

			return Math.min(attendingLenght*initialValue/correspondingLenght-2, 15);
		});
	},
	replaceText : function(target, text){
		var me = this;
		d3.select(target).select("#textNumberButton")
			.text(text);
		me.resizeText(target);
	}

});

