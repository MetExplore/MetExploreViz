
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
		view = me.getView();
		if (view.styleType === "int" || view.styleType === "float") {
			view.graphNumberScaleEditor = Object.create(metExploreD3.GraphNumberScaleEditor);
		}
		if (view.styleType === "color") {
			view.graphColorScaleEditor = Object.create(metExploreD3.GraphColorScaleEditor);
		}

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

	/**
	 * Define displayed icons on values in function of selected nodes
	 */
	updateSelectionSet : function() {
		var me = this;
		var view = me.getView();

		// WARNING Header render is executed afterrender view
		// As a result, render and afterrender can't be used on header
		var header = view.down('header');

		if(header){
			var bypassButton = header.lookupReference('bypassButton');
			var colorButtonBypass = header.lookupReference('colorButtonBypass');
			var colorButtonBypassEl = colorButtonBypass.el.dom.querySelector("#html5colorpicker");
			var numberButtonBypass = header.lookupReference('numberButtonBypass');

			var activeSession = _metExploreViz.getSessionById(metExploreD3.GraphNode.activePanel);
			if(activeSession) {

				var mapNodes = activeSession.getSelectedNodes()
					.map(function (nodeId) {
						return activeSession.getD3Data().getNodeById(nodeId);
					})
					.filter(function (n) {
						return n!==undefined
					});

				var selectedNodes = mapNodes.filter(function (node) {
					return node.getBiologicalType()===view.biologicalType;
				});

				var selection = d3.select("#"+metExploreD3.GraphNode.activePanel)
					.select("#D3viz")
					.selectAll("g.node")
					.filter(function (n) { return n.getBiologicalType()===view.biologicalType});

				if(selectedNodes.length>0) {
					bypassButton.enable();
					if(selection){

						var value = metExploreD3.GraphStyleEdition.getCollectionStyleBypass(view.target, view.attrType, view.attrName, view.biologicalType);
						if(value==="multiple" || value==="none") {
							bypassButton.show();
							numberButtonBypass.hide();
							colorButtonBypass.hide();

							if(value==="multiple"){
								if (view.styleType === "float" || view.styleType === "int") {
									numberButtonBypass.fireEvent("setIcon", "mapMultipleNumbers");
								}

								if (view.styleType === "color")
									colorButtonBypass.fireEvent("setIcon", "mapMultipleColors");

							}
							else
							{

								numberButtonBypass.fireEvent("setIcon", "noneIcon");
								colorButtonBypass.fireEvent("setIcon", "noneIcon");
							}
						}
						else
						{

							numberButtonBypass.fireEvent("setIcon", "noneIcon");
							colorButtonBypass.fireEvent("setIcon", "noneIcon");

							if (view.styleType === "float") {
								if (parseFloat(view.default) !== parseFloat(value)){
									numberButtonBypass.show();
									bypassButton.hide();

									me.replaceText(numberButtonBypass.el.dom, parseFloat(value));
								}

							}
							if (view.styleType === "int") {
								if (parseInt(view.default) !== parseInt(value)){
									numberButtonBypass.show();
									bypassButton.hide();

									me.replaceText(numberButtonBypass.el.dom, parseInt(value));
								}
							}
							if (view.styleType === "color") {

								if (view.default !== metExploreD3.GraphUtils.RGBString2Color(value))
								{
									colorButtonBypass.show();
									bypassButton.hide();

									colorButtonBypassEl.setAttribute("value", metExploreD3.GraphUtils.RGBString2Color(value));
								}
							}
						}
					}
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
		}
	},

	updateContinuousCaption : function(){
		var me = this;
		var view = me.getView();

		if(view.styleType==="float"  || view.styleType==="int" ){

			var margin = 0;
			var width = 190;
			var height = 50;

			var svg = d3.select(view.lookupReference('selectConditionForm').lookupReference('scaleCaption').el.dom).select("#scaleCaption");
			svg.selectAll("*").remove();

			svg = d3.select(view.lookupReference('selectConditionForm').lookupReference('scaleCaption').el.dom).select("#scaleCaption");

			view.graphNumberScaleEditor.createNumberScaleCaption(svg, width, height, margin, view.scaleRange);

			svg.on("click", function(){
				var win = Ext.create("metExploreViz.view.form.continuousNumberMappingEditor.ContinuousNumberMappingEditor", {
					height : 300,
					aStyleFormParent : view
				});

				win.show();
			});
		}

		if(view.styleType==="color"){
			var margin = 0;
			var width = 150;
			var height = 50;

			var svg = d3.select(view.lookupReference('selectConditionForm').lookupReference('scaleCaption').el.dom).select("#scaleCaption");
			svg.selectAll("*").remove();

			// var colorRangeCaption = ['#6f867b', '#F6F6F4', '#925D60'];
			// var colorPercentCaption = [0, 50, 100];
			// var colorDomainCaption = [1,2,3];

			svg = d3.select(view.lookupReference('selectConditionForm').lookupReference('scaleCaption').el.dom).select("#scaleCaption");
			view.graphColorScaleEditor.createColorScaleCaption(svg, width, height, margin, view.scaleRange);

			svg.on("click", function(){
				var win = Ext.create("metExploreViz.view.form.continuousColorMappingEditor.ContinuousColorMappingEditor", {
					height : 300,
					aStyleFormParent : view
				});

				win.show();
			});
		}
	},

	updateContinuousMapping : function(){
		var me = this;
		var view = me.getView();

		if(view.styleType==="float"  || view.styleType==="int" ){
			var conditionName = view.lookupReference('selectConditionForm').lookupReference('selectCondition').getValue();
			metExploreD3.GraphMapping.graphMappingContinuousData(conditionName, view);
		}

		if(view.styleType==="color"){
			var conditionName = view.lookupReference('selectConditionForm').lookupReference('selectCondition').getValue();
			metExploreD3.GraphMapping.graphMappingContinuousData(conditionName, view);
		}
	},

	updateDiscreteMapping : function(){
		var me = this;
		var view = me.getView();

		var conditionName = view.lookupReference('selectConditionForm').lookupReference('selectCondition').getValue();

		var selectConditionType = view.lookupReference('selectConditionForm').lookupReference('selectConditionType');
		var dataType = selectConditionType.getValue();
		var session = _metExploreViz.getSessionById("viz");

		if(dataType==="Alias"){
			session.setMappingDataType(dataType);
			metExploreD3.GraphMapping.graphMappingDiscreteData(conditionName, view);
		}

		if(dataType==="Discrete"){
			session.setMappingDataType(dataType);
			metExploreD3.GraphMapping.graphMappingDiscreteData(conditionName, view);
		}

		if(dataType==="As selection"){
			session.setMappingDataType(dataType);
			metExploreD3.GraphMapping.graphMappingAsSelectionData(conditionName, view);
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

		if(!view.default)
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

			view.graphNumberScaleEditor.createNumberScaleCaption(svg, width, height, margin, view.scaleRange);

			svg.on("click", function(){
				var win = Ext.create("metExploreViz.view.form.continuousNumberMappingEditor.ContinuousNumberMappingEditor", {
					height : 300,
					aStyleFormParent : view
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

			var svg = d3.select(view.lookupReference('selectConditionForm').lookupReference('scaleCaption').el.dom).select("#scaleCaption");
			svg.selectAll("*").remove();

			// var colorRangeCaption = ['#6f867b', '#F6F6F4', '#925D60'];
			// var colorPercentCaption = [0, 50, 100];
			// var colorDomainCaption = [1,2,3];

			svg = d3.select(view.lookupReference('selectConditionForm').lookupReference('scaleCaption').el.dom).select("#scaleCaption")
			view.graphColorScaleEditor.createColorScaleCaption(svg, width, height, margin, view.scaleRange);

			svg.on("click", function(){
				var win = Ext.create("metExploreViz.view.form.continuousColorMappingEditor.ContinuousColorMappingEditor", {
					height : 300,
					aStyleFormParent : view
				});

				win.show();
			});

		}

	},

	updateDefaultFormValues : function(){
		var me = this;
		var view = me.getView();

		var styleToUse;
		if(view.biologicalType==="metabolite")
			styleToUse = metExploreD3.getMetaboliteStyle();

		if(view.biologicalType==="reaction")
			styleToUse = metExploreD3.getReactionStyle();

		if(view.biologicalType==="link")
			styleToUse = metExploreD3.getLinkStyle();

		// WARNING Header render is executed afterrender view
		// As a result, render and afterrender can't be used on header
		var header = view.down('header');

		if(header) {
			me.updateSelectionSet();

			if (view.styleType === "float" || view.styleType === "int") {

				var numberButton = header.lookupReference('numberButton');

				numberButton.show();

				me.replaceText(numberButton.el.dom, view.default);
			}

			if (view.styleType === "color") {


				var colorButton = header.lookupReference('colorButton');
				var colorButtonEl = colorButton.el.dom.querySelector("#html5colorpicker");

				colorButtonEl.setAttribute("value", view.default);
				colorButton.show();
			}
		}
	},
	/**
	 * Define listeners to manage each style
	 * @param func
	 */
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
		// if(!view.default)

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
				if(type!=="")
					header.lookupReference('mappingButton').addCls(type);
			},
			scope : me
		});

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
						styleToUse[view.access] = val;
						view.default = val;
						console.log(styleToUse);
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
				setIcon: function(type){
					bypassButton.removeCls('mapMultipleNumbers');
					if(type!=="noneIcon") bypassButton.addCls("mapMultipleNumbers");
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
					view.default = color;
					metExploreD3.GraphStyleEdition.setCollectionStyle(view.target, view.attrType, view.attrName, view.biologicalType, color);

					styleToUse[view.access]=color;

					console.log(styleToUse);
				});

			colorButtonBypass.on({
				setIcon: function(type){
					bypassButton.removeCls('mapMultipleColors');
					if(type!=="noneIcon") bypassButton.addCls("mapMultipleColors");
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

			bypassButton.on({
				click: function(target){
					target.hide();

					colorButtonBypass.show();
					colorButtonBypassEl.click()
				},
				scope : me
			});
		}
	},



	numberPrompt : function(target, func){
		var me = this;
		var view = me.getView();

		Ext.Msg.prompt(view.title, 'Enter a number('+ view.styleType +') '+ view.min +'<= x <= '+ view.max +' :',
			function(btn, text){
				if (btn == 'ok'){
					if(text!="") {
						var min, max, number;
						if(view.styleType==="float"){
							min = parseFloat(view.min);
							max = parseFloat(view.max);
							number = parseFloat(text);
						}

						if(view.styleType==="int"){
							min = parseInt(view.min);
							max = parseInt(view.max);
							number = parseInt(text);
						}

						if(isNaN(number)){
							Ext.Msg.show({
								title:'Warning',
								msg: "Please enter a number between "+view.min+" and "+view.max,
								icon: Ext.Msg.WARNING,
								fn:function(){ me.numberPrompt(target, func); }
							});

						}
						else
						{
							if(min <= number && number <= max){
								me.replaceText(target, number);
								func(number);
							}
							else
							{
								Ext.Msg.show({
									title:'Warning',
									msg: "Please enter a number between "+view.min+" and "+view.max,
									icon: Ext.Msg.WARNING,
									fn:function(){ me.numberPrompt(target, func); }
								});
							}
						}

					}
					else
					{
						Ext.Msg.show({
							title:'Warning',
							msg: "Please enter a number between "+view.min+" and "+view.max,
							icon: Ext.Msg.WARNING,
							fn:function(){ me.numberPrompt(target, func); }
						});
						me.numberPrompt(target, func);
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
	},

	// ValueMapping
	getValueMappingsByType : function(type){
		var view = this.getView();

		type = type.toLowerCase();
		type = type.replace(" ", "");

		switch (type) {
			case 'asselection':
				if(!view.valueAsSelectionMappings) view.valueAsSelectionMappings = [];
				return view.valueAsSelectionMappings;
				break;
			case 'discrete':
				if(!view.valueDiscreteMappings) view.valueDiscreteMappings = [];
				return view.valueDiscreteMappings;
				break;
			case 'alias':
				if(!view.valueAliasMappings) view.valueAliasMappings = [];
				return view.valueAliasMappings;
				break;
			// case 'continuous':
			//
			// 	break;
			default:
				if(!view.valueDiscreteMappings) view.valueDiscreteMappings = [];
				return view.valueDiscreteMappings;
		}


	},
	getValueMappingsSet : function(type){
		var valueMappings = this.getValueMappingsByType(type);
		return valueMappings;
	},
	getValueMappingById : function(type, id){
		var valueMappings = this.getValueMappingsByType(type);
		var theValueMapping = null;
		valueMappings.forEach(function(aValueMapping){
			if(aValueMapping.getName()===id)
				theValueMapping = aValueMapping;
		});
		return theValueMapping;
	},
	getValueMappingsSetLength : function(type){
		var valueMappings = this.getValueMappingsByType(type);
		return valueMappings.length;
	},
	addValueMapping : function(type, n, c){
		var valueMappings = this.getValueMappingsByType(type);
		var newVal = new ValueMapping(n,c);
		if(valueMappings.findIndex(function (valueMap) { return valueMap.getName()===n; })===-1)
			valueMappings.push(newVal);
	}
});

