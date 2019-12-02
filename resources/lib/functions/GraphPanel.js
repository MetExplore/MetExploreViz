/**
 * @author MC
 * (a)description : To manage the panel where is the graph
 */
metExploreD3.GraphPanel = {

	/*****************************************************
	* Get panel height
    * @param {} panel : active panel
	*/
	getHeight : function(panel){
		return document.getElementById(panel).style.height;
	},

    /*****************************************************
	* Get panel width
    * @param {} panel : active panel
	*/
	getWidth : function(panel){
        return document.getElementById(panel).style.width;
	},

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
	* To resize svg viz when layout is modified
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
			var h = parseInt(metExploreD3.GraphPanel.getHeight(panel));
			var w = parseInt(metExploreD3.GraphPanel.getWidth(panel));
			var scaleZ = scale.getZoomScale();
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
				.attr('x', $("#viz").width() - 88)
				.attr('y', $("#viz").height() - 70);

			d3.select("#metexplore").text('MetExploreViz v'+Ext.manifest.version).attr('x', $("#viz").width() - 132).attr(
					'y',  $("#viz").height() - 10);

		}
	},

	/*****************************************************
	* To resize svg panels when layout is modified
    * @param {} panel : active panel
	*/
	resizePanels : function(panel){
		var sessionsStore = _metExploreViz.getSessionsSet();
		var session = _metExploreViz.getSessionById(panel);
		var h = $("#"+panel).height();
		var w = $("#"+panel).width();

		if(d3.select("#"+panel).select("#D3viz").select("#buttonZoomIn").node()!=null
			&& d3.select("#"+panel).select("#D3viz").select("#buttonZoomOut").node()!=null
			&& d3.select("#"+panel).select("#D3viz").select("#buttonHand").node()!=null)
		{
			var x = d3
				.select("#"+panel)
				.select("#D3viz")
				.select("#buttonZoomIn")
				.attr('x');
			var deltaX = w-60-x;

			d3
				.select("#"+panel)
				.select("#D3viz")
				.select("#buttonZoomIn")
				.attr("transform", "translate("+deltaX+",0) scale(1)");

			x = d3
				.select("#"+panel)
				.select("#D3viz")
				.select("#buttonZoomOut")
				.attr('x');
			deltaX = w-110-x;

			d3
				.select("#"+panel)
				.select("#D3viz")
				.select("#buttonZoomOut")
				.attr("transform", "translate("+deltaX+",0) scale(1)");
			x = d3
				.select("#"+panel)
				.select("#D3viz")
				.select("#buttonHand")
				.attr('x');
			deltaX = w-160-x;

		    d3
				.select("#"+panel)
				.select("#D3viz")
				.select("#buttonHand")
				.attr("transform", "translate("+deltaX+",0) scale(1)");

		}
		if(session!=undefined)
		{
			if(session.isLinked()){

				var sessionMain = _metExploreViz.getSessionById("viz");
				var force = sessionMain.getForce();
				if(force!=undefined){
					var h = parseInt(metExploreD3.GraphPanel.getHeight(panel));
					var w = parseInt(metExploreD3.GraphPanel.getWidth(panel));

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
					var h = parseInt(metExploreD3.GraphPanel.getHeight(panel));
					var w = parseInt(metExploreD3.GraphPanel.getWidth(panel));

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
	* To remove svg components of panel
    * @param {} panel : active panel
	*/
	removeSvgComponents : function(panel){
		d3.select("#"+panel).select("#D3viz").selectAll("*").remove();
	},

	/*****************************************************
	* Update the network to fit the cart content
	*/
	refreshJSON : function(json) {
		var jsonParsed = metExploreD3.GraphUtils.decodeJSON(json);
		if(jsonParsed){
			if(!_metExploreViz.isLaunched() || metExploreD3.isNewBioSource() )
				metExploreD3.GraphPanel.initiateViz('D3');

			var vizComp = Ext.getCmp("viz");
			if(vizComp!=undefined){
				var myMask = metExploreD3.createLoadMask("Refresh in process...", 'viz');
				if(myMask!= undefined){

					metExploreD3.showMask(myMask);

					var that = this;
			        setTimeout(
						function() {
							try{
								metExploreD3.fireEvent('selectConditionForm', "resetMapping");

								// var startall = new Date().getTime();
								// var start = new Date().getTime();
								// console.log("----Viz: START refresh/init Viz");

								if(jsonParsed.sessions!=undefined)
									metExploreD3.GraphPanel.loadDataJSON(json, end);
								else
									metExploreD3.GraphPanel.initDataJSON(json, end); // Init of metabolite network

								// 62771 ms for recon before refactoring
								// 41465 ms now
								// var endall = new Date().getTime();
								// var timeall = endall - startall;
								// console.log("----Viz: FINISH refresh/ all "+timeall);
								/*metExploreD3.hideMask(myMask);
								metExploreD3.fireEvent('graphPanel', 'afterrefresh');*/
								function end(){
									metExploreD3.hideMask(myMask);

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
								metExploreD3.displayMessage("Warning", 'An error occurs durding loading graph please contact <a href="mailto:contact-metexplore@inra.fr">contact-metexplore@inra.fr</a>.')
								throw e;
							}
				    }, 100);
			    }
			}
		}
	},

	/*****************************************************
	* Update the network
	*/
	refreshPanel : function(json, func) {
		var me = this;
		metExploreD3.hideInitialMask();

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
	* Draw network in a hierarchical way
	*/
    hierarchicalDrawing : function() {
    	//graph structure used by dagre library (and behind graphviz) to compute the drawing
		var graph = new dagre.graphlib.Graph().setGraph({});
		var session = _metExploreViz.getSessionById('viz');
		
		//create the graph structure from the MetExploreViz graph
		//In order to reduce the number of layers, we won't consider all ther reactions to be nodes in the dagre graph
		//If a reaction has only one substrate and one product (two connected links), we won't use it in the computation
		//Algorithm is as follow:
		//For each reaction node in the original graph
		//	if the node has two links
		//		if it is the first time we visit the reaction
		//			add the substrate as a node in the graph
		//			add the product as a node in the graph
		//			add the edge (substrate,product) in the graph
		//			set the label of the edge as the id of the reaction
		//		else
		//			find the reaciton r corresponding to the edge in the graph which has the same substrate and product
		//			add the current reaction to the associated reaction list of r 
		//	else
		//		for each link connected to the reaction
		//			add the metabolite to the graph
		//			add the reaction to the graph
		//			add the edge (metabolite,reaction) to the graph

		session.getD3Data().getNodes()
				.filter(function (node){return node.biologicalType=="reaction" && !node.isHidden();})
				.filter(function (node){
				   	// check if the reaction has only one substrate and one product
				   		var connectedLinks=session.getD3Data().getLinks()
				   			.filter(function(link){
				   				return (link.source == node) || (link.target == node);
				   				});
				   			//console.log(connectedLinks);
				   		if(connectedLinks.length==2){
				   			//the node won't be used in the computation so we are going to add the source and the target and connect them
				   			//For each of both links, get the source node and target nodes
				   			var source;
				   			var target;
				   			connectedLinks.forEach(function(link){
				   				if(link.source == node){
				   					target=link.getTarget();
				   				}
				   				if(link.target == node){
				   					source=link.getSource();
				   				}	
				   			});
				   			
				   			if(source && target) {
                                var sourceNode = graph.setNode(source, {label: source.id});

                                var targetNode = graph.setNode(target, {label: target.id});

                                if (graph.edge(source, target)) {
                                    //The label of the reaction which has the same substrate and product and is already in the graph.
                                    var referenceReactionLabel = graph.edge(source, target).label;
                                    var referenceNode = session.getD3Data().getNodes()
                                        .find(function (n) {
                                            return n.id == referenceReactionLabel;
                                        });
                                    //if the edge is already in the graph we have to store the reaction since it won't be placed in the final view.
                                    //indeed dagre doesn't allow multi-edges.
                                    // who have to associate the current reaction to the one that will be drawn

                                    if (!referenceNode.associatedReactions) {
                                        var associatedReactions = [];
                                        referenceNode.associatedReactions = associatedReactions;
                                        referenceNode.associatedReactions.push(node);
                                    }
                                    else {
                                        referenceNode.associatedReactions.push(node);
                                    }
                                }
                                else {
                                    graph.setEdge(source.id, target.id, {label: node.getId()});
                                }
                            }
				   		}
				   		else{
				   			//Add the reaction to the node list
				   			//add connection to the reaction and substrate product
				   				connectedLinks.forEach(function(link){
				   				graph.setNode(link.getSource(), {label:link.getSource().id});
				   				graph.setNode(link.getTarget(), {label:link.getTarget().id});
				   				graph.setEdge(link.getSource().id, link.getTarget().id, { label: link.getSource().id+' -- '+link.getTarget().id });
				   			});
				   		}
                    	
                     });

		var layout=dagre.layout(graph);


		//-----Drawing the graph
		//For each node of the visualised graph
		//		if the node is in the Dagre graph
		//			use the Dagre coordinates to draw the node
		//		else
		//			for each edge
		//				if the edge has a reaction as a label (it means this reaction has no corresponding node in the Dagre graph)
		//					affect to the coordinates of the first bend to the reaction
		//					for r=0 to the size of associated reaction AR table
		//						set same y to AR[r]
		//						set AR[r].x <- x+ 10*(AR[r]+1)
		d3.select("#viz").select("#D3viz").select("#graphComponent").selectAll("g.node")
                                .each(function(node){
                                //place nodes that were in the graph
                                	if(graph.node(node)){
                                	 	var x;
                                	 	var y;
                                		graph.nodes().forEach(function(n) {
											var nodeG = graph.node(n);
											if(nodeG.label === node.getId())
												{
													x=nodeG.x;
													y=nodeG.y;
												}
											});
                                        node.px = x;
                                        node.py = y;
                                        node.x = x;
                                        node.y = y;
                                        node.setLocked(true);
                                        node.fixed=node.isLocked();

										metExploreD3.GraphNode.fixNode(node);
                                	}
                                //place nodes that were not in the graph
                                	else
                                	{

                                		for(label in  graph._edgeLabels){
                                			//look for the edge where the node is located
                                			var edgeLabel=graph._edgeLabels[label].label;
                                			if(edgeLabel == node.getId()){
                                				node.px = graph._edgeLabels[label].points[1].x;
                                        		node.py = graph._edgeLabels[label].points[1].y;
                                        		node.x = graph._edgeLabels[label].points[1].x;
                                        		node.y = graph._edgeLabels[label].points[1].y;
                                        		node.setLocked(true);
                                        		node.fixed=node.isLocked();

												metExploreD3.GraphNode.fixNode(node);

                                        		if(node.associatedReactions){
                                 					for(associated in node.associatedReactions){
                                 						var associatedNode=node.associatedReactions[associated];
                                 						associatedNode.px=node.px+10*(associated+1);
                                 						associatedNode.py=node.py;
                                 						associatedNode.x=node.x+10*(associated+1);
                                 						associatedNode.y=node.y;
                                 						associatedNode.setLocked(true);
                                 						associatedNode.fixed=associatedNode.isLocked();

														metExploreD3.GraphNode.fixNode(associatedNode);
                                 					}
                                        		}
                                			}
										}
                                	}


                                    });  




        metExploreD3.GraphNetwork.tick("viz");



		// d3.select("#viz").select("#D3viz").select("#graphComponent").selectAll("path.link.reaction")
  //                               .each(function(link){
  //                               	//console.log("---draw edges");
  //                               	var source=link.getSource();
  //                               	console.log(source.getId())
  //                               	var target=link.getTarget();
  //                               	// for all the edges in the Dagre graph
  //                               	//		if it corresponds to a link
  //                               	//			Draw the liknk with the points of the Dagre graph.
  //                               	for(label in  graph._edgeLabels){
  //                               			//look for the edge where the node is located
  //                               			var edgeSource=graph._edgeLabels[label].label.split(" -- ")[0];
  //                               			var edgeTarget=graph._edgeLabels[label].label.split(" -- ")[1];
  //                               			 if(edgeSource==source.getId() && edgeTarget==target.getId()){
  //                               			 	//get coordinates in DAGRE
  //                               			 	//console.log(link);
  //                               			 	console.log(d3.select(this).attr("d"));
  //                               			 	var lineData = [ { "x": 120, "y": 20}, { "x": 120,  "y": 100},
  //                 									{ "x": 40,  "y": 100}, { "x": 40,   "y": 180},
  //                									{ "x": 500,  "y": 180}, { "x": 500,   "y": 100}];
		// 										var lineFunction = d3.svg.line()
		// 										 .x(function(d) { return d.x; })
		// 										 .y(function(d) { return d.y; })
		// 										 .interpolate("linear");
 	// 										d3.select(this).attr("d",lineFunction(lineData));
 	// 										console.log("after",d3.select(this).attr("d"));

  //                               			 	//d3.select(this).attr("d", );
  //                               			 }

  //                               		}
  //                               });
        
		},


	/*****************************************************
	* Update the network
	*/
    refreshCoordinates : function(json, func) {
		var me = this;
		metExploreD3.hideInitialMask();

        var panel = "viz";
        var myMask = metExploreD3.createLoadMask("Move nodes in progress...", panel);
        if(myMask!== undefined){

            metExploreD3.showMask(myMask);

            metExploreD3.deferFunction(function() {

                metExploreD3.displayMessageYesNo("Set nodes coordinates",'Do you want highlight moved nodes.',function(btn){
                    if(btn==="yes")
                    {
                        moveNodes(true);
                    }
                    else
                    {
                        moveNodes(false);
                    }
                });

                function moveNodes(highlight){
                    var session = _metExploreViz.getSessionById("viz");

                    var jsonParsed = metExploreD3.GraphUtils.decodeJSON(json);
                    var nodesToMove = jsonParsed.nodes.filter(function(node){
                        return session.getD3Data().getNodes().find(function(nodeInNetwork){
                            return node.dbIdentifier === nodeInNetwork.getDbIdentifier();
                        });
                    });
                    if(nodesToMove.length>0){
                        if(session!==undefined)
                        {
                            if(highlight)
                                metExploreD3.GraphNode.unselectAll("#viz");

                            metExploreD3.GraphNetwork.animationButtonOff("viz");
                            var force = session.getForce();
                            force.stop();
                            d3.select("#viz").select("#D3viz").select("#graphComponent").selectAll("g.node")
                                .each(function(node){
                                    var nodeToMove = nodesToMove.find(function (aNode) {
                                        return aNode.dbIdentifier === node.getDbIdentifier();
                                    });
                                    if(nodeToMove){
                                        node.px = nodeToMove.px ;
                                        node.py = nodeToMove.py ;
                                        node.x = nodeToMove.x ;
                                        node.y = nodeToMove.y ;
                                        node.setLocked(true);
                                        node.fixed=node.isLocked();

										metExploreD3.GraphNode.fixNode(node);
                                        if(highlight)
                                        	metExploreD3.GraphNode.highlightANode(node.getDbIdentifier());
                                    }
                                });

                            metExploreD3.GraphNetwork.tick("viz");
                            metExploreD3.hideMask(myMask);

                        }

                        if(typeof func==='function') func();
                    }
                    else
                    {
                        //SYNTAX ERROR
                        metExploreD3.displayWarning("None coordinate mapped", 'None nodes mapped by bdIdentifier verify used biosource.');
                        metExploreD3.hideMask(myMask);
                    }
				}

            }, 100);
        }




	},

	/*****************************************************
	* Fill the data models with the store reaction
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
						var mapping = new Mapping(mapping.name, mapping.conditions, mapping.targetLabel);
						_metExploreViz.addMapping(mapping);
					});
				}

				if(jsonParsed.generalStyle)
				{
					console.log(jsonParsed.generalStyle);
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
				var metaboliteStyle
				if(jsonParsed.metaboliteStyle)
				{
					metaboliteStyle = new MetaboliteStyle(jsonParsed.metaboliteStyle.backgroundColor,jsonParsed.metaboliteStyle.height, jsonParsed.metaboliteStyle.width, jsonParsed.metaboliteStyle.rx, jsonParsed.metaboliteStyle.ry, jsonParsed.metaboliteStyle.opacity, jsonParsed.metaboliteStyle.strokeColor, jsonParsed.metaboliteStyle.strokeWidth, jsonParsed.metaboliteStyle.fontColor, jsonParsed.metaboliteStyle.fontSize, jsonParsed.metaboliteStyle.labelOpacity, jsonParsed.metaboliteStyle.label,  jsonParsed.metaboliteStyle.useAlias);
				}

				var reactionStyle;
				if(jsonParsed.reactionStyle)
				{
					var reactionStyle = new ReactionStyle(jsonParsed.reactionStyle.backgroundColor,jsonParsed.reactionStyle.height, jsonParsed.reactionStyle.width, jsonParsed.reactionStyle.rx, jsonParsed.reactionStyle.ry, jsonParsed.reactionStyle.opacity, jsonParsed.reactionStyle.strokeColor, jsonParsed.reactionStyle.strokeWidth, jsonParsed.reactionStyle.fontColor, jsonParsed.reactionStyle.fontSize, jsonParsed.reactionStyle.labelOpacity, jsonParsed.reactionStyle.label,  jsonParsed.reactionStyle.useAlias);
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

					if(sessions[key].selectedNodes)
					{
						sessions[key].selectedNodes.forEach(function(nodeId){
							networkVizSession.addSelectedNode(nodeId);
						});
					}

					if(sessions[key].duplicatedNodes)
					{
						sessions[key].duplicatedNodes.filter(metExploreD3.GraphUtils.onlyUnique).forEach(function(nodeId){
							var nodeSC = sessions[key].getD3Data().getNodeById();
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
			                    });
				                metExploreD3.fireEventArg('buttonRefresh', "reloadMapping", true);
			                }
			                else
			                {
			                	metExploreD3.fireEventArg('buttonMap', "reloadMapping", false);
				                metExploreD3.fireEventArg('buttonRefresh', "reloadMapping", false);
			                	metExploreD3.fireEventArg('selectConditionForm', "closeMapping", _metExploreViz.getActiveMapping);
				                _metExploreViz.resetMappings();
			                	// metExploreD3.fireEventArg('buttonRefresh', "reloadMapping", false);
			                	// metExploreD3.fireEventArg('buttonRefresh', "reloadMapping", false);
			                	// metExploreD3.fireEvent('selectMappingVisu', "resetMapping");
			                	// _metExploreViz.resetMappings();
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
                    var nodesData = networkDataViz.getNodes();
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
			var metaboliteStyle = networkVizSession.getMetaboliteStyle();
			var reactionStyle = networkVizSession.getReactionStyle();
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
					metExploreD3.displayMessageYesNo("Coodinates",'Do you want keep node coordinates.',function(btn){
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
	            _metExploreViz.getMappingsSet().forEach(function(mapping){
	            	metExploreD3.GraphMapping.reloadMapping(mapping);
	            	metExploreD3.fireEventArg('buttonMap', "jsonmapping", mapping);
	            }); 
	            metExploreD3.fireEventArg('buttonRefresh', "reloadMapping", true);
			}
		}
		func();			
	},

	/*****************************************************
	* Initialization of visualization
    * @param {} vizEngine : library used to make the visualization
	*/
	initiateViz : function(vizEngine) {

		d3.select("#viz").selectAll("#presentationViz, #presentationLogoViz").classed("hide", true);
		metExploreD3.fireEvent('viz', 'initiateviz');
		// Previously we used Cytoscape.js. Now we use D3.js,
		// that what is this test for
		_metExploreViz.setLaunched(true);
		if (vizEngine == 'D3') {
			metExploreD3.GraphNetwork.delayedInitialisation('viz');	
		}
	},

	loadData : function(panel){

		var newSession = _metExploreViz.getSessionById(panel);

		// var newDisplayNodeName = oldSession.getDisplayNodeName();
		// var newIsMapped = oldSession.isMapped();

		// var newSession = new NetworkVizSession();
	 //    newSession.setVizEngine("D3");
	 //    newSession.setId('viz');
	 //    newSession.setMapped(newIsMapped);
	 //    newSession.setDisplayNodeName(newDisplayNodeName);

	   
		return newSession;
	}
}
