/**
 * @author Adrien Rohan
 * (a)description : Style Edition
 */

metExploreD3.GraphStyleEdition = {

    editMode: false,
    curvedPath: false,
    allDrawnCycles: [],


    /*******************************************
     * Enter or exit style edition mode
     */
    toggleEditMode : function () {
        // Enter edition mode, revealing the editModePanel, stopping force layout, and initiating label dragging, or leave the edition Mode
        var GraphNodes = d3.select("#viz").select("#D3viz").select("#graphComponent").selectAll("g.node");
        if (metExploreD3.GraphStyleEdition.editMode==false) {
            metExploreD3.GraphStyleEdition.editMode=true;
            console.log('edit mode entered');
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
            metExploreD3.GraphNetwork.animationButtonOff('viz');
            metExploreD3.GraphStyleEdition.endDragLabel();
            metExploreD3.GraphNode.applyEventOnNode('viz');
        }
    },

    /*******************************************
     * Allow moving of node label on drag
     */
    startDragLabel : function () {
        // Apply drag event on node labels
        var GraphNodes = d3.select("#viz").select("#D3viz").select("#graphComponent").selectAll("g.node");
        var labelDrag = metExploreD3.GraphStyleEdition.createDragBehavior();
        if (metExploreD3.GraphStyleEdition.editMode){
            GraphNodes.selectAll("text").style("pointer-events", "auto");
            GraphNodes.selectAll("text").call(labelDrag);
        }
    },

    /*******************************************
     * End moving of node label on drag
     */
    endDragLabel : function () {
        // Remove drag event on node labels
        var GraphNodes = d3.select("#viz").select("#D3viz").select("#graphComponent").selectAll("g.node");
        if (!metExploreD3.GraphStyleEdition.editMode) {
            GraphNodes.selectAll("text").style("pointer-events", "none");
        }
        GraphNodes.selectAll("rect").on("mouseover", null).on("mouseenter", null).on("mouseleave", null).on("mousedown", null).on("touchstart", null);
        //
    },

    /*******************************************
     * Create drag-and-drop behavior
     */
    createDragBehavior : function () {
        var deltaX;
        var deltaY;
        var element;
        var drag = d3.behavior.drag()
            .on ("dragstart", function (d,i) {
                d3.event.sourceEvent.stopPropagation();
                element = this;
                var cX = d3.select(this).attr("x");
                var cY = d3.select(this).attr("y");
                deltaX = cX - d3.mouse(element)[0];
                deltaY = cY - d3.mouse(element)[1];
                d3.selectAll("#D3viz")
                    .style("cursor", "move");
                d3.select(this)
                    .each(function(d){
                        this.parentNode.parentNode.appendChild(this.parentNode);
                    });
            })
            .on("drag", function (d,i) {
                if (d3.select(this).attr("transform")) {
                    var transformScale = d3.transform(d3.select(this).attr("transform")).scale;
                    d3.select(this).attr("transform", "translate(" + (d3.event.x + deltaX) + ", " + (d3.event.y + deltaY) + ") scale(" + transformScale[0] + ", " + transformScale[1] + ")");
                }
                else{
                    d3.select(this).attr("transform", "translate(" + (d3.event.x + deltaX) + ", " + (d3.event.y + deltaY) + ")");
                }
                d3.select(this).attr("x", d3.mouse(element)[0] + deltaX);
                d3.select(this).attr("y", d3.mouse(element)[1] + deltaY);
            })
            .on("dragend", function (d,i) {
                d3.selectAll("#D3viz")
                    .style("cursor", "default");
            });
        return drag;
    },

    /*******************************************
     * Add element in the corner of an image that can be used to resize that image
     * @param {} image : The g element containing the image on which to add the element
     */
    applyResizeHandle : function (image) {
        var imgWidth = Number(image.attr("width"));
        var imgHeight = Number(image.attr("height"));
        var deltaGX = 0;
        var oldX = 0;
        var oldY = 0;
        var limitX = 0;

        var drag = d3.behavior.drag().on("dragstart", function () {
            d3.event.sourceEvent.stopPropagation();
            imgWidth = Number(image.attr("width"));
            imgHeight = Number(image.attr("height"));
            oldX = d3.transform(d3.select(this.parentNode).attr("transform")).translate[0];
            oldY = d3.transform(d3.select(this.parentNode).attr("transform")).translate[1];
            limitX = oldX + imgWidth;
            d3.selectAll("#D3viz").style("cursor", "move");
        }).on('drag', function () {
            var newWidth = 0;
            var newHeight = 0;
            if (d3.select(this).attr("class") === "LL" || d3.select(this).attr("class") === "UL") {
                var tmpWidth = d3.select(this.parentNode).attr("width");
                newWidth = tmpWidth - (d3.event.x + deltaGX);
                var transform = d3.select(this.parentNode).attr("transform");
                var transformList = transform.split(/(translate\([\d.,\-\s]*\))/);
                var x = d3.transform(d3.select(this.parentNode).attr("transform")).translate[0];
                var y = d3.transform(d3.select(this.parentNode).attr("transform")).translate[1];
                var newX = x + d3.event.x + deltaGX;
                newX = Math.min(newX, limitX - 8);
                var translate = "translate(" + newX + "," + y + ")";
                d3.select(this.parentNode).attr("transform", transformList[0] + translate + transformList[2]);
            }
            else {
                newWidth = d3.event.x - deltaGX;
            }
            newWidth = Math.max(newWidth, 8);
            newHeight = imgHeight * (newWidth/imgWidth);
            newWidth = (newWidth > 0) ? newWidth : 0;
            newHeight = (newHeight > 0) ? newHeight : 0;
            image.attr("width", newWidth);
            image.attr("height", newHeight);
            if (d3.select(this).attr("class") === "UL" || d3.select(this).attr("class") === "UR") {
                var transform = d3.select(this.parentNode).attr("transform");
                var transformList = transform.split(/(translate\([\d.,\-\s]*\))/);
                var x = d3.transform(d3.select(this.parentNode).attr("transform")).translate[0];
                var y = d3.transform(d3.select(this.parentNode).attr("transform")).translate[1];
                var newY =  oldY - (newHeight - imgHeight);
                var translate = "translate(" + x + "," + newY + ")";
                d3.select(this.parentNode).attr("transform", transformList[0] + translate + transformList[2]);
            }
            metExploreD3.GraphStyleEdition.updateImageDimensions(image);
        }).on("dragend", function () {
            d3.selectAll("#D3viz").style("cursor", "default");
        });

        image.append("rect").attr("class", "W1").attr("width", 2).attr("height", imgHeight).attr("fill", "grey").attr("opacity", 0.5);
        image.append("rect").attr("class", "W2").attr("width", 2).attr("height", imgHeight).attr("fill", "grey").attr("opacity", 0.5)
            .attr("transform", "translate(" + (imgWidth - 2) + ",0)");
        image.append("rect").attr("class", "H1").attr("width", imgWidth).attr("height", 2).attr("fill", "grey").attr("opacity", 0.5);
        image.append("rect").attr("class", "H2").attr("width", imgWidth).attr("height", 2).attr("fill", "grey").attr("opacity", 0.5)
            .attr("transform", "translate(0," + (imgHeight - 2) + ")");
        image.append("rect").attr("class", "UL").attr("width", 4).attr("height", 4).attr("fill", "blue").attr("opacity", 0.5)
            .call(drag);
        image.append("rect").attr("class", "UR").attr("width", 4).attr("height", 4).attr("fill", "blue").attr("opacity", 0.5)
            .attr("transform", "translate(" + (imgWidth - 4) + ",0)")
            .call(drag);
        image.append("rect").attr("class", "LL").attr("width", 4).attr("height", 4).attr("fill", "blue").attr("opacity", 0.5)
            .attr("transform", "translate(0," + (imgHeight - 4) + ")")
            .call(drag);
        image.append("rect").attr("class", "LR") .attr("width", 4).attr("height", 4).attr("fill", "blue").attr("opacity", 0.5)
            .attr("transform", "translate(" + (imgWidth - 4) + "," + (imgHeight - 4) + ")")
            .call(drag);
    },

    /*******************************************
     * Resize an image and any associated resize handles so that they correspond to the dimension of their parent element
     * @param {} image : The g element containing the image to resize
     */
    updateImageDimensions : function(image) {
        var imgWidth = image.attr("width");
        var imgHeight = image.attr("height");
        // Start test
        imgWidth = (imgWidth > 0) ? imgWidth : 0;
        imgHeight = (imgHeight > 0) ? imgHeight : 0;
        // End test
        image.select(".mappingImage").attr("width", imgWidth);
        image.select(".mappingImage").attr("height", imgHeight);
        image.select(".UR").attr("transform", "translate(" + (imgWidth - 4) + ", 0)");
        image.select(".LL").attr("transform", "translate(0, " + (imgHeight - 4) + ")");
        image.select(".LR").attr("transform", "translate(" + (imgWidth - 4) + ", " + (imgHeight - 4) + ")");
        image.select(".W1").attr("height", imgHeight);
        image.select(".W2").attr("height", imgHeight).attr("transform", "translate(" + (imgWidth - 2) + ",0)");
        image.select(".H1").attr("width", imgWidth);
        image.select(".H2").attr("width", imgWidth).attr("transform", "translate(0," + (imgHeight - 2) + ")");
    },

    /*******************************************
     * Change text of node label
     * @param {} node : The node whose label will be modified
     * @param {} panel : The panel where the action is launched
     * @param {} text : The new text of the node label
     */
    changeNodeLabel: function (node, panel, text) {
        var nodeElement = d3.select("#"+panel).select("#D3viz").select("#graphComponent")
            .selectAll("g.node")
            .filter(function(d){return d.getId()==node.getId();});
        var transform = nodeElement.select("text").attr("transform");
        var style = nodeElement.select("text").attr("style");
        var x = nodeElement.select("text").attr("x");
        var y = nodeElement.select("text").attr("y");
        var dy = nodeElement.select("text").attr("dy");
        nodeElement.select("text").remove();
        nodeElement.append("svg:text")
            .attr("fill", "black")
            .attr("class", function(d) { return d.getBiologicalType(); })
            .each(function(d) {
                var el = d3.select(this);
                text = text.split(' ');
                el.text('');
                for (var i = 0; i < text.length; i++) {
                    var nameDOMFormat = $("<div/>").html(text[i]).text();
                    var tspan = el.append('tspan').text(nameDOMFormat);
                    if (i > 0)
                        tspan.attr('x', 0).attr('dy', '10');
                }
            })
            .attr("transform", transform)
            .attr("style", style)
            .attr("x", x)
            .attr("y", y)
            .attr("dy", dy);
    },

    /*******************************************
     * Change the font size of a node label
     * @param {} node : The node whose label will be modified
     */
    changeFontSize : function (node) {
        // Change the font size of the node label
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

    /*******************************************
     * Change the font size of multiple node labels
     * @param {} text : The new font size of the node label
     * @param {} targets : The nodes whose label will be modified
     */
    changeAllFontSize : function (text, targets) {
        // Change the font size of all the targeted nodes labels
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
    /*******************************************
     * Change the font of a node label
     * @param {} node : The node whose label will be modified
     * @param {} text : The new font of the node label
     */
    changeFontType : function (node, text) {
        // Change the font of the node label
        d3.select("#viz").select("#D3viz").select("#graphComponent")
            .selectAll("g.node")
            .filter(function(d){return d.getId()==node.getId();})
            .select("text")
            .style("font-family",text);
    },

    /*******************************************
     * Change the font family of multiple node labels
     * @param {} text : The new font of the node label
     * @param {} targets : The nodes whose label will be modified
     */
    changeAllFontType : function (text, targets) {
        // Change the font of all the targeted nodes labels
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

    /*******************************************
     * Change whether the font of a node label is bold or not
     * @param {} node : The node whose label will be modified
     */
    changeFontBold : function (node) {
        // Change the font boldness of the node label
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

    /*******************************************
     * Change whether the font of multiple node labels is bold or not
     * @param {} bool : True to change the font to bold, false to change back to normal
     * @param {} targets : The nodes whose label will be modified
     */
    changeAllFontBold : function (bool, targets) {
        // Change the font boldness of all the targeted nodes labels
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

    /*******************************************
     * Change whether the font of a node label is italic or not
     * @param {} node : The node whose label will be modified
     */
    changeFontItalic : function (node) {
        // Italicize the font of the node label or revert to normal
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

    /*******************************************
     * Change whether the font of multiple node labels is italic or not
     * @param {} bool : True to change the font to italic, false to change back to normal
     * @param {} targets : The nodes whose label will be modified
     */
    changeAllFontItalic : function (bool, targets) {
        // Italicize the font of all the targeted nodes labels or revert to normal
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

    /*******************************************
     * Change whether a node label is underlined or not
     * @param {} node : The node whose label will be modified
     */
    changeFontUnderline : function (node) {
        // Underline the font of the node label or revert to normal
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

    /*******************************************
     * Add or remove underline to multiple node labels
     * @param {} bool : True to add underline to the label, false to remove them
     * @param {} targets : The nodes whose label will be modified
     */
    changeAllFontUnderline : function (bool, targets) {
        // Underline the font of all the targeted nodes labels or revert to normal
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

    /*******************************************
     * Apply label style if style data are associated to the node
     * @param {} node : The node whose label will be modified
     */
    setStartingStyle : function (node) {
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
            if (node.labelFont.fontX) { selection.attr("x", node.labelFont.fontX); }
            if (node.labelFont.fontY) { selection.attr("y", node.labelFont.fontY); }
            if (node.labelFont.fontTransform) { selection.attr("transform", node.labelFont.fontTransform); }
        }
    },
    setStartingImageStyle : function (node) {
        if (node.imagePosition) {
            var selection = d3.select("#viz").select("#D3viz").select("#graphComponent")
                .selectAll("g.node")
                .filter(function (d) {
                    return d.getId() == node.getId();
                })
                .select(".imageNode");
            var imgWidth = selection.attr("width");
            var imgHeight = selection.attr("height");
            if (node.imagePosition.imageX) { selection.attr("x", node.imagePosition.imageX); }
            if (node.imagePosition.imageY) { selection.attr("y", node.imagePosition.imageY); }
            if (node.imagePosition.imageWidth) {
                selection.attr("width", node.imagePosition.imageWidth);
                selection.attr("height", node.imagePosition.imageWidth * imgHeight / imgWidth);
            }
            if (node.imagePosition.imageTransform) { selection.attr("transform", node.imagePosition.imageTransform); }
            metExploreD3.GraphStyleEdition.updateImageDimensions(selection);
        }
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
            fontOpacity : nodeLabel.attr("opacity"),
            fontX : nodeLabel.attr("x"),
            fontY : nodeLabel.attr("y"),
            fontTransform : nodeLabel.attr("transform")
        };
        return labelStyle;
    },
    createImageStyleObject : function (node) {
        var nodeImage = d3.select("#viz").select("#D3viz").select("#graphComponent")
            .selectAll("g.node")
            .filter(function(d){return d.getId()==node.getId();})
            .select(".imageNode");
        if (!nodeImage.empty()) {
            var imageStyle = {
                imageX: nodeImage.attr("x"),
                imageY: nodeImage.attr("y"),
                imageWidth: nodeImage.attr("width"),
                imageTransform: nodeImage.attr("transform")
            };
            return imageStyle;
        }
        else {
            return undefined;
        }
    },

    /*******************************************
     * Draw links using Bezier curves and bundle together all links entering a reaction and all links exiting a reaction
     */
    bundleLinks : function () {
        var reactionStyle = metExploreD3.getReactionStyle();
        var reactions = d3.select("#viz").select("#D3viz").select("#graphComponent")
            .selectAll("g.node")
            .filter(function(node){
                return node.getBiologicalType()=="reaction";
            });
        var links = d3.select("#viz").select("#D3viz").select("#graphComponent").selectAll("path.link");
        // Create arrowhead marker
        d3.select("#viz").select("#D3viz").select("#graphComponent").append("defs").append("marker")
            .attr("id", "markerExit")
            .attr("viewBox", "-10 -5 20 20")
            .attr("refX", 9).attr("refY", 6)
            .attr("markerUnits", "userSpaceOnUse")
            .attr("markerWidth", 15).attr("markerHeight", 10)
            .attr("orient", "auto")
            .attr("fill", "green").attr("stroke", "black")
            .append("path")
            .attr("d", "M0,6L-5,12L9,6L-5,0L0,6");
        d3.select("#viz").select("#D3viz").select("#graphComponent").append("defs").append("marker")
            .attr("id", "markerEntry")
            .attr("viewBox", "-10 -5 20 20")
            .attr("refX", 9).attr("refY", 6)
            .attr("markerUnits", "userSpaceOnUse")
            .attr("markerWidth", 15).attr("markerHeight", 10)
            .attr("orient", "auto")
            .attr("fill", "red").attr("stroke", "black")
            .append("path")
            .attr("d", "M0,6L-5,12L9,6L-5,0L0,6");

        reactions.each(function (node) {
            var enteringLinks = links.filter(function (link) {
                return node.id==link.getTarget().getId();
            });
            var exitingLinks = links.filter(function (link) {
                return node.id==link.getSource().getId();
            });

            // Check if some links are part of a cycle and return the midsection of the arc instead of the centroid if this is the case
            var centroidSourceX = 0;
            var centroidSourceY = 0;
            var centroidTargetX = 0;
            var centroidTargetY = 0;
            var isCycleReaction = false;
            var enteringArcLink; // The entering link that is part of a cycle
            var exitingArcLink; // The exiting link that is part of a cycle
            enteringLinks.each(function (link) {
                if (link.partOfCycle === true){
                    isCycleReaction = true;
                    enteringArcLink = link;
                    var path = metExploreD3.GraphStyleEdition.computePathCycleArc(link.getTarget(), d3.select(this), link.getSource());
                    d3.select(this).attr("d", path);
                    var enteringMidPoint = this.getPointAtLength(this.getTotalLength()/2);
                    centroidSourceX = enteringMidPoint.x;
                    centroidSourceY = enteringMidPoint.y;
                }
            });
            exitingLinks.each(function (link) {
                if (link.partOfCycle === true){
                    isCycleReaction = true;
                    exitingArcLink = link;
                    var path = metExploreD3.GraphStyleEdition.computePathCycleArc(link.getSource(), d3.select(this), link.getTarget());
                    d3.select(this).attr("d", path);
                    var exitingMidPoint = this.getPointAtLength(this.getTotalLength()/2);
                    centroidTargetX = exitingMidPoint.x;
                    centroidTargetY = exitingMidPoint.y;
                }
            });



            // For each node, compute the centroid of the source nodes of the arcs entering that node and the centroid of the target nodes of the arc exiting that node;
            if (isCycleReaction === false) {
                var resultComputeCentroid = metExploreD3.GraphStyleEdition.computeCentroid(node, enteringLinks, exitingLinks);
                centroidSourceX = resultComputeCentroid[0];
                centroidSourceY = resultComputeCentroid[1];
                centroidTargetX = resultComputeCentroid[2];
                centroidTargetY = resultComputeCentroid[3];
            }

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
                // Handle the case where the link is a cycle arc or one of the links coming/exiting from the reaction is an arc
                if (link.partOfCycle === true){
                    path = d3.select(this).attr("d");
                }
                else if (isCycleReaction === true){
                    path = metExploreD3.GraphStyleEdition.computePathArcSibling(node, centroidSourceX, centroidSourceY, link.getSource(), enteringX, enteringY, enteringArcLink);
                }
                else if (enteringY == node.y){
                    path = metExploreD3.GraphStyleEdition.computePathHorizontal(node, enteringX, enteringY, link.getSource());
                }
                else {
                    path = metExploreD3.GraphStyleEdition.computePathVertical(node, enteringX, enteringY, link.getSource());
                }
                d3.select(this).attr("d", path)
                    .attr("fill", "none")
                    .style("opacity", 1);
            }).filter(function (link) {
                return link.getTarget().getReactionReversibility();
            }).attr("marker-end", "url(#markerEntry)");
            exitingLinks.each(function (link) {
                var path;
                if (link.partOfCycle === true){
                    path = d3.select(this).attr("d");
                }
                else if (isCycleReaction === true){
                    path = metExploreD3.GraphStyleEdition.computePathArcSibling(node, centroidTargetX, centroidTargetY, link.getTarget(), exitingX, exitingY, exitingArcLink);
                }
                else if (exitingY == node.y){
                    path = metExploreD3.GraphStyleEdition.computePathHorizontal(node, exitingX, exitingY, link.getTarget());

                }
                else {
                    path = metExploreD3.GraphStyleEdition.computePathVertical(node, exitingX, exitingY, link.getTarget());
                }
                d3.select(this).attr("d", path)
                    .attr("fill", "none")
                    .style("opacity", 1);
            }).attr("marker-end", "url(#markerExit)");
        });
        //
        metExploreD3.GraphCaption.drawCaptionEditMode();
    },
    /*******************************************
     * Compute path of an edge belonging to cycle
     * @param {} startNode : The node at the start of the path
     * @param {} link : The link between the two nodes
     * @param {} endNode : The node at the end of the path
     */
    computePathCycleArc : function (startNode, link, endNode) {
        var path = "";
        link.each(function (d) {
            var radius = d.cycleRadius;
            if (d.getSource() === startNode) {
                var sweepFlag = (d.arcDirection === "clockwise") ? 1 : 0;
            }
            else {
                var sweepFlag = (d.arcDirection === "clockwise") ? 0 : 1;
            }
            path = "M" + startNode.x + "," + startNode.y +
                "A" + radius + "," + radius + "," + 0 + "," + 0 + "," + sweepFlag + "," + endNode.x + "," + endNode.y;
            d3.select(this).attr("d", path);
            var endPoint = this.getPointAtLength(this.getTotalLength() - metExploreD3.getMetaboliteStyle().getWidth() / 2);
            path = "M" + startNode.x + "," + startNode.y +
                "A" + radius + "," + radius + "," + 0 + "," + 0 + "," + sweepFlag + "," + endPoint.x + "," + endPoint.y;
        });
        return path;
    },
    /*******************************************
     * Compute path of an edge so that the axe of the reaction is horizontal
     * @param {} startNode : The node at the start of the path
     * @param {} firstPointX : The x coordinate of the point where the edge will merge with other edges which are also substrate or product of the reaction
     * @param {} firstPointY : The y coordinate of the point where the edge will merge with other edges which are also substrate or product of the reaction
     * @param {} endNode : The node at the end of the path
     */
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

                // TODO Test to remove in the end
                /*// Arrow disappear in first case
                var midPointX = controlX + (firstPointX - controlX) * (3/4);
                var midPointY = controlY + (firstPointY - controlY) * (3/4);
                var quarterPointX = controlX + (firstPointX - controlX) / 4;
                var quarterPointY = controlY + (firstPointY - controlY) / 4;
                var lengthLine = Math.sqrt(Math.pow((endNode.x - quarterPointX),2) + Math.pow((endNode.y - quarterPointY),2));
                var divide = lengthLine / (metaboliteStyle.getHeight() / 2);
                lastPointX = endNode.x + (quarterPointX - endNode.x) / divide;
                lastPointY = endNode.y + (quarterPointY - endNode.y) / divide;
                path = "M" + startNode.x + "," + startNode.y +
                    "L" + firstPointX + "," + firstPointY +
                    "L" + midPointX + "," + midPointY +
                    "Q" + quarterPointX + "," + quarterPointY + "," + lastPointX + "," + lastPointY;
                //*/
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
    /*******************************************
     * Compute path of an edge so that the axe of the reaction is vertical
     * @param {} startNode : The node at the start of the path
     * @param {} firstPointX : The x coordinate of the point where the edge will merge with other edges which are also substrate or product of the reaction
     * @param {} firstPointY : The y coordinate of the point where the edge will merge with other edges which are also substrate or product of the reaction
     * @param {} endNode : The node at the end of the path
     */
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

                // TODO Test to remove in the end
                /*var midPointX = controlX + (firstPointX - controlX) * (3/4);
                var midPointY = controlY + (firstPointY - controlY) * (3/4);
                var quarterPointX = controlX + (firstPointX - controlX) / 4;
                var quarterPointY = controlY + (firstPointY - controlY) / 4;
                var lengthLine = Math.sqrt(Math.pow((endNode.x - quarterPointX),2) + Math.pow((endNode.y - quarterPointY),2));
                var divide = lengthLine / (metaboliteStyle.getHeight() / 2);
                lastPointX = endNode.x + (quarterPointX - endNode.x) / divide;
                lastPointY = endNode.y + (quarterPointY - endNode.y) / divide;
                path = "M" + startNode.x + "," + startNode.y +
                    "L" + firstPointX + "," + firstPointY +
                    "L" + midPointX + "," + midPointY +
                    "Q" + quarterPointX + "," + quarterPointY + "," + lastPointX + "," + lastPointY;
                //*/
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
    computePathArcSibling: function (startNode, firstPointX, firstPointY, endNode, enteringX, enteringY, arcLink) {
        var path = "";
        if (enteringY == startNode.y){
            path = metExploreD3.GraphStyleEdition.computePathHorizontal(startNode, enteringX, enteringY, endNode);
        }
        else {
            path = metExploreD3.GraphStyleEdition.computePathVertical(startNode, enteringX, enteringY, endNode);
        }

        // Test arc
        var radius = arcLink.cycleRadius;
        var sweepFlag = "";
        if (arcLink.getSource() === startNode) {
            sweepFlag = (arcLink.arcDirection === "clockwise") ? 1 : 0;
        }
        else {
            sweepFlag = (arcLink.arcDirection === "clockwise") ? 0 : 1;
        }
        //


        var differenceStartEndX = startNode.x - endNode.x;
        var differenceStartEndY = startNode.y - endNode.y;
        //var differenceStartMidpointX = startNode.x - endNode.x;
        //var differenceStartMidpointY = startNode.y - endNode.y;
        //var differenceEndMidpointX = startNode.x - endNode.x;
        //var differenceEndMidpointY = startNode.y - endNode.y;
        if (Math.abs(differenceStartEndX) < Math.abs(differenceStartEndY)){
            path = "M" + startNode.x + "," + startNode.y +
                "A" + radius + "," + radius + "," + 0 + "," + 0 + "," + sweepFlag + "," + firstPointX + "," + firstPointY +
                "L" + firstPointX + "," + endNode.y +
                "L" + endNode.x + "," + endNode.y;
        }
        else {
            path = "M" + startNode.x + "," + startNode.y +
                "A" + radius + "," + radius + "," + 0 + "," + 0 + "," + sweepFlag + "," + firstPointX + "," + firstPointY +
                "L" + endNode.x + "," + firstPointY +
                "L" + endNode.x + "," + endNode.y;
        }
        if (Math.abs(differenceStartEndX) < Math.abs(differenceStartEndY)){
            path = "M" + startNode.x + "," + startNode.y +
                "A" + radius + "," + radius + "," + 0 + "," + 0 + "," + sweepFlag + "," + firstPointX + "," + firstPointY +
                "Q" + firstPointX + "," + endNode.y + "," + endNode.x + "," +endNode.y;
        }
        else {
            path = "M" + startNode.x + "," + startNode.y +
                "A" + radius + "," + radius + "," + 0 + "," + 0 + "," + sweepFlag + "," + firstPointX + "," + firstPointY +
                "Q" + endNode.x + "," + firstPointY + "," + endNode.x + "," + endNode.y;
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
            countEnter += 1;
            sourceX += link.getSource().x;
            sourceY += link.getSource().y;
        });
        var centroidSourceX = sourceX / countEnter;
        var centroidSourceY = sourceY / countEnter;

        // For each node, compute the centroid of the target nodes of the arcs exiting that node
        var targetX = 0;
        var targetY = 0;
        var countExit = 0;
        exitingLinks.each(function (link) {
            countExit += 1;
            targetX += link.getTarget().x;
            targetY += link.getTarget().y;
        });
        var centroidTargetX = targetX / countExit;
        var centroidTargetY = targetY / countExit;

        return [centroidSourceX, centroidSourceY, centroidTargetX, centroidTargetY];
    },
    mapImageToNode : function(fileList, arg){
        var listNames = [];
        for (var i=0; i<fileList.length; i++){
            if (fileList[i].type === "image/png" || fileList[i].type === "image/jpeg" || fileList[i].type === "image/svg+xml"){
                var nodeName = fileList[i].name.replace(/\.[^/.]+$/, "");
                if (listNames.includes(nodeName)){
                    continue;
                }
                listNames.push(nodeName);
                var urlImage = URL.createObjectURL(fileList[i]);
                var node = d3.select("#viz").select("#D3viz").select("#graphComponent")
                    .selectAll("g.node")
                    .filter(function (d) {
                        var style = (d.getBiologicalType() === "metabolite") ? metExploreD3.getMetaboliteStyle() : metExploreD3.getReactionStyle();
                        var label = style.getDisplayLabel(d, style.getLabel());
                        //var target = (arg === "Name") ? d.name : d.dbIdentifier;
                        var target = (arg === "Name") ? label : d.dbIdentifier;
                        return (nodeName === target);
                    });
                if (!node.select(".imageNode").empty()){
                    node.select(".imageNode").remove();
                }
                var img = new Image();
                img.src = urlImage;
                img.node = node;
                img.onload = function () {
                    var imgWidth = this.width;
                    var imgHeight = this.height;

                    if (imgWidth > 150){
                        imgHeight = imgHeight * (150/imgWidth);
                        imgWidth = 150;
                    }
                    var offsetX = -imgWidth/2;
                    this.node.append("g")
                        .attr("class", "imageNode")
                        .attr("x", 0)
                        .attr("y", 0)
                        .attr("width", imgWidth)
                        .attr("height", imgHeight)
                        .attr("opacity", 1)
                        .attr("transform", "translate(" + offsetX + ",20)");
                    this.node.selectAll(".imageNode")
                        .append("image")
                        .attr("class", "mappingImage")
                        .attr("href", this.src)
                        .attr("width", imgWidth)
                        .attr("height", imgHeight)
                        .attr("opacity", 1);
                    metExploreD3.GraphStyleEdition.applyEventOnImage(this.node.select(".imageNode"));
                    this.node.selectAll(".imageNode")
                        .each(function(d){
                            metExploreD3.GraphStyleEdition.setStartingImageStyle(d);
                            this.parentNode.parentNode.appendChild(this.parentNode);
                        });
                };
            }
        }
    },
    displayMappedImage: function (node) {
        var mappedImage = d3.select("#viz").select("#D3viz").select("#graphComponent")
            .selectAll("g.node")
            .filter(function(d){return d.getId() === node.getId();})
            .select(".imageNode");
        if (mappedImage.attr("opacity") === '0'){
            mappedImage.attr("opacity", 1);
        }
        else {
            mappedImage.attr("opacity", 0);
        }
    },
    applyEventOnImage : function (image) {
        image.on("mouseenter", function () {
            var mouseleaveEvent = new MouseEvent("mouseleave");
            this.parentNode.dispatchEvent(mouseleaveEvent);
        }).on("mouseleave", function () {
            var mouseenterEvent = new MouseEvent("mouseenter");
            this.parentNode.dispatchEvent(mouseenterEvent);
        });
        var drag = metExploreD3.GraphStyleEdition.createDragBehavior();
        image.call(drag);
        metExploreD3.GraphStyleEdition.applyResizeHandle(image);

    },
    /*******************************************
     * Find all the metabolic cycles in the graph that is shown in the visualisation panel
     * @param {} node : Optional argument. If a node is given as argument, only the cycle passing through that node will be found.
     */
    findAllCycles: function (listNodes) {
        listNodes = (typeof listNodes !== 'undefined') ? listNodes : [];
        // Create a new data structure for the graph to efficiently run the Johnson algorithm
        var vertices = [];
        var edges = [];
        var graph = [];
        var flag = "All";

        d3.select("#viz").select("#D3viz").select("#graphComponent").selectAll("g.node")
            .filter(function (d) {
                return (d.isSideCompound !== true);
            })
            .each(function (d) {
                vertices.push(d.id);
            });
        // If a list of nodes has been passed as an argument, we set on of these nodes as the first nodes of the list of vertices
        if (listNodes.length >= 1){
            vertices[vertices.indexOf(listNodes[0].id)] = vertices[0];
            vertices[0] = listNodes[0].id;
            flag = "Single";
        }
        // Side compounds are not included in the new graph structures
        // From each edges exiting or entering from a reversible reaction, a new edge between the same vertices but going into the opposite direction is created
        d3.select("#viz").select("#D3viz").select("#graphComponent").selectAll("path.link")
            .style("stroke", "black")
            .style("stroke-width", "0.5")
            .filter(function (d) {
                return (d.getSource().isSideCompound !== true && d.getTarget().isSideCompound !== true)
            })
            .each(function (d) {
                var reactionNode = (d.getSource().biologicalType === "reaction") ? d.getSource() : d.getTarget();
                var edge = [];
                edge.push(d.getSource().id);
                edge.push(d.getTarget().id);
                edges.push(edge);
                if (reactionNode.reactionReversibility === true){
                    var backEdge = [];
                    backEdge.push(d.getTarget().id);
                    backEdge.push(d.getSource().id);
                    edges.push(backEdge);
                }
            });

        // Create the graph structure for the cycle enumeration algorithm, such as each vertex is represented by an arbitrary number
        // Also create data structure to get the vertex id back from the number given to each vertex, and vice versa
        var indexToVertices = {};
        var verticesToIndex = {};
        for (var i=0; i<vertices.length; i++){
            indexToVertices[i] = vertices[i];
        }
        for (var key in indexToVertices){
            verticesToIndex[indexToVertices[key]] = Number(key);
        }
        for (var i=0; i<vertices.length; i++){
            graph.push([]);
        }
        for (var i=0; i<edges.length; i++) {
            var index = verticesToIndex[edges[i][0]];
            var value = verticesToIndex[edges[i][1]];
            graph[index].push(value);
        }

        // The cycle enumeration algorithm itself
        var result = metExploreD3.GraphStyleEdition.HawickJamesAlgorithm(graph, flag);

        // From the cycles as array of arbitrary number, get back the cycles as array of vertex id
        var cycleList = [];
        for (var i=0; i<result.length; i++){
            var cycle = [];
            for (var j=0; j<result[i].length; j++){
                cycle.push(indexToVertices[result[i][j]]);
            }
            cycleList.push(cycle)
        }

        // Keep only the cycles containing all the input nodes
        var listSelectedNodesCycles = [];
        for (var i=0; i<cycleList.length; i++){
            var f = true;
            for (var j=0; j<listNodes.length; j++){
                if (!(cycleList[i].includes(listNodes[j].id))){
                    f = false;
                }
            }
            if (f) {
                listSelectedNodesCycles.push(cycleList[i]);
            }
        }

        var validCyclesList = metExploreD3.GraphStyleEdition.removeInvalidCycles(listSelectedNodesCycles);

        // Remove duplicated cycles (cycles)
        var removedDuplicateCycle = [];
        for (var i=0; i<validCyclesList.length; i++){
            if (removedDuplicateCycle.length === 0){
                removedDuplicateCycle.push(validCyclesList[i]);
            }
            else {
                var copy = validCyclesList[i].slice();
                var inverted = copy.concat(copy.splice(0,1)).reverse();
                var len = removedDuplicateCycle.length;
                var bool1 = false;
                for (var j = 0; j < len; j++) {
                    if (removedDuplicateCycle[j].length === inverted.length) {
                        var bool2 = true;
                        for (var k=0; k<removedDuplicateCycle[j].length; k++){
                            if (removedDuplicateCycle[j][k] !== inverted[k]) {
                                bool2 = false;
                            }
                        }
                        if (bool2){
                            bool1 = true;
                        }
                    }
                }
                if (!bool1){
                    removedDuplicateCycle.push(validCyclesList[i]);
                }
            }
        }

        return removedDuplicateCycle;
    },
    findLongestCycles: function (listNodes) {
        listNodes = (typeof listNodes !== 'undefined') ? listNodes : [];
        var allCycles = metExploreD3.GraphStyleEdition.findAllCycles(listNodes);
        // Find the longest valid metabolic cycles by calling the function on the array of the longest cycles,
        // then, if no valid cycles have been found call the function on the array of the second longest cycles and so on
        var longestCycles = [];
        var max = 0;
        for (var i=0; i<allCycles.length; i++){
            if (allCycles[i].length > max){
                max = allCycles[i].length;
                longestCycles = [];
                longestCycles.push(allCycles[i]);
            }
            else if (allCycles[i].length === max){
                longestCycles.push(allCycles[i]);
            }
        }
        return longestCycles;
    },
    findShortestCycles: function (listNodes) {
        listNodes = (typeof listNodes !== 'undefined') ? listNodes : [];
        var allCycles = metExploreD3.GraphStyleEdition.findAllCycles(listNodes);
        // Find the longest valid metabolic cycles by calling the function on the array of the longest cycles,
        // then, if no valid cycles have been found call the function on the array of the second longest cycles and so on
        var shortestCycles = [];
        var min = (allCycles[0]) ? allCycles[0].length : 0;
        for (var i=0; i<allCycles.length; i++){
            if (allCycles[i].length < min){
                min = allCycles[i].length;
                shortestCycles = [];
                shortestCycles.push(allCycles[i]);
            }
            else if (allCycles[i].length === min){
                shortestCycles.push(allCycles[i]);
            }
        }
        return shortestCycles;
    },
    removeInvalidCycles : function (cyclesList) {
        // New data structure to efficiently get back the edges from vertex id
        var verticesPairsToLinks = {};
        d3.select("#viz").select("#D3viz").select("#graphComponent").selectAll("path.link")
            .filter(function (d) {
                return (d.getSource().isSideCompound !== true && d.getTarget().isSideCompound !== true)
            })
            .each(function (d) {
                var reactionNode = (d.getSource().biologicalType === "reaction") ? d.getSource() : d.getTarget();
                var sourceId = d.getSource().id;
                var targetId = d.getTarget().id;
                if (!verticesPairsToLinks[sourceId]){
                    verticesPairsToLinks[sourceId] = {};
                }
                verticesPairsToLinks[sourceId][targetId] = d;
                if (reactionNode.reactionReversibility === true){
                    if (!verticesPairsToLinks[targetId]){
                        verticesPairsToLinks[targetId] = {};
                    }
                    verticesPairsToLinks[targetId][sourceId] = d;
                }
            });

        // Get the links that are part of the cycle from the vertex id
        var cyclesLinksList = [];
        for (var i=0; i<cyclesList.length; i++){
            var cycleLinks = [];
            for (var j=0; j<cyclesList[i].length; j++) {
                var newJ = (j + 1 < cyclesList[i].length) ? j + 1 : 0;
                var currentVertex = cyclesList[i][j];
                var nextVertex = cyclesList[i][newJ];
                var link = "";
                if (verticesPairsToLinks[currentVertex][nextVertex]){
                    link = verticesPairsToLinks[currentVertex][nextVertex];
                }
                else if (verticesPairsToLinks[nextVertex][currentVertex]){
                    link = verticesPairsToLinks[nextVertex][currentVertex];
                }
                cycleLinks.push(link);
            }
            cyclesLinksList.push(cycleLinks);
        }

        var listValidCycles = [];
        for (var i=0; i<cyclesList.length; i++) {
            // Get all the cycle edges from the output of the cycle finding algorithm
            var cycle = cyclesList[i];
            var cycleLinks = cyclesLinksList[i];

            // Check if each cycle found is a valid metabolite cycle
            // (if a reversible reaction that produce 2 metabolites, a cycle might have been found that has a segment that
            // goes from the 1st metabolite to the reaction to the second metabolite, even though it is not a valid metabolic cycle)
            var valid = true;
            for (var j = 0; j < cycle.length; j++) {
                var lastJ = (j - 1 >= 0) ? j - 1 : cycle.length - 1;
                if (cycleLinks[j].getSource().id === cycle[j]) {
                    //Edge in cycle direction
                    if (cycleLinks[j].getSource().biologicalType === "reaction" && cycleLinks[lastJ].getSource().biologicalType === "reaction"){
                        valid = false;
                    }
                }
                else if (cycleLinks[j].getTarget().id === cycle[j]){
                    //Edge in inverse cycle direction
                    if (cycleLinks[j].getTarget().biologicalType === "reaction" && cycleLinks[lastJ].getTarget().biologicalType === "reaction") {
                        valid = false;
                    }
                }
            }

            if (valid === true) {
                listValidCycles.push(cycle);
            }
        }
        return listValidCycles;

    },
    highlightCycle: function (cycle) {
        d3.select("#viz").select("#D3viz").select("#graphComponent")
            .selectAll("path.link")
            .style("stroke", "black")
            .style("stroke-width", "0.5");
        var cycleLinks = metExploreD3.GraphStyleEdition.getLinksFromCycle(cycle);
        var nodesCycle = [];
        for (var i = 0; i < cycleLinks.length; i++) {
            nodesCycle.push(cycleLinks[i].source);
            nodesCycle.push(cycleLinks[i].target);
        }
        d3.select("#viz").select("#D3viz").select("#graphComponent").selectAll("path.link")
            .filter(function (d) {
                return (cycleLinks.includes(d));
            }).style("stroke", "blue")
            .style("stroke-width", "1.5");
        d3.select("#viz").select("#D3viz").select("#graphComponent").selectAll("g.node")
            .filter(function (d) {
                return (nodesCycle.includes(d));
            });
    },
    removeHighlightCycle: function (cycle) {
        var cycleLinks = metExploreD3.GraphStyleEdition.getLinksFromCycle(cycle);
        var nodesCycle = [];
        for (var i=0; i<cycleLinks.length; i++){
            nodesCycle.push(cycleLinks[i].source);
            nodesCycle.push(cycleLinks[i].target);
        }
        d3.select("#viz").select("#D3viz").select("#graphComponent").selectAll("path.link")
            .filter(function (d) {
                return (cycleLinks.includes(d));
            }).style("stroke", "black")
            .style("stroke-width", "0.5");
        d3.select("#viz").select("#D3viz").select("#graphComponent").selectAll("g.node")
            .filter(function (d) {
                return (nodesCycle.includes(d));
            });
    },

    /*******************************************
     * Get all the links in a cycle defined by his node
     * @param {} cycle : List of nodes id, this is the cycle from to get the links
     */
    getLinksFromCycle : function(cycle) {
        var cycleLinks = [];
        var links = d3.select("#viz").select("#D3viz").select("#graphComponent").selectAll("path.link");
        var tmpList = [];
        for (var i=0; i<cycle.length; i++){
            tmpList.push([]);
        }
        links.each(function (d) {
            var sourceIndex = cycle.indexOf(d.getSource().id);
            if (sourceIndex !== -1){
                var targetIndex = cycle.indexOf(d.getTarget().id);
                if (targetIndex !== -1) {
                    tmpList[sourceIndex].push(d);
                    tmpList[targetIndex].push(d);
                }
            }
        });
        for (var i = 0; i < cycle.length; i++) {
            var newI = (i + 1 < cycle.length) ? i + 1 : 0;
            var currentVertex = cycle[i];
            var nextVertex = cycle[newI];
            for (var j=0; j<tmpList[i].length; j++){
                var link = tmpList[i][j];
                var sourceId = link.getSource().id;
                var targetId = link.getTarget().id;
                if (sourceId === currentVertex && targetId === nextVertex) {
                    cycleLinks.push(link);
                }
                else if (targetId === currentVertex && sourceId === nextVertex) {
                    cycleLinks.push(link);
                }
            }
        }
        return cycleLinks;
    },
    HawickJamesAlgorithm: function(graph, flag){
        // Variables initialisation
        var nVertices = graph.length;
        var start = 0;
        var Ak = graph;
        var B = [];
        var blocked = [];
        for (var i=0; i<nVertices; i++){
            B.push(Array(nVertices).fill(""));
            blocked[i] = false;
        }
        var stack = [];
        for (var i=0; i<nVertices; i++){
            stack.push(null);
        }
        var stackTop = 0;
        var nbNodeToRun = (flag === "Single") ? 1 : nVertices;
        var result = [];

        // Recursive unblock
        function unblock(u){
            blocked[u] = false;
            for (var wPos=0; wPos<B[u].length; wPos++){
                var w = B[u][wPos];
                wPos -= removeFromList(B[u], w);
                if (blocked[w]){
                    unblock(w);
                }
            }
        }

        // Recursive circuit enumeration
        function circuit(v){
            var f = false;
            stackPush(v);
            blocked[v] = true;

            for (var wPos=0; wPos<Ak[v].length; wPos++){
                var w = Ak[v][wPos];
                if (w < start){
                    continue;
                }
                if (w == start){
                    var cycle = stack.slice(0, stackTop);
                    if (cycle.length > 4) {
                        result.push(stack.slice(0, stackTop));
                    }
                    f = true;
                }
                else if (!blocked[w]){
                    if (circuit(w)){
                        f = true;
                    }
                }
            }

            if (f){
                unblock(v);
            }
            else {
                for (var wPos=0; wPos<Ak[v].length; wPos++){
                    var w = Ak[v][wPos];
                    if (w < start){
                        continue;
                    }
                    if (!(B[w].includes(v))){
                        B[w].push(v);
                    }
                }
            }
            v = stackPop();
            return f;
        }

        // Stack management
        function stackPush(val){
            if (stackTop >= stack.length){
                stack.push(null);
            }
            stack[stackTop++] = val;
        }
        function stackPop(){
            return stack[--stackTop];
        }

        // List Management
        function removeFromList(list, val){
            var nOcurrences = 0;
            var itemIndex = 0;
            while ((itemIndex = list.indexOf(val, itemIndex)) > -1) {
                list.splice(itemIndex, 1);
                nOcurrences++;
            }
            return nOcurrences;
        }

        // Main
        start = 0;
        while (start < nbNodeToRun){
            for (var i=0; i<nVertices; i++){
                blocked[i] = false;
                B[i].length = 0;
            }
            circuit(start);
            start = start + 1;
        }
        return result;
    },
    drawMetaboliteCycle: function (cycle) {
        // check if drawing this cycle will conflict with other already drawn cycle
        var alreadyDrawnCycles = metExploreD3.GraphStyleEdition.allDrawnCycles;
        var cycleToRemoveIndex = false;
        for (var i=0; i<alreadyDrawnCycles.length; i++){
            var test = false;
            for (var j=0; j<alreadyDrawnCycles[i].length; j++) {
                if (cycle.includes(alreadyDrawnCycles[i][j])){
                    test = true;
                }
            }
            if (test === true){
                var alreadyDrawnLinks = metExploreD3.GraphStyleEdition.getLinksFromCycle(alreadyDrawnCycles[i]);
                for (var j=0; j<alreadyDrawnLinks.length; j++) {
                    alreadyDrawnLinks[j].partOfCycle = false;
                }
                cycleToRemoveIndex = i;
            }
        }
        if (cycleToRemoveIndex !== false) {
            alreadyDrawnCycles.splice(cycleToRemoveIndex, 1);
        }
        alreadyDrawnCycles.push(cycle);

        metExploreD3.GraphStyleEdition.removeHighlightCycle(cycle);
        var radius = cycle.length * 10;
        var nodesList = [];
        for (var i=0; i<cycle.length; i++){
            var node = d3.select("#viz").select("#D3viz").select("#graphComponent").selectAll("g.node")
                .filter(function (d) {
                    return (d.id === cycle[i]);
                })
                .each(function (d) {
                    if (!(d.isSelected())) {
                        metExploreD3.GraphNode.selection(d, 'viz');
                    }
                });
            nodesList.push(node);
        }

        // Determine whether the points are arranged in a mostly clockwise or counter-clockwise fashion (cf shoelace formula)
        var directionTotal = 0;
        var topValue = 0;
        var topIndex = 0;
        for (var i=0; i<cycle.length; i++){
            var nextI = (i + 1 < cycle.length) ? i + 1 : 0;
            var x1 = 0;
            var x2 = 0;
            var y1 = 0;
            var y2 = 0;
            nodesList[i].each(function (d) {
                x1 = d.x;
                y1 = d.y;
            });
            nodesList[nextI].each(function (d) {
                x2 = d.x;
                y2 = d.y;
            });
            if (x1 > topValue) {
                topValue = x1;
                topIndex = i;
            }
            directionTotal += (x2 - x1) * (y2 + y1);
        }
        var direction = (directionTotal < 0) ? "clockwise" : "counter-clockwise";

        // Compute the centroid of the points that are part of the cycle
        var centroidX = 0;
        var centroidY = 0;
        for (var i=0; i<cycle.length; i++){
            nodesList[i].each(function (d) {
                centroidX += d.x;
                centroidY += d.y;
            })
        }
        centroidX = centroidX / cycle.length;
        centroidY = centroidY / cycle.length;

        var shiftedNodesList = [].concat(nodesList);
        shiftedNodesList = shiftedNodesList.concat(shiftedNodesList.splice(0, topIndex));
        shiftedNodesList = (direction === "counter-clockwise") ? shiftedNodesList.concat(shiftedNodesList.splice(0, 1)) : shiftedNodesList;
        var revNodesList = (direction === "counter-clockwise") ? [].concat(shiftedNodesList).reverse() : shiftedNodesList;
        for (var i=0; i<cycle.length; i++) {
            var transform = revNodesList[i].attr("transform");
            var transformList = transform.split(/(translate\([\d.,\-\s]*\))/);
            var x = centroidX + radius * Math.cos(2 * Math.PI * i / cycle.length);
            var y = centroidY + radius * Math.sin(2 * Math.PI * i / cycle.length);
            var translate = "translate(" + x + "," + y + ")";
            revNodesList[i].attr("transform", transformList[0] + translate + transformList[2]);
            revNodesList[i].each(function (d) {
                d.x = x;
                d.y = y;
                d.px = x;
                d.py = y;
            });
        }

        // Draw the arcs
        var cycleLinks = metExploreD3.GraphStyleEdition.getLinksFromCycle(cycle);
        for (var i=0; i<cycleLinks.length; i++){
            cycleLinks[i].partOfCycle = true;
            cycleLinks[i].cycleRadius = radius;
            if (cycleLinks[i].getSource().id === cycle[i]){
                cycleLinks[i].arcDirection = (direction === "clockwise") ? "clockwise" : "counter-clockwise";
            }
            else if (cycleLinks[i].getTarget().id === cycle[i]){
                cycleLinks[i].arcDirection = (direction === "clockwise") ? "counter-clockwise" : "clockwise";

            }
        }

        for (var i=0; i<cycle.length; i++){
            nodesList[i].each(function (d) {
                d.setLocked(true);
                d.fixed=d.isLocked();
            });
        }
        metExploreD3.GraphNode.tick('viz');
        metExploreD3.GraphLink.tick('viz');
    },
    removeCycleContainingNode: function (node) {
        // check if the nodes is part of a drawn cycle
        var alreadyDrawnCycles = metExploreD3.GraphStyleEdition.allDrawnCycles;
        var cycleToRemoveIndex = [];
        for (var i=0; i<alreadyDrawnCycles.length; i++){
            var test = false;
            for (var j=0; j<alreadyDrawnCycles[i].length; j++) {
                if (node.id === alreadyDrawnCycles[i][j]){
                    test = true;
                }
            };
            if (test === true){
                var alreadyDrawnLinks = metExploreD3.GraphStyleEdition.getLinksFromCycle(alreadyDrawnCycles[i]);
                for (var j=0; j<alreadyDrawnLinks.length; j++) {
                    alreadyDrawnLinks[j].partOfCycle = false;
                }
                cycleToRemoveIndex.push(i);
            }
        }
        for (var i=0; i<cycleToRemoveIndex.length; i++){
            alreadyDrawnCycles.splice(cycleToRemoveIndex[i], 1);
        }
        metExploreD3.GraphNode.tick('viz');
        metExploreD3.GraphLink.tick('viz');
    },
    checkIfPartOfCycle: function (node, panel) {
        var links = d3.select("#"+panel).select("#D3viz").select("#graphComponent").selectAll("path.link")
            .filter(function (d) {
                if (d.getSource() === node || d.getTarget() === node){
                    return (d.partOfCycle === true);
                }
            });
        return !links.empty();
    },
    checkIfSelectionIsPartOfCycle : function (panel) {
        var result = false;
        d3.select("#"+panel).select("#D3viz").select("#graphComponent").selectAll("g.node")
            .filter(function(d) {
                return d.isSelected() && d.getBiologicalType()=="metabolite";
            })
            .filter(function(d){
                if (this.getAttribute("duplicated")==undefined) { return true; }
                else { return !this.getAttribute("duplicated"); }
            }).each(function (d) {
                if (metExploreD3.GraphStyleEdition.checkIfPartOfCycle(d, panel)) { result = true; }
            });
        return result;
    },
    discretizeFluxRange: function (condition) {
        // Create the distribution table for the flux values
        var allValues = [];
        var distributionTable = [];
        var mappingName = _metExploreViz.getSessionById('viz').getActiveMapping();
        var conditions = _metExploreViz.getSessionById('viz').isMapped();
        d3.select("#viz").select("#D3viz").select("#graphComponent")
            .selectAll("g.node")
            .filter(function (d) {
                return d.getBiologicalType() === "reaction";
            })
            .each(function (d) {
                var reactionMapping = d.getMappingDataByNameAndCond(mappingName, condition);
                allValues.push(reactionMapping)
            });
        allValues.sort(function (a, b) {
            return Math.abs(a.mapValue) - Math.abs(b.mapValue);
        });
        for (var i=0; i<allValues.length; i++){
            var value = Math.abs(Number(allValues[i].mapValue));
            if (!distributionTable.length || distributionTable[distributionTable.length -1].value !== value){
                var valueObject = {value: value, nbOccurence: 1};
                if (distributionTable.length){
                    valueObject.gap = valueObject.value - distributionTable[distributionTable.length -1].value;
                }
                else {
                    valueObject.gap = 0;
                }
                distributionTable.push(valueObject);
            }
            else {
                distributionTable[distributionTable.length -1].nbOccurence += 1;
            }
        }

        //  Find the 9 largest gaps between consecutive values
        var nbBins = 10;
        distributionTable.sort(function (a, b) {
            return a.gap - b.gap;
        });
        var breakPoints = [];
        for (var i=distributionTable.length - nbBins + 1; i<distributionTable.length; i++){
            breakPoints.push(distributionTable[i].value);
        }
        breakPoints.sort(function (a, b) {
            return a - b;
        });
        // Divide the range of value into 10 bins
        var maxValue = Math.abs(Number(allValues[allValues.length-1].mapValue));
        var minValue = Math.abs(Number(allValues[0].mapValue));
        var range = maxValue - minValue;
        var binsWidth = range/nbBins;
        var midBinValues = [];
        for (var i=0; i<nbBins; i++){
            midBinValues.push(minValue + binsWidth / 2 + i * binsWidth);
        }
        // Assign the values into the corresponding bins
        d3.select("#viz").select("#D3viz").select("#graphComponent")
            .selectAll("g.node")
            .filter(function (d) {
                return d.getBiologicalType() === "reaction";
            })
            .each(function (d) {
                var reactionMapping = d.getMappingDataByNameAndCond(mappingName, condition);
                var mapValue = Math.abs(Number(reactionMapping.mapValue));
                for (var i=0; i<breakPoints.length; i++){
                    if (mapValue < breakPoints[i]){
                        reactionMapping.binnedMapValue = midBinValues[i];
                        break;
                    }
                }
                if (Number(mapValue) === 0){
                    reactionMapping.binnedMapValue = 0;
                }
                else if (reactionMapping.binnedMapValue === undefined){
                    reactionMapping.binnedMapValue = midBinValues[midBinValues.length-1];
                }
            });
    },
    removeBinnedMapping : function (condition) {
        var mappingName = _metExploreViz.getSessionById('viz').getActiveMapping();
        var conditions = _metExploreViz.getSessionById('viz').isMapped();
        d3.select("#viz").select("#D3viz").select("#graphComponent")
            .selectAll("g.node")
            .filter(function (d) {
                return d.getBiologicalType() === "reaction";
            })
            .each(function (d) {
                var reactionMapping = d.getMappingDataByNameAndCond(mappingName, condition);
                if (reactionMapping){
                    delete reactionMapping.binnedMapValue;
                }
            })
    }
}