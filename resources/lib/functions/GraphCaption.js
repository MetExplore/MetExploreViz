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
			.attr("transform", "translate(15,40)")
			.style("stroke",reactionStyle.getStrokeColor())
			.style("stroke-width", 2);

		d3.select("#viz").select("#D3viz")
			.select('.reactionCaptionRev')
			.attr('x', 15/2 - reactionStyle.getWidth()*xRea/2)
			.attr('y', 15 + 15/2 - reactionStyle.getHeight()*xRea/2)
			.attr("width", reactionStyle.getWidth()*xRea)
			.attr("height", reactionStyle.getHeight()*xRea)
			.attr("rx", reactionStyle.getRX()*xRea)
			.attr("ry", reactionStyle.getRY()*xRea)
			.style("stroke-dasharray", "2,2")
			.attr("fill", "white")
			.attr("transform", "translate(15,60)")
			.style("stroke",reactionStyle.getStrokeColor());
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
			.attr("transform","translate(15,95)");

	},
	/*****************************************************
	* Draw caption
	*/
	drawCaption : function(){
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
		d3.select("#viz").select("#D3viz")
			.append("svg:text")
			.attr('id', 'metexplore')
			.text('metExploreViz')
			.attr('x', $("#viz").width() - 130)
			.attr('y', $("#viz").height() - 10);

		d3
			.select("#viz")
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
			.attr('y', 15 + 15/2 - reactionStyle.getHeight()*xRea/2)
			.attr("width", reactionStyle.getWidth()*xRea)
			.attr("height", reactionStyle.getHeight()*xRea)
			.attr("rx", reactionStyle.getRX()*xRea)
			.attr("ry", reactionStyle.getRY()*xRea)
			.attr("fill", "white")
			.attr("transform", "translate(15,40)")
			.style("stroke",reactionStyle.getStrokeColor())
			.style("stroke-width", 2);

		d3.select("#viz").select("#D3viz")
			.append("svg:text")
			.text('Irreversible reaction')
			.attr('x', 20)
			.attr('y', 15)
			.attr("transform", "translate(30,50)");

		d3.select("#viz").select("#D3viz")
			.append("svg:rect")
			.attr('class', 'reactionCaptionRev')
			.attr('x', 15/2 - reactionStyle.getWidth()*xRea/2)
			.attr('y', 15 + 15/2 - reactionStyle.getHeight()*xRea/2)
			.attr("width", reactionStyle.getWidth()*xRea)
			.attr("height", reactionStyle.getHeight()*xRea)
			.attr("rx", reactionStyle.getRX()*xRea)
			.attr("ry", reactionStyle.getRY()*xRea)
			.style("stroke-dasharray", "2,2")
			.attr("fill", "white")
			.attr("transform", "translate(15,60)")
			.style("stroke",reactionStyle.getStrokeColor());

		d3.select("#viz").select("#D3viz")
			.append("svg:text")
			.text('Reversible reaction')
			.attr('x', 20)
			.attr('y', 15)
			.attr("transform", "translate(30,70)");
	

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
			.attr("transform","translate(15,95)");

		d3.select("#viz").select("#D3viz")
			.append("svg:text")
			.text('Metabolites')
			.attr('x', 20)
			.attr('y',15)
			.attr("transform","translate(30,105)");  
	    	    
	    metExploreD3.GraphCaption.colorMetaboliteLegend(140);
	    d3.select("#viz").select("#D3viz")
			.select('#captionComparment')
			.classed('hide', true);
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

			caption.append("svg:line")
				.attr('class', 'metabolite')
				.attr("x1", 0)
				.attr("y1", 0)
				.attr("x2", 15)
				.attr("y2", 0)
				.style("stroke", compartment.getColor())
				.style("stroke-width", 2)
				.attr("transform","translate(15,"+position+")");

			position+=10;

			caption.append("svg:text")
				.text(compartment.getName())
				.attr('x', 20)
				.attr('y', -6)
				.attr("transform","translate(30,"+position+")");

			position+=10;				
        }
    },
	/*****************************************************
	* Draw caption of metabolic compartiments
    * @param {} top : top of the metabolite caption
	*/
	colorPathwayLegend : function(top){

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
		session.groups.sort(function(a,b){
			if(a.key < b.key) return -1;
		    if(a.key > b.key) return 1;
		    return 0;
		});


		var phase = session.groups.length;
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
	 
			var group = session.groups[i];
			group.color=metExploreD3.GraphUtils.RGB2Color(red,green,blue);

			caption.append("svg:line")
				.attr('class', 'metabolite')
				.attr("x1", 0)
				.attr("y1", 0)
				.attr("x2", 15)
				.attr("y2", 0)
				.style("stroke", group.color)
				.style("stroke-width", 2)
				.attr("transform","translate(15,"+position+")");

			position+=10;

			caption.append("svg:text")
				.text(group.key)
				.attr('x', 20)
				.attr('y', -6)
				.attr("transform","translate(30,"+position+")");

			position+=10;				
        }
    }
}
