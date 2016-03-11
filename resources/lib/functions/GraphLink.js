/**
 * @author MC
 * @description : Drawing links
 */
metExploreD3.GraphLink = {
	
	link:"",
	panelParent:"",

	/**********************************************/
	// INIT FUNCTIONS
	/**********************************************/
	delayedInitialisation : function(parent) {
		metExploreD3.GraphLink.panelParent = parent;
	},

	/*******************************************
	* Init the visualization of links
	* @param {} parent : The panel where the action is launched
	* @param {} session : Store which contains global characteristics of session
	* @param {} linkStyle : Store which contains links style
	* @param {} metaboliteStyle : Store which contains metabolites style
	*/
	refreshLink : function(parent, session, linkStyle, metaboliteStyle) {
		metExploreD3.GraphLink.panelParent = "#"+parent; 
		var networkData=session.getD3Data();

		var size=20;
		// The y-axis coordinate of the reference point which is to be aligned exactly at the marker position.
		var refY = linkStyle.getMarkerWidth() / 2;
		// The x-axis coordinate of the reference point which is to be aligned exactly at the marker position.
		// var refX = linkStyle.getMarkerHeight / 2;

	  // Adding arrow on links
		d3.select("#"+parent).select("#D3viz").select("#graphComponent").append("svg:defs").selectAll("marker")
			.data(["in", "out"])
			.enter().append("svg:marker")
			.attr("id", String)
			.attr("viewBox", "0 0 "+linkStyle.getMarkerWidth()+" "+linkStyle.getMarkerHeight())
			.attr("refY", refY)
			.attr("markerWidth", linkStyle.getMarkerWidth())
			.attr("markerHeight", linkStyle.getMarkerHeight())
			.attr("orient", "auto")
			.append("svg:path")
			.attr("class", String)
			.attr("d", "M0,0L"+linkStyle.getMarkerWidth()+","+linkStyle.getMarkerHeight()/2+"L0,"+linkStyle.getMarkerWidth()+"Z")
			.style("visibility", "hidden");

			// .attr("d", "M"+linkStyle.getMarkerWidth()+" "+linkStyle.getMarkerHeight()/2+" L"+linkStyle.getMarkerWidth()/2+" "+(3*linkStyle.getMarkerHeight()/4)+" A"+linkStyle.getMarkerHeight()+" "+linkStyle.getMarkerHeight()+" 0 0 0 "+linkStyle.getMarkerWidth()/2+" "+(1*linkStyle.getMarkerHeight()/4)+" L"+linkStyle.getMarkerWidth()+" "+linkStyle.getMarkerHeight()/2+"Z")
		// Append link on panel
		metExploreD3.GraphLink.link=d3.select("#"+parent).select("#D3viz").select("#graphComponent").selectAll("line")
			.data(networkData.getLinks())
			.enter()
			.append("line")
			.attr("class", "link")//it comes from resources/css/networkViz.css
			.attr("marker-end", function (d) {
				if (d.interaction=="out")
				{
				   d3.select("#"+parent).select("#D3viz").select("#graphComponent").select("#" + d.interaction)
					.attr("refX", (metaboliteStyle.getWidth()+metaboliteStyle.getHeight())/2/2  + (linkStyle.getMarkerWidth() ))
					.style("fill", linkStyle.getMarkerOutColor())
						.style("stroke",linkStyle.getMarkerStrokeColor())
						.style("stroke-width",linkStyle.getMarkerStrokeWidth());

				   return "url(#" + d.interaction + ")";
				}
				else
				{
				  return "none";             
				}
				
				})
			 .attr("marker-start", function (d) {
				if (d.interaction=="out")
				{
				   return "none";
				}
				else
				{
				  d3.select("#"+parent).select("#D3viz").select("#graphComponent").select("#" + d.interaction)
					.attr("refX",-((metaboliteStyle.getWidth()+metaboliteStyle.getHeight())/2/2 ))
					.style("fill", linkStyle.getMarkerInColor())
					.style("stroke",linkStyle.getMarkerStrokeColor())
						.style("stroke-width",linkStyle.getMarkerStrokeWidth());

				  return "url(#" + d.interaction + ")";              
				}  
			  })
			 .style("stroke",linkStyle.getStrokeColor());
			 
	},

	reloadLinks : function(panel, networkData, linkStyle, metaboliteStyle){
		d3.select("#"+panel).select("#D3viz").select("#graphComponent").selectAll("line")
			.data(networkData.getLinks())
			.enter()
			.insert("line",":first-child")
			.attr("class", "link")//it comes from resources/css/networkViz.css
			.attr("marker-end", function (d) {
				if (d.interaction=="out")
				{
				   d3.select("#"+panel).select("#D3viz").select("#graphComponent").select("#" + d.interaction)
					.attr("refX", (metaboliteStyle.getWidth()+metaboliteStyle.getHeight())/2/2  + (linkStyle.getMarkerWidth() ))
					.style("fill", linkStyle.getMarkerOutColor())
						.style("stroke",linkStyle.getMarkerStrokeColor())
						.style("stroke-width",linkStyle.getMarkerStrokeWidth());

				   return "url(#" + d.interaction + ")";
				}
				else
				{
				  return "none";             
				}
				
				})
			.attr("marker-start", function (d) {
				if (d.interaction=="out")
				{
				   return "none";
				}
				else
				{
				  d3.select("#"+panel).select("#D3viz").select("#graphComponent").select("#" + d.interaction)
					.attr("refX",-((metaboliteStyle.getWidth()+metaboliteStyle.getHeight())/2/2 ))
					.style("fill", linkStyle.getMarkerInColor())
					.style("stroke",linkStyle.getMarkerStrokeColor())
						.style("stroke-width",linkStyle.getMarkerStrokeWidth());

				  return "url(#" + d.interaction + ")";              
				}  
				})
			.style("stroke",linkStyle.getStrokeColor())
			.filter(function(d){return d.interaction!="in" && d.interaction!="out"})
			.style("opacity",0);

	},

	// A n'appliquer que sur les petits graphes
	linkTypeOfMetabolite : function(){
		_metExploreViz.setLinkedByTypeOfMetabolite(true);
		var panel = "viz";
		var session = _metExploreViz.getSessionById("viz");

		if(session!=undefined)  
		{
			// We stop the previous animation
			var force = session.getForce();
			if(force!=undefined)  
			{
				force.stop();
			}
		}

		var myMask = metExploreD3.createLoadMask("Link in progress...", panel);
		if(myMask!= undefined){
		  
		  	metExploreD3.showMask(myMask);

			metExploreD3.deferFunction(function() {
				// Hash table definition to create hidden edges
				// Hidden edges are created to put products next to products and substract next to substracts
				var src = {};
				var tgt = {};

				var reacSrc = {};
				var reacTgt = {};

				d3.select("#viz").select("#D3viz").select("#graphComponent")
					.selectAll("line")
					.filter(function(link){
						return link.getInteraction()!="hiddenForce";
					})
					.each(function(alink){
						if(alink.getInteraction()=='in'){
							if(src[alink.getTarget()]==null)
								src[alink.getTarget()]=[]

							src[alink.getTarget()][src[alink.getTarget()].length]=alink.getSource();

							if(reacTgt[alink.getSource()]==null)
								reacTgt[alink.getSource()]=[]
							
							reacTgt[alink.getSource()][reacTgt[alink.getSource()].length]=alink.getTarget();
						}
						else{
							if(tgt[alink.getSource()]==null)
								tgt[alink.getSource()]=[];
							tgt[alink.getSource()][tgt[alink.getSource()].length]=alink.getTarget();

							if(reacSrc[alink.getTarget()]==null)
								reacSrc[alink.getTarget()]=[];
							reacSrc[alink.getTarget()][reacSrc[alink.getTarget()].length]=alink.getSource();

						}
				});

				for (var key in src) {    
					var i = -1;        
					src[key].forEach(function(reactantX1){
						i++;
						src[key].forEach(function(reactantX2){
							if(reactantX1!=reactantX2 && reactantX1!=undefined){
								metExploreD3.GraphLink.addHiddenLinkInDrawing(reactantX1+" -- "+reactantX2,reactantX1,reactantX2,'viz');
							}
						 })
						 delete src[key][i];
					})
				}

				  for (var key in tgt) {    
					  var i = -1;        
					  tgt[key].forEach(function(produitX1){
						  i++;
						  tgt[key].forEach(function(produitX2){
							  if(produitX1!=produitX2 && produitX1!=undefined){
								  metExploreD3.GraphLink.addHiddenLinkInDrawing(produitX1+" -- "+produitX2,produitX1,produitX2,'viz');
							  }
						  })
						  delete tgt[key][i];
					  })
				  }

				  for (var key in reacSrc) {    
					  var i = -1;        
					  reacSrc[key].forEach(function(reactantX1){
						  i++;
						  reacSrc[key].forEach(function(reactantX2){
							  if(reactantX1!=reactantX2 && reactantX1!=undefined){
								  metExploreD3.GraphLink.addHiddenLinkInDrawing(reactantX1+" -- "+reactantX2,reactantX1,reactantX2,'viz');
							  }
						  })
						  delete reacSrc[key][i];
					  })
				  }

				  for (var key in reacTgt) {    
					  var i = -1;        
					  reacTgt[key].forEach(function(produitX1){
						  i++;
						  reacTgt[key].forEach(function(produitX2){
							  if(produitX1!=produitX2 && produitX1!=undefined){
								  metExploreD3.GraphLink.addHiddenLinkInDrawing(produitX1+" -- "+produitX2,produitX1,produitX2,'viz');
							  }
						  })
						  delete reacTgt[key][i];
					  })
				  }
				metExploreD3.hideMask(myMask);
				var animLinked=metExploreD3.GraphNetwork.isAnimated(session.getId());
		  		if (animLinked=='true') {
					var force = session.getForce();
					if(force!=undefined)  
					{   
			  			if((metExploreD3.GraphNetwork.isAnimated(session.getId()) == 'true') 
							|| (metExploreD3.GraphNetwork.isAnimated(session.getId()) == null)) {
				  				force.start();
			  			}
			  		}
			  	}
			}, 100);
		}			
	},

	// A n'appliquer que sur les petits graphes
	removeLinkTypeOfMetabolite : function(){
		_metExploreViz.setLinkedByTypeOfMetabolite(false);
		var panel = "viz";
		var session = _metExploreViz.getSessionById("viz");

		if(session!=undefined)  
		{
			// We stop the previous animation
			var force = session.getForce();
			if(force!=undefined)  
			{
				force.stop();
			}
		}

		var myMask = metExploreD3.createLoadMask("Remove hidden link in progress...", panel);
		if(myMask!= undefined){
		  
		  	metExploreD3.showMask(myMask);

			metExploreD3.deferFunction(function() {
				metExploreD3.GraphLink.removeHiddenLinkInDrawing('viz');
					
				metExploreD3.hideMask(myMask);
				var animLinked=metExploreD3.GraphNetwork.isAnimated(session.getId());
		  		if (animLinked=='true') {
					var force = session.getForce();
					if(force!=undefined)  
					{   
			  			if((metExploreD3.GraphNetwork.isAnimated(session.getId()) == 'true') 
							|| (metExploreD3.GraphNetwork.isAnimated(session.getId()) == null)) {
				  				force.start();
			  			}
			  		}
			  	}
			}, 100);
		}			
	},

	/*******************************************
	* Add link in visualization
	* @param {} identifier : Id of this link
	* @param {} source : Source of this link
	* @param {} target : Target of this link
	* @param {} interaction : Interaction beetween nodes of this link
	* @param {} reversible : Reversibility of link
	* @param {} panel : The panel where is the new link
	*/
	addHiddenLinkInDrawing:function(identifier,source,target,panel){
	  var session = _metExploreViz.getSessionById(panel);
	  var networkData = session.getD3Data();
	  networkData.addLink(identifier,source,target,"hiddenForce",false);
	  var metaboliteStyle = metExploreD3.getMetaboliteStyle();
	  var linkStyle = metExploreD3.getLinkStyle();
	  var force = session.getForce();

	  link=d3.select("#"+panel).select("#graphComponent").selectAll("line")
			.data(force.links(), function(d) { 
			  	return d.source.id + "-" + d.target.id;
			})
			.enter()
			.insert("line",":first-child")
			.attr("class", "link")//it comes from resources/css/networkViz.css
			.style("stroke",linkStyle.getStrokeColor())
			.style("opacity",0);
	},

	/*******************************************
	* Add link in visualization
	* @param {} identifier : Id of this link
	* @param {} source : Source of this link
	* @param {} target : Target of this link
	* @param {} interaction : Interaction beetween nodes of this link
	* @param {} reversible : Reversibility of link
	* @param {} panel : The panel where is the new link
	*/
	removeHiddenLinkInDrawing:function(panel){
		var session = _metExploreViz.getSessionById(panel);

		var networkData = session.getD3Data();
		var linksToRemove = [];
		var force = session.getForce();

		var link=d3.select("#"+panel).select("#graphComponent").selectAll("line")
			.filter(function(link){
				return link.getInteraction()=="hiddenForce";
			})
			.each(function(link){ linksToRemove.push(link); })
			.remove();
		
		setTimeout(
			function() {
				
				for (i = 0; i < linksToRemove.length; i++) {
					var link = linksToRemove[i];

					networkData.removeLink(link);

					var index = force.links().indexOf(link);
					
					if(index!=-1)
						force.links().splice(index, 1);
				}
			}
		, 100);
	},
	
	/*******************************************
	* Tick function of links
	* @param {} panel : The panel where the action is launched
	* @param {} scale = Ext.getStore('S_Scale').getStoreByGraphName(panel);
	*/
	tick : function(panel, scale) {
	  // If you want to use selection on compartments path
	  // d3.select("#"+metExploreD3.GraphNode.panelParent).select("#D3viz").select("graphComponent").selectAll("path")
	  	metExploreD3.GraphLink.displayConvexhulls(panel);
	  	if(metExploreD3.GraphNetwork.isAnimated(panel)== "true" && scale.getZoomScale()<0.7 && d3.select("#"+panel).select("#D3viz").select("#graphComponent").select("defs").selectAll("marker").selectAll("path").style('visibility')=="visible"){
			d3.select("#"+panel).select("#D3viz").select("#graphComponent").select("defs").selectAll("marker").selectAll("path").style('visibility',"hidden");
		}
		
		var session = _metExploreViz.getSessionById(panel);
    
		if((session.getForce().alpha()==0
				&& d3.select("#"+panel).select("#D3viz").select("#graphComponent").select("defs").selectAll("marker").selectAll("path").style('visibility')=="hidden") 
			|| (scale.getZoomScale()>0.7 
				&& d3.select("#"+panel).select("#D3viz").select("#graphComponent").select("defs").selectAll("marker").selectAll("path").style('visibility')=="hidden"))
		{
		 
		d3.select("#"+panel).select("#D3viz").select("#graphComponent").select("defs")
				.selectAll("marker").selectAll("path").style('visibility',"visible");
		}

		d3.select("#"+panel).select("#D3viz").select("#graphComponent")
			.selectAll("line")
			.attr("x1", function(d) { return d.source.x; })
			.attr("y1", function(d) { return d.source.y; })
			.attr("x2", function(d) { return d.target.x; })
			.attr("y2", function(d) { return d.target.y; });
	},

	displayConvexhulls : function(panel){
		var generalStyle = _metExploreViz.getGeneralStyle();

		var convexHullPath = d3.select("#"+panel).select("#D3viz").selectAll("path")
		  .filter(function(d){return d!="in" && d!="out"});

		var isDisplay = generalStyle.isDisplayedConvexhulls();
		if(!isDisplay){

			convexHullPath.remove();
	  	}
	  	else
	  	{
			if(convexHullPath[0].length==0)
				metExploreD3.GraphNode.loadPath(panel, isDisplay);  
				
		  	convexHullPath
			  .attr("d", metExploreD3.GraphNode.groupPath)
			  .attr("transform", d3.select("#"+panel).select("#D3viz").select("#graphComponent").attr("transform")); 
	  	}
	},

	/*******************************************
	* Init the visualization of links
	* @param {} parent : The panel where the action is launched
	* @param {} session : Store which contains global characteristics of session
	* @param {} linkStyle : Store which contains links style
	* @param {} metaboliteStyle : Store which contains metabolites style
	*/
	loadLink : function(parent, session, linkStyle, metaboliteStyle) {
		
		metExploreD3.GraphLink.panelParent = "#"+parent; 
		var networkData=session.getD3Data();

		var size=20;
		// The y-axis coordinate of the reference point which is to be aligned exactly at the marker position.
		var refY = linkStyle.getMarkerWidth() / 2;
		// The x-axis coordinate of the reference point which is to be aligned exactly at the marker position.
		// var refX = linkStyle.getMarkerHeight / 2;

	  // Adding arrow on links
		d3.select("#"+parent).select("#D3viz").select("#graphComponent").append("svg:defs").selectAll("marker")
			.data(["in", "out"])
			.enter().append("svg:marker")
			.attr("id", String)
			.attr("viewBox", "0 0 "+linkStyle.getMarkerWidth()+" "+linkStyle.getMarkerHeight())
			.attr("refY", refY)
			.attr("markerWidth", linkStyle.getMarkerWidth())
			.attr("markerHeight", linkStyle.getMarkerHeight())
			.attr("orient", "auto")
			.append("svg:path")
			.attr("class", String)
			.attr("d", "M0,0L"+linkStyle.getMarkerWidth()+","+linkStyle.getMarkerHeight()/2+"L0,"+linkStyle.getMarkerWidth()+"Z")
			.style("visibility", "hidden");

			// .attr("d", "M"+linkStyle.getMarkerWidth()+" "+linkStyle.getMarkerHeight()/2+" L"+linkStyle.getMarkerWidth()/2+" "+(3*linkStyle.getMarkerHeight()/4)+" A"+linkStyle.getMarkerHeight()+" "+linkStyle.getMarkerHeight()+" 0 0 0 "+linkStyle.getMarkerWidth()/2+" "+(1*linkStyle.getMarkerHeight()/4)+" L"+linkStyle.getMarkerWidth()+" "+linkStyle.getMarkerHeight()/2+"Z")
		
	   
		// Append link on panel
		metExploreD3.GraphLink.link=d3.select("#"+parent).select("#D3viz").select("#graphComponent").selectAll("line")
			.data(networkData.getLinks())
			.enter()
			.append("line")
			.attr("class", "link")//it comes from resources/css/networkViz.css
			.attr("marker-end", function (d) {
				if (d.interaction=="out")
				{
				   d3.select("#"+parent).select("#D3viz").select("#graphComponent").select("#" + d.interaction)
					.attr("refX", (metaboliteStyle.getWidth()+metaboliteStyle.getHeight())/2/2  + (linkStyle.getMarkerWidth() ))
					.style("fill", linkStyle.getMarkerOutColor())
						.style("stroke",linkStyle.getMarkerStrokeColor())
						.style("stroke-width",linkStyle.getMarkerStrokeWidth());

				   return "url(#" + d.interaction + ")";
				}
				else
				{
				  return "none";             
				}
				
				})
			.attr("marker-start", function (d) {
				if (d.interaction=="out")
				{
				   return "none";
				}
				else
				{
				  d3.select("#"+parent).select("#D3viz").select("#graphComponent").select("#" + d.interaction)
					.attr("refX",-((metaboliteStyle.getWidth()+metaboliteStyle.getHeight())/2/2 ))
					.style("fill", linkStyle.getMarkerInColor())
					.style("stroke",linkStyle.getMarkerStrokeColor())
						.style("stroke-width",linkStyle.getMarkerStrokeWidth());

				  return "url(#" + d.interaction + ")";              
				}  
				})
			.style("stroke",linkStyle.getStrokeColor());

		metExploreD3.GraphLink.link
			.filter(function(link){
				return link.getInteraction()=="hiddenForce";
			})
			.style("opacity",0);
	}
}