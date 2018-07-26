/**
 * @author MC
 * (a)description class to control contion selection panel and to draw mapping in the mapping story
 */

Ext.define('metExploreViz.view.form.selectConditionForm.SelectConditionFormController', {
	extend: 'Ext.app.ViewController',
	alias: 'controller.form-selectConditionForm-selectConditionForm',

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
			change : function(that, newVal){
				if(newVal=="Flux"){
					view.lookupReference('opacity').setHidden(false);  
					view.lookupReference('valueonarrow').setHidden(false);
                    view.lookupReference('regroupValuesIntoClass').setHidden(false);
					view.lookupReference('threshold').setHidden(true);
				}
				else{
					if(newVal=="Suggestion"){
						view.lookupReference('opacity').setHidden(true);
						view.lookupReference('valueonarrow').setHidden(true);
                        view.lookupReference('regroupValuesIntoClass').setHidden(true);
					view.lookupReference('threshold').setHidden(false);
					}
					else{
						view.lookupReference('opacity').setHidden(true);
						view.lookupReference('valueonarrow').setHidden(true);
                        view.lookupReference('regroupValuesIntoClass').setHidden(true);
					view.lookupReference('threshold').setHidden(true);
					}
				}
			},
			collapse : function(){
				var networkVizSession = _metExploreViz.getSessionById("viz");
				// If the main network is already mapped we inform the user: OK/CANCEL
				if((view.lookupReference('selectConditionType').getValue()!=="Suggestion" &&
                        networkVizSession.getColorMappingsSetLength()>0) && networkVizSession.isMapped()!=='false')
				{
			        Ext.Msg.show({
			           title:'Are you sure?',
			           msg: 'This action will remove previous mapping. <br />Would you like to do this?',
			           buttons: Ext.Msg.OKCANCEL,
			           fn: function(btn){
							if(btn==="ok")
							{	
								//var newMapping ='true';
								me.closeMapping();
							}
			           },
			           icon: Ext.Msg.QUESTION
			       });
				}
			},
			scope:me
		});

		view.lookupReference('selectCondition').on({
			change : function(that, newVal, old){
				var type = view.lookupReference('selectConditionType').lastValue;
				if(type!=="Flux"){
					if(old)
					{
						var i = newVal.indexOf(old[0]);
						if(i!==-1)
						{
							newVal.splice(i, 1);
						}
						view.lookupReference('selectCondition').setValue(newVal[0]);
					}
					view.lookupReference('selectCondition').collapse();
				}
				else
				{
					if(newVal>2){
						newVal.splice(0,1);
						view.lookupReference('selectCondition').setValue(newVal);
					}
				}
			},
			collapse : function(){
				var networkVizSession = _metExploreViz.getSessionById("viz");
				var that = this;

				if(view.lookupReference('selectCondition').getValue().length>0)
                {
                    // If the main network is already mapped we inform the user: OK/CANCEL
                    if(view.lookupReference('selectConditionType').getValue()!=="Suggestion" &&
						networkVizSession.getColorMappingsSetLength()>0 &&
                        networkVizSession.isMapped()!=='false')
					{
				        Ext.Msg.show({
				           title:'Are you sure?',
				           msg: 'This action will remove previous mapping. <br />Would you like to do this?',
				           buttons: Ext.Msg.OKCANCEL,
				           fn: function(btn){
								if(btn==="ok")
								{
									me.closeMapping();
									that.map();
								}
				           },
				           icon: Ext.Msg.QUESTION
				       });
					}
					else
						this.map();	
				}
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
            mapping.getConditions().forEach(function (cond) {
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
						var colorStore = session.getColorMappingsSet();        
				        var newColor = session.getColorMappingsSetLength()===0;
				        
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
						var colorStore = session.getColorMappingsSet();
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
				var colorStore = session.getColorMappingsSet();
		        var newColor = session.getColorMappingsSetLength()===0;

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
				var colorStore = session.getColorMappingsSet();
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
	closeMapping : function(mappingToRemove, type){

		var me = this;
		var session = _metExploreViz.getSessionById('viz');
        var container;
        var colorStore;

        if(type==="suggestion")
		{
           container = Ext.getCmp('suggestions');
            colorStore = [];
            colorsStore = session.getColorSuggestionsSet();
            colorsStore.forEach(function(color){
                colorStore.push(color);
            });
            colorStore.forEach(function(color){
                var newId = color.getName().toString().replace(me.regexpPanel, "_");
                me.removeMappingSuggestion(newId);
                session.removeColorSuggestionById(newId);
            });
        }
        else {
            if(session.isMapped()!=="false")
            {
                // Remove mapping caption
                var oldMapping = session.isMapped();
                this.removeGraphMapping(oldMapping);
                colorStore = session.getColorMappingsSet();

                if(type==="flux"|| Array.isArray(session.isMapped()))
                    container = Ext.getCmp('panel'+session.isMapped()[0].replace(me.regexpPanel, ""));
                else
                    container = Ext.getCmp('panel'+session.isMapped().replace(me.regexpPanel, ""));


            }
		}

		if(container){
			container.close();

			colorStore.forEach(function(color){
                var newId = color.getName().toString().replace(me.regexpPanel, "_");

				if(Ext.getCmp("selectConditionForm").down("#mappingCaptionForm"+newId))
					Ext.getCmp("selectConditionForm").down("#mappingCaptionForm"+newId).close();
			});

			if(Ext.getCmp("selectConditionForm").down("#undefined"))
				Ext.getCmp("selectConditionForm").down("#undefined").close();
		}

        if(type!=="suggestion")
        {
            session.setMappingDataType(null);
            session.setMapped('false');
        }
	},

	// RemoveMapping in function of data type
	removeGraphMapping : function(conditionName) {
		metExploreD3.GraphMapping.removeGraphMappingData(conditionName);
	},

	// RemoveMapping in function of data type
	removeMappingSuggestion : function(conditionName) {
		metExploreD3.GraphMapping.removeMappingSuggestion(conditionName);
	},

	/*******************************************
	 * Initialisation of mapping parameters
	 */
	map : function(){
		var me 		= this,
		view      	= me.getView();
		var selectCondition = Ext.getCmp('selectCondition');
		var selectMapping = Ext.getCmp('selectMappingVisu');
		var selectedCondition = selectCondition.getValue();
		var selectedMapping = selectMapping.getValue();
		var dataType = Ext.getCmp("selectConditionType").getValue();
        var fluxType;
		if(view.lookupReference('selectCondition').value.length===1)
			fluxType = 'Unique';
		else
			fluxType = 'Compare';

		this.graphMapping(dataType, selectedCondition, selectedMapping, fluxType);
	},

    /*******************************************
     * Launch mapping visualisation
	 * Do Mapping in function of data type
     * @param dataType : string, data type of mapping values
     * @param conditionName : string, choosed condition
     * @param mappingName : string, Mapping name
     * @param fluxType : string, one or two arrows for fluxes
     */
    graphMapping : function(dataType, conditionName, mappingName, fluxType) {
        var session = _metExploreViz.getSessionById('viz');
        session.setActiveMapping(mappingName);
        if(dataType==="Continuous"){
            metExploreD3.GraphMapping.graphMappingContinuousData(mappingName, conditionName);
            session.setMappingDataType(dataType);
        }

        if(dataType==="Flux"){
            metExploreD3.GraphMapping.graphMappingFlux(mappingName, conditionName, fluxType, undefined, undefined, Ext.getCmp("opacityCheck").checked, Ext.getCmp("valueonarrowCheck").checked, Ext.getCmp('regroupValuesIntoClassCheck').checked);
            session.setMappingDataType(dataType);
        }

        if(dataType==="Discrete"){
            session.setMappingDataType(dataType);
            metExploreD3.GraphMapping.graphMappingDiscreteData(mappingName, conditionName);
        }

        if(dataType==="Suggestion")
            metExploreD3.GraphMapping.graphMappingSuggestionData(mappingName, conditionName, Ext.getCmp("threshold").getValue());
    },

	/*******************************************
	* Add the panel caption corresponding to mapping
	* @param type : string data type of mapping values
	*/
	addMappingCaptionForm : function(type) {
		var me 		= this;
		
		// We add form corresponding to the mapping data type
		var selectConditionForm = Ext.getCmp('selectConditionForm');
	    var selectCondition = Ext.getCmp('selectCondition');
		var selectedCondition = selectCondition.getValue();

		var selectMapping = Ext.getCmp('selectMappingVisu');
		var selectedMapping = selectMapping.getValue();

		var networkVizSession = _metExploreViz.getSessionById("viz");
        var colorStore;
        if(type!=="suggestion"){
            networkVizSession.setMapped(selectedCondition);
            colorStore = networkVizSession.getColorMappingsSet();

        }
        else {
            colorStore = networkVizSession.getColorSuggestionsSet();
		}

        var cond;
        if(type==="flux" || Array.isArray(selectedCondition))
			cond = selectedCondition[0];
		else
			cond = selectedCondition;

		if(selectConditionForm)
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

			    	var newMappingCaptionForm = Ext.create('metExploreViz.view.form.MappingCaptionForm', {

				    	itemId: 'mappingCaptionForm'+newId,

			            margin: '0 0 0 0',
			            padding: '0 0 0 0',
			            border:false,
					    items:
					    [
						    {

						        itemId:'chooseColorReaction'+newId,
						        xtype:'panel',
						        border:false,
						        layout:{
						           type:'hbox',
						           align:'stretch'
						        },
						        items:[
						        	{
							            xtype: 'label',
							            forId: 'color',
							            text: value+' :',
							            margin: '0 0 0 10',
							            flex:1,
							            border:false
						        	},{
						        		border:false,
							            xtype: 'hiddenfield',
							            itemId: 'hidden' + newId,
							           	value: color.getValue(),
										listeners: {
											change: function(newValue){
												this.lastValue = newValue.value;
										    }
										}
						        	},
						        	{
							            border:false,
							            margin: '0 10 0 0',
							            width: "40%",
                                        html: '<input ' +
                                        'type="color" ' +
                                        'id="html5colorpicker" ' +
										'onchange="Ext.getCmp(\'selectConditionForm\').down(\'#hidden'+newId+'\').fireEvent(\'change\',this, \''+color.getValue()+'\');" ' +
                                        'value="'+color.getValue()+'" ' +
                                        'style="width:85%;">'
							        }
						        ]
						    }
					    ]
					});

					listMappingCaptionForm.push(newMappingCaptionForm);
					idColors.push(newId);
			    }
				);
                var newConditionPanel;
                var panelID;
                if(type!=="suggestion"){
                    panelID = 'panel'+ cond.replace(me.regexpPanel, "");
                    newConditionPanel = Ext.create('Ext.panel.Panel', {
                        id: panelID,
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


				// Create button to remove mapping
				var delButton = Ext.create('Ext.Button', {
				    iconCls:'del',
		            tooltip:'You must choose a condition to add it',
		            //formBind: true,
		            margin:'5 5 5 0',
		            id: 'delCondition'+panelID,
		            action: 'delCondition'+panelID,
				    handler: function() {
						that.closeMapping(panelID, type);
				    }
				});
			    newConditionPanel.add(delButton);

				var mapp = selectedMapping;

				// Add button to change colors
				var refreshColorButton = Ext.create('Ext.Button', {
				    iconCls:'refresh',
		            margin:'5 5 5 0',
		            id: 'refreshColor'+panelID,
		            action: 'refreshColor'+panelID,
				    handler: function() {
                        var colorStore;
                        if (type === "discrete") {
                            colorStore = networkVizSession.getColorMappingsSet();
                            colorStore.forEach(function (color) {
                                var newId = color.getName().toString().replace(me.regexpPanel, "_");
                                if (Ext.getCmp("selectConditionForm").down("#hidden" + newId)) {
                                    if (color.getValue() !== Ext.getCmp("selectConditionForm").down("#hidden" + newId).lastValue) {
                                        // PERF: Must be changed to set only the color
                                        metExploreD3.GraphMapping.setDiscreteMappingColor(Ext.getCmp("selectConditionForm").down("#hidden" + newId).lastValue, color.getName(), selectedCondition, mapp);
                                    }
                                }
                            });
                        }
						else {
                            if (type === "suggestion") {
                                colorStore = networkVizSession.getColorSuggestionsSet();
                                colorStore.forEach(function (color) {
                                    var newId = color.getName().toString().replace(me.regexpPanel, "_");
                                    if (Ext.getCmp("selectConditionForm").down("#hidden" + newId)) {
                                        if (color.getValue() !== Ext.getCmp("selectConditionForm").down("#hidden" + newId).lastValue) {
                                            // PERF: Must be changed to set only the color$
                                             metExploreD3.GraphMapping.setSuggestionColor(Ext.getCmp("selectConditionForm").down("#hidden" + newId).lastValue, color.getName());
                                        }
                                    }
                                });
                            }
                            else {
                                colorStore = networkVizSession.getColorMappingsSet();
								colorStore.forEach(function (color) {
									var newId = color.getName().toString().replace(me.regexpPanel, "_");

									if (Ext.getCmp("selectConditionForm").down("#hidden" + newId)) {
										if (color.getValue() !== Ext.getCmp("selectConditionForm").down("#hidden" + newId).lastValue) {
											// PERF: Must be changed to set only the color
											metExploreD3.GraphMapping.setContinuousMappingColor(Ext.getCmp("selectConditionForm").down("#hidden" + newId).lastValue, color.getName(), selectedCondition, mapp);
										}

									}
								});

								if (networkVizSession.getColorMappingsSet()[1]) {
									if (parseFloat(networkVizSession.getColorMappingsSet()[0].getName()) < parseFloat(networkVizSession.getColorMappingsSet()[1].getName())) {
										maxValue = parseFloat(networkVizSession.getColorMappingsSet()[1].getName());
										minValue = parseFloat(networkVizSession.getColorMappingsSet()[0].getName());
									}
									else {
										maxValue = parseFloat(networkVizSession.getColorMappingsSet()[0].getName());
										minValue = parseFloat(networkVizSession.getColorMappingsSet()[1].getName());
									}
								}
								else {
									color = parseFloat(networkVizSession.getColorMappingsSet()[0].getName());
								}

								if (type === "continuous") {
									if (networkVizSession.getColorMappingsSet()[1]) {
										metExploreD3.GraphMapping.graphMappingContinuousData(mapp, cond, networkVizSession.getColorMappingById(minValue).getValue(), networkVizSession.getColorMappingById(maxValue).getValue());
									}
									else {
										metExploreD3.GraphMapping.graphMappingContinuousData(mapp, cond, networkVizSession.getColorMappingById(color).getValue(), networkVizSession.getColorMappingById(color).getValue());
									}
								}
								else {
									var fluxType;
									if (selectedCondition.length === 1) {
										fluxType = 'Unique';
										metExploreD3.GraphMapping.graphMappingFlux(mapp, selectedCondition, fluxType, networkVizSession.getColorMappingById(color).getValue(), undefined, Ext.getCmp("opacityCheck").checked, Ext.getCmp("valueonarrowCheck").checked, Ext.getCmp('regroupValuesIntoClassCheck').checked);
									}
									else {
										fluxType = 'Compare';
										metExploreD3.GraphMapping.graphMappingFlux(mapp, selectedCondition, fluxType, networkVizSession.getColorMappingById(maxValue).getValue(), networkVizSession.getColorMappingById(minValue).getValue(), Ext.getCmp("opacityCheck").checked, Ext.getCmp("valueonarrowCheck").checked, Ext.getCmp('regroupValuesIntoClassCheck').checked);
									}
								}
							}
						}
				    }
				});
			    newConditionPanel.add(refreshColorButton);

				// Add mapping caption to selectConditionForm panel
			    if(selectConditionForm)
				{
					selectConditionForm.add(newConditionPanel);
					listMappingCaptionForm.forEach(function(aMappingCaptionForm){

						selectConditionForm.add(aMappingCaptionForm);
					});
				}
			}

		}
	}
});