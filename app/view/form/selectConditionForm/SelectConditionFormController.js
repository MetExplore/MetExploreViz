/**
 * @author MC
 * (a)description class to control contion selection panel and to draw mapping in the mapping story
 */

Ext.define('metExploreViz.view.form.selectConditionForm.SelectConditionFormController', {
	extend: 'Ext.app.ViewController',
	alias: 'controller.form-selectConditionForm-selectConditionForm',
	requires: [
		"metExploreViz.view.form.continuousColorMappingEditor.ContinuousColorMappingEditor",
		"metExploreViz.view.form.linkStyles.LinkStyles"
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
			afterContinuousMapping : this.addMappingCaptionForm,
			afterSuggestionMapping : this.addMappingCaptionForm,
			closeMapping : function(newMapping){
				me.closeMapping(newMapping);
			},
			resetMapping : function(){
				me.resetMapping();
			},
			removeMapping : function(removedMapping){
				me.removeMapping(removedMapping);
			},
			reset : function(newMapping){
			},
			scope:me
		});

		view.lookupReference('selectConditionType').on({
			afterrender : function(){
				var aStyleFormParent = me.getAStyleFormParent();
				if(aStyleFormParent.styleType==="string"){
					view.lookupReference('selectConditionType').hide();
				}
			},
			change : function(that, newVal, old){
				var viewAStyleForm = me.getAStyleFormParent();

				this.map(newVal, old, viewAStyleForm);
				this.applyToLinkedStyles( viewAStyleForm);
			},
			scope:me
		});


		view.lookupReference('selectCondition').on({
			change : function(that, newVal, old){
                var conditionType = view.lookupReference('selectConditionType').getValue();

                if(conditionType === "Continuous"){
                    var oldCondition = old+" "+conditionType;
                    var newCondition = newVal+" "+conditionType;
                    if(this.getAStyleFormParent().scaleRange !== undefined){
                        this.getAStyleFormParent()[oldCondition] = this.getAStyleFormParent().scaleRange;
                    }

                    if(this.getAStyleFormParent()[newCondition] !== null){
                        this.getAStyleFormParent().scaleRange = this.getAStyleFormParent()[newCondition]
                    }
                }

                if(conditionType === "Discrete"){
                    var oldCondition = old+" "+conditionType;
                    var newCondition = newVal+" "+conditionType;
                    if(this.getAStyleFormParent().valueDiscreteMappings !== undefined){
                        this.getAStyleFormParent()[oldCondition] = this.getAStyleFormParent().valueDiscreteMappings;
                    }

                    if(this.getAStyleFormParent()[newCondition] !== null){
                        this.getAStyleFormParent().valueDiscreteMappings = this.getAStyleFormParent()[newCondition]
                    }
                }

				this.map(newVal, old, me.getAStyleFormParent());
                this.applyToLinkedStyles(me.getAStyleFormParent());
			},
			beforerender: function(c) {
				var viewAStyleForm = me.getAStyleFormParent();
				view.lookupReference('selectCondition').setStore(Ext.getStore("conditionStore"));
			},
			scope:me
		});

		view.lookupReference('saveScale').on({
			click : function(){
				var viewAStyleForm = me.getAStyleFormParent();

				var dataType = view.lookupReference('selectConditionType').getValue();

				switch (dataType) {
					case 'Continuous':
						metExploreD3.GraphUtils.saveStyles(viewAStyleForm.scaleRange);
						break;
					case 'Discrete':
						metExploreD3.GraphUtils.saveStyles(viewAStyleForm.valueDiscreteMappings);
						break;
					case 'As selection':
						metExploreD3.GraphUtils.saveStyles(viewAStyleForm.valueAsSelectionMappings);
						break;
					case 'Alias':
						metExploreD3.GraphUtils.saveStyles(viewAStyleForm.valueAliasMappings);
						break;
					default:
				}

			},
			scope:me
		});

		view.lookupReference('linkStyles').on({
			click : function(){
				var viewAStyleForm = me.getAStyleFormParent();
				var bioStyleForm = Ext.getCmp(viewAStyleForm.biologicalType+"StyleForm");
				if(bioStyleForm.linkStylesWin===false)
				{
					var win = Ext.create("metExploreViz.view.form.linkStyles.LinkStyles", {
						title : "Style to link with " + viewAStyleForm.title,
						height : 300,
						aStyleFormParent : viewAStyleForm,
						listeners :{
							close : function(){
								bioStyleForm.linkStylesWin=false;
							}
						}
					});

					win.show();
					bioStyleForm.linkStylesWin=win;
				}
				else
				{
					var el = bioStyleForm.linkStylesWin.getEl();
					el
						.fadeIn({ x: el.getBox().x-10, duration: 10})
						.fadeIn({ x: el.getBox().x, duration: 10})
						.fadeIn({ x: el.getBox().x-10, duration: 10})
						.fadeIn({ x: el.getBox().x, duration: 10})
						.fadeIn({ x: el.getBox().x-10, duration: 10})
						.fadeIn({ x: el.getBox().x, duration: 10})
				}

			},
			scope:me
		});

		view.lookupReference('importScale').on({
			change:function(){
				metExploreD3.GraphUtils.handleFileSelect(view.lookupReference('importScale').fileInputEl.dom, function(json){
					var viewAStyleForm = me.getAStyleFormParent();

					var dataType = view.lookupReference('selectConditionType').getValue();

					if(dataType==="Continuous"){
						// Allows to reload the same file
						viewAStyleForm.scaleRange = metExploreD3.GraphUtils.decodeJSON(json);
						viewAStyleForm.getController().updateContinuousCaption();
						viewAStyleForm.getController().updateContinuousMapping();
					}

					if (dataType==="Discrete"){
						me.removeCaption();
						var newArray = metExploreD3.GraphUtils.decodeJSON(json).map(function (val) {
							return new ValueMapping(val.name, val.value);
						});

						if(newArray!==viewAStyleForm.valueDiscreteMappings){
							viewAStyleForm.valueDiscreteMappings=newArray;

							var selectConditionForm = viewAStyleForm.lookupReference('selectConditionForm');
							var selectCondition = selectConditionForm.lookupReference('selectCondition');
							var selectConditionType = selectConditionForm.lookupReference('selectConditionType');

							var dataType = selectConditionType.getValue();
							var selectedCondition = selectCondition.getValue();
							if(dataType==="Discrete" && selectedCondition!==null){
								viewAStyleForm.getController().updateDiscreteMapping();
							}
						}
					}

					if (dataType==="As selection"){
						me.removeCaption();

						var newArray = metExploreD3.GraphUtils.decodeJSON(json).map(function (val) {
							return new ValueMapping(val.name, val.value);
						});

						if(newArray!==viewAStyleForm.valueAsSelectionMappings){
							viewAStyleForm.valueAsSelectionMappings=newArray;

							var selectConditionForm = viewAStyleForm.lookupReference('selectConditionForm');
							var selectCondition = selectConditionForm.lookupReference('selectCondition');
							var selectConditionType = selectConditionForm.lookupReference('selectConditionType');

							var dataType = selectConditionType.getValue();
							var selectedCondition = selectCondition.getValue();
							if(dataType==="As selection" && selectedCondition!==null){
								viewAStyleForm.getController().updateDiscreteMapping();
							}
						}
					}

					if (dataType==="Alias"){
						me.removeCaption();

						var newArray = metExploreD3.GraphUtils.decodeJSON(json).map(function (val) {
							return new ValueMapping(val.name, val.value);
						});

						if(newArray!==viewAStyleForm.valueAliasMappings){
							viewAStyleForm.valueAliasMappings=newArray;

							var selectConditionForm = viewAStyleForm.lookupReference('selectConditionForm');
							var selectCondition = selectConditionForm.lookupReference('selectCondition');
							var selectConditionType = selectConditionForm.lookupReference('selectConditionType');

							var dataType = selectConditionType.getValue();
							var selectedCondition = selectCondition.getValue();
							if(dataType==="Alias" && selectedCondition!==null){
								viewAStyleForm.getController().updateDiscreteMapping();
							}
						}
					}
				});
			},
			scope:me
		});

		view.lookupReference('delCondition').on({
			click : function(){
				me.closeMapping();
				view.lookupReference('selectConditionType').setValue(null);
				view.lookupReference('selectCondition').setValue(null);
				var viewAStyleForm = me.getAStyleFormParent();
				viewAStyleForm.collapse();
			},
			scope:me
		});
	},

    /*******************************************
     * Remove all mapping in visualisation and in side panel
     */

	applyToLinkedStyles:function(viewAStyleForm){
		var me = this;
		var view = me.getView();

		var linkedStylesTitle = viewAStyleForm.linkedStyles;
		if(linkedStylesTitle.length>0){
			var bioStyleForm = Ext.getCmp(viewAStyleForm.biologicalType+"StyleForm");

			var linkedStyles = bioStyleForm.query("aStyleForm")
				.filter(function (aStyleForm) {
					return linkedStylesTitle.includes(aStyleForm.title);
				});
			linkedStyles.forEach(function(styleForm){
				var dataTypeToPropagate = view.lookupReference('selectConditionType').getValue();
                var mappingNameToPropagate = view.lookupReference('selectCondition').getValue();

				styleForm.lookupReference('selectConditionForm').lookupReference('selectConditionType').setValue(dataTypeToPropagate);
                styleForm.lookupReference('selectConditionForm').lookupReference('selectCondition').setValue(mappingNameToPropagate);
			});
		}


	},
    /*******************************************
     * Remove all mapping in visualisation and in side panel
     */
	removeCaption:function(){
		var me = this;
		var view = me.getView();
		var session = _metExploreViz.getSessionById('viz');
		var aStyleFormParent = me.getAStyleFormParent();
		var colorStore = aStyleFormParent.getController().getValueMappingsSet(session.getMappingDataType());
		colorStore.forEach(function(color){
			var newId = color.getName().toString().replace(me.regexpPanel, "_");
			if(view.down("#mappingCaptionForm"+newId))
				view.down("#mappingCaptionForm"+newId).close();
		});

		if(view.down("#undefined"))
			view.down("#undefined").close();


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
						var colorStore = aStyleFormParent.getController().getValueMappingsSet(session.getMappingDataType());
				        var newColor = aStyleFormParent.getController().getValueMappingsSetLength(session.getMappingDataType())===0;

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
						var colorStore = aStyleFormParent.getController().getValueMappingsSet(session.getMappingDataType());
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
				var colorStore = aStyleFormParent.getController().getValueMappingsSet(session.getMappingDataType());
		        var newColor = aStyleFormParent.getController().getValueMappingsSetLength(session.getMappingDataType())===0;

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
				var colorStore = aStyleFormParent.getController().getValueMappingsSet(session.getMappingDataType());
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

		if(!aStyleFormParent.default)
			aStyleFormParent.default = styleToUse[aStyleFormParent.access];

		metExploreD3.GraphStyleEdition.removeMappedClassStyle(aStyleFormParent.target, aStyleFormParent.attrType, aStyleFormParent.attrName, aStyleFormParent.biologicalType, aStyleFormParent.default);
		if(aStyleFormParent.styleType==="string")
		{
			var bypass = false;
			metExploreD3.GraphStyleEdition.setCollectionLabel(aStyleFormParent.target, aStyleFormParent.attrType, aStyleFormParent.attrName, aStyleFormParent.biologicalType, styleToUse[aStyleFormParent.access], bypass);
		}
		else
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

			if(dataType==="Discrete" || dataType==="As selection"){
				header.lookupReference('mappingButton').fireEvent("setIcon", "discrete");
				var captions = view.lookupReference('discreteCaptions');
				captions.show();
			}



			var delConditionPanel = view.lookupReference('delConditionPanel');
			delConditionPanel.show();

			this.graphMapping(dataType, selectedCondition, parentAStyleForm);
		}
		if(parentAStyleForm.styleType==="string" && selectedCondition!==null){
			var header = parentAStyleForm.down('header');
			header.lookupReference('mappingButton').fireEvent("setIcon", "alias");

			var delConditionPanel = view.lookupReference('delConditionPanel');
			delConditionPanel.show();

			this.graphMapping("Alias", selectedCondition, parentAStyleForm);
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
			var  mappingName = conditionName.split(" / ")[0];
			conditionName = conditionName.split(" / ")[1];
			metExploreD3.GraphStyleEdition.setCollectionLabelMapping(parentAStyleForm.target, parentAStyleForm.attrType, parentAStyleForm.attrName, parentAStyleForm.biologicalType, conditionName, mappingName);
        }

        if(dataType==="Discrete"){
            session.setMappingDataType(dataType);
            metExploreD3.GraphMapping.graphMappingDiscreteData(conditionName, parentAStyleForm);
        }

        if(dataType==="As selection"){
            session.setMappingDataType(dataType);
            metExploreD3.GraphMapping.graphMappingAsSelectionData(conditionName, parentAStyleForm);
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

		var selectConditionType = view.lookupReference('selectConditionType');
		var dataType = selectConditionType.getValue();

		var selectedCondition = selectCondition.getValue();
		var networkVizSession = _metExploreViz.getSessionById("viz");
        var colorStore;
        var aStyleFormParent = me.getAStyleFormParent();
        if(type!=="suggestion"){
            networkVizSession.setMapped(selectedCondition);

            colorStore = aStyleFormParent.getController().getValueMappingsSet(dataType);

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

												var  mappingName = selectedCondition.split(" / ")[0];
												var  conditionName = selectedCondition.split(" / ")[1];
												if(dataType==="As selection")
													metExploreD3.GraphStyleEdition.setCollectionStyleAsSelectionMapping(aStyleFormParent.target, aStyleFormParent.attrType, aStyleFormParent.attrName, aStyleFormParent.biologicalType, conditionName, mappingName, "Identified", color.getValue())
												else
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
								},
								specialkey: function(field, e){
									if (e.getKey() == e.ENTER) {
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

													var  mappingName = selectedCondition.split(" / ")[0];
													var  conditionName = selectedCondition.split(" / ")[1];
													if(dataType==="As selection")
														metExploreD3.GraphStyleEdition.setCollectionStyleAsSelectionMapping(aStyleFormParent.target, aStyleFormParent.attrType, aStyleFormParent.attrName, aStyleFormParent.biologicalType, conditionName, mappingName, "Identified", color.getValue())
													else
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

									colorButtonMappingEl
										.addEventListener("change", function (evt) {
											var newColor = evt.target.value;
											color.setValue(newColor);

											var mappingName = selectedCondition.split(" / ")[0];
											var conditionName = selectedCondition.split(" / ")[1];
											if(dataType==="As selection")
												metExploreD3.GraphStyleEdition.setCollectionStyleAsSelectionMapping(aStyleFormParent.target, aStyleFormParent.attrType, aStyleFormParent.attrName, aStyleFormParent.biologicalType, conditionName, mappingName, "Identified", color.getValue())
											else
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
			if(aStyleFormParent.styleType==="color") {
				me.drawContinuousScaleCaption();
			}
			if(aStyleFormParent.styleType==="float" || aStyleFormParent.styleType==="int") {
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

			viewAStyleForm.graphNumberScaleEditor.createNumberScaleCaption(svg, width, height, margin, viewAStyleForm.scaleRange);

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
