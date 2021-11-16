/**
 * @class metExploreD3.GraphRank
 * Function to manage GIR
 *
 * Guided Interaction Reconstruction
 *
 * @uses metExploreD3.GraphNode
 * @uses metExploreD3.GraphCaption
 * @uses metExploreD3.GraphNetwork
 *
 * @author JCG
 */

metExploreD3.GraphRank = {
    /**
     * @property {Boolean} [launchGIR=false]
     * @property {Boolean} [metaboRankMode=false]
     * @property {String} [girMode="classic"]
     */
    launchGIR: false,
    metaboRankMode: false,

    // Start and quit GIR methods
    /*******************************************
    * Initialization of Gir style and function
    * @param {Array} listMi Array of nodes name
    */
    startGir: function(listMi) {
        var nodes = d3.select("#viz").select("#D3viz").select("#graphComponent").selectAll("g.node");
        var links = d3.select("#viz").select("#D3viz").select("#graphComponent").selectAll("path.link");

        var session = _metExploreViz.getSessionById("viz");
        var networkData = session.getD3Data();

        var listMiCmpt = [];

        listMi.map(function(mi){
            var meta = metExploreD3.GraphRank.transformId(mi, "id");
            var miCmpt = metExploreD3.GraphRank.nodeForAll(metExploreD3.GraphRank.getIdentifier(meta));
            miCmpt.map(function(identifier){
                listMiCmpt.push(identifier);
            });
        });

        nodes.each(function(node){
            if (listMiCmpt.includes(node.dbIdentifier)){
                metExploreD3.GraphRank.startNode(node);
            }
            if (!(listMiCmpt.includes(node.dbIdentifier))) {
                node.hide()
            }
        });

        metExploreD3.GraphNetwork.updateNetwork("viz", _metExploreViz.getSessionById("viz"));

        listMiCmpt.forEach(function(mi){
            var node = networkData.getNodeByDbIdentifier(mi);
            metExploreD3.GraphRank.getNbHidden(node);
            metExploreD3.GraphRank.createNodeRing(node);
        });
        metExploreD3.GraphRank.updateNbHidden();
        metExploreD3.GraphRank.setSideCompound();

        // metExploreD3.GraphCaption.drawCaptionGirMode();
        metExploreD3.GraphCaption.delCaption();
    },

    /*******************************************
     * Define starting node style
     * @param {Object} node node object
     */
    startNode: function(node) {
        var allNodes = d3.select("#viz").select("#D3viz").select("#graphComponent").selectAll("g.node").selectAll("rect");
        allNodes.filter(function(thisNode){
            return thisNode === node
        })
        .style("stroke-width",5)
        .style("stroke","#00aa00")
        .style("stroke-opacity",0.4);
    },

    /*******************************************
     * Remove Gir style and reconstruct entire network from networkData
     */
    quitGir: function() {
        var mask = metExploreD3.createLoadMask("Reconstruct network","viz");
        var session = _metExploreViz.getSessionById("viz");
        var networkData = session.getD3Data();
        var allNodes = d3.select("#viz").select("#D3viz").select("#graphComponent").selectAll("g.node");
        var nodes = networkData.getNodes();

        if (mask !== undefined){
            metExploreD3.showMask(mask);

            metExploreD3.deferFunction(
                function () {
                    allNodes.each(function(node){
                        if (node.duplicated === true){
                            networkData.removeNode(node);
                        }
                    });

                    allNodes.remove();

                    nodes.map(function(node, i){
                        if (node.getBiologicalType() !== "pathway"){
                            node.show();
                            node.unvisit();
                        }
                    });

                    metExploreD3.GraphRank.removeGirStyle();
                    metExploreD3.GraphNetwork.updateNetwork("viz", _metExploreViz.getSessionById("viz"));
                    metExploreD3.hideMask(mask);
                },100);
        }
        metExploreD3.GraphCaption.drawCaption();
    },

    /*******************************************
     * Remove Gir style and apply style from panel selection
     */
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

    /*******************************************
     * Remove Gir style and extract network from visited node and link
     */
    quitAndExtract: function() {
        var session = _metExploreViz.getSessionById("viz");
        var networkData = session.getD3Data();
        var allNodes = d3.select("#viz").select("#D3viz").select("#graphComponent").selectAll("g.node");
        var nodes = networkData.getNodes();

        allNodes.each(function(node){
            if (node.duplicated === true){
                networkData.removeNode(node);
            }
        });

        allNodes.remove();

        nodes.map(function(node){
            if (node.isVisited() === false){
                node.hide();
            }
            if (node.isVisited() === true){
                node.show();
                node.unvisit();
            }
        });

        metExploreD3.GraphRank.removeGirStyle();
        metExploreD3.GraphNetwork.updateNetwork("viz", _metExploreViz.getSessionById("viz"));
        metExploreD3.GraphCaption.drawCaption();
    },

    // save network function
    /*******************************************
    * Create a numeric map of the network
    */
    saveNetwork: function() {
        var session = _metExploreViz.getSessionById("viz");
        var networkData = session.getD3Data();

        var nodes = networkData.getNodes();
        var links = d3.select("#viz").select("#D3viz").select("#graphComponent").selectAll("path.link");

        var connexion = {};
        var linkIn;
        var linkOut;

        nodes.map(function(node, i){
            var identifier = node.dbIdentifier;
            connexion[identifier] = {linkIn: [], linkOut: []};
            links.each(function(link){
                linkIn = connexion[identifier]["linkIn"];
                linkOut = connexion[identifier]["linkOut"];
                if (link.source === node && !(linkOut.includes(link))){
                    connexion[identifier]["linkOut"].push(link);
                }
                if (link.target === node && !(linkIn.includes(link))){
                    connexion[identifier]["linkIn"].push(link);
                }
            });
        });

        return connexion;
    },

    // Show and collapse nodes functions
    /*******************************************
    * According to the direction, show previous, next or both neighbours from the node.
    * Sort reactions according to their metaborank score and show them 5 by 5
    * @param {Object} node node object
    * @param {String} direction previous, next or all
    */
    showNeighbours: function(node, direction) {
        var nodes = d3.select("#viz").select("#D3viz").select("#graphComponent").selectAll("g.node");
        var rankData = _metExploreViz.getRankById("rankData");
        var connexion = rankData.getData();

        var identifier = node.dbIdentifier;

        var linkOut = connexion[identifier]["linkOut"];
        var linkIn = connexion[identifier]["linkIn"];

        var addRingNodes = [];

        if (direction === "all"){
            var reactList = metExploreD3.GraphRank.sortAllReactFromScore(node);
        }
        if (direction === "next"){
            var reactList = metExploreD3.GraphRank.sortOutReactFromScore(node);
        }
        if (direction === "previous"){
            var reactList = metExploreD3.GraphRank.sortInReactFromScore(node);
        }

        if (direction === "all" || direction === "previous"){
            linkIn.map(function(link, i){
                if (reactList.includes(link.source.dbIdentifier)){
                    link.source.show();
                    addRingNodes.push(link.source);
                    identifier = link.source.dbIdentifier;
                    connexion[identifier]["linkIn"].map(function(that, i){
                        var isSide = that.source.getIsSideCompound();
                        if (isSide === false){
                            that.source.show();
                            addRingNodes.push(that.source);
                        }
                    });
                    connexion[identifier]["linkOut"].map(function(that, i){
                        if (that.target.isHidden() === true){
                            var isSide = that.target.getIsSideCompound();
                            if (isSide === false){
                                that.target.show();
                                addRingNodes.push(that.target);
                            }
                        }
                    });
                }
            });
        }

        if (direction === "all" || direction === "next"){
            linkOut.map(function(link, i){
                if (reactList.includes(link.target.dbIdentifier)){
                    link.target.show();
                    addRingNodes.push(link.target);
                    identifier = link.target.dbIdentifier;
                    connexion[identifier]["linkOut"].map(function(that, i){
                        var isSide = that.target.getIsSideCompound();
                        if (isSide === false){
                            that.target.show();
                            addRingNodes.push(that.target);
                        }
                        if (isSide === true){
                            that.source.asSideCompounds = true;
                            that.source.sideCompoundsHidden = true;
                        }
                    });
                    connexion[identifier]["linkIn"].map(function(that, i){
                        if (that.source.isHidden() === true){
                            var isSide = that.source.getIsSideCompound();
                            if (isSide === false){
                                that.source.show();
                                addRingNodes.push(that.source);
                            }
                            if (isSide === true){
                                that.target.asSideCompounds = true;
                                that.target.sideCompoundsHidden = true;
                            }
                        }
                    });
                }
            });
        }

        metExploreD3.GraphNetwork.updateNetwork("viz", _metExploreViz.getSessionById("viz"));

        addRingNodes.map(function(thisNode){
            metExploreD3.GraphRank.createNodeRing(thisNode);
            if (thisNode.getBiologicalType() === "metabolite"){
                metExploreD3.GraphRank.nodeStyleByRank(thisNode);
            }
        });
    },

    /*******************************************
     * show side compounds from a reaction node
     * @param {Object} react node object
     */
    showSideCompounds: function(react) {
        var rankData = _metExploreViz.getRankById("rankData");
        var connexion = rankData.getData();

        var identifier = react.dbIdentifier;

        var linkOut = connexion[identifier]["linkOut"];

        linkOut.map(function(link){
            var isSide = link.target.getIsSideCompound();
            if (isSide === true){
                var newID = link.target.getId()+"-"+link.source.getId();
                var newNode = metExploreD3.GraphNetwork.addMetaboliteInDrawing(link.target,link.target.getId(),link.source.getId(),"viz");
                metExploreD3.GraphNetwork.addLinkInDrawing(link.source.getId()+"-"+newID,link.source,newNode,"out",link.source.getReactionReversibility(),"viz");
            }
        });

        react.sideCompoundsHidden = false;
        metExploreD3.GraphNetwork.updateNetwork("viz", _metExploreViz.getSessionById("viz"));
        metExploreD3.GraphRank.visitLink();
    },

    /*******************************************
     * Hide neighbours from a node and the node.
     * Recursivity if the neighbours have 0 neighbours.
     * @param {Object} node node object
     */
    hideNeighbours: function(node) {
        var rankData = _metExploreViz.getRankById("rankData");
        var connexion = rankData.getData();
        var links = d3.select("#viz").select("#D3viz").select("#graphComponent").selectAll("path.link");

        var identifier = node.dbIdentifier;
        var bioType = node.getBiologicalType();

        var linkIn = connexion[identifier]["linkIn"];
        var linkOut = connexion[identifier]["linkOut"];

        var nbLinkIn = 0;
        var nbLinkOut = 0;

        linkIn.map(function(link, i){
            links.each(function(thisLink){
                if ((thisLink.source === link.source || thisLink.target === link.source) && link.source.isHidden() === false){
                    nbLinkIn++;
                }
            });
            if (nbLinkIn < 3 && bioType === "metabolite"){
                metExploreD3.GraphRank.hideNeighbours(link.source);
            }
            if (nbLinkIn < 2 && bioType === "reaction"){
                link.source.hide();
            }
            nbLinkIn = 0;
        });
        linkOut.map(function(link, i){
            links.each(function(thisLink){
                if ((thisLink.source === link.target || thisLink.target === link.target) && link.target.isHidden() === false){
                    nbLinkOut++;
                }
            });
            if (nbLinkOut < 3 && bioType === "metabolite"){
                metExploreD3.GraphRank.hideNeighbours(link.target);
            }
            if (nbLinkOut < 2 && bioType === "reaction"){
                link.target.hide();
            }
            nbLinkOut = 0;
        });

        node.hide();
        metExploreD3.GraphNetwork.updateNetwork("viz", _metExploreViz.getSessionById("viz"));
    },

    /*******************************************
     * Hide side compounds from a reaction node
     * @param {Object} react node object
     */
    hideSideCompounds: function(react) {
        var links = d3.select("#viz").select("#D3viz").select("#graphComponent").selectAll("path.link");
        var session = _metExploreViz.getSessionById("viz");
        var networkData = session.getD3Data();

        links.each(function(link){
            if (link.source === react && link.target.duplicated === true){
                networkData.removeNode(link.target);
            }
        });

        react.sideCompoundsHidden = true;
        metExploreD3.GraphNetwork.updateNetwork("viz", _metExploreViz.getSessionById("viz"));
        metExploreD3.GraphRank.visitLink();
    },

    // threshold functions
    /*******************************************
    * Sort reactions according to previous and next neighbours rank score
    * @param {Object} node node object
    */
    sortAllReactFromScore: function(node) {
        var rankData = _metExploreViz.getRankById("rankData");
        var connexion = rankData.getData();
        var identifier = node.dbIdentifier;

        var linksIn = connexion[identifier]["linkIn"];
        var linksOut = connexion[identifier]["linkOut"];

        var reactList = [];

        if ((linksIn.length + linksOut.length) < 6){
            linksIn.map(function(link){
                reactList.push(link.source.dbIdentifier);
            });
            linksOut.map(function(link){
                reactList.push(link.target.dbIdentifier);
            });
            return reactList;
        }

        if ((linksIn.length + linksOut.length) > 5){
            linksIn.map(function(link){
                if (link.source.isHidden() === true){
                    reactList.push(link.source.dbIdentifier);
                }
            });
            linksOut.map(function(link){
                if (link.target.isHidden() === true){
                    reactList.push(link.target.dbIdentifier);
                }
            });
            var score = metExploreD3.GraphRank.getScore(reactList);
            return score;
        }
    },

    /*******************************************
     * Sort reactions according to previous neighbours rank score
     * @param {Object} node node object
     */
    sortInReactFromScore: function(node){
        var rankData = _metExploreViz.getRankById("rankData");
        var connexion = rankData.getData();
        var identifier = node.dbIdentifier;

        var linksIn = connexion[identifier]["linkIn"];

        var reactList = [];

        if (linksIn.length < 6){
            linksIn.map(function(link){
                reactList.push(link.source.dbIdentifier);
            });
            return reactList;
        }

        if (linksIn.length > 5){
            linksIn.map(function(link){
                if (link.source.isHidden() === true){
                    reactList.push(link.source.dbIdentifier);
                }
            });
            var score = metExploreD3.GraphRank.getScore(reactList);
            return score;
        }
    },

    /*******************************************
     * Sort reactions according to next neighbours rank score
     * @param {Object} node node object
     */
    sortOutReactFromScore: function(node){
        var rankData = _metExploreViz.getRankById("rankData");
        var connexion = rankData.getData();
        var identifier = node.dbIdentifier;

        var linksOut = connexion[identifier]["linkOut"];

        var reactList = [];

        if (linksOut.length < 6){
            linksOut.map(function(link){
                reactList.push(link.target.dbIdentifier);
            });
            return reactList;
        }

        if (linksOut.length > 5){
            linksOut.map(function(link){
                if (link.target.isHidden() === true){
                    reactList.push(link.target.dbIdentifier);
                }
            });
            var score = metExploreD3.GraphRank.getScore(reactList);
            return score;
        }
    },

    /*******************************************
     * Calcul mean score for reaction list
     * @param {Array} reactList list of reaction identifier
     */
    getScore: function(reactList) {
        var rankData = _metExploreViz.getRankById("rankData");
        var connexion = rankData.getData();
        var rankScore = rankData.getScore();

        var bestReact = [];
        var scoreList = [];
        var scoreDict = {};

        reactList.forEach(function(identifier){
            var linksIn = connexion[identifier]["linkIn"];
            var linksOut = connexion[identifier]["linkOut"];
            var score = 0;
            var nbNode = 0;

            linksIn.map(function(link){
                if (link.source.isHidden() === true && link.source.getIsSideCompound() === false){
                    var sourceId = metExploreD3.GraphRank.getIdentifier(link.source.dbIdentifier);
                    var nodeScore = rankScore[sourceId];
                    score = score+Math.min(nodeScore[0],nodeScore[1]);
                    nbNode++;
                }
            });
            linksOut.map(function(link){
                if (link.target.isHidden() === true && link.target.getIsSideCompound() === false){
                    var targetId = metExploreD3.GraphRank.getIdentifier(link.target.dbIdentifier);
                    var nodeScore = rankScore[targetId];
                    score = score+Math.min(nodeScore[0],nodeScore[1]);
                    nbNode++;
                }
            });
            var score = score / nbNode;

            scoreList.push(score);
            scoreDict[identifier] = score;
        });

        scoreList.sort(function(a,b){return a-b});
        for (var i = 0; i < 5; i++){
            var identifier = Object.keys(scoreDict);
            identifier.forEach(function(id){
                if (scoreDict[id] === scoreList[i]){
                    bestReact.push(id);
                }
            });
        }
        return bestReact;
    },

    // Identifier functions
    /*******************************************
    * Get node identifier without compartment letter
    * @param {String} identifier node identifier
    */
    getIdentifier: function(identifier) {
        if (identifier.slice(-2, -1) === "_"){
            return identifier.slice(0,-2);
        }
        else {
            return identifier.slice(0, -1);
        }
    },

    /*******************************************
     * According to node identifier, get nodes from all compartments
     * @param {String} dbID node identifier
     */
    nodeForAll: function(dbID){
        var session = _metExploreViz.getSessionById("viz");
        var networkData = session.getD3Data();

        var listCompartments = ["_c","_x","_m","_r","_l","_e","_b","_g","_n"];
        var listIdentifier = [];

        listCompartments.forEach(function(compartment){
            var node = networkData.getNodeByDbIdentifier(dbID+compartment);
            if (node !== undefined){
                var identifier = dbID+compartment;
                listIdentifier.push(identifier);
            }
        });
        return listIdentifier;
    },

    /*******************************************
     * Transform node identifier to node name
     * Or node name to node identifier
     * @param {String} id node identifier
     * @param {String} direction name or id
     */
    transformId: function(id, direction) {
        var session = _metExploreViz.getSessionById("viz");
        var networkData = session.getD3Data();

        if (direction === "name"){
            var listNode = metExploreD3.GraphRank.nodeForAll(id);
            var node = networkData.getNodeByDbIdentifier(listNode[0]);

            if (node !== undefined){
                return node.name;
            }
        }

        if (direction === "id"){
            var node = networkData.getNodeByName(id);

            if (node !== undefined){
                return node.dbIdentifier;
            }
        }
    },

    // rank style functions
    /*******************************************
    * Display style according to rank score of the node
    * @param {Object} node node object
    */
    nodeStyleByRank: function(node) {
        var nodes = d3.select("#viz").select("#D3viz").select("#graphComponent").selectAll("g.node").filter(function(node){
            return node.isVisited() === false;
        });
        var rankData = _metExploreViz.getRankById("rankData");
        var rankScore = rankData.getScore();
        var identifier = metExploreD3.GraphRank.getIdentifier(node.dbIdentifier);
        var nodeScore = rankScore[identifier];

        if (nodeScore !== undefined){
            var rankIn = parseInt(nodeScore[0]);
            var rankOut = parseInt(nodeScore[1]);

            nodes.each(function(thisNode){
                if (thisNode === node) {
                    if (rankIn < 25 && rankOut < 25) {
                        d3.select(this).selectAll("rect")
                            .style("stroke-width",3)
                            .style("stroke","purple");
                    }
                    if (rankIn > 25 && rankOut < 25) {
                        d3.select(this).selectAll("rect")
                            .style("stroke-width",3)
                            .style("stroke","red");
                    }
                    if (rankIn < 25 && rankOut > 25) {
                        d3.select(this).selectAll("rect")
                            .style("stroke-width",3)
                            .style("stroke","green");
                    }
                    if (rankIn > 25 && rankOut > 25) {
                        d3.select(this).selectAll("rect")
                            .style("stroke","black");
                    }
                }
            });
        }
    },

    // visit and unvisit functions
    /*******************************************
    * Mark as visit the node and check if some links connect two visited nodes
    * @param {Object} node node object
    */
    visit: function(node) {
        var nodes = d3.select("#viz").select("#D3viz").select("#graphComponent").selectAll("g.node");

        nodes.each(function(thisNode){
            if (thisNode === node){
                d3.select(this).selectAll("rect").style("fill","black");
                node.visit();
            }
        });

        metExploreD3.GraphRank.visitLink();
    },

    /*******************************************
     * Mark as unvisit the node and check changement on links
     * @param {Object} node node object
     */
    unvisit: function(node) {
        var nodes = d3.select("#viz").select("#D3viz").select("#graphComponent").selectAll("g.node");
        var metaboliteStyle = metExploreD3.getMetaboliteStyle();

        nodes.each(function(thisNode){
            if (thisNode === node){
                d3.select(this).select("rect").style("fill",metaboliteStyle.backgroundColor);
                node.unvisit();
            }
        });

        metExploreD3.GraphRank.unvisitLink();
        metExploreD3.GraphRank.visitLink();
    },

    /*******************************************
     * Change link style if it connect two visited nodes
     */
    visitLink: function() {
        var links = d3.select("#viz").select("#D3viz").select("#graphComponent").selectAll("path.link");
        var rankData = _metExploreViz.getRankById("rankData");
        var connexion = rankData.getData();

        links.each(function(link){
            if (link.source.isVisited() === true){
                var linkOut = connexion[link.target.dbIdentifier]["linkOut"];
                linkOut.map(function(thisLink){
                    if (thisLink.target.isVisited() === true){
                        thisLink.source.visit();
                    }
                });
            }
        });

        links.each(function(link){
            if (link.source.isVisited() === true && link.target.isVisited() === true){

                var gradientId = link.source.dbIdentifier + link.target.dbIdentifier;
                var gradientUrl = "url(#"+gradientId+")";

                var defs = d3.select("#viz").select("#D3viz").select("#graphComponent").append("defs");
                var gradient = defs.append("linearGradient")
                    .attr("id", gradientId);

                gradient.append("stop")
                    .attr("offset", 0+"%")
                    .attr("stop-color", "red");

                gradient.append("stop")
                    .attr("offset", 25+"%")
                    .attr("stop-color", "red");

                gradient.append("stop")
                    .attr("offset", 26+"%")
                    .attr("stop-color", "green");

                gradient.append("stop")
                    .attr("offset", 100+"%")
                    .attr("stop-color", "green");

                d3.select(this).style("stroke-width",5).style("stroke",gradientUrl);
                // d3.select(this).style("stroke-width",5);
            }
            if (link.source.isVisited() === false || link.target.isVisited() === false){
                d3.select(this).style("stroke-width",1);
            }
        });
    },

    /*******************************************
     * Change link style if it doesn't connect two visited nodes
     */
    unvisitLink: function() {
        var links = d3.select("#viz").select("#D3viz").select("#graphComponent").selectAll("path.link");
        var rankData = _metExploreViz.getRankById("rankData");
        var connexion = rankData.getData();
        var linkStyle = metExploreD3.getLinkStyle();

        links.each(function(link){
            if (link.target.isVisited() === false && link.target.getBiologicalType() === "metabolite"){
                link.source.unvisit();
            }
            if (link.source.isVisited() === false && link.source.getBiologicalType() === "metabolite"){
                link.target.unvisit();
            }
            if (link.source.isVisited() !== true && link.target.isVisited() === true){
                d3.select(this).style("stroke-width", 1);
            }
            if (link.source.isVisited() === true && link.target.isVisited() !== true){
                d3.select(this).style("stroke-width", 1);
            }
        });
    },

    // side compounds functions
    /*******************************************
    * Set as side compounds nodes in the list
    */
    setSideCompound: function(){
        var session = _metExploreViz.getSessionById("viz");
        var networkData = session.getD3Data();
        var sideCompounds = ["M_h", "M_h2o", "M_atp", "M_pi", "M_adp", "M_nadp", "M_ppi", "M_nad", "M_nadph", "M_nadh",
                            "M_co2", "M_ACP", "M_amp", "M_glyc3p", "M_PGPm1", "M_apoACP", "M_biomass", "M_malACP", "M_nh4", "M_hco3",
                            "M_fe3", "M_o2", "M_cu2", "M_so4", "M_fe2", "M_mg2", "M_k", "M_mn2", "M_so3", "M_PGP", "M_zn2", "M_palmACP",
                            "M_ca2", "M_h2o2", "M_cobalt2", "M_cl", "M_h2s", "M_pppi", "M_rnatrans", "M_proteinsynth", "M_dnarep", "M_na1",
                            "M_pb", "M_hg2", "M_cd2", "M_seln", "M_aso4", "M_o2s", "M_aso3"];

        sideCompounds.forEach(function(sideNode){
            var listIdentifier = metExploreD3.GraphRank.nodeForAll(sideNode);
            if (listIdentifier !== []){
                listIdentifier.map(function(identifier){
                    var node = networkData.getNodeByDbIdentifier(identifier);
                    node.setIsSideCompound(true);
                });
            }
        });
    },

    // get nb hidden link
    /*******************************************
    * Check how many reaction is hidden from the node
    * @param {Object} node node object
    */
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

    // Create ring functions
    /*******************************************
    * Create radial menu
    * @param {Object} target node object
    */
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
                        metExploreD3.GraphRank.showNeighbours(node, "all");
                        metExploreD3.GraphRank.visit(node);
                        node.setLocked(true);
                        metExploreD3.GraphNode.fixNode(node);
                        metExploreD3.GraphRank.updateNbHidden();
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
                    .attr("d", "M 0 0, L 0 " + (metaboliteStyle.getHeight()) +
                    "L " + (metaboliteStyle.getWidth()) + " " + (metaboliteStyle.getHeight()) +
                    " Q " + (metaboliteStyle.getWidth()) + " 0, " +
                    "0 0")
                    .attr("fill", "#00aa00");

                boxExpand.append("image")
                    .attr("class", "iconExpand")
                    .attr("y", 0)
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
                        if (node.isVisited() === false){
                            metExploreD3.GraphRank.hideNeighbours(node);
                            metExploreD3.GraphRank.updateNbHidden();
                            metExploreD3.GraphRank.visitLink();
                        }
                        if (node.isVisited() === true){
                            metExploreD3.GraphRank.unvisit(node);
                            node.setLocked(false);
                            metExploreD3.GraphNode.unfixNode(node);
                        }
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
                    .attr("d", "M 0 0, L " + (metaboliteStyle.getWidth()) + " 0" +
                    "Q " + (metaboliteStyle.getWidth()) + " " + (metaboliteStyle.getHeight()) +
                    " ,0 " + (metaboliteStyle.getHeight()) +
                    "L 0 0")
                    .attr("fill", "#dd0000");

                boxCollaspe.append("image")
                    .attr("class", "iconCollapse")
                    .attr("y", 2)
                    .attr("x", 5)
                    .attr("width", "40%")
                    .attr("height", "40%")
                    .attr("xlink:href",  "resources/icons/minus.svg");

                var boxVisit = d3.select(this)
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
                    .attr("x", -metaboliteStyle.getWidth())
                    .attr("class", "visit")
                    .classed('hide', true)
                    .on('click', function(node, v) {
                        metExploreD3.GraphRank.visit(node);
                        node.setLocked(true);
                        metExploreD3.GraphNode.fixNode(node);
                    })
                    .on('mouseenter', function (e, v) {
                        var oldX = parseFloat(d3.select(this).attr("x"));
                        d3.select(this).attr("x", oldX-0.5);

                        var oldY = parseFloat(d3.select(this).attr("y"));
                        d3.select(this).attr("y", oldY+0.5);
                    })
                    .on('mouseleave', function (e, v) {
                        var oldX = parseFloat(d3.select(this).attr("x"));
                        d3.select(this).attr("x", oldX+0.5);

                        var oldY = parseFloat(d3.select(this).attr("y"));
                        d3.select(this).attr("y", oldY-0.5);
                    });

                boxVisit.append("svg:path")
                    .attr("class", "backgroundVisit")
                    .attr("d", "M 0 0, Q 0 " + (metaboliteStyle.getHeight()) + ", " + 
                    (metaboliteStyle.getWidth()) + " " + (metaboliteStyle.getHeight()) +
                    "L" + (metaboliteStyle.getWidth()) + " 0" +
                    "L 0 0")
                    .attr("fill", "#0000dd");

                boxVisit.append("image")
                    .attr("class", "iconVisit")
                    .attr("y", 3)
                    .attr("x", 2)
                    .attr("width", "40%")
                    .attr("height", "40%")
                    .attr("xlink:href",  "resources/icons/check.svg");
            }

            // reaction ring
            if (node === target && node.getBiologicalType() === "reaction"){
                var boxExpand = d3.select(this)
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
                        if (node.asSideCompounds === true && node.sideCompoundsHidden === true) {
                            metExploreD3.GraphRank.showSideCompounds(node);
                            node.setLocked(true);
                            metExploreD3.GraphNode.fixNode(node);
                        }
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
                    .attr("d", "M" + reactionStyle.getWidth() + "," + reactionStyle.getHeight() +
                        " L0," + reactionStyle.getHeight() +
                        " L0," + reactionStyle.getRY() * 2 +
                        " A" + reactionStyle.getRX() * 2 + "," + reactionStyle.getRY() * 2 + ",0 0 1 " + reactionStyle.getRX() * 2 + ",0" +
                        " L" + reactionStyle.getWidth() + ",0")
                    .attr("fill", "#00aa00")
                    .attr("opacity", function(node){
                        if (node.asSideCompounds === true){
                            return 1;
                        }
                        else {
                            return 0.4;
                        }
                    });

                boxExpand.append("image")
                    .attr("class", "iconExpand")
                    .attr("y", -2)
                    .attr("x", -1)
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
                    .attr("width",  5+reactionStyle.getWidth())
                    .attr("height", 5+reactionStyle.getHeight())
                    .attr("preserveAspectRatio", "xMinYMin")
                    .attr("y", 0)
                    .attr("x", 0)
                    .attr("class", "collapse")
                    .classed('hide', true)
                    .on('click', function(node, v) {
                        if (node.sideCompoundsHidden === false){
                            metExploreD3.GraphRank.hideSideCompounds(node);
                            node.setLocked(false);
                            metExploreD3.GraphNode.unfixNode(node);
                        }
                        else {
                            metExploreD3.GraphRank.hideNeighbours(node);
                            metExploreD3.GraphRank.updateNbHidden();
                            metExploreD3.GraphRank.visitLink();
                            node.setLocked(false);
                            metExploreD3.GraphNode.unfixNode(node);
                        }
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
                    .attr("d", "M" + reactionStyle.getWidth() + "," + reactionStyle.getHeight() +
                        " L0," + reactionStyle.getHeight() +
                        " L0," + reactionStyle.getRY() * 2 +
                        " A" + reactionStyle.getRX() * 2 + "," + reactionStyle.getRY() * 2 + ",0 0 1 " + reactionStyle.getRX() * 2 + ",0" +
                        " L" + reactionStyle.getWidth() + ",0")
                    .attr("fill", "#dd0000");

                boxCollaspe.append("image")
                    .attr("class", "iconCollapse")
                    .attr("y", 2)
                    .attr("x", 2)
                    .attr("width", "40%")
                    .attr("height", "40%")
                    .attr("xlink:href",  "resources/icons/minus.svg");
            }
        });
    },

    /*******************************************
     * update number of hidden reaction
     */
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


                var textSize = 5;
                if (nbHidden > 10){
                    textSize = 10;
                }

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
                if (node.isVisited() === false || node.nbHidden === 0){
                    d3.select(this).selectAll(".nbHidden").classed('hide', true);
                }
            }
        });
    }
};
