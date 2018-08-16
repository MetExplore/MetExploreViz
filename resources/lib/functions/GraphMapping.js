/**
 * @author MC
 * (a)description : Fonctions to map data on metabolic networks
 */
metExploreD3.GraphMapping = {

	compareMappingConditionChart : function(){
		var sessions = _metExploreViz.getSessionsSet();
		var arrayNodes = [];
		var mappingName = [];
		var condName = [];
		for (var key in sessions) {
			mappingName.push(sessions[key].getActiveMapping());
			condName.push(sessions[key].isMapped());
			if(key!='viz'){
				arrayNodes = sessions[key].getD3Data().getNodes().concat(arrayNodes);
			}
		}

		var categories = [];
		arrayNodes.forEach(function(node){
			var index = arrayNodes.filter(function(n){ return n.getIdentifier()==node.getIdentifier(); });
			if(index.length>1 && categories.indexOf(node)==-1 && node.getMappingDataByNameAndCond(mappingName[0], condName[0])!=undefined)
			 	categories.push(node);
			
		});

		var categoriesName=categories.map(function(node){return node.getName()});

		var mapping = _metExploreViz.getMappingByName(mappingName);
		var dataCond1 = categories.map(function(node){return -Math.abs(parseInt(node.getMappingDataByNameAndCond(mappingName[0], condName[0]).getMapValue()))});
		var dataCond2 = categories.map(function(node){return Math.abs(parseInt(node.getMappingDataByNameAndCond(mappingName[1], condName[1]).getMapValue()))});

        var conditions2=
        [
            {
                name: condName[0],
                data: dataCond1
            }, {
                name: condName[1],
                data: dataCond2
            }
        ];


        // donnees.forEach(function(aData){
        //     aData.color=scale(aData.z);
        // });

        var dataChart2 = {categories:categoriesName, conditions:conditions2};
        var compareChart = new MetXCompareBar(dataChart2, 1300, categoriesName.length*15, "xaxis", "yaxis", mappingName[0]+" analysis");

		// console.log(d3.select(compareChart));
		// var array = [];
		// d3.select(compareChart).select('svg').selectAll('.highcharts-series').selectAll('rect').each(function(){array.push(this.height.animVal.value)});
		
		// console.log(array);
		// var scale = d3.scale.linear()
		  //           .domain([Math.min.apply(null, array),Math.max.apply(null, array)])
		  //           .range([sessions["viz"].getColorMappingsSet()[1].getValue(),sessions["viz"].getColorMappingsSet()[0].getValue()]);
		
		// d3.select(compareChart).selectAll('svg').selectAll('.highcharts-series').selectAll('rect').attr('fill', function(){return scale(this.height.animVal.value)})
		
		return compareChart;
	},

	/***********************************************
	* Mapping to data from file
	* This function will assignmapping value to each nodes in datas
	*/
	mapNodeDataFile: function(mapping, objects) {
		var session = _metExploreViz.getSessionById('viz');
		var force = session.getForce();
		force.stop(); 
		var myMask = metExploreD3.createLoadMask("Mapping in progress...", 'viz');
		if(myMask!= undefined){
			metExploreD3.showMask(myMask);
	        setTimeout(
			function() {
				var networkData = session.getD3Data();
				var conditions = mapping.getConditions();
				var nodes = d3.select("#viz").select("#D3viz").select("#graphComponent").selectAll("g.node");
				var node = undefined;
				switch (mapping.getTargetLabel()) {
				    case "reactionDBIdentifier":
				        for (var i = conditions.length-1 ; i >= 0; i--) {
				        	objects.forEach(function(obj){
								var map = new MappingData(obj[mapping.getTargetLabel()], mapping.getName(), conditions[i], obj[conditions[i]]);
								mapping.addMap(map);
								node = networkData.getNodeByDbIdentifier(obj[mapping.getTargetLabel()]);
								if(node!=undefined){
									var mapNode = new MappingData(node, mapping.getName(), conditions[i], obj[conditions[i]]);
									node.addMappingData(mapNode);
								}
							});
				        };
				        break;
				    case "reactionId":
				        for (var i = conditions.length-1 ; i >= 0; i--) {
				        	objects.forEach(function(obj){
								var map = new MappingData(obj[mapping.getTargetLabel()], mapping.getName(), conditions[i], obj[conditions[i]]);
								mapping.addMap(map);
								node = networkData.getNodeByDbIdentifier(obj[mapping.getTargetLabel()]);
								if(node!=undefined){
									var mapNode = new MappingData(node, mapping.getName(), conditions[i], obj[conditions[i]]);
									node.addMappingData(mapNode);
								}
							});
				        };
				        break;
				    case "metaboliteId":
				        for (var i = conditions.length-1 ; i >= 0; i--) {
				        	objects.forEach(function(obj){
								var map = new MappingData(obj[mapping.getTargetLabel()], mapping.getName(), conditions[i], obj[conditions[i]]);
								mapping.addMap(map);
								node = networkData.getNodeByDbIdentifier(obj[mapping.getTargetLabel()]);
								if(node!=undefined){
									var mapNode = new MappingData(node, mapping.getName(), conditions[i], obj[conditions[i]]);
									node.addMappingData(mapNode);
								}
							});
				        };
				        break;
				    case "metaboliteDBIdentifier":
				        for (var i = conditions.length-1 ; i >= 0; i--) {
				        	objects.forEach(function(obj){
								var map = new MappingData(obj[mapping.getTargetLabel()], mapping.getName(), conditions[i], obj[conditions[i]]);
								mapping.addMap(map);
								node = networkData.getNodeByDbIdentifier(obj[mapping.getTargetLabel()]);
								if(node!=undefined){
									var mapNode = new MappingData(node, mapping.getName(), conditions[i], obj[conditions[i]]);
									node.addMappingData(mapNode);
								}
							});
				        };
				        break;
				    case "inchi":
				        for (var i = conditions.length-1 ; i >= 0; i--) {
				        	objects.forEach(function(obj){
								var map = new MappingData(obj[mapping.getTargetLabel()], mapping.getName(), conditions[i], obj[conditions[i]]);
								mapping.addMap(map);
								node = networkData.getNodeByMappedInchi(obj[mapping.getTargetLabel()]);
								if(node!=undefined){
									node.forEach(function(n){
										var mapNode = new MappingData(n, mapping.getName(), conditions[i], obj[conditions[i]]);
										n.addMappingData(mapNode);
									});
								}
							});
				        };
				        break;
				    default:
        				metExploreD3.displayMessage("Warning", 'The type of node "' + mapping.getTargetLabel() + '" isn\'t know.')
				}
							
				metExploreD3.hideMask(myMask);

				var anim=metExploreD3.GraphNetwork.isAnimated("viz");
				if (anim=='true') {
					var force = session.getForce();
					
					if ((d3.select("#viz").select("#D3viz").attr("animation") == 'true') || (d3.select("#viz").select("#D3viz") .attr("animation") == null)) {
						force.resume();
					}
				}
	   		}, 1);
		}
	},

	/***********************************************
	* Mapping to data
	* This function will assignmapping value to each nodes in datas
	*/
	mapNodeData: function(mapping, lines) {
		var session = _metExploreViz.getSessionById('viz');
		var force = session.getForce();
		force.stop(); 
		var myMask = metExploreD3.createLoadMask("Mapping in progress...", 'viz');
		if(myMask!= undefined){

			metExploreD3.showMask(myMask);
	        setTimeout(
			function() {
				var networkData = session.getD3Data();
				var conditions = mapping.getConditions();
				var nodes = d3.select("#viz").select("#D3viz").select("#graphComponent").selectAll("g.node");
				var node = undefined;
				switch (mapping.getTargetLabel()) {
				    case "reactionDBIdentifier":
				        for (var i = conditions.length-1 ; i >= 0; i--) {
				        	lines.forEach(function(line){
								var map = new MappingData(line[0], mapping.getName(), conditions[i], line[i+1]);
								mapping.addMap(map);
								node = networkData.getNodeByDbIdentifier(line[0]);
								if(node!=undefined){
									var mapNode = new MappingData(node, mapping.getName(), conditions[i], line[i+1]);
									node.addMappingData(mapNode);
								}
							});
				        };
				        break;
				    case "reactionId":
				        for (var i = conditions.length-1 ; i >= 0; i--) {
				        	lines.forEach(function(line){
								var map = new MappingData(line[0], mapping.getName(), conditions[i], line[i+1]);
								mapping.addMap(map);
								node = networkData.getNodeById(line[0]);
								if(node!=undefined){
									var mapNode = new MappingData(node, mapping.getName(), conditions[i], line[i+1]);
									node.addMappingData(mapNode);
								}
							});
				        };
				        break;
				    case "metaboliteId":
				        for (var i = conditions.length-1 ; i >= 0; i--) {
				        	lines.forEach(function(line){
								var map = new MappingData(line[0], mapping.getName(), conditions[i], line[i+1]);
								mapping.addMap(map);
								node = networkData.getNodeById(line[0]);
								if(node!=undefined){
									var mapNode = new MappingData(node, mapping.getName(), conditions[i], line[i+1]);
									node.addMappingData(mapNode);
								}
							});
				        };
				        break;
				    case "metaboliteDBIdentifier":
				        for (var i = conditions.length-1 ; i >= 0; i--) {
				        	lines.forEach(function(line){
								var map = new MappingData(line[0], mapping.getName(), conditions[i], line[i+1]);
								mapping.addMap(map);
								node = networkData.getNodeByDbIdentifier(line[0]);
								if(node!=undefined){
									var mapNode = new MappingData(node, mapping.getName(), conditions[i], line[i+1]);
									node.addMappingData(mapNode);
								}
							});
				        };
				        break;
				    case "inchi":
				        // Blah
				        break;
				    default:
        				metExploreD3.displayMessage("Warning", 'The type of node "' + mapping.getTargetLabel() + '" isn\'t know.')
				}
							
				metExploreD3.hideMask(myMask);

				var anim=metExploreD3.GraphNetwork.isAnimated("viz");
				if (anim=='true') {
					var force = session.getForce();
					
					if ((d3.select("#viz").select("#D3viz").attr("animation") == 'true') || (d3.select("#viz").select("#D3viz") .attr("animation") == null)) {
						force.resume();
					}
				}
	   		}, 1);
		}
	},

	/***********************************************
	* Mapping to binary data 0 1
	* This function will look at metabolites that have data
	* maped and will color their stroke in red 
	* !!!!! Have to be modified in order to do some batch
	* rendering
	*/
	mapNodes : function(mappingName, func) {
		
		metExploreD3.onloadMapping(mappingName, function(){

			d3.select("#viz").select("#D3viz").select("#graphComponent").selectAll("g.node")
				.filter(function(d){
					if(this.getAttribute("mapped")==undefined || this.getAttribute("mapped")==false || this.getAttribute("mapped")=="false") return false;
					else return true;
				})
				.attr("mapped", "false")
				.selectAll("rect.stroke")
				.remove();		

			var myMask = metExploreD3.createLoadMask("Mapping in progress...", 'viz');
			var mapping = _metExploreViz.getMappingByName(mappingName);
			if(myMask!= undefined){

				metExploreD3.showMask(myMask);
		        setTimeout(
					function() {
						
						var session = _metExploreViz.getSessionById('viz');
						var force = session.getForce();
						force.stop(); 
						var conditions = mapping.getConditions();
						conditions.forEach(
							function(condition)
							{
								d3.select("#viz").select("#D3viz").select("#graphComponent").selectAll("g.node")
									.filter(function(d){
										if(this.getAttribute("mapped")==undefined || this.getAttribute("mapped")==false || this.getAttribute("mapped")=="false") return true;
										else return false;
									})
									.each(
										function(d) {
											
											if(d.getBiologicalType() == 'reaction' )
											{
												if(d.getMappingDataByNameAndCond(mapping.getName(), condition) != null ){
													var reactionStyle = metExploreD3.getReactionStyle();

													_MyThisGraphNode.addText(d, 'viz',reactionStyle);

													d3.select(this)
														.attr("mapped","true")
														.insert("rect", ":first-child")
														.attr("class", "stroke")
														.attr("width", parseInt(d3.select(this).select(".reaction").attr("width"))+10)
														.attr("height", parseInt(d3.select(this).select(".reaction").attr("height"))+10)
														.attr("rx", parseInt(d3.select(this).select(".reaction").attr("rx"))+5)
														.attr("ry",parseInt(d3.select(this).select(".reaction").attr("ry"))+5)
														.attr("transform", "translate(-" + parseInt(parseInt(d3.select(this).select(".reaction").attr("width"))+10) / 2 + ",-"
																				+ parseInt(parseInt(d3.select(this).select(".reaction").attr("height"))+10) / 2
																				+ ")")
														.style("opacity", '0.5')
														.style("fill", 'red');
													session.addMappedNode(d.getId());

												}
											}
											else
											{
												if(d.getBiologicalType() == 'metabolite')
												{
													var id = d3.select(this).select(".metabolite").attr("identifier");
													
													if(d.getMappingDataByNameAndCond(mapping.getName(), condition) != null){
														var metaboliteStyle = metExploreD3.getReactionStyle();
														
														_MyThisGraphNode.addText(d, 'viz', metaboliteStyle);

														d3.select(this)
															.attr("mapped","true")
															.insert("rect", ":first-child")
															.attr("class", "stroke")
															.attr("width", parseInt(d3.select(this).select(".metabolite").attr("width"))+10)
															.attr("height", parseInt(d3.select(this).select(".metabolite").attr("height"))+10)
															.attr("rx", parseInt(d3.select(this).select(".metabolite").attr("rx"))+5)
															.attr("ry",parseInt(d3.select(this).select(".metabolite").attr("ry"))+5)
															.attr("transform", "translate(-" + parseInt(parseInt(d3.select(this).select(".metabolite").attr("width"))+10) / 2 + ",-"
																					+ parseInt(parseInt(d3.select(this).select(".metabolite").attr("height"))+10) / 2
																					+ ")")
															.style("opacity", '0.5')
															.style("fill", 'red');
														session.addMappedNode(d.getId());
													}
												}
											}
										}
									)		

								//d3.select("#viz").select("#D3viz").select("#graphComponent").selectAll("g.node")
									.each(
										function(d) {
											if(d3.select(this).select(".stroke")[0][0]==null)
											{
												if(d.getBiologicalType() == 'reaction' )
												{
													if(d.getMappingDataByNameAndCond(mapping.getName(), condition) != null ){
														var reactionStyle = metExploreD3.getReactionStyle();

														_MyThisGraphNode.addText(d, 'viz',reactionStyle);

														d3.select(this)
															.insert("rect", ":first-child")
															.attr("class", "stroke")
															.attr("width", parseInt(d3.select(this).select(".reaction").attr("width"))+10)
															.attr("height", parseInt(d3.select(this).select(".reaction").attr("height"))+10)
															.attr("rx", parseInt(d3.select(this).select(".reaction").attr("rx"))+5)
															.attr("ry",parseInt(d3.select(this).select(".reaction").attr("ry"))+5)
															.attr("transform", "translate(-" + parseInt(parseInt(d3.select(this).select(".reaction").attr("width"))+10) / 2 + ",-"
																					+ parseInt(parseInt(d3.select(this).select(".reaction").attr("height"))+10) / 2
																					+ ")")
															.style("opacity", '0.5')
															.style("fill", 'red');
														session.addMappedNode(d.getId());

														return true;
													}
													else
													{
														return false;
													}
												}
												else
												{
													if(d.getBiologicalType() == 'metabolite')
													{
														var id = d3.select(this).select(".metabolite").attr("identifier");
														
														if(d.getMappingDataByNameAndCond(mapping.getName(), condition) != null){
															var metaboliteStyle = metExploreD3.getReactionStyle();
															
															_MyThisGraphNode.addText(d, 'viz', metaboliteStyle);

															d3.select(this)
																.insert("rect", ":first-child")
																.attr("class", "stroke")
																.attr("width", parseInt(d3.select(this).select(".metabolite").attr("width"))+10)
																.attr("height", parseInt(d3.select(this).select(".metabolite").attr("height"))+10)
																.attr("rx", parseInt(d3.select(this).select(".metabolite").attr("rx"))+5)
																.attr("ry",parseInt(d3.select(this).select(".metabolite").attr("ry"))+5)
																.attr("transform", "translate(-" + parseInt(parseInt(d3.select(this).select(".metabolite").attr("width"))+10) / 2 + ",-"
																						+ parseInt(parseInt(d3.select(this).select(".metabolite").attr("height"))+10) / 2
																						+ ")")
																.style("opacity", '0.5')
																.style("fill", 'red');
															session.addMappedNode(d.getId());
															return true;
														}
														else
														{
															return false;
														}
													}
												}
											}
										}
									)		
							}
						);

						metExploreD3.hideMask(myMask);

						if (func!=undefined) {func()};

						var anim=metExploreD3.GraphNetwork.isAnimated("viz");
						if (anim=='true') {	
							var session = _metExploreViz.getSessionById('viz');
							var force = session.getForce();
							
							if ((d3.select("#viz").select("#D3viz").attr("animation") == 'true') || (d3.select("#viz").select("#D3viz") .attr("animation") == null)) {
									force.resume();
							}
						}	

			   		}, 1
			   	);
			}

		
		}); 
	},

	/***********************************************
	* Mapping flux data
	* This function will look at link that have data
	* maped and will color them in gradient of bleu to white
	* @param {} mappingName : mappingName choosed by the user
	* @param {} conditionName : Condition choosed by the user
	* @param {} func : callback function
	*/
	mapFluxes : function(mappingName, conditionName, colorMax, colorMin, useOpacity, isBinned, func) {
		var mapping = _metExploreViz.getMappingByName(mappingName);
		var myMask = metExploreD3.createLoadMask("Mapping in progress...", 'viz');
		
								
		if(myMask!= undefined){

			metExploreD3.showMask(myMask);
	        setTimeout(
				function() {

					var generalStyle = _metExploreViz.getGeneralStyle();
				  	var vis = d3.select("#viz").select("#D3viz");
				  	var session = _metExploreViz.getSessionById('viz');
		          	var nodes = _metExploreViz.getSessionById('viz').getD3Data().getNodes(); 
		          	var conditions = metExploreD3.getConditionsMapped();
					var maxValue = undefined;
		          	var minValue = undefined;
		          	var mappingName = mapping.getName();
		          	var linkStyle = metExploreD3.getLinkStyle();  
		          	var force = session.getForce();
					
					force.linkDistance(function(link){
						if(link.getSource().getIsSideCompound() || link.getTarget().getIsSideCompound())
							return linkStyle.getSize();
						else
							return linkStyle.getSize()*2;
					});

					vis.selectAll("g.node")
						.filter(function(d){
							if(this.getAttribute("mapped")==undefined || this.getAttribute("mapped")==false || this.getAttribute("mapped")=="false") return false;
							else return true;
						})
						.selectAll("rect.stroke")
						.remove();

		          	conditions.forEach(
						function(condition)
						{
							nodes.forEach(function(node){
							 	var mapNode = node.getMappingDataByNameAndCond(mappingName, condition);
				             	if(mapNode != null)
					             	var mapVal = Math.abs(mapNode.getMapValue());
					            else
					             	var mapVal = 0;
				             		
									if(!isNaN(mapVal))
					            	{
					             	  	if(maxValue==undefined){
					                    	minValue = parseFloat(mapVal);
					                    	maxValue = parseFloat(mapVal);
					                  	}
					                  	else
					                 	{
					                    	if(minValue > parseFloat(mapVal))
					                      		minValue = parseFloat(mapVal);

					                   	 	if(maxValue < parseFloat(mapVal))
					                     	 	maxValue = parseFloat(mapVal);
					                  	}
					                }
				          	});	
						}
					);	

	          		if(colorMin==undefined){
	          			colorMin = metExploreD3.GraphUtils.colorNameToHex(generalStyle.getColorMinMappingContinuous());						
	          			if(colorMin==false)
		        			colorMin=generalStyle.getColorMinMappingContinuous();
	          		}
	          		else
	          		{
	          			generalStyle.setMinColorMappingContinuous(colorMin);
	          		}

		        	if(colorMax==undefined){
		        		colorMax = metExploreD3.GraphUtils.colorNameToHex(generalStyle.getColorMaxMappingContinuous());
	          			if(colorMax==false)
		        			colorMax=generalStyle.getColorMaxMappingContinuous();
		        	}
	          		else
	          		{
	          			generalStyle.setMaxColorMappingContinuous(colorMax);
	          		}
		          	
		          	var vis = d3.select("#viz").select("#D3viz");
		          	          	
					var colorStore = session.getColorMappingsSet();
			  		session.resetColorMapping();
			      				

			    	var colorNode = colorMax;
			    	if(conditions[1]==conditionName)
			    		colorNode = colorMin;

			    	if(useOpacity)
			    	{
			    		var quart = 0.5;
			    		var midl = 0.2;
			    	}
			    	else
			    	{
			    		var quart = 1;
			    		var midl = 1;
			    	}

			    	var opacity = d3.scale.linear()
						.domain([-4, -1, 0, 1, 4])
			    		.range([1, quart, midl, quart, 1]);

			    	var scaleValue = d3.scale.linear()
						.domain([-maxValue, 0, maxValue])
						.range([-7, 0, 7]);

			    	session.addColorMapping(maxValue, colorMax); 
					session.addColorMapping(-maxValue, colorMin);
					 
			     	vis.selectAll("g.node")
			        	.each(
			          		function(d) {
			          			if (d.getMappingDatasLength()!=0)
								{
									if(d.getBiologicalType() == 'reaction')
			            			{
										var map1 = d.getMappingDataByNameAndCond(mappingName, conditions[0]);
										var map2 = d.getMappingDataByNameAndCond(mappingName, conditions[1]);
										var map = map1;
								    	if(conditions[1]==conditionName)
								    		map = map2;

										if(map==null)
											var mapVal = 0;
										else
										{
											if(isNaN(map.getMapValue()))
												var mapVal = 0;
			            					else
												var mapVal = map.getMapValue();

							            }
				                      	var reactionStyle = metExploreD3.getReactionStyle();
										_MyThisGraphNode.addText(d, 'viz', reactionStyle);
										d3.select(this)
											.transition().duration(2000)
											.style("opacity", opacity(scaleValue(parseFloat(mapVal))));
 
										session.addMappedNode(d.getId());
									}
					            }
					        }); 	

		          	metExploreD3.hideMask(myMask);

		          	d3.select("#viz").select("#D3viz").selectAll("path.link")
						.style("fill", function(link){
							var reaction, metabolite;
							if(link.getSource().getBiologicalType()=='reaction'){
								reaction = link.getSource();
								metabolite = link.getTarget();
							}
							else
							{
								metabolite = link.getSource();
								reaction = link.getTarget();
							}

							var map1 = reaction.getMappingDataByNameAndCond(mappingName, conditions[0]);
							var map2 = reaction.getMappingDataByNameAndCond(mappingName, conditions[1]);
							
							vis.selectAll('g#node'+metabolite.getId()+'.node')
								.each(function(node){
									
									var map = map1;
							    	if(conditions[1]==conditionName)
							    		map = map2;

							    	if(map==null)
											var mapVal = 0;
									else
									{
										if(isNaN(map.getMapValue()))
											var mapVal = 0;
		            					else
											var mapVal = map.getMapValue();
		            						
						            }

							    	if(node.flux==undefined)
							    		node.flux = scaleValue(mapVal);
							    	else
							    	{
							    		if(Math.abs(node.flux)<Math.abs(scaleValue(mapVal)))
							    			node.flux = scaleValue(mapVal);
							    	}

								});

							vis.selectAll('g#node'+metabolite.getId()+'.node')
								.style("opacity", function(node){
									if(node.getIsSideCompound())
										return 0.2;
									return opacity(node.flux);
								});	

							if(this.id != "linkRev"){
								
								if(map1==null)
										var mapVal = 0;
								else
								{
									if(isNaN(map1.getMapValue()))
										var mapVal = 0;
	            					else
										var mapVal = map1.getMapValue();
	            						
					            }

		                    	if(scaleValue(mapVal) == 0)
		                    	{
		                    		var links = d3.select("#viz").select("#D3viz").select("#graphComponent").selectAll("path:link");

									d3.select(this)
										.style("opacity", 0.5)
										.style("stroke", "black")
										.style("stroke-width", 0.5)
										.style("stroke-dasharray", "2,3")
										.each(function(link){
											var first = links[0][0];
											this.parentNode.insertBefore(this, first);
										});
		                    	}
								else
								{
									d3.select(this).style("opacity", opacity(scaleValue(parseFloat(mapVal))));
								}
								if(metabolite.getIsSideCompound())
										d3.select(this).style("opacity", 0.1);

								return colorMax;
							}
							else
							{
								if(map2==null)
										var mapVal = 0;
								else
								{
									if(isNaN(map2.getMapValue()))
										var mapVal = 0;
	            					else
										var mapVal = map2.getMapValue();
	            						
					            }

		                    	if(scaleValue(mapVal) == 0)
		                    	{
									var links = d3.select("#viz").select("#D3viz").select("#graphComponent").selectAll("path:link");

									d3.select(this)
										.style("opacity", 0.5)
										.style("stroke", "black")
										.style("stroke-width", 0.5)
										.style("stroke-dasharray", "2,3") 
										.each(function(link){
											var first = links[0][0];
											this.parentNode.insertBefore(this, first);
										});
								}
								else
								{
									d3.select(this).style("opacity", opacity(scaleValue(parseFloat(mapVal))));
								}
								if(metabolite.getIsSideCompound())
										d3.select(this) .style("opacity", 0.1);

								return colorMin;
							} 
						});

					metExploreD3.fireEventArg('selectCondition', 'setConditionProgramaticaly', conditionName);
		          	if(minValue!=undefined)
		          		metExploreD3.fireEventArg('selectConditionForm', 'afterContinuousMapping', 'flux');
		          	else
		          		metExploreD3.displayMessage("Warning", 'No mapped node on network.');

		          	if (func!=undefined) {func()};
		        
					var anim=metExploreD3.GraphNetwork.isAnimated("viz");
					if (anim=='true') {	
						var session = _metExploreViz.getSessionById('viz');
						
						if ((d3.select("#viz").select("#D3viz").attr("animation") == 'true') || (d3.select("#viz").select("#D3viz") .attr("animation") == null)) {
								force.start();
						}
					}
					if (isBinned){
                        for (var i=0; i<conditionName.length; i++) {
                            metExploreD3.GraphMapping.discretizeFluxRange(conditionName[i]);
                        }
					}
					else {
                        for (var i=0; i<conditionName.length; i++) {
                            metExploreD3.GraphMapping.removeBinnedMapping(conditionName[i]);
                        }
					}
					metExploreD3.GraphNetwork.tick('viz');
		   		}, 1
		   	);
		}
	},


	/***********************************************
	* Mapping only one flux data
	* This function will look at link that have data
	* maped and will color them in gradient of bleu to white
	* @param {} mappingName : mappingName choosed by the user
	* @param {} conditionName : Condition choosed by the user
	* @param {} func : callback function
	*/
	mapUniqueFlux : function(mappingName, conditionName, colorMax, useOpacity, isBinned, func) {
		var mapping = _metExploreViz.getMappingByName(mappingName);
		var myMask = metExploreD3.createLoadMask("Mapping in progress...", 'viz');
		
		if(myMask!= undefined){

			metExploreD3.showMask(myMask);
	        setTimeout(
				function() {

					var generalStyle = _metExploreViz.getGeneralStyle();
				  	var vis = d3.select("#viz").select("#D3viz");
				  	var session = _metExploreViz.getSessionById('viz');
		          	var nodes = _metExploreViz.getSessionById('viz').getD3Data().getNodes(); 
		          	var conditions = mapping.getConditions();	
					var maxValue = undefined;
		          	var minValue = undefined;
		          	var mappingName = mapping.getName();
		          	var linkStyle = metExploreD3.getLinkStyle();  
		          	var force = session.getForce();
					
					force.linkDistance(function(link){
						if(link.getSource().getIsSideCompound() || link.getTarget().getIsSideCompound())
							return linkStyle.getSize();
						else
							return linkStyle.getSize()*2;
					});

					vis.selectAll("g.node")
						.filter(function(d){
							if(this.getAttribute("mapped")==undefined || this.getAttribute("mapped")==false || this.getAttribute("mapped")=="false") return false;
							else return true;
						})
						.selectAll("rect.stroke")
						.remove();

		          	conditions.forEach(
						function(condition)
						{
							nodes.forEach(function(node){
							 	var mapNode = node.getMappingDataByNameAndCond(mappingName, condition);
				             	if(mapNode != null){

					             	var mapVal = mapNode.getMapValue();
									if(!isNaN(mapVal))
					            	{
					             	  	if(maxValue==undefined){
					                    	minValue = parseFloat(mapVal);
					                    	maxValue = parseFloat(mapVal);
					                  	}
					                  	else
					                 	{
					                    	if(minValue > parseFloat(mapVal))
					                      		minValue = parseFloat(mapVal);

					                   	 	if(maxValue < parseFloat(mapVal))
					                     	 	maxValue = parseFloat(mapVal);
					                  	}
					                }
					            }
				          	});	
						}
					);	
		          	
		          	if(colorMax==undefined)
		        		colorMax=generalStyle.getColorMaxMappingContinuous();
		        	else
		          		generalStyle.setMaxColorMappingContinuous(colorMax);
	          		
		          	var vis = d3.select("#viz").select("#D3viz");
		          	          	
					var colorStore = session.getColorMappingsSet();
			  		session.resetColorMapping();
			      			    	
			    	var colorNode = d3.scale.linear()
						.domain([-4, -1, 1, 4])
			    		.range([colorMax, colorMax, colorMax, colorMax]);


			    	if(useOpacity)
			    	{
			    		var quart = 0.5;
			    		var midl = 0.2;
			    	}
			    	else
			    	{
			    		var quart = 1;
			    		var midl = 1;
			    	}

			    	var opacity = d3.scale.linear()
						.domain([-4, -1, 0, 1, 4])
			    		.range([1, quart, midl, quart, 1]);

			    	var colorMin = d3.scale.linear()
						.domain([-4, -1, 1, 4])
			    		.range([colorMax, colorMax, colorMax, colorMax]);

			    	var scaleValue = d3.scale.linear()
						.domain([minValue, 0, maxValue])
						.range([-7, 0, 7]);

			    	session.addColorMapping(maxValue, colorNode(parseFloat(maxValue)));
					 
			    	vis.selectAll("g.node")
			        	.each(
			          		function(d) {
			          			if (d.getMappingDatasLength()!=0)
								{
									if(d.getBiologicalType() == 'reaction')
			            			{
			            				var condition = metExploreD3.getConditionsMapped()[0];
										var map = d.getMappingDataByNameAndCond(mappingName, condition);

										if(map!=null){
											if(!isNaN(map.getMapValue()))
			            					{
						                      	var reactionStyle = metExploreD3.getReactionStyle();
												_MyThisGraphNode.addText(d, 'viz', reactionStyle);
												d3.select(this)
													.transition().duration(2000)
													.style("opacity", opacity(scaleValue(parseFloat(map.getMapValue()))));

												session.addMappedNode(d.getId());
							                }
										}
									}
					            }
					        }); 	

		          	metExploreD3.hideMask(myMask);

		          	d3.select("#viz").select("#D3viz").selectAll("path.link")
						.style("fill", function(link){
							var reaction, metabolite;
							if(link.getSource().getBiologicalType()=='reaction'){
								reaction = link.getSource();
								metabolite = link.getTarget();
							}
							else
							{
								metabolite = link.getSource();
								reaction = link.getTarget();
							}

			            	var condition = metExploreD3.getConditionsMapped()[0];
							var map = reaction.getMappingDataByNameAndCond(mappingName, condition);

							vis.selectAll('g#node'+metabolite.getId()+'.node')
								.each(function(node){
									
							    	if(map==null)
										var mapVal = 0;

							    	if(node.flux==undefined)
							    		node.flux = scaleValue(mapVal);
							    	else
							    	{
							    		if(Math.abs(node.flux)<Math.abs(scaleValue(mapVal)))
							    			node.flux = scaleValue(mapVal);
							    	}

								});

							vis.selectAll('g#node'+metabolite.getId()+'.node')
								.style("opacity", function(node){
									if(node.getIsSideCompound())
										return 0.2;
									return opacity(node.flux);
								});	

							if(map==null)
								var mapVal = 0;
							else
							{
								if (isNaN(map.getMapValue()))
									var mapVal = 0;
								else
									var mapVal = map.getMapValue();
							}

	                    	if(scaleValue(mapVal) == 0)
	                    	{
	                    		var links = d3.select("#viz").select("#D3viz").select("#graphComponent").selectAll("path:link");

								d3.select(this)
									.style("opacity", 0.5)
									.style("stroke", "black")
									.style("stroke-width", 0.5)
									.style("stroke-dasharray", "2,3")
									.each(function(link){
										var first = links[0][0];
										this.parentNode.insertBefore(this, first);
									});
	                    	}
							else
							{
								d3.select(this).style("opacity", opacity(scaleValue(parseFloat(mapVal))));
							}
							if(metabolite.getIsSideCompound())
								d3.select(this).style("opacity", 0.1);

							return colorNode(scaleValue(mapVal));
					
						})
						.filter(function(link){
							return this.id == "linkRev";
						})
						.remove();


		          	d3.select("#viz").select("#D3viz").selectAll(".linklabel")
		          		.filter(function(link){
							return this.id == "linkRev";
						})
						.remove();

					metExploreD3.fireEventArg('selectCondition', 'setConditionProgramaticaly', conditionName);
		          	if(minValue!=undefined)
		          		metExploreD3.fireEventArg('selectConditionForm', 'afterContinuousMapping', 'flux');
		          	else
		          		metExploreD3.displayMessage("Warning", 'No mapped node on network.');

		          	if (func!=undefined) {func()};
		        
					var anim=metExploreD3.GraphNetwork.isAnimated("viz");
					if (anim=='true') {	
						var session = _metExploreViz.getSessionById('viz');
						
						if ((d3.select("#viz").select("#D3viz").attr("animation") == 'true') || (d3.select("#viz").select("#D3viz") .attr("animation") == null)) {
								force.start();
						}
					}
                    if (isBinned){
                        for (var i=0; i<conditionName.length; i++) {
                            metExploreD3.GraphMapping.discretizeFluxRange(conditionName[i]);
                        }
                    }
                    else {
                        for (var i=0; i<conditionName.length; i++) {
                            metExploreD3.GraphMapping.removeBinnedMapping(conditionName[i]);
                        }
                    }
					metExploreD3.GraphNetwork.tick('viz');
		   		}, 1
		   	);
		}
	},


	/***********************************************
	* Parse flux values to discriminate max and min infinity values 
	* @param {} conditionName : mappingName choosed by the user
	*/
	parseFluxValues : function(mappingName) {
		var mapping = _metExploreViz.getMappingByName(mappingName);
		var myMask = metExploreD3.createLoadMask("Mapping in progress...", 'viz');
		
		if(myMask!= undefined){

			metExploreD3.showMask(myMask);
	        setTimeout(
				function() {

				  	var session = _metExploreViz.getSessionById('viz');
		          	var nodes = _metExploreViz.getSessionById('viz').getD3Data().getNodes(); 
		          	var conditions = mapping.getConditions();	
					var maxValue = undefined;
		          	var minValue = undefined;
		          	var mappingName = mapping.getName();
		          	var arrayInfinity = [];

			      	conditions.forEach(
						function(condition)
						{
							nodes.forEach(function(node){
							 	var mapNode = node.getMappingDataByNameAndCond(mappingName, condition);
				             	if(mapNode != null)
				             		var mapVal = mapNode.getMapValue();
								else
									var mapVal = 0;
									
								if(!isNaN(mapVal))
				            	{
				            		if(parseFloat(mapVal)!=0 & (999999 - Math.abs(parseFloat(mapVal)))*100/999999<0.001){
				            			arrayInfinity.push(node);
				            		}
				            		else
				            		{	
					             	  	if(maxValue==undefined){
					                    	minValue = parseFloat(mapVal);
					                    	maxValue = parseFloat(mapVal);
					                  	}
					                  	else
					                 	{
					                    	if(minValue > parseFloat(mapVal))
					                      		minValue = parseFloat(mapVal);

					                   	 	if(maxValue < parseFloat(mapVal))
					                     	 	maxValue = parseFloat(mapVal);
					                  	}
				            		}
				                }
				            
				          	});	
						}
					);

					if(arrayInfinity.length>0){
						maxValue = maxValue+maxValue/2;
				        var colors = _metExploreViz.getSessionById('viz').getColorMappingsSet();
						arrayInfinity.forEach(function(node){
							conditions.forEach(
								function(condition)
								{
				            		if((999999 - Math.abs(parseFloat(node.getMappingDataByNameAndCond(mappingName, condition).getMapValue())))*100/999999<0.001){
										colors.forEach(function(color){
											if(color.getName() == parseFloat(node.getMappingDataByNameAndCond(mappingName, condition).getMapValue())) color.setName(minValue);
											if(color.getName() == parseFloat(node.getMappingDataByNameAndCond(mappingName, condition).getMapValue())) color.setName(maxValue);
										});
										node.setMappingDataByNameAndCond(mappingName, condition, maxValue);
				            		}
								}
							);
						});
					}	
					metExploreD3.hideMask(myMask);	
		   		}, 1
		   	);
		}
	},


 	graphMappingFlux : function(mappingName, conditionName, fluxType, colorMax, colorMin, isOpac, showValues, isBinned){
		metExploreD3.onloadMapping(mappingName, function(){
			var session = _metExploreViz.getSessionById('viz');
			metExploreD3.GraphMapping.parseFluxValues(mappingName);
			metExploreD3.GraphLink.loadLinksForFlux("viz", session.getD3Data(), metExploreD3.getLinkStyle(), metExploreD3.getMetaboliteStyle(), showValues, conditionName);

			if(fluxType=='Compare') {
                metExploreD3.GraphMapping.mapFluxes(mappingName, conditionName, colorMax, colorMin, isOpac, isBinned, function() {
                    metExploreD3.GraphLink.showValue("viz", conditionName, fluxType);
                });
            }
			else {
                metExploreD3.GraphMapping.mapUniqueFlux(mappingName, conditionName, colorMax, isOpac, isBinned, function(){
                    metExploreD3.GraphLink.showValue("viz", conditionName, fluxType);
                });
            }

		});
 	},

	
	/*****************************************************
	* Reload Mapping
	*/
	reloadMapping : function(mapping) {
		
		var session = _metExploreViz.getSessionById('viz');
		var force = session.getForce();
		force.stop(); 
		var myMask = metExploreD3.createLoadMask("Mapping in progress...", 'viz');
		if(myMask!= undefined){

			metExploreD3.showMask(myMask);
	        setTimeout(
			function() {
				var networkData = session.getD3Data();
				var conditions = mapping.getConditions();
				var node = undefined;
				switch (mapping.getTargetLabel()) {
				    case "reactionDBIdentifier":
				        mapping.getData().forEach(function(map){
				        	if(typeof map.getNode()=="object")
								var node = networkData.getNodeByDbIdentifier(map.getNode().getDbIdentifier());
							else
								var node = networkData.getNodeByDbIdentifier(map.getNode());

							if(node!=undefined){
								var mapNode = new MappingData(node, mapping.getName(), map.getConditionName(), map.getMapValue());
								node.addMappingData(mapNode);
							}
						});
				        break;

					case "reactionId":
				        mapping.getData().forEach(function(map){
				        	if(typeof map.getNode()=="object")
								var node = networkData.getNodeById(map.getNode().getId());
							else
								var node = networkData.getNodeById(map.getNode());

							if(node!=undefined){
								var mapNode = new MappingData(node, mapping.getName(), map.getConditionName(), map.getMapValue());
								node.addMappingData(mapNode);
							}
						});
				        break;

					case "metaboliteId":
				        mapping.getData().forEach(function(map){
				        	if(typeof map.getNode()=="object")
								var node = networkData.getNodeById(map.getNode().getId());
							else
								var node = networkData.getNodeById(map.getNode());

							if(node!=undefined){
								var mapNode = new MappingData(node, mapping.getName(), map.getConditionName(), map.getMapValue());
								node.addMappingData(mapNode);
							}
						});
				        break;

				    case "metaboliteDBIdentifier":
				       	mapping.getData().forEach(function(map){
							if(typeof map.getNode()=="object")
								var node = networkData.getNodeByDbIdentifier(map.getNode().getDbIdentifier());
							else
								var node = networkData.getNodeByDbIdentifier(map.getNode());
							
							if(node!=undefined){
								var mapNode = new MappingData(node, mapping.getName(), map.getConditionName(), map.getMapValue());
								node.addMappingData(mapNode);
							}
						});
				        break;
				    case "inchi":
				        // Blah
				        break;
				    default:
        				metExploreD3.displayMessage("Warning", 'The type of node "' + mapping.getTargetLabel() + '" isn\'t know.')	
        		}
				
				metExploreD3.hideMask(myMask);

				var anim=metExploreD3.GraphNetwork.isAnimated("viz");
				if (anim=='true') {
					var force = session.getForce();
					
					if ((d3.select("#viz").select("#D3viz").attr("animation") == 'true') || (d3.select("#viz").select("#D3viz") .attr("animation") == null)) {
						force.resume();
					}
				}
			}, 1);
		}
	},
	/***********************************************
	* Mapping to discrete data
	* This function will look at metabolites that have data
	* maped and will color them in a calculated color
	* @param {} conditionName : Condition choosed by the user
	*/
	graphMappingDiscreteData : function(mappingName, conditionName, func) {
		
		metExploreD3.onloadMapping(mappingName, function(){

			var mapping = _metExploreViz.getMappingByName(mappingName);
			var myMask = metExploreD3.createLoadMask("Mapping in progress...", 'viz');
			if(myMask!= undefined){

				metExploreD3.showMask(myMask);
		        setTimeout(
					function() {
						
						var session = _metExploreViz.getSessionById('viz');
						var force = session.getForce();
						force.stop(); 
						var conditions = mapping.getConditions();	
						var nodes = session.getD3Data().getNodes(); 
					  	
						var values = [];
						
						var vis = d3.select("#viz").select("#D3viz");
						vis.selectAll("g.node")
							.filter(function(d){
								if(this.getAttribute("mapped")==undefined || this.getAttribute("mapped")==false || this.getAttribute("mapped")=="false") return false;
								else return true;
							})
							.selectAll("rect.stroke")
							.remove();	

						// var idMapping = metExploreD3.getMappingSelection();
						// var mappingInfoStore = metExploreD3.getMappingInfosSet();

						// var theMapping = metExploreD3.findMappingInfo(mappingInfoStore, 'id', idMapping);
					
						// var ids = theMapping.get('idMapped');
						// var idsTab = ids.split(",");
						// var i;

						conditions.forEach(
							function(condition)
							{
								nodes.forEach(function(node){
									var mapNode = node.getMappingDataByNameAndCond(mapping.getName(), condition);
									if(mapNode != null){
										var exist = false;
										var mapVal = mapNode.getMapValue().valueOf();
										
										values.forEach(function(val){
											if(val.valueOf()==mapVal.valueOf())
												exist = true;
										})
										if(!exist)
											values.push(mapVal);
									}

								});
								// 	var metabolite = metExploreD3.getMetaboliteById(metabolite_Store, idsTab[i]);
								// 	if(metabolite!=undefined)
								// 		if (metabolite.get('mapped') != undefined)
								// 			if (metabolite.get('mapped') != 0)
								// 				if(metabolite.get(condition.getCondInMetabolite())!=undefined){
													
								// 				}
								// }		
							}
						);	

						function compareInteger(a,b) {
							if (parseFloat(a) < parseFloat(b))
								return -1;
							if (parseFloat(a) > parseFloat(b))
								return 1;
							return 0;
						}

						function compareString(a,b) {
							if (a < b)
								return -1;
							if (a > b)
								return 1;
							return 0;
						}

						var floats = [];
						var strings = [];
						
						values.forEach(function(value){
							if(isNaN(value))
								strings.push(value);
							else
								floats.push(value);
						});

						floats.sort(compareInteger);
						strings.sort(compareString);

						values = floats.concat(strings);
				        
				        if (values.length == undefined) values.length = 0;
				        center = 128;
				        width = 127;
				        frequency = Math.PI*2*0.95/values.length;
				        var position = top;
						var colorStore = session.getColorMappingsSet();
				        
				        session.resetColorMapping();
						for (var i = 0; i < values.length; i++)
				        {
				        	var red   = Math.sin(frequency*i+2+values.length) * width + center;
							var green = Math.sin(frequency*i+0+values.length) * width + center;
							var blue  = Math.sin(frequency*i+4+values.length) * width + center;

							color = metExploreD3.GraphUtils.RGB2Color(red,green,blue);

							session.addColorMapping(values[i], color);
			        		metExploreD3.GraphMapping.fixMappingColorOnNodeData(color, values[i], conditionName, mapping.getName());
						}

						metExploreD3.hideMask(myMask);

						if (func!=undefined) {func()};

						metExploreD3.fireEventArg('selectCondition', 'setConditionProgramaticaly', conditionName);
						if(values.length!=0)
							metExploreD3.fireEventArg('selectConditionForm', 'afterDiscreteMapping', 'discrete');
			          	else
			          		metExploreD3.displayMessage("Warning", 'No mapped node on network.');

						var anim=metExploreD3.GraphNetwork.isAnimated("viz");
						if (anim=='true') {	
							var session = _metExploreViz.getSessionById('viz');
							var force = session.getForce();
							
							if ((d3.select("#viz").select("#D3viz").attr("animation") == 'true') || (d3.select("#viz").select("#D3viz") .attr("animation") == null)) {
									force.resume();
							}
						}
			   		}, 1
			   	);
			}
		});
	},

	/***********************************************
	* Fill node with corresponding color
	* @param {} color : Color to fill the node
	* @param {} value : Value corresponding to the color
	* @param {} conditionName : Condition choosed by the user
	*/
	fixMappingColorOnNodeData : function(color, value, conditionName, mappingName){
		var vis = d3.select("#viz").select("#D3viz");
		var session = _metExploreViz.getSessionById('viz');
		var contextColor = color;
		
		vis.selectAll("g.node")
			.filter(
				function(d) {
					if(d.getBiologicalType() == 'reaction')
					{
						if (d.getMappingDatasLength()==0)
							return false;
						else
						{
							var map = d.getMappingDataByNameAndCond(mappingName, conditionName);
							if(map!=null){
								
								if(map.getMapValue()==value){
									
									var reactionStyle = metExploreD3.getReactionStyle();
									_MyThisGraphNode.addText(d, 'viz', reactionStyle);
									session.addMappedNode(d.getId());
									return true;
								}
								else
								{
									return false;
								}
							}
							else
							{
								return false;
							}
						}	
					}
					else
					{
						if(d.getBiologicalType() == 'metabolite')
						{
							if (d.getMappingDatasLength()==0)
								return false;
							else
							{
								var map = d.getMappingDataByNameAndCond(mappingName, conditionName);
								if(map!=null){
									if(map.getMapValue()==value){
									
										var metaboliteStyle = metExploreD3.getMetaboliteStyle();
										_MyThisGraphNode.addText(d, 'viz', metaboliteStyle);
										session.addMappedNode(d.getId());
										return true;
									}
									else
									{
										return false;
									}
								}
								else
								{
									return false;
								}
								
							}	
						}
					}

				}
			)
			.transition().duration(3000)
			.attr("mapped", color)
			.style("fill", color)
	},

	/***********************************************
	* Mapping to continuous data
	* This function will look at metabolites that have data
	* maped and will color them in gradient of bleu to yellow
	* @param {} conditionName : Condition choosed by the user
	*/
	graphMappingContinuousData : function(mappingName, conditionName, colorMin, colorMax, func) {
		
		metExploreD3.onloadMapping(mappingName, function(){
			var mapping = _metExploreViz.getMappingByName(mappingName);
			var myMask = metExploreD3.createLoadMask("Mapping in progress...", 'viz');
			if(myMask!= undefined){

				metExploreD3.showMask(myMask);
		        setTimeout(
					function() {

						var generalStyle = _metExploreViz.getGeneralStyle();
					  	var vis = d3.select("#viz").select("#D3viz");
					  	var session = _metExploreViz.getSessionById('viz');
			          	var nodes = _metExploreViz.getSessionById('viz').getD3Data().getNodes(); 
			          	var conditions = mapping.getConditions();	
						var maxValue = undefined;
			          	var minValue = undefined;
			          	var mappingName = mapping.getName();
			          	var stringJSON="{\"mapping\":[";	
						var metaboliteStyle = metExploreD3.getMetaboliteStyle();
						var reactionStyle = metExploreD3.getReactionStyle();
																				
						vis.selectAll("g.node")
							.filter(function(d){
								if(this.getAttribute("mapped")==undefined || this.getAttribute("mapped")==false || this.getAttribute("mapped")=="false") return false;
								else return true;
							})
							.selectAll("rect.stroke")
							.remove();

			          	conditions.forEach(
							function(condition)
							{
								stringJSON+="\n{\""+condition+"\":[";
								nodes.forEach(function(node){
								 	var mapNode = node.getMappingDataByNameAndCond(mappingName, condition);
					             	if(mapNode != null){
										stringJSON+="\n{";

						             	var mapVal = mapNode.getMapValue();
						             	stringJSON+="\"node\" : \"" +node.getName();
						             	stringJSON+="\", \"value\" : \""+mapVal;
										if(!isNaN(mapVal))
						            	{
						             	  	if(maxValue==undefined){
						                    	minValue = parseFloat(mapVal);
						                    	maxValue = parseFloat(mapVal);
						                  	}
						                  	else
						                 	{
						                    	if(minValue > parseFloat(mapVal))
						                      		minValue = parseFloat(mapVal);

						                   	 	if(maxValue < parseFloat(mapVal))
						                     	 	maxValue = parseFloat(mapVal);
						                  	}
						                }
						            	stringJSON+='\"},\n';  
						            }
					          	});	
								stringJSON+=']}\n';	
							}
						);	
						stringJSON+=']}\n';	
			          		
			        	if(colorMin==undefined)
			        		colorMin=generalStyle.getColorMinMappingContinuous();
			        	else
		          			generalStyle.setMinColorMappingContinuous(colorMin);
	          		
			        	if(colorMax==undefined)
			        		colorMax=generalStyle.getColorMaxMappingContinuous();
		          		else
		          			generalStyle.setMaxColorMappingContinuous(colorMax);
	          		
			          	var vis = d3.select("#viz").select("#D3viz");

						var colorStore = session.getColorMappingsSet();
				      	session.resetColorMapping();
				      	var colorScale = d3.scale.linear()
						    .domain([parseFloat(minValue), parseFloat(maxValue)])
						    .range([colorMin, colorMax]);

				     	// var color = metExploreD3.GraphUtils.RGB2Color(0,0,255);
				      
				      	// session.addColorMapping("max", color); 

				      	// color = metExploreD3.GraphUtils.RGB2Color(255,255,0);

				      	// session.addColorMapping("min", color); 
				    	
				    	if(minValue==maxValue){
				    		session.addColorMapping(maxValue, colorScale(parseFloat(maxValue))); 
						}
				    	else
				    	{
				    		session.addColorMapping(maxValue, colorScale(parseFloat(maxValue))); 
							session.addColorMapping(minValue, colorScale(parseFloat(minValue))); 
				    	}
				    
				     	vis.selectAll("g.node")
				        	.each(
				          		function(d) {
				          			if (d.getMappingDatasLength()!=0)
									{
										if(d.getBiologicalType() == 'reaction')
				            			{
											var map = d.getMappingDataByNameAndCond(mappingName, conditionName);
											if(map!=null){
												if(!isNaN(map.getMapValue()))
				            					{
							                     	_MyThisGraphNode.addText(d, 'viz', reactionStyle);
													
													d3.select(this)
														.transition().duration(2000)
														.attr("mapped", colorScale(parseFloat(parseFloat(map.getMapValue()))))
														.style("fill", colorScale(parseFloat(map.getMapValue())));


													// var colorNorm = (parseFloat(map.getMapValue()-minValue)*255.0)/(maxValue-minValue);

							      //                   d3.select(this)
							      //                     .transition().duration(2000)
							      //                     .attr("mapped", "rgb("+ parseFloat(255.0-colorNorm) +","+ parseFloat(255.0-colorNorm) +","+colorNorm+")")
							      //                     .style("fill", "rgb("+ parseFloat(255.0-colorNorm) +","+ parseFloat(255.0-colorNorm) +","+colorNorm+")");
 
													session.addMappedNode(d.getId());
								                }
											}
										}
						                else
						                {
						                  	var map = d.getMappingDataByNameAndCond(mappingName, conditionName);
											if(map!=null){
												if(!isNaN(map.getMapValue()))
				            					{
								                      	var metaboliteStyle = metExploreD3.getMetaboliteStyle();
														_MyThisGraphNode.addText(d, 'viz', metaboliteStyle);

														d3.select(this)
															.transition().duration(2000)
															.attr("mapped", colorScale(parseFloat(parseFloat(map.getMapValue()))))
															.style("fill", colorScale(parseFloat(map.getMapValue())));
														session.addMappedNode(d.getId());
								        //                 var colorNorm = (parseFloat(map.getMapValue()-minValue)*255.0)/(maxValue-minValue);

								        //                 d3.select(this)
								        //                   .transition().duration(2000)
														  // .attr("mapped","rgb("+ parseFloat(255.0-colorNorm) +","+ parseFloat(255.0-colorNorm) +","+colorNorm+")")
								        //                   .style("fill", "rgb("+ parseFloat(255.0-colorNorm) +","+ parseFloat(255.0-colorNorm) +","+colorNorm+")");
								                    
								                }
											}
						                }
						            }
						        }); 	

			          	metExploreD3.hideMask(myMask);

			          	metExploreD3.fireEventArg('selectCondition', 'setConditionProgramaticaly', conditionName);
			          	if(minValue!=undefined)
			          		metExploreD3.fireEventArg('selectConditionForm', 'afterContinuousMapping', 'continuous');
			          	else
			          		metExploreD3.displayMessage("Warning", 'No mapped node on network.');

			          	if (func!=undefined) {func()};
			        
						var anim=metExploreD3.GraphNetwork.isAnimated("viz");
						if (anim=='true') {	
							var session = _metExploreViz.getSessionById('viz');
							var force = session.getForce();
							
							if ((d3.select("#viz").select("#D3viz").attr("animation") == 'true') || (d3.select("#viz").select("#D3viz") .attr("animation") == null)) {
									force.resume();
							}
						}



						


				        // donnees.forEach(function(aData){
				        //     aData.color=scale(aData.z);
				        // });

						// 				        d3.select("#viz").select("#D3viz").select("#graphComponent").selectAll("g.node")
						// 							.each(function(node){
						// 								if (node.getMappingDatasLength()!=0)
						// 								{
						// 									var maps = node.getMappingDatas();
						// 									var dataCond1 = -Math.abs(parseInt(maps[0].getMapValue()));
						// 									var dataCond2 = Math.abs(parseInt(maps[1].getMapValue()));

						// 							        var conditions2=
						// 							        [
						// 							            {
						// 							                name: maps[0].getConditionName(),
						// 							                data: 500
						// 							            }, {
						// 							                name: maps[1].getConditionName(),
						// 							                data: 500
						// 							            }
						// 							        ];
						// var categories2 = [
						//             'Alanine and aspartate metabolism',
						//             'Alkaloid synthesis'
						// ];
						//         var conditions2=
						//         [
						//             {
						//                 name: '3j',
						//                 data: [-5, -54]
						//             }, {
						//                 name: '30j',
						//                 data: [75, 20]
						//             }
						//         ];
						//         var dataChart2 = {categories:categories2, conditions:conditions2};
						//          // var element3 = new MetXCompareBar(dataChart2, 1300, 1000, "xaxis", "yaxis", "title");
						// 					        		var minDim=1000;
						// 	        						// var dataChart2 = {categories:[node.getName()], conditions:conditions2};
						// 	        						var chartSvg = d3.select(this).append("svg")
						// 										.attr("viewBox",function(d) {return "0 0 "+minDim+" "+minDim;})
						// 										.attr("width", minDim *8/10 + "px")
						// 										.attr("height", minDim *8/10+ "px")
						// 										// .attr("x", (-minDim/2)+(minDim*1/10))
						// 										// .attr("y", (-minDim/2)+(minDim*1/10))
						// 					        		var compareChart = new MetXCompareBar(dataChart2, 1000, 200, "xaxis", "yaxis", maps[0].getMappingName() +" analysis");
									        		
						// 										chartSvg.html(d3.select(compareChart).select('svg').node().outerHTML)
														
						// 										// .attr("width", "100%").attr("height", "100%");
						// 								}
						// 							});
						// var array = [];
						// d3.select(compareChart).select('svg').selectAll('.highcharts-series').selectAll('rect').each(function(){array.push(this.height.animVal.value)});
						
						// console.log(array);
						// var scale = d3.scale.linear()
				  //           .domain([Math.min.apply(null, array),Math.max.apply(null, array)])
				  //           .range([sessions["viz"].getColorMappingsSet()[1].getValue(),sessions["viz"].getColorMappingsSet()[0].getValue()]);
						
						// d3.select(compareChart).selectAll('svg').selectAll('.highcharts-series').selectAll('rect').attr('fill', function(){return scale(this.height.animVal.value)})
						

			   		}, 1
			   	);
			}

		});
	},



	/*******************************************************************************************************
	*
	* Mapping for MetExplore
	*
	*/

    /***********************************************
     * Mapping to binary data 0 1
     * This function will look at metabolites that have data
     * maped and will color them in blue
     * !!!!! Have to be modified in order to do some batch
     * rendering
     * @param {} conditionName : Condition choosed by the user
     */
    graphMappingBinary : function(conditionName) {
        var networkVizSessionStore = metExploreD3.getSessionsSet();
        var session = metExploreD3.getSessionById(networkVizSessionStore, 'viz');
        var force = session.getForce();
        force.stop();
        var myMask = metExploreD3.createLoadMask("Mapping in progress...", 'viz');
        if(myMask!= undefined){

            metExploreD3.showMask(myMask);
            setTimeout(
                function() {
                    metExploreD3.GraphMapping.fixMappingColorOnNode("#056da1", 1, conditionName);

                    metExploreD3.hideMask(myMask);
                    var anim=metExploreD3.GraphNetwork.isAnimated("viz");
                    if (anim=='true') {
                        var networkVizSessionStore = metExploreD3.getSessionsSet();
                        var session = metExploreD3.getSessionById(networkVizSessionStore, 'viz');
                        var force = session.getForce();

                        if ((d3.select("#viz").select("#D3viz").attr("animation") == 'true') || (d3.select("#viz").select("#D3viz") .attr("animation") == null)) {
                            force.resume();
                        }
                    }
                }, 1
            );
        }
    },

	/***********************************************
     * Mapping to binary data 0 1
     * This function will look at metabolites that have data
     * maped and will color them in blue
     * !!!!! Have to be modified in order to do some batch
     * rendering
     * @param {} conditionName : Condition choosed by the user
     */
    removeMappingSuggestion : function(conditionName) {
    	var regexpPanel=/[.>< ,\/=()]/g;
		conditionName = conditionName.replace(regexpPanel, "");
        var session = _metExploreViz.getSessionById('viz');
        var force = session.getForce();
        force.stop();
        var myMask = metExploreD3.createLoadMask("Mapping in progress...", 'viz');
        if(myMask!= undefined){

            metExploreD3.showMask(myMask);
            setTimeout(
                function() {

                // .filter(
                //         function(d) {
                //             if(d.getBiologicalType() == 'reaction')
                //             {
                //                 if (metExploreD3.getReactionById(reaction_Store, d.getId()).get(
                //                         'mapped') == undefined)
                //                     return false;
                //                 else
                //                 {
                //                     if((metExploreD3.getReactionById(reaction_Store, d.getId()).get('mapped') != 0)
                //                         && metExploreD3.getReactionById(reaction_Store, d.getId()).get(conditionName)==value){
                //                         var sessionsStore = metExploreD3.getSessionsSet();
                //                         var reactionStyle = metExploreD3.getReactionStyle();
                //                         _MyThisGraphNode.addText(d, 'viz', reactionStyle, sessionsStore);
                //                         return true;
                //                     }
                //                     else
                //                     {
                //                         return false;
                //                     }
                //                 }
                //             }
                //             else
                //             {
                //                 if(d.getBiologicalType() == 'metabolite'&& !d.isSideCompound())
                //                 {
                //                     if(metExploreD3.getMetaboliteById(metabolite_Store, d.getId())==null)
                //                         return false;
                //                     if (metExploreD3.getMetaboliteById(metabolite_Store, d.getId()).get(
                //                             'mapped') == undefined)
                //                         return false;
                //                     else
                //                     {
                //                         if((metExploreD3.getMetaboliteById(metabolite_Store, d.getId()).get('mapped') != 0)
                //                             && metExploreD3.getMetaboliteById(metabolite_Store, d.getId()).get(conditionName)==value){
                //
                //                             var sessionsStore = metExploreD3.getSessionsSet();
                //                             var metaboliteStyle = metExploreD3.getMetaboliteStyle();
                //                             _MyThisGraphNode.addText(d, 'viz', metaboliteStyle, sessionsStore);
                //                             return true;
                //                         }
                //                         else
                //                         {
                //                             return false;
                //                         }
                //                     }
                //                 }
                //             }
                //
                //         }
                //     )
                    metExploreD3.GraphNode.node
                        .selectAll(".suggestion."+conditionName)
                        .remove();

					if(d3.selectAll('.suggestion')[0].length>0){
						metExploreD3.GraphNode.node
	            			.each(function(){
	            				var  i = 0;
	            				var suggestions = d3.select(this).selectAll('.suggestion')
	            					.each(function(){
			            				var position = 14*i;
			            				d3.select(this)
					                        .attr("height",20)
					                        .attr("width",20)
					                        .attr("x",7+position)
					                        .attr("y",-18)
										i++
		            				});
	            			});
					}

                    metExploreD3.hideMask(myMask);
                    var anim=metExploreD3.GraphNetwork.isAnimated("viz");
                    if (anim=='true') {
                        var session = _metExploreViz.getSessionById('viz');
                        var force = session.getForce();

                        if ((d3.select("#viz").select("#D3viz").attr("animation") == 'true') || (d3.select("#viz").select("#D3viz") .attr("animation") == null)) {
                            force.resume();
                        }
                    }
                }, 1
            );
        }
    },

	/***********************************************
     * Mapping to binary data 0 1
     * This function will look at metabolites that have data
     * maped and will color them in blue
     * !!!!! Have to be modified in order to do some batch
     * rendering
     * @param {} conditionName : Condition choosed by the user
     */
    graphMappingSuggestion : function(mappingName, conditionName, color, threshold,  func) {

		var conditionNameUsed = mappingName + conditionName[0];
        var regexpPanel=/[.>< ,\/=()]/g;
        conditionNameUsed = conditionNameUsed.replace(regexpPanel, "");
	    if(!color) color="rgb(95, 162, 221)";

		metExploreD3.GraphNode.node
			.filter( function(d) {
				if (d.getMappingDatasLength()==0)
					return false;
				else
				{
					var map = d.getMappingDataByNameAndCond(mappingName, conditionName);
					if(map!=null){
						if(map.getMapValue()>=threshold){
							var session = _metExploreViz.getSessionById('viz');
							session.addMappedNode(d.getId());
							return true;
						}
						else
						{
							return false;
						}
					}
					else
					{
						return false;
					}
				}
			})
			.each(function(node){
				var newSuggestion = d3.select(this)
					.append("svg")
	                .classed("suggestion", true);

				var suggestions = d3.select(this).selectAll('.suggestion');

				var position = 14*(suggestions[0].length-1);
				newSuggestion
					.classed(conditionNameUsed, true)
	                .attr("height",20)
	                .attr("width",20)
	                .attr("x",5+position)
	                .attr("y",-18)
	                // .append("polygon")
	                // .attr("opacity", 0)
                    // .attr("points","9.9, 1.1, 3.3, 21.78, 19.8, 8.58, 0, 8.58, 16.5, 21.78")
	                // .attr("transform", "translate(0, 0) scale(0.7)")
	                // .style("fill", color)
	                // // .style("stroke","black").style("stroke-width", 2)
	                // .style("fill-rule","nonzero")
                    .append("svg:path")
                    .attr("class", String)
                    .attr("d", "M 0,5.3528866 0.84449534,2.7674789 C 2.7905023,3.4472341 4.2041125,4.0359299 5.0853308,4.533567 4.8527823,2.3366022 4.730392,0.82541479 4.7181585,0 H 7.3801546 C 7.3434281,1.2016944 7.2026799,2.7068129 6.9579067,4.5153601 8.218521,3.8842039 9.662729,3.3015774 11.290535,2.7674789 l 0.844496,2.5854077 C 10.580658,5.8627062 9.0568966,6.2025725 7.5637406,6.372484 8.310314,7.0158217 9.3628723,8.1628681 10.721418,9.8136252 L 8.5183877,11.361229 C 7.8085125,10.402339 6.9701382,9.0974974 6.00326,7.4467029 5.0975634,9.1581876 4.3020251,10.463029 3.6166429,11.361229 L 1.4503289,9.8136252 C 2.8700561,8.0779019 3.8858973,6.9308554 4.4978555,6.372484 2.9190124,6.0690531 1.4197286,5.7291879 0,5.3528866")
                    .attr("fill", color)
                    .style("stroke-linejoin", "bevel")
                    .style("fill-rule","nonzero")
	                .transition().duration(2000)
	                .attr("stroke-width", 1)
	                .attr("paint-order", "stroke")
	                .attr("stroke", "white")
	                .attr("stroke-opacity", 0.7)
	                .attr("pointer-events", "none")
	                .attr("opacity", 1);
			})
    },

	/***********************************************
     * Mapping to binary data 0 1
     * This function will look at metabolites that have data
     * maped and will color them in blue
     * !!!!! Have to be modified in order to do some batch
     * rendering
     * @param {} conditionName : Condition choosed by the user
     */
    setColorSuggestionOnGraph : function(conditionName, color) {
	    if(!color) color="rgb(95, 162, 221)";

		metExploreD3.GraphNode.node
			.selectAll("."+conditionName)
			.select("path")
            .style("fill", color);
    },

    /***********************************************
     * Change color for a value
     * @param {} color : New color
     * @param {} value : Value corresponding to the color
     * @param {} conditionName : Condition choosed by the user
     */
    setSuggestionColor : function(color, conditionName){
        var session = _metExploreViz.getSessionById('viz');
        var force = session.getForce();
        force.stop();
        var myMask = metExploreD3.createLoadMask("Mapping in progress...", 'viz');
        if(myMask!= undefined){

            metExploreD3.showMask(myMask);
            setTimeout(
                function() {

                    var theColor = session.getColorSuggestionById(conditionName);
                    theColor.setValue(color);

                    metExploreD3.GraphMapping.setColorSuggestionOnGraph(conditionName, color);

                    metExploreD3.hideMask(myMask);

                }, 1
            );
        }
    },

    /***********************************************
	* Mapping to discrete data
	* This function will look at metabolites that have data
	* maped and will color them in a calculated color
	* @param {} conditionName : Condition choosed by the user
	*/
	graphMappingSuggestionData : function(mappingName, conditionName, threshold, func) {
		metExploreD3.onloadMapping(mappingName, function(){

			var mapping = _metExploreViz.getMappingByName(mappingName);
			var myMask = metExploreD3.createLoadMask("Mapping in progress...", 'viz');
			if(myMask!= undefined){

				metExploreD3.showMask(myMask);
		        setTimeout(
					function() {

						var session = _metExploreViz.getSessionById('viz');
						var force = session.getForce();
						force.stop();
						var conditions = mapping.getConditions();
						var nodes = session.getD3Data().getNodes();

						var values = [];

						var regexpPanel=/[.>< ,\/=()]/g;
						var conditionNameUsed = mappingName +" "+ conditionName[0];
						// var idMapping = metExploreD3.getMappingSelection();
						// var mappingInfoStore = metExploreD3.getMappingInfosSet();

						// var theMapping = metExploreD3.findMappingInfo(mappingInfoStore, 'id', idMapping);

						// var ids = theMapping.get('idMapped');
						// var idsTab = ids.split(",");
						// var i;

						conditions.forEach(
							function(condition)
							{
								nodes.forEach(function(node){
									var mapNode = node.getMappingDataByNameAndCond(mapping.getName(), condition);
									if(mapNode != null){
										var exist = false;
										var mapVal = mapNode.getMapValue().valueOf();

										values.forEach(function(val){
											if(val.valueOf()==mapVal.valueOf())
												exist = true;
										})
										if(!exist)
											values.push(mapVal);
									}

								});
								// 	var metabolite = metExploreD3.getMetaboliteById(metabolite_Store, idsTab[i]);
								// 	if(metabolite!=undefined)
								// 		if (metabolite.get('mapped') != undefined)
								// 			if (metabolite.get('mapped') != 0)
								// 				if(metabolite.get(condition.getCondInMetabolite())!=undefined){

								// 				}
								// }
							}
						);
                        var idUsed = conditionNameUsed.replace(regexpPanel, "");
						if(session.getColorSuggestionById(idUsed)!==null){
                            Ext.Msg.show({
                                title:'Warning',
                                msg: 'Stars on '+conditionNameUsed+' exist. Please remove their before.',
                                buttons: Ext.Msg.WARNING,
                                icon: Ext.Msg.WARNING
                            });
                            metExploreD3.hideMask(myMask);
                        }
                        else
						{
                            var colorStore = session.getColorSuggestionsSet();

                            var colors = ["#1E90FF", "#006838", "#ff6347", "#ffa500", "#7F00FF", "#00416a", "#FFFF00"];
                            var color = colors.find(function (color) {
								var find = colorStore.find(function (aStore) {
                                    return color === aStore.getValue();
                                });

                                return find===undefined;
                            });

                            session.addColorSuggestion(idUsed, color);

                            metExploreD3.GraphMapping.graphMappingSuggestion(mappingName, conditionName, color, threshold);

                            metExploreD3.hideMask(myMask);

                            if (func!==undefined) {func()};

                            metExploreD3.fireEventArg('selectCondition', 'setConditionProgramaticaly', conditionNameUsed);
                            if(values.length!==0)
                                metExploreD3.fireEventArg('selectConditionForm', 'afterSuggestionMapping', 'suggestion');
                            else
                                metExploreD3.displayMessage("Warning", 'No mapped node on network.');
						}

						var anim=metExploreD3.GraphNetwork.isAnimated("viz");
						if (anim==='true') {
							session = _metExploreViz.getSessionById('viz');
							force = session.getForce();
							
							if ((d3.select("#viz").select("#D3viz").attr("animation") === 'true') || (d3.select("#viz").select("#D3viz") .attr("animation") == null)) {
									force.resume();
							}
						}
			   		}, 1
			   	);
			}
		});
	},

	/***********************************************
	* Fill node with corresponding color
	* @param {} color : Color to fill the node
	* @param {} value : Value corresponding to the color
	* @param {} conditionName : Condition choosed by the user
	*/
	fixMappingColorOnNode : function(color, value, conditionName){
		var vis = d3.select("#viz").select("#D3viz");
		var metabolite_Store = metExploreD3.getMetabolitesSet();
		var reaction_Store = metExploreD3.getReactionsSet();

		vis.selectAll("g.node")
			.filter(
				function(d) {
					if(d.getBiologicalType() == 'reaction')
					{
						if (metExploreD3.getReactionById(reaction_Store, d.getId()).get(
								'mapped') == undefined)
							return false;
						else
						{
							if((metExploreD3.getReactionById(reaction_Store, d.getId()).get('mapped') != 0)
									&& metExploreD3.getReactionById(reaction_Store, d.getId()).get(conditionName)==value){
								var sessionsStore = metExploreD3.getSessionsSet();
								var reactionStyle = metExploreD3.getReactionStyle();
								_MyThisGraphNode.addText(d, 'viz', reactionStyle, sessionsStore);
								return true;
							}
							else
							{
								return false;
							}
						}	
					}
					else
					{
						if(d.getBiologicalType() == 'metabolite'&& !d.isSideCompound())
					{
						if(metExploreD3.getMetaboliteById(metabolite_Store, d.getId())==null)
							return false;
						if (metExploreD3.getMetaboliteById(metabolite_Store, d.getId()).get(
								'mapped') == undefined)
							return false;
						else
						{
							if((metExploreD3.getMetaboliteById(metabolite_Store, d.getId()).get('mapped') != 0)
									&& metExploreD3.getMetaboliteById(metabolite_Store, d.getId()).get(conditionName)==value){

								var sessionsStore = metExploreD3.getSessionsSet();
								var metaboliteStyle = metExploreD3.getMetaboliteStyle();
								_MyThisGraphNode.addText(d, 'viz', metaboliteStyle, sessionsStore);
								return true;
							}
							else
							{
								return false;
							}
						}	
					}
					}

				}
			)
			.transition().duration(4000)
			.attr("mapped",color)
			.style("fill", color);
	},

	/***********************************************
	* Change color for a value
	* @param {} color : New color
	* @param {} value : Value corresponding to the color
	* @param {} conditionName : Condition choosed by the user
	*/
	setDiscreteMappingColor : function(color, value, conditionName, selectedMapping){
		
		var session = _metExploreViz.getSessionById('viz');
		var force = session.getForce();
		force.stop(); 
		var myMask = metExploreD3.createLoadMask("Mapping in progress...", 'viz');
		if(myMask!= undefined){

			metExploreD3.showMask(myMask);
	        setTimeout(
				function() {
					
					var vis = d3.select("#viz").select("#D3viz");
					
					var colorStore = session.getColorMappingsSet();
					
					var theColor = session.getColorMappingById(value);	
					theColor.setValue(color);
					
					metExploreD3.GraphMapping.fixMappingColorOnNodeData(color, value, conditionName, selectedMapping);
				
					metExploreD3.hideMask(myMask);
					
		   		}, 1
		   	);
		}
	},
	/***********************************************
	* Change color for a value
	* @param {} color : New color
	* @param {} value : Value corresponding to the color
	* @param {} conditionName : Condition choosed by the user
	*/
	setContinuousMappingColor : function(color, value, conditionName, selectedMapping){
		
		var session = _metExploreViz.getSessionById('viz');
		var force = session.getForce();
		force.stop(); 
		var myMask = metExploreD3.createLoadMask("Mapping in progress...", 'viz');
		if(myMask!= undefined){

			metExploreD3.showMask(myMask);
					
			var vis = d3.select("#viz").select("#D3viz");
			
			var colorStore = session.getColorMappingsSet();
			
			var theColor = session.getColorMappingById(value);	
			theColor.setValue(color);
			
			metExploreD3.hideMask(myMask);
		}
	},

	/***********************************************
	* Remove the mapping graphically
	* @param {} conditionName : Condition choosed by the user
	*/
	removeGraphMapping : function(conditionName) {
		var session = _metExploreViz.getSessionById('viz');
		var vis = d3.select("#viz").select("#D3viz");
		var metabolite_Store = metExploreD3.getMetabolitesSet();
		var reaction_Store = metExploreD3.getReactionsSet();

		vis.selectAll("g.node")
			.filter(
				function(d) {
					if(d.getBiologicalType() == 'reaction'){
						if (metExploreD3.getReactionById(reaction_Store, d.getId()).get(
								'mapped') == undefined)
							return false;
						else
							return metExploreD3.getReactionById(reaction_Store, d.getId()).get('mapped') != 0
					}
					else
					{
						if(d.getBiologicalType() == 'metabolite'){
							if (metExploreD3.getMetaboliteById(metabolite_Store, d.getId()).get(
									'mapped') == undefined)
								return false;
							else
								return metExploreD3.getMetaboliteById(metabolite_Store, d.getId()).get('mapped') != 0
						}
					}
				}
			)
			.transition().duration(1000)
			.attr("transform", function(d){
				return "translate("+d.x+", "+d.y+") scale(1)";
			})
			.style("fill", "white");
		
		vis.selectAll("g.node")
			.filter(function(d){
				if(this.getAttribute("mapped")==undefined || this.getAttribute("mapped")==false || this.getAttribute("mapped")=="false") return false;
				else return true;
			})
			.attr("mapped", "false")
			.selectAll("rect.stroke")
			.remove();					
	},
	

	/***********************************************
	* Remove the mapping graphically
	* @param {} conditionName : Condition choosed by the user
	*/
	removeGraphMappingData : function(conditionName) {
		var session = _metExploreViz.getSessionById('viz');
		var vis = d3.select("#viz").select("#D3viz");

		vis.selectAll("g.node")
			.transition().duration(1000)
			.attr("transform", function(d){
				return "translate("+d.x+", "+d.y+") scale(1)";
			})
			.style("fill", "white")
			.style("opacity",1)
			.each(function(node){
				if(node.getBiologicalType()=="reaction"){
					if(node.isSelected())
						d3.select(this).select('text').transition().duration(4000).style("fill", "white");
					else
						d3.select(this).select('text').transition().duration(4000).style("fill", "black");
				}
			});	

		vis.selectAll("g.node")
			.filter(function(d){
				if(this.getAttribute("mapped")==undefined || this.getAttribute("mapped")==false || this.getAttribute("mapped")=="false") return false;
				else return true;
			})
			.attr("mapped", "false")
			.selectAll("rect.stroke")
			.remove();

		var metaboliteStyle = metExploreD3.getMetaboliteStyle();
		var linkStyle = metExploreD3.getLinkStyle();
		metExploreD3.GraphLink.refreshLink('viz', session, linkStyle, metaboliteStyle);					
	},

	launchAfterMappingFunction:function(mappingId, func) {
        var mapping = _metExploreViz.getMappingById(mappingId); 
        if (mapping !== null) {
           // the variable is defined
           func(mapping);
           return;
        }
        var that = this;
        setTimeout(function(){that.launchAfterMappingFunction(mappingId, func);}, 100);    
    },

    onloadMapping : function(mapping, func){
        this.launchAfterMappingFunction(mapping, func);
    },
    /***********************************************
    * Remove the mapping in MetExploreViz
    * @param {} conditionName : Condition choosed by the user
    */
    removeMappingData : function(mappingObj) {
        this.onloadMapping(mappingObj.get('id'), function(mapping){
	        metExploreD3.fireEventArg('selectConditionForm', "removeMapping", mapping);
    	});
     /*   var array = [];
        _metExploreViz.getMappingsSet().forEach(function(map){
            if (map.getName().search(mapping.get('title'))!=-1) {
               array.push(); 
            };
        });*/

    },

	loadDataFromJSON : function(json) {
		var mappingJSON = metExploreD3.GraphUtils.decodeJSON(json);
		if(mappingJSON){
			var session = _metExploreViz.getSessionById('viz');
			var force = session.getForce();
			force.stop(); 
			var myMask = metExploreD3.createLoadMask("Mapping in progress...", 'viz');
			if(myMask!= undefined){

				metExploreD3.showMask(myMask);
		        setTimeout(
				function() {	
					var conds =[];
					mappingJSON.mappings.forEach(function(condition){
			        	conds.push(condition.name);
			        });
		   			var mapping = new Mapping(mappingJSON.name, conds, mappingJSON.targetLabel, mappingJSON.id);
							                
					_metExploreViz.addMapping(mapping);

	        		metExploreD3.GraphMapping.generateMapping(mapping, mappingJSON.mappings);
					
					metExploreD3.hideMask(myMask);


			        metExploreD3.fireEventArg('selectMappingVisu', "jsonmapping", mapping);
					var anim=metExploreD3.GraphNetwork.isAnimated("viz");
					if (anim=='true') {
						var force = session.getForce();
						
						if ((d3.select("#viz").select("#D3viz").attr("animation") == 'true') || (d3.select("#viz").select("#D3viz") .attr("animation") == null)) {
							force.resume();
						}
					}
				}, 1);
			}
		}
	},

	/*****************************************************
    * Update the network to fit the cart content
    */
    loadDataTSV : function(url, func) {
    	var session = _metExploreViz.getSessionById('viz');
		var force = session.getForce();
		force.stop(); 
		var myMask = metExploreD3.createLoadMask("Mapping in progress...", 'viz');
		if(myMask!= undefined){

			metExploreD3.showMask(myMask);
	        d3.tsv(url, function(data) {
	            
	            var urlSplit = url.split('/');
	            var title = url.split('/')[urlSplit.length-1];

	            var targetName = Object.keys(data[0])[0];

	            var indexOfTarget = Object.keys(data[0]).indexOf(targetName);
	            var arrayAttr = Object.keys(data[0]);
	            if (indexOfTarget > -1) {
	                arrayAttr.splice(indexOfTarget, 1);
	            }

	            var array = [];
	            var mapping = new Mapping(title, arrayAttr, targetName, array);
	            _metExploreViz.addMapping(mapping);  
	            
	            metExploreD3.GraphMapping.mapNodeDataFile(mapping, data);

	            metExploreD3.fireEventArg('selectMappingVisu', "jsonmapping", mapping);
	            metExploreD3.hideMask(myMask);
	            if (func!=undefined) {func()};
	            var anim=metExploreD3.GraphNetwork.isAnimated("viz");
				if (anim=='true') {
					var force = session.getForce();
					
					if ((d3.select("#viz").select("#D3viz").attr("animation") == 'true') || (d3.select("#viz").select("#D3viz") .attr("animation") == null)) {
						force.resume();
					}
				}   
	        });
		}
    },
    
	generateMapping: function(mapping, nodeMappingByCondition){
		var session = _metExploreViz.getSessionById('viz');
		var networkData = session.getD3Data();

		switch (mapping.getTargetLabel()) {
            case "reactionDBIdentifier":
            	if(!(nodeMappingByCondition.length==1 && nodeMappingByCondition[0].name=="undefined"))
                {
                	nodeMappingByCondition.forEach(function(condition){
    					condition.data
	                		.filter(function(map){
	    							return (!isNaN(map.value) && map.value!=null)
	    					})
	    					.forEach(function(map){
								var mapData = new MappingData(map.node, mapping.getName(), condition.name, map.value);
								mapping.addMap(mapData);
	    						var node = networkData.getNodeByDbIdentifier(map.node);
	    						if(node!=undefined){
	    							var mapNode = new MappingData(node, mapping.getName(), condition.name, map.value);
	    							node.addMappingData(mapNode);
	    						}
    	        		});	
                 	 });
                }
                else
                {
                	nodeMappingByCondition[0].data
                		.forEach(function(map){
							var mapData = new MappingData(map.node, mapping.getName(), nodeMappingByCondition[0].name, map.value);
							mapping.addMap(mapData);
							var node = networkData.getNodeByDbIdentifier(map.node);
							if(node!=undefined){
								var mapNode = new MappingData(node, mapping.getName(), nodeMappingByCondition[0].name, map.value);
								node.addMappingData(mapNode);
							}
		        		});	
                }
                break;
            case "metaboliteDBIdentifier":
	            if(!(nodeMappingByCondition.length==1 && nodeMappingByCondition[0].name=="undefined"))
	            {	
	                nodeMappingByCondition.forEach(function(condition){
						condition.data
							.filter(function(map){
		    					return (!isNaN(map.value) && map.value!=null)
		    				})
							.forEach(function(map){   
								var mapData = new MappingData(map.node, mapping.getName(), condition.name, map.value);
								mapping.addMap(mapData); 
								var node = networkData.getNodeByDbIdentifier(map.node);
								if(node!=undefined){
									var mapNode = new MappingData(node, mapping.getName(), condition.name, map.value);
									node.addMappingData(mapNode);
								}
			        		});	
	             	 });
	            }
	            else
	            {
	            	nodeMappingByCondition.forEach(function(condition){
						condition.data
							.forEach(function(map){   
								var mapData = new MappingData(map.node, mapping.getName(), condition.name, map.value);
								mapping.addMap(mapData); 
								var node = networkData.getNodeByDbIdentifier(map.node);
								if(node!=undefined){
									var mapNode = new MappingData(node, mapping.getName(), condition.name, map.value);
									node.addMappingData(mapNode);
								}
			        		});	
	             	 });
	            }
                break;
            case "reactionId":
            	if(!(nodeMappingByCondition.length==1 && nodeMappingByCondition[0].name=="undefined"))
                {
                	nodeMappingByCondition.forEach(function(condition){
    					condition.data
		                	.filter(function(map){
								return (!isNaN(map.value) && map.value!=null)
							})
	    					.forEach(function(map){
								var mapData = new MappingData(map.node, mapping.getName(), condition.name, map.value);
								mapping.addMap(mapData);
	    						var node = networkData.getNodeById(map.node);
	    						if(node!=undefined){
	    							var mapNode = new MappingData(node, mapping.getName(), condition.name, map.value);
	    							node.addMappingData(mapNode);
	    						}
	    	        		});	
                 	 });
                }
                else
                {
                	nodeMappingByCondition[0].data
	                	.forEach(function(map){
							var mapData = new MappingData(map.node, mapping.getName(), nodeMappingByCondition[0].name, map.value);
							mapping.addMap(mapData);
							var node = networkData.getNodeById(map.node);
							if(node!=undefined){
								var mapNode = new MappingData(node, mapping.getName(), nodeMappingByCondition[0].name, map.value);
								node.addMappingData(mapNode);
							}
		        		});	
                }
                break;
            case "metaboliteId":
            	if(!(nodeMappingByCondition.length==1 && nodeMappingByCondition[0].name=="undefined"))
	            {	
	                nodeMappingByCondition.forEach(function(condition){
						condition.data
							.filter(function(map){
								return (!isNaN(map.value) && map.value!=null)
							})
							.forEach(function(map){ 
								var mapData = new MappingData(map.node, mapping.getName(), condition.name, map.value);
								mapping.addMap(mapData); 
								var node = networkData.getNodeById(map.node);
								if(node!=undefined){
									var mapNode = new MappingData(node, mapping.getName(), condition.name, map.value);
									if(map.inchi!= undefined)
										node.mappedInchi = map.inchi;

									node.addMappingData(mapNode);
								}
			        		});	
	             	});
	            }
	            else
	            {
	            	nodeMappingByCondition.forEach(function(condition){
						condition.data
							.forEach(function(map){ 
								var mapData = new MappingData(map.node, mapping.getName(), condition.name, map.value);
								mapping.addMap(mapData); 
								var node = networkData.getNodeById(map.node);
								if(node!=undefined){
									var mapNode = new MappingData(node, mapping.getName(), condition.name, map.value);
									if(map.inchi!= undefined)
										node.mappedInchi = map.inchi;

									node.addMappingData(mapNode);
								}
			        		});	
	             	});
	            }
                break;
            case "inchi":
                // Blah
                break;
            default:
                metExploreD3.displayMessage("Warning", 'The type of node "' + mapping.getTargetLabel() + '" isn\'t know.')
        }
	},

    /*******************************************
     * Partition all the flux value into 10 groups
     * @param {String} condition : The mapping condition
     */
    discretizeFluxRange: function (condition) {
        // Sort the flux value
        var allValues = [];
        var mappingName = _metExploreViz.getSessionById('viz').getActiveMapping();
        d3.select("#viz").select("#D3viz").select("#graphComponent")
            .selectAll("g.node")
            .filter(function (d) {
                return d.getBiologicalType() === "reaction";
            })
            .each(function (d) {
                var reactionMapping = d.getMappingDataByNameAndCond(mappingName, condition);
                allValues.push(reactionMapping)
            });
        allValues.sort(function (a, b) {
            return Math.abs(a.mapValue) - Math.abs(b.mapValue);
        });

        var valueList = [];
        for (var i=0; i<allValues.length; i++) {
            var value = Math.abs(Number(allValues[i].mapValue));
            if (!valueList.length || valueList[valueList.length - 1] !== value) {
                if (value !== 0) {
                    valueList.push(value);
                }
            }
        }
        var clusterList = [];
        for (var i=0; i<valueList.length; i++){
            clusterList.push([valueList[i]]);
        }

        // Cluster the values into 10 groups
        var nbBins = 10;
        var nbClusters = clusterList.length;
        while (nbClusters > nbBins){
            var result = clusterClosestValues(valueList, clusterList);
            valueList = result[0];
            clusterList = result[1];
            nbClusters = clusterList.length;
        }
        function clusterClosestValues(valueList, clusterList){
            var min = valueList[valueList.length-1];
            var minIndex = 0;
            for (var i=0; i<valueList.length-1; i++){
                var gap = valueList[i+1] - valueList[i];
                if (gap < min){
                    min = gap;
                    minIndex = i;
                }
            }
            var newValue = (valueList[minIndex+1] + valueList[minIndex]) / 2;
            var newCluster = clusterList[minIndex].concat(clusterList[minIndex+1]);
            var newValueList = valueList.slice(0,minIndex).concat(newValue, valueList.slice(minIndex+2));
            var newClusterList = clusterList.slice(0,minIndex).concat([newCluster], clusterList.slice(minIndex+2));
            return [newValueList, newClusterList]
        }

        var breakPoints = [];
        for (var i=0; i<clusterList.length; i++){
            breakPoints.push(clusterList[i][clusterList[i].length-1]);
        }


        // Divide the range of value into 10 bins
        var maxValue = Math.abs(Number(allValues[allValues.length-1].mapValue));
        var binsWidth = maxValue/breakPoints.length;
        var midBinValues = [];
        for (var i=0; i<breakPoints.length; i++){
            midBinValues.push(binsWidth / 2 + i * binsWidth);
        }

        // Assign the values into the corresponding bins
        d3.select("#viz").select("#D3viz").select("#graphComponent")
            .selectAll("g.node")
            .filter(function (d) {
                return d.getBiologicalType() === "reaction";
            })
            .each(function (d) {
                var reactionMapping = d.getMappingDataByNameAndCond(mappingName, condition);
                var mapValue = Math.abs(Number(reactionMapping.mapValue));
                for (var i=0; i<breakPoints.length; i++){
                    if (mapValue <= breakPoints[i]){
                        reactionMapping.binnedMapValue = midBinValues[i];
                        break;
                    }
                }
                if (Number(mapValue) === 0){
                    reactionMapping.binnedMapValue = 0;
                }
            });
    },

    /*******************************************
     * Remove the partition of all the flux value into 10 group
     * @param {String} condition : The mapping condition
     */
    removeBinnedMapping : function (condition) {
        var mappingName = _metExploreViz.getSessionById('viz').getActiveMapping();
        var conditions = _metExploreViz.getSessionById('viz').isMapped();
        d3.select("#viz").select("#D3viz").select("#graphComponent")
            .selectAll("g.node")
            .filter(function (d) {
                return d.getBiologicalType() === "reaction";
            })
            .each(function (d) {
                var reactionMapping = d.getMappingDataByNameAndCond(mappingName, condition);
                if (reactionMapping){
                    delete reactionMapping.binnedMapValue;
                }
            })
    },

    /*****************************************************
     * Map images to node using the name of the image files and a property of the nodes and display those images next to the corresponding nodes on the visualisation.
     * @param {} fileList : A list of image files.
     * @param {"Name"/"Id"} arg : A flag to determine which node property to use for the mapping. "Name" will map the images using the label of the node currently displayed, "Id" use the identifier of the node. Default to "Id".
     */
    mapImageToNode : function(fileList, arg){
        var listNames = [];
        for (var i=0; i<fileList.length; i++){
            if (fileList[i].type === "image/png" || fileList[i].type === "image/jpeg" || fileList[i].type === "image/svg+xml"){
                var nodeName = fileList[i].name.replace(/\.[^/.]+$/, "");
                if (listNames.includes(nodeName)){
                    continue;
                }
                listNames.push(nodeName);
                var urlImage = URL.createObjectURL(fileList[i]);
                var node = d3.select("#viz").select("#D3viz").select("#graphComponent")
                    .selectAll("g.node")
                    .filter(function (d) {
                        var style = (d.getBiologicalType() === "metabolite") ? metExploreD3.getMetaboliteStyle() : metExploreD3.getReactionStyle();
                        var label = style.getDisplayLabel(d, style.getLabel());
                        //var target = (arg === "Name") ? d.name : d.dbIdentifier;
                        var target = (arg === "Name") ? label : d.dbIdentifier;
                        return (nodeName === target);
                    });
                if (!node.select(".imageNode").empty()){
                    node.select(".imageNode").remove();
                }

                metExploreD3.GraphUtils.getDataUri(urlImage, function(dataUri) {
                    // Do whatever you'd like with the Data URI!
                    var img = new Image();
                    img.src = dataUri;
                    img.node = node;
                    img.onload = function () {
                        var imgWidth = this.width;
                        var imgHeight = this.height;

                        if (imgWidth > 150){
                            imgHeight = imgHeight * (150/imgWidth);
                            imgWidth = 150;
                        }
                        var offsetX = -imgWidth/2;
                        this.node.append("g")
                            .attr("class", "imageNode")
                            .attr("x", 0)
                            .attr("y", 0)
                            .attr("width", imgWidth)
                            .attr("height", imgHeight)
                            .attr("opacity", 1)
                            .attr("transform", "translate(" + offsetX + ",20)");
                        this.node.selectAll(".imageNode")
                            .append("image")
                            .attr("class", "mappingImage")
                            .attr("href", this.src)
                            .attr("width", imgWidth)
                            .attr("height", imgHeight)
                            .attr("opacity", 1);
                        metExploreD3.GraphMapping.applyEventOnImage(this.node.select(".imageNode"));
                        this.node.selectAll(".imageNode")
                            .each(function(d){
                                metExploreD3.GraphMapping.setStartingImageStyle(d);
                                this.parentNode.parentNode.appendChild(this.parentNode);
                            });
                    };
                    console.log(dataUri);
                });

            }
        }
    },

    /*****************************************************
     * Select an image element mapped to a node.
     * @param {Object} node : The node on which is mapped the image to select.
     */
    selectMappedImages: function (node) {
        var selectedImages = d3.select("#viz").select("#D3viz").select("#graphComponent")
            .selectAll("g.node")
            .filter(function(d){return d.getId()==node.getId();})
            .select(".mappingImage");
        return selectedImages;
    },

    /*****************************************************
     * Toggle the opacity of an image element between 0 and 1.
     * @param {Object} node : The node on which is mapped the image.
     */
    displayMappedImage: function (node) {
        var mappedImage = d3.select("#viz").select("#D3viz").select("#graphComponent")
            .selectAll("g.node")
            .filter(function(d){return d.getId() === node.getId();})
            .select(".imageNode");
        if (mappedImage.attr("opacity") === '0'){
            mappedImage.attr("opacity", 1);
        }
        else {
            mappedImage.attr("opacity", 0);
        }
    },

    /*****************************************************
     * Apply mouse event on an image element, allowing drag-and-drop and resizing of the image.
     * @param {} image : The g element containing the image on which to apply the event.
     */
    applyEventOnImage : function (image) {
        image.on("mouseenter", function () {
            var mouseleaveEvent = new MouseEvent("mouseleave");
            this.parentNode.dispatchEvent(mouseleaveEvent);
        }).on("mouseleave", function () {
            var mouseenterEvent = new MouseEvent("mouseenter");
            this.parentNode.dispatchEvent(mouseenterEvent);
        });
        var drag = metExploreD3.GraphStyleEdition.createDragBehavior();
        image.call(drag);
        metExploreD3.GraphMapping.applyResizeHandle(image);

    },

    /*******************************************
     * Add element in the corner of an image that can be used to resize that image
     * @param {} image : The g element containing the image on which to add the element
     */
    applyResizeHandle : function (image) {
        var imgWidth = Number(image.attr("width"));
        var imgHeight = Number(image.attr("height"));
        var deltaGX = 0;
        var oldX = 0;
        var oldY = 0;
        var limitX = 0;

        var drag = d3.behavior.drag().on("dragstart", function () {
            d3.event.sourceEvent.stopPropagation();
            imgWidth = Number(image.attr("width"));
            imgHeight = Number(image.attr("height"));
            oldX = d3.transform(d3.select(this.parentNode).attr("transform")).translate[0];
            oldY = d3.transform(d3.select(this.parentNode).attr("transform")).translate[1];
            limitX = oldX + imgWidth;
            d3.selectAll("#D3viz").style("cursor", "move");
        }).on('drag', function () {
            var newWidth = 0;
            var newHeight = 0;
            if (d3.select(this).attr("class") === "LL" || d3.select(this).attr("class") === "UL") {
                var tmpWidth = d3.select(this.parentNode).attr("width");
                newWidth = tmpWidth - (d3.event.x + deltaGX);
                var transform = d3.select(this.parentNode).attr("transform");
                var transformList = transform.split(/(translate\([\d.,\-\s]*\))/);
                var x = d3.transform(d3.select(this.parentNode).attr("transform")).translate[0];
                var y = d3.transform(d3.select(this.parentNode).attr("transform")).translate[1];
                var newX = x + d3.event.x + deltaGX;
                newX = Math.min(newX, limitX - 8);
                var translate = "translate(" + newX + "," + y + ")";
                d3.select(this.parentNode).attr("transform", transformList[0] + translate + transformList[2]);
            }
            else {
                newWidth = d3.event.x - deltaGX;
            }
            newWidth = Math.max(newWidth, 8);
            newHeight = imgHeight * (newWidth/imgWidth);
            newWidth = (newWidth > 0) ? newWidth : 0;
            newHeight = (newHeight > 0) ? newHeight : 0;
            image.attr("width", newWidth);
            image.attr("height", newHeight);
            if (d3.select(this).attr("class") === "UL" || d3.select(this).attr("class") === "UR") {
                var transform = d3.select(this.parentNode).attr("transform");
                var transformList = transform.split(/(translate\([\d.,\-\s]*\))/);
                var x = d3.transform(d3.select(this.parentNode).attr("transform")).translate[0];
                var y = d3.transform(d3.select(this.parentNode).attr("transform")).translate[1];
                var newY =  oldY - (newHeight - imgHeight);
                var translate = "translate(" + x + "," + newY + ")";
                d3.select(this.parentNode).attr("transform", transformList[0] + translate + transformList[2]);
            }
            metExploreD3.GraphMapping.updateImageDimensions(image);
        }).on("dragend", function () {
            d3.selectAll("#D3viz").style("cursor", "default");
        });

        image.append("rect").attr("class", "W1").attr("width", 2).attr("height", imgHeight).attr("fill", "grey").attr("opacity", 0.5);
        image.append("rect").attr("class", "W2").attr("width", 2).attr("height", imgHeight).attr("fill", "grey").attr("opacity", 0.5)
            .attr("transform", "translate(" + (imgWidth - 2) + ",0)");
        image.append("rect").attr("class", "H1").attr("width", imgWidth).attr("height", 2).attr("fill", "grey").attr("opacity", 0.5);
        image.append("rect").attr("class", "H2").attr("width", imgWidth).attr("height", 2).attr("fill", "grey").attr("opacity", 0.5)
            .attr("transform", "translate(0," + (imgHeight - 2) + ")");
        image.append("rect").attr("class", "UL").attr("width", 4).attr("height", 4).attr("fill", "blue").attr("opacity", 0.5)
            .call(drag);
        image.append("rect").attr("class", "UR").attr("width", 4).attr("height", 4).attr("fill", "blue").attr("opacity", 0.5)
            .attr("transform", "translate(" + (imgWidth - 4) + ",0)")
            .call(drag);
        image.append("rect").attr("class", "LL").attr("width", 4).attr("height", 4).attr("fill", "blue").attr("opacity", 0.5)
            .attr("transform", "translate(0," + (imgHeight - 4) + ")")
            .call(drag);
        image.append("rect").attr("class", "LR") .attr("width", 4).attr("height", 4).attr("fill", "blue").attr("opacity", 0.5)
            .attr("transform", "translate(" + (imgWidth - 4) + "," + (imgHeight - 4) + ")")
            .call(drag);
    },

    /*******************************************
     * Resize an image and any associated resize handles so that they correspond to the dimension of their parent element
     * @param {} image : The g element containing the image to resize
     */
    updateImageDimensions : function(image) {
        var imgWidth = image.attr("width");
        var imgHeight = image.attr("height");
        // Start test
        imgWidth = (imgWidth > 0) ? imgWidth : 0;
        imgHeight = (imgHeight > 0) ? imgHeight : 0;
        // End test
        image.select(".mappingImage").attr("width", imgWidth);
        image.select(".mappingImage").attr("height", imgHeight);
        image.select(".UR").attr("transform", "translate(" + (imgWidth - 4) + ", 0)");
        image.select(".LL").attr("transform", "translate(0, " + (imgHeight - 4) + ")");
        image.select(".LR").attr("transform", "translate(" + (imgWidth - 4) + ", " + (imgHeight - 4) + ")");
        image.select(".W1").attr("height", imgHeight);
        image.select(".W2").attr("height", imgHeight).attr("transform", "translate(" + (imgWidth - 2) + ",0)");
        image.select(".H1").attr("width", imgWidth);
        image.select(".H2").attr("width", imgWidth).attr("transform", "translate(0," + (imgHeight - 2) + ")");
    },

    /*******************************************
     * Set position and size of an image if those kind of data were provided with the JSON
     * @param {Object} node : The node whose label will be modified
     */
    setStartingImageStyle : function (node) {
        if (node.imagePosition) {
            var selection = d3.select("#viz").select("#D3viz").select("#graphComponent")
                .selectAll("g.node")
                .filter(function (d) {
                    return d.getId() == node.getId();
                })
                .select(".imageNode");
            var imgWidth = selection.attr("width");
            var imgHeight = selection.attr("height");
            if (node.imagePosition.imageX) { selection.attr("x", node.imagePosition.imageX); }
            if (node.imagePosition.imageY) { selection.attr("y", node.imagePosition.imageY); }
            if (node.imagePosition.imageWidth) {
                selection.attr("width", node.imagePosition.imageWidth);
                selection.attr("height", node.imagePosition.imageWidth * imgHeight / imgWidth);
            }
            if (node.imagePosition.imageTransform) { selection.attr("transform", node.imagePosition.imageTransform); }
            metExploreD3.GraphMapping.updateImageDimensions(selection);
        }
    }
}