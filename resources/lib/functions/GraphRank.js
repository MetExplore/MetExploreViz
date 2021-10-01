/**
 * @class metExploreD3.GraphRank
 * Function to manage metaboRank vizu
 *
 * Guided Interaction Reconstruction
 *
 * @author JCG
 */

metExploreD3.GraphRank = {

    launchGIR: false,
    metaboRankMode: false,

    // Start and quit GIR methods
    startGir: function(listMi) {
        var nodes = d3.select("#viz").select("#D3viz").select("#graphComponent").selectAll("g.node");
        var links = d3.select("#viz").select("#D3viz").select("#graphComponent").selectAll("path.link");

        var session = _metExploreViz.getSessionById("viz");
        var networkData = session.getD3Data();

        nodes.each(function(node){
            if (node.dbIdentifier.includes(listMi)){
                metExploreD3.GraphRank.startNode(node);
            }
            if (!(listMi.includes(node.dbIdentifier))) {
                node.hide()
            }
        });

        metExploreD3.GraphNetwork.updateNetwork("viz", _metExploreViz.getSessionById("viz"));

        var mi = networkData.getNodeByDbIdentifier(listMi);
        metExploreD3.GraphRank.getNbHidden(mi);
        metExploreD3.GraphRank.createNodeRing(mi);
    },

    startNode: function(node) {
        var allNodes = d3.select("#viz").select("#D3viz").select("#graphComponent").selectAll("g.node").selectAll("rect");
        allNodes.filter(function(thisNode){
            return thisNode === node
        })
        .style("stroke-width",5)
        .style("stroke","#00aa00")
        .style("stroke-opacity",0.4);
    },

    quitGir: function() {
        var session = _metExploreViz.getSessionById("viz");
        var netWorkData = session.getD3Data();
        var allNodes = d3.select("#viz").select("#D3viz").select("#graphComponent").selectAll("g.node").remove();
        var nodes = netWorkData.getNodes();

        nodes.map(function(node, i){
            node.show();
        });

        metExploreD3.GraphRank.removeGirStyle();
        metExploreD3.GraphNetwork.updateNetwork("viz", _metExploreViz.getSessionById("viz"));
    },

    removeGirStyle: function() {
        var metaboliteStyle = metExploreD3.getMetaboliteStyle();
        var reactionStyle = metExploreD3.getReactionStyle();
        var linkStyle = metExploreD3.getLinkStyle();

        var nodes = d3.select("#viz").select("#D3viz").select("#graphComponent").selectAll("g.node").selectAll("rect");
        var links = d3.select("#viz").select("#D3viz").select("#graphComponent").selectAll("path.link");

        nodes.each(function(node){
            if (node.getBiologicalType()==="metabolite"){
                d3.select(this).style("fill",metaboliteStyle.getBackgroundColor())
                    .style("stroke-width",metaboliteStyle.getStrokeWidth())
                    .style("stroke",metaboliteStyle.getStrokeColor())
                    .style("stroke-opacity",1);
            }
            if (node.getBiologicalType()==="reaction"){
                d3.select(this).style("fill",reactionStyle.getBackgroundColor())
                    .style("stroke-width",reactionStyle.getStrokeWidth())
                    .style("stroke",reactionStyle.getStrokeColor())
                    .style("stroke-opacity",1);
            }
        });

        links.each(function(link){
            d3.select(this).style("stroke-width",linkStyle.getLineWidth());
        });
    },

    quitAndExtract: function() {
        d3.select("#viz").select("#D3viz").select("#graphComponent").selectAll("g.node.hide").remove();
        d3.select("#viz").select("#D3viz").select("#graphComponent").selectAll("path.link.hide").remove();
    },

    // save network function
    saveNetwork: function() {
        var session = _metExploreViz.getSessionById("viz");
        var networkData = session.getD3Data();

        var nodes = networkData.getNodes();
        var links = d3.select("#viz").select("#D3viz").select("#graphComponent").selectAll("path.link");

        var connexion = {};

        nodes.map(function(node, i){
            var identifier = node.dbIdentifier;
            connexion[identifier] = {linkIn: [], linkOut: []};
            links.each(function(link){
                if (link.source === node){
                    connexion[identifier]["linkOut"].push(link);
                }
                if (link.target === node){
                    connexion[identifier]["linkIn"].push(link);
                }
            });
        });

        return connexion;
    },

    // Show and collapse nodes functions
    showNeighbours: function(node) {
        var nodes = d3.select("#viz").select("#D3viz").select("#graphComponent").selectAll("g.node");
        var rankData = _metExploreViz.getRankById("rankData");
        var connexion = rankData.getData();

        var identifier = node.dbIdentifier;

        var linkOut = connexion[identifier]["linkOut"];

        var addRingNodes = [];

        linkOut.map(function(link, i){
            link.target.show();
            addRingNodes.push(link.target);
            identifier = link.target.dbIdentifier;
            connexion[identifier]["linkOut"].map(function(that, i){
                that.target.show();
                addRingNodes.push(that.target);
            });
        });

        metExploreD3.GraphNetwork.updateNetwork("viz", _metExploreViz.getSessionById("viz"));

        addRingNodes.map(function(thisNode){
            metExploreD3.GraphRank.createNodeRing(thisNode);
            if (thisNode.getBiologicalType() === "metabolite"){
                metExploreD3.GraphRank.nodeStyleByRank(thisNode);
            }
        });
        metExploreD3.GraphRank.updateNbHidden();
    },

    showPredecessors: function(node) {
        var rankData = _metExploreViz.getRankById("rankData");
        var connexion = rankData.getData();

        var identifier = node.dbIdentifier;

        var linkIn = connexion[identifier]["linkIn"];

        var addRingNodes = [];

        linkIn.map(function(link, i){
            link.source.show();
            addRingNodes.push(link.source);
            identifier = link.source.dbIdentifier;
            connexion[identifier]["linkIn"].map(function(that, i){
                that.source.show();
                addRingNodes.push(that.source);
            });
        });

        metExploreD3.GraphNetwork.updateNetwork("viz", _metExploreViz.getSessionById("viz"));

        addRingNodes.map(function(thisNode){
            metExploreD3.GraphRank.createNodeRing(thisNode);
            if (node.getBiologicalType() === "metabolite"){
                metExploreD3.GraphRank.nodeStyleByRank(thisNode);
            }
        });
        metExploreD3.GraphRank.updateNbHidden();
    },

    hideNeighbours: function(node) {
        var rankData = _metExploreViz.getRankById("rankData");
        var connexion = rankData.getData();
        var links = d3.select("#viz").select("#D3viz").select("#graphComponent").selectAll("path.link");

        var identifier = node.dbIdentifier;

        var linkIn = connexion[identifier]["linkIn"];
        var linkOut = connexion[identifier]["linkOut"];

        var nbLinkIn = 0;
        var nbLinkOut = 0;

        linkIn.map(function(link, i){
            links.each(function(thisLink){
                if (thisLink.source === link.source || thisLink.target === link.source){
                    nbLinkIn++;
                }
            });
            if (nbLinkIn < 3){
                link.source.hide();
            }
        });
        linkOut.map(function(link, i){
            links.each(function(thisLink){
                if (thisLink.source === link.target || thisLink.target === link.target){
                    nbLinkOut++;
                }
            });
            if (nbLinkOut < 3){
                link.target.hide();
            }
        });
        node.hide();
        metExploreD3.GraphNetwork.updateNetwork("viz", _metExploreViz.getSessionById("viz"));
        metExploreD3.GraphRank.updateNbHidden();
    },

    // rank style functions
    nodeStyleByRank: function(node) {
        var nodes = d3.select("#viz").select("#D3viz").select("#graphComponent").selectAll("g.node");
        var rankData = _metExploreViz.getRankById("rankData");
        var rankScore = rankData.getScore();
        var identifier = node.dbIdentifier.replace("_c","");
        var nodeScore = rankScore[identifier];

        if (nodeScore !== undefined){
            var rankIn = parseInt(nodeScore[0]);
            var rankOut = parseInt(nodeScore[1]);

            nodes.each(function(thisNode){
                if (thisNode === node) {
                    if (rankIn < 26 && rankOut < 26) {
                        d3.select(this).selectAll("rect")
                            .style("stroke-width",3)
                            .style("stroke","purple");
                            // .style("stroke-opacity",0.4);
                    }
                    if (rankIn > 26 && rankOut < 26) {
                        d3.select(this).selectAll("rect")
                            .style("stroke-width",3)
                            .style("stroke","red");
                            // .style("stroke-opacity",0.4);
                    }
                    if (rankIn < 26 && rankOut > 26) {
                        d3.select(this).selectAll("rect")
                            .style("stroke-width",3)
                            .style("stroke","green");
                            // .style("stroke-opacity",0.4);
                    }
                    if (rankIn > 26 && rankOut > 26) {
                        d3.select(this).selectAll("rect")
                            .style("stroke","black");
                    }
                }
            });
        }
    },

    // visit and unvisit functions
    visit: function(node) {
        var nodes = d3.select("#viz").select("#D3viz").select("#graphComponent").selectAll("g.node");
        var links = d3.select("#viz").select("#D3viz").select("#graphComponent").selectAll("path.link");

        var bioType = node.getBiologicalType();
        if (bioType === "metabolite"){
            links.each(function(link){
                if (link.target === node && link.source.getBiologicalType() === "reaction"){
                    link.source.visit();
                }
            });
        }

        nodes.each(function(thisNode){
            if (thisNode === node){
                d3.select(this).selectAll("rect").style("fill","black");
                node.visit();
            }
        });
        metExploreD3.GraphRank.visitLink();
    },

    unvisit: function(node) {
        var nodes = d3.select("#viz").select("#D3viz").select("#graphComponent").selectAll("g.node");
        var links = d3.select("#viz").select("#D3viz").select("#graphComponent").selectAll("path.link");
        var metaboliteStyle = metExploreD3.getMetaboliteStyle();
        var reactVisit = {};

        nodes.each(function(thisNode){
            if (thisNode === node){
                d3.select(this).select("rect").style("fill",metaboliteStyle.backgroundColor);
                node.unvisit();
            }
        });

        links.each(function(link){
            if (link.source.getBiologicalType() === "reaction"){
                if (!(reactVisit[link.source.dbIdentifier])){
                    reactVisit[link.source.dbIdentifier] = 0;
                }
                if (link.target.isVisited() === true){
                    reactVisit[link.source.dbIdentifier]++;
                }
            }
        });

        nodes.each(function(thisNode){
            if (Object.keys(reactVisit).includes(thisNode.dbIdentifier) && reactVisit[thisNode.dbIdentifier] === 0){
                thisNode.unvisit();
            }
        });

        metExploreD3.GraphRank.unvisitLink();
        metExploreD3.GraphRank.visitLink();
    },

    visitLink: function() {
        var links = d3.select("#viz").select("#D3viz").select("#graphComponent").selectAll("path.link");

        links.each(function(link){
            if (link.source.isVisited() === true && link.target.isVisited() === true){
                d3.select(this).style("stroke-width",5);
            }
        });
    },

    unvisitLink: function() {
        var links = d3.select("#viz").select("#D3viz").select("#graphComponent").selectAll("path.link");
        var linkStyle = metExploreD3.getLinkStyle();

        links.each(function(link){
            if (link.source.isVisited() !== true && link.target.isVisited() === true){
                d3.select(this).style("stroke-width", linkStyle.getLineWidth());
            }
            if (link.source.isVisited() === true && link.target.isVisited() !== true){
                d3.select(this).style("stroke-width", linkStyle.getLineWidth());
            }
        });
    },

    // get nb hidden link
    getNbHidden: function(node) {
        var rankData = _metExploreViz.getRankById("rankData");
        var connexion = rankData.getData();
        var identifier = node.dbIdentifier;

        var linkIn = connexion[identifier]["linkIn"];
        var linkOut = connexion[identifier]["linkOut"];

        var nbHidden = 0;

        linkIn.map(function(link){
            if (link.source.isHidden() === true){
                nbHidden++;
            }
        });

        linkOut.map(function(link){
            if (link.target.isHidden() === true){
                nbHidden++;
            }
        });

        node.setNbHidden(nbHidden);
    },

    // Create and delete ring functions
    createNodeRing: function(target) {
        var metaboliteStyle = metExploreD3.getMetaboliteStyle();
        var reactionStyle = metExploreD3.getReactionStyle();
        var nbHidden = target.nbHidden;
        var minDim = Math.min(metaboliteStyle.getWidth(), metaboliteStyle.getHeight());

        var nodes = d3.select("#viz").select("#D3viz").select("#graphComponent").selectAll("g.node");

        nodes.each(function(node){
            // metabolite ring
            if (node === target && node.getBiologicalType() !== "reaction"){
                var boxExpand = d3.select(this)
                    .insert("svg", ":first-child")
                    .attr(
                        "viewBox",
                        function (d) {
                            +" " + minDim*2;
                        }
                    )
                    .attr("width", 5+metaboliteStyle.getWidth())
                    .attr("height", 5+metaboliteStyle.getHeight())
                    .attr("preserveAspectRatio", "xMinYMin")
                    .attr("y",  -metaboliteStyle.getHeight())
                    .attr("x", 0)
                    .attr("class", "expand")
                    .classed('hide', true)
                    .on('click', function(node, v) {
                        metExploreD3.GraphRank.showNeighbours(node);
                        metExploreD3.GraphRank.visit(node);
                    })
                    .on('mouseenter', function (e, v) {
                        var oldX = parseFloat(d3.select(this).attr("x"));
                        d3.select(this).attr("x", oldX+0.5);

                        var oldY = parseFloat(d3.select(this).attr("y"));
                        d3.select(this).attr("y", oldY-0.5);
                    })
                    .on('mouseleave', function (e, v) {
                        var oldX = parseFloat(d3.select(this).attr("x"));
                        d3.select(this).attr("x", oldX-0.5);

                        var oldY = parseFloat(d3.select(this).attr("y"));
                        d3.select(this).attr("y", oldY+0.5);
                    });

                boxExpand.append("svg:path")
                    .attr("class", "backgroundExpand")
                    .attr("d", "M0" + "," + metaboliteStyle.getHeight() +
                    " L"+ metaboliteStyle.getWidth() +","+ metaboliteStyle.getHeight() +
                    " L"+ metaboliteStyle.getRX() * 2 +"," + metaboliteStyle.getRY() * 2 +
                    " A"+ metaboliteStyle.getRX() * 2 +","+ metaboliteStyle.getRY() * 2 + ",0 0 0 " + "0,0" +
                    " L0,"+ metaboliteStyle.getHeight())
                    .attr("fill", "#00aa00");

                boxExpand.append("image")
                    .attr("class", "iconExpand")
                    .attr("y", 1)
                    .attr("x", 0)
                    .attr("width", "80%")
                    .attr("height", "80%")
                    .attr("xlink:href",  "resources/icons/plus.svg");

                var boxCollaspe = d3.select(this)
                    .insert("svg", ":first-child")
                    .attr(
                        "viewBox",
                        function (d) {
                            +" " + minDim*2;
                        }
                    )
                    .attr("width",  5+metaboliteStyle.getWidth())
                    .attr("height", 5+metaboliteStyle.getHeight())
                    .attr("preserveAspectRatio", "xMinYMin")
                    .attr("y", 0)
                    .attr("x", 0)
                    .attr("class", "collapse")
                    .classed('hide', true)
                    .on('click', function(node, v) {
                        metExploreD3.GraphRank.hideNeighbours(node);
                        metExploreD3.GraphRank.unvisit(node);
                    })
                    .on('mouseenter', function (e, v) {
                        var oldX = parseFloat(d3.select(this).attr("x"));
                        d3.select(this).attr("x", oldX+0.5);

                        var oldY = parseFloat(d3.select(this).attr("y"));
                        d3.select(this).attr("y", oldY+0.5);
                    })
                    .on('mouseleave', function (e, v) {
                        var oldX = parseFloat(d3.select(this).attr("x"));
                        d3.select(this).attr("x", oldX-0.5);

                        var oldY = parseFloat(d3.select(this).attr("y"));
                        d3.select(this).attr("y", oldY-0.5);
                    });

                boxCollaspe.append("svg:path")
                    .attr("class", "backgroundCollapse")
                    .attr("d", "M" + (-metaboliteStyle.getWidth()) +"," + 0 +
                    " a1,1 0 0,0 " + (metaboliteStyle.getWidth() *2) +",0")
                    .attr("fill", "#dd0000");

                boxCollaspe.append("image")
                    .attr("class", "iconCollapse")
                    .attr("y", 1)
                    .attr("x", 5)
                    .attr("width", "40%")
                    .attr("height", "40%")
                    .attr("xlink:href",  "resources/icons/minus.svg");

                d3.select(this)
                    .selectAll('.nbHidden').remove();
                d3.select(this)
                    .append("svg:text")
                    .attr('class', 'nbHidden')
                    .text(nbHidden)
                    .style("font-size", 8)
                    .style("font-weight", "bold");

                var textSize = d3.select(this)
                    .select('text.nbHidden').node().getComputedTextLength();


                var sizeBodyCircle = Math.max(textSize, 7);
                d3.select(this)
                    .selectAll('text.nbHidden').remove();



                d3.select(this)
                    .append("svg:path")
                    .attr('class', 'nbHidden')
                    .style("fill", "rgb(255, 73, 73)")
                    .style("opacity", "1")
                    .style("stroke", "black")
                    .style("stroke", "black")
                    .attr("d", "M 7, 0" +
                        "       L "+sizeBodyCircle+", 0" +
                        "       a 7,7 0 0,1 0,14        " +
                        "       L 7, 14       " +
                        "       L0,14       " +
                        "       L0,7 " +
                        "       a 7,7 0 0,1 7,-7")
                    .attr("transform", "translate(" + 13 + ", " + -25 + ") scale(1)");

                var textPosition=0;
                if(textSize>7)
                    textPosition=(sizeBodyCircle+7)/2-textSize/2;
                else
                    textPosition=7-textSize/2;
                d3.select(this)
                    .append("svg:text")
                    .attr('class', 'nbHidden')
                    .text(nbHidden)
                    .style("font-size", 8)
                    .attr("fill", "black")
                    .style("font-weight", "bold")
                    .attr('x', 13 + textPosition)
                    .attr('y', -15);
                // d3.select(this).selectAll(".nbHidden").classed('hide', true);
            }

            // reaction ring
            if (node === target && node.getBiologicalType() === "reaction"){
                var boxCollapse = d3.select(this)
                    .insert("svg", ":first-child")
                    .attr(
                        "viewBox",
                        function (d) {
                            +" " + minDim*2;
                        }
                    )
                    .attr("width", 5+reactionStyle.getWidth())
                    .attr("height", 5+reactionStyle.getHeight())
                    .attr("preserveAspectRatio", "xMinYMin")
                    .attr("y",  -reactionStyle.getHeight())
                    .attr("x", 0)
                    .attr("class", "expand")
                    .classed('hide', true)
                    .on('click', function(node, v) {
                        metExploreD3.GraphRank.hideNeighbours(node);
                        metExploreD3.GraphRank.unvisit(node);
                    })

                boxCollapse.append("svg:path")
                    .attr("class", "backgroundExpand")
                    .attr("d", "M" + reactionStyle.getWidth() + "," + reactionStyle.getHeight() +
                        " L0," + reactionStyle.getHeight() +
                        " L0," + reactionStyle.getRY() * 2 +
                        " A" + reactionStyle.getRX() * 2 + "," + reactionStyle.getRY() * 2 + ",0 0 1 " + reactionStyle.getRX() * 2 + ",0" +
                        " L" + reactionStyle.getWidth() + ",0")
                    .attr("fill", "#dd0000");

                boxCollapse.append("image")
                    .attr("class", "iconExpand")
                    .attr("y", reactionStyle.getHeight() / 4 - (reactionStyle.getHeight() - reactionStyle.getRY() * 2) / 4)
                    .attr("x", reactionStyle.getWidth() / 4 - (reactionStyle.getWidth() - reactionStyle.getRX() * 2) / 8)
                    .attr("width", "40%")
                    .attr("height", "40%")
                    .attr("xlink:href",  "resources/icons/minus.svg");
            }
        });
    },

    updateNbHidden: function() {
        var nodes = d3.select("#viz").select("#D3viz").select("#graphComponent").selectAll("g.node");
        nodes.each(function(node){
            if (node.getBiologicalType() === "metabolite"){
                metExploreD3.GraphRank.getNbHidden(node);
                var nbHidden = node.nbHidden;
                d3.select(this)
                    .selectAll('.nbHidden').remove();
                d3.select(this)
                    .append("svg:text")
                    .attr('class', 'nbHidden')
                    .classed('hide', true)
                    .text(nbHidden)
                    .style("font-size", 8)
                    .style("font-weight", "bold");

                var textSize = d3.select(this)
                    .select('text.nbHidden').node().getComputedTextLength();


                var sizeBodyCircle = Math.max(textSize, 7);
                d3.select(this)
                    .selectAll('text.nbHidden').remove();



                d3.select(this)
                    .append("svg:path")
                    .attr('class', 'nbHidden')
                    .style("fill", "rgb(255, 73, 73)")
                    .style("opacity", "1")
                    .style("stroke", "black")
                    .style("stroke", "black")
                    .attr("d", "M 7, 0" +
                        "       L "+sizeBodyCircle+", 0" +
                        "       a 7,7 0 0,1 0,14        " +
                        "       L 7, 14       " +
                        "       L0,14       " +
                        "       L0,7 " +
                        "       a 7,7 0 0,1 7,-7")
                    .attr("transform", "translate(" + 13 + ", " + -25 + ") scale(1)");

                var textPosition=0;
                if(textSize>7)
                    textPosition=(sizeBodyCircle+7)/2-textSize/2;
                else
                    textPosition=7-textSize/2;
                d3.select(this)
                    .append("svg:text")
                    .attr('class', 'nbHidden')
                    .text(nbHidden)
                    .style("font-size", 8)
                    .attr("fill", "black")
                    .style("font-weight", "bold")
                    .attr('x', 13 + textPosition)
                    .attr('y', -15);
                // d3.select(this).selectAll(".nbHidden").classed('hide', true);
            }
        });
    },

    delRing: function() {
        d3.select("#viz").select("#D3viz").select("#graphComponent").selectAll("g.node").selectAll(".expand").remove();
        d3.select("#viz").select("#D3viz").select("#graphComponent").selectAll("g.node").selectAll(".collapse").remove();
    }
};
