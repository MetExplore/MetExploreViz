metExploreD3.GraphStyleEdition = {

    editMode: false,
    curvedPath: false,


    toggleEditMode : function () {
        var GraphNodes = d3.select("#viz").select("#D3viz").select("#graphComponent").selectAll("g.node");
        if (metExploreD3.GraphStyleEdition.editMode==false) {
            metExploreD3.GraphStyleEdition.editMode=true;
            console.log('edit mode entered');
            GraphNodes
                .each(function(node) {
                    node.setLocked(true);
                    node.fixed = node.isLocked();
                });
            metExploreD3.GraphNetwork.animationButtonOff('viz');
            var force = _metExploreViz.getSessionById("viz").getForce();
            force.stop();
            d3.select("#viz").select("#buttonAnim").select("image").remove();
            metExploreD3.GraphStyleEdition.startDragLabel();
            var component = Ext.getCmp('editModePanel');
        }
        else {
            metExploreD3.GraphStyleEdition.editMode=false;
            console.log('edit mode exited');
            GraphNodes
                .each(function(node) {
                    node.setLocked(false);
                    node.fixed = node.isLocked();
                });
            metExploreD3.GraphNetwork.animationButtonOff('viz');
            metExploreD3.GraphStyleEdition.endDragLabel();
            metExploreD3.GraphNode.applyEventOnNode('viz');
        }
    }
    ,
    startDragLabel : function () {
        var GraphNodes = d3.select("#viz").select("#D3viz").select("#graphComponent").selectAll("g.node");
        var labelDrag = d3.behavior.drag()
            .on ("dragstart", function (d,i) {
                d3.event.sourceEvent.stopPropagation();
                d3.select(this).attr("x",d3.mouse(this)[0]);
                d3.select(this).attr("y",d3.mouse(this)[1]);
                d3.selectAll("#D3viz")
                    .style("cursor", "move");
            })
            .on("drag", function (d,i) {
                if (d3.select(this).attr("transform")) {
                    var transform = d3.transform(d3.select(this).attr("transform")).scale;
                    d3.select(this).attr("transform", "translate("+d3.event.x+", "+d3.event.y+") scale("+transform[0]+", "+transform[1]+")");
                }
                else{
                    d3.select(this).attr("transform","translate(" + d3.event.x + ", " + d3.event.y +")");
                }
                d3.select(this).attr("x",d3.mouse(this)[0]);
                d3.select(this).attr("y",d3.mouse(this)[1]);
            })
            .on("dragend", function (d,i) {
                d3.selectAll("#D3viz")
                    .style("cursor", "default");
                //console.log(d);
                //console.log(this);
            });
        if (metExploreD3.GraphStyleEdition.editMode){
            GraphNodes.selectAll("text").style("pointer-events", "auto");
            //GraphNodes.on("mouseover", null).on("mouseenter", null).on("mouseleave", null).on("mousedown", null).on("touchstart", null);
            GraphNodes.selectAll("text").call(labelDrag);
        }
    },
    endDragLabel : function () {
        var GraphNodes = d3.select("#viz").select("#D3viz").select("#graphComponent").selectAll("g.node");
        if (!metExploreD3.GraphStyleEdition.editMode) {
            GraphNodes.selectAll("text").style("pointer-events", "none");
        }
        //
    },
    changeFontSize : function (node) {
        metExploreD3.displayPrompt("Font Size", "Enter a font size", function(btn, text) {
            if (text!=null && text!="" && !isNaN(text) && btn=="ok") {
                d3.select("#viz").select("#D3viz").select("#graphComponent")
                    .selectAll("g.node")
                    .filter(function(d){return d.getId()==node.getId();})
                    .select("text")
                    .style("font-size",text+"px");
            }
        });
    },
    changeAllFontSize : function (text, targets) {
        targets = (typeof targets !== 'undefined') ? targets : 0;
        d3.select("#viz").select("#D3viz").select("#graphComponent")
            .selectAll("g.node")
            .filter(function(node){
                if (targets == 0){
                    return true;
                }
                else if (targets == "selection"){
                    return node.isSelected();
                }
                else {
                    return node.getBiologicalType() == targets;
                }
            })
            .select("text")
            .style("font-size",text+"px");
    },
    changeFontType : function (node, text) {
        d3.select("#viz").select("#D3viz").select("#graphComponent")
            .selectAll("g.node")
            .filter(function(d){return d.getId()==node.getId();})
            .select("text")
            .style("font-family",text);
    },
    changeAllFontType : function (text, targets) {
        targets = (typeof targets !== 'undefined') ? targets : 0;
        d3.select("#viz").select("#D3viz").select("#graphComponent")
            .selectAll("g.node")
            .filter(function(node){
                if (targets == 0){
                    return true;
                }
                else if (targets == "selection"){
                    return node.isSelected();
                }
                else {
                    return node.getBiologicalType() == targets;
                }
            })
            .select("text")
            .style("font-family",text);
    },
    changeFontBold : function (node) {
        var nodeLabel = d3.select("#viz").select("#D3viz").select("#graphComponent")
            .selectAll("g.node")
            .filter(function(d){return d.getId()==node.getId();})
            .select("text");
        if (nodeLabel.style("font-weight") < 700){
            nodeLabel.style("font-weight", "bold");
        }
        else {
            nodeLabel.style("font-weight", "normal");
        }
    },
    changeAllFontBold : function (bool, targets) {
        targets = (typeof targets !== 'undefined') ? targets : 0;
        var boldOrNot = (bool) ? "bold" : "normal";
        d3.select("#viz").select("#D3viz").select("#graphComponent")
            .selectAll("g.node")
            .filter(function(node){
                if (targets == 0){
                    return true;
                }
                else if (targets == "selection"){
                    return node.isSelected();
                }
                else {
                    return node.getBiologicalType() == targets;
                }
            })
            .select("text")
            .style("font-weight", boldOrNot);
    },
    changeFontItalic : function (node) {
        var nodeLabel = d3.select("#viz").select("#D3viz").select("#graphComponent")
            .selectAll("g.node")
            .filter(function(d){return d.getId()==node.getId();})
            .select("text");
        if (nodeLabel.style("font-style") != "italic"){
            nodeLabel.style("font-style", "italic");
        }
        else {
            nodeLabel.style("font-style", "normal");
        }
    },
    changeAllFontItalic : function (bool, targets) {
        targets = (typeof targets !== 'undefined') ? targets : 0;
        var italicOrNot = (bool) ? "italic" : "normal";
        d3.select("#viz").select("#D3viz").select("#graphComponent")
            .selectAll("g.node")
            .filter(function(node){
                if (targets == 0){
                    return true;
                }
                else if (targets == "selection"){
                    return node.isSelected();
                }
                else {
                    return node.getBiologicalType() == targets;
                }
            })
            .select("text")
            .style("font-style", italicOrNot);
    },
    changeFontUnderline : function (node) {
        var nodeLabel = d3.select("#viz").select("#D3viz").select("#graphComponent")
            .selectAll("g.node")
            .filter(function(d){return d.getId()==node.getId();})
            .select("text");
        if (nodeLabel.style("text-decoration-line") != "underline"){
            nodeLabel.style("text-decoration-line", "underline");
        }
        else {
            nodeLabel.style("text-decoration-line", "none");
        }
    },
    changeAllFontUnderline : function (bool, targets) {
        targets = (typeof targets !== 'undefined') ? targets : 0;
        var underlineOrNot = (bool) ? "underline" : "none";
        d3.select("#viz").select("#D3viz").select("#graphComponent")
            .selectAll("g.node")
            .filter(function(node){
                if (targets == 0){
                    return true;
                }
                else if (targets == "selection"){
                    return node.isSelected();
                }
                else {
                    return node.getBiologicalType() == targets;
                }
            })
            .select("text")
            .style("text-decoration-line", underlineOrNot);
    },
    setStartingStyle : function (node) {
        //gestion undefined à prendre en compte
        if (node.labelFont) {
            var selection = d3.select("#viz").select("#D3viz").select("#graphComponent")
                .selectAll("g.node")
                .filter(function (d) {
                    return d.getId() == node.getId();
                })
                .select("text");
            if (node.labelFont.font) { selection.style("font-family", node.labelFont.font); }
            if (node.labelFont.fontSize) { selection.style("font-size", node.labelFont.fontSize); }
            if (node.labelFont.fontBold) { selection.style("font-weight", node.labelFont.fontBold); }
            if (node.labelFont.fontItalic) { selection.style("font-style", node.labelFont.fontItalic); }
            if (node.labelFont.fontUnderline) { selection.style("text-decoration-line", node.labelFont.fontUnderline); }
            if (node.labelFont.fontOpacity) { selection.attr("opacity", node.labelFont.fontOpacity); }
        }
    },
    bundleLinks : function () {
        var reactionStyle = metExploreD3.getReactionStyle();
        var reactions = d3.select("#viz").select("#D3viz").select("#graphComponent")
            .selectAll("g.node")
            .filter(function(node){
                //console.log(node);
                //console.log(this);
                return node.getBiologicalType()=="reaction";
            })
        var links = d3.select("#viz").select("#D3viz").select("#graphComponent").selectAll("path.link");
        // Create arrowhead marker
        d3.select("#viz").select("#D3viz").select("#graphComponent").append("defs").append("marker")
            .attr("id", "marker")
            .attr("viewBox", "-10 -5 20 20")
            .attr("refX", 9)
            .attr("refY", 6)
            .attr("markerWidth", 30)
            .attr("markerHeight", 20)
            .attr("orient", "auto")
            .append("path")
            .attr("d", "M0,6L-5,12L9,6L-5,0");
        reactions.each(function (node) {
            var enteringLinks = links.filter(function (link) {
                return node.id==link.getTarget().getId();
            })
            var exitingLinks = links.filter(function (link) {
                return node.id==link.getSource().getId();
            })
            // For each node, compute the centroid of the source nodes of the arcs entering that node and the centroid of the target ,odes of the arc exiting that node;
            var resultComputeCentroid = metExploreD3.GraphStyleEdition.computeCentroid(node, enteringLinks, exitingLinks);
            var centroidSourceX = resultComputeCentroid[0];
            var centroidSourceY = resultComputeCentroid[1];
            var centroidTargetX = resultComputeCentroid[2];
            var centroidTargetY = resultComputeCentroid[3];

            // For each node, check which is the closest point to that node between the centroid of the source nodes of the arcs entering that node and the centroid of the target nodes of the arcs exiting that node
            // Then check whether that closest point is closer to the axe parallel to the x-axis or the one parallel to the y-axis passing through that node
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

            // For each node, compute the path of the arcs exiting that node, and the path of the arcs exiting that node
            enteringLinks.each(function (link) {
                //var path = metExploreD3.GraphFunction.computePath(node, enteringX, enteringY, link, link.getSource());
                var path;
                if (enteringY == node.y){
                    path = metExploreD3.GraphStyleEdition.computePathHorizontal(node, enteringX, enteringY, link.getSource());
                }
                else {
                    path = metExploreD3.GraphStyleEdition.computePathVertical(node, enteringX, enteringY, link.getSource());
                }
                d3.select(this).attr("d", path)
                    .attr("fill", "none")
                    .style("stroke", 'black')
                    .style("stroke-width", 0.5)
                    .style("opacity", 1);
                //console.log(link.getTarget());
            }).filter(function (link) {
                return link.getTarget().getReactionReversibility();
            }).attr("marker-end", "url(#marker)");
            exitingLinks.each(function (link) {
                //var path = metExploreD3.GraphFunction.computePath(node, exitingX, exitingY, link, link.getTarget());
                var path;
                if (exitingY == node.y){
                    path = metExploreD3.GraphStyleEdition.computePathHorizontal(node, exitingX, exitingY, link.getTarget());

                }
                else {
                    path = metExploreD3.GraphStyleEdition.computePathVertical(node, exitingX, exitingY, link.getTarget());
                }
                d3.select(this).attr("d", path)
                    .attr("fill", "none")
                    .style("stroke", 'black')
                    .style("stroke-width", 0.5)
                    .style("opacity", 1);
            }).attr("marker-end", "url(#marker)");
        })
        //
    },
    computePathHorizontal : function (startNode, firstPointX, firstPointY, endNode) {
        // Compute the coordinates of the last point of the arc (the point in contact of the periphery of the target node)
        var metaboliteStyle = metExploreD3.getMetaboliteStyle();
        // Compute the coordinates of the control point used for drawing the path (it is the point where all the arc entering or all the arc exiting the starting node converge)
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
                if (firstPointX == startNode.x){
                    firstSidePointX = firstPointX;
                    secondSidePointX = lastPointX;
                }
                else {
                    firstSidePointY = firstPointY;
                    secondSidePointY = lastPointY;
                }
                path = "M" + startNode.x + "," + startNode.y +
                    "L" + firstPointX + "," + firstPointY +
                    "Q" + firstSidePointX + "," + firstSidePointY + "," + middlePointX + "," + middlePointY +
                    "Q" + secondSidePointX + "," + secondSidePointY + "," + beforeLastPointX + "," + beforeLastPointY +
                    "L" + lastPointX + "," + lastPointY;
            }
            // 2nd case: The end node is on the correct side of the starting node, and is not close to the axe of the the reaction
            else {
                if (endNode.y < startNode.y){
                    lastPointY += metaboliteStyle.getHeight() / 2;
                    beforeLastPointY = lastPointY + 5;
                }
                else {
                    lastPointY -= metaboliteStyle.getHeight() / 2;
                    beforeLastPointY = lastPointY - 5;
                }
                path = "M" + startNode.x + "," + startNode.y +
                    "L" + firstPointX + "," + firstPointY +
                    "Q" + controlX + "," + controlY + "," + beforeLastPointX + "," + beforeLastPointY +
                    "L" + lastPointX + "," + lastPointY;
            }
        }
        // 3rd case: The end node is not on the correct side of the reaction
        else {
            if (firstPointX < startNode.x){
                lastPointX = endNode.x - (metaboliteStyle.getWidth() / 2);
                beforeLastPointX = lastPointX - 5;
            }
            else {
                lastPointX = endNode.x + (metaboliteStyle.getWidth() / 2);
                beforeLastPointX = lastPointX + 5;
            }
            var control2X = controlX;
            var control2Y = endNode.y;
            path = "M" + startNode.x + "," + startNode.y +
                "L" + firstPointX + "," + firstPointY +
                "C" + controlX + "," + controlY + "," + control2X + "," + control2Y + "," + beforeLastPointX + "," + beforeLastPointY +
                "L" + lastPointX + "," + lastPointY;
        }
        return path;
    },
    computePathVertical : function (startNode, firstPointX, firstPointY, endNode) {
        // Compute the coordinates of the last point of the arc (the point in contact of the periphery of the target node)
        var metaboliteStyle = metExploreD3.getMetaboliteStyle();
        // Compute the coordinates of the control point used for drawing the path (it is the point where all the arc entering or all the arc exiting the starting node converge)
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
                if (firstPointX == startNode.x){
                    firstSidePointX = firstPointX;
                    secondSidePointX = lastPointX;
                }
                else {
                    firstSidePointY = firstPointY;
                    secondSidePointY = lastPointY;
                }
                path = "M" + startNode.x + "," + startNode.y +
                    "L" + firstPointX + "," + firstPointY +
                    "Q" + firstSidePointX + "," + firstSidePointY + "," + middlePointX + "," + middlePointY +
                    "Q" + secondSidePointX + "," + secondSidePointY + "," + beforeLastPointX + "," + beforeLastPointY +
                    "L" + lastPointX + "," + lastPointY;
            }
            // 2nd case: The end node is on the correct side of the starting node, and is not close to the axe of the the reaction
            else {
                if (endNode.x < startNode.x){
                    lastPointX += metaboliteStyle.getWidth() / 2;
                    beforeLastPointX = lastPointX + 5;
                }
                else {
                    lastPointX -= metaboliteStyle.getWidth() / 2;
                    beforeLastPointX = lastPointX - 5;
                }
                path = "M" + startNode.x + "," + startNode.y +
                    "L" + firstPointX + "," + firstPointY +
                    "Q" + controlX + "," + controlY + "," + beforeLastPointX + "," + beforeLastPointY +
                    "L" + lastPointX + "," + lastPointY;
            }
        }
        // 3rd case: The end node is not on the correct side of the reaction
        else {
            if (firstPointY < startNode.y){
                lastPointY = endNode.y - (metaboliteStyle.getWidth() / 2);
                beforeLastPointY = lastPointY - 5;
            }
            else {
                lastPointY = endNode.y + (metaboliteStyle.getWidth() / 2);
                beforeLastPointY = lastPointY + 5;
            }
            var control2X = endNode.x;
            var control2Y = controlY;
            path = "M" + startNode.x + "," + startNode.y +
                "L" + firstPointX + "," + firstPointY +
                "C" + controlX + "," + controlY + "," + control2X + "," + control2Y + "," + beforeLastPointX + "," + beforeLastPointY +
                "L" + lastPointX + "," + lastPointY;
        }
        return path;
    },
    computeCentroid : function (node, enteringLinks, exitingLinks) {
        var links = d3.select("#viz").select("#D3viz").select("#graphComponent").selectAll("path.link");

        // For each node, compute the centroid of the source nodes of the arcs entering that node
        var sourceX = 0;
        var sourceY = 0;
        var countEnter = 0;
        enteringLinks.each(function (link) {
            countEnter +=1;
            sourceX += link.getSource().x;
            sourceY += link.getSource().y;
        })
        var centroidSourceX = sourceX / countEnter;
        var centroidSourceY = sourceY / countEnter;

        // For each node, compute the centroid of the target nodes of the arcs exiting that node
        var targetX = 0;
        var targetY = 0;
        var countExit = 0;
        exitingLinks.each(function (link) {
            countExit +=1;
            targetX += link.getTarget().x;
            targetY += link.getTarget().y;
        })
        var centroidTargetX = targetX / countExit;
        var centroidTargetY = targetY / countExit;

        return [centroidSourceX, centroidSourceY, centroidTargetX, centroidTargetY];
    },
    createLabelStyleObject : function (node) {
        var nodeLabel = d3.select("#viz").select("#D3viz").select("#graphComponent")
            .selectAll("g.node")
            .filter(function(d){return d.getId()==node.getId();})
            .select("text");
        var labelStyle = {
            font : nodeLabel.style("font-family"),
            fontSize : nodeLabel.style("font-size"),
            fontBold : nodeLabel.style("font-weight"),
            fontItalic : nodeLabel.style("font-style"),
            fontUnderline : nodeLabel.style("text-decoration-line"),
            fontOpacity : nodeLabel.attr("opacity")
        };
        return labelStyle;
    }

}