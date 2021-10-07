/**
 * @class metExploreD3.GraphCaption
 * Drawing caption
 * Add update convexhulls
 * @author MC
 * @uses metExploreD3.GraphNode
 * @uses metExploreD3.GraphUtils
 */

metExploreD3.GraphCaption = {

    /*****************************************************
     * Draw caption
     */
    drawCaption : function(){
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
        d3.select("#viz")
            .select("#D3viz")
            .select(".logoViz")
            .remove();
        d3.select("#viz")
            .select("#D3viz")
            .selectAll(".metaboliteCaption")
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

        if(d3.select("#viz")
                .select("#D3viz")
                .select("#logoViz")){
            var logo = d3.select("#viz")
                .select("#D3viz")
                .append("svg:g")
                .attr("class","logoViz").attr("id","logoViz")

            logo.append("image")
                .attr("xlink:href", "resources/icons/metExploreViz_Logo.svg")
                .attr("width", "75")
                .attr("height", "75")
                .attr('x', $("#viz").width() - 124)
                .attr('y', $("#viz").height() - 100);



            logo.append("svg:text")
                .attr('id', 'metexplore')
                .text('MetExploreViz v'+Ext.manifest.version)
                .attr('x', $("#viz").width() - 150)
                .attr('y', $("#viz").height() - 10);

        }

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
            .style("stroke", "#000000")
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
     * Draw caption for edit mode
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
        d3.select("#viz")
            .select("#D3viz")
            .selectAll(".metaboliteCaption")
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
            .attr("stroke", "#000000")
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
            .attr("stroke", "#000000")
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

        if(d3.select("#viz")
                .select("#D3viz")
                .select("#logoViz")){
            var logo = d3.select("#viz")
                .select("#D3viz")
                .append("svg:g")
                .attr("class","logoViz").attr("id","logoViz")

            logo.append("image")
                .attr("xlink:href", "resources/icons/metExploreViz_Logo.svg")
                .attr("width", "75")
                .attr("height", "75")
                .attr('x', $("#viz").width() - 124)
                .attr('y', $("#viz").height() - 100);

            logo.append("svg:text")
                .attr('id', 'metexplore')
                .text('MetExploreViz v'+Ext.manifest.version)
                .attr('x', $("#viz").width() - 150)
                .attr('y', $("#viz").height() - 10);

        }

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
            .style("stroke", "#000000")
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
     * Draw caption for flux mode 1 value
     */
    drawCaptionFluxMode : function(){
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
        d3.select("#viz")
            .select("#D3viz")
            .selectAll(".metaboliteCaption")
            .remove();

        // Load user's preferences
        var color = document.getElementById("html5colorpickerFlux1").value;

        var reactionStyle = metExploreD3.getReactionStyle();
        var maxDimRea = Math.max(reactionStyle.getWidth(),reactionStyle.getHeight());
        var xRea = 15/maxDimRea;

        var metaboliteStyle = metExploreD3.getMetaboliteStyle();
        var maxDimMet = Math.max(metaboliteStyle.getWidth(),metaboliteStyle.getHeight());
        var xMet = 15/maxDimMet;

        // This part create the legend of the representation and
        // add a mention to Metexplore in the right bottom
        // corner
        var sx = 15/2 - reactionStyle.getWidth()*xRea/2;
        var sy = 15;
        var linkStyle = metExploreD3.getLinkStyle();
        var path1 = "M"+(50 + 15/2 - reactionStyle.getWidth()*xRea/2 - reactionStyle.getWidth()*xRea)+","+sy+
            "L"+sx+","+sy;
        var path2 = "M"+(50 + 15/2 - reactionStyle.getWidth()*xRea/2)+","+sy+
            "L"+(sx+90)+","+sy;
        var path3 = "M"+(50 + 15/2 - reactionStyle.getWidth()*xRea/2)+","+sy+
            "L"+(sx+80)+","+sy+"L"+(sx+80)+","+(sy-5)+"L"+(sx+90)+","+sy+"L"+
            (sx+80)+","+(sy+5)+"L"+(sx+80)+","+sy;
        var path4 = "M"+(50 + 15/2 - reactionStyle.getWidth()*xRea/2 - reactionStyle.getWidth()*xRea)+","+sy+
            "L"+(sx+10)+","+sy+
            "L"+(sx+10)+","+(sy-5)+
            "L"+sx+","+sy+
            "L"+(sx+10)+","+(sy+5)+
            "L"+(sx+10)+","+sy;

        // Reaction without flux data
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
            .attr("d",path3)
            .attr("class", 'linkCaptionRev')
            .attr("fill-rule", "evenodd")
            .attr("fill", 'white')
            .style("stroke",linkStyle.getStrokeColor())
            .style("stroke-width", 1.5)
            .style("stroke-linejoin", "bevel")
            .attr("transform","translate(15,40)");

        d3.select("#viz").select("#D3viz")
            .append("svg:text")
            .text('Reaction without flux data')
            .attr('class', 'textCaptionRev')
            .attr('x', 20)
            .attr('y', 15)
            .attr("transform", "translate(0,65)");


        // Reaction with flux data
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
            .style("stroke",color)
            .style("stroke-width", 1.5)
            .style("stroke-linejoin", "bevel")
            .attr("transform","translate(15,85)");

        d3.select("#viz").select("#D3viz")
            .append("svg:path")
            .attr("class", String)
            .attr("d",path3)
            .attr("class", 'linkCaptionRev')
            .attr("fill-rule", "evenodd")
            .attr("fill", 'white')
            .style("stroke",color)
            .style("stroke-width", 1.5)
            .style("stroke-linejoin", "bevel")
            .attr("transform","translate(15,85)");

        d3.select("#viz").select("#D3viz")
            .append("svg:text")
            .text('Reaction with flux data')
            .attr('class', 'textCaptionRev')
            .attr('x', 20)
            .attr('y', 15)
            .attr("transform", "translate(0,110)");


        // Reaction with null value
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
            .attr("transform", "translate(50,"+(130-(reactionStyle.getHeight()*xRea /2))+")")
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
            .style("stroke", "blue")
            .style("stroke-dasharray",8)
            .attr("transform","translate(15,130)");

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
            .style("stroke", "blue")
            .style("stroke-dasharray",8)
            .attr("transform","translate(15,130)");

        d3.select("#viz").select("#D3viz")
            .append("svg:text")
            .attr('class', 'textCaptionRev')
            .text('Reaction with 0 flux')
            .attr('x', 20)
            .attr('y', 15)
            .attr("transform", "translate(0,155)");

        if(d3.select("#viz")
                .select("#D3viz")
                .select("#logoViz")){
            var logo = d3.select("#viz")
                .select("#D3viz")
                .append("svg:g")
                .attr("class","logoViz").attr("id","logoViz")

            logo.append("image")
                .attr("xlink:href", "resources/icons/metExploreViz_Logo.svg")
                .attr("width", "75")
                .attr("height", "75")
                .attr('x', $("#viz").width() - 124)
                .attr('y', $("#viz").height() - 100);

            logo.append("svg:text")
                .attr('id', 'metexplore')
                .text('MetExploreViz v'+Ext.manifest.version)
                .attr('x', $("#viz").width() - 150)
                .attr('y', $("#viz").height() - 10);

        }

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
            .style("stroke", "#000000")
            .style("stroke-width", 2)
            .attr("transform","translate(15,200)");

        d3.select("#viz").select("#D3viz")
            .append("svg:text")
            .attr('class', 'textCaptionRev')
            .text('Metabolites')
            .attr('x', 20)
            .attr('y',15)
            .attr("transform","translate(30,210)");

    },

    /*****************************************************
     * Draw caption for flux mode 2 value
     */
    drawCaptionTwoFluxMode : function(){
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
        d3.select("#viz")
            .select("#D3viz")
            .selectAll(".metaboliteCaption")
            .remove();

        // Load user's preferences
        var color1 = document.getElementById('html5colorpickerFlux1').value;
        var color2 = document.getElementById('html5colorpickerFlux2').value;

        var reactionStyle = metExploreD3.getReactionStyle();
        var maxDimRea = Math.max(reactionStyle.getWidth(),reactionStyle.getHeight());
        var xRea = 15/maxDimRea;

        var metaboliteStyle = metExploreD3.getMetaboliteStyle();
        var maxDimMet = Math.max(metaboliteStyle.getWidth(),metaboliteStyle.getHeight());
        var xMet = 15/maxDimMet;

        // This part create the legend of the representation and
        // add a mention to Metexplore in the right bottom
        // corner
        var sx = 15/2 - reactionStyle.getWidth()*xRea/2;
        var sy = 15;
        var linkStyle = metExploreD3.getLinkStyle();
        var path1 = "M"+(50 + 15/2 - reactionStyle.getWidth()*xRea/2 - reactionStyle.getWidth()*xRea)+","+sy+
            "L"+sx+","+sy;
        var path2 = "M"+(50 + 15/2 - reactionStyle.getWidth()*xRea/2)+","+sy+
            "L"+(sx+90)+","+sy;
        var path3 = "M"+(50 + 15/2 - reactionStyle.getWidth()*xRea/2)+","+sy+
            "L"+(sx+80)+","+sy+"L"+(sx+80)+","+(sy-5)+"L"+(sx+90)+","+sy+"L"+
            (sx+80)+","+(sy+5)+"L"+(sx+80)+","+sy;
        var path4 = "M"+(50 + 15/2 - reactionStyle.getWidth()*xRea/2 - reactionStyle.getWidth()*xRea)+","+sy+
            "L"+(sx+10)+","+sy+
            "L"+(sx+10)+","+(sy-5)+
            "L"+sx+","+sy+
            "L"+(sx+10)+","+(sy+5)+
            "L"+(sx+10)+","+sy;

        // Reaction without flux data
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
            .attr("d",path3)
            .attr("class", 'linkCaptionRev')
            .attr("fill-rule", "evenodd")
            .attr("fill", 'white')
            .style("stroke",linkStyle.getStrokeColor())
            .style("stroke-width", 1.5)
            .style("stroke-linejoin", "bevel")
            .attr("transform","translate(15,40)");

        d3.select("#viz").select("#D3viz")
            .append("svg:text")
            .text('Reaction without flux data')
            .attr('class', 'textCaptionRev')
            .attr('x', 20)
            .attr('y', 15)
            .attr("transform", "translate(0,65)");


        // Reaction first condition
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
            .style("stroke",color1)
            .style("stroke-width", 1.5)
            .style("stroke-linejoin", "bevel")
            .attr("transform","translate(15,85)");

        d3.select("#viz").select("#D3viz")
            .append("svg:path")
            .attr("class", String)
            .attr("d",path3)
            .attr("class", 'linkCaptionRev')
            .attr("fill-rule", "evenodd")
            .attr("fill", 'white')
            .style("stroke",color1)
            .style("stroke-width", 1.5)
            .style("stroke-linejoin", "bevel")
            .attr("transform","translate(15,85)");

        d3.select("#viz").select("#D3viz")
            .append("svg:text")
            .text('Reaction with first condition value')
            .attr('class', 'textCaptionRev')
            .attr('x', 20)
            .attr('y', 15)
            .attr("transform", "translate(0,110)");

        // Reaction second condition
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
            .attr("transform", "translate(50,"+(130-(reactionStyle.getHeight()*xRea /2))+")")
            .style("stroke",reactionStyle.getStrokeColor())
            .style("stroke-width", 2);

        d3.select("#viz").select("#D3viz")
            .append("svg:path")
            .attr("class", String)
            .attr("d",path1)
            .attr("class", 'linkCaptionRev')
            .attr("fill-rule", "evenodd")
            .attr("fill", 'white')
            .style("stroke",color2)
            .style("stroke-width", 1.5)
            .style("stroke-linejoin", "bevel")
            .attr("transform","translate(15,130)");

        d3.select("#viz").select("#D3viz")
            .append("svg:path")
            .attr("class", String)
            .attr("d",path3)
            .attr("class", 'linkCaptionRev')
            .attr("fill-rule", "evenodd")
            .attr("fill", 'white')
            .style("stroke",color2)
            .style("stroke-width", 1.5)
            .style("stroke-linejoin", "bevel")
            .attr("transform","translate(15,130)");

        d3.select("#viz").select("#D3viz")
            .append("svg:text")
            .text('Reaction with second condition value')
            .attr('class', 'textCaptionRev')
            .attr('x', 20)
            .attr('y', 15)
            .attr("transform", "translate(0,155)");


        // Reaction with null value
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
            .attr("transform", "translate(50,"+(175-(reactionStyle.getHeight()*xRea /2))+")")
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
            .style("stroke", "black")
            .style("stroke-dasharray",8)
            .attr("transform","translate(15,175)");

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
            .style("stroke", "black")
            .style("stroke-dasharray",8)
            .attr("transform","translate(15,175)");

        d3.select("#viz").select("#D3viz")
            .append("svg:text")
            .attr('class', 'textCaptionRev')
            .text('Reaction with 0 flux')
            .attr('x', 20)
            .attr('y', 15)
            .attr("transform", "translate(0,200)");

        if(d3.select("#viz")
                .select("#D3viz")
                .select("#logoViz")){
            var logo = d3.select("#viz")
                .select("#D3viz")
                .append("svg:g")
                .attr("class","logoViz").attr("id","logoViz")

            logo.append("image")
                .attr("xlink:href", "resources/icons/metExploreViz_Logo.svg")
                .attr("width", "75")
                .attr("height", "75")
                .attr('x', $("#viz").width() - 124)
                .attr('y', $("#viz").height() - 100);

            logo.append("svg:text")
                .attr('id', 'metexplore')
                .text('MetExploreViz v'+Ext.manifest.version)
                .attr('x', $("#viz").width() - 150)
                .attr('y', $("#viz").height() - 10);

        }

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
            .style("stroke", "#000000")
            .style("stroke-width", 2)
            .attr("transform","translate(15,230)");

        d3.select("#viz").select("#D3viz")
            .append("svg:text")
            .attr('class', 'textCaptionRev')
            .text('Metabolites')
            .attr('x', 20)
            .attr('y',15)
            .attr("transform","translate(30,240)");

    },

    /*****************************************************
     * Draw caption for GIR
     */
    drawCaptionGirMode: function(){
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
        d3.select("#viz")
            .select("#D3viz")
            .selectAll(".metaboliteCaption")
            .remove();

        // MetaboRank out < 25
        d3.select("#viz").select("#D3viz")
            .append("svg:rect")
            .attr("class", "metaboliteCaption")
            .attr("width", 14)
            .attr("height", 14)
            .attr("rx", 7)
            .attr("ry", 7)
            .attr("fill","white")
            .attr("stroke-width", 3)
            .attr("stroke", "red")
            .attr("transform","translate(20,45)");

        d3.select("#viz").select("#D3viz")
            .append("svg:text")
            .text("MetaboRank out < 25")
            .attr("class","textCaptionRev")
            .attr("transform","translate(40,60)");

        // MetaboRank in < 25
        d3.select("#viz").select("#D3viz")
            .append("svg:rect")
            .attr("class", "metaboliteCaption")
            .attr("width", 14)
            .attr("height", 14)
            .attr("rx", 7)
            .attr("ry", 7)
            .attr("fill","white")
            .attr("stroke-width", 3)
            .attr("stroke", "green")
            .attr("transform","translate(20,70)");

        d3.select("#viz").select("#D3viz")
            .append("svg:text")
            .text("MetaboRank in < 25")
            .attr("class","textCaptionRev")
            .attr("transform","translate(40,85)");

        // MetaboRank in && out < 25
        d3.select("#viz").select("#D3viz")
            .append("svg:rect")
            .attr("class", "metaboliteCaption")
            .attr("width", 14)
            .attr("height", 14)
            .attr("rx", 7)
            .attr("ry", 7)
            .attr("fill","white")
            .attr("stroke-width", 3)
            .attr("stroke", "purple")
            .attr("transform","translate(20,95)");

        d3.select("#viz").select("#D3viz")
            .append("svg:text")
            .text("MetaboRank in < 25 & MetaboRank out < 25")
            .attr("class","textCaptionRev")
            .attr("transform","translate(40,110)");

        // starting node
        d3.select("#viz").select("#D3viz")
            .append("svg:rect")
            .attr("class", "metaboliteCaption")
            .attr("width", 14)
            .attr("height", 14)
            .attr("rx", 7)
            .attr("ry", 7)
            .attr("fill","white")
            .attr("stroke-width", 5)
            .attr("stroke", "#00aa00")
            .attr("stroke-opacity",0.4)
            .attr("transform","translate(20,120)");

        d3.select("#viz").select("#D3viz")
            .append("svg:text")
            .text("Starting node")
            .attr("class","textCaptionRev")
            .attr("transform","translate(40,135)");

        // MetaboRank in & out > 25
        d3.select("#viz").select("#D3viz")
            .append("svg:rect")
            .attr("class", "metaboliteCaption")
            .attr("width", 14)
            .attr("height", 14)
            .attr("rx", 7)
            .attr("ry", 7)
            .attr("fill","white")
            .attr("stroke-width", 2)
            .attr("stroke", "black")
            .attr("transform","translate(20,145)");

        d3.select("#viz").select("#D3viz")
            .append("svg:text")
            .text("MetaboRank in > 25 & MetaboRank out > 25")
            .attr("class","textCaptionRev")
            .attr("transform","translate(40,160)");

        // side compounds
        d3.select("#viz").select("#D3viz")
            .append("svg:rect")
            .attr("class", "metaboliteCaption")
            .attr("width", 7)
            .attr("height", 7)
            .attr("rx", 3.5)
            .attr("ry", 3.5)
            .attr("fill","white")
            .attr("stroke-width", "3px")
            .attr("stroke", "grey")
            .attr("transform","translate(20,170)");

        d3.select("#viz").select("#D3viz")
            .append("svg:text")
            .text("Side compounds")
            .attr("class","textCaptionRev")
            .attr("transform","translate(40,185)");

        // Visited node
        d3.select("#viz").select("#D3viz")
            .append("svg:rect")
            .attr("class", "metaboliteCaption")
            .attr("width", 14)
            .attr("height", 14)
            .attr("rx", 7)
            .attr("ry", 7)
            .attr("fill","black")
            .attr("stroke-width", 3)
            .attr("stroke", "green")
            .attr("transform","translate(20,195)");

        d3.select("#viz").select("#D3viz")
            .append("svg:text")
            .text("Visited nodes")
            .attr("class","textCaptionRev")
            .attr("transform","translate(40,210)");

        // Number of reaction hidden
        d3.select("#viz").select("#D3viz")
            .append("svg:path")
            .attr('class', 'textCaptionRev')
            .style("fill", "rgb(255, 73, 73)")
            .style("opacity", "1")
            .style("stroke", "black")
            .attr("d", "M 7, 0" +
                "       L7, 0" +
                "       a 7,7 0 0,1 0,14        " +
                "       L 7, 14       " +
                "       L0,14       " +
                "       L0,7 " +
                "       a 7,7 0 0,1 7,-7")
            .attr("transform", "translate(20,220)");

        d3.select("#viz").select("#D3viz")
            .append("svg:text")
            .text("Number of reactions not expanded from this metabolite")
            .attr("class","textCaptionRev")
            .attr("transform","translate(40,235)");

        if(d3.select("#viz")
                .select("#D3viz")
                .select("#logoViz")){
            var logo = d3.select("#viz")
                .select("#D3viz")
                .append("svg:g")
                .attr("class","logoViz").attr("id","logoViz")

            logo.append("image")
                .attr("xlink:href", "resources/icons/metExploreViz_Logo.svg")
                .attr("width", "75")
                .attr("height", "75")
                .attr('x', $("#viz").width() - 124)
                .attr('y', $("#viz").height() - 100);

            logo.append("svg:text")
                .attr('id', 'metexplore')
                .text('MetExploreViz v'+Ext.manifest.version)
                .attr('x', $("#viz").width() - 150)
                .attr('y', $("#viz").height() - 10);

        }
    },

    /*****************************************************
     * remove caption for gir
     */

    delCaption: function(){
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
        d3.select("#viz")
            .select("#D3viz")
            .selectAll(".metaboliteCaption")
            .remove();
    },

    /*****************************************************
     * Maj caption for convex hulls
     * @param {String} panel Panel to update convex hull
     */
    majCaption : function(panel){
        var s_GeneralStyle = _metExploreViz.getGeneralStyle();

        var component = s_GeneralStyle.isDisplayedCaption();


        if(component=="Pathways") {
            d3.select("#" + panel).select("#D3viz").selectAll("path.convexhull")
                .classed("hide", function (conv) {
                    var thecomponent = _metExploreViz.getSessionById(panel).getD3Data().getPathwayByName(conv.key);
                    if (thecomponent) {
                        return thecomponent.hidden() || thecomponent.isCollapsed();
                    }

                    return true;
                });
        }
        else
        {
            d3.select("#"+panel).select("#D3viz").selectAll("path.convexhull")
                .classed("hide", function(conv){
                    var component = _metExploreViz.getSessionById("viz").getD3Data().getCompartmentByName(conv.key);
                    if(component)
                        var hidden = component.hidden();
                    else	var hidden = true;
                    return hidden;
                });
        }
    },

    /*****************************************************
     * Maj caption of link to display pathways
     */
    majCaptionPathwayOnLink : function(){

        var activePanel = _MyThisGraphNode.activePanel;
        if(!activePanel) activePanel='viz';

        metExploreD3.applyTolinkedNetwork(
            activePanel,
            function(panelLinked, sessionLinked) {
                var s_GeneralStyle = _metExploreViz.getGeneralStyle();

                var isDisplayedPathwaysOnLinks = s_GeneralStyle.isDisplayedPathwaysOnLinks();
                d3.select("#"+panelLinked).select("#D3viz").select("#graphComponent").selectAll("path.link.pathway").remove();
                d3.select("#"+panelLinked).select("#D3viz").select("#graphComponent").selectAll("path.link.reaction")
                    .each(function(link){
                        var me = this;
                        var cols = [];
                        var component;
                        if(link.getSource().getBiologicalType()==="reaction")
                            component=link.getSource();

                        if(link.getTarget().getBiologicalType()==="reaction")
                            component=link.getTarget();

                        if(link.getSource().getBiologicalType()==="pathway")
                            component=link.getSource();

                        if(link.getTarget().getBiologicalType()==="pathway")
                            component=link.getTarget();

                        if(component){
                            if(component.getPathways().length>0)
                            {
                                var color="#000000";
                                component.getPathways().forEach(function(path){
                                    var pathw = _metExploreViz.getSessionById(panelLinked).getD3Data().getPathwayByName(path);
                                    if(pathw!==null) {
                                        if( !pathw.hidden() && isDisplayedPathwaysOnLinks ){
                                            var col = metExploreD3.GraphUtils.hexToRGB(pathw.getColor());
                                            col["o"]=0.15;
                                            cols.push(pathw);

                                            if (color === "#000000") {
                                                color = col;
                                            }
                                        }
                                    }
                                });

                                if(cols.length>0){
                                    var percent = 100 / cols.length;
                                    cols.forEach(function(pathw, i){
                                        var newelemt = me.cloneNode(true);
                                        me.parentNode.appendChild(newelemt);
                                        var size = 8;
                                        d3.select(newelemt).datum(link)
                                            .classed("reaction", false)
                                            .classed("pathway", true)
                                            .attr('id', pathw.getName().replace(/[.*+?^${} ()|[\]\-\\]/g, ""))
                                            .style("stroke-width","3px")
                                            .style("stroke-dasharray", size+","+size*(cols.length-1))
                                            .style("stroke-dashoffset", size*i)
                                            .style("stroke", pathw.getColor());

                                    })
                                    //me.parentNode.removeChild(me);
                                }
                                //if( metExploreD3.GraphUtils.RGB2Color(color.r, color.g, color.b)!="#000000") d3.select(this).style("stroke-width","3px")
                                // return metExploreD3.GraphUtils.RGB2Color(color.r, color.g, color.b);
                            }
                        }
                    });


                d3.select("#"+panelLinked).select("#D3viz").selectAll(".linkGroup")
                    .each(function(linkGroup){

                        var size = 8;
                        var visibleLinks = d3.select(this).selectAll("path.link.pathway");

                        visibleLinks
                            .style("stroke-dasharray", size+","+size*(visibleLinks.size()-1))
                            .style("stroke-dashoffset", function(l, i){
                                return size*i;
                            })
                    })
            });
    },

    /*****************************************************
     * Maj caption color for convex hulls and links
     * @param {Object} components Component to update
     * @param {"Compartments"|"Pathways"} selectedComponent
     * @param {String} panel Panel to update convex hull
     */
    majCaptionColor : function(components, selectedComponent, panel){
        var generalStyle = _metExploreViz.getGeneralStyle();
        var isDisplay = generalStyle.isDisplayedConvexhulls();

        if(selectedComponent === isDisplay){
             d3.select("#"+panel).select("#D3viz").selectAll("path.convexhull")
                    .style("fill",
                        function(d){
                            var component = components.find(function(c){
                                return c.name===d.key;
                            });
                            return component.color;
                        }
                    )
                    .style("stroke", function(d){
                        var component = components.find(function(c){
                            return c.name===d.key;
                        });

                        return component.color;
                    });
        }

        d3.select("#"+panel).select("#D3viz").selectAll("g.node")
            .select(".pathway")
            .filter(function (n) { return n.getBiologicalType()==="pathway"; })
            .style("stroke", function(d){
                var component = components.find(function(c){
                    return c.name===d.name;
                });

                return component.color;
            });

        switch(selectedComponent) {
            case "Compartments":
                metExploreD3.GraphNode.colorStoreByCompartment(metExploreD3.GraphNode.node);
                break;
            case "Pathways":
                d3.select("#" + panel).select("#D3viz").selectAll("path.link.pathway")
                    .style("stroke", function () {
                        var comp = _metExploreViz.getSessionById(panel).getD3Data().getPathwayById(this.getAttribute("id"));
                        return comp.color;
                    });
                break;
            default:
            // generalStyle.setDisplayCaption(false);
            // metExploreD3.GraphCaption.majCaption();
        }

    },

    /*****************************************************
     * Draw caption of metabolic compartments
     * @fires afterColorCalculating
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
     * Draw caption of pathways
     * @fires afterColorCalculating
     */
    colorPathwayLegend : function(){

        var groups = metExploreD3.getPathwaysSet('viz');
        var pathways = [];
        if(groups[0]){
            if(groups[0].getColor()){
                metExploreD3.fireEvent("captionFormPathways", "afterColorCalculating");
            }
            else
            {
                groups.forEach(function(path){
                    pathways.push({"key":path});
                });



                var phase = metExploreD3.getPathwaysLength('viz');
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
    }
};
