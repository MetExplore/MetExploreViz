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

    // Start and quit Metaborank mode methods
    enterMetaboRankMode: function() {
        var metaboliteStyle = metExploreD3.getMetaboliteStyle();
        var reactionStyle = metExploreD3.getReactionStyle();
        var minDim = Math.min(metaboliteStyle.getWidth(), metaboliteStyle.getHeight());

        var boxExpand = d3.select("#viz").select("#D3viz").select("#graphComponent").selectAll("g.node")
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


                    var boxCollaspe = d3.select("#viz").select("#D3viz").select("#graphComponent").selectAll("g.node")
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
    },

    exitMetaboRankMode: function() {
        d3.select("#viz").select("#D3viz").select("#graphComponent").selectAll("g.node").selectAll(".expand").remove();
        d3.select("#viz").select("#D3viz").select("#graphComponent").selectAll("g.node").selectAll(".collapse").remove();
    },

    // Start and quit GIR methods
    startGir: function(listMi) {
        var nodes = d3.select("#viz").select("#D3viz").select("#graphComponent").selectAll("g.node");
        var links = d3.select("#viz").select("#D3viz").select("#graphComponent").selectAll("path.link");

        nodes.each(function(node){
            if (!node.dbIdentifier.includes(listMi)){
                metExploreD3.GraphRank.hideElement(d3.select(this));
            }
        });

        links.each(function(link){
            metExploreD3.GraphRank.hideElement(d3.select(this));
        });
    },

    quitGir: function() {
        var nodes = d3.select("#viz").select("#D3viz").select("#graphComponent").selectAll("g.node");
        var links = d3.select("#viz").select("#D3viz").select("#graphComponent").selectAll("path.link");

        nodes.each(function(node){
            metExploreD3.GraphRank.showElement(d3.select(this));
        });
        links.each(function(link){
            metExploreD3.GraphRank.showElement(d3.select(this));
        });
    },

    quitAndExtract: function() {
        d3.select("#viz").select("#D3viz").select("#graphComponent").selectAll("g.node.hide").remove();
        d3.select("#viz").select("#D3viz").select("#graphComponent").selectAll("path.link.hide").remove();
    },

    // Expand and collapse neighbours methods
    showNeighbours: function(node) {
        var links = d3.select("#viz").select("#D3viz").select("#graphComponent").selectAll("path.link");
        var nodes = d3.select("#viz").select("#D3viz").select("#graphComponent").selectAll("g.node");
        var nextNodes = [];

        links.each(function(link){
            if (link.source === node){
                metExploreD3.GraphRank.showElement(d3.select(this));
                nextNodes.push(link.target);
            }
        });
        nodes.each(function(thisNode){
            if (nextNodes.includes(thisNode)){
                metExploreD3.GraphRank.showElement(d3.select(this));
                if (thisNode.getBiologicalType() === "reaction"){
                    metExploreD3.GraphRank.showNeighbours(thisNode);
                }
            }
        });
    },

    showPredecessors: function(node) {
        var links = d3.select("#viz").select("#D3viz").select("#graphComponent").selectAll("path.link");
        var nodes = d3.select("#viz").select("#D3viz").select("#graphComponent").selectAll("g.node");
        var previousNodes = [];

        links.each(function(link){
            if (link.target === node){
                metExploreD3.GraphRank.showElement(d3.select(this));
                previousNodes.push(link.source);
            }
        });
        nodes.each(function(thisNode){
            if (previousNodes.includes(thisNode)){
                metExploreD3.GraphRank.showElement(d3.select(this));
                if (thisNode.getBiologicalType() === "reaction"){
                    metExploreD3.GraphRank.showPredecessors(thisNode);
                }
            }
        });
    },

    hideNeighbours: function(node) {
        var links = d3.select("#viz").select("#D3viz").select("#graphComponent").selectAll("path.link");
        var nodes = d3.select("#viz").select("#D3viz").select("#graphComponent").selectAll("g.node");
        var nextNodes = [];

        links.each(function(link){
            if (link.target === node || link.source === node){
                metExploreD3.GraphRank.hideElement(d3.select(this));
            }
        });
        nodes.each(function(thisNode){
            if (thisNode === node){
                metExploreD3.GraphRank.hideElement(d3.select(this));
            }
        });
    },

    // display on/off Function
    showElement: function(elmt) {
        elmt.style("display","block").classed("hide", false);
    },

    hideElement: function(elmt) {
        elmt.style("display", "none").classed("hide", true);
    }
};
