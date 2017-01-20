/**
 * @author MC
 * @description : Drawing caption
 */
metExploreD3.GraphCaption = {
    
	
	/*****************************************************
	* refreshStyleOfReaction in caption
	*/
	refreshStyleOfReaction : function(){
		
		
		// Load user's preferences
		var reactionStyle = metExploreD3.getReactionStyle();
		var maxDimRea = Math.max(reactionStyle.getWidth(),reactionStyle.getHeight());
		var xRea = 15/maxDimRea;
		
		d3.select("#viz").select("#D3viz")
			.select('.reactionCaption')
			.attr('x', 15/2 - reactionStyle.getWidth()*xRea/2)
			.attr('y', 15 + 15/2 - reactionStyle.getHeight()*xRea/2)
			.attr("width", reactionStyle.getWidth()*xRea)
			.attr("height", reactionStyle.getHeight()*xRea)
			.attr("rx", reactionStyle.getRX()*xRea)
			.attr("ry", reactionStyle.getRY()*xRea)
			.attr("fill", "white")
			.attr("transform", "translate(15,95)")
			.style("stroke",reactionStyle.getStrokeColor())
			.style("stroke-width", 2);
	},

	/*****************************************************
	* refreshStyleOfMetabolite in caption
	*/
	refreshStyleOfMetabolite : function(){
		
		
		var metaboliteStyle = metExploreD3.getMetaboliteStyle();
		var maxDimMet = Math.max(metaboliteStyle.getWidth(),metaboliteStyle.getHeight());
		var xMet = 15/maxDimMet;

		d3.select("#viz").select("#D3viz")
			.select('.metaboliteCaption')
			.attr('x', 15/2 - metaboliteStyle.getWidth()*xMet/2)
			.attr('y', 15 + 15/2 - metaboliteStyle.getHeight()*xMet/2)
			.attr("width", metaboliteStyle.getWidth()*xMet)
			.attr("height", metaboliteStyle.getHeight()*xMet)
			.attr("rx", metaboliteStyle.getRX()*xMet)
			.attr("ry", metaboliteStyle.getRY()*xMet)
			.attr("fill", "white")
			.style("stroke", "black")
			.style("stroke-width", 2)
			.attr("transform","translate(15,130)");

	},
	/*****************************************************
	* Draw caption
	*/
	drawCaption : function(){
		d3.select("#viz").select("#D3viz")
			.select('#captionComparment')
			.remove();

	    d3.select("#viz").select("#D3viz")
			.select('#captionPathway')
			.remove();

	    d3.select("#viz")
			.select("#D3viz")
			.select(".logoViz")
			.remove();

		// Load user's preferences
		var reactionStyle = metExploreD3.getReactionStyle();
		var maxDimRea = Math.max(reactionStyle.getWidth(),reactionStyle.getHeight());
		var xRea = 15/maxDimRea;
		
		var metaboliteStyle = metExploreD3.getMetaboliteStyle();
		var maxDimMet = Math.max(metaboliteStyle.getWidth(),metaboliteStyle.getHeight());
		var xMet = 15/maxDimMet;

		// This part create the legend of the representation and
		// add a mention to Metexplore in the right bottom
		// corner
		// Issue to be solved: when the window size change we
		// loose the MetExplore text.
		var sx = 15/2 - reactionStyle.getWidth()*xRea/2;
		var sy = 15;

		var tx = 20 + 15/2 - reactionStyle.getWidth()*xRea/2;
		var ty = 15;
		

		var linkStyle = metExploreD3.getLinkStyle();
		var d = Math.sqrt(Math.pow(tx - sx,2) + Math.pow(ty - sy,2));
		var dX = (tx-sx);
		var dY = (ty-sy);
		var diffX = dX/Math.abs(dX);
		var diffY = dY/Math.abs(dY);
		
		var rTW = (Math.abs(d)*10/2)/Math.abs(dX);
		var rTH = (Math.abs(d)*10/2)/Math.abs(dY);
		var largeurNoeudT = (rTW<rTH) ? rT=rTW : rt=rTH;
		var heightArrow = 5;
		
		var xTarget = sx + dX*((d-largeurNoeudT)/d);
		var yTarget = sy + dY*((d-largeurNoeudT)/d);

		var heightArrow = 5;
		var xBaseArrowT = sx + dX*((d-largeurNoeudT-heightArrow)/d);
		var yBaseArrowT = sy + dY*((d-largeurNoeudT-heightArrow)/d);

		var xBaseArrowRev = sx + dX*((d-largeurNoeudT-heightArrow-heightArrow)/d);
		var yBaseArrowRev = sy + dY*((d-largeurNoeudT-heightArrow-heightArrow)/d);

		var xWBaseArrowT1 = xBaseArrowT + dY*(3/d);
		var yWBaseArrowT1 = yBaseArrowT - dX*(3/d);
		var xWBaseArrowT2 = xBaseArrowT - dY*(3/d);
		var yWBaseArrowT2 = yBaseArrowT + dX*(3/d);
		var dLink = "M"+sx+","+sy+
					"L"+xBaseArrowRev+","+yBaseArrowRev+
					"L"+xWBaseArrowT1+","+yWBaseArrowT1+
					"L"+xWBaseArrowT2+","+yWBaseArrowT2+
					"L"+xTarget+","+yTarget+
					"L"+xWBaseArrowT1+","+yWBaseArrowT1+
					"L"+xWBaseArrowT2+","+yWBaseArrowT2+
					"L"+xBaseArrowRev+","+yBaseArrowRev+
					"Z";

		d3.select("#viz").select("#D3viz")
			.append("svg:path")
			.attr("class", String)
			.attr("d",dLink)
			.attr("class", 'linkCaptionRev')
			.attr("fill-rule", "evenodd")
			.attr("fill", 'white')
			.style("stroke",linkStyle.getStrokeColor())
			.style("stroke-width",1.5)
			.style("stroke-linejoin", "bevel")
			.attr("transform","translate(15,65)");

		d3.select("#viz").select("#D3viz")
			.append("svg:text")
			.text('Reversible link')
			.attr('x', 20)
			.attr('y', 15)
			.attr("transform", "translate(30,70)");

		linkStyle = metExploreD3.getLinkStyle();
		var d = Math.sqrt(Math.pow(tx - sx,2) + Math.pow(ty - sy,2));
		var dX = (tx-sx);
		var dY = (ty-sy);
		var diffX = dX/Math.abs(dX);
		var diffY = dY/Math.abs(dY);
		
		var rTW = (Math.abs(d)*10/2)/Math.abs(dX);
		var rTH = (Math.abs(d)*10/2)/Math.abs(dY);
		var largeurNoeudT = (rTW<rTH) ? rT=rTW : rt=rTH;
		
		var xTarget = sx + dX*((d-largeurNoeudT)/d);
		var yTarget = sy + dY*((d-largeurNoeudT)/d);

		var heightArrow = 5;
		var xBaseArrowT = sx + dX*((d-largeurNoeudT-heightArrow)/d);
		var yBaseArrowT = sy + dY*((d-largeurNoeudT-heightArrow)/d);

		var xWBaseArrowT1 = xBaseArrowT + dY*(3/d);
		var yWBaseArrowT1 = yBaseArrowT - dX*(3/d);
		var xWBaseArrowT2 = xBaseArrowT - dY*(3/d);
		var yWBaseArrowT2 = yBaseArrowT + dX*(3/d);
		
		dLink ="M"+sx+","+sy+
				"L"+xBaseArrowT+","+yBaseArrowT+
				"L"+xWBaseArrowT1+","+yWBaseArrowT1+
				"L"+xTarget+","+yTarget+
				"L"+xWBaseArrowT2+","+yWBaseArrowT2+
				"L"+xBaseArrowT+","+yBaseArrowT+
				"Z"

		d3.select("#viz").select("#D3viz")
			.append("svg:path")
			.attr("class", String)
			.attr("d",dLink)
			.attr("class", 'linkCaptionRev')
			.attr("fill-rule", "evenodd")
			.attr("fill", 'white')
			.style("stroke",linkStyle.getStrokeColor())
			.style("stroke-width",1.5)
			.style("stroke-linejoin", "bevel")
			.attr("transform","translate(15,40)");

		d3.select("#viz").select("#D3viz")
			.append("svg:text")
			.text('Link')
			.attr('x', 20)
			.attr('y', 15)
			.attr("transform", "translate(30,45)");


		d3.select("#viz").select("#D3viz")
			.append("svg:text")
			.attr('id', 'metexplore')
			.text('MetExploreViz')
			.attr('x', $("#viz").width() - 130)
			.attr('y', $("#viz").height() - 10);

		d3.select("#viz")
			.select("#D3viz")
			.append("svg:g")
			.attr("class","logoViz").attr("id","logoViz")
			.append("image")
			.attr("xlink:href", "resources/icons/metExploreViz_Logo.svg")
			.attr("width", "50")
			.attr("height", "50")
			.attr('x', $("#viz").width() - 110)
			.attr('y', $("#viz").height() - 75);
			
		d3.select("#viz").select("#D3viz")
	    	.append("svg:rect")
			.attr('class', 'reactionCaption')
			.attr('x', 15/2 - reactionStyle.getWidth()*xRea/2)
			.attr('y', 15)
			.attr("width", reactionStyle.getWidth()*xRea)
			.attr("height", reactionStyle.getHeight()*xRea)
			.attr("rx", reactionStyle.getRX()*xRea)
			.attr("ry", reactionStyle.getRY()*xRea)
			.attr("fill", "white")
			.attr("transform", "translate(15,95)")
			.style("stroke",reactionStyle.getStrokeColor())
			.style("stroke-width", 2);

		d3.select("#viz").select("#D3viz")
			.append("svg:text")
			.text('Reaction')
			.attr('x', 20)
			.attr('y', 15)
			.attr("transform", "translate(30,105)");

		d3.select("#viz").select("#D3viz")
			.append("svg:rect")
			.attr('class', 'metaboliteCaption')
			.attr('x', 15/2 - metaboliteStyle.getWidth()*xMet/2)
			.attr('y', 15 + 15/2 - metaboliteStyle.getHeight()*xMet/2)
			.attr("width", metaboliteStyle.getWidth()*xMet)
			.attr("height", metaboliteStyle.getHeight()*xMet)
			.attr("rx", metaboliteStyle.getRX()*xMet)
			.attr("ry", metaboliteStyle.getRY()*xMet)
			.attr("fill", "white")
			.style("stroke", "black")
			.style("stroke-width", 2)
			.attr("transform","translate(15,130)");

		d3.select("#viz").select("#D3viz")
			.append("svg:text")
			.text('Metabolites')
			.attr('x', 20)
			.attr('y',15)
			.attr("transform","translate(30,140)");  
	    	    
		metExploreD3.GraphCaption.colorPathwayLegend(175);

	    metExploreD3.GraphCaption.colorMetaboliteLegend(175);
	    
	    d3.select("#viz").select("#D3viz")
			.select('#captionComparment')
			.classed('hide', true);

	    d3.select("#viz").select("#D3viz")
			.select('#captionPathway')
			.classed('hide', true);

		metExploreD3.GraphCaption.majCaption();
	},

	/*****************************************************
	* Maj caption
	*/
	majCaption : function(){
		var s_GeneralStyle = _metExploreViz.getGeneralStyle();
		
		var component = s_GeneralStyle.isDisplayedCaption();
		if(component=="Pathways"){
			d3.select("#viz").select("#D3viz")
				.select('#captionComparment')
				.classed('hide', true);

			d3.select("#viz").select("#D3viz")
				.select('#captionPathway')
				.classed('hide', false);
		}
		else
		{
			d3.select("#viz").select("#D3viz")
				.select('#captionComparment')
				.classed('hide', false);

			d3.select("#viz").select("#D3viz")
				.select('#captionPathway')
				.classed('hide', true);
		}
	},

	/*****************************************************
	* Draw caption of metabolic compartiments
    * @param {} top : top of the metabolite caption
	*/
	colorMetaboliteLegend : function(top){

		var caption =  d3.select("#viz").select("#D3viz")
	    	.append("svg:g")
			.attr('id', 'captionComparment')
			.attr("x1", 0)
			.attr("y1", 0)
			.attr("x2", 15)
			.attr("y2", 0);


        var networkData = _metExploreViz.getSessionById("viz").getD3Data();

    	// Load user's preferences
		var reactionStyle = metExploreD3.getReactionStyle();
		var maxDimRea = Math.max(reactionStyle.getWidth(),reactionStyle.getHeight());
		var xRea = 20/maxDimRea;
		
		var metaboliteStyle = metExploreD3.getMetaboliteStyle();
		var maxDimMet = Math.max(metaboliteStyle.getWidth(),metaboliteStyle.getHeight());
		var xMet = 20/maxDimMet;

		metExploreD3.sortCompartmentInBiosource();

		var phase = metExploreD3.getCompartmentInBiosourceLength();
        if (phase == undefined) phase = 0;
        center = 128;
        width = 127;
        frequency = Math.PI*2*0.95/phase;
        var position = top;

		position+=20;
        caption.append("svg:text")
			.text("Compartments :")
			.attr('x', 0)
			.attr('y', 0)
			.attr("transform","translate(15,"+position+")");

		position+=20;

        for (var i = 0; i < phase; i++)
        {

			red   = Math.sin(frequency*i+2+phase) * width + center;
			green = Math.sin(frequency*i+0+phase) * width + center;
			blue  = Math.sin(frequency*i+4+phase) * width + center;
	 
			var compartment = metExploreD3.getCompartmentInBiosourceSet()[i];
			compartment.setColor(metExploreD3.GraphUtils.RGB2Color(red,green,blue));
				
			var captionCompartment = caption.append("svg:g")
				.attr('id', compartment.getId())
				.on("mouseover", function(d) { 
			        var generalStyle = _metExploreViz.getGeneralStyle();
					var isDisplay = generalStyle.isDisplayedConvexhulls();

					if(isDisplay){	
					console.log("mouseover");
			        	var compart = networkData.getCompartmentById(this.id);
			        	console.log(compart);
			        	d3.select('.hideComponent'+this.id)
							.classed('hide', false)
							.select('.iconHideComponent')
							.attr(
							"xlink:href",
							function(d) {
								console.log("xlink");
			        
								if(compart.hidden())
									return "resources/icons/square.jpg";
								else
									return "resources/icons/check-square.svg";
							});

					}
			    })
		        .on("mouseleave", function(d) { 

					d3.select('.hideComponent'+this.id)
						.classed('hide', true);					
		        });

			var classImage = 'captionimage'+compartment.getId();
			captionCompartment.append("svg:line")
				.attr('class', 'metabolite')
				.attr('class', classImage)
				.attr("x1", 0)
				.attr("y1", 0)
				.attr("x2", 15)
				.attr("y2", 0)
				.style("stroke", compartment.getColor())
				.style("stroke-width", 2)
				.attr("transform","translate(15,"+position+")");

			position+=10;

			var classText = 'captiontext'+compartment.getId();

			captionCompartment.append("svg:text")
				.html(compartment.getName())
				.attr('class', classText)
				.attr('id', compartment.getId())
				.attr('x', 20)
				.attr('y', -6)
				.attr("transform","translate(30,"+position+")")

			classText = '.'+classText;
		    var textNodeDOM = captionCompartment.select(classText).node();
			var sizeTextNodeDOM =textNodeDOM.getComputedTextLength();
			var xhideComponent = 50 + sizeTextNodeDOM;

			// button to disable compartement & pathway
			var box = captionCompartment
				.append("svg")
				.attr(
					"viewBox",
					function(d) {
								+ " " + 10; }
				)
				.attr("width", 40)
				.attr("height",20)
				.attr("rx", 10)
				.attr("ry", 10)
				.attr("preserveAspectRatio", "xMinYMin")
				.attr("x", xhideComponent)
				.attr("y", position-20)
				.attr("id", compartment.getId())
				.attr("class", 'hideComponent'+compartment.getId())
				.classed('hide', true)
				.attr("transform","translate("+xhideComponent+","+position+")")
				.on("click", function(){
					var compart = networkData.getCompartmentById(this.id);

		        	compart.setHidden(!compart.hidden());

		        	if(compart.hidden())
		        	{
			        	d3.select('.captiontext'+compart.getId())
							.attr("opacity", 0.5)
			        	d3.select('.captionimage'+compart.getId())
							.attr("opacity", 0.3)
		        	}
		        	else
		        	{
		        		d3.select('.captiontext'+compart.getId())
							.attr("opacity", 1)
		        		d3.select('.captionimage'+compart.getId())
							.attr("opacity", 1)
		        	}

					d3.select("#viz").select("#D3viz").selectAll("path.convexhull")
					    .classed("hide", function(conv){
					    	var component = _metExploreViz.getSessionById("viz").getD3Data().getCompartmentByName(conv.key);
					    	return component.hidden();
					    })

		        	d3.select(this)
						.select('.iconHideComponent')
						.attr(
							"xlink:href",
							function(d) {
								if(compart.hidden())
									return "resources/icons/square.jpg";
								else
									return "resources/icons/check-square.svg";
						});

				});

			box.append("svg:rect")
				.attr("class", "backgroundHideComponent")
				.attr("height", 20)
				.attr("width", 40)
				.attr("rx", 5)
				.attr("ry", 5)
				.attr("opacity", "0");
			
			box.append("image")
				.attr("class", "iconHideComponent")
				.attr("y",0)
				.attr("x",0)
				.attr("width", "100%")
				.attr("height", "100%");

			position+=10;				
        }
    	
    },
	/*****************************************************
	* Draw caption of metabolic compartiments
    * @param {} top : top of the metabolite caption
	*/
	colorPathwayLegend : function(top){

		var groups = metExploreD3.getPathwaysSet();
		var pathways = [];

		var networkData = _metExploreViz.getSessionById("viz").getD3Data();

		groups.forEach(function(path){
			pathways.push({"key":path});
		});

		var phase = metExploreD3.getPathwaysLength();
        if (phase == undefined) phase = 0;
        center = 128;
        width = 127;
        frequency = Math.PI*2*0.95/phase;
		
		for (var i = 0; i < phase; i++)
        {

			red   = Math.sin(frequency*i+2+phase) * width + center;
			green = Math.sin(frequency*i+0+phase) * width + center;
			blue  = Math.sin(frequency*i+4+phase) * width + center;
	 
			var pathway = pathways[i].key;
			pathway.setColor(metExploreD3.GraphUtils.RGB2Color(red,green,blue));		
        }

		var caption =  d3.select("#viz").select("#D3viz")
	    	.append("svg:g")
			.attr('id', 'captionPathway')
			.attr("x1", 0)
			.attr("y1", 0)
			.attr("x2", 15)
			.attr("y2", 0);

    	// Load user's preferences
		var reactionStyle = metExploreD3.getReactionStyle();
		var maxDimRea = Math.max(reactionStyle.getWidth(),reactionStyle.getHeight());
		var xRea = 20/maxDimRea;
		
		var metaboliteStyle = metExploreD3.getMetaboliteStyle();
		var maxDimMet = Math.max(metaboliteStyle.getWidth(),metaboliteStyle.getHeight());
		var xMet = 20/maxDimMet;
		var session = _metExploreViz.getSessionById('viz');
		pathways.sort(function(a,b){
			if(a.key < b.key) return -1;
		    if(a.key > b.key) return 1;
		    return 0;
		});


		var phase = pathways.length;
        if (phase == undefined) phase = 0;
        center = 128;
        width = 127;
        frequency = Math.PI*2*0.95/phase;
        var position = top;

		position+=20;
        caption.append("svg:text")
			.text("Pathways :")
			.attr('x', 0)
			.attr('y', 0)
			.attr("transform","translate(15,"+position+")");

		position+=20;

        for (var i = 0; i < phase; i++)
        {

			red   = Math.sin(frequency*i+2+phase) * width + center;
			green = Math.sin(frequency*i+0+phase) * width + center;
			blue  = Math.sin(frequency*i+4+phase) * width + center;
	 
			var pathway = pathways[i].key;

			var captionPathway = caption.append("svg:g")
				.attr('id', pathway.getId())
				.on("mouseover", function(d) { 
			        var generalStyle = _metExploreViz.getGeneralStyle();
					var isDisplay = generalStyle.isDisplayedConvexhulls();

					if(isDisplay){	
			        	var compart = networkData.getPathwayById(this.id);
			        	console.log(compart);
			        	d3.select('.hideComponent'+this.id)
							.classed('hide', false)
							.select('.iconHideComponent')
							.attr(
							"xlink:href",
							function(d) {
								if(compart.hidden())
									return "resources/icons/square.jpg";
								else
									return "resources/icons/check-square.svg";
							});

					}
			    })
		        .on("mouseleave", function(d) { 

					d3.select('.hideComponent'+this.id)
						.classed('hide', true);					
		        });

		    

			var classImage = 'captionimage'+pathway.getId();
			captionPathway.append("svg:line")
				.attr('class', 'metabolite')
				.attr('class', classImage)
				.attr("x1", 0)
				.attr("y1", 0)
				.attr("x2", 15)
				.attr("y2", 0)
				.style("stroke", pathway.getColor())
				.style("stroke-width", 2)
				.attr("transform","translate(15,"+position+")");

			position+=10;

			var classText = 'captiontext'+pathway.getId();

			captionPathway.append("svg:text")
				.html(pathway.getName())
				.attr('class', classText)
				.attr('id', pathway.getId())
				.attr('x', 20)
				.attr('y', -6)
				.attr("transform","translate(30,"+position+")")

			classText = '.'+classText;
		    var textNodeDOM = captionPathway.select(classText).node();
			var sizeTextNodeDOM =textNodeDOM.getComputedTextLength();
			var xhideComponent = 50 + sizeTextNodeDOM;

			// button to disable compartement & pathway
			var box = captionPathway
				.append("svg")
				.attr(
					"viewBox",
					function(d) {
								+ " " + 10; }
				)
				.attr("width", 40)
				.attr("height",20)
				.attr("rx", 10)
				.attr("ry", 10)
				.attr("preserveAspectRatio", "xMinYMin")
				.attr("x", xhideComponent)
				.attr("y", position-20)
				.attr("id", pathway.getId())
				.attr("class", 'hideComponent'+pathway.getId())
				.classed('hide', true)
				.attr("transform","translate("+xhideComponent+","+position+")")
				.on("click", function(){
					var compart = networkData.getPathwayById(this.id);

		        	compart.setHidden(!compart.hidden());

		        	if(compart.hidden())
		        	{
			        	d3.select('.captiontext'+compart.getId())
							.attr("opacity", 0.5)
			        	d3.select('.captionimage'+compart.getId())
							.attr("opacity", 0.3)
		        	}
		        	else
		        	{
		        		d3.select('.captiontext'+compart.getId())
							.attr("opacity", 1)
		        		d3.select('.captionimage'+compart.getId())
							.attr("opacity", 1)
		        	}

					d3.select("#viz").select("#D3viz").selectAll("path.convexhull")
					    .classed("hide", function(conv){
					    	var component = _metExploreViz.getSessionById("viz").getD3Data().getPathwayByName(conv.key);
					    	return component.hidden();
					    })

		        	d3.select(this)
						.select('.iconHideComponent')
						.attr(
							"xlink:href",
							function(d) {
								if(compart.hidden())
									return "resources/icons/square.jpg";
								else
									return "resources/icons/check-square.svg";
						});

				});

			box.append("svg:rect")
				.attr("class", "backgroundHideComponent")
				.attr("height", 20)
				.attr("width", 40)
				.attr("rx", 5)
				.attr("ry", 5)
				.attr("opacity", "0");
			
			box.append("image")
				.attr("class", "iconHideComponent")
				.attr("y",0)
				.attr("x",0)
				.attr("width", "100%")
				.attr("height", "100%");

			position+=10;			
        }
    }
}
