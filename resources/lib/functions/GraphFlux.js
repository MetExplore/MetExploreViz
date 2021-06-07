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

    displayChoice: function(fluxData, targetLabel, nbCol){
        var session = _metExploreViz.getSessionById('viz');
        var networkData = session.getD3Data();

        if (nbCol === "one"){
            this.oneCompute(fluxData, networkData, targetLabel);
        }
        if (nbCol === "two"){
            console.log("work in progress");
        }
    },

    // oneCompute: function(fluxData, networkData, targetLabel){
    //     var valueNull = {};
    //     var valuePos = {};
    //     var valueNeg = {};
    //
    //     for (var i = 0; i < fluxData.length; i++){
    //
    //         if (targetLabel === "reactionName"){
    //             var nodes = networkData.getNodeByName(fluxData[i][0]);
    //         }
    //         if (targetLabel === "reactionId"){
    //             var nodes = networkData.getNodeById(fluxData[i][0]);
    //         }
    //         if (targetLabel === "reactionDBIdentifier"){
    //             var nodes = networkData.getNodeByDbIdentifier(fluxData[i][0]);
    //         }
    //
    //         if (nodes !== undefined){
    //             var links = networkData.getLinkByDBIdReaction(nodes.getDbIdentifier());
    //             var value = parseInt(fluxData[i][1], 10);
    //             if (value === 0){
    //                 nodes.fluxDirection = value;
    //                 links.forEach(function(linkData){
    //                     valueNull[linkData.id] = value;
    //                 });
    //             }
    //             if (value > 0){
    //                 nodes.fluxDirection = value;
    //                 links.forEach(function(linkData){
    //                     valuePos[linkData.id] = value;
    //                 });
    //             }
    //             if (value < 0){
    //                 nodes.fluxDirection = value;
    //                 links.forEach(function(linkData){
    //                     valueNeg[linkData.id] = value;
    //                 });
    //             }
    //         }
    //     }
    //
    //     var links = d3.select("#D3viz").selectAll(".linkGroup");
    //     var linkGroup = links._groups[0];
    //
    //     var negDistrib = metExploreD3.GraphFlux.fluxDistribution(valueNeg);
    //     var posDistrib = metExploreD3.GraphFlux.fluxDistribution(valuePos);
    //
    //     linkGroup.forEach(function(link){
    //         var visibleLinks = d3.select(link).selectAll('path');
    //
    //         if (Object.keys(valueNull).includes(link.__data__.id)){
    //             visibleLinks.style("stroke-dasharray",8)
    //                         .style("stroke","blue")
    //                         .style("stroke-width",1);
    //         }
    //         if (Object.keys(valuePos).includes(link.__data__.id)){
    //             var edgeWidth = metExploreD3.GraphFlux.computeWidth(posDistrib, valuePos[link.__data__.id]);
    //             visibleLinks.style("stroke","green")
    //                         .style("stroke-width",edgeWidth);
    //         }
    //         if (Object.keys(valueNeg).includes(link.__data__.id)){
    //             var edgeWidth = metExploreD3.GraphFlux.computeWidth(negDistrib, valueNeg[link.__data__.id]);
    //             visibleLinks.style("stroke","red")
    //                         .style("stroke-width",edgeWidth);
    //         }
    //     });
    //     metExploreD3.GraphFlux.curveEdge();
    // },

    oneCompute: function(fluxData, networkData, targetLabel){
        var valueNull = {};
        var valuePos = {};
        var valueNeg = {};

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
                }
                if (value < 0){
                    valueNeg[nodes.id] = value;
                }
            }
        }

        var negDistrib = metExploreD3.GraphFlux.fluxDistribution(valueNeg);
        var posDistrib = metExploreD3.GraphFlux.fluxDistribution(valuePos);

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
                }
                if (Object.keys(valueNeg).includes(nodes.id)){
                    var edgeWidth = metExploreD3.GraphFlux.computeWidth(negDistrib, valueNeg[nodes.id]);
                    nodes.fluxDirection = edgeWidth*(-1);
                }
            }
        }
        metExploreD3.GraphFlux.curveEdge();
    },

    // twoCompute: function(fluxData, networkData){
    //     var links = d3.select("#D3viz").selectAll(".linkGroup");
    //     var linkGroup = links._groups[0];
    //
    //     linkGroup.forEach(function(link){
    //         var visibleLinks = d3.select(link).selectAll('path');
    //         if (valueNull.includes(link.__data__)){
    //             visibleLinks.style("stroke-dasharray",8)
    //                         .style("stroke","blue");
    //         }
    //         if (valuePos.includes(link.__data__)){
    //             visibleLinks.style("stroke","green");
    //         }
    //         if (valueNeg.includes(link.__data__)){
    //             visibleLinks.style("stroke","red");
    //         }
    //     });
    // },

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
        var values = [];
        var reactId = Object.keys(fluxValues);
        reactId.forEach(function(id){
            if (fluxValues[id] < 0){
                values.push(fluxValues[id]*(-1));
            }
            else {
                values.push(fluxValues[id]);
            }
        });

        var fluxQuantile = metExploreD3.GraphFlux.findQuantile(values, 0.5);

        if (fluxQuantile[1] === fluxQuantile[2]){
            fluxQuantile = metExploreD3.GraphFlux.findQuantile(values, 0.25);
        }

        else if (fluxQuantile[1] === fluxQuantile[0]){
            fluxQuantile = metExploreD3.GraphFlux.findQuantile(values, 0.75);
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

    // curveEdge: function(){
    //     var panel = "viz";
    //     var reactionStyle = metExploreD3.getReactionStyle();
    //     var reactions = d3.select("#"+panel).select("#D3viz").select("#graphComponent")
    //         .selectAll("g.node")
    //         .filter(function(node){
    //             return node.getBiologicalType()=="reaction";
    //         });
    //     var links = d3.select("#"+panel).select("#D3viz").select("#graphComponent").selectAll("path.link");
    //
    //     reactions.each(function (node) {
    //         var enteringLinks = links.filter(function (link) {
    //             return node.id==link.getTarget();
    //         });
    //         var exitingLinks = links.filter(function (link) {
    //             return node.id==link.getSource();
    //         });
    //
    //         // For each node, compute the centroid of the source nodes of the arcs entering that node and the centroid of the target nodes of the arc exiting that node;
    //         var resultComputeCentroid = metExploreD3.GraphLink.computeCentroid(node, enteringLinks, exitingLinks);
    //         centroidSourceX = resultComputeCentroid[0];
    //         centroidSourceY = resultComputeCentroid[1];
    //         centroidTargetX = resultComputeCentroid[2];
    //         centroidTargetY = resultComputeCentroid[3];
    //
    //
    //         // For each node, compare the difference between the x-coordinates of the 2 centroids and the difference between their y-coordinates
    //         // to determine if the axis of the reaction should be horizontal or vertical
    //         // From those test, attribute the coordinate for the entry and exit points of that node
    //         var distanceSource = Math.sqrt(Math.pow(centroidSourceX - node.x, 2) + Math.pow(centroidSourceY - node.y, 2));
    //         var distanceTarget = Math.sqrt(Math.pow(centroidTargetX - node.x, 2) + Math.pow(centroidTargetY - node.y, 2));
    //         var enteringX = node.x;
    //         var enteringY = node.y;
    //         if (Math.abs(centroidSourceX - centroidTargetX) > Math.abs(centroidSourceY - centroidTargetY)){
    //             if (centroidSourceX < centroidTargetX){
    //                 enteringX -= reactionStyle.getWidth() / 2 + 10;
    //             }
    //             else {
    //                 enteringX += reactionStyle.getWidth() / 2 + 10;
    //             }
    //         }
    //         else {
    //             if (centroidSourceY < centroidTargetY){
    //                 enteringY -= reactionStyle.getHeight() / 2 + 10;
    //             }
    //             else {
    //                 enteringY += reactionStyle.getHeight() / 2 + 10;
    //             }
    //         }
    //         var exitingX = node.x - (enteringX - node.x);
    //         var exitingY = node.y - (enteringY - node.y);
    //
    //         var axe = "horizontal";
    //         // For each node, compute the path of the arcs exiting that node, and the path of the arcs exiting that node
    //
    //         if (node.fluxDirection === 0){
    //             enteringLinks
    //                 .each(function (link) {
    //                     var path;
    //                     if (enteringY == node.y){
    //                         path = metExploreD3.GraphLink.computePathHorizontal(node, enteringX, enteringY, link.getSource());
    //                         axe="horizontal";
    //                     }
    //                     else {
    //                         path = metExploreD3.GraphLink.computePathVertical(node, enteringX, enteringY, link.getSource());
    //                         axe="vertical";
    //                     }
    //                     d3.select(this).attr("d", path)
    //                         .attr("fill", "none")
    //                         .classed("horizontal", false)
    //                         .classed("vertical", false)
    //                         .classed(axe, true)
    //                         .style("opacity", 1);
    //                 });
    //
    //             exitingLinks
    //                 .each(function (link) {
    //                     var path;
    //                     if (exitingY == node.y){
    //                         path = metExploreD3.GraphLink.computePathHorizontal(node, exitingX, exitingY, link.getTarget());
    //                         axe="horizontal";
    //                     }
    //                     else {
    //                         path = metExploreD3.GraphLink.computePathVertical(node, exitingX, exitingY, link.getTarget());
    //                         axe="vertical";
    //                     }
    //
    //                     d3.select(this).attr("d", path)
    //                         .attr("fill", "none")
    //                         .classed("horizontal", false)
    //                         .classed("vertical", false)
    //                         .classed(axe, true)
    //                         .style("opacity", 1);
    //                 });
    //         }
    //         if (node.fluxDirection > 0){
    //             enteringLinks
    //                 .each(function (link) {
    //                     var path;
    //                     if (enteringY == node.y){
    //                         path = metExploreD3.GraphLink.computePathHorizontal(node, enteringX, enteringY, link.getSource());
    //                         axe="horizontal";
    //                     }
    //                     else {
    //                         path = metExploreD3.GraphLink.computePathVertical(node, enteringX, enteringY, link.getSource());
    //                         axe="vertical";
    //                     }
    //                     d3.select(this).attr("d", path)
    //                         .attr("fill", "none")
    //                         .classed("horizontal", false)
    //                         .classed("vertical", false)
    //                         .classed(axe, true)
    //                         .style("opacity", 1);
    //                 });
    //
    //             exitingLinks
    //                 .each(function (link) {
    //                     var path;
    //                     var fluxValue = node.fluxDirection*(-1);
    //                     if (exitingY == node.y){
    //                         path = metExploreD3.GraphFlux.computePathHorizontalEnd(node, exitingX, exitingY, link.getTarget(), fluxValue);
    //                         axe="horizontal";
    //                     }
    //                     else {
    //                         path = metExploreD3.GraphFlux.computePathVerticalEnd(node, exitingX, exitingY, link.getTarget(), fluxValue);
    //                         axe="vertical";
    //                     }
    //
    //                     d3.select(this).attr("d", path)
    //                         .attr("fill", "none")
    //                         .classed("horizontal", false)
    //                         .classed("vertical", false)
    //                         .classed(axe, true)
    //                         .style("opacity", 1)
    //                         .style("stroke-linejoin", "miter");
    //                 });
    //         }
    //         if (node.fluxDirection < 0){
    //             enteringLinks
    //                 .each(function (link) {
    //                     var path;
    //                     if (enteringY == node.y){
    //                         path = metExploreD3.GraphFlux.computePathHorizontalEnd(node, enteringX, enteringY, link.getSource(), node.fluxDirection);
    //                         axe="horizontal";
    //                     }
    //                     else {
    //                         path = metExploreD3.GraphFlux.computePathVerticalEnd(node, enteringX, enteringY, link.getSource(), node.fluxDirection);
    //                         axe="vertical";
    //                     }
    //                     d3.select(this).attr("d", path)
    //                         .attr("fill", "none")
    //                         .classed("horizontal", false)
    //                         .classed("vertical", false)
    //                         .classed(axe, true)
    //                         .style("opacity", 1)
    //                         .style("stroke-linejoin", "miter");
    //                 });
    //
    //             exitingLinks
    //                 .each(function (link) {
    //                     var path;
    //                     if (exitingY == node.y){
    //                         path = metExploreD3.GraphLink.computePathHorizontal(node, exitingX, exitingY, link.getTarget());
    //                         axe="horizontal";
    //                     }
    //                     else {
    //                         path = metExploreD3.GraphLink.computePathVertical(node, exitingX, exitingY, link.getTarget());
    //                         axe="vertical";
    //                     }
    //
    //                     d3.select(this).attr("d", path)
    //                         .attr("fill", "none")
    //                         .classed("horizontal", false)
    //                         .classed("vertical", false)
    //                         .classed(axe, true)
    //                         .style("opacity", 1);
    //                 });
    //         }
    //     });
    //     metExploreD3.GraphCaption.drawCaptionFluxMode();
    //
    // },

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
                            .style("opacity", 1)
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
                            .style("opacity", 1)
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
                            .style("stroke","green")
                            .style("stroke-width",node.fluxDirection);
                    });

                exitingLinks
                    .each(function (link) {
                        var path;
                        var fluxValue = node.fluxDirection*(-1);
                        if (exitingY == node.y){
                            path = metExploreD3.GraphFlux.computePathHorizontalEnd(node, exitingX, exitingY, link.getTarget(), fluxValue);
                            axe="horizontal";
                        }
                        else {
                            path = metExploreD3.GraphFlux.computePathVerticalEnd(node, exitingX, exitingY, link.getTarget(), fluxValue);
                            axe="vertical";
                        }

                        d3.select(this).attr("d", path)
                            .attr("fill", "none")
                            .classed("horizontal", false)
                            .classed("vertical", false)
                            .classed(axe, true)
                            .style("opacity", 1)
                            .style("stroke-linejoin", "miter")
                            .style("stroke","green")
                            .style("stroke-width",node.fluxDirection);
                    });
            }
            if (node.fluxDirection < 0){
                enteringLinks
                    .each(function (link) {
                        var path;
                        if (enteringY == node.y){
                            path = metExploreD3.GraphFlux.computePathHorizontalEnd(node, enteringX, enteringY, link.getSource(), node.fluxDirection);
                            axe="horizontal";
                        }
                        else {
                            path = metExploreD3.GraphFlux.computePathVerticalEnd(node, enteringX, enteringY, link.getSource(), node.fluxDirection);
                            axe="vertical";
                        }
                        d3.select(this).attr("d", path)
                            .attr("fill", "none")
                            .classed("horizontal", false)
                            .classed("vertical", false)
                            .classed(axe, true)
                            .style("opacity", 1)
                            .style("stroke-linejoin", "miter")
                            .style("stroke","red")
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
                            .style("stroke","red")
                            .style("stroke-width",node.fluxDirection*(-1));
                    });
            }
        });
        metExploreD3.GraphCaption.drawCaptionFluxMode();

    },

    computePathHorizontalEnd : function (startNode, firstPointX, firstPointY, endNode, fluxValue) {
        // Compute the coordinates of the last point of the arc (the point in contact of the periphery of the target node)
        var metaboliteStyle = metExploreD3.getMetaboliteStyle();
        // Compute the coordinates of the control point used for drawing the path
        var controlX = endNode.x;
        var controlY = startNode.y;
        if (firstPointX < startNode.x && controlX > firstPointX){
            controlX = firstPointX - 15;
        }
        else if (firstPointX > startNode.x && controlX < firstPointX){
            controlX = firstPointX + 15;
        }
        // Compute the path of the link for 3 different cases
        var path;
        var lastPointX = endNode.x;
        var lastPointY = endNode.y;
        var beforeLastPointX = lastPointX;
        var beforeLastPointY = lastPointY;
        if (controlX == endNode.x){
            // 1st case: The end node is on the correct side of the starting node, and is close to the axe of the the reaction
            if (Math.abs(endNode.y - startNode.y) < 15){
                if (firstPointX < startNode.x){
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
                if (firstPointX == startNode.x){
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

                path = "M" + startNode.x + "," + startNode.y +
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
                if (endNode.y < startNode.y){
                    lastPointY = lastPointY + (metaboliteStyle.getHeight() / 2) - ((fluxValue * 0.01));
                    beforeLastPointY = lastPointY + 5;
                }
                else {
                    lastPointY = lastPointY - (metaboliteStyle.getHeight() / 2) + ((fluxValue * 0.01));
                    beforeLastPointY = lastPointY - 5;
                }
                var x1 = beforeLastPointX - 2;
                var x2 = beforeLastPointX + 2;
                var xMo = (beforeLastPointX+lastPointX)/2;

                path = "M" + startNode.x + "," + startNode.y +
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
            if (firstPointX < startNode.x){
                lastPointX = endNode.x - (metaboliteStyle.getWidth() / 2) + ((fluxValue * 0.01));
                beforeLastPointX = lastPointX - 5;
            }
            else {
                lastPointX = endNode.x + (metaboliteStyle.getWidth() / 2) - ((fluxValue * 0.01));
                beforeLastPointX = lastPointX + 5;
            }
            var control2X = controlX;
            var control2Y = endNode.y;
            var y1 = beforeLastPointY + 2;
            var y2 = beforeLastPointY - 2;
            var yMo = (lastPointY + beforeLastPointY)/2

            path = "M" + startNode.x + "," + startNode.y +
                "L" + firstPointX + "," + firstPointY +
                "C" + controlX + "," + controlY + "," + control2X + "," + control2Y + "," + beforeLastPointX + "," + beforeLastPointY +
                "L" + beforeLastPointX + "," + y2 +
                "L" + lastPointX + "," + yMo +
                "L" + beforeLastPointX + "," + y1 +
                "L" + beforeLastPointX + "," + beforeLastPointY;
        }
        return path;
    },

    computePathVerticalEnd : function (startNode, firstPointX, firstPointY, endNode, fluxValue) {
        // Compute the coordinates of the last point of the arc (the point in contact of the periphery of the target node)
        var metaboliteStyle = metExploreD3.getMetaboliteStyle();
        // Compute the coordinates of the control point used for drawing the path
        var controlX = startNode.x;
        var controlY = endNode.y;
        if (firstPointY < startNode.y && controlY > firstPointY){
            controlY = firstPointY - 15;
        }
        else if (firstPointY > startNode.y && controlY < firstPointY){
            controlY = firstPointY + 15;
        }
        // Compute the path of the link for 3 different cases
        var path;
        var lastPointX = endNode.x;
        var lastPointY = endNode.y;
        var beforeLastPointX = lastPointX;
        var beforeLastPointY = lastPointY;
        if (controlY == endNode.y){
            // 1st case: The end node is on the correct side of the starting node, and is close to the axe of the the reaction
            if (Math.abs(endNode.x - startNode.x) < 15){
                if (firstPointY < startNode.y){
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
                if (firstPointX == startNode.x){
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

                path = "M" + startNode.x + "," + startNode.y +
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
                if (endNode.x < startNode.x){
                    lastPointX = lastPointX + (metaboliteStyle.getWidth() / 2) - ((fluxValue * 0.01));
                    beforeLastPointX = lastPointX + 5;
                }
                else {
                    lastPointX = lastPointX - (metaboliteStyle.getWidth() / 2) + ((fluxValue * 0.01));
                    beforeLastPointX = lastPointX - 5;
                }
                var y1 = beforeLastPointY + 2;
                var y2 = beforeLastPointY - 2;
                var yMo = (lastPointY + beforeLastPointY)/2

                path = "M" + startNode.x + "," + startNode.y +
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
            if (firstPointY < startNode.y){
                lastPointY = endNode.y - (metaboliteStyle.getWidth() / 2) + ((fluxValue * 0.01));
                beforeLastPointY = lastPointY - 5;
            }
            else {
                lastPointY = endNode.y + (metaboliteStyle.getWidth() / 2) - ((fluxValue * 0.01));
                beforeLastPointY = lastPointY + 5;
            }
            var control2X = endNode.x;
            var control2Y = controlY;
            var x1 = beforeLastPointX - 2;
            var x2 = beforeLastPointX + 2;
            var xMo = (beforeLastPointX+lastPointX)/2;

            path = "M" + startNode.x + "," + startNode.y +
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

    graphDistrib: function(fluxData){
        var data = [];
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
        });

        var margin = {top: 30, right: 30, bottom: 30, left: 50},
            width = 400 - margin.left - margin.right,
            height = 400 - margin.top - margin.bottom;

        var svg = d3.select("#graphDistrib")
                    .append("svg")
                        .attr("id", "distrib")
                        .attr("width", width + margin.left + margin.right)
                        .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                        .attr("transform", "translate("+ margin.left + "," + margin.right +")");

        // console.log(values);
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
            .attr("stroke", "red")
            .attr("stroke-linejoin", "round")
            .attr("d", d3.line()
                .curve(d3.curveBasis)
                  .x(function(d) { return x(d[0]); })
                  .y(function(d) { return y(d[1]); }))
            .append("svg:text")
            .text("Distribution value graph")
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
        d3.select("#graphDistrib").select("#distrib").remove();
    }

};
