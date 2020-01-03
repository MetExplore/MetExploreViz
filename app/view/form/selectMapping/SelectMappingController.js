/**
 * @author MC
 * (a)description class to control contion selection panel
 * C_SelectMapping
 */

Ext.define('metExploreViz.view.form.selectMapping.SelectMappingController', {
	extend: 'Ext.app.ViewController',
	alias: 'controller.form-selectMapping-selectMapping',

	/**
	 * Aplies event linsteners to the view
	 */
	init:function(){
		var me 		= this,
		view      	= me.getView();

		view.on({
			jsonmapping : function(mappingJSON){
				me.initMapping(mappingJSON);
			},
			change : function(that, newMapping, old){
				var session = _metExploreViz.getSessionById('viz');
				d3.select("#viz").select("#D3viz").select("#graphComponent").selectAll("g.node")
					.filter(function (n) { return n.getBiologicalType()==="pathway";})
					.each(function (d) {
						var thePathwayElement = d3.select(this);

						thePathwayElement.select(".mapped-segment").classed("hide", true);
						thePathwayElement.select(".notmapped-segment").classed("hide", true);

						var pathwayModel = session.getD3Data().getPathwayByName(d.getName());
						var pathwaySize = 20;

						thePathwayElement.setNodeForm(
							pathwaySize*3,
							pathwaySize*3,
							pathwaySize*3,
							pathwaySize*3,
							pathwayModel.getColor(),
							pathwaySize*3/5
						);

						// Lock Image definition
						var box = thePathwayElement.select("locker")
							.attr("width", pathwaySize * 3)
							.attr("height", pathwaySize * 3)
							.attr("preserveAspectRatio", "xMinYMin")
							.attr("y", -pathwaySize * 3)
							.attr("x", -pathwaySize * 3);

						box
							.select("backgroundlocker")
							.attr("d", function (node) {
								var pathBack = "M" + pathwaySize * 3 + "," + pathwaySize * 3 +
									" L0," + pathwaySize * 3 +
									" L0," + pathwaySize * 3 / 2 * 2 +
									" A" + pathwaySize * 3 / 2 * 2 + "," + pathwaySize * 3 / 2 * 2 + ",0 0 1 " + pathwaySize * 3 / 2 * 2 + ",0" +
									" L" + pathwaySize * 3 + ",0";
								return pathBack;
							})
							.attr("opacity", "0.20")
							.attr("fill", "#000000");

						box
							.select("iconlocker")
							.attr("y", pathwaySize * 3 / 2 / 4 - (pathwaySize * 3 - pathwaySize * 3 * 2) / 8)
							.attr("x", pathwaySize * 3 / 2 / 4 - (pathwaySize * 3 - pathwaySize * 3 * 2) / 8)
							.attr("width", "40%")
							.attr("height", "40%");
					});

				if(newMapping!=="None"){

					var myMask = metExploreD3.createLoadMask("Mapping in progress...", 'graphPanel');

					if(myMask!= undefined){

						metExploreD3.showMask(myMask);
						setTimeout(
							function() {
								try {
									var nbMapped=0;
									var session = _metExploreViz.getSessionById('viz');
									var force = session.getForce();
									force.stop();

								d3.select("#viz").select("#D3viz").select("#graphComponent").selectAll("g.node")
									.filter(function (n) { return n.getBiologicalType()==="pathway";})
									// .filter(function (d) {
									// 	if (this.getAttribute("mapped") == undefined || this.getAttribute("mapped") == false || this.getAttribute("mapped") == "false") return true;
									// 	else return false;
									// })
									.each(function (d) {
										var thePathwayElement = d3.select(this);

										thePathwayElement
											.select("text")
											.remove();

										metExploreD3.GraphNode.addText(d, "viz");

										var exposant = 0;

										if (d.getMappingDataByNameAndCond(newMapping, "PathwayEnrichment") != null) {

											nbMapped++;

											d3.select(this)
												.attr("mapped", "true");

											var mapData = d.getMappingDataByNameAndCond(newMapping, "PathwayEnrichment");

											if (mapData.getMapValue() < 0.001) {
												exposant = 1.2;
											} else {
												if (mapData.getMapValue() < 0.01) {
													exposant = 0.9;
												} else {
													if (mapData.getMapValue() < 0.05) {
														exposant = 0.6;
													}
												}
											}
											session.addMappedNode(d.getId());
										}

										var pathwaySize = 20 + 100 * exposant;

										//interligne
										d3.select(this)
											.select("text")
											.style("stroke-width", 10)
											.style("font-weight", 'bold')
											.style("font-size", pathwaySize - 40 + "px")
											.each(function (text) {
												d3.select(this).selectAll("tspan")
													.each(function (tspan, i) {
														if (i > 0)
															d3.select(this).attr("dy", pathwaySize - 40);
													});
											});

										var width = pathwaySize * 3;
										var height = pathwaySize * 3;
										var rx = pathwaySize * 3;
										var ry = pathwaySize * 3;
										var strokewidth = pathwaySize * 3 / 5;

										thePathwayElement.select("rect.pathway")
											.attr("width", width)
											.attr("height", height)
											.attr("rx", rx)
											.attr("ry", ry)
											.attr("transform", "translate(-" + width / 2 + ",-"
												+ height / 2
												+ ")")
											.style("stroke-width", strokewidth);

										thePathwayElement.select("rect.fontSelected")
											.attr("width", width)
											.attr("height", height)
											.attr("rx", rx)
											.attr("ry", ry)
											.attr("transform", "translate(-" + width / 2 + ",-" + height / 2 + ")");


										// Lock Image definition
										var box = thePathwayElement.select(".locker").attr(
											"viewBox",
											function (d) {
												+" " + pathwaySize * 3;
											}
										)
											.attr("width", pathwaySize * 3)
											.attr("height", pathwaySize * 3)
											.attr("preserveAspectRatio", "xMinYMin")
											.attr("y", -pathwaySize * 3)
											.attr("x", -pathwaySize * 3);

										box
											.select(".backgroundlocker")
											.attr("d", function (node) {
												var pathBack = "M" + pathwaySize * 3 + "," + pathwaySize * 3 +
													" L0," + pathwaySize * 3 +
													" L0," + pathwaySize * 3 / 2 * 2 +
													" A" + pathwaySize * 3 / 2 * 2 + "," + pathwaySize * 3 / 2 * 2 + ",0 0 1 " + pathwaySize * 3 / 2 * 2 + ",0" +
													" L" + pathwaySize * 3 + ",0";
												return pathBack;
											})
											.attr("opacity", "0.20")
											.attr("fill", "#000000");

										box
											.select(".iconlocker")
											.attr("y", pathwaySize * 3 / 2 / 4 - (pathwaySize * 3 - pathwaySize * 3 * 2) / 8)
											.attr("x", pathwaySize * 3 / 2 / 4 - (pathwaySize * 3 - pathwaySize * 3 * 2) / 8)
											.attr("width", "40%")
											.attr("height", "40%");



										if (d.getMappingDataByNameAndCond(newMapping, "PathwayCoverage") !== null) {

											var thePathwayElement = d3.select(this);
											var mapped = thePathwayElement.select(".mapped-segment");
											var notmapped = thePathwayElement.select(".notmapped-segment");

											thePathwayElement.select(".mapped-segment").classed("hide", false);
											thePathwayElement.select(".notmapped-segment").classed("hide", false);
											var mapData = d.getMappingDataByNameAndCond(newMapping, "PathwayCoverage");

											var coverage = mapData.getMapValue();
											var radius = (width - strokewidth) / 2;
											var halfRadius = radius / 2;
											var halfCircumference = 2 * Math.PI * halfRadius;

											// 0deg drawn up to this point
											var degreesDrawn = -90;

											mapped
												.attr('r', halfRadius)
												.attr('stroke-width', radius)
												.attr('stroke', "#FF7560")
												.attr('stroke-dasharray',
													halfCircumference * coverage
													+ ' '
													+ halfCircumference)
												.style('transform', 'rotate(' + degreesDrawn + 'deg)');

											// 119.988deg drawn up to this point
											degreesDrawn += 360 * coverage;

											notmapped
												.attr('fill', 'transparent')
												.attr('r', halfRadius)
												.attr('stroke-width', radius)
												.attr('stroke', '#144778')
												.attr('stroke-dasharray',
													halfCircumference * (1.0 - coverage)
													+ ' '
													+ halfCircumference)
												.style('transform', 'rotate(' + degreesDrawn + 'deg)');

										}

									});

									metExploreD3.hideMask(myMask);
									if(nbMapped===0){
										metExploreD3.displayMessage("Warning", 'No mapped node on network.');

										metExploreD3.fireEvent('selectMappingVisu', 'disableMapping');
									}

									var anim = session.isAnimated("viz");
									if (anim == 'true') {
										var session = _metExploreViz.getSessionById('viz');
										var force = session.getForce();

										if (metExploreD3.GraphNetwork.animation) {
											force.alpha(1).restart();
										}
									}
								}
								catch (e) {

									e.functionUsed="mapNodes";
									metExploreD3.hideMask(myMask);

									var anim=session.isAnimated("viz");
									if (anim=='true') {
										var session = _metExploreViz.getSessionById('viz');
										var force = session.getForce();

										if (metExploreD3.GraphNetwork.animation) {
											force.alpha(1).restart();
										}
									}
									throw e;
								}
							}, 1
						);
					}
				}
			},
			scope:me
		});
	},

	initMapping:function(mappingJSON){
		var me 		= this,
			view      	= me.getView();

		if(_metExploreViz.getMappingsLength()!==0 ){
	    	var component = Ext.getCmp('comparisonSidePanel');
	        if(component){
	        	if(component.isHidden())
	           		component.setHidden(false);
				component.expand();
				var comboMapping = view;
				var store = comboMapping.getStore();
	            //take an array to store the object that we will get from the ajax response
				var records = [];

				// comboMapping.bindStore(store);

				records.push(new Ext.data.Record({
                    name: mappingJSON.getName()
                }));

				store.each(function(mappingName){
					records.push(new Ext.data.Record({
	                    name: mappingName.getData().name
	                }));
				});
				store.loadData(records, false);

                if(store.getCount()===1)
                	comboMapping.setDisabled(false);
	        }
	    }
	}
});