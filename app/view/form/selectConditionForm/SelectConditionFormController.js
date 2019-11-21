/**
 * @author MC
 * (a)description class to control contion selection panel and to draw mapping in the mapping story
 */

Ext.define('metExploreViz.view.form.selectConditionForm.SelectConditionFormController', {
	extend: 'Ext.app.ViewController',
	alias: 'controller.form-selectConditionForm-selectConditionForm',
	requires: [
		"metExploreViz.view.form.continuousColorMappingEditor.ContinuousColorMappingEditor"
	],
	/**
	 * Aplies event linsteners to the view
	 */
	init:function(){
		var me 		= this,
		view      	= me.getView();

    	me.regexpPanel=/[.>< ,\/=()]/g;
		// Action to launch mapping on  the visualization
		view.on({
			afterDiscreteMapping : this.addMappingCaptionForm,
			scope:me
		});

		view.on({
			afterContinuousMapping : this.addMappingCaptionForm,
			scope:me
		});

		view.on({
			afterSuggestionMapping : this.addMappingCaptionForm,
			scope:me
		});

		view.on({
			closeMapping : function(newMapping){
				me.closeMapping(newMapping);
			},
			scope:me
		});

		view.on({
			resetMapping : function(){
				me.resetMapping();
			},
			scope:me
		});

		view.on({
			removeMapping : function(removedMapping){
				me.removeMapping(removedMapping);
			},
			scope:me
		});

		view.on({
			reset : function(newMapping){
			},
			scope:me
		});

		view.lookupReference('selectConditionType').on({
			change : function(that, newVal, old){
				var viewAStyleForm = me.getAStyleFormParent();

				this.map(newVal, old, viewAStyleForm);
			},
			scope:me
		});


		view.lookupReference('selectCondition').on({
			// change : function(that, newVal, old){
			// 	var type = view.lookupReference('selectConditionType').lastValue;
			// 	if(type!=="Flux"){
			// 		if(old)
			// 		{
			// 			var i = newVal.indexOf(old[0]);
			// 			if(i!==-1)
			// 			{
			// 				newVal.splice(i, 1);
			// 			}
			// 			view.lookupReference('selectCondition').setValue(newVal[0]);
			// 		}
			// 		view.lookupReference('selectCondition').collapse();
			// 	}
			// 	else
			// 	{
			// 		if(newVal>2){
			// 			newVal.splice(0,1);
			// 			view.lookupReference('selectCondition').setValue(newVal);
			// 		}
			// 	}
			// },
			change : function(that, newVal, old){
				this.map(newVal, old, me.getAStyleFormParent());
			},
			scope:me
		});

		view.lookupReference('delCondition').on({
			click : function(){
				me.closeMapping();
				view.lookupReference('selectConditionType').setValue(null);
				view.lookupReference('selectCondition').setValue(null);
			},
			scope:me
		});
	},

    /*******************************************
     * Remove all mapping in visualisation and in side panel
     */
	removeMapping:function(mapping){
		var me = this;
		var view = me.getView();
		var session = _metExploreViz.getSessionById('viz');
		var component = Ext.getCmp("selectConditionForm");
		if(component){

        	// Remove mapping caption
            mapping.getConditions().filter(function (c) { return c!=="PathwayCoverage" && c!=="PathwayEnrichment" }).forEach(function (cond) {
				var color = session.getColorSuggestionById(mapping.getName()+cond);

				if(color!=null){

                    var newId = color.getName().toString().replace(me.regexpPanel, "_");
                    me.removeMappingSuggestion(newId);
                    session.removeColorSuggestionById(newId);
                    var newId = color.getName().toString().replace(me.regexpPanel, "_");

                    if(Ext.getCmp("selectConditionForm").down("#mappingCaptionForm"+newId))
                        Ext.getCmp("selectConditionForm").down("#mappingCaptionForm"+newId).close();
				}
            });

            if(Ext.getCmp("selectConditionForm").down("#undefined"))
                Ext.getCmp("selectConditionForm").down("#undefined").close();

            if(session.getColorSuggestionsSetLength()==0){
                var container = Ext.getCmp('suggestions');

                if(container){
                    container.close();
                }
        	}


            var activeMapping = session.getActiveMapping();
	        if(activeMapping === mapping.getName()){
				var storeCond = Ext.getStore('S_Condition');
				var oldMapping = session.isMapped();

				this.removeGraphMapping(oldMapping);
				if(oldMapping!== false && oldMapping!== "false" && oldMapping!== "none"){


					if(session.getMappingDataType()==="Continuous"){
						var colorStore = aStyleFormParent.getController().getValueMappingsSet();
				        var newColor = aStyleFormParent.getController().getValueMappingsSetLength()===0;
				        
				        if(!newColor){
				        	colorStore = [];
				        }
				    }
                    var container;
					if(session.getMappingDataType()==="Flux"|| Array.isArray(session.isMapped()))
						container = Ext.getCmp('panel'+session.isMapped()[0].replace(me.regexpPanel, ""));
					else
                        container = Ext.getCmp('panel'+session.isMapped().replace(me.regexpPanel, ""));

					if(container){
						container.close();
						var colorStore = aStyleFormParent.getController().getValueMappingsSet();
						colorStore.forEach(function(color){
							var newId = color.getName().toString().replace(me.regexpPanel, "_");
							if(Ext.getCmp("selectConditionForm").down("#mappingCaptionForm"+newId))
								Ext.getCmp("selectConditionForm").down("#mappingCaptionForm"+newId).close();
						});

						if(Ext.getCmp("selectConditionForm").down("#undefined"))
							Ext.getCmp("selectConditionForm").down("#undefined").close();
					}
				}

				session.setMapped('false');

				var comboCond = Ext.getCmp('selectCondition');
				var thresholdField = view.lookupReference('threshold');
				var opacity = view.lookupReference('opacity');
				var valueonarrow = view.lookupReference('valueonarrow');
                var regroupValuesIntoClass = view.lookupReference('regroupValuesIntoClass');

				var storeCond = comboCond.getStore();
		        //take an array to store the object that we will get from the ajax response
				var record = [];
		        storeCond.loadData(record, false);

				var selectConditionType = Ext.getCmp('selectConditionType');

				comboCond.clearValue();
				comboCond.setDisabled(true);
				selectConditionType.setDisabled(true);
                selectConditionType.clearValue();
                thresholdField.hide();
                valueonarrow.hide();
                regroupValuesIntoClass.hide();
                opacity.hide();
	        }
        	metExploreD3.fireEventArg('selectMappingVisu', "removemapping", mapping);
        	_metExploreViz.removeMapping(mapping.getId());
	    }

	},

    /*******************************************
     * Remove all mapping in visualisation and in side panel
     */
	resetMapping:function(){
		var session = _metExploreViz.getSessionById('viz');
		var component = Ext.getCmp("selectConditionForm");
		var me = this;
        var view = me.getView();
        if(component){
            var colors = session.getColorSuggestionsSet();
            colors.forEach(function (color) {

				var newId = color.getName().toString().replace(me.regexpPanel, "_");
				me.removeMappingSuggestion(newId);
				session.removeColorSuggestionById(newId);

				if(Ext.getCmp("selectConditionForm").down("#mappingCaptionForm"+newId))
					Ext.getCmp("selectConditionForm").down("#mappingCaptionForm"+newId).close();
            });

            if(Ext.getCmp("selectConditionForm").down("#undefined"))
                Ext.getCmp("selectConditionForm").down("#undefined").close();

			var container = Ext.getCmp('suggestions');

			if(container){
				container.close();
			}

           // Remove mapping caption
			var oldMapping = session.isMapped();

			this.removeGraphMapping(oldMapping);

			if(session.getMappingDataType()==="Continuous"){
				var colorStore = aStyleFormParent.getController().getValueMappingsSet();
		        var newColor = aStyleFormParent.getController().getValueMappingsSetLength()===0;

		        if(!newColor){
		        	colorStore = [];
		        }
		    }
            var container;
			if(session.getMappingDataType()==="Flux"|| Array.isArray(session.isMapped()))
				container = Ext.getCmp('panel'+session.isMapped()[0].replace(me.regexpPanel, ""));
			else
				container = Ext.getCmp('panel'+session.isMapped().replace(me.regexpPanel, ""));
			
			if(container){
				container.close();
				var colorStore = aStyleFormParent.getController().getValueMappingsSet();
				colorStore.forEach(function(color){
					var newId = color.getName().toString().replace(me.regexpPanel, "_");
					if(Ext.getCmp("selectConditionForm").down("#mappingCaptionForm"+newId))
						Ext.getCmp("selectConditionForm").down("#mappingCaptionForm"+newId).close();
				});

				if(Ext.getCmp("selectConditionForm").down("#undefined"))
					Ext.getCmp("selectConditionForm").down("#undefined").close();
			}
			
			session.setMapped('false');

			var comboCond = Ext.getCmp('selectCondition');

	        //take an array to store the object that we will get from the ajax response
			var record = [];

            var storeCond = comboCond.getStore();
	        storeCond.loadData(record, false);

			var selectConditionType = Ext.getCmp('selectConditionType');
			
			comboCond.clearValue();
			comboCond.setDisabled(true);

			selectConditionType.setDisabled(true);
	 			
        	var comboMapping = Ext.getCmp('selectMappingVisu');
			var store = comboMapping.getStore();
            var records = [];

			store.loadData(records, false);
            comboMapping.clearValue();
            comboMapping.setDisabled(true);

            var thresholdField = view.lookupReference('threshold');
            var opacity = view.lookupReference('opacity');
            var valueonarrow = view.lookupReference('valueonarrow');
            var regroupValuesIntoClass = view.lookupReference('regroupValuesIntoClass');

            thresholdField.hide();
            valueonarrow.hide();
            regroupValuesIntoClass.hide();
            opacity.hide();
        }

	},

	/*******************************************
	* Removing of mapping
	* @param {} newMapping : boolean to know if a new mapping is launched
	*/
	closeMapping : function(){

		var me = this,
			view    = me.getView();
		var session = _metExploreViz.getSessionById('viz');
        var container;
        var colorStore;

		var aStyleFormParent = me.getAStyleFormParent();

        var header = aStyleFormParent.down('header');

		header.lookupReference('mappingButton').fireEvent("setIcon", "");

		var styleToUse;
		if(aStyleFormParent.biologicalType==="metabolite")
			styleToUse = metExploreD3.getMetaboliteStyle();

		if(aStyleFormParent.biologicalType==="reaction")
			styleToUse = metExploreD3.getReactionStyle();

		if(aStyleFormParent.biologicalType==="link")
			styleToUse = metExploreD3.getLinkStyle();

		aStyleFormParent.default = styleToUse[aStyleFormParent.access];
		metExploreD3.GraphStyleEdition.setCollectionStyle(aStyleFormParent.target, aStyleFormParent.attrType, aStyleFormParent.attrName, aStyleFormParent.biologicalType, aStyleFormParent.default);

		var captions = view.lookupReference('discreteCaptions');

		// captions.items.items.forEach(item=> item.close());
		var items = [];

		captions.hide();
		captions.items.items.forEach(function(item){ items.push(item); });
		items.forEach(function(item){ captions.remove(item); });

		var captionScales = view.lookupReference('scaleCaption');
		captionScales.hide();
		var svg = d3.select(captionScales.el.dom).select("#scaleCaption");
		svg.selectAll("*").remove();

		var delConditionPanel = view.lookupReference('delConditionPanel');
		delConditionPanel.hide();
	},

	// RemoveMapping in function of data type
	removeGraphMapping : function() {
		metExploreD3.GraphMapping.removeGraphMappingData('viz');
	},

	// RemoveMapping in function of data type
	removeMappingSuggestion : function(conditionName) {
		metExploreD3.GraphMapping.removeMappingSuggestion(conditionName);
	},

	/*******************************************
	 * Initialisation of mapping parameters
	 */
	map : function(newVal, oldVal, parentAStyleForm){
		var me 		= this,
		view      	= me.getView();
		var selectCondition = view.lookupReference('selectCondition');
		var selectConditionType = view.lookupReference('selectConditionType');

		var dataType = selectConditionType.getValue();
		var selectedCondition = selectCondition.getValue();
		if(dataType!==null && selectedCondition!==null){
			if(newVal!==null && oldVal!==null) me.closeMapping();

			var header = parentAStyleForm.down('header');

			if(dataType==="Continuous"){
				header.lookupReference('mappingButton').fireEvent("setIcon", "continue");
				var captionScales = view.lookupReference('scaleCaption');
				captionScales.show();
			}

			if(dataType==="Discrete"){
				header.lookupReference('mappingButton').fireEvent("setIcon", "discrete");
				var captions = view.lookupReference('discreteCaptions');
				captions.show();
			}

			if(dataType==="Alias"){
				header.lookupReference('mappingButton').fireEvent("setIcon", "alias");
			}


			var delConditionPanel = view.lookupReference('delConditionPanel');
			delConditionPanel.show();

			this.graphMapping(dataType, selectedCondition, parentAStyleForm);
		}
	},

    /*******************************************
     * Launch mapping visualisation
	 * Do Mapping in function of data type
     * @param dataType : string, data type of mapping values
     * @param conditionName : string, choosed condition
     * @param mappingName : string, Mapping name
     * @param fluxType : string, one or two arrows for fluxes
     */
    graphMapping : function(dataType, conditionName, parentAStyleForm) {
        var session = _metExploreViz.getSessionById('viz');

        if(dataType==="Continuous"){
            metExploreD3.GraphMapping.graphMappingContinuousData(conditionName, parentAStyleForm);
        }

		//
        // if(dataType==="Flux"){
        //     metExploreD3.GraphMapping.graphMappingFlux(mappingName, conditionName, fluxType, undefined, undefined, Ext.getCmp("opacityCheck").checked, Ext.getCmp("valueonarrowCheck").checked, Ext.getCmp('regroupValuesIntoClassCheck').checked);
        //     session.setMappingDataType(dataType);
        // }

        if(dataType==="Alias"){
            session.setMappingDataType(dataType);
            metExploreD3.GraphMapping.graphMappingDiscreteData(conditionName, parentAStyleForm);
        }

        if(dataType==="Discrete"){
            session.setMappingDataType(dataType);
            metExploreD3.GraphMapping.graphMappingDiscreteData(conditionName, parentAStyleForm);
        }

        // if(dataType==="Suggestion")
        //     metExploreD3.GraphMapping.graphMappingSuggestionData(mappingName, conditionName, Ext.getCmp("threshold").getValue());
    },

	/*******************************************
	* Add the panel caption corresponding to mapping
	* @param type : string data type of mapping values
	*/
	addMappingCaptionForm : function(type) {
		var me 		= this,
			view    = me.getView();

		// We add form corresponding to the mapping data type
		var captions = view.lookupReference('discreteCaptions');
		var scaleCaption = view.lookupReference('scaleCaption');
	    var selectCondition = view.lookupReference('selectCondition');
		var selectedCondition = selectCondition.getValue();
		var networkVizSession = _metExploreViz.getSessionById("viz");
        var colorStore;
        var aStyleFormParent = me.getAStyleFormParent();
        if(type!=="suggestion"){
            networkVizSession.setMapped(selectedCondition);
            colorStore = aStyleFormParent.getController().getValueMappingsSet();
        }
        else {
            colorStore = networkVizSession.getColorSuggestionsSet();
		}

        var cond;
        if(type==="flux" || Array.isArray(selectedCondition))
			cond = selectedCondition[0];
		else
			cond = selectedCondition;

		if(captions && type==="discrete")
		{

			console.log(captions);
			if(Ext.getCmp('panel'+ cond)===undefined || type==="suggestion")
			{

				var idColors = [];
				var listMappingCaptionForm = [];
				var that = this;

				// For each value we add corresponding color caption
				var i = 0;
				colorStore.forEach(function(color){
						var colorName = color.getName();
			    	var value = colorName;
			    	if(type==="flux")
			    		value = selectedCondition[i];
			    	i++;

			    	var newId = colorName.toString().replace(me.regexpPanel, "_");


			    	var editValueForm;
					if(aStyleFormParent.styleType==="color"){
						editValueForm = [{
							xtype: 'label',
							forId: 'color',
							margin: '5 10 5 10',
							text: value+' :',
							flex:1,
							border:false
						},
							{
								border:false,
								xtype: 'hiddenfield',
								itemId: 'hidden' + newId,
								value: color.getValue(),
								listeners: {
									change: function(newValue){
										this.lastValue = newValue.value;
									}
								}
							},{
							border:false,
							margin: '5 10 5 10',
							width: "40%",
							reference:"colorButtonMapping",
							html: '<input ' +
								'type="color" ' +
								'id="html5colorpicker" ' +
								'value="'+color.getValue()+'" ' +
								'style="width:85%;">'
						}];
					}

					if(aStyleFormParent.styleType==="int" || aStyleFormParent.styleType==="float")
					{
						editValueForm = [{
							border:false,
							margin: '5 10 5 10',
							width: "100%",
							xtype: 'textfield',
							name: 'name',
							value: color.getValue(),
							fieldLabel: color.getName()+" ",
							listeners: {
								focusleave: function(){
									var value =this.getRawValue();
									if(aStyleFormParent.styleType==="int") {
										value=parseInt(value);
									}
									if(aStyleFormParent.styleType==="float") {
										value=parseFloat(value);
									}
									if(color.getValue()!==value){
                                            newValue=value;
										if(isNaN(newValue)){
											Ext.Msg.show({
												title:'Warning',
												msg: "Please enter a number.",
												icon: Ext.Msg.WARNING
											});
										}
										else
										{
											if(aStyleFormParent.min <= newValue && aStyleFormParent.max >= newValue )
											{
												color.setValue(newValue);

												var  mappingName = selectedCondition.split("_")[0];
												var  conditionName = selectedCondition.split("_")[1];

												metExploreD3.GraphStyleEdition.setCollectionStyleDiscreteMapping(aStyleFormParent.target, aStyleFormParent.attrType, aStyleFormParent.attrName, aStyleFormParent.biologicalType, conditionName, mappingName, color.getName(), color.getValue());

											}
											else
											{
												Ext.Msg.show({
													title:'Warning',
													msg: "Please enter a number between "+view.min+" and "+view.max,
													icon: Ext.Msg.WARNING
												});
											}
										}
									}
								}
							}

						}];
					}

			    	var newMappingCaptionForm = Ext.create('metExploreViz.view.form.MappingCaptionForm', {

				    	itemId: 'mappingCaptionForm'+newId,

			            margin: '0 0 0 0',
			            padding: '0 0 0 0',
			            border:false,
					    items:
					    [
						    {
								reference:"chooseColorReaction",
						        itemId:'chooseColorReaction'+newId,
						        xtype:'panel',
						        border:false,
						        layout:{
						           type:'hbox',
						           align:'stretch'
						        },
						        items:editValueForm

						    }
					    ]
					});
					if(aStyleFormParent.styleType==="color") {
						newMappingCaptionForm.on(
							{
								afterrender: function () {
									var colorButtonMappingEl = newMappingCaptionForm.el.dom.querySelector("#html5colorpicker");

									console.log();
									colorButtonMappingEl
										.addEventListener("change", function (evt) {
											var newColor = evt.target.value;
											color.setValue(newColor);

											var mappingName = selectedCondition.split("_")[0];
											var conditionName = selectedCondition.split("_")[1];

											metExploreD3.GraphStyleEdition.setCollectionStyleDiscreteMapping(aStyleFormParent.target, aStyleFormParent.attrType, aStyleFormParent.attrName, aStyleFormParent.biologicalType, conditionName, mappingName, color.getName(), color.getValue());
										});
								},
								scope: me
							}
						);
					}

					listMappingCaptionForm.push(newMappingCaptionForm);
					idColors.push(newId);
			    });
                var newConditionPanel;
                var panelID;
                if(type!=="suggestion"){
                    panelID = 'panel'+ cond.replace(me.regexpPanel, "");
                    newConditionPanel = Ext.create('Ext.panel.Panel', {
                        border:false,
                        width: '100%',
                        bodyBorder: false,
                        xtype:'panel',
                        layout:{
                            type:'hbox',
                            align:'stretch'
                        },
                        items: [{
                            xtype: 'label',
                            forId: 'condName',
                            margin:'8 5 5 10',
                            flex:1
                        }]
                    });
				}
				else {
                	panelID = "suggestions";
                	var container = Ext.getCmp("suggestions");
                	if(container!==undefined){
                        if(container){
                            container.close();
                            colorStore = networkVizSession.getColorSuggestionsSet();
                            colorStore.forEach(function(color){
                                var newId = color.getName().toString().replace(me.regexpPanel, "_");
                                if(Ext.getCmp("selectConditionForm").down("#mappingCaptionForm"+newId))
                                    Ext.getCmp("selectConditionForm").down("#mappingCaptionForm"+newId).close();
                            });

                            if(Ext.getCmp("selectConditionForm").down("#undefined"))
                                Ext.getCmp("selectConditionForm").down("#undefined").close();
                        }
					}

                    newConditionPanel = Ext.create('Ext.panel.Panel', {
                        id: 'suggestions',
                        border:false,
                        width: '100%',
                        bodyBorder: false,
                        xtype:'panel',
                        layout:{
                            type:'hbox',
                            align:'stretch'
                        },
                        items: [{
                            xtype: 'label',
                            forId: 'condName',
                            margin:'8 5 5 10',
                            flex:1
                        }]
                    });
                }



				// Add button to change colors
				// var refreshColorButton = Ext.create('Ext.Button', {
				//     iconCls:'refresh',
		        //     margin:'5 5 5 0',
				//     handler: function() {
                //         var colorStore;
                //         if (type === "discrete") {
                //             colorStore = aStyleFormParent.getController().getValueMappingsSet();
                //             colorStore.forEach(function (color) {
                //                 var newId = color.getName().toString().replace(me.regexpPanel, "_");
                //                 if (Ext.getCmp("selectConditionForm").down("#hidden" + newId)) {
                //                     if (color.getValue() !== Ext.getCmp("selectConditionForm").down("#hidden" + newId).lastValue) {
                //                         // PERF: Must be changed to set only the color
                //                         metExploreD3.GraphMapping.setDiscreteMappingColor(Ext.getCmp("selectConditionForm").down("#hidden" + newId).lastValue, color.getName(), selectedCondition, mapp);
                //                     }
                //                 }
                //             });
                //         }
				// 		else {
                //             if (type === "suggestion") {
                //                 colorStore = networkVizSession.getColorSuggestionsSet();
                //                 colorStore.forEach(function (color) {
                //                     var newId = color.getName().toString().replace(me.regexpPanel, "_");
                //                     if (Ext.getCmp("selectConditionForm").down("#hidden" + newId)) {
                //                         if (color.getValue() !== Ext.getCmp("selectConditionForm").down("#hidden" + newId).lastValue) {
                //                             // PERF: Must be changed to set only the color$
                //                              metExploreD3.GraphMapping.setSuggestionColor(Ext.getCmp("selectConditionForm").down("#hidden" + newId).lastValue, color.getName());
                //                         }
                //                     }
                //                 });
                //             }
                //             else {
                //                 colorStore = aStyleFormParent.getController().getValueMappingsSet();
				// 				colorStore.forEach(function (color) {
				// 					var newId = color.getName().toString().replace(me.regexpPanel, "_");
				//
				// 					if (Ext.getCmp("selectConditionForm").down("#hidden" + newId)) {
				// 						if (color.getValue() !== Ext.getCmp("selectConditionForm").down("#hidden" + newId).lastValue) {
				// 							// PERF: Must be changed to set only the color
				// 							metExploreD3.GraphMapping.setContinuousMappingColor(Ext.getCmp("selectConditionForm").down("#hidden" + newId).lastValue, color.getName(), selectedCondition, mapp);
				// 						}
				//
				// 					}
				// 				});
				//
				// 				if (aStyleFormParent.getController().getValueMappingsSet()[1]) {
				// 					if (parseFloat(aStyleFormParent.getController().getValueMappingsSet()[0].getName()) < parseFloat(aStyleFormParent.getController().getValueMappingsSet()[1].getName())) {
				// 						maxValue = parseFloat(aStyleFormParent.getController().getValueMappingsSet()[1].getName());
				// 						minValue = parseFloat(aStyleFormParent.getController().getValueMappingsSet()[0].getName());
				// 					}
				// 					else {
				// 						maxValue = parseFloat(aStyleFormParent.getController().getValueMappingsSet()[0].getName());
				// 						minValue = parseFloat(aStyleFormParent.getController().getValueMappingsSet()[1].getName());
				// 					}
				// 				}
				// 				else {
				// 					color = parseFloat(aStyleFormParent.getController().getValueMappingsSet()[0].getName());
				// 				}
				//
				// 				if (type === "continuous") {
				// 					if (aStyleFormParent.getController().getValueMappingsSet()[1]) {
				// 						metExploreD3.GraphMapping.graphMappingContinuousData(mapp, cond, aStyleFormParent.getController().getValueMappingById(minValue).getValue(), aStyleFormParent.getController().getValueMappingById(maxValue).getValue());
				// 					}
				// 					else {
				// 						metExploreD3.GraphMapping.graphMappingContinuousData(mapp, cond, aStyleFormParent.getController().getValueMappingById(color).getValue(), aStyleFormParent.getController().getValueMappingById(color).getValue());
				// 					}
				// 				}
				// 				else {
				// 					var fluxType;
				// 					if (selectedCondition.length === 1) {
				// 						fluxType = 'Unique';
				// 						metExploreD3.GraphMapping.graphMappingFlux(mapp, selectedCondition, fluxType, aStyleFormParent.getController().getValueMappingById(color).getValue(), undefined, Ext.getCmp("opacityCheck").checked, Ext.getCmp("valueonarrowCheck").checked, Ext.getCmp('regroupValuesIntoClassCheck').checked);
				// 					}
				// 					else {
				// 						fluxType = 'Compare';
				// 						metExploreD3.GraphMapping.graphMappingFlux(mapp, selectedCondition, fluxType, aStyleFormParent.getController().getValueMappingById(maxValue).getValue(), aStyleFormParent.getController().getValueMappingById(minValue).getValue(), Ext.getCmp("opacityCheck").checked, Ext.getCmp("valueonarrowCheck").checked, Ext.getCmp('regroupValuesIntoClassCheck').checked);
				// 					}
				// 				}
				// 			}
				// 		}
				//     }
				// });
			    // newConditionPanel.add(refreshColorButton);

				// Add mapping caption to captions panel
			    if(captions)
				{
					captions.add(newConditionPanel);
					listMappingCaptionForm.forEach(function(aMappingCaptionForm){

						captions.add(aMappingCaptionForm);
					});
				}
			}

		}

		if(scaleCaption && type==="continuous"){
			console.log(scaleCaption);
			if(aStyleFormParent.styleType==="color") {
				me.drawContinuousScaleCaption();
			}
		}
	},
	drawContinuousScaleCaption : function() {
		var me = this;
		var view = me.getView();
		var viewAStyleForm = me.getAStyleFormParent();
		var header = viewAStyleForm.down('header');
		if(viewAStyleForm.styleType==="float"  || viewAStyleForm.styleType==="int" ){

			var margin = 0;
			var width = 190;
			var height = 50;

			var svg = d3.select(view.lookupReference('scaleCaption').el.dom).select("#scaleCaption");

			viewAStyleForm.scaleRange = [
				{id:"begin", value:1, size:1},
				{id:1, value:10, size:1},
				{id:2, value:20, size:2},
				{id:3, value:90, size:10},
				{id:"end", value:100, size:10}
			];

			metExploreD3.GraphNumberScaleEditor.createNumberScaleCaption(svg, width, height, margin);

			svg.on("click", function(){
				var win = Ext.create("metExploreViz.view.form.continuousNumberMappingEditor.ContinuousNumberMappingEditor", {
					height : 300,
					aStyleFormParent : viewAStyleForm
				});

				win.show();
			});
		}

		if(viewAStyleForm.styleType==="color"){

			var margin = 0;
			var width = 150;
			var height = 50;
			var svg = d3.select(view.lookupReference('scaleCaption').el.dom).select("#scaleCaption");

			var colorButton = header.lookupReference('colorButton');
			var colorButtonEl = colorButton.el.dom.querySelector("#html5colorpicker");

			viewAStyleForm.graphColorScaleEditor.createColorScaleCaption(svg, width, height, margin, viewAStyleForm.scaleRange);

			svg.on("click", function(){
				var win = Ext.create("metExploreViz.view.form.continuousColorMappingEditor.ContinuousColorMappingEditor", {
					height : 300,
					aStyleFormParent : viewAStyleForm
				});

				win.show();
			});

		}
	},

	getAStyleFormParent : function() {
		var me = this;
		var view = me.getView();
		return view.query("^ aStyleForm")[0];
	}
});