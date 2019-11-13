
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


		view.lookupReference('selectConditionForm').lookupReference('selectConditionType').on({
			change : function(that, newVal){
				console.log(newVal);
			}
		});

		view.on(
		{
			afterStyleLoading : me.updateFormValues,
			updateSelectionSet : me.updateSelectionSet,
			afterrender: me.initForm,
			expand: function (panel) {
				var header = panel.down('header');
				header.lookupReference('mappingButton').addCls('focus');
			},
			collapse: function (panel) {
				var header = panel.down('header');
				header.lookupReference('mappingButton').removeCls('focus');
			},
			scope:me
		});
	},

	updateSelectionSet : function() {
		var me = this;
		var view = me.getView();

		// WARNING Header render is executed afterrender view
		// As a result, render and afterrender can't be used on header
		var header = view.down('header');

		var bypassButton = header.lookupReference('bypassButton');
		var colorButtonBypass = header.lookupReference('colorButtonBypass');
		var numberButtonBypass = header.lookupReference('numberButtonBypass');

		var activeSession = _metExploreViz.getSessionById(metExploreD3.GraphNode.activePanel);
		if(activeSession) {

			var mapNodes = activeSession.getSelectedNodes().map(function (nodeId) {
				return activeSession.getD3Data().getNodeById(nodeId);
			});

			var selection;
			if(view.biologicalType==="metabolite"){
				selection = mapNodes.filter(function (node) {
					return node.getBiologicalType()==="metabolite";
				});
			}

			if(view.biologicalType==="reaction"){
				selection = mapNodes.filter(function (node) {
					return node.getBiologicalType()==="reaction";
				});
			}


			if(selection.length>0) {
				bypassButton.enable();
			}
			else {
				bypassButton.show();
				numberButtonBypass.hide();
				colorButtonBypass.hide();
				bypassButton.disable();
			}
		}
		else {
			bypassButton.show();
			numberButtonBypass.hide();
			colorButtonBypass.hide();
			bypassButton.disable();
		}
	},

	updateFormValues : function(){
		var me = this;
		var view = me.getView();

		var styleToUse;
		if(view.biologicalType==="metabolite")
			styleToUse = metExploreD3.getMetaboliteStyle();

		if(view.biologicalType==="reaction")
			styleToUse = metExploreD3.getReactionStyle();

		if(view.biologicalType==="link")
			styleToUse = metExploreD3.getLinkStyle();

		view.default = styleToUse[view.access];

		// WARNING Header render is executed afterrender view
		// As a result, render and afterrender can't be used on header
		var header = view.down('header');


		me.updateSelectionSet();

		header.lookupReference('mappingButton').fireEvent("setIcon", "continue");

		if(view.styleType==="float"  || view.styleType==="int" ){

			var numberButton = header.lookupReference('numberButton');

			numberButton.show();

			me.replaceText(numberButton.el.dom, view.default);

			var margin = 0;
			var width = 190;
			var height = 50;

			var svg = d3.select(view.lookupReference('scaleCaption').el.dom).select("#scaleCaption");

			metExploreD3.GraphNumberScaleEditor.createNumberScaleCaption(svg, width, height, margin);

			svg.on("click", function(){
				var win = Ext.create("metExploreViz.view.form.continuousNumberMappingEditor.ContinuousNumberMappingEditor", {
					height : 300
				});

				win.show();
			});
		}

		if(view.styleType==="color"){


			var colorButton = header.lookupReference('colorButton');
			var colorButtonEl = colorButton.el.dom.querySelector("#html5colorpicker");
			var colorButtonBypass = header.lookupReference('colorButtonBypass');
			var colorButtonBypassEl = colorButtonBypass.el.dom.querySelector("#html5colorpicker");

			colorButtonEl.setAttribute("value", view.default);
			colorButton.show();

			var margin = 0;
			var width = 150;
			var height = 50;

			var svg = d3.select(view.lookupReference('scaleCaption').el.dom).select("#scaleCaption");
			svg.selectAll("*").remove();

			metExploreD3.GraphColorScaleEditor.createColorScaleCaption(svg, width, height, margin, colorButtonEl);

			svg.on("click", function(){
				var win = Ext.create("metExploreViz.view.form.continuousColorMappingEditor.ContinuousColorMappingEditor", {
					height : 300
				});

				win.show();
			});

		}

	},

	initForm : function(func){
		var me = this;
		var view = me.getView();


		var styleToUse;
		if(view.biologicalType==="metabolite")
			styleToUse = metExploreD3.getMetaboliteStyle();

		if(view.biologicalType==="reaction")
			styleToUse = metExploreD3.getReactionStyle();

		if(view.biologicalType==="link")
			styleToUse = metExploreD3.getLinkStyle();

		view.default = styleToUse[view.access];

		// WARNING Header render is executed afterrender view
		// As a result, render and afterrender can't be used on header
		var header = view.down('header');

		var bypassButton = header.lookupReference('bypassButton');

		var activeSession = _metExploreViz.getSessionById(metExploreD3.GraphNode.activePanel);

		if(activeSession) {
			if(activeSession.getSelectedNodes().length>0) {
				bypassButton.enable();
			}
			else {
				bypassButton.disable();
			}
		}
		else {
			bypassButton.disable();
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
			setIcon: function(type){
				header.lookupReference('mappingButton').removeCls('continue');
				header.lookupReference('mappingButton').removeCls('discrete');
				header.lookupReference('mappingButton').removeCls('alias');
				header.lookupReference('mappingButton').addCls(type);
			},
			scope : me
		});

		header.lookupReference('mappingButton').fireEvent("setIcon", "continue");

		if(view.styleType==="float"  || view.styleType==="int" ){

			var numberButton = header.lookupReference('numberButton');
			var numberButtonBypass = header.lookupReference('numberButtonBypass');
			var numberButtonBypassEl = numberButtonBypass.el.dom.querySelector("#textNumberButton");

			numberButton.show();

			me.replaceText(numberButton.el.dom, view.default);

			numberButton.on({
				click: function(){
					me.numberPrompt(numberButton.el.dom, function(text){
						var val = text;
						if(view.styleType==="int")
							val = parseInt(text);
						if(view.styleType==="float")
							val = parseFloat(text);

						metExploreD3.GraphStyleEdition.setCollectionStyle(view.target, view.attrType, view.attrName, view.biologicalType, val);
						styleToUse[view.access]=val;
					});
				},
				scope : me
			});


			function setValueWithPrompt(){
				me.numberPrompt(numberButtonBypass.el.dom, function(text){
					var val = text;
					if(view.styleType==="int")
						val = parseInt(text);
					if(view.styleType==="float")
						val = parseFloat(text);

					var bypass = true;
					metExploreD3.GraphStyleEdition.setCollectionStyleBypass(view.target, view.attrType, view.attrName, view.biologicalType, val, bypass);
				});
			}
			numberButtonBypass.on({
				click: function(){
					setValueWithPrompt();
				},
				scope : me
			});

			bypassButton.on({
				click: function(target){
					target.hide();
					numberButtonBypass.show();
					setValueWithPrompt();
				},
				scope : me
			});

			var margin = 0;
			var width = 190;
			var height = 50;

			var svg = d3.select(view.lookupReference('scaleCaption').el.dom).select("#scaleCaption");

			metExploreD3.GraphNumberScaleEditor.createNumberScaleCaption(svg, width, height, margin);

			svg.on("click", function(){
				var win = Ext.create("metExploreViz.view.form.continuousNumberMappingEditor.ContinuousNumberMappingEditor", {
					height : 300
				});

				win.show();
			});
		}

		if(view.styleType==="color"){


			var colorButton = header.lookupReference('colorButton');
			var colorButtonEl = colorButton.el.dom.querySelector("#html5colorpicker");
			var colorButtonBypass = header.lookupReference('colorButtonBypass');
			var colorButtonBypassEl = colorButtonBypass.el.dom.querySelector("#html5colorpicker");

			colorButtonEl.setAttribute("value", view.default);
			colorButtonBypassEl.setAttribute("value", view.default);

			colorButton.show();

			colorButtonEl
				.addEventListener("change", function (evt) {
					var color = evt.target.value;
					colorButtonEl.setAttribute("value", color);

					metExploreD3.GraphStyleEdition.setCollectionStyle(view.target, view.attrType, view.attrName, view.biologicalType, color);

					styleToUse[view.access]=color;
				});

			bypassButton.on({
				click: function(target){
					target.hide();

					colorButtonBypass.show();
					colorButtonBypassEl.click()
				},
				scope : me
			});

			colorButtonBypassEl
				.addEventListener("change", function (evt, newVal) {

					var color = evt.target.value;
					colorButtonBypassEl.setAttribute("value", color);

					var bypass = true;
					metExploreD3.GraphStyleEdition.setCollectionStyleBypass(view.target, view.attrType, view.attrName, view.biologicalType, color, bypass);
				});

			var margin = 0;
			var width = 150;
			var height = 50;

			var svg = d3.select(view.lookupReference('scaleCaption').el.dom).select("#scaleCaption");

			metExploreD3.GraphColorScaleEditor.createColorScaleCaption(svg, width, height, margin, colorButtonEl);

			svg.on("click", function(){
				var win = Ext.create("metExploreViz.view.form.continuousColorMappingEditor.ContinuousColorMappingEditor", {
					height : 300
				});

				win.show();
			});

		}

	},
	numberPrompt : function(target, func){
		var me = this;
		var view = me.getView();

		Ext.Msg.prompt(view.title, 'Enter a number >= 0.0 :',
			function(btn, text){
				if (btn == 'ok'){
					if(text!="") {
						me.replaceText(target, text);
						func(text);
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

