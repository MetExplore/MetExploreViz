/**
 * @author MC
 * (a)description : Drawing links
 */
metExploreD3.GraphLink = {

    link: "",
    visibleLinks: "",
    panelParent: "",

    /**********************************************/
    // INIT FUNCTIONS
    /**********************************************/
    delayedInitialisation: function (parent) {
        metExploreD3.GraphLink.panelParent = parent;
    },

    /**
     * Color links in function of pathways
     * @param parent : active panel
     */
    pathwaysOnLink: function (parent) {

        d3.select("#"+parent).select("#D3viz").select("#graphComponent").selectAll("path.link.reaction")
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
                            var pathw = _metExploreViz.getSessionById(parent).getD3Data().getPathwayByName(path);
                            if(pathw!==null){
                                var col = metExploreD3.GraphUtils.hexToRGB(pathw.getColor());
                                col["o"]=0.15;
                                cols.push(pathw);

                                if (color === "#000000") {
                                    color = col;
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
                                    .classed("hide", true)
                                    .style("stroke-width",linkStyle.getLineWidth()+2)
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
    },

    funcPath1: function (link, panel) {
        var source, target, path;

        function path(source, target) {
            return "M" + source.x + "," + source.y + "L" + target.x + "," + target.y + "Z";
        }

        source = link.getSource();
        target = link.getTarget();
        if (source.x != undefined && source.y != undefined && target.x != undefined && target.y != undefined) {
            path = path(source, target);
        }
        else {
            path = "M0,0L0,0Z";
        }

        return path;
    },

    /**
     * Default drawing of links
     * @param link
     * @param panel
     * @returns {function(*, *): string}
     */
    funcPath3: function (link, panel) {
        var source, target, path;

        function pathForReversibleReactions(source, target) {

            var d = Math.sqrt(Math.pow(target.x - source.x, 2) + Math.pow(target.y - source.y, 2));
            var dX = (target.x - source.x);
            var dY = (target.y - source.y);

            if (source.getBiologicalType() == "metabolite") {
                var rTW = (Math.abs(d) * target.getSvgWidth() / 2) / Math.abs(dX);
                var rTH = (Math.abs(d) * target.getSvgHeight() / 2) / Math.abs(dY);
                var largeurNoeudT = (rTW < rTH) ? rT = rTW : rt = rTH;
            }
            else {
                var rTW = (Math.abs(d) * source.getSvgWidth() / 2) / Math.abs(dX);
                var rTH = (Math.abs(d) * source.getSvgHeight() / 2) / Math.abs(dY);
                var largeurNoeudT = (rTW < rTH) ? rT = rTW : rt = rTH;
            }
            var heightArrow = 5;

            var xTarget = source.x + dX * ((d - largeurNoeudT) / d);
            var yTarget = source.y + dY * ((d - largeurNoeudT) / d);

            var heightArrow = 5;
            var xBaseArrowT = source.x + dX * ((d - largeurNoeudT - heightArrow) / d);
            var yBaseArrowT = source.y + dY * ((d - largeurNoeudT - heightArrow) / d);

            var xBaseArrowRev = source.x + dX * ((d - largeurNoeudT - heightArrow - heightArrow) / d);
            var yBaseArrowRev = source.y + dY * ((d - largeurNoeudT - heightArrow - heightArrow) / d);

            var xWBaseArrowT1 = xBaseArrowT + dY * (3 / d);
            var yWBaseArrowT1 = yBaseArrowT - dX * (3 / d);
            var xWBaseArrowT2 = xBaseArrowT - dY * (3 / d);
            var yWBaseArrowT2 = yBaseArrowT + dX * (3 / d);

            return "M" + source.x + "," + source.y +
                "L" + xBaseArrowRev + "," + yBaseArrowRev +
                "L" + xWBaseArrowT1 + "," + yWBaseArrowT1 +
                "L" + xWBaseArrowT2 + "," + yWBaseArrowT2 +
                "L" + xTarget + "," + yTarget +
                "L" + xWBaseArrowT1 + "," + yWBaseArrowT1 +
                "L" + xWBaseArrowT2 + "," + yWBaseArrowT2 +
                "L" + xBaseArrowRev + "," + yBaseArrowRev +
                "Z";
        }

        function path(source, target) {
            var d = Math.sqrt(Math.pow(target.x - source.x, 2) + Math.pow(target.y - source.y, 2));

            var dX = (target.x - source.x);
            var dY = (target.y - source.y);

            if (source.getBiologicalType() == "metabolite") {
                var rTW = (Math.abs(d) * target.getSvgWidth() / 2) / Math.abs(dX);
                var rTH = (Math.abs(d) * target.getSvgHeight() / 2) / Math.abs(dY);
                var largeurNoeudT = (rTW < rTH) ? rT = rTW : rt = rTH;
            }
            else {
                var rTW = (Math.abs(d) * source.getSvgWidth() / 2) / Math.abs(dX);
                var rTH = (Math.abs(d) * source.getSvgHeight() / 2) / Math.abs(dY);
                var largeurNoeudT = (rTW < rTH) ? rT = rTW : rt = rTH;
            }

            var xTarget = source.x + dX * ((d - largeurNoeudT) / d);
            var yTarget = source.y + dY * ((d - largeurNoeudT) / d);

            var heightArrow = 5;
            var xBaseArrowT = source.x + dX * ((d - largeurNoeudT - heightArrow) / d);
            var yBaseArrowT = source.y + dY * ((d - largeurNoeudT - heightArrow) / d);

            var xWBaseArrowT1 = xBaseArrowT + dY * (3 / d);
            var yWBaseArrowT1 = yBaseArrowT - dX * (3 / d);
            var xWBaseArrowT2 = xBaseArrowT - dY * (3 / d);
            var yWBaseArrowT2 = yBaseArrowT + dX * (3 / d);


            return "M" + source.x + "," + source.y +
                "L" + xBaseArrowT + "," + yBaseArrowT +
                "L" + xWBaseArrowT1 + "," + yWBaseArrowT1 +
                "L" + xTarget + "," + yTarget +
                "L" + xWBaseArrowT2 + "," + yWBaseArrowT2 +
                "L" + xBaseArrowT + "," + yBaseArrowT +
                "Z";
        }


        if (link.getSource().x == undefined) {
            var networkData = _metExploreViz.getSessionById(panel).getD3Data();
            var nodes = networkData.getNodes();

            source = nodes[link.getSource()];
            target = nodes[link.getTarget()];
            if (source != undefined && target != undefined) {
                if (source.x != undefined && source.y != undefined && target.x != undefined && target.y != undefined) {
                    var d = Math.sqrt(Math.pow(target.x - source.x, 2) + Math.pow(target.y - source.y, 2));
                    if(d!==0){
                        if (source.getReactionReversibility() || target.getReactionReversibility())
                            path = pathForReversibleReactions(source, target);
                        else
                            path = path(source, target);
                    }else {
                        path = "M0,0L0,0Z";
                    }
                }
                else {
                    path = "M0,0L0,0Z";
                }
            }
            else {
                path = "M0,0L0,0Z";
            }
        }
        else {
            source = link.getSource();
            target = link.getTarget();
            if (source != undefined && target != undefined) {
                if (source.x != undefined && source.y != undefined && target.x != undefined && target.y != undefined) {
                    var d = Math.sqrt(Math.pow(target.x - source.x, 2) + Math.pow(target.y - source.y, 2));
                    if(d!==0){
                        if (source.getReactionReversibility() || target.getReactionReversibility())
                            path = pathForReversibleReactions(source, target);
                        else
                            path = path(source, target);
                    }else {
                        path = "M0,0L0,0Z";
                    }
                }
                else {
                    path = "M0,0L0,0Z";
                }
            }
            else {
                path = "M0,0L0,0Z";
            }
        }

        return path;
    },

    /*******************************************
     * Init the visualization of links
     * @param {} parent : The panel where the action is launched
     * @param {} session : Store which contains global characteristics of session
     * @param {} linkStyle : Store which contains links style
     * @param {} linkStyle : Store which contains links style
     * @param {} metaboliteStyle : Store which contains metabolites style
     */
    refreshDataLink: function (parent, session) {
        metExploreD3.GraphLink.panelParent = "#" + parent;
        var networkData = session.getD3Data();

        d3.select("#" + parent).select("#D3viz").select("#graphComponent")
            .selectAll(".linkGroup")
            .remove();

        // function onlyUnique(value, index, self) {
        //     return self
        //         .findIndex(
        //             function(link){return link.getId()===value.getId();}
        //         ) === index;
        // }

        var links = networkData.getLinks();
        links.forEach(function(link){
            var target, source;
            target = link.getTarget();
            source = link.getSource();
            if(!(target instanceof NodeData)){
                link.setTarget(networkData.getNodes()[link.getTarget()]);
            }
            if(!(source instanceof NodeData))
                link.setSource(networkData.getNodes()[link.getSource()]);
        });

        // var link = networkData.getLinks();
        //var unique = link.filter( onlyUnique );

        //networkData.links=unique;
        metExploreD3.GraphLink.visibleLinks = networkData.getLinks()
            .filter(function (link) {
                var target, source;
                target = link.getTarget();
                source = link.getSource();

                return !source.isHidden() && !target.isHidden();
            });


        metExploreD3.GraphLink.link = d3.select("#" + parent).select("#D3viz").select("#graphComponent").selectAll("path.link.reaction")
            .data(metExploreD3.GraphLink.visibleLinks, function keyFunc(d, i) { return d.getId() });
    },

    /*******************************************
     * Init the visualization of links
     * @param {} parent : The panel where the action is launched
     * @param {} session : Store which contains global characteristics of session
     * @param {} linkStyle : Store which contains links style
     * @param {} linkStyle : Store which contains links style
     * @param {} metaboliteStyle : Store which contains metabolites style
     */
    refreshLink: function (parent, linkStyle) {

        var size = 20;
        // The y-axis coordinate of the reference point which is to be aligned exactly at the marker position.
        var refY = linkStyle.getMarkerWidth() / 2;

        metExploreD3.GraphLink.link.remove();

        metExploreD3.GraphLink.link.enter()
            .insert("svg:g", ":first-child")
            .attr("class", "linkGroup")
            .append("svg:path")
            .attr("class", String)
            .attr("d", function (link) {
                return metExploreD3.GraphLink.funcPath3(link, parent, this.id, 3);
            })
            .attr("class", "link").classed("reaction", true)
            .attr("fill-rule", "evenodd")
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


        if(metExploreD3.getGeneralStyle().isDisplayedPathwaysOnLinks())
            metExploreD3.GraphCaption.majCaptionPathwayOnLink();

    },

 /*******************************************
     * Init the visualization of links
     * @param {} parent : The panel where the action is launched
     * @param {} session : Store which contains global characteristics of session
     * @param {} linkStyle : Store which contains links style
     * @param {} linkStyle : Store which contains links style
     * @param {} metaboliteStyle : Store which contains metabolites style
     */
    refreshLinkActivity: function (parent, session, linkStyle) {
        metExploreD3.GraphLink.panelParent = "#" + parent;
        var networkData = session.getD3Data();

        d3.select("#" + parent).select("#D3viz").select("#graphComponent")
            .selectAll(".linkGroup")
            .remove();

        metExploreD3.GraphLink.link.remove();

        metExploreD3.GraphLink.link.enter()
            .insert("svg:g", ":first-child")
            .attr("class", "linkGroup")
            .append("svg:path")
            .attr("class", String)
            .attr("d", function (link) {
                return metExploreD3.GraphLink.funcPath3(link, parent, this.id, 3);
            })
            .attr("class", "link").classed("reaction", true)
            .attr("fill-rule", "evenodd")
            .attr("fill", function (d) {
                if (d.interaction == "out")
                    return linkStyle.getMarkerOutColor();
                else
                    return linkStyle.getMarkerInColor();
            })
            .style("stroke", linkStyle.getStrokeColor())
            .style("stroke-width", linkStyle.getLineWidth())
            .style("opacity", 1)
            .style("stroke-dasharray", null);


        if(metExploreD3.getGeneralStyle().isDisplayedPathwaysOnLinks())
            metExploreD3.GraphCaption.majCaptionPathwayOnLink();

    },

    /**
     * Change function used to drawing links to fluxes
     * @param parent
     * @param networkData
     * @param linkStyle
     * @param metaboliteStyle
     * @param showValues
     * @param conditionName
     */
    loadLinksForFlux: function (parent, networkData, linkStyle, metaboliteStyle, showValues, conditionName) {
        d3.select("#" + parent).select("#D3viz").select("#graphComponent").selectAll(".linkGroup").remove();
        _metExploreViz.getSessionById(parent).setMappingDataType("Flux");

        var divs = d3.select("#" + parent).select("#D3viz").select("#graphComponent").selectAll("path.link.reaction")
            .data(networkData.getLinks())
            .enter()
            .insert("svg:g", ":first-child")
            .attr("class", "linkGroup");

        divs.each(function (link) {
            d3.select(this)
                .append("svg:path")
                .attr("class", String)
                .attr("d", function (link) {
                    return metExploreD3.GraphLink.funcPathForFlux(link, parent, this.id);
                })
                .attr("class", "link").classed("reaction", true)
                .attr("fill-rule", "evenodd")
                .attr("id", "link")
                .style("stroke", linkStyle.getStrokeColor())
                .style("stroke-width", linkStyle.getLineWidth())

            d3.select(this)
                .append("svg:path")
                .attr("class", String)
                .attr("id", "linkRev")
                .attr("d", function (link) {
                    return metExploreD3.GraphLink.funcPathForFlux(link, parent, this.id);
                })
                .attr("class", "link").classed("reaction", true)
                .attr("fill-rule", "evenodd")
                .style("stroke", linkStyle.getStrokeColor())
                .style("stroke-width", linkStyle.getLineWidth());

        });

        metExploreD3.GraphNetwork.tick('viz');
    },

    /**
     * Display flux values on links
     * @param parent
     * @param conditionName
     * @param fluxType
     */
    showValue : function(parent, conditionName, fluxType){
        d3.select("#" + parent).select("#D3viz").select("#graphComponent").selectAll(".linkGroup")
            .append("svg:text")
            .text(function (d) {
                var reaction, metabolite, source, target;
                if (d.getSource().getBiologicalType() == "reaction") {
                    reaction = d.getSource();
                    metabolite = d.getTarget();
                }
                else {
                    reaction = d.getTarget();
                    metabolite = d.getSource();
                }

                source = d.getSource();
                target = d.getTarget();

                var mappingName = _metExploreViz.getSessionById("viz").getActiveMapping();
                var mapping = _metExploreViz.getMappingByName(mappingName);
                var conditions = mapping.getConditions().filter(function (c) { return c!=="PathwayCoverage" && c!=="PathwayEnrichment" });

                var map1 = reaction.getMappingDataByNameAndCond(mappingName, conditions[0]);
                var map2 = reaction.getMappingDataByNameAndCond(mappingName, conditions[1]);
                var map = map1;
                if (conditions[1] == conditionName | conditions[1] == conditionName[0])
                    map = map2;

                if (map == null)
                    var flux = 0;
                else {
                    if (isNaN(map.getMapValue()))
                        var flux = 0;
                    else
                        var flux = map.getMapValue();

                    if (flux < 0) {
                        target = d.getSource();
                        source = d.getTarget();
                    }
                }

                return flux;
            })
            .style("font-size", '6px')
            .attr("class", "linklabel")
            .attr("id", "link")
            .attr("transform", "translate(-10, -15)")
            .classed('hide', false)
            .style("paint-order", "stroke")
            .style("stroke-width", linkStyle.getLineWidth())
            .style("stroke", function () {
                return d3.select(this.parentNode).select("path#link").style('fill');
            })
            .style("stroke-opacity", "0.7")
            .attr("dy", ".4em")
            .style("font-weight", 'bold')
            .style("pointer-events", 'none')
            .filter(function (d) {
                var reaction, metabolite, source, target;
                if (d.getSource().getBiologicalType() == "reaction") {
                    metabolite = d.getTarget();
                }
                else {
                    metabolite = d.getSource();
                }

                return metabolite.getIsSideCompound();
            })
            .style("opacity", 0.1);

        if(fluxType=='Compare'){
            d3.select("#" + parent).select("#D3viz").select("#graphComponent").selectAll(".linkGroup")
                .append("svg:text")
                .text(function (d) {
                    var reaction, metabolite, source, target;
                    if (d.getSource().getBiologicalType() == "reaction") {
                        reaction = d.getSource();
                        metabolite = d.getTarget();
                    }
                    else {
                        reaction = d.getTarget();
                        metabolite = d.getSource();
                    }

                    source = d.getSource();
                    target = d.getTarget();

                    var mappingName = _metExploreViz.getSessionById("viz").getActiveMapping();
                    var mapping = _metExploreViz.getMappingByName(mappingName);
                    var conditions = mapping.getConditions().filter(function (c) { return c!=="PathwayCoverage" && c!=="PathwayEnrichment" });

                    var map1 = reaction.getMappingDataByNameAndCond(mappingName, conditions[0]);
                    var map2 = reaction.getMappingDataByNameAndCond(mappingName, conditions[1]);
                    var map = map2;
                    if (conditions[1] == conditionName | conditions[1] == conditionName[0])
                        map = map1;

                    if (map == null)
                        var flux = 0;
                    else {
                        if (isNaN(map.getMapValue()))
                            var flux = 0;
                        else
                            var flux = map.getMapValue();

                        if (flux < 0) {
                            target = d.getSource();
                            source = d.getTarget();
                        }
                    }


                    return flux;
                })
                .style("font-size", '6px')
                .attr("class", "linklabel")
                .attr("id", "linkRev")
                .attr("transform", "translate(-10, 0)")
                .classed('hide', false)
                .style("paint-order", "stroke")
                .style("stroke-width", linkStyle.getLineWidth())
                .style("stroke", function () {
                    return d3.select(this.parentNode).select("path#linkRev").style('fill');
                })
                .style("stroke-opacity", "0.7")
                .attr("dy", ".4em")
                .style("font-weight", 'bold')
                .style("pointer-events", 'none')
                .filter(function (d) {
                    var reaction, metabolite, source, target;
                    if (d.getSource().getBiologicalType() == "reaction") {
                        metabolite = d.getTarget();
                    }
                    else {
                        metabolite = d.getSource();
                    }

                    return metabolite.getIsSideCompound();
                })
                .style("opacity", 0.1);
        }
    },

    reloadLinks : function(panel, networkData, linkStyle){
        d3.select("#"+panel).select("#D3viz").select("#graphComponent").selectAll("path.link.reaction")
            .data(networkData.getLinks())
            .enter()
            .insert("path",":first-child")
            .attr("class", String)
            .attr("d", function(link){ return metExploreD3.GraphLink.funcPath3(link, parent, this.id, 3);})
            .attr("class", "link").classed("reaction", true)
            .attr("fill-rule", "evenodd")
            .attr("fill", function (d) {
                if (d.interaction=="out")
                    return linkStyle.getMarkerOutColor();
                else
                    return linkStyle.getMarkerInColor();
            })
            .style("stroke",linkStyle.getStrokeColor())
            .style("stroke-width",linkStyle.getLineWidth())
            .style("stroke-linejoin", "bevel");
    },

    /*******************************************
     * Tick function of links
     * @param {} panel : The panel where the action is launched
     * @param {} scale = Ext.getStore('S_Scale').getStoreByGraphName(panel);
     */
    tick : function(panel, scale) {
        // If you want to use selection on compartments path
        var convexHullPath = d3.select("#"+panel).select("#D3viz").selectAll("path.convexhull");

        convexHullPath
            .attr("d", _metExploreViz.getSessionById(panel).groupPath)
            .attr("transform", d3.select("#"+panel).select("#D3viz").select("#graphComponent").attr("transform"));


        if (metExploreD3.GraphStyleEdition.curvedPath === true){
            var flux = _metExploreViz.getSessionById(panel).getMappingDataType()==="Flux";
            if(flux) {
                funcPath = metExploreD3.GraphLink.funcPathForFlux;
                d3.select("#"+panel).select("#D3viz").select("#graphComponent")
                    .selectAll("path.link.reaction")
                    .attr("d", function(link){  return funcPath(link, panel, this.id);})
                    .style("stroke-linejoin", "bevel");
            }
            else {
                metExploreD3.GraphLink.bundleLinks(panel);
            }
        }
        else {
            var scale = metExploreD3.getScaleById("viz");

            var flux = _metExploreViz.getSessionById(panel).getMappingDataType()=="Flux";

            if(scale.getZoomScale()<0.4){
                funcPath = metExploreD3.GraphLink.funcPath1;
            }
            else
            {
                if(flux) {
                    funcPath = metExploreD3.GraphLink.funcPathForFlux;
                }
                else {
                    funcPath = metExploreD3.GraphLink.funcPath3;
                }
            }

            // If you want to use selection on compartments path
            /*d3.select("#"+metExploreD3.GraphNode.panelParent).select("#D3viz").selectAll("path.convexhull")
                .attr("d", metExploreD3.GraphNode.groupPath)
                .attr("transform", d3.select("#"+panel).select("#D3viz").select("#graphComponent").attr("transform"));*/

            d3.select("#"+panel).select("#D3viz").select("#graphComponent")
                .selectAll("path.link")
                .attr("d", function(link){
                    return funcPath(link, panel, this.id);
                });

            d3.select("#"+panel).select("#D3viz").select("#graphComponent")
                .selectAll("path.link.reaction")
                .attr("fill", function (d) {
                    if (d.interaction == "out")
                        return metExploreD3.getLinkStyle().getMarkerOutColor();
                    else
                        return metExploreD3.getLinkStyle().getMarkerInColor();
                })
                .style("stroke-linejoin", "bevel");
        }

        d3.select("#"+panel).select("#D3viz").select("#graphComponent")
            .selectAll("path.highlightlink")
            .attr("d", function(){
                var parent = this.parentNode;
                return d3.select(parent).select("path.link.reaction").attr("d");
            });
    },

    /**
     * Display convex hull on network
     * @param panel
     */
    displayConvexhulls : function(panel){

        var generalStyle = _metExploreViz.getGeneralStyle();

        var convexHullPath = d3.select("#"+panel).select("#D3viz").selectAll("path.convexhull");


        var isDisplay = generalStyle.isDisplayedConvexhulls();
        if(!isDisplay){
            convexHullPath.remove();
        }
        else
        {
            if(convexHullPath.size()===0)
                metExploreD3.GraphNode.loadPath(panel, isDisplay);

            convexHullPath
                .attr("d", _metExploreViz.getSessionById(panel).groupPath)
                .attr("transform", d3.select("#"+panel).select("#D3viz").select("#graphComponent").attr("transform"));
        }
    },

    majConvexhullsVisibility : function(panelLinked, type){
        d3.select("#" + panelLinked).select("#D3viz").selectAll("path.convexhull")
            .classed("hide", function (conv) {
                if (type == "Pathways"){
                    var com = metExploreD3.getPathwayByName(conv.key, panelLinked);
                    if(com.isCollapsed()) return true;
                }
                else
                    var com = metExploreD3.getCompartmentByName(conv.key);
                if(com)
                    return com.hidden();
                return false;
            });
    },


    /*******************************************
     * Draw links using Bezier curves and bundle together all links entering a reaction and all links exiting a reaction.
     * @param {String} panel : The panel in which to draw the links.
     */
    bundleLinks : function (panel) {
        if (panel !== "viz") {
            metExploreD3.GraphFunction.checkIfCycleInPanel(panel);
        }
        var reactionStyle = metExploreD3.getReactionStyle();
        var reactions = d3.select("#"+panel).select("#D3viz").select("#graphComponent")
            .selectAll("g.node")
            .filter(function(node){
                return node.getBiologicalType()=="reaction";
            });
        var links = d3.select("#"+panel).select("#D3viz").select("#graphComponent").selectAll("path.link");
        // Create arrowhead marker
        d3.select("#"+panel).select("#D3viz").select("#graphComponent").append("defs").append("marker")
            .attr("id", "markerExit")
            .attr("viewBox", "-10 -5 20 20")
            .attr("refX", 9).attr("refY", 6)
            .attr("markerUnits", "userSpaceOnUse")
            .attr("markerWidth", 15).attr("markerHeight", 10)
            .attr("orient", "auto-start-reverse")
            .attr("fill", "green").attr("stroke", "#000000")
            .append("path")
            .attr("d", "M0,6L-5,12L9,6L-5,0L0,6");
        d3.select("#"+panel).select("#D3viz").select("#graphComponent").append("defs").append("marker")
            .attr("id", "markerEntry")
            .attr("viewBox", "-10 -5 20 20")
            .attr("refX", 9).attr("refY", 6)
            .attr("markerUnits", "userSpaceOnUse")
            .attr("markerWidth", 15).attr("markerHeight", 10)
            .attr("orient", "auto-start-reverse")
            .attr("fill", "red").attr("stroke", "#000000")
            .append("path")
            .attr("d", "M0,6L-5,12L9,6L-5,0L0,6");

        reactions.each(function (node) {
            var enteringLinks = links.filter(function (link) {
                return node.id==link.getTarget();
            });
            var exitingLinks = links.filter(function (link) {
                return node.id==link.getSource();
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
                    var path = metExploreD3.GraphLink.computePathCycleArc(link.getTarget(), d3.select(this), link.getSource());
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
                    var path = metExploreD3.GraphLink.computePathCycleArc(link.getSource(), d3.select(this), link.getTarget());
                    d3.select(this).attr("d", path);
                    var exitingMidPoint = this.getPointAtLength(this.getTotalLength()/2);
                    centroidTargetX = exitingMidPoint.x;
                    centroidTargetY = exitingMidPoint.y;
                }
            });



            // For each node, compute the centroid of the source nodes of the arcs entering that node and the centroid of the target nodes of the arc exiting that node;
            if (isCycleReaction === false) {
                var resultComputeCentroid = metExploreD3.GraphLink.computeCentroid(node, enteringLinks, exitingLinks);
                centroidSourceX = resultComputeCentroid[0];
                centroidSourceY = resultComputeCentroid[1];
                centroidTargetX = resultComputeCentroid[2];
                centroidTargetY = resultComputeCentroid[3];
            }

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

            enteringLinks
                .each(function (link) {
                    var path;
                    // Handle the case where the link is a cycle arc or a sibling of cycle arc
                    if (link.partOfCycle === true){
                        path = d3.select(this).attr("d");
                    }
                    else if (isCycleReaction === true){
                        path = metExploreD3.GraphLink.computePathArcSibling(node, centroidSourceX, centroidSourceY, link.getSource(), enteringArcLink);
                    }
                    else if (enteringY == node.y){
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
                        .style("opacity", 1);
                })
                .filter(function (link) {
                    return link.getTarget().getReactionReversibility();
                })
                .attr("marker-end", "url(#markerEntry)")
                .filter(function (link) {
                    return exitingLinks.data().length === 0;
                })
                .attr("marker-start", "url(#markerExit)");

            exitingLinks
                .each(function (link) {
                    var path;
                    if (link.partOfCycle === true){
                        path = d3.select(this).attr("d");
                    }
                    else if (isCycleReaction === true){
                        path = metExploreD3.GraphLink.computePathArcSibling(node, centroidTargetX, centroidTargetY, link.getTarget(), exitingArcLink);
                    }
                    else if (exitingY == node.y){
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
                        .style("opacity", 1);
                })
                .attr("marker-end", "url(#markerExit)")
                .filter(function (link) {
                    return link.getSource().getReactionReversibility() && enteringLinks.data().length === 0;
                })
                .attr("marker-start", "url(#markerEntry)");
        });
        metExploreD3.GraphCaption.drawCaptionEditMode();

        var pathways = [];

        d3.select("#"+panel).select("#D3viz").select("#graphComponent")
            .selectAll("g.node")
            .filter(function(node){
                return node.getBiologicalType()==="pathway";
            })
            .each(function (path) {
                pathways.push(path.getId())
            });

        links = d3.select("#"+panel).select("#D3viz").select("#graphComponent").selectAll("path.link");

        var pathwayLinks = links.filter(function (link) {
            return pathways.includes(link.getTarget().getId()) || pathways.includes(link.getSource().getId())
        });

        if(pathwayLinks!=null){
            pathwayLinks
                .attr("fill", function (d) {
                    if (d.interaction == "out")
                        return metExploreD3.getLinkStyle().getMarkerOutColor();
                    else
                        return metExploreD3.getLinkStyle().getMarkerInColor();
                })
                .attr("d", function(link){ return metExploreD3.GraphLink.funcPath3(link, panel, this.id);})
                .style("stroke-linejoin", "bevel")
                .style("opacity", 0.2);
        }

    },

    /*******************************************
     * Compute path of an edge belonging to a cycle.
     * @param {Object} startNode : The node at the start of the path.
     * @param {} link : The link between the two nodes.
     * @param {Object} endNode : The node at the end of the path.
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
     * Compute path of an edge so that the axe of the reaction is horizontal.
     * @param {Object} startNode : The node at the start of the path.
     * @param {Number} firstPointX : The x coordinate of the point where the edge will merge with other edges which are also substrate or product of the reaction.
     * @param {Number} firstPointY : The y coordinate of the point where the edge will merge with other edges which are also substrate or product of the reaction.
     * @param {Object} endNode : The node at the end of the path
     */
    computePathHorizontal : function (startNode, firstPointX, firstPointY, endNode) {
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
     * Compute path of an edge so that the axe of the reaction is vertical.
     * @param {Object} startNode : The node at the start of the path.
     * @param {Number} firstPointX : The x coordinate of the point where the edge will merge with other edges which are also substrate or product of the reaction.
     * @param {Number} firstPointY : The y coordinate of the point where the edge will merge with other edges which are also substrate or product of the reaction.
     * @param {Object} endNode : The node at the end of the path.
     */
    computePathVertical : function (startNode, firstPointX, firstPointY, endNode) {
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

    /*******************************************
     * Compute path of an edge that is not itself part of a cycle but merge with one that is part of a cycle.
     * @param {Object} startNode : The node at the start of the path.
     * @param {Number} firstPointX : The x coordinate of the point where the edge will merge with other edges which are also substrate or product of the reaction.
     * @param {Number} firstPointY : The y coordinate of the point where the edge will merge with other edges which are also substrate or product of the reaction.
     * @param {Object} endNode : The node at the end of the path.
     * @param {} arcLink : The link that is part of cycle.
     */
    computePathArcSibling: function (startNode, firstPointX, firstPointY, endNode, arcLink) {
        var path = "";

        // Determine if the arc should be drawn clockwise or counter-clockwise
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

    /*******************************************
     * For a reaction node, compute the coordinates of the centroid of all the substrate of that node and the coordinates of the centroid of all the product of that node.
     * @param {Object} node : The reaction node.
     * @param {} enteringLinks : All the links going from a substrate to the node.
     * @param {} exitingLinks : All the links going from the node to a product.
     */
    computeCentroid : function (node, enteringLinks, exitingLinks) {
        var links = d3.select("#viz").select("#D3viz").select("#graphComponent").selectAll("path.link.reaction");

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

    removeReactionLinks: function (node, enteringLinks, exitingLinks) {
        d3.selectAll("path.link.reaction").remove();
    }
};