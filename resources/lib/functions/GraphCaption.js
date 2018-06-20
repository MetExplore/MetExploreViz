/**
 * @author MC
 * (a)description : Drawing caption
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
        // Ajout
        d3.select("#viz")
            .select("#D3viz")
            .select(".logoViz")
            .remove();
        d3.select("#viz")
            .select("#D3viz")
            .selectAll(".linkCaptionRev")
            .remove();
        d3.select("#viz")
            .select("#D3viz")
            .selectAll(".reactionCaption")
            .remove();
        d3.select("#viz")
            .select("#D3viz")
            .selectAll(".textCaptionRev")
            .remove();
        // Fin Ajout

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
            .attr('class', 'textCaptionRev')
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
            .attr('class', 'textCaptionRev')
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
            .attr('class', 'textCaptionRev')
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
            .attr('class', 'textCaptionRev')
            .text('Metabolites')
            .attr('x', 20)
            .attr('y',15)
            .attr("transform","translate(30,140)");

    },

    /*****************************************************
     * Draw caption
     */
    drawCaptionEditMode : function(){
        d3.select("#viz")
            .select("#D3viz")
            .select(".logoViz")
            .remove();
        d3.select("#viz")
            .select("#D3viz")
            .selectAll(".linkCaptionRev")
            .remove();
        d3.select("#viz")
            .select("#D3viz")
            .selectAll(".reactionCaption")
            .remove();
        d3.select("#viz")
            .select("#D3viz")
            .selectAll(".textCaptionRev")
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
        var linkStyle = metExploreD3.getLinkStyle();
        var path1 = "M"+(50 + 15/2 - reactionStyle.getWidth()*xRea/2 - reactionStyle.getWidth()*xRea)+","+sy+
            "L"+sx+","+sy;
        var path2 = "M"+(50 + 15/2 - reactionStyle.getWidth()*xRea/2)+","+sy+
            "L"+(sx+90)+","+sy;

        d3.select("#viz").select("#D3viz").append("defs").append("marker")
            .attr("id", "markerCaptionEntry")
            .attr("viewBox", "-10 -5 20 20")
            .attr("refX", 9)
            .attr("refY", 6)
            .attr("markerUnits", "userSpaceOnUse")
            .attr("markerWidth", 30)
            .attr("markerHeight", 20)
            .attr("orient", "auto")
            .attr("fill", "red")
            .attr("stroke", "black")
            .append("path")
            .attr("d", "M0,6L-5,12L9,6L-5,0L0,6");
        d3.select("#viz").select("#D3viz").append("defs").append("marker")
            .attr("id", "markerCaptionExit")
            .attr("viewBox", "-10 -5 20 20")
            .attr("refX", 9)
            .attr("refY", 6)
            .attr("markerUnits", "userSpaceOnUse")
            .attr("markerWidth", 30)
            .attr("markerHeight", 20)
            .attr("orient", "auto")
            .attr("fill", "green")
            .attr("stroke", "black")
            .append("path")
            .attr("d", "M0,6L-5,12L9,6L-5,0L0,6");

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
            .attr("transform", "translate(50,"+(40-(reactionStyle.getHeight()*xRea /2))+")")
            .style("stroke",reactionStyle.getStrokeColor())
            .style("stroke-width", 2);

        d3.select("#viz").select("#D3viz")
            .append("svg:path")
            .attr("class", String)
            .attr("d",path1)
            .attr("class", 'linkCaptionRev')
            .attr("fill-rule", "evenodd")
            .attr("fill", 'white')
            .style("stroke",linkStyle.getStrokeColor())
            .style("stroke-width", 1.5)
            .style("stroke-linejoin", "bevel")
            .attr("transform","translate(15,40)");

        d3.select("#viz").select("#D3viz")
            .append("svg:path")
            .attr("class", String)
            .attr("d",path2)
            .attr("class", 'linkCaptionRev')
            .attr("fill-rule", "evenodd")
            .attr("fill", 'white')
            .style("stroke",linkStyle.getStrokeColor())
            .style("stroke-width", 1.5)
            .style("stroke-linejoin", "bevel")
            .attr("transform","translate(15,40)")
            .attr("marker-end", "url(#markerCaptionExit)");

        d3.select("#viz").select("#D3viz")
            .append("svg:text")
            .text('Reaction')
            .attr('class', 'textCaptionRev')
            .attr('x', 20)
            .attr('y', 15)
            .attr("transform", "translate(0,65)");

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
            .attr("transform", "translate(50,"+(85-(reactionStyle.getHeight()*xRea /2))+")")
            .style("stroke",reactionStyle.getStrokeColor())
            .style("stroke-width", 2);

        d3.select("#viz").select("#D3viz")
            .append("svg:path")
            .attr("class", String)
            .attr("d",path1)
            .attr("class", 'linkCaptionRev')
            .attr("fill-rule", "evenodd")
            .attr("fill", 'white')
            .style("stroke",linkStyle.getStrokeColor())
            .style("stroke-width", 1.5)
            .style("stroke-linejoin", "bevel")
            .attr("transform","translate(15,85)")
            .attr("marker-end", "url(#markerCaptionEntry)");

        d3.select("#viz").select("#D3viz")
            .append("svg:path")
            .attr("class", String)
            .attr("d",path2)
            .attr("class", 'linkCaptionRev')
            .attr("fill-rule", "evenodd")
            .attr("fill", 'white')
            .style("stroke",linkStyle.getStrokeColor())
            .style("stroke-width", 1.5)
            .style("stroke-linejoin", "bevel")
            .attr("transform","translate(15,85)")
            .attr("marker-end", "url(#markerCaptionExit)");

        d3.select("#viz").select("#D3viz")
            .append("svg:text")
            .attr('class', 'textCaptionRev')
            .text('Reversible reaction')
            .attr('x', 20)
            .attr('y', 15)
            .attr("transform", "translate(0,110)");



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
            .attr('class', 'textCaptionRev')
            .text('Metabolites')
            .attr('x', 20)
            .attr('y',15)
            .attr("transform","translate(30,140)");

    },

    /*****************************************************
     * Maj caption
     */
    majCaption : function(){
        var s_GeneralStyle = _metExploreViz.getGeneralStyle();

        var isDisplay = s_GeneralStyle.isDisplayedConvexhulls();
        d3.select("#viz").select("#D3viz").selectAll('.iconHideComponent')
            .classed("hide", !isDisplay);

        var component = s_GeneralStyle.isDisplayedCaption();
        if(component=="Pathways"){

            d3.select("#viz").select("#D3viz").selectAll("path.convexhull")
                .classed("hide", function(conv){
                    var component = _metExploreViz.getSessionById("viz").getD3Data().getPathwayByName(conv.key);
                    if(component)
                        return component.hidden();
                    return true;
                })
        }
        else
        {
            d3.select("#viz").select("#D3viz").selectAll("path.convexhull")
                .classed("hide", function(conv){
                    var component = _metExploreViz.getSessionById("viz").getD3Data().getCompartmentByName(conv.key);
                    if(component)
                        var hidden = component.hidden();
                    else	var hidden = true;
                    return hidden;
                })
        }
    },

    /*****************************************************
     * Maj caption color
     */
    majCaptionColor : function(components, selectedComponent){

        var generalStyle = _metExploreViz.getGeneralStyle();
        var isDisplay = generalStyle.isDisplayedConvexhulls();

        if(selectedComponent == isDisplay){
            d3.select("#viz").select("#D3viz").selectAll("path.convexhull")
                .style("fill",
                    function(d){
                        var component = components.find(function(c){
                            return c.name==d.key;
                        });
                        return component.color;
                    }
                )
                .style("stroke", function(d){
                    var component = components.find(function(c){
                        return c.name==d.key;
                    });

                    return component.color;
                });
        }

        switch(selectedComponent) {
            case "Compartments":
                metExploreD3.GraphNode.colorStoreByCompartment(metExploreD3.GraphNode.node);
                break;
            default:
            // generalStyle.setDisplayCaption(false);
            // metExploreD3.GraphCaption.majCaption();
        }

    },

    /*****************************************************
     * Draw caption of metabolic compartiments
     * @param {} top : top of the metabolite caption
     */
    colorMetaboliteLegend : function(){
        // Load user's preferences
        var reactionStyle = metExploreD3.getReactionStyle();


        var metaboliteStyle = metExploreD3.getMetaboliteStyle();

        metExploreD3.sortCompartmentInBiosource();

        var phase = metExploreD3.getCompartmentInBiosourceLength();
        if (phase == undefined) phase = 0;
        center = 128;
        width = 127;
        frequency = Math.PI*2*0.95/phase;

        for (var i = 0; i < phase; i++)
        {
            red   = Math.sin(frequency*i+2+phase) * width + center;
            green = Math.sin(frequency*i+0+phase) * width + center;
            blue  = Math.sin(frequency*i+4+phase) * width + center;

            var compartment = metExploreD3.getCompartmentInBiosourceSet()[i];
            compartment.setColor(metExploreD3.GraphUtils.RGB2Color(red,green,blue));

        }
        metExploreD3.fireEvent("captionFormCompartments", "afterColorCalculating");
    },
    /*****************************************************
     * Draw caption of metabolic compartiments
     * @param {} top : top of the metabolite caption
     */
    colorPathwayLegend : function(){
        var groups = metExploreD3.getPathwaysSet();
        var pathways = [];

        groups.forEach(function(path){
            pathways.push({"key":path});
        });

        var phase = metExploreD3.getPathwaysLength();
        if (phase == undefined) phase = 0;
        center = 128;
        width = 127;
        frequency = Math.PI*2*0.95/phase;

        pathways.sort(function(a,b){
            if(a.key < b.key) return -1;
            if(a.key > b.key) return 1;
            return 0;
        });

        for (var i = 0; i < phase; i++)
        {

            red   = Math.sin(frequency*i+2+phase) * width + center;
            green = Math.sin(frequency*i+0+phase) * width + center;
            blue  = Math.sin(frequency*i+4+phase) * width + center;

            var pathway = pathways[i].key;
            pathway.setColor(metExploreD3.GraphUtils.RGB2Color(red,green,blue));
        }
        metExploreD3.fireEvent("captionFormPathways", "afterColorCalculating");
    }
}
    
