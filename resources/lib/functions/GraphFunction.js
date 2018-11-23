/**
 * @author MC
 * (a)description : Basic functions
 */
    
metExploreD3.GraphFunction = {

    bfs : function (node){
	    var graph = metExploreD3.GraphFunction.getGraphNotDirected();

    	var root = graph.getNode(node.getId());
  
  		for (var key in graph.nodes) {	
	          graph.nodes[key].distance = "INFINITY";        
	          graph.nodes[key].parent = null;
	    }            
  
      	var queue = [];     
  
      	root.distance = 0;
     	queue.push(root);                      
 
     	while(queue.length!=0){         
     	     
			var current = queue.pop();

			current.getAdjacents().forEach(function(n){

				if(n.distance == 'INFINITY')
			    {
			    	n.distance = current.distance + 1;
				    n.parent = current;
				    queue.push(n); 
			    }
			});
		}  
		return graph;          
	},

    alignSinkSource : function(){
        function launch(fun){
            var nodes=d3.select("#viz").select("#D3viz").selectAll("g.node");

            var links=d3.select("#viz").select("#D3viz").selectAll("path.link.reaction");

            var lonelyNode = nodes
                .filter(function(node){
                    return links.filter(function(link){
                        return node.getId()==link.getTarget() || node.getId()==link.getSource()
                    })[0].length==1;
                });

            lonelyNode.each(function(node, i){
                links.filter(function(link){
                    return node.getId()==link.getTarget() || node.getId()==link.getSource();
                })
                    .each(function(link){

                        var coords = this.getAttribute('d').replace("M","").split(/Q|L|C/);

                        var start = coords[0].split(",");
                        var startX = parseFloat(start[0]);
                        var startY= parseFloat(start[1]);

                        var end = coords[1].split(",");
                        var endX = parseFloat(end[0]);
                        var endY= parseFloat(end[1]);

                        var refNode;
                        if(node.getId()==link.getTarget())
                            refNode=link.getSource();
                        else
                            refNode=link.getTarget();

                        if(this.classList.contains('vertical'))
                        {
                            node.x = refNode.x;
                            if(startY<endY)
                                node.y = refNode.y+40;
                            else
                                node.y = refNode.y-40;


                        }

                        if(this.classList.contains('horizontal'))
                        {
                            node.y = refNode.y
                            if(startX<endX)
                                node.x = refNode.x+40;
                            else
                                node.x = refNode.x-40;


                        }
                    });
                if(i==lonelyNode[0].length-1){
                    metExploreD3.GraphNetwork.tick('viz');
                    if(fun)
                        fun()
                }
            });

        }

        launch(function(){
            launch();
        });
    },

    highlightSink : function(panel) {
        var nodes=d3.select("#"+panel).select("#D3viz").selectAll("g.node");

        var links=d3.select("#"+panel).select("#D3viz").selectAll("path.link.reaction");

        nodes
            .filter(function(node) {
                var numberOfLinkWithoutSource = links.filter(function (link) {
                    return node.getId() == link.getSource()
                })[0].length;

                var linkWithThisNode = links.filter(function (link) {
                    return node.getId() == link.getSource() || node.getId() == link.getTarget();
                });

                var numberOfLinkWithThisNode = linkWithThisNode[0].length;

                var numberOfReversibleLink = linkWithThisNode.filter(function (link) {
                    return link.getSource().getReactionReversibility();
                })[0].length;

                return numberOfLinkWithoutSource===0 && (numberOfLinkWithThisNode===1 || numberOfReversibleLink===0);
            })
			.each(function (node) {
                metExploreD3.GraphNode.highlightANode(node.getDbIdentifier());
            });
    },

    highlightSource : function(panel) {
        var nodes=d3.select("#"+panel).select("#D3viz").selectAll("g.node");

        var links=d3.select("#"+panel).select("#D3viz").selectAll("path.link.reaction");

        nodes
            .filter(function(node){
                var numberOfLinkWithoutTarget = links.filter(function(link){
                    return node.getId()==link.getTarget()
                })[0].length;

                var linkWithThisNode = links.filter(function(link){
                    return node.getId()==link.getSource() || node.getId()==link.getTarget();
                });

                var numberOfLinkWithThisNode = linkWithThisNode[0].length;
               
                var numberOfReversibleLink = linkWithThisNode.filter(function(link){
                    return link.getTarget().getReactionReversibility();
                })[0].length;

                return numberOfLinkWithoutTarget===0 && (numberOfLinkWithThisNode===1 || numberOfReversibleLink===0);
            })
			.each(function (node) {
                metExploreD3.GraphNode.highlightANode(node.getDbIdentifier());
            });
    },

	horizontalAlign : function(panel) {
		metExploreD3.GraphNode.fixSelectedNode();
		var nodes = _metExploreViz.getSessionById(panel).getSelectedNodes();
		
		var yRef = _metExploreViz.getSessionById(panel).getD3Data().getNodeById(nodes[0]).y;
		var arrayNode = [];
		
		d3.select("#"+panel).select("#D3viz").select("#graphComponent").selectAll("g.node")
			.filter(function(node){
				return nodes.indexOf(node.getId())!=-1;
			})
			.each(function(node){
				arrayNode.push(node);
				node.py = yRef ;
				node.y = yRef ;
			});

		arrayNode.sort(function(node1, node2){
		   return d3.ascending(node1.x, node2.x);
		});

		arrayNode.forEach(function(node, i){
			if(i!=0){
				if((node.x-arrayNode[i-1].x)<30){
					node.px = arrayNode[i-1].x+30 ;
					node.x = arrayNode[i-1].x+30  ;
				}
			}
		})
    
     	metExploreD3.GraphNetwork.tick(panel);
	},

	verticalAlign : function(panel) {
		metExploreD3.GraphNode.fixSelectedNode();
		var nodes = _metExploreViz.getSessionById(panel).getSelectedNodes();
		
		var xRef = _metExploreViz.getSessionById(panel).getD3Data().getNodeById(nodes[0]).x;
		
		var arrayNode = [];
		d3.select("#"+panel).select("#D3viz").select("#graphComponent").selectAll("g.node")
			.filter(function(node){
				return nodes.indexOf(node.getId())!=-1;
			})
			.each(function(node){
				arrayNode.push(node);
				node.px = xRef ;
				node.x = xRef ;
			});
		
		arrayNode.sort(function(node1, node2){
		   return d3.ascending(node1.y, node2.y);
		});

		arrayNode.forEach(function(node, i){
			if(i!=0){
				if((node.y-arrayNode[i-1].y)<30){
					node.py = arrayNode[i-1].y+30 ;
					node.y = arrayNode[i-1].y+30  ;
				}
			}
		})
    
     	metExploreD3.GraphNetwork.tick(panel);
	},


    horizontalReverse : function(panel) {
        metExploreD3.GraphNode.fixSelectedNode();
        var nodes = _metExploreViz.getSessionById(panel).getSelectedNodes();
        var arrayNode = [];
        var max, min;
        d3.select("#"+panel).select("#D3viz").select("#graphComponent").selectAll("g.node")
            .filter(function(node){
                return nodes.indexOf(node.getId())!=-1;
            })
            .each(function(node){
                arrayNode.push(node);
                if(max===undefined || max<node.x)
                    max = node.x;
                if(min===undefined || min>node.x)
                    min = node.x;

            });

        var mediane = max - (max-min)/2;
        var xnode, dist, newx;
        arrayNode.forEach(function(node, i){
            xnode = node.x;
            dist = xnode -mediane;
            newx = mediane - dist;
            node.x = newx;
            node.px = newx;
        });

        metExploreD3.GraphNetwork.tick(panel);
    },

    verticalReverse : function(panel) {
        metExploreD3.GraphNode.fixSelectedNode();
        var nodes = _metExploreViz.getSessionById(panel).getSelectedNodes();
        var arrayNode = [];
        var max, min;
        d3.select("#"+panel).select("#D3viz").select("#graphComponent").selectAll("g.node")
            .filter(function(node){
                return nodes.indexOf(node.getId())!=-1;
            })
            .each(function(node){
                arrayNode.push(node);
                if(max===undefined || max<node.y)
                    max = node.y;
                if(min===undefined || min>node.y)
                    min = node.y;

            });

        var mediane = max - (max-min)/2;
        var ynode, dist, newy;
        arrayNode.forEach(function(node, i){
            ynode = node.y;
            dist = ynode -mediane;
            newy = mediane - dist;
            node.y = newy;
            node.py = newy;
        });

        metExploreD3.GraphNetwork.tick(panel);
    },

    colorDistanceOnNode : function(graph, func){
		var networkData = _metExploreViz.getSessionById('viz').getD3Data();
		var maxDistance = 0; 
		for (var key in graph.nodes) {	
	        var dist = graph.nodes[key].distance;   
	        if(maxDistance<dist)
	        	maxDistance=dist;    
	        networkData.getNodeById(key).distance = dist;
	    }

    	var color = d3.scale.category20();
		var color = d3.scale.linear()
			.domain([0, 4])
			.range(["blue", "yellow"]);


		d3.select("#viz").select("#D3viz").select("#graphComponent").selectAll("g.node")
			.style("fill", function(node) { return color(node.distance); });

		if(func!=undefined){
			func();
		}
    },

    test3 : function(){
		
		var networkData = _metExploreViz.getSessionById('viz').getD3Data();	
		
		d3.select("#viz").select("#D3viz").select("#graphComponent").selectAll("g.node")
			.on("click", function(node){
				
				var array = []; 
				
				_metExploreViz.getSessionById('viz').getSelectedNodes().forEach(function(anodeid){
					var theNode = networkData.getNodeById(anodeid);
					var graph = metExploreD3.GraphFunction.bfs(theNode);
					array.push(graph);
				});
				
				var finalGraph = array[0];
				for (var key in finalGraph.nodes) {	

				    var arrayVal = 
					    array
					    	.filter(function(graph){
					    		return graph.nodes[key].distance !="INFINITY";
					    	})
						    .map(function(graph){
					        	return graph.nodes[key].distance; 
					        });

			        finalGraph.nodes[key].distance = Math.min.apply(Math, arrayVal) ;   			    
			       	if(finalGraph.nodes[key].distance=="Infinity") finalGraph.nodes[key].distance=10000;
			       	
				};
				metExploreD3.GraphFunction.colorDistanceOnNode(finalGraph, setCharge);
		});
		function setCharge(){
			var color = d3.scale.linear()
				.domain([0, 1, 2, 3])
				.range([-600, -500, -400, -30]);

			metExploreD3.getGlobals().getSessionById('viz').getForce().charge(function(node){
				var value = node.distance;
				if(node.distance>3) 
					value = 3;
				var val = color(value);
				return val;
			});	
		};
    },
    testFlux : function(){
		
		var networkData = _metExploreViz.getSessionById('viz').getD3Data();	
		
			var color = d3.scale.linear()
				.domain([0, 0.1, 0.2, 0.5, 1])
				.range([-30, -50, -60,-500 -600]);

			metExploreD3.getGlobals().getSessionById('viz').getForce().charge(function(node){
				var value = d3.select('g#node'+node.getId()+'.node').attr('opacity');
				var val = color(value);
				return val;
			});	
		
    },
    test : function(){
		
		var networkData = _metExploreViz.getSessionById('viz').getD3Data();	
		
		d3.select("#viz").select("#D3viz").select("#graphComponent").selectAll("g.node")
			.on("click", function(node){
				metExploreD3.GraphFunction.colorDistanceOnNode(metExploreD3.GraphFunction.bfs(node), setCharge);
		});
		function setCharge(){
			var color = d3.scale.linear()
				.domain([0, 1, 2, 3])
				.range([-600, -500, -400, -30]);

			metExploreD3.getGlobals().getSessionById('viz').getForce().charge(function(node){
				var value = node.distance;
				if(node.distance>3) 
					value = 3;
				var val = color(value);
				return val;
			});	
		};
    },
    test2 : function(){
		
		var networkData = _metExploreViz.getSessionById('viz').getD3Data();	
		
		d3.select("#viz").select("#D3viz").select("#graphComponent").selectAll("g.node")
			.on("click", function(node){
				metExploreD3.GraphFunction.colorDistanceOnNode(metExploreD3.GraphFunction.bfs(node), setLinkDistance);
		});
		function setLinkDistance(){
			var linkStyle = metExploreD3.getLinkStyle();
			var color = d3.scale.linear()
				.domain([0, 1, 2, 3])
				.range([5*linkStyle.getSize(), 4*linkStyle.getSize(), 3*linkStyle.getSize(), linkStyle.getSize()]);
				
				// d3.layout.force().friction(0.90).gravity(0.06)
				// 	.charge(-150)

				// d3.layout.force().friction(0.90).gravity(0.08).charge(-4000).theta(0.2)
    
			var color2 = d3.scale.linear()
				.domain([0, 1, 2, 3])
				.range([-600, -500, -400, -30]);

			metExploreD3.getGlobals().getSessionById('viz').getForce()
				.linkDistance(function(link){

					var value = Math.max(link.getSource().distance, link.getTarget().distance);
					if(value>3) 
						value = 3;
					var val = color(value);
					return val;
				})
				.gravity(0.04)
				.charge(function(node){
					var value = node.distance;
					if(node.distance>3) 
						value = 3;
					var val = color2(value);
					return val;
				});
		};
    },

    /*******************************************
    * Hierarchical drawing of the current tulip network
    * It uses the default algorithm provided by Tulip.js
    */
    hierarchicalDrawing : function(){
    	var algo = "Hierarchical Tree (R-T Extended)";
		var params = [];
		params.push({"name":"node spacing", "value":50});
		metExploreD3.GraphFunction.applyTulipLayoutAlgorithmInWorker(algo, params);
    },

    /*******************************************
    * Sugiyama (OGDF) drawing of the current tulip network
    * It uses the default algorithm provided by Tulip.js
    */
    sugiyamaDrawing : function(){
    	var algo = "Sugiyama (OGDF)";
		var params = [];
		params.push({"name":"node spacing", "value":50});
		params.push({"name":"layer distance", "value":50});
		params.push({"name":"node distance", "value":25});
		metExploreD3.GraphFunction.applyTulipLayoutAlgorithmInWorker(algo, params);
    },

    /*******************************************
    * Betweenness Centrality of the current tulip network
    * It uses the default algorithm provided by Tulip.js
    */
    betweennessCentrality : function(){
    	var algo = "Betweenness Centrality";
		var params = [];
		params.push({"name":"directed", "value":true});
		// params.push({"name":"node distance", "value":50});
		// params.push({"name":"layer distance", "value":50});
		metExploreD3.GraphFunction.applyTulipDoubleAlgorithmInWorker(algo, params);
    },

    /*******************************************
    * Layout drawing application provided by the tulip.js library
    */
	applyTulipLayoutAlgorithmInWorker : function(algo, parameters) {

		var panel = "viz";
		var myMask = metExploreD3.createLoadMask("Selection in progress...", panel);
		if(myMask!= undefined){
			
			metExploreD3.showMask(myMask);

	        metExploreD3.deferFunction(function() {
				var sessions = _metExploreViz.getSessionsSet();
				
				var session = _metExploreViz.getSessionById(panel);

				var networkData = session.getD3Data();
				
				if(session!=undefined)  
				{
					if(session.isLinked())
					{
						for (var key in sessions) {
							if(sessions[key].isLinked()){
								metExploreD3.GraphNetwork.animationButtonOff(sessions[key].getId());
							}
						}
						var force = _metExploreViz.getSessionById("viz").getForce();
						force.stop();
					}
					else
					{
						metExploreD3.GraphNetwork.animationButtonOff(panel);
						var force = session.getForce();
						force.stop();
					}
				}
				var graph = null;
				var tulipView = null;

				var size = 100;
				var correspondNodeId = {};

				function processGraph() {
					tulip.holdObservers();
					var viewLayout = graph.getLayoutProperty('viewLayout');
					var viewColor = graph.getColorProperty('viewColor');
					var viewLabel = graph.getStringProperty("viewLabel");
					//   viewLayout.setAllEdgeValue(new Array());
					//   var n = graph.addNode();
					//   viewColor.setNodeValue(n, randomColor());
					//   viewLabel.setNodeValue(n, 'node ' + graph.numberOfNodes());
					//   var nodes = graph.getNodes();
					   

					 //  var i = Math.random() * graph.numberOfNodes() | 0;
					 //  var j = Math.random() * graph.numberOfNodes() | 0;

					 //  graph.addEdge(nodes[i], nodes[j]);
					tulip.unholdObservers();
					// graph.applyLayoutAlgorithm('FM^3 (OGDF)', graph.getLayoutProperty('viewLayout'));
					var params = tulip.getDefaultAlgorithmParameters(algo, graph);
					console.log(params);
					if(parameters!=undefined) {
						parameters.forEach(function(param){
							params[param.name]=param.value;
						});
					}
					graph.applyLayoutAlgorithmInWorker(algo, graph.getLocalLayoutProperty('viewLayout'), params,
				    	function(){
				    		
							d3.select("#viz").select("#D3viz").select("#graphComponent").selectAll("g.node")
					        	.each(function(node){
									node.px = viewLayout.getNodeValue(correspondNodeId[node.getId()]).x ;
									node.py = viewLayout.getNodeValue(correspondNodeId[node.getId()]).y ;
									node.x = viewLayout.getNodeValue(correspondNodeId[node.getId()]).x ;
									node.y = viewLayout.getNodeValue(correspondNodeId[node.getId()]).y ;
								});
				        
				         	metExploreD3.GraphNetwork.tick("viz");
				        	metExploreD3.hideMask(myMask);
				    	}
				    );
				}

				function initTulip(func) {

					if (typeof tulip == 'undefined' || !tulip.isLoaded()) {
						setTimeout(initTulip, 1000);
					} else {

						graph = new tulip.Graph();

						console.log("tulip.getLayoutAlgorithmPluginsList() ", tulip.getLayoutAlgorithmPluginsList());
						console.log("tulip.getAlgorithmPluginsList() ", tulip.getAlgorithmPluginsList());
						console.log("tulip.getDoubleAlgorithmPluginsList() ", tulip.getDoubleAlgorithmPluginsList());

						tulip.holdObservers();

						graph.setName("Test Javascript Graph");

						var viewLabel = graph.getStringProperty("viewLabel");
						networkData.getNodes().forEach(function(node){
							var n = graph.addNode();
							var viewLayout = graph.getLayoutProperty('viewLayout');
							viewLayout.setNodeValue(n, new tulip.Coord(node.x, node.y, 0));

							viewLabel.setNodeValue(n, "node 1");

							correspondNodeId[node.getId()] = n;
						});

						var viewLayout = graph.getLayoutProperty('viewLayout');
						networkData.getLinks().forEach(function(link){
							graph.addEdge(correspondNodeId[link.getSource()], correspondNodeId[link.getTarget()]);
						});


						var bends = new Array();
						bends.push(new tulip.Coord(0,0,0));

						viewLayout.setAllEdgeValue(bends);

						tulip.unholdObservers();
					}
					if (func!=undefined) {func()};
				}

				initTulip(processGraph);

			}, 100);
		}
	},

    /*******************************************
    * Algorithms provided by the tulip.js library
    */
	applyTulipDoubleAlgorithmInWorker : function(algo, parameters) {

		var panel = "viz";
		var myMask = metExploreD3.createLoadMask("Selection in progress...", panel);
		if(myMask!= undefined){
			
			metExploreD3.showMask(myMask);

	        metExploreD3.deferFunction(function() {
				var sessions = _metExploreViz.getSessionsSet();
				
				var session = _metExploreViz.getSessionById(panel);

				var networkData = session.getD3Data();
				
				if(session!=undefined)  
				{
					if(session.isLinked())
					{
						for (var key in sessions) {
							if(sessions[key].isLinked()){
								metExploreD3.GraphNetwork.animationButtonOff(sessions[key].getId());
							}
						}
						var force = _metExploreViz.getSessionById("viz").getForce();
						force.stop();
					}
					else
					{
						metExploreD3.GraphNetwork.animationButtonOff(panel);
						var force = session.getForce();
						force.stop();
					}
				}
				var graph = null;
				var tulipView = null;

				var size = 100;
				var correspondNodeId = {};

				function processGraph() {
					tulip.holdObservers();
					var viewLayout = graph.getLayoutProperty('viewLayout');
					var viewColor = graph.getColorProperty('viewColor');
					var viewLabel = graph.getStringProperty("viewLabel");
					var viewMetric = graph.getDoubleProperty('viewMetric');
					//   viewLayout.setAllEdgeValue(new Array());
					//   var n = graph.addNode();
					//   viewColor.setNodeValue(n, randomColor());
					//   viewLabel.setNodeValue(n, 'node ' + graph.numberOfNodes());
					//   var nodes = graph.getNodes();
					   

					 //  var i = Math.random() * graph.numberOfNodes() | 0;
					 //  var j = Math.random() * graph.numberOfNodes() | 0;

					 //  graph.addEdge(nodes[i], nodes[j]);
					tulip.unholdObservers();
					// graph.applyLayoutAlgorithm('FM^3 (OGDF)', graph.getLayoutProperty('viewLayout'));
					var params = tulip.getDefaultAlgorithmParameters(algo, graph);
					if(parameters!=undefined) {
						parameters.forEach(function(param){
							params[param.name]=param.value;
						});
					}
					console.log("params :", params);
			
					graph.applyDoubleAlgorithmInWorker(algo, graph.getDoubleProperty('viewMetric'), params,
				    	function(){

					   		var arrayVal = [];

							d3.select("#viz").select("#D3viz").select("#graphComponent").selectAll("g.node")
					        	.each(function(node){
									arrayVal.push(viewMetric.getNodeValue(correspondNodeId[node.getId()]));
								});

							var colorNode = d3.scale.linear()
								.domain([Math.min.apply(null, arrayVal), Math.max.apply(null, arrayVal)])
					    		.range(["yellow", "blue"]);

							var sizeNode = d3.scale.linear()
								.domain([Math.min.apply(null, arrayVal), Math.max.apply(null, arrayVal)])
					    		.range([1, 3]);

							d3.select("#viz").select("#D3viz").select("#graphComponent").selectAll("g.node")
					        	.style('fill', function(node){
									return colorNode(viewMetric.getNodeValue(correspondNodeId[node.getId()]));
								})
								.attr("transform", function(node){
									return "translate("+node.x+", "+node.y+") scale("+sizeNode(viewMetric.getNodeValue(correspondNodeId[node.getId()]))+")";
								}).transition().duration(2000);

					        metExploreD3.hideMask(myMask);
				        }
				    );
				}

				function initTulip(func) {

					if (typeof tulip == 'undefined' || !tulip.isLoaded()) {
						setTimeout(initTulip, 1000);
					} else {

						graph = new tulip.Graph();

						console.log("tulip.getLayoutAlgorithmPluginsList() ", tulip.getLayoutAlgorithmPluginsList());
						console.log("tulip.getAlgorithmPluginsList() ", tulip.getAlgorithmPluginsList());
						console.log("tulip.getDoubleAlgorithmPluginsList() ", tulip.getDoubleAlgorithmPluginsList());

						tulip.holdObservers();

						graph.setName("Test Javascript Graph");

						var viewLabel = graph.getStringProperty("viewLabel");
						networkData.getNodes().forEach(function(node){
							var n = graph.addNode();
							var viewLayout = graph.getLayoutProperty('viewLayout');
							viewLayout.setNodeValue(n, new tulip.Coord(node.x, node.y, 0));

							viewLabel.setNodeValue(n, "node 1");

							correspondNodeId[node.getId()] = n;
						});

						var viewLayout = graph.getLayoutProperty('viewLayout');
						networkData.getLinks().forEach(function(link){
							graph.addEdge(correspondNodeId[link.getSource()], correspondNodeId[link.getTarget()]);
						});


						var bends = new Array();
						bends.push(new tulip.Coord(0,0,0));

						viewLayout.setAllEdgeValue(bends);

						tulip.unholdObservers();
					}
					if (func!=undefined) {func()};
				}

				initTulip(processGraph);

			}, 100);
		}
	},

	drawNetwork : function() {
	},

	randomDrawing : function() {
	},

	// Force based drawing
	// Use the arbor version of the algorithm provided by
	// Cytoscape
	// If there are more than maxDisplayedLabels,then the
	// animation is not used
	stopSpringDrawing : function() {
	},
	
	/**
	 * Extract a subnetwork based on lightest path length
	 * between each pair of selected nodes it returns a graph
	 * where nodes have a subnet attribute telling wether they
	 * are in subnet or not
	 */
	extractSubNetwork : function(graph, nodeToLink) {
		var session = _metExploreViz.getSessionById('viz');
		// Should be a parameter
		var nodeSelection = [];
		// create the graph structure based on the displayed
		// network
		// This graph will contain also backward reactions

		if (session.getVizEngine() == 'D3') {
			// console.log("Subnetwork extraction using D3");
			var vis = d3.select("#viz").select("#D3viz");
			nodeSelection = nodeToLink;
						
			if (nodeSelection.length < 2){
				metExploreD3.displayMessage("Warning", "At least two nodes have to be selected or mapped.");
				return null;
			}
			else {
				// Map containing nodes,index values
				var selectedNodesIndex = {};
				for (i = 0; i < nodeSelection.length; i++) {
					selectedNodesIndex[nodeSelection[i]] = i;
				}
				// Create a matrix containing all the paths
				var paths = [];
				// for each pair of selected nodes, create an
				// entry in the path matrix
				for (i = 0; i < nodeSelection.length; i++) {
					paths[i] = [];
					for (j = 0; j < nodeSelection.length; j++)
						paths[i][j] = null;
				}

				for (var n in graph.nodes) {
					graph.nodes[n].inSubNet = false;
				}
				for (var i = 0; i < graph.edges.length; i++) {
					graph.edges[i].inSubNet = false;
				}
				// For each node in the selection
				// Compute its lightest path to other nodes
				for (var i = 0; i < nodeSelection.length; i++) {
					// var nodeI = nodeSelection[i];
					var selectedNodeID = nodeSelection[i];
					// Since while searching for a path we may
					// find another one
					// We are going to keep the path already
					// found
					var jWithPath = new Array();
					for (var j = 0; j < nodeSelection.length; j++) {
						if (j != i) {
							// if the paths is not already
							// computed
							if (paths[i][j] == null) {
								// If we go through a reaction,
								// we want to avoid going
								// through its back version
								var reactionUsed = new Array();
								// if not, do the computation
								// var nodeJ=nodeSelection[j];
								var graphNodeJ = nodeSelection[j];
								for ( var n in graph.nodes) {
									graph.nodes[n].distance = Infinity;
									graph.nodes[n].predecessor = null;
									graph.nodes[n].optimized = false;
								}

								var source = graph.nodes[selectedNodeID];
								source.distance = 0;
								/*
								 * set of unoptimized nodes,
								 * sorted by their distance (but
								 * a Fibonacci heap would be
								 * better)
								 */
								var q = new BinaryMinHeap(
										graph.nodes, "distance");
								// pointer to the node in focus
								var node;
								/*
								 * get the node with the
								 * smallest distance as long as
								 * we have unoptimized nodes.
								 * q.min() can have O(log n).
								 */
								var targetReached = false;
								while ((q.min() != undefined)
										&& (!targetReached)) {
									/* remove the latest */
									node = q.extractMin();
									node.optimized = true;
									for (e in node.edges) {
										var other = node.edges[e].target;
										if (other.optimized)
											continue;
										/*
										 * look for an
										 * alternative route
										 */
										// var alt =
										// node.distance +
										// node.edges[e].weight;
										/*
										 * Implementation of the
										 * lightest path
										 */
										/*
										 * will penalize high
										 * degree nodes
										 */
										var alt = node.distance
												+ (node.edges.length)
												* (node.edges.length);
										/*
										 * update distance and
										 * route if a better one
										 * has been found
										 */
										if ((alt < other.distance)
												&& reactionUsed.indexOf(metExploreD3.GraphFunction
																.getReactionIdWithoutBack(other.id)) == -1) {
											/*
											 * Add the reaction
											 * to the visited
											 * ones
											 */
											reactionUsed
													.push(metExploreD3.GraphFunction
															.getReactionIdWithoutBack(other.id));
											/*
											 * update distance
											 * of neighbour
											 */
											other.distance = alt;
											/*
											 * update priority
											 * queue
											 */
											q.heapify();
											/* update path */
											other.predecessor = node;
										}
										if (other.id == graphNodeJ) {
											// if the target is
											// reached then we
											// will stop
											targetReached = true;
											paths[i][j] = metExploreD3.GraphFunction
													.getPathBasedOnPredecessors(
															graph,
															graphNodeJ);
										}
										// if the node is a node
										// in the selection list
										// if there is no
										// corresponding path
										// we add the paths from
										// i to it!
										else {
											var nodeIndex = selectedNodesIndex[other.id];
											if ((nodeIndex != undefined)
													&& (paths[i][nodeIndex] == null)) {
												paths[i][nodeIndex] = metExploreD3.GraphFunction
														.getPathBasedOnPredecessors(
																graph,
																other.id);
											}
										}
									}
								}

							}
						}
					}
				}
			}
			return graph;
		}
	},


	getGraph : function() {
		var session = _metExploreViz.getSessionById( 'viz');
		var graph = new Graph();
		var vis = d3.select("#viz").select("#D3viz");

		vis.selectAll("g.node")
			.each(function(node){
				// If reaction is reversible, create the
				// back version of the node
				if(node.getBiologicalType()=="reaction" && node.getReactionReversibility())
					graph.addNode(node.getId()+"_back");
				
				// Add node in the graph
				graph.addNode(node.getId());
			});

		vis.selectAll("path.link.reaction")
			.each(function(link){
				var source = link.source;
				var target = link.target;

				var sourceId = source.getId();
				var targetId = target.getId();
			

				if(source.getBiologicalType()=="reaction" && source.getReactionReversibility())
				{
					graph.addEdge(targetId, sourceId+"_back");
				}

				if(target.getBiologicalType()=="reaction" && target.getReactionReversibility())
				{	

					graph.addEdge(targetId+"_back", sourceId);
				}
				
				graph.addEdge(sourceId, targetId);
			});

			return graph;
	},

	getGraphNotDirected : function() {
		var session = _metExploreViz.getSessionById( 'viz');
		var graph = new Graph();
		var vis = d3.select("#viz").select("#D3viz");

		vis.selectAll("g.node")
			.each(function(node){
				graph.addNode(node.getId());
			});

		vis.selectAll("path.link.reaction")
			.each(function(link){
				var source = link.source;
				var target = link.target;

				var sourceId = source.getId();
				var targetId = target.getId();
			
				graph.addEdge(sourceId, targetId);
			});

			return graph;
	},

	// Once the shortest path is computed, we have, for each
	// node on the path its predecessor
	// It is necessary to go backward in order to get the right
	// path
	getPathBasedOnPredecessors : function(graph, nodeJid) {
		var path = new Array();
		// get the path from I to J
		var predecessor = graph.nodes[nodeJid].predecessor;
		if (predecessor == null)
			return path;
		else {
			var invertedPath = new Array();
			var nodeToAdd = graph.nodes[nodeJid];
			nodeToAdd.inSubNet = true;
			while (nodeToAdd != null) {
				invertedPath.push(nodeToAdd);
				nodeToAdd.inSubNet = true;
				for (e in nodeToAdd.edges) {
					var edge = nodeToAdd.edges[e];
					if (nodeToAdd.predecessor != null) {
						if (edge.source.id == nodeToAdd.predecessor.id)
							edge.inSubNet = true;
					}
				}
				nodeToAdd = nodeToAdd.predecessor;
			}
			for (var x = invertedPath.length - 1; x >= 0; x--) {
				path.push(invertedPath[x].id);
			}
			return path;
		}
	},

	/**
	 * Hihglight nodes and edges belonging to a subnetwork
	 */
	keepOnlySubnetwork : function(nodeToLink) {
		var session = _metExploreViz.getSessionById('viz');
		//console.log("------keep only sub-network------"
		// )

		var force = session.getForce();
		var networkData = session.getD3Data();
		
		var graphSession = metExploreD3.GraphFunction.getGraph();

		var vis = d3.select("#"+'viz').select("#D3viz");

		if(session!=undefined)
		{
			// We stop the previous animation
			var force = session.getForce();
			if(force!=undefined)
			{
				if(metExploreD3.GraphNetwork.isAnimated('viz')== "true")
					force.stop();

			}
		}

		if(graphSession.edges.length>15000)
		{
			Ext.Msg.show({
				title:'Are you sure?',
				msg: 'Keep only subnetwork on big network (>15000 links) may take several minutes. <br />Would you like to do this?',
				buttons: Ext.Msg.OKCANCEL,
				fn: function(btn){
					if(btn=="ok")
					{
						extract();
					}
				},
				icon: Ext.Msg.QUESTION
			});
		}
		else extract();

		function extract(){
			var myMask = metExploreD3.createLoadMask("Keep only subnetwork...", 'viz');
			if(myMask!= undefined){

				metExploreD3.showMask(myMask);
				metExploreD3.deferFunction(function() {
					var graph = metExploreD3.GraphFunction.extractSubNetwork(graphSession, nodeToLink);
					console.log("graph after extraction ",graph);
					if(graph!=null)
					{
						var subEmpty = true;
						for ( var i in nodeToLink) {
							var nodeID = nodeToLink[i];
							if (graph.nodes[nodeID].inSubNet)
								subEmpty = false;
						}

						if (subEmpty)
							metExploreD3.displayMessage("Warning", "There is no path between the selected nodes !!");
						else {
							var vis = d3.select("#viz").select("#D3viz");

							vis.selectAll("g.node")
								.filter(function(d) {
									if( d.getBiologicalType() == 'metabolite' )
									{
										var id = d.getId();
										return !graph.nodes[id].inSubNet ;

									}
									else
									{
										if(d.getBiologicalType() == 'reaction')
										{
											var id = d.getId();
											var backID = d.getId() + "_back";
											if (graph.nodes[backID] == undefined)
												return !graph.nodes[id].inSubNet
											else
												return !(graph.nodes[id].inSubNet || graph.nodes[backID].inSubNet)
										}
									}
								})
								.each(function(node){
									metExploreD3.GraphNetwork.removeANode(node,"viz");
								});
						}
					}
					if(session!=undefined)
					{
						if(force!=undefined)
						{
							if(metExploreD3.GraphNetwork.isAnimated("viz")== "true")
								force.start();
						}
					}
					metExploreD3.hideMask(myMask);
				}, 10);
			}
	    }
	},

	/**
	 * Hihglight nodes and edges belonging to a subnetwork
	 */
	highlightSubnetwork : function(nodeToLink) {
		var session = _metExploreViz.getSessionById('viz');
		var myMask = metExploreD3.createLoadMask("Highlight Subnetwork...", 'viz');
		if(myMask!= undefined){

			metExploreD3.showMask(myMask);
			metExploreD3.deferFunction(function() {			         
				
		        
	        	var vis = d3.select("#"+'viz').select("#D3viz");
				
				if(session!=undefined) 
				{
					// We stop the previous animation
					var force = session.getForce();
					if(force!=undefined)  
					{
						if(metExploreD3.GraphNetwork.isAnimated('viz')== "true")
							force.stop();
												
					}
				}
		
				var graphSession = metExploreD3.GraphFunction.getGraph();

				var graph = metExploreD3.GraphFunction.extractSubNetwork(graphSession, nodeToLink);
				
				console.log("graph after extraction in highlight subnetwork ",graph);
				if(graph!=null)
				{
					var subEmpty = true;
					for ( var i in nodeToLink) {
						var nodeID = nodeToLink[i];
						if (graph.nodes[nodeID].inSubNet)
							subEmpty = false;
					}

					if (subEmpty)
						metExploreD3.displayMessage("Warning", "There is no path between the selected nodes !!");
					else {
						var vis = d3.select("#viz").select("#D3viz");
						// If the metabolite is in the subnetwork then
						// opacity is set to 1 and color to red
						vis.selectAll("g.node").filter(function(d) {
							return d.getBiologicalType() == 'metabolite'
						}).filter(function(d) {
							var id = d.getId();
							return graph.nodes[id].inSubNet
						}).selectAll(".metabolite").transition().duration(4000)
								.style("opacity", 1);// .style("stroke-width","2");

						// If the metabolite is NOT in the subnetwork then
						// opacity is set to 0.5 and color to black
						vis.selectAll("g.node").filter(function(d) {
							return d.getBiologicalType() == 'metabolite'
						}).filter(function(d) {
							var id = d.getId();
							return !graph.nodes[id].inSubNet
						}).selectAll(".metabolite").transition().duration(4000)
								.style("stroke", "gray").style("opacity",
										0.25);// .style("stroke-width","2");

						// If the metabolite is in the subnetwork then
						// opacity is set to 1 and color to red
						vis.selectAll("g.node").filter(function(d) {
							return d.getBiologicalType() == 'metabolite'
						}).filter(function(d) {
							var id = d.getId();
							return graph.nodes[id].inSubNet
						}).selectAll("text").transition().duration(4000)
								.style("opacity", 1);// .style("stroke-width","2");

						// If the metabolite is NOT in the subnetwork then
						// opacity is set to 0.5 and color to black
						vis.selectAll("g.node").filter(function(d) {
							return d.getBiologicalType() == 'metabolite'
						}).filter(function(d) {
							var id = d.getId();
							return !graph.nodes[id].inSubNet
						}).selectAll("text").transition().duration(4000)
								.style("opacity", 0.25);// .style("stroke-width","2");

						// vis.selectAll("g.node").filter(function(d) {var
						// id=d.getId(); return !graph.nodes[id].inSubNet})
						// .transition().duration(4000).style("opacity",0.5);//.style("stroke-width","2");

						vis
								.selectAll("g.node")
								.filter(function(d) {
									return d.getBiologicalType() == 'reaction'
								})
								.filter(
										function(d) {
											var id = d.getId();
											var backID = d.getId() + "_back";
											if (graph.nodes[backID] == undefined)
												return graph.nodes[id].inSubNet;
											else
												return (graph.nodes[id].inSubNet || graph.nodes[backID].inSubNet)
										}).selectAll(".reaction").transition()
								.duration(4000)
								.style("opacity", 1);// .style("stroke-width","2");

						vis
								.selectAll("g.node")
								.filter(function(d) {
									return d.getBiologicalType() == 'reaction'
								})
								.filter(
										function(d) {
											var id = d.getId();
											var backID = d.getId() + "_back";
											if (graph.nodes[backID] == undefined)
												return !graph.nodes[id].inSubNet;
											else
												return !(graph.nodes[id].inSubNet || graph.nodes[backID].inSubNet)
										}).selectAll('.reaction').transition()
								.duration(4000).style("stroke", "gray")
								.style("opacity", 0.25);// .style("stroke-width","2");

						vis
								.selectAll("g.node")
								.filter(function(d) {
									return d.getBiologicalType() == 'reaction'
								})
								.filter(
										function(d) {
											var id = d.getId();
											var backID = d.getId() + "_back";
											if (graph.nodes[backID] == undefined)
												return graph.nodes[id].inSubNet;
											else
												return (graph.nodes[id].inSubNet || graph.nodes[backID].inSubNet)
										}).selectAll("text").transition()
								.duration(4000).style("opacity", 1);// .style("stroke-width","2");

						vis
								.selectAll("g.node")
								.filter(function(d) {
									return d.getBiologicalType() == 'reaction'
								})
								.filter(
										function(d) {
											var id = d.getId();
											var backID = d.getId() + "_back";
											if (graph.nodes[backID] == undefined)
												return !graph.nodes[id].inSubNet;
											else
												return !(graph.nodes[id].inSubNet || graph.nodes[backID].inSubNet)
										}).selectAll("text").transition()
								.duration(4000).style("opacity", 0.25);// .style("stroke-width","2");

						vis
								.selectAll("path.link.reaction")
								.filter(
										function(d) {
											var source = d.source.getId();
											var target = d.target.getId();
											if (d.source.getBiologicalType() == 'reaction') {
												var back = source + "_back";
												if (graph.nodes[back] == undefined)
													return (graph.nodes[source].inSubNet && graph.nodes[target].inSubNet)
												else
													return (graph.nodes[source].inSubNet && graph.nodes[target].inSubNet)
															|| (graph.nodes[back].inSubNet && graph.nodes[target].inSubNet)
											} else {
												var back = target + "_back";
												if (graph.nodes[back] == undefined)
													return (graph.nodes[source].inSubNet && graph.nodes[target].inSubNet)
												else
													return (graph.nodes[source].inSubNet && graph.nodes[target].inSubNet)
															|| (graph.nodes[source].inSubNet && graph.nodes[back].inSubNet)
											}

										})

								.transition().duration(4000)
								.style("opacity", 1);// .style("stroke-width","2");

						vis
								.selectAll("path.link.reaction")
								.filter(
										function(d) {
											var source = d.source.getId();
											var target = d.target.getId();
											if (d.source.getBiologicalType() == 'reaction') {
												var back = source + "_back";
												if (graph.nodes[back] == undefined)
													return !(graph.nodes[source].inSubNet && graph.nodes[target].inSubNet)
												else
													return !(graph.nodes[source].inSubNet && graph.nodes[target].inSubNet)
															&& !(graph.nodes[back].inSubNet && graph.nodes[target].inSubNet)
											} else {
												var back = target + "_back";
												if (graph.nodes[back] == undefined)
													return !(graph.nodes[source].inSubNet && graph.nodes[target].inSubNet)
												else
													return !(graph.nodes[source].inSubNet && graph.nodes[target].inSubNet)
															&& !(graph.nodes[source].inSubNet && graph.nodes[back].inSubNet)
											}

										}).transition().duration(4000)
								.style("stroke", "gray").style("opacity",
										0.25);// .remove();//.style("stroke-width","2");
					}
				}
				if(session!=undefined)  
				{
					if(force!=undefined)  
					{		
						if(metExploreD3.GraphNetwork.isAnimated("viz")== "true")
							force.start();
					}	
				}
		    	metExploreD3.hideMask(myMask);
	    	}, 10);
		}
	},

	/** ******************************************* */
	/** *************************************** */
	// BINDING BETWEEN CYTOSCAPE AND GRAPH
	/** *************************************** */
	/** ******************************************* */
	// Tell if a node is the back version of a reaction
	isBackReaction : function(id) {
		if (id.indexOf("_back") != -1)
			return true;
		else
			return false;
	},
	// Based on the reaction id
	// return the reaction id without the _back mention
	getReactionIdWithoutBack : function(id) {
		// if it is a back version,
		if (metExploreD3.GraphFunction.isBackReaction(id))
			id = id.replace("_back", "");
		return id;
	},

	/** ******************************************************************************* */
	/** *************************************************************************** */
	// GRAPH STRUCTURE AND ALGORITHMS ---- SHOULD BE ADDED TO
	// THE GRAPH LIBRARY !
	/** *************************************************************************** */
	/** ******************************************************************************* */

	/***********************************************************
	 * / In order to speed up the computation a graph structure
	 * is used. / A graph is created corresponding to the
	 * metabolic network as displayed in Cytoscape / Algorithms
	 * are applied to this graph and then results are displayed
	 * in Cytoscape window
	 *  / For the graph objects we develop a set of graph
	 * algorithms: / - Get one of the minimal Feedback arc sets / -
	 * Get strongly connected components / - Get leaf nodes in a
	 * graph / - Test if the graph is acyclic or not
	 * /**********************
	 */
	// Returns the inDegree in the graph structure
	nodeInDegree : function(node) {
		var inDegree = 0;
		for (e in node.edges) {
			var other = node.edges[e].source;
			if (other.id != node.id)
				inDegree++;
		}
		return inDegree;
	},

	// Returns the outDegree in the graph structure
	nodeOutDegree : function(node) {

		var outDegree = 0;
		for (e in node.edges) {
			var other = node.edges[e].source;
			if (other.id == node.id)
				outDegree++;
		}
		return outDegree;
	},
	
	/** ********Get Leaf nodes in a graph*********** */
	getLeafs : function(graph) {
		var leafs = new Array();
		for ( var n in graph.nodes) {
			var node = graph.nodes[n];
			// "+this.nodeOutDegree(node));
			if (metExploreD3.GraphFunction.nodeOutDegree(node) == 0)
				leafs.push(node);
		}
		return leafs;
	},

	/** ********Test if the graph is acyclic or not*********** */
	// To test a graph for being acyclic:
	// 1. If the graph has no nodes, stop. The graph is acyclic.
	// 2. If the graph has no leaf, stop. The graph is cyclic.
	// 3. Choose a leaf of the graph. Remove this leaf and all
	// arcs going into the leaf to get a new graph.
	// 4. Go to 1.
	isAcyclic : function(originalGraph) {
		// Create a copy of the graph since we are going to
		// modify the structure by removing nodes
		var graph = new Graph();
		for ( var e in originalGraph.edges) {
			var edge = originalGraph.edges[e];
			graph.addEdge(edge.source.id, edge.target.id);
		}
		var leafs = metExploreD3.GraphFunction.getLeafs(graph);
		while (leafs.length != 0
				&& Object.keys(graph.nodes).length != 0) {
			var node = leafs.pop();
			graph.removeNode(node);
			leafs = metExploreD3.GraphFunction.getLeafs(graph);
		}
		if (Object.keys(graph.nodes).length == 0)
			return true;
		if (leafs.length == 0)
			return false;
	},
	
	/** ********Get one of the Minimal FAS*********** */
	// A set of edges whose removal makes the digraph acyclic is
	// commonly known as a feedback arc set (FAS)
	// The following algorithm returns T wich is a minimal FAS
	// S={}
	// Sg =new graph
	// T={}
	// for all edges e in the graph
	// add e to Sg
	// if Sg acyclic
	// add e to S
	// else
	// remove e from Sg
	// add e to T
	// return T
	getMinimalFAS : function(graph) {
		var S = new Array();
		var Sg = new Graph();
		var T = new Array();
		for (e in graph.edges) {
			var edge = graph.edges[e];
			Sg.addEdge(edge.source.id, edge.target.id);
			if (metExploreD3.GraphFunction.isAcyclic(Sg))
				S.push(edge);
			else {
				Sg.removeEdge(edge);
				T.push(edge);
			}
		}
		return T;
	},

	/*
		/** ********Get strongly connected components*********** */

		// Tarjan algorithm to detect all strongly connected
		// components in a graph.
		// The method will return an array of arrays containing all
		// the strongly connected component nodes.
		// algorithm tarjan is
		// input: graph G = (V, E)
		// output: set of strongly connected components (sets of
		// vertices)
		// index := 0
		// S := empty
		// for each v in V do
		// if (v.index is undefined) then
		// strongconnect(v)
		// end if
		// end for
		// function strongconnect(v)
		// // Set the depth index for v to the smallest unused index
		// v.index := index
		// v.lowlink := index
		// index := index + 1
		// S.push(v)
		// // Consider successors of v
		// for each (v, w) in E do
		// if (w.index is undefined) then
		// // Successor w has not yet been visited; recurse on it
		// strongconnect(w)
		// v.lowlink := min(v.lowlink, w.lowlink)
		// else if (w is in S) then
		// // Successor w is in stack S and hence in the current SCC
		// v.lowlink := min(v.lowlink, w.index)
		// end if
		// end for
		//     // If v is a root node, pop the stack and generate an SCC
		//     if (v.lowlink = v.index) then
		//       start a new strongly connected component
		//       repeat
		//         w := S.pop()
		//         add w to current strongly connected component
		//       until (w = v)
		//       output the current strongly connected component
		//     end if
		//   end function

	getStronglyConnectedComponents : function(graph) {
		if (graph == null)
			graph = this.createGraph(false);
		var S = new Array();
		var index = 0;
		var scc = new Array();
		for (n in graph.nodes) {
			var v = graph.nodes[n];
			v.index = undefined;
			v.lowlink = Number.MAX_VALUE;
		}
		for (n in graph.nodes) {
			var v = graph.nodes[n];
			if (v.index == undefined)
				metExploreD3.GraphFunction.strongconnect(v, graph, index, S, scc);
		}
		return scc;
	},

	strongconnect : function(v, graph, index, S, scc) {
		v.index = index;
		v.lowlink = index;
		index = index + 1;
		S.push(v);
		for (e in v.edges) {
			var w = v.edges[e].target;
			if (w.id != v.id) {
				if (w.index == undefined) {
					metExploreD3.GraphFunction.strongconnect(w, graph, index, S, scc);
					v.lowlink = Math.min(v.lowlink, w.lowlink);
				} else {
					if (S.indexOf(w) != undefined) {
						v.lowlink = Math.min(v.lowlink,
								w.lowlink);
					}
				}
			}
		}
		if (v.lowlink == v.index) {
			var comp = new Array();
			var w = S.pop();
			while (w.id != v.id) {
				comp.push(w);
				var w = S.pop();
			}
			comp.push(w);
			scc.push(comp);
		}
	},

	//IN PROGRESS !
	//Function to extract FAS with selected compounds as input and outputs
	getMinimalFASstory : function(graph, selectedNodesID) {
		//console.log("Graph is acyclic "+this.isAcyclic(graph));
		var S = new Array();
		var Sg = new Graph();
		var T = new Array();
		//Order the edge that can be removed
		//Edge connecting higly connected nodes first
		var maxValue = graph.edges.length;
		for (e in graph.edges) {
			var edge = graph.edges[e];
			var weight = 0;
			if (selectedNodesID.length > 0) {
				if (selectedNodesID.indexOf(edge.source.id) == -1)
					weight = weight + maxValue;
				if (selectedNodesID.indexOf(edge.target.id) == -1)
					weight = weight + maxValue;
			}
			weight = weight
					- Math.max(edge.source.edges.length, weight
							+ edge.target.edges.length);
			// weight=weight+edge.target.edges.length;
			edge.weight = weight;
		}

		graph.edges.sort(function(obj1, obj2) {
			return obj1.weight - obj2.weight;
		});

		for (e in graph.edges) {
			var edge = graph.edges[e];
			Sg.addEdge(edge.source.id, edge.target.id);
			if (metExploreD3.GraphFunction.isAcyclic(Sg))
				S.push(edge);
			else {
				Sg.removeEdge(edge);
				T.push(edge);
			}
		}
		return T;
	},

	/**
	 * SUBNETWORK EXTRACTION Path-finding algorithm Dijkstra
	 * modified to provide a shortest path impelementation
	 * worst-case running time is O((|E| + |V|) · log |V| ) thus
	 * better than Bellman-Ford for sparse graphs (with less
	 * edges), but cannot handle negative edge weights
	 * 
	 * Based on Dracula graph library Various algorithms and
	 * data structures, licensed under the MIT-license. (c) 2010
	 * by Johann Philipp Strathausen <strathausen@gmail.com>
	 * http://strathausen.eu
	 */
	/*
		// subnetwork: function(){
		// var graph=this.extractSubNetwork();
		// var session=this.getNetworkVizSession();
		// console.log("Graph computation done");
		// var subEmpty=true;
		// for(var i in
		// this.getNetworkVizSession().getSelectedNodes()){
		// var
		// nodeID=this.getNetworkVizSession().getSelectedNodes()[i];
		// if (graph.nodes[nodeID].inSubNet)
		// subEmpty=false;
		// }
		// if(subEmpty)
		// Ext.Msg.alert("Warning","There is no path between the
		// selected nodes !!");
		// else
		// {
		// var vis = d3.select("body").select("#D3viz");
		// vis.selectAll("g.node").filter(function(d) {return
		// d.getBiologicalType() =='metabolite' }).filter(function(d)
		// {var id=d.getId(); return graph.nodes[id].inSubNet})
		// .selectAll("circle")
		// .transition().duration(4000).style("stroke","red").style("stroke-width","2");
		// vis.selectAll("g.node").filter(function(d) {return
		// d.getBiologicalType() =='reaction' })
		// .filter(function(d) {
		// var id=d.getId();
		// var backID=d.getId()+"_back";
		// if (graph.nodes[backID]==undefined)
		// return graph.nodes[id].inSubNet;
		// else
		// return
		// (graph.nodes[id].inSubNet||graph.nodes[backID].inSubNet)})
		// .selectAll("rect")
		// .transition().duration(4000).style("stroke","red").style("stroke-width","2");
		// vis.selectAll("path.link.reaction")
		// .filter(function(d){
		// var source=d.source.getId();
		// var target=d.target.getId();
		// console.log(d.source.getId());
		// if(d.source.getBiologicalType() =='reaction')
		// {
		// var back=source+"_back";
		// if(graph.nodes[back]==undefined)//The source is a
		// reaction and is not reversible then look for
		// source-target
		// return
		// (graph.nodes[source].inSubNet&&graph.nodes[target].inSubNet)
		// else//the source is reversible then look for source
		// target and source_back target
		// {
		// console.log("---"+graph.nodes[source].inSubNet&&graph.nodes[target].inSubNet)||(graph.nodes[back].inSubNet&&graph.nodes[target].inSubNet)
		// return
		// (graph.nodes[source].inSubNet&&graph.nodes[target].inSubNet)||(graph.nodes[back].inSubNet&&graph.nodes[target].inSubNet)
		// }
		// }
		// else
		// {
		// var back=target+"_back";
		// if(graph.nodes[back]==undefined)//The target is a
		// reaction and is not reversible
		// return
		// (graph.nodes[source].inSubNet&&graph.nodes[target].inSubNet)
		// else
		// {
		// console.log("---"+graph.nodes[source].inSubNet&&graph.nodes[target].inSubNet)||(graph.nodes[source].inSubNet&&graph.nodes[back].inSubNet);
		// return
		// (graph.nodes[source].inSubNet&&graph.nodes[target].inSubNet)||(graph.nodes[source].inSubNet&&graph.nodes[back].inSubNet)
		// }
		// }
		// })
		// .transition().duration(4000).style("stroke","red").style("stroke-width","2");
		// }
		// },
	*/

    /*******************************************
     * Find all the metabolic cycles in the graph passing through some nodes that is shown in the visualisation panel
     * @param {Object[]} listNodes : List of nodes. Only the cycles passing through all the nodes in the list will be found.
     */
    findAllCycles: function (listNodes) {
        listNodes = (typeof listNodes !== 'undefined') ? listNodes : [];
        // Create a new data structure for the graph to efficiently run the Johnson algorithm
        var vertices = [];
        var edges = [];
        var graph = [];
        var flag = "All";

        d3.select("#viz").select("#D3viz").select("#graphComponent").selectAll("g.node")
            .filter(function (d) {
                return (d.isSideCompound !== true);
            })
            .each(function (d) {
                vertices.push(d.getDbIdentifier());
            });
        // If a list of nodes has been passed as an argument, we set on of these nodes as the first nodes of the list of vertices
        if (listNodes.length >= 1){
            vertices[vertices.indexOf(listNodes[0].getDbIdentifier())] = vertices[0];
            vertices[0] = listNodes[0].getDbIdentifier();
            flag = "Single";
        }
        // Side compounds are not included in the new graph structures
        // From each edges exiting or entering from a reversible reaction, a new edge between the same vertices but going into the opposite direction is created
        d3.select("#viz").select("#D3viz").select("#graphComponent").selectAll("path.link.reaction")
            .style("stroke", "black")
            .style("stroke-width", "0.5")
            .filter(function (d) {
                return (d.getSource().isSideCompound !== true && d.getTarget().isSideCompound !== true)
            })
            .each(function (d) {
                var reactionNode = (d.getSource().biologicalType === "reaction") ? d.getSource() : d.getTarget();
                var edge = [];
                edge.push(d.getSource().getDbIdentifier());
                edge.push(d.getTarget().getDbIdentifier());
                edges.push(edge);
                if (reactionNode.reactionReversibility === true){
                    var backEdge = [];
                    backEdge.push(d.getTarget().getDbIdentifier());
                    backEdge.push(d.getSource().getDbIdentifier());
                    edges.push(backEdge);
                }
            });

        // Create the graph structure for the cycle enumeration algorithm, such as each vertex is represented by an arbitrary number
        // Also create data structure to get the vertex id back from the number given to each vertex, and vice versa
        var indexToVertices = {};
        var verticesToIndex = {};
        for (var i=0; i<vertices.length; i++){
            indexToVertices[i] = vertices[i];
        }
        for (var key in indexToVertices){
            verticesToIndex[indexToVertices[key]] = Number(key);
        }
        for (var i=0; i<vertices.length; i++){
            graph.push([]);
        }
        for (var i=0; i<edges.length; i++) {
            var index = verticesToIndex[edges[i][0]];
            var value = verticesToIndex[edges[i][1]];
            graph[index].push(value);
        }

        // The cycle enumeration algorithm itself
        var result = metExploreD3.GraphFunction.JohnsonAlgorithm(graph, flag);

        // From the cycles as array of arbitrary number, get back the cycles as array of vertex id
        var cycleList = [];
        for (var i=0; i<result.length; i++){
            var cycle = [];
            for (var j=0; j<result[i].length; j++){
                cycle.push(indexToVertices[result[i][j]]);
            }
            cycleList.push(cycle)
        }

        // Keep only the cycles containing all the input nodes
        var listSelectedNodesCycles = [];
        for (var i=0; i<cycleList.length; i++){
            var f = true;
            for (var j=0; j<listNodes.length; j++){
                if (!(cycleList[i].includes(listNodes[j].getDbIdentifier()))){
                    f = false;
                }
            }
            if (f) {
                listSelectedNodesCycles.push(cycleList[i]);
            }
        }

        var validCyclesList = metExploreD3.GraphFunction.removeInvalidCycles(listSelectedNodesCycles);

        // Remove duplicated cycles (cycles)
        var removedDuplicateCycle = [];
        for (var i=0; i<validCyclesList.length; i++){
            if (removedDuplicateCycle.length === 0){
                removedDuplicateCycle.push(validCyclesList[i]);
            }
            else {
                var copy = validCyclesList[i].slice();
                var inverted = copy.concat(copy.splice(0,1)).reverse();
                var len = removedDuplicateCycle.length;
                var bool1 = false;
                for (var j = 0; j < len; j++) {
                    if (removedDuplicateCycle[j].length === inverted.length) {
                        var bool2 = true;
                        for (var k=0; k<removedDuplicateCycle[j].length; k++){
                            if (removedDuplicateCycle[j][k] !== inverted[k]) {
                                bool2 = false;
                            }
                        }
                        if (bool2){
                            bool1 = true;
                        }
                    }
                }
                if (!bool1){
                    removedDuplicateCycle.push(validCyclesList[i]);
                }
            }
        }

        return removedDuplicateCycle;
    },

    /*******************************************
     * Find all the longest metabolic cycles in the graph passing through some nodes that is shown in the visualisation panel
     * @param {Object[]} listNodes : List of nodes. Only the cycles passing through all the nodes in the list will be found.
     */
    findLongestCycles: function (listNodes) {
        listNodes = (typeof listNodes !== 'undefined') ? listNodes : [];
        var allCycles = metExploreD3.GraphFunction.findAllCycles(listNodes);
        // Find the longest valid metabolic cycles by calling the function on the array of the longest cycles,
        // then, if no valid cycles have been found call the function on the array of the second longest cycles and so on
        var longestCycles = [];
        var max = 0;
        for (var i=0; i<allCycles.length; i++){
            if (allCycles[i].length > max){
                max = allCycles[i].length;
                longestCycles = [];
                longestCycles.push(allCycles[i]);
            }
            else if (allCycles[i].length === max){
                longestCycles.push(allCycles[i]);
            }
        }
        return longestCycles;
    },

    /*******************************************
     * Find all the shortest metabolic cycles in the graph passing through some nodes that is shown in the visualisation panel
     * @param {Object[]} listNodes : List of nodes. Only the cycles passing through all the nodes in the list will be found.
     */
    findShortestCycles: function (listNodes) {
        listNodes = (typeof listNodes !== 'undefined') ? listNodes : [];
        var allCycles = metExploreD3.GraphFunction.findAllCycles(listNodes);
        // Find the longest valid metabolic cycles by calling the function on the array of the longest cycles,
        // then, if no valid cycles have been found call the function on the array of the second longest cycles and so on
        var shortestCycles = [];
        var min = (allCycles[0]) ? allCycles[0].length : 0;
        for (var i=0; i<allCycles.length; i++){
            if (allCycles[i].length < min){
                min = allCycles[i].length;
                shortestCycles = [];
                shortestCycles.push(allCycles[i]);
            }
            else if (allCycles[i].length === min){
                shortestCycles.push(allCycles[i]);
            }
        }
        return shortestCycles;
    },

    /*******************************************
     * From a list of cycle, remove all the cycles that are not valid metabolic cycle (i.e. some case where an edge go from a product of a reaction to this reaction, followed by another edge going to another product of the same reaction)
     * @param {String[][]} cyclesList : List of cycles. A cycle is define as a list of nodes id.
     */
    removeInvalidCycles : function (cyclesList) {
        // New data structure to efficiently get back the edges from vertex id
        var verticesPairsToLinks = {};
        d3.select("#viz").select("#D3viz").select("#graphComponent").selectAll("path.link.reaction")
            .filter(function (d) {
                return (d.getSource().isSideCompound !== true && d.getTarget().isSideCompound !== true)
            })
            .each(function (d) {
                var reactionNode = (d.getSource().biologicalType === "reaction") ? d.getSource() : d.getTarget();
                var sourceId = d.getSource().getDbIdentifier();
                var targetId = d.getTarget().getDbIdentifier();
                if (!verticesPairsToLinks[sourceId]){
                    verticesPairsToLinks[sourceId] = {};
                }
                verticesPairsToLinks[sourceId][targetId] = d;
                if (reactionNode.reactionReversibility === true){
                    if (!verticesPairsToLinks[targetId]){
                        verticesPairsToLinks[targetId] = {};
                    }
                    verticesPairsToLinks[targetId][sourceId] = d;
                }
            });

        // Get the links that are part of the cycle from the vertex id
        var cyclesLinksList = [];
        for (var i=0; i<cyclesList.length; i++){
            var cycleLinks = [];
            for (var j=0; j<cyclesList[i].length; j++) {
                var newJ = (j + 1 < cyclesList[i].length) ? j + 1 : 0;
                var currentVertex = cyclesList[i][j];
                var nextVertex = cyclesList[i][newJ];
                var link = "";
                if (verticesPairsToLinks[currentVertex][nextVertex]){
                    link = verticesPairsToLinks[currentVertex][nextVertex];
                }
                else if (verticesPairsToLinks[nextVertex][currentVertex]){
                    link = verticesPairsToLinks[nextVertex][currentVertex];
                }
                cycleLinks.push(link);
            }
            cyclesLinksList.push(cycleLinks);
        }

        var listValidCycles = [];
        for (var i=0; i<cyclesList.length; i++) {
            // Get all the cycle edges from the output of the cycle finding algorithm
            var cycle = cyclesList[i];
            var cycleLinks = cyclesLinksList[i];

            // Check if each cycle found is a valid metabolite cycle
            // (if a reversible reaction that produce 2 metabolites, a cycle might have been found that has a segment that
            // goes from the 1st metabolite to the reaction to the second metabolite, even though it is not a valid metabolic cycle)
            var valid = true;
            for (var j = 0; j < cycle.length; j++) {
                var lastJ = (j - 1 >= 0) ? j - 1 : cycle.length - 1;
                if (cycleLinks[j].getSource().getDbIdentifier() === cycle[j]) {
                    //Edge in cycle direction
                    if (cycleLinks[j].getSource().biologicalType === "reaction" && cycleLinks[lastJ].getSource().biologicalType === "reaction"){
                        valid = false;
                    }
                }
                else if (cycleLinks[j].getTarget().getDbIdentifier() === cycle[j]){
                    //Edge in inverse cycle direction
                    if (cycleLinks[j].getTarget().biologicalType === "reaction" && cycleLinks[lastJ].getTarget().biologicalType === "reaction") {
                        valid = false;
                    }
                }
            }

            if (valid === true) {
                listValidCycles.push(cycle);
            }
        }
        return listValidCycles;

    },

    /*******************************************
     * Highlight the edges of a cycle in blue on the visualisation
     * @param {String[][]} cycle : The cycle to highlight. A cycle is defined as a list of nodes id.
     */
    highlightCycle: function (cycle) {
        d3.select("#viz").select("#D3viz").select("#graphComponent")
            .selectAll("path.link.reaction")
            .style("stroke", "black")
            .style("stroke-width", "0.5");
        var cycleLinks = metExploreD3.GraphFunction.getLinksFromCycle(cycle);
        var nodesCycle = [];
        for (var i = 0; i < cycleLinks.length; i++) {
            nodesCycle.push(cycleLinks[i].source);
            nodesCycle.push(cycleLinks[i].target);
        }
        d3.select("#viz").select("#D3viz").select("#graphComponent").selectAll("path.link.reaction")
            .filter(function (d) {
                return (cycleLinks.includes(d));
            }).style("stroke", "blue")
            .style("stroke-width", "1.5");
        d3.select("#viz").select("#D3viz").select("#graphComponent").selectAll("g.node")
            .filter(function (d) {
                return (nodesCycle.includes(d));
            });
    },

    /*******************************************
     * Remove highlight of the edges of a cycle on the visualisation
     * @param {String[][]} cycle : The cycle on which to remove the highlight. A cycle is defined as a list of nodes id.
     */
    removeHighlightCycle: function (cycle) {
        var cycleLinks = metExploreD3.GraphFunction.getLinksFromCycle(cycle);
        var nodesCycle = [];
        for (var i=0; i<cycleLinks.length; i++){
            nodesCycle.push(cycleLinks[i].source);
            nodesCycle.push(cycleLinks[i].target);
        }
        d3.select("#viz").select("#D3viz").select("#graphComponent").selectAll("path.link.reaction")
            .filter(function (d) {
                return (cycleLinks.includes(d));
            }).style("stroke", "black")
            .style("stroke-width", "0.5");
        d3.select("#viz").select("#D3viz").select("#graphComponent").selectAll("g.node")
            .filter(function (d) {
                return (nodesCycle.includes(d));
            });
    },

    /*******************************************
     * Get all the links in a cycle defined by his node
     * @param {String[][]} cycle : The cycle from which to get the links. A cycle is defined as a list of nodes id.
     */
    getLinksFromCycle : function(cycle) {
        var cycleLinks = [];
        var links = d3.select("#viz").select("#D3viz").select("#graphComponent").selectAll("path.link.reaction");
        var tmpList = [];
        for (var i=0; i<cycle.length; i++){
            tmpList.push([]);
        }
        links.each(function (d) {
            var sourceIndex = cycle.indexOf(d.getSource().getDbIdentifier());
            if (sourceIndex !== -1){
                var targetIndex = cycle.indexOf(d.getTarget().getDbIdentifier());
                if (targetIndex !== -1) {
                    tmpList[sourceIndex].push(d);
                    tmpList[targetIndex].push(d);
                }
            }
        });
        for (var i = 0; i < cycle.length; i++) {
            var newI = (i + 1 < cycle.length) ? i + 1 : 0;
            var currentVertex = cycle[i];
            var nextVertex = cycle[newI];
            for (var j=0; j<tmpList[i].length; j++){
                var link = tmpList[i][j];
                var sourceId = link.getSource().getDbIdentifier();
                var targetId = link.getTarget().getDbIdentifier();
                if (sourceId === currentVertex && targetId === nextVertex) {
                    cycleLinks.push(link);
                }
                else if (targetId === currentVertex && sourceId === nextVertex) {
                    cycleLinks.push(link);
                }
            }
        }
        return cycleLinks;
    },

    /*******************************************
     * Johnson's cycle enumeration algorithm
     * @param {Number[][]} graph : An array of arrays of integer that is the graph structure in which to find the cycle. Each of the N nodes are defined by a number from 0 to N-1. If j is in the array of index i that mean there is an arc going form i to j.
     * @param {"Single"/"All"} flag: If flag is "Single", the algorithm will run to only find cycles going through the first node of the graph.
     */
    JohnsonAlgorithm: function(graph, flag){
        // Variables initialisation
        var nVertices = graph.length;
        var start = 0;
        var Ak = graph;
        var B = [];
        var blocked = [];
        for (var i=0; i<nVertices; i++){
            B.push(Array(nVertices).fill(""));
            blocked[i] = false;
        }
        var stack = [];
        for (var i=0; i<nVertices; i++){
            stack.push(null);
        }
        var stackTop = 0;
        var nbNodeToRun = (flag === "Single") ? 1 : nVertices;
        var result = [];

        // Recursive unblock
        function unblock(u){
            blocked[u] = false;
            for (var wPos=0; wPos<B[u].length; wPos++){
                var w = B[u][wPos];
                wPos -= removeFromList(B[u], w);
                if (blocked[w]){
                    unblock(w);
                }
            }
        }

        // Recursive circuit enumeration
        function circuit(v){
            var f = false;
            stackPush(v);
            blocked[v] = true;

            for (var wPos=0; wPos<Ak[v].length; wPos++){
                var w = Ak[v][wPos];
                if (w < start){
                    continue;
                }
                if (w == start){
                    var cycle = stack.slice(0, stackTop);
                    if (cycle.length > 4) {
                        result.push(stack.slice(0, stackTop));
                    }
                    f = true;
                }
                else if (!blocked[w]){
                    if (circuit(w)){
                        f = true;
                    }
                }
            }

            if (f){
                unblock(v);
            }
            else {
                for (var wPos=0; wPos<Ak[v].length; wPos++){
                    var w = Ak[v][wPos];
                    if (w < start){
                        continue;
                    }
                    if (!(B[w].includes(v))){
                        B[w].push(v);
                    }
                }
            }
            v = stackPop();
            return f;
        }

        // Stack management
        function stackPush(val){
            if (stackTop >= stack.length){
                stack.push(null);
            }
            stack[stackTop++] = val;
        }
        function stackPop(){
            return stack[--stackTop];
        }

        // List Management
        function removeFromList(list, val){
            var nOcurrences = 0;
            var itemIndex = 0;
            while ((itemIndex = list.indexOf(val, itemIndex)) > -1) {
                list.splice(itemIndex, 1);
                nOcurrences++;
            }
            return nOcurrences;
        }

        // Main
        start = 0;
        while (start < nbNodeToRun){
            for (var i=0; i<nVertices; i++){
                blocked[i] = false;
                B[i].length = 0;
            }
            circuit(start);
            start = start + 1;
        }
        return result;
    },

    /*******************************************
     * Position all the nodes of cycle along a circle in the visualisation
     * @param {String[][]} cycle: The cycle to draw. A cycle is defined as a list of nodes id.
     */
    drawMetaboliteCycle: function (cycle) {
        // check if drawing this cycle will conflict with other already drawn cycle
        var alreadyDrawnCycles = metExploreD3.GraphStyleEdition.allDrawnCycles;
        var cycleToRemoveIndex = false;
        for (var i=0; i<alreadyDrawnCycles.length; i++){
            var test = false;
            for (var j=0; j<alreadyDrawnCycles[i].length; j++) {
                if (cycle.includes(alreadyDrawnCycles[i][j])){
                    test = true;
                }
            }
            if (test === true){
                var alreadyDrawnLinks = metExploreD3.GraphFunction.getLinksFromCycle(alreadyDrawnCycles[i]);
                for (var j=0; j<alreadyDrawnLinks.length; j++) {
                    alreadyDrawnLinks[j].partOfCycle = false;
                }
                cycleToRemoveIndex = i;
            }
        }
        if (cycleToRemoveIndex !== false) {
            alreadyDrawnCycles.splice(cycleToRemoveIndex, 1);
        }
        alreadyDrawnCycles.push(cycle);

        metExploreD3.GraphFunction.removeHighlightCycle(cycle);
        var radius = cycle.length * 10;
        var nodesList = [];
        for (var i=0; i<cycle.length; i++){
            var node = d3.select("#viz").select("#D3viz").select("#graphComponent").selectAll("g.node")
                .filter(function (d) {
                    return (d.getDbIdentifier() === cycle[i]);
                })
                .each(function (d) {
                    if (!(d.isSelected())) {
                        metExploreD3.GraphNode.selection(d, 'viz');
                    }
                });
            nodesList.push(node);
        }

        // Check if the node are present in the graph
        var cycleExist = true;
        for (var i=0; i< nodesList.length; i++){
        	if (nodesList[i].empty()){
                cycleExist = false;
			}
		}
		if (!cycleExist){
        	return -1;
		}

        // Determine whether the points are arranged in a mostly clockwise or counter-clockwise fashion (cf shoelace formula)
        var directionTotal = 0;
        var topValue = 0;
        var topIndex = 0;
        for (var i=0; i<cycle.length; i++){
            var nextI = (i + 1 < cycle.length) ? i + 1 : 0;
            var x1 = 0;
            var x2 = 0;
            var y1 = 0;
            var y2 = 0;
            nodesList[i].each(function (d) {
                x1 = d.x;
                y1 = d.y;
            });
            nodesList[nextI].each(function (d) {
                x2 = d.x;
                y2 = d.y;
            });
            if (x1 > topValue) {
                topValue = x1;
                topIndex = i;
            }
            directionTotal += (x2 - x1) * (y2 + y1);
        }
        var direction = (directionTotal < 0) ? "clockwise" : "counter-clockwise";

        // Compute the centroid of the points that are part of the cycle
        var centroidX = 0;
        var centroidY = 0;
        for (var i=0; i<cycle.length; i++){
            nodesList[i].each(function (d) {
                centroidX += d.x;
                centroidY += d.y;
            })
        }
        centroidX = centroidX / cycle.length;
        centroidY = centroidY / cycle.length;

        var shiftedNodesList = [].concat(nodesList);
        shiftedNodesList = shiftedNodesList.concat(shiftedNodesList.splice(0, topIndex));
        shiftedNodesList = (direction === "counter-clockwise") ? shiftedNodesList.concat(shiftedNodesList.splice(0, 1)) : shiftedNodesList;
        var revNodesList = (direction === "counter-clockwise") ? [].concat(shiftedNodesList).reverse() : shiftedNodesList;
        for (var i=0; i<cycle.length; i++) {
            var transform = revNodesList[i].attr("transform");
            var transformList = transform.split(/(translate\([\d.,\-\s]*\))/);
            var x = centroidX + radius * Math.cos(2 * Math.PI * i / cycle.length);
            var y = centroidY + radius * Math.sin(2 * Math.PI * i / cycle.length);
            var translate = "translate(" + x + "," + y + ")";
            revNodesList[i].attr("transform", transformList[0] + translate + transformList[2]);
            revNodesList[i].each(function (d) {
                d.x = x;
                d.y = y;
                d.px = x;
                d.py = y;
            });
        }

        // Draw the arcs
        var cycleLinks = metExploreD3.GraphFunction.getLinksFromCycle(cycle);
        for (var i=0; i<cycleLinks.length; i++){
            cycleLinks[i].partOfCycle = true;
            cycleLinks[i].cycleRadius = radius;
            if (cycleLinks[i].getSource().getDbIdentifier() === cycle[i]){
                cycleLinks[i].arcDirection = (direction === "clockwise") ? "clockwise" : "counter-clockwise";
            }
            else if (cycleLinks[i].getTarget().getDbIdentifier() === cycle[i]){
                cycleLinks[i].arcDirection = (direction === "clockwise") ? "counter-clockwise" : "clockwise";

            }
        }

        for (var i=0; i<cycle.length; i++){
            nodesList[i].each(function (d) {
                d.setLocked(true);
                d.fixed=d.isLocked();
            });
        }
        metExploreD3.GraphNode.tick('viz');
        metExploreD3.GraphLink.tick('viz');
        return 0;
    },

    /*******************************************
     * Remove the cycle containing the node form the list of drawn cycle. Once removed, if using curves for edges, the edge of the cycles won't be drawn as arcs.
     * @param {Object} node: A node. If a drawn cycle contain this node, it is removed from the list of drawn cycle.
     */
    removeCycleContainingNode: function (node) {
        // check if the nodes is part of a drawn cycle
        var alreadyDrawnCycles = metExploreD3.GraphStyleEdition.allDrawnCycles;
        var cycleToRemoveIndex = [];
        for (var i=0; i<alreadyDrawnCycles.length; i++){
            var test = false;
            for (var j=0; j<alreadyDrawnCycles[i].length; j++) {
                if (node.getDbIdentifier() === alreadyDrawnCycles[i][j]){
                    test = true;
                }
            };
            if (test === true){
                var alreadyDrawnLinks = metExploreD3.GraphFunction.getLinksFromCycle(alreadyDrawnCycles[i]);
                for (var j=0; j<alreadyDrawnLinks.length; j++) {
                    alreadyDrawnLinks[j].partOfCycle = false;
                }
                cycleToRemoveIndex.push(i);
            }
        }
        for (var i=0; i<cycleToRemoveIndex.length; i++){
            alreadyDrawnCycles.splice(cycleToRemoveIndex[i], 1);
        }
        metExploreD3.GraphNode.tick('viz');
        metExploreD3.GraphLink.tick('viz');
    },

    /*******************************************
     * Check if a node is part of a cycle or not.
     * @param {Object} node: The node to check.
     * @param {String} panel: The panel containing the node.
     */
    checkIfPartOfCycle: function (node, panel) {
        var links = d3.select("#"+panel).select("#D3viz").select("#graphComponent").selectAll("path.link.reaction")
            .filter(function (d) {
                if (d.getSource() === node || d.getTarget() === node){
                    return (d.partOfCycle === true);
                }
            });
        return !links.empty();
    },

    /*******************************************
     * Check if the links in a panel are part of a cycle that should be drawn and give them the needed attributes.
     * @param {String} panel: The panel.
     */
    checkIfCycleInPanel: function (panel) {
    	var linkViz = d3.select("#viz").select("#D3viz").select("#graphComponent").selectAll("path.link.reaction")
			.filter(function (d) {
                return (d.partOfCycle === true);
            });
        var linksPanel = d3.select("#"+panel).select("#D3viz").select("#graphComponent").selectAll("path.link.reaction")
			.filter(function (d) {
				var flag = true;
				linkViz.each(function (dViz) {
					if (d.getDbIdentifier() === dViz.getDbIdentifier()){
						d.partOfCycle = dViz.partOfCycle;
						d.cycleRadius = dViz.cycleRadius;
						d.arcDirection = dViz.arcDirection;
						flag = false;
					}
                });
				return flag;
            })
			.each(function (d) {
				d.partOfCycle = false;
            });
    },

    /*******************************************
     * Check if the selected nodes are part of a cycle or not.
     * @param {String} panel: The panel containing the nodes.
     */
    checkIfSelectionIsPartOfCycle : function (panel) {
        var result = false;
        d3.select("#"+panel).select("#D3viz").select("#graphComponent").selectAll("g.node")
            .filter(function(d) {
                return d.isSelected() && d.getBiologicalType()=="metabolite";
            })
            .filter(function(d){
                if (this.getAttribute("duplicated")==undefined) { return true; }
                else { return !this.getAttribute("duplicated"); }
            }).each(function (d) {
            if (metExploreD3.GraphFunction.checkIfPartOfCycle(d, panel)) { result = true; }
        });
        return result;
    }
}