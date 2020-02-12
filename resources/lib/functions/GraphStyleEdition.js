/**
 * @author Adrien Rohan
 * (a)description : Style Edition
 */

metExploreD3.GraphStyleEdition = {

    editMode: false,
    curvedPath: false,
    allDrawnCycles: [],

    applyLabelStyle : function(panelLinked){
        var GraphNodes = d3.select("#viz").select("#D3viz").select("#graphComponent").selectAll("g.node");

        GraphNodes.selectAll("text").each(function(node){
            var selection=d3.select("#"+panelLinked).select("#D3viz").select("#graphComponent")
                .selectAll("g.node")
                .filter(function(n){
                    return n.getDbIdentifier()==node.getDbIdentifier();
                }).select("text");

            var elemtNode = d3.select(this);

            if (elemtNode.style("font-family")) { selection.style("font-family", elemtNode.style("font-family")); }
            if (elemtNode.style("font-size")) { selection.style("font-size", elemtNode.style("font-size")); }
            if (elemtNode.style("font-weight")) { selection.style("font-weight", elemtNode.style("font-weight")); }
            if (elemtNode.style("font-style")) { selection.style("font-style", elemtNode.style("font-style")); }
            if (elemtNode.style("text-decoration-line")) { selection.style("text-decoration-line", elemtNode.style("text-decoration-line")); }
            if (elemtNode.attr("opacity")) { selection.attr("opacity", elemtNode.attr("opacity")); }
            if (elemtNode.attr("x")) { selection.attr("x", elemtNode.attr("x")); }
            if (elemtNode.attr("y")) { selection.attr("y", elemtNode.attr("y")); }
            if (elemtNode.attr("transform")) { selection.attr("transform", elemtNode.attr("transform")); }
        });
    },
    /*******************************************
     * Enter or exit style edition mode
     */
    toggleEditMode : function () {
        // Enter edition mode, revealing the editModePanel, stopping force layout, and initiating label dragging, or leave the edition Mode
        if (metExploreD3.GraphStyleEdition.editMode===false) {
            metExploreD3.GraphStyleEdition.editMode=true;

            metExploreD3.GraphNetwork.animationButtonOff('viz');
            var force = _metExploreViz.getSessionById("viz").getForce();
            force.stop();
            // disable button
            d3.select("#viz").select("#buttonAnim").select("image").remove();
            metExploreD3.GraphStyleEdition.startDragLabel("viz");

            // Time out to avoid lag
            setTimeout(
                function() {
                    var session = _metExploreViz.getSessionById("viz");
                    if(session!=undefined)
                    {
                        if(session.isLinked()){

                            var sessionsStore = _metExploreViz.getSessionsSet();

                            for (var key in sessionsStore) {
                                if("viz"!=key)
                                {
                                    metExploreD3.GraphNetwork.animationButtonOff(key);
                                    var force = _metExploreViz.getSessionById(key).getForce();
                                    force.stop();
                                    // disable button
                                    d3.select("#"+key).select("#buttonAnim").select("image").remove();
                                    metExploreD3.GraphStyleEdition.startDragLabel(key);
                                }
                            }
                        }
                    }
                }
                , 200);
        }
        else {
            metExploreD3.GraphStyleEdition.editMode=false;
            metExploreD3.GraphNetwork.animationButtonOff("viz");
            metExploreD3.GraphStyleEdition.endDragLabel("viz");
            metExploreD3.GraphNode.applyEventOnNode("viz");
            // Time out to avoid lag
            setTimeout(
                function() {
                    var session = _metExploreViz.getSessionById("viz");
                    if(session!=undefined)
                    {
                        if(session.isLinked()){

                            var sessionsStore = _metExploreViz.getSessionsSet();

                            for (var key in sessionsStore) {
                                if(sessionsStore[key].isLinked() && "viz"!=key)
                                {
                                    metExploreD3.GraphStyleEdition.editMode=false;
                                    metExploreD3.GraphNetwork.animationButtonOff(key);
                                    metExploreD3.GraphStyleEdition.endDragLabel(key);
                                    metExploreD3.GraphNode.applyEventOnNode(key);
                                }
                            }
                        }
                    }
                }
                , 200);
        }
    },

    /*******************************************
     * Allow moving of node label on drag
     */
    startDragLabel : function (panel) {
        // Apply drag event on node labels
        var GraphNodes = d3.select("#"+panel).select("#D3viz").select("#graphComponent").selectAll("g.node");
        var labelDrag = metExploreD3.GraphStyleEdition.createDragBehavior(panel);
        if (metExploreD3.GraphStyleEdition.editMode){
            GraphNodes.selectAll("text").style("pointer-events", "auto");
            GraphNodes.selectAll("text").call(labelDrag);
        }
    },

    /*******************************************
     * End moving of node label on drag
     */
    endDragLabel : function (panel) {
        // Remove drag event on node labels
        var GraphNodes = d3.select("#"+panel).select("#D3viz").select("#graphComponent").selectAll("g.node");
        if (!metExploreD3.GraphStyleEdition.editMode) {
            GraphNodes.selectAll("text").style("pointer-events", "none");
        }
        GraphNodes.selectAll("rect").on("mouseover", null).on("mouseenter", null).on("mouseleave", null).on("mousedown", null).on("touchstart", null);
        //
    },

    /*******************************************
     * Create drag-and-drop behavior
     */
    createDragBehavior : function (panel) {
        var deltaX;
        var deltaY;
        var element;
        var drag = d3.drag()
            .on ("start", function (d,i) {
                d3.event.sourceEvent.stopPropagation();
                element = this;

                deltaX = parseFloat(d3.select(this).attr("x"));
                deltaY = parseFloat(d3.select(this).attr("y"));

                if(isNaN(deltaX)) deltaX=0;
                if(isNaN(deltaY)) deltaY=0;

                d3.selectAll("#D3viz")
                    .style("cursor", "move");
                d3.select(this)
                    .each(function(d){
                        this.parentNode.parentNode.appendChild(this.parentNode);
                    });
            })
            .on("drag", function (d,i) {
                var me=this;
                metExploreD3.applyTolinkedNetwork(
                    panel,
                    function(panelLinked, sessionLinked) {
                        var theD3Node=d3.select(me);
                        var transform = theD3Node.attr("transform");

                        var newX = 0;
                        var newY = 0;
                        newX=d3.event.x-d3.event.subject.x+deltaX;
                        newY=d3.event.y-d3.event.subject.y+deltaY;

                        if(me.classList.contains("imageNode")) {
                            if (transform && transform.indexOf("scale") != -1) {
                                var transform = theD3Node.attr("transform");
                                var scale = transform.substring(transform.indexOf("scale"), transform.length);
                                var elemtScale = scale.substring(6, scale.indexOf(')'));

                                theD3Node.attr("transform", "translate(" + newX + ", " + newY + ") scale(" + elemtScale + ")");
                            } else {
                                theD3Node.attr("transform", "translate(" + newX + ", " + newY + ")");
                            }
                        }

                        theD3Node
                            .attr('x', newX)
                            .attr('y', newY)
                            .selectAll('tspan').attr('x', newX);

                        });
            })
            .on("end", function (d,i) {
                d3.selectAll("#D3viz")
                    .style("cursor", "default");
            });
        return drag;
    },

    /*******************************************
     * Change text of node label
     * @param {Object} node : The node whose label will be modified
     * @param {String} panel : The panel where the action is launched
     * @param {String} text : The new text of the node label
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
            .attr("fill", "#000000")
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
     * @param {Object} node : The node whose label will be modified
     */
    changeFontSize : function (node, panel) {
        // Change the font size of the node label
        metExploreD3.displayPrompt("Font Size", "Enter a font size", function(btn, text) {
            if (text!=null && text!="" && !isNaN(text) && btn=="ok") {
                d3.select("#"+panel).select("#D3viz").select("#graphComponent")
                    .selectAll("g.node")
                    .filter(function(d){return d.getDbIdentifier()==node.getDbIdentifier();})
                    .select("text")
                    .style("font-size",text+"px");
            }
        });
    },

    /*******************************************
     * Change the font size of multiple node labels
     * @param {String} text : The new font size of the node label
     * @param {"all"/"selection"/"metabolite"/"reaction"} targets : The nodes whose label will be modified
     */
    changeAllFontSize : function (text, targets, panel) {
        // Change the font size of all the targeted nodes labels
        targets = (typeof targets !== 'undefined' && typeof targets === "string") ? targets.toLowerCase() : "all";
        d3.select("#"+panel).select("#D3viz").select("#graphComponent")
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
     * @param {Object} node : The node whose label will be modified
     * @param {String} text : The new font of the node label
     */
    changeFontType : function (node, text, panel) {
        // Change the font of the node label
        d3.select("#"+panel).select("#D3viz").select("#graphComponent")
            .selectAll("g.node")
            .filter(function(d){return d.getDbIdentifier()==node.getDbIdentifier();})
            .select("text")
            .style("font-family",text);
    },

    /*******************************************
     * Change the font family of multiple node labels
     * @param {String} text : The new font of the node label
     * @param {"all"/"selection"/"metabolite"/"reaction"} targets : The nodes whose label will be modified
     */
    changeAllFontType : function (text, targets, panel) {
        // Change the font of all the targeted nodes labels
        targets = (typeof targets !== 'undefined' && typeof targets === "string") ? targets.toLowerCase() : "all";
        d3.select("#"+panel).select("#D3viz").select("#graphComponent")
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
     * @param {Object} node : The node whose label will be modified
     */
    changeFontBold : function (node, panel) {
        // Change the font boldness of the node label
        var nodeLabel = d3.select("#"+panel).select("#D3viz").select("#graphComponent")
            .selectAll("g.node")
            .filter(function(d){return d.getDbIdentifier()==node.getDbIdentifier();})
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
     * @param {Boolean} bool : True to change the font to bold, false to change back to normal
     * @param {"all"/"selection"/"metabolite"/"reaction"} targets : The nodes whose label will be modified
     */
    changeAllFontBold : function (bool, targets, panel) {
        // Change the font boldness of all the targeted nodes labels
        targets = (typeof targets !== 'undefined' && typeof targets === "string") ? targets.toLowerCase() : "all";
        var boldOrNot = (bool) ? "bold" : "normal";
        d3.select("#"+ panel).select("#D3viz").select("#graphComponent")
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
     * @param {Object} node : The node whose label will be modified
     */
    changeFontItalic : function (node, panel) {
        // Italicize the font of the node label or revert to normal
        var nodeLabel = d3.select("#"+panel).select("#D3viz").select("#graphComponent")
            .selectAll("g.node")
            .filter(function(d){return d.getDbIdentifier()==node.getDbIdentifier();})
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
     * @param {Boolean} bool : True to change the font to italic, false to change back to normal
     * @param {"all"/"selection"/"metabolite"/"reaction"} targets : The nodes whose label will be modified
     */
    changeAllFontItalic : function (bool, targets, panel) {
        // Italicize the font of all the targeted nodes labels or revert to normal
        targets = (typeof targets !== 'undefined' && typeof targets === "string") ? targets.toLowerCase() : "all";
        var italicOrNot = (bool) ? "italic" : "normal";
        d3.select("#"+panel).select("#D3viz").select("#graphComponent")
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
     * @param {Object} node : The node whose label will be modified
     */
    changeFontUnderline : function (node, panel) {
        // Underline the font of the node label or revert to normal
        var nodeLabel = d3.select("#"+panel).select("#D3viz").select("#graphComponent")
            .selectAll("g.node")
            .filter(function(d){return d.getDbIdentifier()==node.getDbIdentifier();})
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
     * @param {Boolean} bool : True to add underline to the label, false to remove them
     * @param {"all"/"selection"/"metabolite"/"reaction"} targets : The nodes whose label will be modified
     */
    changeAllFontUnderline : function (bool, targets, panel) {
        // Underline the font of all the targeted nodes labels or revert to normal
        targets = (typeof targets !== 'undefined' && typeof targets === "string") ? targets.toLowerCase() : "all";
        var underlineOrNot = (bool) ? "underline" : "none";
        d3.select("#"+panel).select("#D3viz").select("#graphComponent")
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

    /*******************************************
     * Set the opacity of multiple node labels
     * @param {Number} labelOpacity : New opacity value
     * @param {"all"/"selection"/"metabolite"/"reaction"} flag : The nodes whose label will be modified
     */
    setAllFontOpacity: function (labelOpacity, flag, panel) {
        var s_MetaboliteStyle = metExploreD3.getMetaboliteStyle();
        var s_ReactionStyle = metExploreD3.getReactionStyle();
        d3.select("#"+panel).select("#D3viz").select("#graphComponent")
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
                    return node.getBiologicalType() === "reaction";
                }

                else if (flag === "metabolite") {
                    s_MetaboliteStyle.setLabelOpacity(labelOpacity);
                    return node.getBiologicalType() === "metabolite";
                }
            })
            .select("text")
            .attr("opacity", labelOpacity);
    },

    /*******************************************
     * Create an object containing the label style data associated to a node
     * @param {Object} node : The node whose label syle data will be put in the object
     */
    createLabelStyleObject : function (node, panel) {
        var nodeLabel = d3.select("#"+panel).select("#D3viz").select("#graphComponent")
            .selectAll("g.node")
            .filter(function(d){return d.getDbIdentifier()==node.getDbIdentifier();})
            .select("text");
        if(nodeLabel.size()>0){
            if(nodeLabel[0]!==null)
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
        }
        return labelStyle;
    },

    /*******************************************
     * Create an object containing the image position and dimension data associated to a node
     * @param {Object} node : The node whose image position and dimension data will be put in the object
     */
    createImageStyleObject : function (node, panel) {
        var nodeImage = d3.select("#"+ panel).select("#D3viz").select("#graphComponent")
            .selectAll("g.node")
            .filter(function(d){return d.getDbIdentifier()==node.getDbIdentifier();})
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
     * Create an object containing the image position and dimension data associated to a node
     * @param {Object} node : The node whose image position and dimension data will be put in the object
     */
    setCollectionStyle : function (targetSet, attrType, attrName, biologicalType, value) {

        targetSet.forEach(function setStyles(target) {
            var selection;
            if(biologicalType==="metabolite" || biologicalType==="reaction")
                selection = d3.select("#viz").select("#D3viz").selectAll("g.node").filter(function(d){return d.getBiologicalType()===biologicalType});

            if(biologicalType==="link")
                selection = d3.select("#viz").select("#D3viz").selectAll(".linkGroup");

            selection.selectAll(target+":not(.bypassed"+attrType+attrName+biologicalType+")"+":not(.mapped"+attrType+attrName+biologicalType+")")[attrType](attrName, value);
        });
    },

    /*******************************************
     * Create an object containing the image position and dimension data associated to a node
     * @param {Object} node : The node whose image position and dimension data will be put in the object
     */
    removeMappedClassStyle : function (targetSet, attrType, attrName, biologicalType, value) {
        targetSet.forEach(function setStyles(target) {
            var selection;
            if(biologicalType==="metabolite" || biologicalType==="reaction")
                selection = d3.select("#viz").select("#D3viz").selectAll("g.node").filter(function(d){return d.getBiologicalType()===biologicalType});

            if(biologicalType==="link")
                selection = d3.select("#viz").select("#D3viz").selectAll(".linkGroup");

            var targetSelection = selection.selectAll(target+":not(.bypassed"+attrType+attrName+biologicalType+")");
            targetSelection.classed("mapped"+attrType+attrName+biologicalType, false);
        });
    },

    /*******************************************
     * Create an object containing the image position and dimension data associated to a node
     * @param {Object} node : The node whose image position and dimension data will be put in the object
     */
    setCollectionStyleBypass : function (targetSet, attrType, attrName, biologicalType, value) {
        var activeSession = _metExploreViz.getSessionById(metExploreD3.GraphNode.activePanel);
        if(activeSession) {
            targetSet.forEach(function setStyles(target) {

                var mapNodes = activeSession.getSelectedNodes().map(function (nodeId) {
                    return activeSession.getD3Data().getNodeById(nodeId);
                });

                var selectedNodesId = mapNodes.filter(function (node) {
                    return node.getBiologicalType() === biologicalType;
                }).map(function (node) {
                    return node.getId();
                });

                if(selectedNodesId.length>0){
                    var selection;
                    if (biologicalType === "link"){
                        selection = d3.select("#viz").select("#D3viz").selectAll(".linkGroup")
                            .filter(function (d) {
                                    var reaction = d.getReaction();
                                    if(reaction)
                                        return selectedNodesId.includes(reaction.getId());
                                    return false;
                            });
                    }
                    else
                    {
                        selection = d3.select("#viz").select("#D3viz").selectAll("g.node")
                            .filter(function (d) {
                                return d.getBiologicalType() === biologicalType;
                            })
                            .filter(function (d) {
                                return selectedNodesId.includes(d.getId());
                            });
                    }




                    var targetSelection = selection.selectAll(target);
                    targetSelection[attrType](attrName, value);
                    targetSelection.classed("bypassed"+attrType+attrName+biologicalType, true);
                }
            });
        }
    },

    /*******************************************
     * Create an object containing the image position and dimension data associated to a node
     * @param {Object} node : The node whose image position and dimension data will be put in the object
     */
    setCollectionStyleDiscreteMapping : function (targetSet, attrType, attrName, biologicalType, conditionName, mappingName, valueMapping, valueStyle) {
        var activeSession = _metExploreViz.getSessionById(metExploreD3.GraphNode.activePanel);
        if(activeSession) {
            targetSet.forEach(function setStyles(target) {

                var selection;
                if(biologicalType==="link"){
                    selection = d3.select("#viz").select("#D3viz").selectAll(".linkGroup");
                }
                else {
                    selection = d3.select("#viz").select("#D3viz").selectAll("g.node")
                        .filter(function (d) {
                            return d.getBiologicalType() === biologicalType;
                        });
                }
                selection = selection
                    .filter(function (d) {

                        var map = d.getMappingDataByNameAndCond(mappingName, conditionName);

                        if (map !== null) {

                            if (map.getMapValue() === valueMapping)
                                return true;
                            else
                                return false;
                        }
                        return false;
                    });


                var targetSelection = selection.selectAll(target);

                targetSelection[attrType](attrName, valueStyle);
                targetSelection.classed("mapped"+attrType+attrName+biologicalType, true);
            });
        }
    },

    /*******************************************
     * Create an object containing the image position and dimension data associated to a node
     * @param {Object} node : The node whose image position and dimension data will be put in the object
     */
    setCollectionStyleAsSelectionMapping : function (targetSet, attrType, attrName, biologicalType, conditionName, mappingName, valueMapping, valueStyle) {
        var activeSession = _metExploreViz.getSessionById(metExploreD3.GraphNode.activePanel);
        if(activeSession) {
            targetSet.forEach(function setStyles(target) {

                var selection;
                if(biologicalType==="link"){
                    selection = d3.select("#viz").select("#D3viz").selectAll(".linkGroup");
                }
                else {
                    selection = d3.select("#viz").select("#D3viz").selectAll("g.node")
                        .filter(function (d) {
                            return d.getBiologicalType() === biologicalType;
                        });
                }
                selection = selection
                    .filter(function (d) {

                        var map = d.getMappingDataByName(mappingName);

                        if(map !== null) {
                            return true;
                        }
                        return false;
                    });

                var targetSelection = selection.selectAll(target);

                targetSelection[attrType](attrName, valueStyle);
                targetSelection.classed("mapped"+attrType+attrName+biologicalType, true);
            });
        }
    },

    /*******************************************
     * Create an object containing the image position and dimension data associated to a node
     * @param {Object} node : The node whose image position and dimension data will be put in the object
     */
    setCollectionStyleContinuousMapping : function (targetSet, attrType, attrName, biologicalType, conditionName, mappingName, linearScale) {
        var activeSession = _metExploreViz.getSessionById(metExploreD3.GraphNode.activePanel);
        if(activeSession) {
            targetSet.forEach(function setStyles(target) {

                var selection;
                if(biologicalType==="link"){
                    selection = d3.select("#viz").select("#D3viz").selectAll(".linkGroup");
                }
                else {
                    selection = d3.select("#viz").select("#D3viz").selectAll("g.node")
                        .filter(function (d) {
                            return d.getBiologicalType() === biologicalType;
                        });
                }

                selection = selection
                    .filter(function (d) {

                        var map = d.getMappingDataByNameAndCond(mappingName, conditionName);

                        if(map !== null) {
                            return true;
                        }
                        return false;
                    });

                var targetSelection = selection.selectAll(target);

                function test(d){
                    var map = d.getMappingDataByNameAndCond(mappingName, conditionName);
                    return linearScale(map.getMapValue());
                }
                targetSelection[attrType](attrName, test);

                targetSelection.classed("mapped"+attrType+attrName+biologicalType, true);
            });
        }
    },

    /*******************************************
     * Create an object containing the image position and dimension data associated to a node
     * @param {Object} node : The node whose image position and dimension data will be put in the object
     */
    getCollectionStyleBypass : function (targetSet, attrType, attrName, biologicalType) {
        var activeSession = _metExploreViz.getSessionById(metExploreD3.GraphNode.activePanel);
        var union  = [];
        var values = [];
        var valuesBypassed = [];

        if(activeSession) {
            var mapNodes = activeSession.getSelectedNodes().map(function (nodeId) {
                return activeSession.getD3Data().getNodeById(nodeId);
            })
            .filter(function (node) {
                return node!==undefined;
            });

            var selectedNodesId = mapNodes.filter(function (node) {
                return node.getBiologicalType() === biologicalType;
            }).map(function (node) {
                return node.getId();
            });

            var selection;
            if (biologicalType === "link"){
                selection = d3.select("#viz").select("#D3viz").selectAll(".linkGroup")
                    .filter(function (d) {
                        var reaction = d.getReaction();
                        if(reaction)
                            return selectedNodesId.includes(reaction.getId());
                        return false;
                    });
            }
            else
            {
                selection = d3.select("#viz").select("#D3viz").selectAll("g.node")
                    .filter(function (d) {
                        return d.getBiologicalType() === biologicalType;
                    })
                    .filter(function (d) {
                        return selectedNodesId.includes(d.getId());
                    });
            }

            if(selectedNodesId.length>0){
                targetSet.forEach(function setStyles(target) {

                    var arrBypass=[];
                    var arr=[];

                    selection.selectAll(target+".bypassed"+attrType+attrName+biologicalType)
                        .each(function(){
                            arrBypass.push(d3.select(this)[attrType](attrName));
                        });

                    valuesBypassed = [...new Set(arrBypass)];

                    selection.selectAll(target+":not(.bypassed"+attrType+attrName+biologicalType+")")
                        .each(function(){
                            arr.push(d3.select(this)[attrType](attrName));
                        });

                    values = [...new Set(arr)];

                    union = [...new Set(valuesBypassed.concat(values))];

                });
                if(valuesBypassed.length>0 &&
                    union.length>1){
                    return "multiple";
                }
                else{
                    if(valuesBypassed.length===1 && values.length===0)
                        return valuesBypassed[0];
                    else
                        return "none";
                }
            }
        }
        return "none";
    }
};