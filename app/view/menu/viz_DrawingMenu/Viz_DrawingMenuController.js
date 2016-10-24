Ext.define('metExploreViz.view.menu.viz_DrawingMenu.Viz_DrawingMenuController', {
	extend: 'Ext.app.ViewController',
	alias: 'controller.menu-vizDrawingMenu-vizDrawingMenu',

/**
 * Aplies event linsteners to the view
 */
	init:function(){
		var me 		= this,
		viewModel   = me.getViewModel(),
		view      	= me.getView();

		view.on({
			mouseleave: function( menu, e, eOpts){
				menu.hide();
			},
	  		scope:me
     	});

		view.lookupReference('removeSideCompounds').on({
			click : me.removeSideCompounds,
			scope : me
		});

		view.lookupReference('duplicateSideCompounds').on({
			click : me.duplicateSideCompounds,
			scope : me
		});

		view.lookupReference('clustMetabolites').on({
			click : me.clustMetabolites,
			scope : me
		});

		view.lookupReference('drawHierarchicalLayout').on({
			click : me.drawHierarchicalLayout,
			scope : me
		});

		view.lookupReference('makeClusters').on({
			click : me.makeClusters,
			scope : me
		});
		view.on({
			enableMakeClusters : function(){
				this.lookupReference('makeClusters').setDisabled(false);
			},
			scope : me
		});
		view.on({
			disableMakeClusters : function(){
				this.lookupReference('makeClusters').setDisabled(true);	
			},
			scope : me
		});
	},
	duplicateSideCompounds : function(){
		metExploreD3.GraphNetwork.duplicateSideCompounds('viz');
	},
	clustMetabolites : function(){
		if(!_metExploreViz.isLinkedByTypeOfMetabolite()){
			metExploreD3.GraphLink.linkTypeOfMetabolite();
			this.getView().lookupReference('clustMetabolites').setIconCls("metabolitesUnlinkedByType");
			this.getView().lookupReference('clustMetabolites').setTooltip('Release force between substrates/products');
		}
		else
		{
			metExploreD3.GraphLink.removeLinkTypeOfMetabolite();
			this.getView().lookupReference('clustMetabolites').setIconCls("metabolitesLinkedByType");
			this.getView().lookupReference('clustMetabolites').setTooltip('Draw closer substrates/products');
		}
		
	},
	drawHierarchicalLayout : function(){
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
				var graph2 = null;
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
					var algo = "Hierarchical Tree (R-T Extended)";
					var params = tulip.getDefaultAlgorithmParameters(algo, graph);
					// // params["space between levels"]=50;
					params["node spacing"]=50;
					graph.applyLayoutAlgorithmInWorker(algo, graph.getLocalLayoutProperty('viewLayout'), params,
				    	function(){
				            var height = parseInt(metExploreD3.GraphPanel.getHeight(panel));
							var width = parseInt(metExploreD3.GraphPanel.getWidth(panel));

					        d3.select("#viz").select("#D3viz").select("#graphComponent").selectAll("g.node")
					            .attr("cx", function(d) { 
					            	d.x = viewLayout.getNodeValue(correspondNodeId[d.getId()]).x + width / 2;
					            	return viewLayout.getNodeValue(correspondNodeId[d.getId()]).x + width / 2; 
					            })
					            .attr("cy", function(d) { 
					            	d.y = viewLayout.getNodeValue(correspondNodeId[d.getId()]).y + height / 2;
					            	return viewLayout.getNodeValue(correspondNodeId[d.getId()]).y + height / 2; 
					            })
					            .attr("transform", function(d) {
									//  scale("+ +")
									var scale = 1;
									if(d3.select(this)!=null){
										var transformString = d3.select(this).attr("transform");
										if(d3.select(this).attr("transform")!=null){
											var indexOfScale = transformString.indexOf("scale(");
											if(indexOfScale!=-1)
												scale = parseInt(transformString.substring(indexOfScale+6, transformString.length-1));
										}
									}
									return "translate(" + (viewLayout.getNodeValue(correspondNodeId[d.getId()]).x + width / 2) + "," + (viewLayout.getNodeValue(correspondNodeId[d.getId()]).y + height / 2) + ") scale("+scale+")";
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
	makeClusters : function(){
		var useClusters = metExploreD3.getGeneralStyle().useClusters();
		metExploreD3.getGeneralStyle().setUseClusters(!useClusters);
		
		if(!useClusters){
			this.getView().lookupReference('makeClusters').setIconCls("unmakeClusters");
			this.getView().lookupReference('makeClusters').setTooltip('Release force for clusters');
			this.getView().lookupReference('makeClusters').setText("Unmake clusters");
		}
		else
		{
			this.getView().lookupReference('makeClusters').setIconCls("makeClusters");
			this.getView().lookupReference('makeClusters').setTooltip('Make clusters in function of highlighted component');
			this.getView().lookupReference('makeClusters').setText("Make clusters");
		}
		var session = _metExploreViz.getSessionById('viz');
		if((metExploreD3.GraphNetwork.isAnimated(session.getId()) == 'true') 
							|| (metExploreD3.GraphNetwork.isAnimated(session.getId())  == null))
			session.getForce().resume();
		
	},
	removeSideCompounds : function(){
		metExploreD3.GraphNetwork.removeSideCompounds();
	}
});