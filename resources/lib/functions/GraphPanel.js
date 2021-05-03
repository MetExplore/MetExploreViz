/**
 * @class metExploreD3.GraphPanel
 * To manage the panel where is the graph
 *
 * Initialization of visualization panel
 * Treatment of JSON network
 * Resizing of panel
 *
 * @author MC
 * @uses metExploreD3.GraphNode
 * @uses metExploreD3.GraphNetwork
 * @uses metExploreD3.GraphUtils
 */
metExploreD3.GraphPanel = {

	/*****************************************************
	 * Get panel height
     * @param {String} panel Active panel
	 * @return {String}
	 */
	getHeight : function(panel){
		return document.getElementById(panel).style.height;
	},

    /*****************************************************
	* Get panel width
    * @param {String} panel Active panel
	 * @return {String}
	*/
	getWidth : function(panel){
        return document.getElementById(panel).style.width;
	},

	/*****************************************************
	 * Add border to the selected panel to highlight it
	 * @param String} panel Panel to activate
	 * @private
	 */
	setActivePanel : function(panel){
		var lastPanel = _MyThisGraphNode.activePanel;
        if(!lastPanel)
        {
            _MyThisGraphNode.activePanel=panel;
            d3.select("#"+panel).select("#D3viz")
                .style("box-shadow", " 0px 0px 10px 3px #144778 inset");
        }
        else
		{
            if(lastPanel!==panel)
            {
                _MyThisGraphNode.activePanel=panel;
                d3.select("#"+panel).select("#D3viz")
                    .style("box-shadow", " 0px 0px 10px 3px #144778 inset");


                d3.select("#"+lastPanel).select("#D3viz")
                    .style("box-shadow", "");
            }
		}

    },

	/*****************************************************
	 * Resize svg viz when layout is modified
	 *  @param {String} panel Active panel
	 * @private
	 */
	resizeViz : function(panel){
		var scale = metExploreD3.getScaleById(panel);
		if(scale!=undefined){

			d3.select("#metexplore").text('');
			d3.select("#"+panel).select("#D3viz").attr('width', $("#"+panel).width()); //max width
	        d3.select("#"+panel).select("#D3viz").attr('height', $("#"+panel).height()); //max height

            // Get height and witdh of panel
            var h = parseInt(metExploreD3.GraphPanel.getHeight(panel));
            var w = parseInt(metExploreD3.GraphPanel.getWidth(panel));

            // Initiate the D3 force drawing algorithm
            var session = _metExploreViz.getSessionById(panel);

			var forceX = d3.forceX()
				.x(w/2)
				.strength(0.006);

			var forceY = d3.forceY()
				.y(h/2)
				.strength(0.006);

			var force = session.getForce();
			force
				.force('x', forceX)
				.force('y', forceY);

            session.setActivity(true);


            // Redefine Zoom and brush
			metExploreD3.GraphNetwork.zoomListener
				.scaleExtent([ 0.01, 30 ])
				.extent([[w*.45, h*.45], [w*.55, h*.55]])
				.translateExtent([[-w*10, -h*10], [w*10, h*10]]);


			// var transform = d3.zoomTransform(d3.select("#viz").select("#D3viz").node());
			// scale.getZoom().scaleTo(d3.select("#"+panel).select("#D3viz"), scaleZ);
			// scale.getZoom().translateTo(d3.select("#"+panel).select("#D3viz"), transform.x, transform.y);
            // scale.setScale(scaleZ, 1, metExploreD3.GraphNetwork.zoomListener);
			//
			//
			//
            // metExploreD3.setScale(scale, panel);

            metExploreD3.GraphNetwork.defineBrush(panel);

            d3.select("#viz").select("#D3viz")
				.select("#logoViz")
				.select("image")
				.attr('x', $("#viz").width() - 100)
				.attr('y', $("#viz").height() - 124);

			d3.select("#metexplore").text('MetExploreViz v'+Ext.manifest.version).attr('x', $("#viz").width() - 132).attr(
					'y',  $("#viz").height() - 10);

		}
	},

	/*****************************************************
	 * Resize svg panels when layout is modified
     * @param {String}panel Active panel
	 * @private
	 */
	resizePanels : function(panel){
		var session = _metExploreViz.getSessionById(panel);
		var h = $("#"+panel).height();
		var w = $("#"+panel).width();

		if(session!=undefined)
		{
			if(session.isLinked()){

				var sessionMain = _metExploreViz.getSessionById("viz");
				var force = sessionMain.getForce();
				if(force!=undefined){
					h = parseInt(metExploreD3.GraphPanel.getHeight(panel));
					w = parseInt(metExploreD3.GraphPanel.getWidth(panel));

					var forceX = d3.forceX()
						.x(w/2)
						.strength(0.006);

					var forceY = d3.forceY()
						.y(h/2)
						.strength(0.006);
					force
						.force('x', forceX)
						.force('y', forceY);

					metExploreD3.GraphNetwork.zoomListener
						.scaleExtent([ 0.01, 30 ])
						.extent([[w*.45, h*.45], [w*.55, h*.55]])
						.translateExtent([[-w*10, -h*10], [w*10, h*10]]);
				}
			}
			else
			{
				var force = session.getForce();
				if(force!=undefined){
					h = parseInt(metExploreD3.GraphPanel.getHeight(panel));
					w = parseInt(metExploreD3.GraphPanel.getWidth(panel));

					var forceX = d3.forceX()
						.x(w/2)
						.strength(0.006);

					var forceY = d3.forceY()
						.y(h/2)
						.strength(0.006);
					force
						.force('x', forceX)
						.force('y', forceY);

					metExploreD3.GraphNetwork.zoomListener
						.scaleExtent([ 0.01, 30 ])
						.extent([[w*.45, h*.45], [w*.55, h*.55]])
						.translateExtent([[-w*10, -h*10], [w*10, h*10]]);
	            }
			}
		}
	},

	/*****************************************************
	 * Init all visualisation panel in function of JSON used from parent website or from JSON
	 *   @param {Object} json JSON to load
	 *   @fires resetMapping afterrefresh
	 *   @throws error in function
	 */
	refreshJSON : function(json) {
		var jsonParsed = metExploreD3.GraphUtils.decodeJSON(json);
		if(jsonParsed){
			if(!_metExploreViz.isLaunched() || metExploreD3.isNewBioSource() )
				metExploreD3.GraphPanel.initiateViz('D3');

			var vizComp = Ext.getCmp("viz");
			if(vizComp!=undefined){
				var panel;
				if(Ext.getCmp("maskInit").isHidden())
					panel = 'graphPanel';
				else
					panel = "maskInit";

				var myMask = metExploreD3.createLoadMask("Refresh in process...", panel);
				if(myMask!= undefined){

					metExploreD3.showMask(myMask);

			        setTimeout(
						function() {
							try{
								metExploreD3.fireEvent('selectConditionForm', "resetMapping");

								if(jsonParsed.sessions!=undefined)
									metExploreD3.GraphPanel.loadDataJSON(json, end);
								else
									metExploreD3.GraphPanel.initDataJSON(json, end); // Init of metabolite network

								function end(){
									metExploreD3.hideMask(myMask);
									metExploreD3.hideInitialMask();
									metExploreD3.fireEvent('graphPanel', 'afterrefresh');
									if(metExploreD3.isNewBioSource()){
										metExploreD3.hideInitialMask();
										metExploreD3.setIsNewBioSource(false);
										_metExploreViz.setLaunched(true);
									}
								}
							}
							catch (e) {

								e.functionUsed="refreshJSON";
								metExploreD3.hideMask(myMask);
								metExploreD3.displayMessage("Warning", 'An error occurs durding loading graph please contact <a href="mailto:contact-metexplore@inra.fr">contact-metexplore@inra.fr</a>.');
								throw e;
							}
				    }, 100);
			    }
			}
		}
	},

	/*****************************************************
	* Update the network
	 * @param {Object} json JSON to load
	 * @param {Function} func Callback function
	 * @fires click
	*/
	refreshPanel : function(json, func) {

		var jsonParsed = metExploreD3.GraphUtils.decodeJSON(json);
		if(jsonParsed){
			if(jsonParsed.nodes || jsonParsed.sessions){
				if(metExploreD3.isNewBioSource() || !_metExploreViz.isLaunched() || metExploreD3.getGeneralStyle().windowsAlertIsDisable()){

					metExploreD3.GraphPanel.refreshJSON(json);
					if(typeof func==='function') func();
				}
				else
				{
					Ext.Msg.show({
						title:'Are you sure?',
						msg: 'This action will remove previous network. <br />Would you like to do this?',
						buttons: Ext.Msg.OKCANCEL,
						fn: function(btn){
							if(btn=="ok")
							{
								metExploreD3.GraphPanel.refreshJSON(json);
								if(func!=undefined && typeof func==='function') func();
								Ext.getCmp('cycleDetection').setVisible(false);
								if (metExploreD3.GraphStyleEdition.editMode){
									metExploreD3.fireEvent("enterEditMode", "click");
								}
							}
						},
						icon: Ext.Msg.QUESTION
					});
				}
			}
			else
			{
				//SYNTAX ERROR
				metExploreD3.displayWarning("Syntaxe error", 'File have bad syntax. Use a saved file from MetExploreViz or see <a href="http://metexplore.toulouse.inra.fr/metexploreViz/doc/documentation.php#generalfunctioning">MetExploreViz documentation</a>.');
			}
		}
		else
		{
			//SYNTAX ERROR
			metExploreD3.displayWarning("Syntaxe error", 'File have bad syntax. Use a saved file from MetExploreViz or see <a href="http://metexplore.toulouse.inra.fr/metexploreViz/doc/documentation.php#generalfunctioning">MetExploreViz documentation</a>.');
		}

	},

	/*****************************************************
	 * Fill the data models imported from JSON file
	 * @param {Object} json JSON to load
	 * @param {Function} endFunc Callback function
	 * @fires loadNetworkBiosource jsoninit initiateviz sideCompound jsonmapping reloadMapping closeMapping
	 * @private
	 */
	loadDataJSON : function(json, endFunc){
		var jsonParsed = metExploreD3.GraphUtils.decodeJSON(json);
		if(jsonParsed){

			if(metExploreD3.bioSourceControled())
			{
				_metExploreViz.setBiosource(jsonParsed.biosource);
				metExploreD3.fireEventParentWebSite("loadNetworkBiosource", {biosource : jsonParsed.biosource, func:loadJSON, endFunc:endFunc, json:json});
			}
			else
			{
				loadJSON();
				endFunc();
			}
			function loadJSON(){
				var networkVizSession = _metExploreViz.getSessionById("viz");

				var oldForce = networkVizSession.getForce();
				// Reset visualisation---less than a ms
				if(oldForce!=undefined){
					oldForce.nodes([]);
					oldForce.force("link", null);

					oldForce.on("end", null);
					oldForce.on("tick", null);

				}

				networkVizSession.reset();


				if(jsonParsed.comparedPanels)
				{
					jsonParsed.comparedPanels.forEach(function(comparedPanel){
						_metExploreViz.addComparedPanel(new ComparedPanel(comparedPanel.panel, comparedPanel.visible, comparedPanel.parent, comparedPanel.title));
					});
				}

				if(jsonParsed.mappings)
				{
					jsonParsed.mappings.forEach(function(mapping){
						var mapping = new Mapping(mapping.name, mapping.conditions, mapping.targetLabel, mapping.data);
                        mapping.data = mapping.id;
						_metExploreViz.addMapping(mapping);
					});
				}

				if(jsonParsed.generalStyle)
				{
					var oldGeneralStyle = metExploreD3.getGeneralStyle();
					var style = new GeneralStyle(
						oldGeneralStyle.getWebsiteName(),
						jsonParsed.generalStyle.colorMinMappingContinuous,
						jsonParsed.generalStyle.colorMaxMappingContinuous,
						jsonParsed.generalStyle.maxReactionThreshold,
						jsonParsed.generalStyle.displayLabelsForOpt,
						jsonParsed.generalStyle.displayLinksForOpt,
						jsonParsed.generalStyle.displayConvexhulls,
						jsonParsed.generalStyle.displayPathwaysOnLinks,
						jsonParsed.generalStyle.clustered,
						jsonParsed.generalStyle.displayCaption,
						oldGeneralStyle.hasEventForNodeInfo(),
						oldGeneralStyle.loadButtonIsHidden(),
						oldGeneralStyle.windowsAlertIsDisable()
					);
					metExploreD3.setGeneralStyle(style);
				}

				var linkStyle;
				if(jsonParsed.linkStyle)
				{
					linkStyle = new LinkStyle(jsonParsed.linkStyle.size, jsonParsed.linkStyle.lineWidth, jsonParsed.linkStyle.markerWidth, jsonParsed.linkStyle.markerHeight, jsonParsed.linkStyle.markerInColor, jsonParsed.linkStyle.markerOutColor, jsonParsed.linkStyle.markerStrokeColor, jsonParsed.linkStyle.markerStrokeWidth, jsonParsed.linkStyle.strokeColor);
					metExploreD3.setLinkStyle(linkStyle);

				}
				var metaboliteStyle;
				if(jsonParsed.metaboliteStyle)
				{
					metaboliteStyle = new MetaboliteStyle(jsonParsed.metaboliteStyle.backgroundColor,jsonParsed.metaboliteStyle.height, jsonParsed.metaboliteStyle.width, jsonParsed.metaboliteStyle.rx, jsonParsed.metaboliteStyle.ry, jsonParsed.metaboliteStyle.opacity, jsonParsed.metaboliteStyle.strokeColor, jsonParsed.metaboliteStyle.strokeWidth, jsonParsed.metaboliteStyle.fontColor, jsonParsed.metaboliteStyle.fontSize, jsonParsed.metaboliteStyle.labelOpacity, jsonParsed.metaboliteStyle.label,  jsonParsed.metaboliteStyle.useAlias);
				}

				var reactionStyle;
				if(jsonParsed.reactionStyle)
				{
					var reactionStyle = new ReactionStyle(
						jsonParsed.reactionStyle.backgroundColor,
						jsonParsed.reactionStyle.height,
						jsonParsed.reactionStyle.width,
						jsonParsed.reactionStyle.rx,
						jsonParsed.reactionStyle.ry,
						jsonParsed.reactionStyle.opacity,
						jsonParsed.reactionStyle.strokeColor,
						jsonParsed.reactionStyle.strokeWidth,
						jsonParsed.reactionStyle.fontColor,
						jsonParsed.reactionStyle.fontSize,
						jsonParsed.reactionStyle.fontWeight,
						jsonParsed.reactionStyle.labelOpacity,
						jsonParsed.reactionStyle.label,
						jsonParsed.reactionStyle.useAlias);

					metExploreD3.setReactionStyle(reactionStyle);
				}

				var sessions = jsonParsed.sessions;
				for (var key in sessions) {
					if(key!='viz')
			        {
						var networkVizSession = new NetworkVizSession();
					    networkVizSession.setVizEngine("D3");
					    networkVizSession.setId(key);
					    networkVizSession.setLinked(sessions[key].linked);
					    _metExploreViz.addSession(networkVizSession);


						var accord = Ext.getCmp("comparePanel");
                        accord.show();
			        	var comparedPanel = _metExploreViz.getComparedPanelById(key);

						var item = [
			        		{
			        			id:comparedPanel.getParent(),
			        			title:comparedPanel.getTitle(),
			        			html:"<div id=\""+comparedPanel.getParent()+"\" height=\"100%\" width=\"100%\"></div>",
			        			flex: 1,
			        			closable: true,
			        			collapsible: true,
			        			collapseDirection: "left"
			        		}
			        	];

						accord.add(item);
						accord.expand();
                        metExploreD3.fireEventArg("comparePanel", 'initiateviz', key);
						//metExploreD3.GraphNetwork.refreshSvg(panelId);
					}

					var anim = sessions[key].animated;

					if(!anim)
						anim = false;

					networkVizSession.setAnimated(anim);

					var networkData = new NetworkData(key);
					networkData.cloneObject(sessions[key].d3Data);

					var nodes = networkData.getNodes();
					nodes.forEach(function(node){
						if(node.getBiologicalType()=="metabolite")
						{
							if(node.svgWidth==="0" || node.svgWidth===undefined)
								node.svgWidth= metaboliteStyle.getWidth();

							if(node.svgHeight==="0" || node.svgHeight===undefined)
								node.svgHeight= metaboliteStyle.getHeight();

							if(networkData.getCompartmentByName(node.getCompartment())==null)
								networkData.addCompartment(node.getCompartment());
                            }
						else
						{
                            if(node.getBiologicalType()=="reaction") {
								if(node.svgWidth==="0" || node.svgWidth===undefined)
									node.svgWidth= reactionStyle.getWidth();

								if(node.svgHeight==="0" || node.svgHeight===undefined)
									node.svgHeight= reactionStyle.getHeight();


								node.getPathways().forEach(function (pathway) {
                                    if (networkData.getPathwayByName(pathway) == null)
                                        networkData.addPathway(pathway);
                                });
                            }
						}

						if(node.getMappingDatasLength()>0)
						{
							node.getMappingDatas().forEach(function(mappingData){
								mappingData.setNode(node);
								if(_metExploreViz.getMappingByName(mappingData.getMappingName())!=null){
									var mapping = _metExploreViz.getMappingByName(mappingData.getMappingName());
									mapping.addMap(mappingData);
								}
							});
						}
					});

                    if(networkData.getPathwaysLength()>0) metExploreD3.fireEventArg('selectComponentVisu', "jsoninit", {name:"Pathways", data:networkData.getPathways()});

                    if(networkData.getCompartmentsLength()>0) metExploreD3.fireEventArg('selectComponentVisu', "jsoninit", {name:"Compartments", data:networkData.getCompartments()});

                    networkData.setId(key);

					networkVizSession.setD3Data(networkData);

					// if(sessions[key].selectedNodes)
					// {
					// 	sessions[key].selectedNodes.forEach(function(nodeId){
					// 		networkVizSession.addSelectedNode(nodeId);
					// 	});
					// }

					if(sessions[key].duplicatedNodes)
					{
						sessions[key].duplicatedNodes.filter(metExploreD3.GraphUtils.onlyUnique).forEach(function(nodeId){
							var nodeSC = networkVizSession.getD3Data().getNodeById(nodeId);
							metExploreD3.fireEventParentWebSite("sideCompound", nodeSC);
						});
					}


					if(_metExploreViz.getMappingsLength()>0 && key=="viz" && !metExploreD3.getGeneralStyle().windowsAlertIsDisable())
					{
						metExploreD3.displayMessageYesNo("Mapping",'Do you want keep mappings.',function(btn){
			                if(btn=="yes")
			                {
			                    _metExploreViz.getMappingsSet().forEach(function(mapping){

			                    	metExploreD3.GraphMapping.reloadMapping(mapping);
				                	metExploreD3.fireEventArg('buttonMap', "jsonmapping", mapping);
									metExploreD3.fireEventArg('selectMapping', "jsonmapping", mapping);
			                    });
				                metExploreD3.fireEventArg('buttonRefresh', "reloadMapping", true);
			                }
			                else
			                {
			                	metExploreD3.fireEventArg('buttonMap', "reloadMapping", false);
				                metExploreD3.fireEventArg('buttonRefresh', "reloadMapping", false);
			                	metExploreD3.fireEventArg('selectConditionForm', "closeMapping", _metExploreViz.getActiveMapping);
				                _metExploreViz.resetMappings();
			                }
			           });

					}

					if(sessions[key].mapped)
					{
						networkVizSession.setMapped(sessions[key].mapped);
					}

					if(sessions[key].mappingDataType)
					{
						networkVizSession.setMappingDataType(sessions[key].mappingDataType);
					}

					if(sessions[key].activeMapping)
					{
						networkVizSession.setActiveMapping(sessions[key].activeMapping);
					}
				}




				for (var key in sessions) {
					metExploreD3.GraphNetwork.first=true;
					metExploreD3.GraphNetwork.refreshSvg(key);
                    metExploreD3.GraphNetwork.refreshViz(key);
                    // set style of previous session from JSON
                    var networkDataViz = new NetworkData(key);
                    networkDataViz.cloneObject(sessions[key].d3Data);
                    // nodesData.forEach(function(node) {
						// metExploreD3.GraphStyleEdition.setStartingStyle(node, key);
                    // });
                    if (sessions[key].drawnCycles && Array.isArray(sessions[key].drawnCycles)) {
                        for (var i=0; i<sessions[key].drawnCycles.length; i++){
                            metExploreD3.GraphFunction.drawMetaboliteCycle(sessions[key].drawnCycles[i]);
                        }
                    }
			    }

				endFunc();
			}
		}
	},

	/*****************************************************
	 * Fill the data models with the store reaction
	 * @param {Object} json JSON to load
	 * @param {Function} func Callback function
	 * @fires loadNetworkBiosource jsoninit jsonmapping
	 * @private
	 */
	initDataJSON : function(json, func){
		var jsonParsed = metExploreD3.GraphUtils.decodeJSON(json);
		if(jsonParsed){
			var networkVizSession = _metExploreViz.getSessionById("viz");

			var networkData = networkVizSession.getD3Data();

	        _metExploreViz.resetOldCoodinates();
	        networkData.getNodes().forEach(function(node){
	        	_metExploreViz.addOldCoodinates({"id":node.getId(), "x":node.x, "px":node.px, "y":node.y, "py":node.py});
	        });

			var oldForce = networkVizSession.getForce();
			// Reset visualisation---less than a ms
			if(oldForce!=undefined){
				oldForce.nodes([]);
				oldForce.force("link", null);

				oldForce.on("end", null);
				oldForce.on("tick", null);

			}
			networkVizSession.reset();
			networkVizSession.setAnimated(true);

			var networkData = new NetworkData('viz');
			networkData.cloneObject(jsonParsed);
			var metaboliteStyle = metExploreD3.getMetaboliteStyle();
			var reactionStyle = metExploreD3.getReactionStyle();

			var nodes = networkData.getNodes();
			nodes.forEach(function(node){
				if(node.getBiologicalType()=="metabolite")
				{
					if(node.svgWidth==="0" || node.svgWidth===undefined)
						node.svgWidth= metaboliteStyle.getWidth();

					if(node.svgHeight==="0" || node.svgHeight===undefined)
						node.svgHeight= metaboliteStyle.getHeight();

					if(networkData.getCompartmentByName(node.getCompartment())==null)
						networkData.addCompartment(node.getCompartment());
                    if(networkData.getCompartmentsLength()>0) metExploreD3.fireEventArg('selectComponentVisu', "jsoninit", {name:"Compartments", data:networkData.getCompartments()});
				}
				else
				{
					if(node.getBiologicalType()==="reaction"){
						if(node.svgWidth==="0" || node.svgWidth===undefined)
							node.svgWidth= reactionStyle.getWidth();

						if(node.svgHeight==="0" || node.svgHeight===undefined)
							node.svgHeight= reactionStyle.getHeight();
					}

					node.getPathways().forEach(function(pathway){
						if(networkData.getPathwayByName(pathway)==null)
							networkData.addPathway(pathway);
					});
					if(networkData.getPathwaysLength()>0) metExploreD3.fireEventArg('selectComponentVisu', "jsoninit", {name:"Pathways", data:networkData.getPathways()});
				}
			});
            networkData.setId('viz');
			networkVizSession.setD3Data(networkData);
			metExploreD3.GraphNetwork.first=true;
		    metExploreD3.GraphNetwork.refreshSvg("viz");

		    var oldCoodinates = _metExploreViz.getOldCoodinates();
			if(oldCoodinates.length>0)
			{
				var overlap = false;
				var i = 0;
			    while (i < oldCoodinates.length-1 && !overlap) {
				    if(networkData.getNodeById(oldCoodinates[i].id)!=undefined)
				    	overlap=true;
				    i++;
				}

				if(overlap && !metExploreD3.getGeneralStyle().windowsAlertIsDisable()){
					metExploreD3.displayMessageYesNo("Coordinates",'Do you want to keep nodes coordinates.',function(btn){
		                if(btn=="yes")
		                {
		                	var selected = [];
				            oldCoodinates.forEach(function(coor){
				            	var node = networkData.getNodeById(coor.id);
					            if(node!=undefined){
					            	node.x = coor.x;
					            	node.y = coor.y;
					            	node.px = coor.px;
					            	node.py = coor.py;
					            	selected.push(coor.id);

					            }
				            });
				            d3.select("#viz").select("#graphComponent")
								.selectAll("g.node")
						        .filter(function(d) { return selected.indexOf(d.id)!=-1; })
						        .each(function(d) {
						        	d.setLocked(!d.isLocked());
									d.fixed=d.isLocked();
									if(d.isLocked())
										metExploreD3.GraphNode.fixNode(d);
						        });

				            d3.select("#viz").select("#graphComponent")
								.selectAll("g.node")
						        .filter(function(d) { return selected.indexOf(d.id)!=-1; })
						        .each(function(d) { _MyThisGraphNode.selection(d, "viz"); });

							metExploreD3.GraphNetwork.tick("viz");
		                }
		          	});

				}
			}



			if(_metExploreViz.getMappingsLength()>0)
			{

				// metExploreD3.fireEventArg('buttonMap', "reloadMapping", false);
				// metExploreD3.fireEventArg('selectMapping', "reloadMapping", false);
	            _metExploreViz.getMappingsSet().forEach(function(mapping){
	            	metExploreD3.GraphMapping.reloadMapping(mapping);
	            	metExploreD3.fireEventArg('buttonMap', "jsonmapping", mapping);
					metExploreD3.fireEventArg('selectMapping', "jsonmapping", mapping);
	            });
				metExploreD3.GraphNetwork.tick("viz");
			}
		}
		func();
	},

	/*****************************************************
	 * Initialization of visualization
	 * @param {String} vizEngine : library used to make the visualization
	 * @fires initiateviz
	 * @private
	 */
	initiateViz : function(vizEngine) {

		d3.select("#viz").selectAll("#presentationViz, #presentationLogoViz").classed("hide", true);
		metExploreD3.fireEvent('viz', 'initiateviz');
		// Previously we used Cytoscape.js. Now we use D3.js,
		// that what is this test for
		_metExploreViz.setLaunched(true);
		if (vizEngine === 'D3') {
			metExploreD3.GraphNetwork.delayedInitialisation('viz');
		}
	},

	/*****************************************************
	 * Init keyboard shortsut events
	 * @private
	 */
	initShortCut: function () {
		d3.select("body")
			.on("keydown", function () {
				_MyThisGraphNode.charKey = d3.event.keyCode;
				_MyThisGraphNode.ctrlKey = d3.event.ctrlKey;
				_MyThisGraphNode.altKey = d3.event.altKey;
				var activesession = _metExploreViz.getSessionById(_MyThisGraphNode.activePanel);

				//H	72
				if (_MyThisGraphNode.charKey == 72 && !_MyThisGraphNode.altKey && activesession.getSelectedNodes().length > 0 && metExploreD3.GraphNetwork.focus) {
					metExploreD3.GraphFunction.horizontalAlign(_MyThisGraphNode.activePanel);
				}

				if (_MyThisGraphNode.charKey == 72 && _MyThisGraphNode.altKey && activesession.getSelectedNodes().length > 0 && metExploreD3.GraphNetwork.focus) {
					metExploreD3.GraphFunction.horizontalReverse(_MyThisGraphNode.activePanel);
				}

				//V 86
				if (_MyThisGraphNode.charKey == 86 && !_MyThisGraphNode.altKey && activesession.getSelectedNodes().length > 0 && metExploreD3.GraphNetwork.focus) {
					metExploreD3.GraphFunction.verticalAlign(_MyThisGraphNode.activePanel);
				}

				if (_MyThisGraphNode.charKey == 86 && _MyThisGraphNode.altKey && activesession.getSelectedNodes().length > 0 && metExploreD3.GraphNetwork.focus) {
					metExploreD3.GraphFunction.verticalReverse(_MyThisGraphNode.activePanel);
				}


				// 65=A
				if (_MyThisGraphNode.charKey == 65 && _MyThisGraphNode.ctrlKey && metExploreD3.GraphNetwork.focus) {
					d3.select("#" + _MyThisGraphNode.activePanel).select("#D3viz").select("#graphComponent").selectAll("g.node")
						.each(function (node) {
							if (!node.isSelected()) {
								_MyThisGraphNode.selection(node, _MyThisGraphNode.activePanel);
							}
						});
				}
			})
			.on("keyup", function (e) {
				// 46=Suppr
				var activesession = _metExploreViz.getSessionById(_MyThisGraphNode.activePanel);
				if (_MyThisGraphNode.charKey == 46 && activesession.getSelectedNodes().length > 0 && metExploreD3.GraphNetwork.focus) {
					metExploreD3.displayMessageYesNo("Selected nodes", 'Do you want remove selected nodes?', function (btn) {
						if (btn == "yes") {
							metExploreD3.GraphNetwork.removeSelectedNode(_MyThisGraphNode.activePanel)
						}
					});
				}

				_MyThisGraphNode.charKey = 'none';
				_MyThisGraphNode.ctrlKey = d3.event.ctrlKey;
			});
	},
};
