/**
 * @class metExploreD3.GraphFlux
 * Function to manage flux data
 *
 * Map flux data on nodes
 *
 * @author JCG
 * @uses metExploreD3.GraphLink
 * @uses metExploreD3.GraphStyleEdition
 */

metExploreD3.GraphFlux = {

    displayChoice: function(fluxData, targetLabel, nbCol, color){
        var session = _metExploreViz.getSessionById('viz');
        var networkData = session.getD3Data();

        if (nbCol === "one"){
            this.oneCompute(fluxData, networkData, targetLabel, color);
        }
        if (nbCol === "two"){
            this.twoCompute(fluxData, networkData, targetLabel, color);
        }
    },

    oneCompute: function(fluxData, networkData, targetLabel, color){
        var valuePos = {};
        var valueNeg = {};
        var valPosDistri = [];
        var valNegDistri = [];

        for (var i = 0; i < fluxData.length; i++){

            if (targetLabel === "reactionName"){
                var nodes = networkData.getNodeByName(fluxData[i][0]);
            }
            if (targetLabel === "reactionId"){
                var nodes = networkData.getNodeById(fluxData[i][0]);
            }
            if (targetLabel === "reactionDBIdentifier"){
                var nodes = networkData.getNodeByDbIdentifier(fluxData[i][0]);
            }

            if (nodes !== undefined){
                var value = parseInt(fluxData[i][1], 10);
                if (value === 0){
                    nodes.fluxDirection = value;
                }
                if (value > 0){
                    valuePos[nodes.id] = value;
                    valPosDistri.push(value);
                }
                if (value < 0){
                    valueNeg[nodes.id] = value;
                    valNegDistri.push(value*(-1));
                }
            }
        }

        var negDistrib = metExploreD3.GraphFlux.fluxDistribution(valNegDistri);
        var posDistrib = metExploreD3.GraphFlux.fluxDistribution(valPosDistri);

        for (var i = 0; i < fluxData.length; i++){

            if (targetLabel === "reactionName"){
                var nodes = networkData.getNodeByName(fluxData[i][0]);
            }
            if (targetLabel === "reactionId"){
                var nodes = networkData.getNodeById(fluxData[i][0]);
            }
            if (targetLabel === "reactionDBIdentifier"){
                var nodes = networkData.getNodeByDbIdentifier(fluxData[i][0]);
            }

            if (nodes !== undefined){
                if (Object.keys(valuePos).includes(nodes.id)){
                    var edgeWidth = metExploreD3.GraphFlux.computeWidth(posDistrib, valuePos[nodes.id]);
                    nodes.fluxDirection = edgeWidth;
                    nodes.color = color;
                }
                if (Object.keys(valueNeg).includes(nodes.id)){
                    var edgeWidth = metExploreD3.GraphFlux.computeWidth(negDistrib, valueNeg[nodes.id]);
                    nodes.fluxDirection = edgeWidth*(-1);
                    nodes.color = color;
                }
            }
        }
        metExploreD3.GraphFlux.curveEdge();
    },

    twoCompute: function(fluxData, networkData, targetLabel, color){
        var valuePos = {first:{}, second:{}};
        var valueNeg = {first:{}, second:{}};
        var valPosDistri = [];
        var valNegDistri = [];

        for (var i = 0; i < fluxData.length; i++){

            if (targetLabel === "reactionName"){
                var nodes = networkData.getNodeByName(fluxData[i][0]);
            }
            if (targetLabel === "reactionId"){
                var nodes = networkData.getNodeById(fluxData[i][0]);
            }
            if (targetLabel === "reactionDBIdentifier"){
                var nodes = networkData.getNodeByDbIdentifier(fluxData[i][0]);
            }

            if (nodes !== undefined){
                var value1 = parseInt(fluxData[i][1], 10);
                var value2 = parseInt(fluxData[i][2], 10);
                if (value1 === 0){
                    nodes.fluxDirection1 = value1;
                    nodes.color1 = color[0];
                }
                if (value1 > 0){
                    valuePos["first"][nodes.id] = value1;
                    valPosDistri.push(value1);
                }
                if (value1 < 0){
                    valueNeg["first"][nodes.id] = value1;
                    valNegDistri.push(value1*(-1));
                }
                if (value2 === 0){
                    nodes.fluxDirection2 = value2;
                    nodes.color2 = color[1];
                }
                if (value2 > 0){
                    valuePos["second"][nodes.id] = value2;
                    valPosDistri.push(value2);
                }
                if (value2 < 0){
                    valueNeg["second"][nodes.id] = value2;
                    valNegDistri.push(value2*(-1));
                }
            }
        }

        var posDistrib = metExploreD3.GraphFlux.fluxDistribution(valPosDistri);
        var negDistrib = metExploreD3.GraphFlux.fluxDistribution(valNegDistri);

        for (var i = 0; i < fluxData.length; i++){

            if (targetLabel === "reactionName"){
                var nodes = networkData.getNodeByName(fluxData[i][0]);
            }
            if (targetLabel === "reactionId"){
                var nodes = networkData.getNodeById(fluxData[i][0]);
            }
            if (targetLabel === "reactionDBIdentifier"){
                var nodes = networkData.getNodeByDbIdentifier(fluxData[i][0]);
            }

            if (nodes !== undefined){
                if (Object.keys(valuePos["first"]).includes(nodes.id)){
                    var edgeWidth = metExploreD3.GraphFlux.computeWidth(posDistrib, valuePos["first"][nodes.id]);
                    nodes.fluxDirection1 = edgeWidth;
                    nodes.color1 = color[0];
                }
                if (Object.keys(valueNeg["first"]).includes(nodes.id)){
                    var edgeWidth = metExploreD3.GraphFlux.computeWidth(negDistrib, valueNeg["first"][nodes.id]);
                    nodes.fluxDirection1 = edgeWidth*(-1);
                    nodes.color1 = color[0];
                }

                if (Object.keys(valuePos["second"]).includes(nodes.id)){
                    var edgeWidth = metExploreD3.GraphFlux.computeWidth(posDistrib, valuePos["second"][nodes.id]);
                    nodes.fluxDirection2 = edgeWidth;
                    nodes.color2 = color[1];
                }
                if (Object.keys(valueNeg["second"]).includes(nodes.id)){
                    var edgeWidth = metExploreD3.GraphFlux.computeWidth(negDistrib, valueNeg["second"][nodes.id]);
                    nodes.fluxDirection2 = edgeWidth*(-1);
                    nodes.color2 = color[1];
                }
            }
        }
        metExploreD3.GraphFlux.curveTwoEdge();
    },

    computeWidth: function(fluxDistri, fluxValue){
        if (fluxValue < 0){
            fluxValue = fluxValue*(-1);
        }
        if (fluxValue === fluxDistri["min"]){
            return 1;
        }
        if (fluxValue === fluxDistri["max"]){
            return 5;
        }
        if (fluxValue === fluxDistri["inter"]){
            return 2.5;
        }
        if (fluxValue > fluxDistri["inter"]){
            return 2.5+(fluxValue*0.005);
        }
        if (fluxValue < fluxDistri["inter"]){
            return 2.5-(fluxValue*0.005);
        }
    },

    fluxDistribution: function(fluxValues){
        var distrib = {};

        var fluxQuantile = metExploreD3.GraphFlux.findQuantile(fluxValues, 0.5);

        if (fluxQuantile[1] === fluxQuantile[2]){
            fluxQuantile = metExploreD3.GraphFlux.findQuantile(fluxValues, 0.25);
        }

        else if (fluxQuantile[1] === fluxQuantile[0]){
            fluxQuantile = metExploreD3.GraphFlux.findQuantile(fluxValues, 0.75);
        }

        distrib["min"] = fluxQuantile[0];
        distrib["inter"] = fluxQuantile[1];
        distrib["max"] = fluxQuantile[2];

        return distrib;
    },

    findQuantile: function(values, q){
        var sortedValues = values.slice().sort(function(a, b){
            return a - b;
        });
        var pos = (sortedValues.length - 1) * q;
        var base = Math.floor(pos);
        var rest = pos - base;
        if (sortedValues[base + 1] !== undefined){
            var quantile = sortedValues[base] + rest * (sortedValues[base + 1] - sortedValues[base]);
        }
        else {
            var quantile = sortedValues[base];
        }
        var minValue = sortedValues[0];
        var maxValue = sortedValues[sortedValues.length - 1];

        return [minValue, quantile, maxValue];
    },

    curveEdge: function(){
        var panel = "viz";
        var reactionStyle = metExploreD3.getReactionStyle();
        var reactions = d3.select("#"+panel).select("#D3viz").select("#graphComponent")
            .selectAll("g.node")
            .filter(function(node){
                return node.getBiologicalType()=="reaction";
            });
        var links = d3.select("#"+panel).select("#D3viz").select("#graphComponent").selectAll("path.link");

        reactions.each(function (node) {
            var enteringLinks = links.filter(function (link) {
                return node.id==link.getTarget();
            });
            var exitingLinks = links.filter(function (link) {
                return node.id==link.getSource();
            });

            // For each node, compute the centroid of the source nodes of the arcs entering that node and the centroid of the target nodes of the arc exiting that node;
            var resultComputeCentroid = metExploreD3.GraphLink.computeCentroid(node, enteringLinks, exitingLinks);
            centroidSourceX = resultComputeCentroid[0];
            centroidSourceY = resultComputeCentroid[1];
            centroidTargetX = resultComputeCentroid[2];
            centroidTargetY = resultComputeCentroid[3];


            // For each node, compare the difference between the x-coordinates of the 2 centroids and the difference between their y-coordinates
            // to determine if the axis of the reaction should be horizontal or vertical
            // From those test, attribute the coordinate for the entry and exit points of that node
            var distanceSource = Math.sqrt(Math.pow(centroidSourceX - node.x, 2) + Math.pow(centroidSourceY - node.y, 2));
            var distanceTarget = Math.sqrt(Math.pow(centroidTargetX - node.x, 2) + Math.pow(centroidTargetY - node.y, 2));
            var enteringX = node.x;
            var enteringY = node.y;
            if (Math.abs(centroidSourceX - centroidTargetX) > Math.abs(centroidSourceY - centroidTargetY)){
                if (centroidSourceX < centroidTargetX){
                    enteringX -= reactionStyle.getWidth() / 2 + 10;
                }
                else {
                    enteringX += reactionStyle.getWidth() / 2 + 10;
                }
            }
            else {
                if (centroidSourceY < centroidTargetY){
                    enteringY -= reactionStyle.getHeight() / 2 + 10;
                }
                else {
                    enteringY += reactionStyle.getHeight() / 2 + 10;
                }
            }
            var exitingX = node.x - (enteringX - node.x);
            var exitingY = node.y - (enteringY - node.y);

            var axe = "horizontal";
            // For each node, compute the path of the arcs exiting that node, and the path of the arcs exiting that node

            if (node.fluxDirection === 0){
                enteringLinks
                    .each(function (link) {
                        var path;
                        if (enteringY == node.y){
                            path = metExploreD3.GraphLink.computePathHorizontal(node, enteringX, enteringY, link.getSource());
                            axe="horizontal";
                        }
                        else {
                            path = metExploreD3.GraphLink.computePathVertical(node, enteringX, enteringY, link.getSource());
                            axe="vertical";
                        }
                        d3.select(this).attr("d", path)
                            .attr("fill", "none")
                            .classed("horizontal", false)
                            .classed("vertical", false)
                            .classed(axe, true)
                            .style("opacity", 0.6)
                            .style("stroke-width",1)
                            .style("stroke","blue")
                            .style("stroke-dasharray",8);
                    });

                exitingLinks
                    .each(function (link) {
                        var path;
                        if (exitingY == node.y){
                            path = metExploreD3.GraphLink.computePathHorizontal(node, exitingX, exitingY, link.getTarget());
                            axe="horizontal";
                        }
                        else {
                            path = metExploreD3.GraphLink.computePathVertical(node, exitingX, exitingY, link.getTarget());
                            axe="vertical";
                        }

                        d3.select(this).attr("d", path)
                            .attr("fill", "none")
                            .classed("horizontal", false)
                            .classed("vertical", false)
                            .classed(axe, true)
                            .style("opacity", 0.6)
                            .style("stroke-width",1)
                            .style("stroke","blue")
                            .style("stroke-dasharray",8);
                    });
            }
            if (node.fluxDirection > 0){
                enteringLinks
                    .each(function (link) {
                        var path;
                        if (enteringY == node.y){
                            path = metExploreD3.GraphLink.computePathHorizontal(node, enteringX, enteringY, link.getSource());
                            axe="horizontal";
                        }
                        else {
                            path = metExploreD3.GraphLink.computePathVertical(node, enteringX, enteringY, link.getSource());
                            axe="vertical";
                        }
                        d3.select(this).attr("d", path)
                            .attr("fill", "none")
                            .classed("horizontal", false)
                            .classed("vertical", false)
                            .classed(axe, true)
                            .style("opacity", 1)
                            .style("stroke", node.color)
                            .style("stroke-width",node.fluxDirection);
                    });

                exitingLinks
                    .each(function (link) {
                        var path;
                        var endNode = link.getTarget();
                        var fluxValue = node.fluxDirection*(-1);
                        if (exitingY == node.y){
                            path = metExploreD3.GraphFlux.computePathHorizontalEnd(node.x, node.y, exitingX, exitingY, endNode.x, endNode.y, fluxValue, 0);
                            axe="horizontal";
                        }
                        else {
                            path = metExploreD3.GraphFlux.computePathVerticalEnd(node.x, node.y, exitingX, exitingY, endNode.x, endNode.y, fluxValue, 0);
                            axe="vertical";
                        }

                        d3.select(this).attr("d", path)
                            .attr("fill", "none")
                            .classed("horizontal", false)
                            .classed("vertical", false)
                            .classed(axe, true)
                            .style("opacity", 1)
                            .style("stroke-linejoin", "miter")
                            .style("stroke", node.color)
                            .style("stroke-width",node.fluxDirection);
                    });
            }
            if (node.fluxDirection < 0){
                enteringLinks
                    .each(function (link) {
                        var path;
                        var endNode = link.getSource()
                        if (enteringY == node.y){
                            path = metExploreD3.GraphFlux.computePathHorizontalEnd(node.x, node.y, enteringX, enteringY, endNode.x, endNode.y, node.fluxDirection, 0);
                            axe="horizontal";
                        }
                        else {
                            path = metExploreD3.GraphFlux.computePathVerticalEnd(node.x, node.y, enteringX, enteringY, endNode.x, endNode.y, node.fluxDirection, 0);
                            axe="vertical";
                        }
                        d3.select(this).attr("d", path)
                            .attr("fill", "none")
                            .classed("horizontal", false)
                            .classed("vertical", false)
                            .classed(axe, true)
                            .style("opacity", 1)
                            .style("stroke-linejoin", "miter")
                            .style("stroke", node.color)
                            .style("stroke-width",node.fluxDirection*(-1));
                    });

                exitingLinks
                    .each(function (link) {
                        var path;
                        if (exitingY == node.y){
                            path = metExploreD3.GraphLink.computePathHorizontal(node, exitingX, exitingY, link.getTarget());
                            axe="horizontal";
                        }
                        else {
                            path = metExploreD3.GraphLink.computePathVertical(node, exitingX, exitingY, link.getTarget());
                            axe="vertical";
                        }

                        d3.select(this).attr("d", path)
                            .attr("fill", "none")
                            .classed("horizontal", false)
                            .classed("vertical", false)
                            .classed(axe, true)
                            .style("opacity", 1)
                            .style("stroke", node.color)
                            .style("stroke-width",node.fluxDirection*(-1));
                    });
            }
        });
        metExploreD3.GraphCaption.drawCaptionFluxMode();

    },

    curveTwoEdge: function(){
        var reactionStyle = metExploreD3.getReactionStyle();
        var reactions = d3.select("#viz").select("#D3viz").select("#graphComponent")
            .selectAll("g.node")
            .filter(function(node){
                return node.getBiologicalType()=="reaction";
            });
        d3.select("#viz").select("#D3viz").select("#graphComponent").selectAll("path.link.clone").remove();
        // d3.select("#viz").select("#D3viz").select("#graphComponent").selectAll("path.link.clone.horizontal").remove();

        var links = d3.select("#viz").select("#D3viz").select("#graphComponent").selectAll("path.link.reaction");

        reactions.each(function (node) {
            var enteringLinks = links.filter(function (link) {
                return node.id==link.getTarget();
            });
            var exitingLinks = links.filter(function (link) {
                return node.id==link.getSource();
            });

            // For each node, compute the centroid of the source nodes of the arcs entering that node and the centroid of the target nodes of the arc exiting that node;
            var resultComputeCentroid = metExploreD3.GraphLink.computeCentroid(node, enteringLinks, exitingLinks);
            centroidSourceX = resultComputeCentroid[0];
            centroidSourceY = resultComputeCentroid[1];
            centroidTargetX = resultComputeCentroid[2];
            centroidTargetY = resultComputeCentroid[3];


            // For each node, compare the difference between the x-coordinates of the 2 centroids and the difference between their y-coordinates
            // to determine if the axis of the reaction should be horizontal or vertical
            // From those test, attribute the coordinate for the entry and exit points of that node
            var distanceSource = Math.sqrt(Math.pow(centroidSourceX - node.x, 2) + Math.pow(centroidSourceY - node.y, 2));
            var distanceTarget = Math.sqrt(Math.pow(centroidTargetX - node.x, 2) + Math.pow(centroidTargetY - node.y, 2));
            var enteringX = node.x;
            var enteringY = node.y;
            if (Math.abs(centroidSourceX - centroidTargetX) > Math.abs(centroidSourceY - centroidTargetY)){
                if (centroidSourceX < centroidTargetX){
                    enteringX -= reactionStyle.getWidth() / 2 + 10;
                }
                else {
                    enteringX += reactionStyle.getWidth() / 2 + 10;
                }
            }
            else {
                if (centroidSourceY < centroidTargetY){
                    enteringY -= reactionStyle.getHeight() / 2 + 10;
                }
                else {
                    enteringY += reactionStyle.getHeight() / 2 + 10;
                }
            }
            var exitingX = node.x - (enteringX - node.x);
            var exitingY = node.y - (enteringY - node.y);

            var axe = "horizontal";
            // For each node, compute the path of the arcs exiting that node, and the path of the arcs exiting that node

            if (node.fluxDirection1 === 0){
                enteringLinks
                    .each(function (link) {
                        var path;
                        var endNode = link.getSource();
                        if (enteringY == node.y){
                            path = metExploreD3.GraphFlux.twoPathHorizontal(node.x, node.y-5, enteringX, enteringY-5, endNode.x, endNode.y-5, -5);
                            axe="horizontal";
                        }
                        else {
                            path = metExploreD3.GraphFlux.twoPathVertical(node.x-5, node.y, enteringX-5, enteringY, endNode.x-5, endNode.y, -5);
                            axe="vertical";
                        }
                        d3.select(this).attr("d", path)
                            .attr("fill", "none")
                            .classed("horizontal", false)
                            .classed("vertical", false)
                            .classed(axe, true)
                            .style("opacity", 0.6)
                            .style("stroke-width",1)
                            .style("stroke", node.color1)
                            .style("stroke-dasharray",8);
                    });

                exitingLinks
                    .each(function (link) {
                        var path;
                        var endNode = link.getTarget();
                        if (exitingY == node.y){
                            path = metExploreD3.GraphFlux.twoPathHorizontal(node.x, node.y-5, exitingX, exitingY-5, endNode.x, endNode.y-5, -5);
                            axe="horizontal";
                        }
                        else {
                            path = metExploreD3.GraphFlux.twoPathVertical(node.x-5, node.y, exitingX-5, exitingY, endNode.x-5, endNode.y, -5);
                            axe="vertical";
                        }

                        d3.select(this).attr("d", path)
                            .attr("fill", "none")
                            .classed("horizontal", false)
                            .classed("vertical", false)
                            .classed(axe, true)
                            .style("opacity", 0.6)
                            .style("stroke-width",1)
                            .style("stroke", node.color1)
                            .style("stroke-dasharray",8);
                    });
            }
            if (node.fluxDirection2 === 0){
                var newEnter = enteringLinks.clone();
                d3.select("#viz").select("#D3viz").select("graphComponent").append(newEnter);
                newEnter
                    .each(function (link) {
                        var path;
                        var endNode = link.getSource();
                        if (enteringY == node.y){
                            path = metExploreD3.GraphFlux.twoPathHorizontal(node.x, node.y+5, enteringX, enteringY+5, endNode.x, endNode.y+5, 5);
                            axe="horizontal";
                        }
                        else {
                            path = metExploreD3.GraphFlux.twoPathVertical(node.x+5, node.y, enteringX+5, enteringY, endNode.x+5, endNode.y, 5);
                            axe="vertical";
                        }
                        d3.select(this).attr("d", path)
                            .attr("fill", "none")
                            .classed("clone",true)
                            .classed("horizontal", false)
                            .classed("vertical", false)
                            .classed(axe, true)
                            .classed("reaction",false)
                            .style("opacity", 0.6)
                            .style("stroke-width",1)
                            .style("stroke", node.color2)
                            .style("stroke-dasharray",8);
                    });
                var newExit = exitingLinks.clone();
                d3.select("#viz").select("#D3viz").select("graphComponent").append(newExit);
                newExit
                    .each(function (link) {
                        var path;
                        var endNode = link.getTarget();
                        if (exitingY == node.y){
                            path = metExploreD3.GraphFlux.twoPathHorizontal(node.x, node.y+5, exitingX, exitingY+5, endNode.x, endNode.y+5, 5);
                            axe="horizontal";
                        }
                        else {
                            path = metExploreD3.GraphFlux.twoPathVertical(node.x+5, node.y, exitingX+5, exitingY, endNode.x+5, endNode.y, 5);
                            axe="vertical";
                        }

                        d3.select(this).attr("d", path)
                            .attr("fill", "none")
                            .classed("clone",true)
                            .classed("horizontal", false)
                            .classed("vertical", false)
                            .classed(axe, true)
                            .style("opacity", 0.6)
                            .style("stroke-width",1)
                            .style("stroke", node.color2)
                            .style("stroke-dasharray",8);
                    });
            }
            if (node.fluxDirection1 > 0){
                enteringLinks
                    .each(function (link) {
                        var path;
                        var endNode = link.getSource();
                        if (enteringY == node.y){
                            path = metExploreD3.GraphFlux.twoPathHorizontal(node.x, node.y-5, enteringX, enteringY-5, endNode.x, endNode.y-5, -5);
                            axe="horizontal";
                        }
                        else {
                            path = metExploreD3.GraphFlux.twoPathVertical(node.x-5, node.y, enteringX-5, enteringY, endNode.x-5, endNode.y, -5);
                            axe="vertical";
                        }
                        d3.select(this).attr("d", path)
                            .attr("fill", "none")
                            .classed("horizontal", false)
                            .classed("vertical", false)
                            .classed(axe, true)
                            .style("opacity", 1)
                            .style("stroke", node.color1)
                            .style("stroke-width",node.fluxDirection1);
                    });

                exitingLinks
                    .each(function (link) {
                        var path;
                        var endNode = link.getTarget();
                        var fluxValue = node.fluxDirection1*(-1);
                        if (exitingY == node.y){
                            path = metExploreD3.GraphFlux.computePathHorizontalEnd(node.x, node.y-5, exitingX, exitingY-5, endNode.x, endNode.y-5, fluxValue, -5);
                            axe="horizontal";
                        }
                        else {
                            path = metExploreD3.GraphFlux.computePathVerticalEnd(node.x-5, node.y, exitingX-5, exitingY, endNode.x-5, endNode.y, fluxValue, -5);
                            axe="vertical";
                        }

                        d3.select(this).attr("d", path)
                            .attr("fill", "none")
                            .classed("horizontal", false)
                            .classed("vertical", false)
                            .classed(axe, true)
                            .style("opacity", 1)
                            .style("stroke-linejoin", "miter")
                            .style("stroke", node.color1)
                            .style("stroke-width",node.fluxDirection1);
                    });
            }
            if (node.fluxDirection2 > 0){
                var newEnter = enteringLinks.clone();
                d3.select("#viz").select("#D3viz").select("graphComponent").append(newEnter);
                newEnter
                    .each(function (link) {
                        var path;
                        var endNode = link.getSource();
                        if (enteringY == node.y){
                            path = metExploreD3.GraphFlux.twoPathHorizontal(node.x, node.y+5, enteringX, enteringY+5, endNode.x, endNode.y+5, 5);
                            axe="horizontal";
                        }
                        else {
                            path = metExploreD3.GraphFlux.twoPathVertical(node.x+5, node.y, enteringX+5, enteringY, endNode.x+5, endNode.y, 5);
                            axe="vertical";
                        }
                        d3.select(this).attr("d", path)
                            .attr("fill", "none")
                            .classed("clone",true)
                            .classed("horizontal", false)
                            .classed("vertical", false)
                            .classed(axe, true)
                            .classed("reaction",false)
                            .style("opacity", 1)
                            .style("stroke-dasharray", null)
                            .style("stroke", node.color2)
                            .style("stroke-width", node.fluxDirection2);
                    });
                var newExit = exitingLinks.clone();
                d3.select("#viz").select("#D3viz").select("graphComponent").append(newExit);
                newExit
                    .each(function (link) {
                        var path;
                        var fluxValue = node.fluxDirection2*(-1);
                        var endNode = link.getTarget();
                        if (exitingY == node.y){
                            path = metExploreD3.GraphFlux.computePathHorizontalEnd(node.x, node.y+5, exitingX, exitingY+5, endNode.x, endNode.y+5, fluxValue, 5);
                            axe="horizontal";
                        }
                        else {
                            path = metExploreD3.GraphFlux.computePathVerticalEnd(node.x+5, node.y, exitingX+5, exitingY, endNode.x+5, endNode.y, fluxValue, 5);
                            axe="vertical";
                        }

                        d3.select(this).attr("d", path)
                            .attr("fill", "none")
                            .classed("clone",true)
                            .classed("horizontal", false)
                            .classed("vertical", false)
                            .classed(axe, true)
                            .style("stroke-linejoin", "miter")
                            .style("opacity", 1)
                            .style("stroke-dasharray", null)
                            .style("stroke", node.color2)
                            .style("stroke-width", node.fluxDirection2);
                    });
            }
            if (node.fluxDirection1 < 0){
                enteringLinks
                    .each(function (link) {
                        var path;
                        var endNode = link.getSource();
                        if (enteringY == node.y){
                            path = metExploreD3.GraphFlux.computePathHorizontalEnd(node.x, node.y-5, enteringX, enteringY-5, endNode.x, endNode.y-5, node.fluxDirection1, -5);
                            axe="horizontal";
                        }
                        else {
                            path = metExploreD3.GraphFlux.computePathVerticalEnd(node.x-5, node.y, enteringX-5, enteringY, endNode.x-5, endNode.y, node.fluxDirection1, -5);
                            axe="vertical";
                        }
                        d3.select(this).attr("d", path)
                            .attr("fill", "none")
                            .classed("horizontal", false)
                            .classed("vertical", false)
                            .classed(axe, true)
                            .style("opacity", 1)
                            .style("stroke-linejoin", "miter")
                            .style("stroke", node.color1)
                            .style("stroke-width",node.fluxDirection1*(-1));
                    });

                exitingLinks
                    .each(function (link) {
                        var path;
                        var endNode = link.getTarget();
                        if (exitingY == node.y){
                            path = metExploreD3.GraphFlux.twoPathHorizontal(node.x, node.y-5, exitingX, exitingY-5, endNode.x, endNode.y-5, -5);
                            axe="horizontal";
                        }
                        else {
                            path = metExploreD3.GraphFlux.twoPathVertical(node.x-5, node.y, exitingX-5, exitingY, endNode.x-5, endNode.y, -5);
                            axe="vertical";
                        }

                        d3.select(this).attr("d", path)
                            .attr("fill", "none")
                            .classed("horizontal", false)
                            .classed("vertical", false)
                            .classed(axe, true)
                            .style("opacity", 1)
                            .style("stroke", node.color1)
                            .style("stroke-width",node.fluxDirection1*(-1));
                    });
            }
            if (node.fluxDirection2 < 0){
                var newEnter = enteringLinks.clone();
                d3.select("#viz").select("#D3viz").select("graphComponent").append(newEnter);
                newEnter
                    .each(function (link) {
                        var path;
                        var endNode = link.getSource();
                        if (enteringY == node.y){
                            path = metExploreD3.GraphFlux.computePathHorizontalEnd(node.x, node.y+5, enteringX, enteringY+5, endNode.x, endNode.y+5, node.fluxDirection2, 5);
                            axe="horizontal";
                        }
                        else {
                            path = metExploreD3.GraphFlux.computePathVerticalEnd(node.x+5, node.y, enteringX+5, enteringY, endNode.x+5, endNode.y, node.fluxDirection2, 5);
                            axe="vertical";
                        }
                        d3.select(this).attr("d", path)
                            .attr("fill", "none")
                            .classed("clone",true)
                            .classed("horizontal", false)
                            .classed("vertical", false)
                            .classed(axe, true)
                            .classed("reaction",false)
                            .style("stroke-linejoin", "miter")
                            .style("opacity", 1)
                            .style("stroke-dasharray", null)
                            .style("stroke", node.color2)
                            .style("stroke-width",node.fluxDirection2*(-1));
                    });
                var newExit = exitingLinks.clone();
                d3.select("#viz").select("#D3viz").select("graphComponent").append(newExit);
                newExit
                    .each(function (link) {
                        var path;
                        var endNode = link.getTarget();
                        if (exitingY == node.y){
                            path = metExploreD3.GraphFlux.twoPathHorizontal(node.x, node.y+5, exitingX, exitingY+5, endNode.x, endNode.y+5, 5);
                            axe="horizontal";
                        }
                        else {
                            path = metExploreD3.GraphFlux.twoPathVertical(node.x+5, node.y, exitingX+5, exitingY, endNode.x+5, endNode.y, 5);
                            axe="vertical";
                        }

                        d3.select(this).attr("d", path)
                            .attr("fill", "none")
                            .classed("clone",true)
                            .classed("horizontal", false)
                            .classed("vertical", false)
                            .classed(axe, true)
                            .style("stroke-dasharray", null)
                            .style("opacity", 1)
                            .style("stroke", node.color2)
                            .style("stroke-width",node.fluxDirection2*(-1));
                    });
            }
        });
        metExploreD3.GraphCaption.drawCaptionTwoFluxMode();


    },

    computePathHorizontalEnd : function (startX, startY, firstPointX, firstPointY, endX, endY, fluxValue, shiftValue) {
        // Compute the coordinates of the last point of the arc (the point in contact of the periphery of the target node)
        var metaboliteStyle = metExploreD3.getMetaboliteStyle();
        // Compute the coordinates of the control point used for drawing the path
        var controlX = endX;
        var controlY = startY;
        if (firstPointX < startX && controlX > firstPointX){
            controlX = firstPointX - 15;
        }
        else if (firstPointX > startX && controlX < firstPointX){
            controlX = firstPointX + 15;
        }
        // Compute the path of the link for 3 different cases
        var path;
        var lastPointX = endX;
        var lastPointY = endY;
        var beforeLastPointX = lastPointX;
        var beforeLastPointY = lastPointY;
        if (controlX == endX){
            // 1st case: The end node is on the correct side of the starting node, and is close to the axe of the the reaction
            if (Math.abs(endY - startY) < 15){
                if (firstPointX < startX){
                    lastPointX = lastPointX + (metaboliteStyle.getWidth() / 2) - ((fluxValue * 0.01));
                    beforeLastPointX = lastPointX + 5;
                }
                else {
                    lastPointX = lastPointX - (metaboliteStyle.getWidth() / 2) + ((fluxValue * 0.01));
                    beforeLastPointX = lastPointX - 5;
                }
                var middlePointX = (firstPointX + lastPointX) / 2;
                var middlePointY = (firstPointY + lastPointY) / 2;
                var firstSidePointX = middlePointX;
                var firstSidePointY = middlePointY;
                var secondSidePointX = middlePointX;
                var secondSidePointY = middlePointY;
                if (firstPointX == startX){
                    firstSidePointX = firstPointX;
                    secondSidePointX = lastPointX;
                }
                else {
                    firstSidePointY = firstPointY;
                    secondSidePointY = lastPointY;
                }
                var y1 = beforeLastPointY + 2;
                var y2 = beforeLastPointY - 2;
                var yMo = (lastPointY + beforeLastPointY)/2

                path = "M" + startX + "," + startY +
                    "L" + firstPointX + "," + firstPointY +
                    "Q" + firstSidePointX + "," + firstSidePointY + "," + middlePointX + "," + middlePointY +
                    "Q" + secondSidePointX + "," + secondSidePointY + "," + beforeLastPointX + "," + beforeLastPointY +
                    "L" + beforeLastPointX + "," + y2 +
                    "L" + lastPointX + "," + yMo +
                    "L" + beforeLastPointX + "," + y1 +
                    "L" + beforeLastPointX + "," + beforeLastPointY;
            }
            // 2nd case: The end node is on the correct side of the starting node, and is not close to the axe of the the reaction
            else {
                if (endY < startY){
                    if (endX > startX){
                        beforeLastPointX = beforeLastPointX + shiftValue;
                    }
                    if (endX < startX){
                        beforeLastPointX = beforeLastPointX - shiftValue;
                    }
                    lastPointY = lastPointY + (metaboliteStyle.getHeight() / 2) - ((fluxValue * 0.01));
                    beforeLastPointY = lastPointY + 5;
                }
                else {
                    if (endX > startX){
                        beforeLastPointX = beforeLastPointX - shiftValue;
                    }
                    if (endX < startX){
                        beforeLastPointX = beforeLastPointX + shiftValue;
                    }
                    lastPointY = lastPointY - (metaboliteStyle.getHeight() / 2) + ((fluxValue * 0.01));
                    beforeLastPointY = lastPointY - 5;
                }
                var x1 = beforeLastPointX - 2;
                var x2 = beforeLastPointX + 2;
                var xMo = (beforeLastPointX+lastPointX)/2;

                path = "M" + startX + "," + startY +
                    "L" + firstPointX + "," + firstPointY +
                    "Q" + controlX + "," + controlY + "," + beforeLastPointX + "," + beforeLastPointY +
                    "L" + x1 + "," + beforeLastPointY +
                    "L" + xMo + "," + lastPointY +
                    "L" + x2 + "," + beforeLastPointY +
                    "L" + beforeLastPointX + "," + beforeLastPointY;

            }
        }
        // 3rd case: The end node is not on the correct side of the reaction
        else {
            if (firstPointX < startX){
                lastPointX = endX - (metaboliteStyle.getWidth() / 2) + ((fluxValue * 0.01));
                beforeLastPointX = lastPointX - 5;
                beforeLastPointY = beforeLastPointY - (shiftValue*2);
                lastPointY = lastPointY - (shiftValue*2);
            }
            else {
                lastPointX = endX + (metaboliteStyle.getWidth() / 2) - ((fluxValue * 0.01));
                beforeLastPointX = lastPointX + 5;
                beforeLastPointY = beforeLastPointY - (shiftValue*2);
                lastPointY = lastPointY - (shiftValue*2);
            }
            controlX = controlX + shiftValue;
            var control2X = controlX + shiftValue;
            var control2Y = endY - shiftValue;
            controlY = controlY - shiftValue;
            var y1 = beforeLastPointY + 2;
            var y2 = beforeLastPointY - 2;
            var yMo = (lastPointY + beforeLastPointY)/2

            path = "M" + startX + "," + startY +
                "L" + firstPointX + "," + firstPointY +
                "C" + controlX + "," + controlY + "," + control2X + "," + control2Y + "," + beforeLastPointX + "," + beforeLastPointY +
                "L" + beforeLastPointX + "," + y2 +
                "L" + lastPointX + "," + yMo +
                "L" + beforeLastPointX + "," + y1 +
                "L" + beforeLastPointX + "," + beforeLastPointY;
        }
        return path;
    },

    computePathVerticalEnd : function (startX, startY, firstPointX, firstPointY, endX, endY, fluxValue, shiftValue) {
        // Compute the coordinates of the last point of the arc (the point in contact of the periphery of the target node)
        var metaboliteStyle = metExploreD3.getMetaboliteStyle();
        // Compute the coordinates of the control point used for drawing the path
        var controlX = startX;
        var controlY = endY;
        if (firstPointY < startY && controlY > firstPointY){
            controlY = firstPointY - 15;
        }
        else if (firstPointY > startY && controlY < firstPointY){
            controlY = firstPointY + 15;
        }
        // Compute the path of the link for 3 different cases
        var path;
        var lastPointX = endX;
        var lastPointY = endY;
        var beforeLastPointX = lastPointX;
        var beforeLastPointY = lastPointY;
        if (controlY == endY){
            // 1st case: The end node is on the correct side of the starting node, and is close to the axe of the the reaction
            if (Math.abs(endX - startX) < 15){
                if (firstPointY < startY){
                    lastPointY = lastPointY + (metaboliteStyle.getHeight() / 2) - ((fluxValue * 0.01));
                    beforeLastPointY = lastPointY + 5;
                }
                else {
                    lastPointY = lastPointY - (metaboliteStyle.getHeight() / 2) + ((fluxValue * 0.01));
                    beforeLastPointY = lastPointY - 5;
                }
                var middlePointX = (firstPointX + lastPointX) / 2;
                var middlePointY = (firstPointY + lastPointY) / 2;
                var firstSidePointX = middlePointX;
                var firstSidePointY = middlePointY;
                var secondSidePointX = middlePointX;
                var secondSidePointY = middlePointY;
                if (firstPointX == startX){
                    firstSidePointX = firstPointX;
                    secondSidePointX = lastPointX;
                }
                else {
                    firstSidePointY = firstPointY;
                    secondSidePointY = lastPointY;
                }
                var x1 = beforeLastPointX - 2;
                var x2 = beforeLastPointX + 2;
                var xMo = (beforeLastPointX+lastPointX)/2;

                path = "M" + startX + "," + startY +
                    "L" + firstPointX + "," + firstPointY +
                    "Q" + firstSidePointX + "," + firstSidePointY + "," + middlePointX + "," + middlePointY +
                    "Q" + secondSidePointX + "," + secondSidePointY + "," + beforeLastPointX + "," + beforeLastPointY +
                    "L" + x1 + "," + beforeLastPointY +
                    "L" + xMo + "," + lastPointY +
                    "L" + x2 + "," + beforeLastPointY +
                    "L" + beforeLastPointX + "," + beforeLastPointY;
            }
            // 2nd case: The end node is on the correct side of the starting node, and is not close to the axe of the the reaction
            else {
                if (endX < startX){
                    if (endY > startY){
                        beforeLastPointY = beforeLastPointY + shiftValue;
                    }
                    if (endY < startY){
                        beforeLastPointY = beforeLastPointY - shiftValue;
                    }
                    lastPointX = lastPointX + (metaboliteStyle.getWidth() / 2) - ((fluxValue * 0.01));
                    beforeLastPointX = lastPointX + 5;
                }
                else {
                    if (endY > startY){
                        beforeLastPointY = beforeLastPointY - shiftValue;
                    }
                    if (endY < startY){
                        beforeLastPointY = beforeLastPointY + shiftValue;
                    }
                    lastPointX = lastPointX - (metaboliteStyle.getWidth() / 2) + ((fluxValue * 0.01));
                    beforeLastPointX = lastPointX - 5;
                }
                var y1 = beforeLastPointY + 2;
                var y2 = beforeLastPointY - 2;
                var yMo = (lastPointY + beforeLastPointY)/2

                path = "M" + startX + "," + startY +
                    "L" + firstPointX + "," + firstPointY +
                    "Q" + controlX + "," + controlY + "," + beforeLastPointX + "," + beforeLastPointY +
                    "L" + beforeLastPointX + "," + y2 +
                    "L" + lastPointX + "," + yMo +
                    "L" + beforeLastPointX + "," + y1 +
                    "L" + beforeLastPointX + "," + beforeLastPointY;

            }
        }
        // 3rd case: The end node is not on the correct side of the reaction
        else {
            if (firstPointY < startY){
                lastPointY = endY - (metaboliteStyle.getWidth() / 2) + ((fluxValue * 0.01));
                beforeLastPointY = lastPointY - 5;
                beforeLastPointX = beforeLastPointX - (shiftValue*2);
                lastPointX = lastPointX - (shiftValue*2);
            }
            else {
                lastPointY = endY + (metaboliteStyle.getWidth() / 2) - ((fluxValue * 0.01));
                beforeLastPointY = lastPointY + 5;
                beforeLastPointX = beforeLastPointX - (shiftValue*2);
                lastPointX = lastPointX - (shiftValue*2);
            }
            controlX = controlX - shiftValue;
            controlY = controlY + shiftValue;
            var control2X = endX - shiftValue;
            var control2Y = controlY + shiftValue;
            var x1 = beforeLastPointX - 2;
            var x2 = beforeLastPointX + 2;
            var xMo = (beforeLastPointX+lastPointX)/2;

            path = "M" + startX + "," + startY +
                "L" + firstPointX + "," + firstPointY +
                "C" + controlX + "," + controlY + "," + control2X + "," + control2Y + "," + beforeLastPointX + "," + beforeLastPointY +
                "L" + x1 + "," + beforeLastPointY +
                "L" + xMo + "," + lastPointY +
                "L" + x2 + "," + beforeLastPointY +
                "L" + beforeLastPointX + "," + beforeLastPointY;
        }
        return path;
    },

    restoreStyles: function(linkStyle){
        // remove all flux value from nodes
        var reactions = d3.select("#viz").select("#D3viz").select("#graphComponent")
            .selectAll("g.node")
            .filter(function(node){
                return node.getBiologicalType()=="reaction";
            });
        reactions.each(function(node) {
            node.fluxDirection = "";
            node.fluxDirection1 = "";
            node.fluxDirection2 = "";

            node.color = "";
            node.color1 = "";
            node.color2 = "";
        });

        // remove link clone
        d3.select("#viz").select("#D3viz").select("#graphComponent").selectAll("path.link.clone").remove();

        // restore link style
        var links = d3.select("#D3viz").selectAll(".linkGroup");
        var linkGroup = links._groups[0];

        linkGroup.forEach(function(link){
            var visibleLinks = d3.select(link).selectAll('path');
            visibleLinks.attr("fill-rule", "evenodd")
                        .attr("fill", function (d) {
                            if (d.interaction == "out")
                                return linkStyle.getMarkerOutColor();
                            else
                                return linkStyle.getMarkerInColor();
                        })
                        .style("stroke", linkStyle.getStrokeColor())
                        .style("stroke-width", linkStyle.getLineWidth())
                        .style("opacity", linkStyle.getOpacity())
                        .style("stroke-dasharray", null);
        });
        if (metExploreD3.GraphStyleEdition.curvedPath === true){
            metExploreD3.GraphLink.bundleLinks("viz");
        }
    },

    graphDistribOne: function(fluxData, color){
        var data = [];
        var valNeg = [];
        var valPos = [];

        var min = 0;
        var max = 0;

        fluxData.forEach(function(value) {
            var val = value[1]*1;
            data.push(val);
            if (min > val){
                min = val;
            }
            if (max < val){
                max = val;
            }
            if (val < 0){
                valNeg.push(val);
            }
            if (val > 0){
                valPos.push(val);
            }
        });

        var negDistrib = metExploreD3.GraphFlux.fluxDistribution(valNeg);
        var interLineNeg = {x1: negDistrib["inter"], x2: negDistrib["inter"], y1: 0, y2: 340};

        var posDistrib = metExploreD3.GraphFlux.fluxDistribution(valPos);
        var interLinePos = {x1: posDistrib["inter"], x2: posDistrib["inter"], y1: 0, y2: 340};

        var margin = {top: 30, right: 30, bottom: 80, left: 50},
            width = 400 - margin.left - margin.right,
            height = 450 - margin.top - margin.bottom;

        var svg = d3.select("#graphDistrib")
                    .append("svg")
                        .attr("id", "distrib")
                        .attr("width", width + margin.left + margin.right)
                        .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                        .attr("transform", "translate("+ margin.left + "," + margin.right +")");

        var x = d3.scaleLinear()
                    .domain([min-50, max+50])
                    .range([0, width]);

        svg.append("g")
            .attr("transform", "translate(0,"+ height + ")")
            .call(d3.axisBottom(x));

        var y = d3.scaleLinear()
                    .range([height, 0])
                    .domain([0,0.05]);

        svg.append("g")
            .call(d3.axisLeft(y));

        var kde = metExploreD3.GraphFlux.kernelDensityEstimator(metExploreD3.GraphFlux.kernelEpanechnikov(7), x.ticks(40));
        var density = kde( data.map(function(d){  return d; }) );

        svg.append("path")
            .attr("class", "distribPath")
            .datum(density)
            .attr("opacity", "0.8")
            .attr("fill", color)
            .attr("stroke-linejoin", "round")
            .attr("d", d3.line()
                .curve(d3.curveBasis)
                  .x(function(d) { return x(d[0]); })
                  .y(function(d) { return y(d[1]); }));

        svg.append("text")
            .attr("x", (width / 2))
            .attr("y", (height+50))
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .style("text-decoration", "underline")
            .text("Distribution Graph");

        if (interLineNeg.x1 !== undefined){
            svg.append("line")
                .attr("x1", function(){ return x(interLineNeg.x1) })
                .attr("x2", function(){ return x(interLineNeg.x2) })
                .attr("y1", interLineNeg.y1)
                .attr("y2", interLineNeg.y2)
                .attr("stroke","red");
        }
        if (interLinePos.x1 !== undefined){
            svg.append("line")
                .attr("x1", function(){ return x(interLinePos.x1) })
                .attr("x2", function(){ return x(interLinePos.x2) })
                .attr("y1", interLinePos.y1)
                .attr("y2", interLinePos.y2)
                .attr("stroke","green");
        }
    },

    graphDistribTwo: function(fluxData, color){
        var data1 = [];
        var data2 = [];
        var valNeg = [];
        var valPos = [];

        var min = 0;
        var max = 0;

        fluxData.forEach(function(value) {
            var val1 = value[1]*1;
            var val2 = value[2]*1;
            data1.push(val1);
            data2.push(val2);
            if (min > val1){
                min = val1;
            }
            if (max < val1){
                max = val1;
            }
            if (min > val2){
                min = val2;
            }
            if (max < val2){
                max = val2;
            }
            if (val1 < 0){
                valNeg.push(val1);
            }
            if (val1 > 0){
                valPos.push(val1);
            }
            if (val2 < 0){
                valNeg.push(val2);
            }
            if (val2 > 0){
                valPos.push(val2);
            }
        });

        var negDistrib = metExploreD3.GraphFlux.fluxDistribution(valNeg);
        var interLineNeg = {x1: negDistrib["inter"], x2: negDistrib["inter"], y1: 100, y2: 340};

        var posDistrib = metExploreD3.GraphFlux.fluxDistribution(valPos);
        var interLinePos = {x1: posDistrib["inter"], x2: posDistrib["inter"], y1: 100, y2: 340};

        // set the dimensions and margins of the graph
        var margin = {top: 30, right: 30, bottom: 80, left: 50},
            width = 460 - margin.left - margin.right,
            height = 450 - margin.top - margin.bottom;

        // append the svg object to the body of the page
        var svg = d3.select("#graphDistrib")
            .append("svg")
                .attr("id", "distrib")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                    .attr("transform",
                    "translate(" + margin.left + "," + margin.top + ")");

        // add the x Axis
        var x = d3.scaleLinear()
            .domain([min-50,max+50])
            .range([0, width]);
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        // add the y Axis
        var y = d3.scaleLinear()
            .range([height, 0])
            .domain([0, 0.12]);
        svg.append("g")
            .call(d3.axisLeft(y));

        // Compute kernel density estimation
        var kde = metExploreD3.GraphFlux.kernelDensityEstimator(metExploreD3.GraphFlux.kernelEpanechnikov(7), x.ticks(60))
        var density1 =  kde( data1
            .map(function(d){  return d; }) );
        var density2 =  kde( data2
            .map(function(d){  return d; }) );

            // Plot the area
            svg.append("path")
                .attr("class", "mypath")
                .datum(density1)
                .attr("fill", color[0])
                .attr("opacity", ".6")
                .attr("stroke", "#000")
                .attr("stroke-width", 1)
                .attr("stroke-linejoin", "round")
                .attr("d",  d3.line()
                .curve(d3.curveBasis)
                .x(function(d) { return x(d[0]); })
                .y(function(d) { return y(d[1]); })
                );

            // Plot the area
            svg.append("path")
                .attr("class", "mypath")
                .datum(density2)
                .attr("fill", color[1])
                .attr("opacity", ".6")
                .attr("stroke", "#000")
                .attr("stroke-width", 1)
                .attr("stroke-linejoin", "round")
                .attr("d",  d3.line()
                .curve(d3.curveBasis)
                .x(function(d) { return x(d[0]); })
                .y(function(d) { return y(d[1]); })
                );

        // Handmade legend
        svg.append("circle").attr("cx",250).attr("cy",30).attr("r", 6).style("fill", color[0]);
        svg.append("circle").attr("cx",250).attr("cy",60).attr("r", 6).style("fill", color[1]);
        svg.append("text").attr("x", 270).attr("y", 30).text("First Condition").style("font-size", "15px").attr("alignment-baseline","middle");
        svg.append("text").attr("x", 270).attr("y", 60).text("Second Condition").style("font-size", "15px").attr("alignment-baseline","middle");

        svg.append("text")
            .attr("x", (width / 2))
            .attr("y", (height+50))
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .style("text-decoration", "underline")
            .text("Distribution Graph");

        if (interLineNeg.x1 !== undefined){
            svg.append("line")
                .attr("x1", function(){ return x(interLineNeg.x1) })
                .attr("x2", function(){ return x(interLineNeg.x2) })
                .attr("y1", interLineNeg.y1)
                .attr("y2", interLineNeg.y2)
                .attr("stroke","red");
        }
        if (interLinePos.x1 !== undefined){
            svg.append("line")
                .attr("x1", function(){ return x(interLinePos.x1) })
                .attr("x2", function(){ return x(interLinePos.x2) })
                .attr("y1", interLinePos.y1)
                .attr("y2", interLinePos.y2)
                .attr("stroke","green");
        }
    },

    kernelDensityEstimator: function(kernel, X){
        return function(V) {
            return X.map(function(x) {
                return [x, d3.mean(V, function(v) { return kernel(x - v); })];
            });
        };
    },

    kernelEpanechnikov: function(k){
        return function(v) {
            return Math.abs(v /= k) <= 1 ? 0.75 * (1 - v * v) / k : 0;
        };
    },

    removeGraphDistrib: function(){
        d3.select("#graphDistrib").selectAll("#distrib").remove();
    },

    twoPathVertical : function (startX, startY, firstPointX, firstPointY, endX, endY, shiftValue) {
        // Compute the coordinates of the last point of the arc (the point in contact of the periphery of the target node)
        var metaboliteStyle = metExploreD3.getMetaboliteStyle();
        // Compute the coordinates of the control point used for drawing the path
        var controlX = startX;
        var controlY = endY;
        if (firstPointY < startY && controlY > firstPointY){
            controlY = firstPointY - 15;
        }
        else if (firstPointY > startY && controlY < firstPointY){
            controlY = firstPointY + 15;
        }
        // Compute the path of the link for 3 different cases
        var path;
        var lastPointX = endX;
        var lastPointY = endY;
        var beforeLastPointX = lastPointX;
        var beforeLastPointY = lastPointY;
        if (controlY == endY){
            // 1st case: The end node is on the correct side of the starting node, and is close to the axe of the the reaction
            if (Math.abs(endX - startX) < 15){
                if (firstPointY < startY){
                    lastPointY += metaboliteStyle.getHeight() / 2;
                    beforeLastPointY = lastPointY + 5;
                }
                else {
                    lastPointY -= metaboliteStyle.getHeight() / 2;
                    beforeLastPointY = lastPointY - 5;
                }
                var middlePointX = (firstPointX + lastPointX) / 2;
                var middlePointY = (firstPointY + lastPointY) / 2;
                var firstSidePointX = middlePointX;
                var firstSidePointY = middlePointY;
                var secondSidePointX = middlePointX;
                var secondSidePointY = middlePointY;
                if (firstPointX == startX){
                    firstSidePointX = firstPointX;
                    secondSidePointX = lastPointX;
                }
                else {
                    firstSidePointY = firstPointY;
                    secondSidePointY = lastPointY;
                }
                path = "M" + startX + "," + startY +
                    "L" + firstPointX + "," + firstPointY +
                    "Q" + firstSidePointX + "," + firstSidePointY + "," + middlePointX + "," + middlePointY +
                    "Q" + secondSidePointX + "," + secondSidePointY + "," + beforeLastPointX + "," + beforeLastPointY +
                    "L" + lastPointX + "," + lastPointY;
            }
            // 2nd case: The end node is on the correct side of the starting node, and is not close to the axe of the the reaction
            else {
                if (endX < startX){
                    if (endY > startY){
                        beforeLastPointY = beforeLastPointY + shiftValue;
                        lastPointY = lastPointY + shiftValue;
                    }
                    if (endY < startY){
                        beforeLastPointY = beforeLastPointY - shiftValue;
                        lastPointY = lastPointY - shiftValue;
                    }
                    lastPointX += metaboliteStyle.getWidth() / 2;
                    beforeLastPointX = lastPointX + 5;
                }
                else {
                    if (endY > startY){
                        beforeLastPointY = beforeLastPointY - shiftValue;
                        lastPointY = lastPointY - shiftValue;
                    }
                    if (endY < startY){
                        beforeLastPointY = beforeLastPointY + shiftValue;
                        lastPointY = lastPointY + shiftValue;
                    }
                    lastPointX -= metaboliteStyle.getWidth() / 2;
                    beforeLastPointX = lastPointX - 5;
                }
                path = "M" + startX + "," + startY +
                    "L" + firstPointX + "," + firstPointY +
                    "Q" + controlX + "," + controlY + "," + beforeLastPointX + "," + beforeLastPointY +
                    "L" + lastPointX + "," + lastPointY;
            }
        }
        // 3rd case: The end node is not on the correct side of the reaction
        else {
            if (firstPointY < startY){
                lastPointY = endY - (metaboliteStyle.getWidth() / 2);
                beforeLastPointY = lastPointY - 5;
                beforeLastPointX = beforeLastPointX - (shiftValue*2);
                lastPointX = lastPointX - (shiftValue*2);
            }
            else {
                lastPointY = endY + (metaboliteStyle.getWidth() / 2);
                beforeLastPointY = lastPointY + 5;
                beforeLastPointX = beforeLastPointX - (shiftValue*2);
                lastPointX = lastPointX - (shiftValue*2);
            }
            controlX = controlX - shiftValue;
            controlY = controlY + shiftValue;
            var control2X = endX - shiftValue;
            var control2Y = controlY + shiftValue;

            path = "M" + startX + "," + startY +
                "L" + firstPointX + "," + firstPointY +
                "C" + controlX + "," + controlY + "," + control2X + "," + control2Y + "," + beforeLastPointX + "," + beforeLastPointY +
                "L" + lastPointX + "," + lastPointY;
        }
        return path;
    },

    twoPathHorizontal : function (startX, startY, firstPointX, firstPointY, endX, endY, shiftValue) {
        // Compute the coordinates of the last point of the arc (the point in contact of the periphery of the target node)
        var metaboliteStyle = metExploreD3.getMetaboliteStyle();
        // Compute the coordinates of the control point used for drawing the path
        var controlX = endX;
        var controlY = startY;
        if (firstPointX < startX && controlX > firstPointX){
            controlX = firstPointX - 15;
        }
        else if (firstPointX > startX && controlX < firstPointX){
            controlX = firstPointX + 15;
        }
        // Compute the path of the link for 3 different cases
        var path;
        var lastPointX = endX;
        var lastPointY = endY;
        var beforeLastPointX = lastPointX;
        var beforeLastPointY = lastPointY;
        if (controlX == endX){
            // 1st case: The end node is on the correct side of the starting node, and is close to the axe of the the reaction
            if (Math.abs(endY - startY) < 15){
                if (firstPointX < startX){
                    lastPointX += metaboliteStyle.getWidth() / 2;
                    beforeLastPointX = lastPointX + 5;
                }
                else {
                    lastPointX -= metaboliteStyle.getWidth() / 2;
                    beforeLastPointX = lastPointX - 5;
                }
                var middlePointX = (firstPointX + lastPointX) / 2;
                var middlePointY = (firstPointY + lastPointY) / 2;
                var firstSidePointX = middlePointX;
                var firstSidePointY = middlePointY;
                var secondSidePointX = middlePointX;
                var secondSidePointY = middlePointY;
                if (firstPointX == startX){
                    firstSidePointX = firstPointX;
                    secondSidePointX = lastPointX;
                }
                else {
                    firstSidePointY = firstPointY;
                    secondSidePointY = lastPointY;
                }
                path = "M" + startX + "," + startY +
                    "L" + firstPointX + "," + firstPointY +
                    "Q" + firstSidePointX + "," + firstSidePointY + "," + middlePointX + "," + middlePointY +
                    "Q" + secondSidePointX + "," + secondSidePointY + "," + beforeLastPointX + "," + beforeLastPointY +
                    "L" + lastPointX + "," + lastPointY;
            }
            // 2nd case: The end node is on the correct side of the starting node, and is not close to the axe of the the reaction
            else {
                if (endY < startY){
                    if (endX > startX){
                        beforeLastPointX = beforeLastPointX + shiftValue;
                        lastPointX = lastPointX + shiftValue;
                    }
                    if (endX < startX){
                        beforeLastPointX = beforeLastPointX - shiftValue;
                        lastPointX = lastPointX - shiftValue;
                    }
                    lastPointY += metaboliteStyle.getHeight() / 2;
                    beforeLastPointY = lastPointY + 5;
                }
                else {
                    if (endX > startX){
                        beforeLastPointX = beforeLastPointX - shiftValue;
                        lastPointX = lastPointX - shiftValue;
                    }
                    if (endX < startX){
                        beforeLastPointX = beforeLastPointX + shiftValue;
                        lastPointX = lastPointX + shiftValue;
                    }
                    lastPointY -= metaboliteStyle.getHeight() / 2;
                    beforeLastPointY = lastPointY - 5;
                }
                path = "M" + startX + "," + startY +
                    "L" + firstPointX + "," + firstPointY +
                    "Q" + controlX + "," + controlY + "," + beforeLastPointX + "," + beforeLastPointY +
                    "L" + lastPointX + "," + lastPointY;
            }
        }
        // 3rd case: The end node is not on the correct side of the reaction
        else {
            if (firstPointX < startX){
                lastPointX = endX - (metaboliteStyle.getWidth() / 2);
                beforeLastPointX = lastPointX - 5;
                beforeLastPointY = beforeLastPointY - (shiftValue*2);
                lastPointY = lastPointY - (shiftValue*2);
            }
            else {
                lastPointX = endX + (metaboliteStyle.getWidth() / 2);
                beforeLastPointX = lastPointX + 5;
                beforeLastPointY = beforeLastPointY - (shiftValue*2);
                lastPointY = lastPointY - (shiftValue*2);
            }
            controlX = controlX + shiftValue;
            var control2X = controlX + shiftValue;
            var control2Y = endY - shiftValue;
            controlY = controlY - shiftValue;
            path = "M" + startX + "," + startY +
                "L" + firstPointX + "," + firstPointY +
                "C" + controlX + "," + controlY + "," + control2X + "," + control2Y + "," + beforeLastPointX + "," + beforeLastPointY +
                "L" + lastPointX + "," + lastPointY;
        }
        return path;
    }

};
