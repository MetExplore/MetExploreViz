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
        targets = (typeof targets !== 'undefined' && typeof targets === "string") ? targets.toLowerCase() : "all";
        d3.select("#viz").select("#D3viz").select("#graphComponent")
            .selectAll("g.node")
            .filter(function(node){
                if (targets === "all"){
                    return true;
                }
                else if (targets === "selection"){
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
        targets = (typeof targets !== 'undefined' && typeof targets === "string") ? targets.toLowerCase() : "all";
        d3.select("#viz").select("#D3viz").select("#graphComponent")
            .selectAll("g.node")
            .filter(function(node){
                if (targets === "all"){
                    return true;
                }
                else if (targets === "selection"){
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
        targets = (typeof targets !== 'undefined' && typeof targets === "string") ? targets.toLowerCase() : "all";
        var boldOrNot = (bool) ? "bold" : "normal";
        d3.select("#viz").select("#D3viz").select("#graphComponent")
            .selectAll("g.node")
            .filter(function(node){
                if (targets === "all"){
                    return true;
                }
                else if (targets === "selection"){
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
        targets = (typeof targets !== 'undefined' && typeof targets === "string") ? targets.toLowerCase() : "all";
        var italicOrNot = (bool) ? "italic" : "normal";
        d3.select("#viz").select("#D3viz").select("#graphComponent")
            .selectAll("g.node")
            .filter(function(node){
                if (targets === "all"){
                    return true;
                }
                else if (targets === "selection"){
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
        targets = (typeof targets !== 'undefined' && typeof targets === "string") ? targets.toLowerCase() : "all";
        var underlineOrNot = (bool) ? "underline" : "none";
        d3.select("#viz").select("#D3viz").select("#graphComponent")
            .selectAll("g.node")
            .filter(function(node){
                if (targets === "all"){
                    return true;
                }
                else if (targets === "selection"){
                    return node.isSelected();
                }
                else {
                    return node.getBiologicalType() == targets;
                }
            })
            .select("text")
            .style("text-decoration-line", underlineOrNot);
    },
    setAllFontOpacity: function (labelOpacity, flag) {
        var s_MetaboliteStyle = metExploreD3.getMetaboliteStyle();
        var s_ReactionStyle = metExploreD3.getReactionStyle();
        d3.select("#viz").select("#D3viz").select("#graphComponent")
            .selectAll("g.node")
            .filter(function (node) {
                if (flag === "all"){
                    s_MetaboliteStyle.setLabelOpacity(labelOpacity);
                    s_ReactionStyle.setLabelOpacity(labelOpacity);
                    return true;
                }
                else if (flag === "selection"){
                    return node.isSelected();
                }
                else if (flag === "reaction") {
                    s_ReactionStyle.setLabelOpacity(labelOpacity);
                    return node.getBiologicalType() == "reaction";
                }

                else if (flag === "metabolite") {
                    s_MetaboliteStyle.setLabelOpacity(labelOpacity);
                    return node.getBiologicalType() == "metabolite";
                }
            })
            .select("text")
            .attr("opacity", labelOpacity);
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
     * Find all the metabolic cycles in the graph passing through some nodes that is shown in the visualisation panel
     * @param {} listNodes : List of nodes. Only the cycles passing through all the nodes in the list will be found.
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

    /*******************************************
     * Find all the metabolic cycles in the graph that is shown in the visualisation panel
     * @param {} listNodes : List of nodes. Only the cycles passing through all the nodes in the list will be found.
     */
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