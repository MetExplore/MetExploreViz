
/**
 * @author MC
 * (a)description : Tu manage the metabolic network
 */


metExploreD3.GraphNetwork = {

    task:"",
    brushing:false,
    brushEvnt:undefined,
    taskZoom: "",
    first: true,
    /*******************************************
     * Initialization of variables
     * @param {string} panel : The panel where are the node
     */
    delayedInitialisation : function(panel) {

        var that = {};

        that.render = function() {
            var vis = d3.select('#'+panel);
            vis
                .append("svg")
                .attr("width", "100%")
                .attr("height", "100%")
                .attr("class", "D3viz")
                .attr("id", "D3viz")
                .style("background-color", "#fff");
        };
        that.render();
        metExploreD3.GraphLink.delayedInitialisation(panel);

        metExploreD3.GraphNode.delayedInitialisation(panel);
        return that;
    },

    /*******************************************
     * Refresh the graph interface & resize it if it's big at the beginnning
     * @param {string} panel : The panel to refresh
     */
    tick : function(panel){
        if((_metExploreViz.getComparedPanelById(panel)!==null || panel==="viz") && _metExploreViz.getSessionById(panel).getForce()){
            var alpha = _metExploreViz.getSessionById(panel).getForce().alpha();

            var scale = metExploreD3.getScaleById(panel);

            metExploreD3.GraphLink.tick(panel, scale);
            metExploreD3.GraphNode.tick(panel);

            var  previousScale = scale.getZoomScale();

            var anim=metExploreD3.GraphNetwork.isAnimated(panel);

            // Resize it if it's big at the beginnning
            var session = _metExploreViz.getSessionById(panel);
            var generalStyle = metExploreD3.getGeneralStyle();
            // Control if the user can see all the graph
            if (anim && previousScale>0.05 && session.isResizable()) {

                var vizRect = document.getElementById(panel).getBoundingClientRect();
                var graphComponent = d3.select("#"+panel).select("#D3viz").select('#graphComponent');
                var graphComponentRect = d3.select("#"+panel).select("#D3viz").node().getElementById('graphComponent').getBoundingClientRect();

                var width = parseInt(metExploreD3.GraphPanel.getHeight(panel));
                var height = parseInt(metExploreD3.GraphPanel.getWidth(panel));

                if(vizRect.top>graphComponentRect.top
                    || vizRect.left>graphComponentRect.left
                    || vizRect.bottom<graphComponentRect.bottom
                    || vizRect.right<graphComponentRect.right)
                {
                    var dataLength =session.getD3Data().getNodesLength();
                    var delay = 3000;
                    if (dataLength < generalStyle.getReactionThreshold() || !generalStyle.isDisplayedLabelsForOpt())
                        delay = 3000;

                    metExploreD3.fixDelay(metExploreD3.GraphNetwork.task, delay);

                    var zoomListener = scale.getZoom();

                    var updateScale = 0.01*dataLength/100;
                    var newScale = previousScale-(previousScale*updateScale);
                    zoomListener.scaleBy(d3.select("#"+panel).select("#D3viz"), newScale);

                    var newWidth = newScale*width;
                    var newHeight = newScale*height;
                    var xScale = (width-newWidth)/2;
                    var yScale = (height-newHeight)/2;
                    zoomListener.translateBy(d3.select("#"+panel).select("#D3viz"), xScale, yScale);

                    scale.setZoomScale(newScale);

                }
                else
                {
                    if(!((vizRect.top+height/10>graphComponentRect.top && vizRect.bottom-height/10<graphComponentRect.bottom)
                                        || (vizRect.left+width/10>graphComponentRect.left && vizRect.right-width/10<graphComponentRect.right))){
                        var dataLength =session.getD3Data().getNodesLength();
                        var delay = 3000;
                        if (dataLength < generalStyle.getReactionThreshold() || !generalStyle.isDisplayedLabelsForOpt())
                            delay = 3000;

                        metExploreD3.fixDelay(metExploreD3.GraphNetwork.task, delay);

                        var zoomListener = scale.getZoom();

                        if(updateScale==undefined) updateScale = 0.01;
                        else updateScale = updateScale/2;

                        var newScale = previousScale+(previousScale*updateScale);
                        zoomListener.scaleBy(d3.select("#"+panel).select("#D3viz"), newScale);

                        var newWidth = newScale*width;
                        var newHeight = newScale*height;
                        var xScale = (width-newWidth)/2;
                        var yScale = (height-newHeight)/2;

                        zoomListener.translateBy(d3.select("#"+panel).select("#D3viz"), xScale,yScale);

                        scale.setZoomScale(newScale);

                    }
                }
            }
        }
	},

    /*******************************************
     * Zoom on the main panel and on link graph
     * @param {string} panel : The panel to refresh
     */
    zoom:function(panel) {
        var d3EventScale = d3.event.transform.k;
        var transX = d3.event.transform.x;
        var transY = d3.event.transform.y;
        var d3EventSourceEvent = d3.event.sourceEvent;
// console.log(d3EventScale);
// console.log(transX);
// console.log(transY);
// console.log(d3EventSourceEvent);

        metExploreD3.applyTolinkedNetwork(
            panel,
            function(panelLinked, sessionLinked) {
                var scale = metExploreD3.getScaleById(panelLinked);
                var session = _metExploreViz.getSessionById(panelLinked);
                // if(d3EventScale<0.3) d3.select("#"+panelLinked).select("#D3viz").select("#graphComponent").selectAll('text').classed("hide", true);
                // else d3.select("#"+panelLinked).select("#D3viz").select("#graphComponent").selectAll('text').classed("hide", false);


                if(d3EventSourceEvent !==null)
                    if(d3EventSourceEvent.type==='wheel')
                        session.setResizable(false);

                // if visualisation is actived we add item to menu
                if(session.isActive()){
                    if(sessionLinked.getD3Data().getNodes().length>1000){
                        d3.select("#"+panelLinked).selectAll("path.link").remove();
                        if(metExploreD3.GraphNetwork.taskZoom)
                            metExploreD3.stopTask(metExploreD3.GraphNetwork.taskZoom);

                        metExploreD3.GraphNetwork.taskZoom = metExploreD3.createDelayedTask(
                            function () {
                                var alpha = _metExploreViz.getSessionById(panelLinked).getForce().alpha();

                                // if(alpha!==undefined){
                                //     if(alpha<0.06){
                                        var linkStyle = metExploreD3.getLinkStyle();
                                        metExploreD3.GraphLink.refreshLinkZoom(panelLinked, _metExploreViz.getSessionById(panel), linkStyle);
                                //     }
                                // }
                            }
                        );

                        metExploreD3.fixDelay(metExploreD3.GraphNetwork.taskZoom, 2000);
                    }

                    var viz = d3.select("#"+panelLinked).select("#D3viz");

                    viz.select("#graphComponent").attr("transform", "translate("+transX+","+transY+")scale(" + d3EventScale + ")");

                    // Firstly we changed the store which correspond to viz panel
                    scale.setZoomScale(d3EventScale);


                    metExploreD3.GraphLink.tick(panelLinked, scale);
                }

            });
    },

    /*******************************************
     * Zoom on the main panel and on link graph with button
     */
    zoomIn:function() {
        _MyThisGraphNode.dblClickable=false;
        var panel = this.parentNode.parentNode.id;
        var scale = metExploreD3.getScaleById(panel);

        var zoomListener = scale.getZoom();
        zoomListener.scaleBy(d3.select("#"+panel).select("#D3viz"), 1.1);

        // Firstly we changed the store which correspond to viz panel
        scale.setZoomScale(scale.getZoomScale()*1.1);
    },

    /*******************************************
     * Zoom out the main panel and on link graph with button
     * @param {} panel : The panel to refresh
     */
    zoomOut:function() {
        _MyThisGraphNode.dblClickable=false;
        var panel = this.parentNode.parentNode.id;
        var scale = metExploreD3.getScaleById(panel);

        var zoomListener = scale.getZoom();
        zoomListener.scaleBy(d3.select("#"+panel).select("#D3viz"), 0.9);

        // Firstly we changed the store which correspond to viz panel
        scale.setZoomScale(scale.getZoomScale()*0.9);
    },

    /*******************************************
     * Put animation button on
     * @param {} panel : The panel where the button must be on
     */
    animationButtonOn:function(panel) {
        d3.select("#"+panel).select("#buttonAnim").select("image").remove();

        d3.select("#"+panel).select("#buttonAnim").append("image").attr(
            "xlink:href",
            document.location.href.split("index.html")[0] + "resources/icons/pause.svg").attr(
            "width", "50").attr("height", "50")
            .attr("transform",
                "translate(10,10) scale(.5)");

        metExploreD3.GraphNetwork.setAnimated(panel, true);
    },

    /*******************************************
     * Put animation button off
     * @param {} panel : The panel where the button must be off
     */
    animationButtonOff:function(panel) {
        d3.select("#"+panel).select("#buttonAnim").select("image").remove();

        d3.select("#"+panel).select("#buttonAnim").append("image").attr(
            "xlink:href",
            document.location.href.split("index.html")[0] + "resources/icons/play.svg").attr(
            "width", "50").attr("height", "50")
            .attr("transform",
                "translate(10,10) scale(.5)");

        metExploreD3.GraphNetwork.setAnimated(panel, false);
    },

    /*******************************************
     * Start or stop the animation
     */
    play:function(d) {
        var sessions = _metExploreViz.getSessionsSet();
        var panel = this.parentNode.parentNode.id;

        var session = _metExploreViz.getSessionById(panel);
        if(session!=undefined)
        {
            var anim = metExploreD3.GraphNetwork.isAnimated(panel);;
            if (anim == "false") {
                if(session.isLinked())
                {
                    for (var key in sessions) {
                        if(sessions[key].isLinked()){
                            metExploreD3.GraphNetwork.animationButtonOn(sessions[key].getId());
                        }
                    }

                    var force = _metExploreViz.getSessionById("viz").getForce();
                    force.restart();
                }
                else
                {
                    metExploreD3.GraphNetwork.animationButtonOn(panel);
                    var force = session.getForce();
                    force.restart();

                }
            } else {
                if(session.isLinked())
                {
                    for (var key in sessions) {
                        if(sessions[key].isLinked()){
                            metExploreD3.GraphNetwork.animationButtonOff(sessions[key].getId());
                        }
                    }
                    var force = _metExploreViz.getSessionById("viz").getForce();
                    force.stop();
                }
                else
                {
                    metExploreD3.GraphNetwork.animationButtonOff(panel);
                    var force = session.getForce();
                    force.stop();


                }
            }
        }
    },

    /*******************************************
     * Link or unlink the main graph and the selected graph
     */
    setLink:function(d) {
        that = this;
        var panel = this.parentNode.parentNode.id;
        var session = _metExploreViz.getSessionById(panel);
        var mainSession = _metExploreViz.getSessionById('viz');
        if(session!=undefined)
        {
            var linked = d3.select(this).attr("isLink");
            d3.select(this).select("image").remove();
            if (linked == "false") {
                metExploreD3.GraphNetwork.link(panel);
            } else {
                metExploreD3.GraphNetwork.unLink(panel);
            }
        }
    },

    /*******************************************
     * Link the main graph and the selected graph
     * @param {} panel : The panel to link
     */
    link :function(panel){
        var session = _metExploreViz.getSessionById(panel);
        var mainSession = _metExploreViz.getSessionById('viz');
        var anim = metExploreD3.GraphNetwork.isAnimated("viz");
        metExploreD3.GraphStyleEdition.applyLabelStyle(panel);

        d3.select("#"+panel).select("#D3viz").select("#buttonLink").attr("isLink", "true");
        session.setLinked(true);
        mainSession.setLinked(true);

        if (anim == "true")
            metExploreD3.GraphNetwork.animationButtonOn(panel);
        else
            metExploreD3.GraphNetwork.animationButtonOff(panel);

        d3.select("#"+panel).select("#D3viz").select("#buttonLink").select("image").remove();
        d3.select("#"+panel).select("#D3viz").select("#buttonLink").append("image")
            .attr("xlink:href",document.location.href.split("index.html")[0] + "resources/icons/link.svg")
            .attr("width", "50")
            .attr("height", "50")
            .attr("transform","translate(10,50) scale(.5)");

        if(session!=undefined)
        {
            if(mainSession.getDuplicatedNodesCount()>0){

                var allNodes = d3.select("#"+panel).select("#D3viz").select("#graphComponent").selectAll("g.node")
                    .filter(function(d) {
                        return d.getBiologicalType()=='metabolite';
                    });

                mainSession.getDuplicatedNodes().forEach(function(id){
                    allNodes
                        .filter(function(d) {
                            return d.getId()==id;
                        })
                        .each(function(d){ d.setIsSideCompound(true);});
                });
                metExploreD3.GraphNetwork.duplicateSideCompoundsById(mainSession.getDuplicatedNodes(), panel);

                metExploreD3.GraphNetwork.looksLinked();
                if(session.isLinked()){
                    metExploreD3.GraphNetwork.graphAlignment(panel, "viz");
                }
            }
            else
            {
                metExploreD3.GraphNetwork.graphAlignment(panel, "viz");
            }
        }
        metExploreD3.GraphNetwork.initCentroids(panel);
    },

    /*******************************************
     * Unlink the main graph and the selected graph
     * @param {} panel : The panel to unlink
     */
    unLink :function(panel){
        var session = _metExploreViz.getSessionById(panel);

        d3.select("#"+panel).select("#D3viz").select("#buttonLink").append("image")
            .attr("xlink:href", document.location.href.split("index.html")[0] + "resources/icons/unlink.svg")
            .attr("width", "50")
            .attr("height", "50")
            .attr("transform", "translate(10,50) scale(.5)");

        d3.select("#"+panel).select("#D3viz").select("#buttonLink").attr("isLink", "false");
        session.setLinked(false);
        metExploreD3.GraphNetwork.looksLinked();

        var anim = metExploreD3.GraphNetwork.isAnimated(panel);
        if (anim == "true"){
            var force = session.getForce();
            force.restart();
        }
    },

    /*******************************************
     * True if at least one network is linked with the main network
     */
    looksLinked : function(){
        var sessions = _metExploreViz.getSessionsSet();
        var mainSession = _metExploreViz.getSessionById('viz');
        mainSession.setLinked(false);

        for (var key in sessions) {
            if(sessions[key].isLinked())
                mainSession.setLinked(true);
        }
    },

    /*******************************************
     * Refresh the graph data, it generate graph visualization
     * @param {} panel : The panel to refresh
     */
    defineBrush: function(panel) {

        // Brush listener to multiple selection
        var nodeBrushed;
        metExploreD3.GraphNetwork.brushing = false;

        metExploreD3.GraphNetwork.brushEvnt = d3.brush()
            .on("start", function(d) {
                document.addEventListener("mousedown", function(e) {
                    if (e.button === 1 || e.button === 2 ) {
                        e.stopPropagation();
                        e.preventDefault();
                        e.stopImmediatePropagation();
                    }
                });

                var scrollable = d3.select("#"+panel).select("#buttonHand").attr("scrollable");

                metExploreD3.GraphPanel.setActivePanel(this.parentNode.parentNode.id);

                var session = _metExploreViz.getSessionById(_MyThisGraphNode.activePanel);
                console.log(scrollable);
                if(d3.event.sourceEvent.button!==1 && scrollable!=="true"){
                    console.log("d3.event.sourceEvent.button ", d3.event.sourceEvent.button);

                    if(d3.event.sourceEvent.button!==2) {
                        if (session !== undefined) {
                            // We stop the previous animation
                            if (session.isLinked()) {
                                var sessionMain = _metExploreViz.getSessionById('viz');
                                if (sessionMain !== undefined) {
                                    var forceMain = sessionMain.getForce();
                                    if (forceMain !== undefined) {
                                        forceMain.stop();
                                    }
                                }
                            }
                            else {

                                var force = session.getForce();
                                if (force != undefined) {
                                    force.stop();

                                }
                            }
                        }

                        metExploreD3.GraphNetwork.brushing = true;
                        d3.select("#" + panel).select("#brush").classed("hide", false);
                        d3.select("#" + panel).select("#D3viz").on("mousedown.zoom", null);
                        nodeBrushed = d3.select("#" + panel).select("#graphComponent").selectAll("g.node");
                        nodeBrushed.each(function (d) {
                                d.previouslySelected = d.isSelected();
                            }
                        );
                    }
                    else
                    {
                        d3.selectAll("#brush").classed("hide", true);
                    }
                }
                else
                {

                    console.log("d3.event.sourceEvent.button ", d3.event.sourceEvent.button);
                    console.log("scrollable ", scrollable);
                    var force = session.getForce();
                    if(force!=undefined)
                    {
                        force.stop();
                    }

                    d3.select("#"+panel).selectAll("#D3viz").style("cursor", "all-scroll");
                    d3.selectAll("#brush").classed("hide", true);
                }
            })
            .on("end", function() {
                if(d3.event.sourceEvent.button!==2 && d3.event.sourceEvent.button!==1 && metExploreD3.GraphNetwork.brushing){
                    if (!d3.event.selection) return;
                    var extent = d3.event.selection;

                    if(extent[1][0]-extent[0][0]>20 || extent[1][1]-extent[0][1]>20){

                        var iSselected;
                        var scale = metExploreD3.getScaleById(panel);

                        var transform = d3.zoomTransform(d3.select("#viz").select("#D3viz").node());

                        var myMask = metExploreD3.createLoadMask("Selection in progress...", panel);
                        if(myMask!== undefined){

                            metExploreD3.showMask(myMask);

                            metExploreD3.deferFunction(function() {
                                nodeBrushed
                                    .classed("selected", function(d) {

                                        iSselected = (transform.invertX(extent[0][0]) <= d.x && d.x < transform.invertX(extent[1][0]))
                                            && (transform.invertY(extent[0][1]) <= d.y && d.y < transform.invertY(extent[1][1]));
                                        if((!d.isSelected() && iSselected)||(d.isSelected() && !iSselected && !d.previouslySelected))
                                        {
                                            _MyThisGraphNode.selection(d, panel);
                                        }
                                        return iSselected;
                                    });
                                metExploreD3.hideMask(myMask);
                                var session = _metExploreViz.getSessionById(_MyThisGraphNode.activePanel);
                                if(session!==undefined)
                                {
                                    // We stop the previous animation
                                    if(session.isLinked()){
                                        var sessionMain = _metExploreViz.getSessionById('viz');
                                        if(sessionMain!==undefined)
                                        {
                                            var animLinked=metExploreD3.GraphNetwork.isAnimated(sessionMain.getId());
                                            if (animLinked==='true') {
                                                var force = sessionMain.getForce();
                                                if(force!==undefined)
                                                {
                                                    if((metExploreD3.GraphNetwork.isAnimated(sessionMain.getId()) === 'true')
                                                        || (metExploreD3.GraphNetwork.isAnimated(sessionMain.getId()) === null)) {
                                                        force.restart();
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    else
                                    {

                                        var force = session.getForce();
                                        var animLinked=metExploreD3.GraphNetwork.isAnimated(session.getId())
                                        if (animLinked==='true') {
                                            var force = session.getForce();
                                            if(force!==undefined)
                                            {
                                                if((metExploreD3.GraphNetwork.isAnimated(session.getId()) === 'true') || (metExploreD3.GraphNetwork.isAnimated(session.getId()) === null)) {
                                                    force.restart();
                                                }
                                            }
                                        }
                                    }
                                }
                                metExploreD3.GraphNetwork.brushing = false;
                            }, 100);
                        }
                    }
                }
                else
                {
                    var session = _metExploreViz.getSessionById(_MyThisGraphNode.activePanel);
                    if(session!==undefined)
                    {
                        // We stop the previous animation
                        if(session.isLinked()){
                            var sessionMain = _metExploreViz.getSessionById('viz');
                            if(sessionMain!==undefined)
                            {
                                var animLinked=metExploreD3.GraphNetwork.isAnimated(sessionMain.getId())
                                if (animLinked==='true') {
                                    var force = sessionMain.getForce();
                                    if(force!==undefined)
                                    {
                                        if((metExploreD3.GraphNetwork.isAnimated(sessionMain.getId()) === 'true')
                                            || (metExploreD3.GraphNetwork.isAnimated(sessionMain.getId()) === null)) {
                                            force.restart();
                                        }
                                    }
                                }
                            }
                        }
                        else
                        {

                            var animLinked=metExploreD3.GraphNetwork.isAnimated(session.getId());

                            if (animLinked==='true') {
                                var force = session.getForce();
                                if(force!==undefined)
                                {
                                    if(d3.select(metExploreD3.GraphNetwork.isAnimated(session.getId()) === 'true')
                                        || (metExploreD3.GraphNetwork.isAnimated(session.getId()) === null)) {
                                        force.restart();
                                    }
                                }
                            }
                        }
                    }
                }

                d3.select(this).call(metExploreD3.GraphNetwork.brushEvnt.move, null);
                // d3.event.target.clear();
                // d3.select(this).call(d3.event.target);
                var scale = metExploreD3.getScaleById(panel);

                d3.select("#"+panel).selectAll("#D3viz")
                    .style("cursor", "default");

                d3.select("#"+panel).selectAll("#D3viz")
                    .call(scale.getZoom())
                    .on("dblclick.zoom", null)
                    .on("mousedown", null);

                d3.selectAll("#brush").classed("hide", false);
            });

        d3.select("#"+panel).select("#D3viz")
            .select("#brush").remove();

        d3.select("#"+panel).select("#D3viz")
            .append("g")
            .datum(function() { return {selected: false, previouslySelected: false}; })
            .attr('id','brush')
            .attr("class", "brush")
            .call(metExploreD3.GraphNetwork.brushEvnt);

        var brush = d3.select("#"+panel).select("#D3viz")
            .select("#brush").node();

        var viz = d3.select("#"+panel).select("#D3viz").node();
        if(viz.firstChild){
            viz.insertBefore(brush, viz.firstChild);
        }

    },

    initShortCut: function () {
        d3.select("body")
            .on("keydown", function () {
                _MyThisGraphNode.charKey = d3.event.keyCode;
                _MyThisGraphNode.ctrlKey = d3.event.ctrlKey;
                _MyThisGraphNode.altKey = d3.event.altKey;
                var activesession = _metExploreViz.getSessionById(_MyThisGraphNode.activePanel);

                //H	72
                if (_MyThisGraphNode.charKey == 72 && !_MyThisGraphNode.altKey && activesession.getSelectedNodes().length > 0) {
                    metExploreD3.GraphFunction.horizontalAlign(_MyThisGraphNode.activePanel);
                }

                if (_MyThisGraphNode.charKey == 72 && _MyThisGraphNode.altKey && activesession.getSelectedNodes().length > 0) {
                    metExploreD3.GraphFunction.horizontalReverse(_MyThisGraphNode.activePanel);
                }

                //V 86
                if (_MyThisGraphNode.charKey == 86 && !_MyThisGraphNode.altKey && activesession.getSelectedNodes().length > 0) {
                    metExploreD3.GraphFunction.verticalAlign(_MyThisGraphNode.activePanel);
                }

                if (_MyThisGraphNode.charKey == 86 && _MyThisGraphNode.altKey && activesession.getSelectedNodes().length > 0) {
                    metExploreD3.GraphFunction.verticalReverse(_MyThisGraphNode.activePanel);
                }


                // 65=A
                if (_MyThisGraphNode.charKey == 65 && _MyThisGraphNode.ctrlKey) {
                    d3.select("#" + _MyThisGraphNode.activePanel).select("#D3viz").select("#graphComponent").selectAll("g.node")
                        .each(function (node) {
                            if (!node.isSelected()) {
                                _MyThisGraphNode.selection(node, _MyThisGraphNode.activePanel);
                            }
                        });
                }
            })
            .on("keyup", function (e) {
                // 46=Suppr
                var activesession = _metExploreViz.getSessionById(_MyThisGraphNode.activePanel);
                if (_MyThisGraphNode.charKey == 46 && activesession.getSelectedNodes().length > 0) {
                    metExploreD3.displayMessageYesNo("Selected nodes", 'Do you want remove selected nodes?', function (btn) {
                        if (btn == "yes") {
                            metExploreD3.GraphNetwork.removeSelectedNode(_MyThisGraphNode.activePanel)
                        }
                    });
                }

                _MyThisGraphNode.charKey = 'none';
                _MyThisGraphNode.ctrlKey = d3.event.ctrlKey;
            });
    },


    /*******************************************
     * Refresh the graph data, it generate graph visualization
     * @param {} panel : The panel to refresh
     */
    refreshSvg : function(panel) {
        var startall = new Date().getTime();
        console.log("Refresh SVG");

        document.addEventListener("keydown", function (e) {
            // 83=S
            if (e.keyCode == 83 && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)) {
                e.preventDefault();
                metExploreD3.GraphUtils.saveNetworkJSON();
            }
        }, false);

        metExploreD3.GraphNetwork.initShortCut();


        var networkData = _metExploreViz.getSessionById(panel).getD3Data();
        var nodes = networkData.getNodes();

        metExploreD3.GraphPanel.setActivePanel(panel);
        metExploreD3.fireEventParentWebSite("refreshCart", nodes);

        var optArray = [];
        for (var i = 0; i < nodes.length - 1; i++) {
            optArray.push(nodes[i].name);
        }
        optArray = optArray.sort();

        // Get height and witdh of panel
        var h = parseInt(metExploreD3.GraphPanel.getHeight(panel));
        var w = parseInt(metExploreD3.GraphPanel.getWidth(panel));
        var linkStyle = metExploreD3.getLinkStyle();
        var generalStyle = metExploreD3.getGeneralStyle();
        var metaboliteStyle = metExploreD3.getMetaboliteStyle();
        var reactionStyle = metExploreD3.getReactionStyle();

        var maxDimRea = Math.max(reactionStyle.getWidth(),reactionStyle.getHeight());
        var maxDimMet = Math.max(metaboliteStyle.getWidth(),metaboliteStyle.getHeight());
        var maxDim = Math.max(maxDimRea, maxDimMet);

        var session = _metExploreViz.getSessionById(panel);

        session.setActivity(true);

        // var startall = new Date().getTime();
        // var start = new Date().getTime();
        // console.log("----Viz: START refresh/init Viz");

        // Call GraphCaption to draw the caption
        if(panel=='viz')
            metExploreD3.GraphCaption.drawCaption();


        metExploreD3.GraphCaption.colorPathwayLegend();

        metExploreD3.GraphCaption.colorMetaboliteLegend();

        metExploreD3.GraphCaption.majCaption(panel);

        if(session.getScale()==undefined){

            // Define the zoomListener which calls the zoom function on the "zoom" event constrained within the scaleSents
            var that = metExploreD3.GraphNetwork;
            metExploreD3.GraphNetwork.zoomListener = d3.zoom()
                .scaleExtent([ 0.01, 30 ])
                .extent([[0,0], [w, h]])
                .translateExtent([[-w*2, -h*2], [w*2, h*2]])
                .on("zoom", function(e){
                    that.zoom(panel);
                });


            var scale = new Scale(panel);
            scale.setScale(1, 1, metExploreD3.GraphNetwork.zoomListener);

            metExploreD3.setScale(scale, panel);

        }
        else
        {
            var that = metExploreD3.GraphNetwork;

            metExploreD3.GraphNetwork.zoomListener = d3.zoom()
                .scaleExtent([ 0.01, 30 ])
                .extent([[0,0], [w, h]])
                .translateExtent([[-w*2, -h*2], [w*2, h*2]])
                //Ca éviterait de sortir de l'écran  .translateExtent
                .on("zoom", function(e){
                    that.zoom(this.parentNode.id);
                });

            var scale = new Scale(panel);
            scale.setScale(1, 1, metExploreD3.GraphNetwork.zoomListener);

            metExploreD3.setScale(scale, panel);
        }


        endall = new Date().getTime();
        timeall = endall - startall;
        console.log("----Launch force : FINISH refresh/ all "+timeall);

        // Remove all sub-elements in the SVG that corresponds to the D3Viz part --- tenth mss
        var vis = d3.select("#"+panel);
        vis.svg = vis.select("#D3viz").selectAll("*").remove();

        // Create function to manage double click
        d3.selectAll("#D3viz")
            .on("mouseup", metExploreD3.GraphNode.unselectIfDBClick);

        _metExploreViz.setLinkedByTypeOfMetabolite(false);

        // Brush listener to multiple selection
        metExploreD3.GraphNetwork.defineBrush(panel);


        // Define zoomListener
        vis.svg = d3.select("#"+panel).select("#D3viz")
            .call(metExploreD3.GraphNetwork.zoomListener)
            // Remove zoom on double click
            .on("dblclick.zoom", null)
            // .on("wheel.zoom", function(){console.log("wheel")})
            .attr("pointer-events", "all")
            .append('svg:g')
            .attr("class","graphComponent").attr("id","graphComponent");

        // If a graph is already loaded
        if(session!=undefined)
        {
            // We stop the previous animation
            var force = session.getForce();
            // if(force!=undefined)
            // {
            // 	force.stop();
            // 	metExploreD3.GraphNetwork.setAnimated(panel, false);
            // }

            if(session.isResizable()!=undefined && session.isResizable()!=false)
                metExploreD3.GraphNetwork.task.cancel();

            // Launch the task to resize the graph at the beginning ->tick function
            session.setResizable(true);
            metExploreD3.GraphNetwork.task = metExploreD3.createDelayedTask(
                function(){
                    session.setResizable(false);
                }
            );
        }

        // Define play and stop button ->play function

        this.defineBasalButtons(panel, session.isAnimated());

        // Start the animation
        if(session.isAnimated())
            metExploreD3.GraphNetwork.setAnimated(panel, true);
        else
            metExploreD3.GraphNetwork.setAnimated(panel, false);


        // Refresh coresponding nodes and links
        var linkStyle = metExploreD3.getLinkStyle();
        var metaboliteStyle = metExploreD3.getMetaboliteStyle();

        metExploreD3.GraphNetwork.initPathwaysData();

        // Allows to display all pathway nodes
        // networkData.getNodes()
        //     .forEach(function (n) {
        //         if(n.getBiologicalType()==="pathway"){
        //             n.show();
        //             var pathwayModel = networkData.getPathwayByName();
        //             if(pathwayModel) pathwayModel.setCollapsed(true);
        //         }
        //         else n.hide();
        //     });

        metExploreD3.GraphLink.refreshDataLink(panel, session);

        // Define play and stop button ->play function
        if(panel!="viz"){
            this.defineInteractionButtons(panel);
        }
        else
        {
            metExploreD3.GraphNetwork.looksLinked();
            if(session.isLinked()){
                metExploreD3.GraphNetwork.graphAlignment(panel, "viz");
            }
        }

        // 62771 ms for recon before refactoring
        // 41465 ms now
        // var endall = new Date().getTime();
        // var timeall = endall - startall;
        // console.log("----Viz: FINISH refresh/ all "+timeall);
        var networkData = session.getD3Data();

        // Get bound effect
        // console.log(force.alpha());
        var visibleLinks = networkData.getLinks()
            .filter(function (link) {
                var target, source;
                target = link.getTarget();
                source = link.getSource();

                return !source.isHidden() && !target.isHidden();
            });

        var visibleNodes = networkData.getNodes()
            .filter(function (node) {
                return !node.isHidden();
            });


        // Initiate the D3 force drawing algorithm
        var manyBody = d3.forceManyBody()
            .strength(-100)
            .distanceMin(1)
            .distanceMax(1000);

        var forceLinks = d3.forceLink(visibleLinks)
            .distance(function(link){
                if(link.getSource().getIsSideCompound() || link.getTarget().getIsSideCompound())
                    return linkStyle.getSize()/2+maxDim;
                else
                    return linkStyle.getSize()+maxDim;
            })
            .iterations(1);
        // .strength([strength])


        var forceCollide = d3.forceCollide()
            .radius(15)
            .strength(0.7)
            .iterations(1);

        var forceX = d3.forceX()
            .x(w/2)
            .strength(0.006);

        var forceY = d3.forceY()
            .y(h/2)
            .strength(0.006);


        var force = d3.forceSimulation(visibleNodes)
            .force("charge", manyBody)
            .force("link", forceLinks)
            .force('x', forceX)
            .force('y', forceY)
            .force("collide", forceCollide)
            .alphaDecay(0.01)
            .velocityDecay(0.2);

        session.setForce(force);

        force
            .on("end", function(){
            console.log("force end");
            var scale = metExploreD3.getScaleById(panel);
            if ((networkData.getNodes().length > generalStyle.getReactionThreshold() && generalStyle.isDisplayedLinksForOpt())) {
                metExploreD3.GraphLink.reloadLinks(panel, networkData, linkStyle, metaboliteStyle);
            }
            metExploreD3.GraphLink.tick(panel, scale);
        })
            .on("tick", function(e){
                var useClusters = metExploreD3.getGeneralStyle().useClusters();
                var componentDisplayed = metExploreD3.getGeneralStyle().isDisplayedConvexhulls();
                if(useClusters && componentDisplayed!=false){
                    var k = e.alpha * .1;
                    networkData.getNodes().forEach(function(node) {
                        if(componentDisplayed=="Compartments"){
                            var group = null;
                            if(node.getBiologicalType()=="metabolite"){
                                group = node.getCompartment();

                            }
                            else
                            {
                                var nbComp = [];
                                for (var key in session.groups) {
                                    if (session.groups.hasOwnProperty(key)) {
                                        var index = session.groups[key].values.indexOf(node);
                                        if(index!=-1)
                                            nbComp.push(session.groups[key].key);
                                    }
                                }
                                if(nbComp.length<2)
                                    group = nbComp[0];
                            }
                            if(group!=null)
                            {
                                var forceCentroids = _metExploreViz.getSessionById(panel).getForceCentroids();
                                var theCentroid = forceCentroids.nodes()
                                    .find(function(centroid){
                                            return centroid.id == group;
                                        }
                                    );
                                node.x += (theCentroid.x - node.x) * k;
                                node.y += (theCentroid.y - node.y) * k;
                            }
                        }
                        else
                        {
                            var nodePathwayVisible =
                                node.getPathways()
                                    .filter(function(path){
                                        var group = session.getD3Data().getPathwayByName(path);
                                        if(group!=null)
                                        {
                                            return !group.hidden();
                                        }
                                        return false;
                                    });

                            if(componentDisplayed=="Pathways" && nodePathwayVisible.length<2 && nodePathwayVisible.length>0){
                                // here you want to set center to the appropriate [x,y] coords

                                // var center = group.center;
                                // d3.select("#viz").select("#D3viz").select("#graphComponent").selectAll("g.centroid")
                                // 	.filter(function(centroid){
                                // 		console.log(node.getPathways()[0]);
                                // 		console.log(centroid.id);
                                // 		return centroid.id == node.getPathways()[0];
                                // 	})
                                // 	.each(function(centroid){
                                // 		var center = {x:centroid.x, y:centroid.y};
                                // 	});
                                var forceCentroids = _metExploreViz.getSessionById(panel).getForceCentroids();
                                var theCentroid = forceCentroids.nodes()
                                    .find(function(centroid){
                                            return centroid.id == nodePathwayVisible[0];
                                        }
                                    );
                                node.x += (theCentroid.x - node.x) * k;
                                node.y += (theCentroid.y - node.y) * k;


                            }
                        }
                    });
                }

                if(force.alpha() >= .005 /*&& force.alpha() < .06*/){
                    setTimeout(metExploreD3.GraphNetwork.tick(panel), 0);
                    if(metExploreD3.GraphNetwork.first){
                        metExploreD3.GraphNetwork.refreshViz(panel);
                        metExploreD3.GraphNetwork.first=false;
                    }

                }
            });

        session.setForce(force);

        var networkDataInit = new NetworkData('viz');
        networkDataInit.cloneObject(networkData);
        _metExploreViz.setInitialData(networkDataInit);
        var session = _metExploreViz.getSessionById(panel);
        var force = session.getForce();

        if(session.isAnimated())
            force.restart();
        else
        {
            force.restart();
            force.stop();
            metExploreD3.GraphNetwork.tick(panel);
        }

    },

    refreshViz : function(panel){
        var mask = metExploreD3.createLoadMask("Draw graph", panel);
        metExploreD3.showMask(mask);
        setTimeout(
            function() {
                var linkStyle = metExploreD3.getLinkStyle();
                var generalStyle = metExploreD3.getGeneralStyle();

                metExploreD3.GraphLink.refreshLink(panel, linkStyle);

                metExploreD3.GraphNode.refreshNode(panel);

                var isDisplay = generalStyle.isDisplayedConvexhulls();


                if (isDisplay) metExploreD3.GraphLink.displayConvexhulls(panel);


                // Sort compartiments store
                metExploreD3.sortCompartmentInBiosource();

                metExploreD3.GraphNode.colorStoreByCompartment(metExploreD3.GraphNode.node);

                metExploreD3.GraphCaption.majCaptionPathwayOnLink();

                metExploreD3.fireEvent("vizIdDrawing", "enableMakeClusters");

                // reinitialize
                metExploreD3.GraphStyleEdition.allDrawnCycles = [];

                var session = _metExploreViz.getSessionById(panel);

                if (!session.isAnimated())
                    metExploreD3.GraphNetwork.tick(panel);
                metExploreD3.hideMask(mask);
            }, 200);
    },

    rescale : function(panel){
        var mask = metExploreD3.createLoadMask("Rescaling graph", panel);
        metExploreD3.showMask(mask);

        var scaleViz = metExploreD3.getScaleById(panel);
        var zoom = scaleViz.getZoom();
        var rectSvg = d3.select("#"+panel).select("#D3viz").select("#graphComponent").node().getBoundingClientRect();

        var wSvg = rectSvg.width;
        var hSvg = rectSvg.height;

        var width = parseInt(metExploreD3.GraphPanel.getWidth(panel).replace("px",""));
        var height = parseInt(metExploreD3.GraphPanel.getHeight(panel).replace("px",""));

        var scale =(Math.min(height/hSvg, width/wSvg))*0.9;

        metExploreD3.applyTolinkedNetwork(
            panel,
            function(panelLinked, sessionLinked) {
                zoom.scaleBy(d3.select("#viz").select("#D3viz").transition().duration(750).on("end",function(){
                    zoom.translateTo(d3.select("#"+panel).select("#D3viz").transition().duration(750), 0, 0);
                    scaleViz.setZoomScale(scale);
                    metExploreD3.hideMask(mask);
                }), scale);

            });
    },


    initCentroids : function(panel){
        //d3.select("#viz").select("#D3viz").select("#graphComponent").selectAll("g.node").filter(function(node){return node.getPathways().length>1}).style("fill", 'red');

        var h = parseInt(metExploreD3.GraphPanel.getHeight(panel));
        var w = parseInt(metExploreD3.GraphPanel.getWidth(panel));
        var session = _metExploreViz.getSessionById(panel);
        var networkData = session.getD3Data();

        var componentDisplayed = metExploreD3.getGeneralStyle().isDisplayedConvexhulls();

        var components = [];

        if(componentDisplayed=="Compartments"){
            networkData.getCompartments().forEach(function(compartment){
                components.push({"id":compartment.identifier,x:2,y:2});
            });

            var links = [];

            d3.select("#"+panel).select("#D3viz").select("#graphComponent").selectAll("g.node")
                .filter(function(node){
                    return node.getBiologicalType()=="reaction";
                })
                .filter(function(node){
                    var nbComp = 0;
                    for (var key in session.groups) {
                        if (session.groups.hasOwnProperty(key)) {
                            if(session.groups[key].values!=undefined)
                                return false;

                            var index = session.groups[key].values.indexOf(node);
                            if(index!=-1)
                                nbComp++;
                        }
                    }
                    return nbComp.length>1
                })
                .each(function(node){
                    node.getCompartment().forEach(function(compartment){
                        node.getCompartment().forEach(function(compartment2){
                            if(compartment!=compartment2){
                                var sourceIndex = components.findIndex(function(path){
                                    return path.id==compartment;
                                });
                                var targetIndex = components.findIndex(function(path){
                                    return path.id==compartment2;
                                });

                                var theLink = links.find(function(link){
                                    return link.source==sourceIndex && link.target==targetIndex;
                                });

                                if(theLink==undefined)
                                    links.push({"source":sourceIndex, "target":targetIndex});

                            }
                        });
                    });

                });
        }
        else
        {
            networkData.getPathways()
                .filter(function(pathway){
                    return !pathway.hidden();
                })
                .forEach(function(pathway){
                    components.push({"id":pathway.identifier,x:2,y:2});
                });

            var links = [];
            d3.select("#"+panel).select("#D3viz").select("#graphComponent")
                .selectAll("g.node")
                .filter(function(node){return node.getBiologicalType()=="reaction" || node.getBiologicalType()=="metabolite" ;})
                .filter(function(node){return node.getPathways().length>1})
                .each(function(node){
                    node.getPathways().forEach(function(pathway){
                        node.getPathways().forEach(function(pathway2){
                            if(pathway!=pathway2){
                                var sourceIndex = components.findIndex(function(path){
                                    return path.id==pathway;
                                });
                                var targetIndex = components.findIndex(function(path){
                                    return path.id==pathway2;
                                });
                                if(sourceIndex!==-1 && targetIndex!==-1){
                                    var theLink = links.find(function(link){
                                        return link.source==sourceIndex && link.target==targetIndex;
                                    });

                                    if(theLink==undefined)
                                        links.push({"source":sourceIndex, "target":targetIndex});
                                }
                            }
                        });
                    });

                });
        }



        // var lien = d3.select("#viz").select("#D3viz").select("#graphComponent").selectAll("linkCentroid")
        //       .data(links)
        //     	.enter().append("path")
        //       .attr("class", "linkCentroid")
        //       .style("stroke", "red")
        //       .style("stroke-width", 1);

        // d3.select("#viz").select("#D3viz").select("#graphComponent").selectAll("g.centroid")
        // 	.data(pathways).enter()
        // 	.append("svg:g").attr("class", "centroid")
        // 	.style("fill", "white")
        // 	.append("rect")
        // 	.attr("id",function(pathway){ return pathway.id})
        // 	.attr("width", 6)
        // 	.attr("height", 6)
        // 	.attr("rx", 3)
        // 	.attr("ry", 3)
        // 	.attr("transform", "translate(-" + 6/2 + ",-"
        // 							+ 6/2
        // 							+ ")")
        // 	.style("stroke", "blue")
        // 	.style("stroke-width", 6);

        var manyBody = d3.forceManyBody()
            .strength(-4000)
            .theta(0.2)
            .distanceMin(1);

        var forceLinks = d3.forceLink(links)
            .distance(600);
        // .strength([strength])
        // .iterations([iterations])

        var forceX = d3.forceX()
            .x(w/2)
            .strength(0.006);

        var forceY = d3.forceY()
            .y(h/2)
            .strength(0.006);

        var force2 = d3.forceSimulation(components)
            .force("charge", manyBody)
            .force("link", forceLinks)
            .force('x', forceX)
            .force('y', forceY)
            .velocityDecay(0.90)
            .restart();

        session.setForceCentroids(force2);

        // force2
        //     .nodes(components)
        //     .links(links)
        //     .restart();
    },

    /*******************************************
     * Change the cursor state to move the graph
     */
    moveGraph : function(){

        _MyThisGraphNode.dblClickable=false;
        var panel = this.parentNode.parentNode.id;
        var scrollable = d3.select("#"+panel).select("#buttonHand").attr("scrollable");

        if(scrollable == "false"){
            d3.select("#"+panel).select("#D3viz").select("#buttonHand").transition().duration(500).style("opacity", 1);
            d3.select("#"+panel).select("#buttonHand").attr("scrollable", true);
        }
        else
        {
            d3.select("#"+panel).select("#D3viz").select("#buttonHand").transition().duration(500).style("opacity", 0.2);
            d3.select("#"+panel).select("#buttonHand").attr("scrollable", false);
        }
    },

    /*******************************************
     * Align linked graphs
     * @param {} panel : The panel to align with the main
     */
    graphAlignment : function(panel, panel2){
        var session = _metExploreViz.getSessionById(panel);
        d3.select("#"+panel).select("#D3viz").select("#graphComponent")
            .selectAll("g.node")
            .each(function(node){
                var nodeLinked = this;
                d3.select("#"+panel2).select("#D3viz").select("#graphComponent")
                    .selectAll("g.node")
                    .each(function(d){
                        if(d.getId() == node.getId())
                        {
                            // Align nodes with the main graph
                            node.x = d.x;
                            node.y = d.y;
                            // Select same nodes that the main graph
                            if(node.selected && !d.isSelected()){
                                _MyThisGraphNode.selection(d, panel2);
                            }

                            if(!node.selected && d.isSelected()){
                                _MyThisGraphNode.selection(node, panel);
                            }
                        }
                    });
            });


        var force = session.getForce();
        force.stop();

        var scale = metExploreD3.getScaleById(panel);
        metExploreD3.GraphLink.tick(panel, scale);
        metExploreD3.GraphNode.tick(panel);

    },

    /*******************************************
     * Link mapping of compared networks
     * @param {} panel : The panel to align with the main
     */
    mappingAlignment : function(){
        that = this;
        var panel = this.parentNode.parentNode.id;
        var session = _metExploreViz.getSessionById(panel);

        if(_metExploreViz.getMappingsLength()!==0 && _metExploreViz.getSessionById("viz").getActiveMapping()!=="")
        {
            var mainSession = _metExploreViz.getSessionById("viz");
            d3.select("#"+panel).select("#D3viz").select("#graphComponent")
                .selectAll("g.node")
                .each(function(node){
                    var nodeLinked = this;
                    var color = d3.select(nodeLinked).select('rect').style("fill");
                    d3.select("#viz").select("#D3viz").select("#graphComponent")
                        .selectAll("g.node")
                        .each(function(d){
                            if(d.getId() == node.getId())
                            {
                                if(d.getMappingDatasLength()>0){
                                    d.getMappingDatas().forEach(function(mappingData){
                                        if(mappingData.getMapValue()==undefined)
                                            node.addMappingData(new MappingData(node, mappingData.getMappingName().valueOf(), mappingData.getConditionName().valueOf(), undefined));
                                        else
                                            node.addMappingData(new MappingData(node, mappingData.getMappingName().valueOf(), mappingData.getConditionName().valueOf(), mappingData.getMapValue().valueOf()));
                                    });
                                }

                                var colorMain = d3.select(this).select('rect.'+d.getBiologicalType()).style("fill");

                                if(color!=colorMain){
                                    d3.select(nodeLinked)
                                        .style("fill", colorMain);

                                    if(d.getBiologicalType()=="metabolite")
                                        var style = metExploreD3.getMetaboliteStyle();
                                    else
                                    {
                                        var style = metExploreD3.getReactionStyle();
                                    }

                                    var nbMapped = d3.select(this).select('rect.'+d.getBiologicalType()).attr("mapped");
                                    if(nbMapped>0){
                                        d3.select(nodeLinked)
                                            .insert("rect", ":first-child")
                                            .attr("class", "stroke")
                                            .attr("width", style.getWidth()+4)
                                            .attr("height", style.getHeight()+4)
                                            .attr("rx", style.getRX())
                                            .attr("ry", style.getRY())
                                            .attr("transform", "translate(-" + parseInt(style.getWidth()+4) / 2 + ",-"
                                                + parseInt(style.getHeight()+4) / 2
                                                + ")")
                                            .style("opacity", '0.5')
                                            .style("fill", 'red');
                                    }

                                    session.setMappingDataType(mainSession.getMappingDataType());
                                    session.setMapped(mainSession.isMapped());
                                }
                                else
                                {
                                    if(d3.select(this).select('rect.stroke')[0]!=null)
                                    {
                                        var colorStrokeMain = d3.select(this).select('rect.stroke').style("fill");

                                        if(d.getBiologicalType() == 'reaction' )
                                        {
                                            d3.select(nodeLinked)
                                                .attr("mapped","true")
                                                .insert("rect", ":first-child")
                                                .attr("class", "stroke")
                                                .attr("width", parseInt(d3.select(this).select(".reaction").attr("width"))+10)
                                                .attr("height", parseInt(d3.select(this).select(".reaction").attr("height"))+10)
                                                .attr("rx", parseInt(d3.select(this).select(".reaction").attr("rx"))+5)
                                                .attr("ry",parseInt(d3.select(this).select(".reaction").attr("ry"))+5)
                                                .attr("transform", "translate(-" + parseInt(parseInt(d3.select(this).select(".reaction").attr("width"))+10) / 2 + ",-"
                                                    + parseInt(parseInt(d3.select(this).select(".reaction").attr("height"))+10) / 2
                                                    + ")")
                                                .style("opacity", '0.5')
                                                .style("fill", 'red');
                                        }
                                        else
                                        {
                                            if(d.getBiologicalType() == 'metabolite')
                                            {

                                                d3.select(nodeLinked)
                                                    .attr("mapped","true")
                                                    .insert("rect", ":first-child")
                                                    .attr("class", "stroke")
                                                    .attr("width", parseInt(d3.select(this).select(".metabolite").attr("width"))+10)
                                                    .attr("height", parseInt(d3.select(this).select(".metabolite").attr("height"))+10)
                                                    .attr("rx", parseInt(d3.select(this).select(".metabolite").attr("rx"))+5)
                                                    .attr("ry",parseInt(d3.select(this).select(".metabolite").attr("ry"))+5)
                                                    .attr("transform", "translate(-" + parseInt(parseInt(d3.select(this).select(".metabolite").attr("width"))+10) / 2 + ",-"
                                                        + parseInt(parseInt(d3.select(this).select(".metabolite").attr("height"))+10) / 2
                                                        + ")")
                                                    .style("opacity", '0.5')
                                                    .style("fill", 'red');
                                            }
                                        }
                                        session.setMappingDataType(mainSession.getMappingDataType());
                                        session.setMapped(mainSession.isMapped());
                                    }
                                }
                            }
                        });
                });

            session.setActiveMapping(mainSession.getActiveMapping().valueOf());
            session.resetColorMapping();
            mainSession.getColorMappingsSet().forEach(function(colorMap){
                session.addColorMapping(colorMap.getName().valueOf(), colorMap.getValue().valueOf());
            });
        }
        else
        {
            metExploreD3.displayWarning("None node mapped", 'None nodes mapped on main network.');
        }
    },

    /*******************************************
     * Permit to get x compared graph scaled of x main graph
     * @param {} x : The panel to scale
     * @param {} panel : The new panel
     */
    scaledX : function(x, panel) {
        var sessionsStore = metExploreD3.getSessionsSet();
        var xScaled;
        if(panel == "viz"){
            var panelComp;
            for (var key in sessions) {
                if(sessions[key].getId()=="viz"){
                    panelComp = sessions[key].getId();
                }
            }

            var wComp = parseInt(d3.select("#"+panelComp).select("#D3viz")
                .style("width"));

            var wViz = parseInt(d3.select("#viz").select("#D3viz")
                .style("width"));

            xScaled = (x * wComp) / wViz;

        }
        else
        {
            var panelComp;
            for (var key in sessions) {
                if(sessions[key].getId()=="viz"){
                    panelComp = sessions[key].getId();
                }
            }

            var wComp = parseInt(d3.select("#"+panel).select("#D3viz")
                .style("width"));

            var wViz = parseInt(d3.select("#viz").select("#D3viz")
                .style("width"));

            xScaled = (x * wViz) / wComp;
        }
        return xScaled;
    },

    /*******************************************
     * Permit to get y compared graph scaled of y main graph
     * @param {} y : The panel to scale
     * @param {} panel : The new panel
     */
    scaledY : function(y, panel) {
        var sessionsStore = metExploreD3.getSessionsSet();
        var yScaled;

        if(panel == "viz"){
            var panelComp;

            for (var key in sessions) {
                if(sessions[key].getId()=="viz"){
                    panelComp = sessions[key].getId();
                }
            }

            var hComp = parseInt(d3.select("#"+panelComp).select("#D3viz")
                .style("height"));

            var hViz = parseInt(d3.select("#viz").select("#D3viz")
                .style("height"));

            yScaled = (y * hComp) / hViz;

        }
        else
        {
            var panelComp;

            for (var key in sessions) {
                if(sessions[key].getId()=="viz"){
                    panelComp = sessions[key].getId();
                }
            }

            var hComp = parseInt(d3.select("#"+panel).select("#D3viz")
                .style("height"));

            var hViz = parseInt(d3.select("#viz").select("#D3viz")
                .style("height"));

            yScaled = (y * hViz) / hComp;
        }
        return Scaled;
    },



    /*******************************************
     * Add link in visualization
     * @param {} identifier : Id of this link
     * @param {} source : Source of this link
     * @param {} target : Target of this link
     * @param {} interaction : Interaction beetween nodes of this link
     * @param {} reversible : Reversibility of link
     * @param {} panel : The panel where is the new link
     */
    addLinkInDrawing:function(identifier,source,target,interaction,reversible,panel, hide){

        var session = _metExploreViz.getSessionById(panel);
        var networkData = session.getD3Data();
        networkData.addLink(identifier,source,target,interaction,reversible);
    },

    /*******************************************
     * identifier parameter is used if there is a new parameter to add.
     * @param {} panel : The panel to unlink
     * @param {} panel : The panel to unlink
     * @param {} panel : The panel to unlink
     * @returns {} newNode : The created node
     */
    addMetaboliteInDrawing: function(theNode, theNodeId, reactionId, panel){

        var identifier = theNodeId+"-"+reactionId;
        var session = _metExploreViz.getSessionById(panel);
        var networkData = session.getD3Data();
        var force = session.getForce();
        var metaboliteStyle = metExploreD3.getMetaboliteStyle();
        var generalStyle = metExploreD3.getGeneralStyle();

        /***************************/
        // Var which permit to drag
        /***************************/
        var node_drag = d3.drag()
            .on("start",_MyThisGraphNode.dragstart)
            .on("drag",_MyThisGraphNode.dragmove)
            .on("end", _MyThisGraphNode.dragend);

        var scale = metExploreD3.getScaleById(panel);

        metExploreD3.fireEventParentWebSite("sideCompound", theNode);

        //create the node in the data structure
        var newNode=networkData.addNode(
            theNode.getName(),
            theNode.getCompartment(),
            theNode.getDbIdentifier(),
            identifier,
            theNode.getReactionReversibility(),
            theNode.getBiologicalType(),
            false,
            theNode.getLabelVisible(),
            theNode.getSvg(),
            theNode.getSvgWidth(),
            theNode.getSvgHeight(),
            theNode.getIsSideCompound(),
            undefined,
            true,
            theNodeId,
            networkData.getNodeById(reactionId).getPathways(),
            false,
            theNode.getAlias(),
            theNode.getLabel(),
            undefined,
            false);

        //newNode.index = networkData.getNodes().indexOf(newNode);

        if(theNode.getMappingDatasLength()!=0){
            theNode.getMappingDatas().forEach(function(mapping){
                networkData.getNodeById(identifier).addMappingData(new MappingData(theNode, mapping.getMappingName(), mapping.getConditionName(), mapping.getMapValue()));
            });
        }

        var reactNode = networkData.getNodeById(reactionId);

        var dX =  reactNode.x - theNode.x;
        var dY =  reactNode.y - theNode.y;

        var d = Math.sqrt(Math.pow(dX, 2) + Math.pow(dY, 2));
        var originalX = reactNode.x - (40 * dX)/d;
        var originalY = reactNode.y - (40 * dY)/d;

        newNode.x=originalX;
        newNode.px=originalX;
        newNode.y=originalY;
        newNode.py=originalY;

        return newNode;
    },


    initPathwaysData:function(){
        var session = _metExploreViz.getSessionById("viz");
        var networkData = session.getD3Data();

        networkData.getPathways().forEach(function (path, i) {
            var newNode;
        	var listPathway =
                networkData.getNodes()
                    .filter(function (node) {
                        return node.getBiologicalType()==="pathway";
                    })
                    .map(function (node) {
                        return node.getName();
                    });

            if(networkData.getPathways()[0].nodes.length===0){
                networkData.getNodes().filter(function(d) { return d.getBiologicalType() !== 'pathway'; })
                    .forEach(function (n) {

                        n.pathways.forEach(function (pathname) {
                            var thePathway = networkData.getPathwayByName(pathname);
                            if(thePathway) thePathway.addNode(n);
                        });
                    });
            }
            // setTimeout(function(){
            if(!listPathway.includes(path.getName())){
                //create the node in the data structure
                newNode = networkData.addNode(
                    path.getName(),
                    "",
                    path.getName(),
                    i.toString(),
                    false,
                    "pathway",
                    false,
                    "true",//theNode.getLabelVisible(),
                    "",
                    "",
                    "",
                    false,
                    undefined,
                    false,
                    path.getName(),//theNodeId,
                    [path.getName()],
                    false,
                    "",//theNode.getAlias(),
                    path.getName(),//theNode.getLabel());
                    undefined,
                    true
                );
            };

            newNode = networkData.getNodeByName(path.getName());

            metExploreD3.GraphNetwork.addPathwayLinksData(newNode);
        });
    },

    initPathway:function(pathName){
        var activePanel = _MyThisGraphNode.activePanel;
        if(!activePanel) activePanel='viz';
        metExploreD3.applyTolinkedNetwork(
            activePanel,
            function(panelLinked, sessionLinked) {
                var networkData = sessionLinked.getD3Data();

                var newNode = networkData.getNodeByName(pathName);
                newNode.show();

                metExploreD3.GraphNetwork.updateNetwork(panelLinked, sessionLinked);
            });
    },


    /*******************************************
     * identifier parameter is used if there is a new parameter to add.
     * @param {} panel : The panel to unlink
     * @param {} panel : The panel to unlink
     * @param {} panel : The panel to unlink
     * @returns {} newNode : The created node
     */
    addPathwayNode: function(pathwayName){
        var panel = "viz";
        var session = _metExploreViz.getSessionById("viz");
        var networkData = session.getD3Data();
        var metaboliteStyle = metExploreD3.getMetaboliteStyle();

        networkData.getPathwayByName(pathwayName).setCollapsed(true);

        var newNode = networkData.getNodeByName(pathwayName);
        var pathwayModel = networkData.getPathwayByName(pathwayName);

        newNode.show();

        if(newNode.x===undefined)
        {

            var allX = pathwayModel.getNodes().map(function (n) { return n.x; });

            var sumX = allX.reduce(function(a, b) { return a + b; });
            var avgX = sumX / allX.length;
            newNode.x = avgX;
            newNode.px = avgX;

            var allY = pathwayModel.getNodes().map(function (n) { return n.y; });
            var sumY = allY.reduce(function(a, b) { return a + b; });
            var avgY = sumY / allY.length;
            newNode.y = avgY;
            newNode.py = avgY;
        }

        // var pathwaySize = pathwayModel.getNodes().filter(function (t) { return t.getBiologicalType()==="metabolite"; }).length;
        var pathwaySize = 20;

        var thePathwayElement =
            metExploreD3.GraphNode.node.filter(function(d) { return d.getBiologicalType() === 'pathway'; })
                .filter(function(d) { return d.getName() === pathwayName; });

        thePathwayElement
            .addNodeForm(
                pathwaySize*3,
                pathwaySize*3,
                pathwaySize*3,
                pathwaySize*3,
                networkData.getPathwayByName(pathwayName).getColor(),
                pathwaySize*3/5
            );

        thePathwayElement
            .append('circle')
            .classed('mapped-segment', true);

        thePathwayElement
            .append('circle')
            .classed('notmapped-segment', true);
        thePathwayElement
            .addNodeText(metaboliteStyle);



        var minDim = pathwaySize*3;

        // Lock Image definition
        var box = thePathwayElement
            .insert("svg", ":first-child")
            .attr(
                "viewBox",
                function(d) {
                    + " " + minDim;
                }
            )
            .attr("width",pathwaySize*3)
            .attr("height",pathwaySize*3)
            .attr("preserveAspectRatio", "xMinYMin")
            .attr("y",-pathwaySize*3)
            .attr("x",-pathwaySize*3)
            .attr("class", "locker")
            .classed('hide', true);

        box.append("svg:path")
            .attr("class", "backgroundlocker")
            .attr("d", function(node){
                var pathBack = "M"+pathwaySize*3+","+pathwaySize*3+
                    " L0,"+pathwaySize*3+
                    " L0,"+pathwaySize*3/2*2+
                    " A"+pathwaySize*3/2*2+","+pathwaySize*3/2*2+",0 0 1 "+pathwaySize*3/2*2+",0"+
                    " L"+pathwaySize*3+",0";
                return pathBack;
            })
            .attr("opacity", "0.20")
            .attr("fill", "black");

        box.append("image")
            .attr("class", "iconlocker")
            .attr("y",pathwaySize*3/2/4-(pathwaySize*3-pathwaySize*3*2)/8)
            .attr("x",pathwaySize*3/2/4-(pathwaySize*3-pathwaySize*3*2)/8)
            .attr("width", "40%")
            .attr("height", "40%");

        return newNode;
    },

    /*******************************************
     * identifier parameter is used if there is a new parameter to add.
     * @param {} panel : The panel to unlink
     * @param {} panel : The panel to unlink
     * @param {} panel : The panel to unlink
     * @returns {} newNode : The created node
     */
    expandPathwayNode: function(pathwayName, panel){
        var session = _metExploreViz.getSessionById(panel);
        var networkData = session.getD3Data();
        var force = session.getForce();

        networkData.getPathwayByName(pathwayName).setCollapsed(false);
        networkData.getNodeByName(pathwayName).hide();

        networkData.getPathwayByName(pathwayName).getNodes()
            .forEach(function (n) {
                n.show();
            });


        var activePanel = _MyThisGraphNode.activePanel;
        if(!activePanel) activePanel='viz';
        metExploreD3.applyTolinkedNetwork(
            activePanel,
            function(panelLinked, sessionLinked) {
                metExploreD3.GraphNetwork.updateNetwork(panelLinked, sessionLinked);
            });

        metExploreD3.fireEvent("vizIdDrawing", "enableMakeClusters");
    },

    /*******************************************
     * identifier parameter is used if there is a new parameter to add.
     * @param {} panel : The panel to unlink
     * @param {} panel : The panel to unlink
     * @param {} panel : The panel to unlink
     * @returns {} newNode : The created node
     */
    expandAllPathwayNode: function(panel){

        var activePanel = panel;
        if(!activePanel) activePanel='viz';
        metExploreD3.applyTolinkedNetwork(
            activePanel,
            function(panelLinked, sessionLinked) {
            var session = sessionLinked;
            var networkData = session.getD3Data();
            var force = session.getForce();
            networkData.getPathways()
                .forEach(function(pathway){
                    pathway.setCollapsed(false);
                    networkData.getNodeByName(pathway.getName()).hide();
                });

            networkData.getNodes()
                .filter(function (n) {
                    return n.getBiologicalType()!=="pathway" && n.isHidden();
                })
                .forEach(function (n) {
                    n.show();
                });

                metExploreD3.GraphNetwork.updateNetwork(panelLinked, sessionLinked);
            });

        metExploreD3.fireEvent("vizIdDrawing", "enableMakeClusters");
    },

    /*******************************************
     * identifier parameter is used if there is a new parameter to add.
     * @param {} panel : The panel to unlink
     * @param {} panel : The panel to unlink
     * @param {} panel : The panel to unlink
     * @returns {} newNode : The created node
     */
    addPathwayLinks: function(newNode){
        var pathwayName = newNode.getName();
        var session = _metExploreViz.getSessionById("viz");
        var networkData = session.getD3Data();
        var force = session.getForce();

        /***************************/
        // Var which permit to drag
        /***************************/
        d3.drag()
            .on("start",_MyThisGraphNode.dragstart)
            .on("drag",_MyThisGraphNode.dragmove)
            .on("end", _MyThisGraphNode.dragend);

        networkData.getLinks()
            .filter(function (link) {
                return link.getSource().getName()===pathwayName || link.getTarget().getName()===pathwayName;
            })
            .forEach(function (link) {
                metExploreD3.GraphNetwork.addLinkInDrawing(link.getSource().getDbIdentifier()+"-"+link.getTarget().getId(), link.getSource(), link.getTarget(), "out", false, "viz", false)
            });

        if (metExploreD3.GraphNetwork.isAnimated("viz")==true || metExploreD3.GraphNetwork.isAnimated("viz")=="true") {
            force.restart();
        }
        else
        {
            force.restart();
            force.stop();
        }

        metExploreD3.GraphNetwork.tick("viz");
    },

    /*******************************************
     * identifier parameter is used if there is a new parameter to add.
     * @param {} panel : The panel to unlink
     * @param {} panel : The panel to unlink
     * @param {} panel : The panel to unlink
     * @returns {} newNode : The created node
     */
    addPathwayLinksData: function(newNode){
        var pathwayName = newNode.getName();
        var session = _metExploreViz.getSessionById("viz");
        var networkData = session.getD3Data();
        var force = session.getForce();

        var nodesData = networkData.getNodes();
        var nodesLink = nodesData
            .filter(function(n){return n.getBiologicalType()==="metabolite"})
            .filter(function(n){
                    return n.pathways.length>1 && n.pathways.includes(pathwayName);
                }
            );

        var idOfLinkWithPathway = [];
        idOfLinkWithPathway = networkData.getLinks()
            .filter(function (link) {
                var target, source;
                target = link.getTarget();
                source = link.getSource();
                if(!(target instanceof NodeData)){
                    target = networkData.getNodes()[link.getTarget()];
                }
                if(!(source instanceof NodeData)){
                    source = networkData.getNodes()[link.getSource()];
                }

                return source.getBiologicalType()==="pathway" || target.getBiologicalType()==="pathway";
            })
            .map(function (link) {
                return link.getId();
            });

        nodesLink.forEach(function (linkNode) {
            var id = linkNode.getDbIdentifier()+"-"+newNode.getId();
            if(!idOfLinkWithPathway.includes(id))
                networkData.addLink(id, linkNode, newNode, "out", false);
		});

        var newPath = networkData.getPathwayByName(newNode.getName());

        nodesData
            .filter(function (n){ return n.getBiologicalType()==="pathway"; })
            .forEach(function (p){
                if(p.getName()!==newNode.getName())
                {
                    var pPathModel = networkData.getPathwayByName(p.getName());

                    var metabInP = pPathModel.getNodes().filter(function (t) { return t.getBiologicalType()==="metabolite" && !t.getIsSideCompound(); })

                    var metabInP2 = newPath.getNodes().filter(function (t) { return t.getBiologicalType()==="metabolite" && !t.getIsSideCompound(); })
                    var intersection = metabInP.filter(function(x) { return metabInP2.includes(x);});
                    if(intersection.length>0 ) {
                        networkData.addLink(p.getId()+"-"+newNode.getId(), p, newNode, "out", false);
                    }
                }
            });


        metExploreD3.GraphNetwork.tick("viz");
    },

    /*******************************************
     * identifier parameter is used if there is a new parameter to add.
     * @param {} panel : The panel to unlink
     * @param {} panel : The panel to unlink
     * @param {} panel : The panel to unlink
     * @returns {} newNode : The created node
     */
    addPathwayLinksDataSinkSource: function(newNode){
        var pathwayName = newNode.getName();
        var session = _metExploreViz.getSessionById("viz");
        var networkData = session.getD3Data();
        var force = session.getForce();

        var nodesData = networkData.getNodes();
        var nodesLink = nodesData
            .filter(function(n){return n.getBiologicalType()==="metabolite"})
            .filter(function(n){
                    return n.pathways.length>1 && n.pathways.includes(pathwayName);
                }
            );

        var idOfLinkWithPathway = [];
        idOfLinkWithPathway = networkData.getLinks()
            .filter(function (link) {
                var target, source;
                target = link.getTarget();
                source = link.getSource();
                if(!(target instanceof NodeData)){
                    target = networkData.getNodes()[link.getTarget()];
                }
                if(!(source instanceof NodeData)){
                    source = networkData.getNodes()[link.getSource()];
                }

                return source.getBiologicalType()==="pathway" || target.getBiologicalType()==="pathway";
            })
            .map(function (link) {
                return link.getId();
            });

        var hide = true;
        nodesLink.forEach(function (linkNode) {
            var id = linkNode.getDbIdentifier()+"-"+newNode.getId();
            if(!idOfLinkWithPathway.includes(id))
                networkData.addLink(id, linkNode, newNode, "out", false);
		});

        var newPath = networkData.getPathwayByName(newNode.getName());

        nodesData
            .filter(function (n){ return n.getBiologicalType()==="pathway"; })
            .forEach(function (p){
                if(p.getName()!==newNode.getName())
                {
                    var pPathModel = networkData.getPathwayByName(p.getName());

                    var metabInP = pPathModel.getNodes().filter(function (t) { return t.getBiologicalType()==="metabolite"; })

                    var metabInP2 = newPath.getNodes().filter(function (t) { return t.getBiologicalType()==="metabolite"; })
                    var intersection = metabInP.filter(function(x) { return metabInP2.includes(x);});
                    if(intersection.length>0 ) {
                        networkData.addLink(p.getId()+"-"+newNode.getId(), p, newNode, "out", false);
                    }
                }
            });


        metExploreD3.GraphNetwork.tick("viz");
    },

    /*******************************************
     * identifier parameter is used if there is a new parameter to add.
     * @param {} panel : The panel to unlink
     * @param {} panel : The panel to unlink
     * @param {} panel : The panel to unlink
     * @returns {} newNode : The created node
     */
    collapsePathway: function(pathwayName){
        var activePanel = _MyThisGraphNode.activePanel;
        if(!activePanel) activePanel='viz';
        metExploreD3.applyTolinkedNetwork(
            activePanel,
            function(panelLinked, sessionLinked) {
                var networkData = sessionLinked.getD3Data();
                thePathwayModel=networkData.getPathwayByName(pathwayName);
                if(thePathwayModel){

                    thePathwayModel.setCollapsed(true);
                    var nodesToRemove = thePathwayModel.getNodes()
                        .filter(function(n){
                            var pathWithTheNode = n.getPathways().filter(function (pathwayId) {
                                var thePathwayModelOfNode=networkData.getPathwayByName(pathwayId);
                                if(thePathwayModelOfNode){
                                    if(thePathwayModelOfNode.getId()!==thePathwayModel.getId()){
                                        return !thePathwayModelOfNode.isCollapsed();
                                    }
                                    return false
                                }
                                return false
                            });

                            return pathWithTheNode.length===0;
                        });

                    nodesToRemove
                        .forEach(function (n) {
                            n.hide();
                        });

                    var s_GeneralStyle = _metExploreViz.getGeneralStyle();

                    metExploreD3.GraphCaption.majCaption(panelLinked);

                    s_GeneralStyle.setDisplayConvexhulls(false);
                    metExploreD3.GraphLink.displayConvexhulls(panelLinked);
                    metExploreD3.GraphNetwork.tick(panelLinked);

                    s_GeneralStyle.setDisplayConvexhulls("Pathways");
                    metExploreD3.GraphLink.displayConvexhulls(panelLinked);
                    metExploreD3.GraphNetwork.tick(panelLinked);

                    s_GeneralStyle.setDisplayCaption("Pathways");
                    metExploreD3.GraphCaption.majCaption(panelLinked);

                    metExploreD3.GraphNetwork.tick(panelLinked);
                    metExploreD3.fireEvent("vizIdDrawing", "enableMakeClusters");
                }

            });
    },

    /*******************************************
     * identifier parameter is used if there is a new parameter to add.
     * @param {} panel : The panel to unlink
     * @param {} panel : The panel to unlink
     * @param {} panel : The panel to unlink
     * @returns {} newNode : The created node
     */
    collapseAllPathway: function(panel){
        var activePanel = panel;
        if(!activePanel) activePanel='viz';
        metExploreD3.applyTolinkedNetwork(
            activePanel,
            function(panelLinked, sessionLinked) {
                var networkData = sessionLinked.getD3Data();
                networkData.getPathways()
                    .forEach(function (thePathwayModel) {
                        thePathwayModel.setCollapsed(true);
                        networkData.getNodeByName(thePathwayModel.getName()).show();
                    });

                networkData.getNodes()
                    .filter(function (n) {
                        return n.getBiologicalType()!=="pathway" && !n.isHidden();
                    })
                    .forEach(function (n) {
                        n.hide();
                    });

                metExploreD3.GraphNetwork.updateNetwork(panelLinked, sessionLinked);


                var s_GeneralStyle = _metExploreViz.getGeneralStyle();

                metExploreD3.GraphCaption.majCaption(panelLinked);

                s_GeneralStyle.setDisplayConvexhulls(false);
                metExploreD3.GraphLink.displayConvexhulls(panelLinked);
                metExploreD3.GraphNetwork.tick(panelLinked);

                s_GeneralStyle.setDisplayConvexhulls("Pathways");
                metExploreD3.GraphLink.displayConvexhulls(panelLinked);
                metExploreD3.GraphNetwork.tick(panelLinked);

                s_GeneralStyle.setDisplayCaption("Pathways");
                metExploreD3.GraphCaption.majCaption(panelLinked);

                metExploreD3.GraphNetwork.tick(panelLinked);
                metExploreD3.fireEvent("vizIdDrawing", "enableMakeClusters");

            });
    },

    /*******************************************
     * Duplicate a node
     * Each time the metabolite occurs in a reaction we create a new node and connect it only to the reaction
     * @param {} theNode : The node to duplicate
     * @param {} panel : The panel to unlink
     */
    duplicateANode : function(theNode, panel) {
        var session = _metExploreViz.getSessionById(panel);
        session.addDuplicatedNode(theNode.getId());

        var force = session.getForce();
        var networkData = session.getD3Data();

        theNode.getPathways().forEach(function (pathwayName) {
            var pathwayModel = networkData.getPathwayByName(pathwayName);
            if(pathwayModel)
            {
                pathwayModel.removeNode(theNode);
            }
        });

        var reactionsConsumingNode,reactionsProducingNode;
        reactionsProducingNode = [];
        reactionsConsumingNode = [];
        var vis = d3.select("#"+panel).select("#D3viz");
        /***************************/
        // Var which permit to drag
        /***************************/
        var node_drag = d3.drag()
            .on("start",function(d){
                _MyThisGraphNode.dragstart(d);
            })
            .on("drag",function(d){
                _MyThisGraphNode.dragmove(d);
            }).on("end", _MyThisGraphNode.dragend);
        var scale = metExploreD3.getScaleById(panel);

        //Create the list of nodes to duplicate.
        //Two tables are created, one when side compounds are substrates and one when they are products
        vis.selectAll("path.link.reaction")
            .filter(function(link){
                return link.getInteraction()!="hiddenForce";
            })
            .each(function(d) {
                var source = d.source;
                var target = d.target;
                if(source==theNode)
                {
                    if(reactionsConsumingNode.indexOf(target)==-1)
                        reactionsConsumingNode.push(target);
                }
                else
                {
                    if(target==theNode)
                    {
                        if(reactionsProducingNode.indexOf(source)==-1)
                            reactionsProducingNode.push(source);
                    }
                }
            });

        reactionsConsumingNode.forEach(function(reaction){
            var newID=theNode.getId()+"-"+reaction.getId();
            //add the node to the data and viz
            var newNode=metExploreD3.GraphNetwork.addMetaboliteInDrawing(theNode,theNode.getId(),reaction.getId(),panel);

            newNode.getPathways().forEach(function (pathwayName) {

                var pathwayModel = networkData.getPathwayByName(pathwayName);
                if(pathwayModel)
                {
                    pathwayModel.removeNode(theNode);
                    pathwayModel.addNode(newNode);
                }
            });

            //add the link from theNode to the reaction
            metExploreD3.GraphNetwork.addLinkInDrawing(newID+"-"+reaction.getId(),newNode,reaction,"in",reaction.getReactionReversibility(),panel);

        });

        reactionsProducingNode.forEach(function(reaction){
            var newID=theNode.getId()+"-"+reaction.getId();
            //add the link from the reaction to theNode
            var newNode=metExploreD3.GraphNetwork.addMetaboliteInDrawing(theNode,theNode.getId(), reaction.getId(),panel);

            newNode.getPathways().forEach(function (pathwayName) {

                var pathwayModel = networkData.getPathwayByName(pathwayName);
                if(pathwayModel)
                {
                    pathwayModel.removeNode(theNode);
                    pathwayModel.addNode(newNode);
                }
            });

            metExploreD3.GraphNetwork.addLinkInDrawing(reaction.getId()+"-"+newID,reaction,newNode,"out",reaction.getReactionReversibility(),panel);

        });

    },


    /************************************
     * Duplicate side compounds
     * @param {} panel : The panel where the SC must be duplicated
     */
    duplicateSideCompounds : function(panel, func){

        if(panel==undefined) panel="viz";

        var vis = d3.select("#"+panel).select("#D3viz");
        var sideCompounds = [];

        var session = _metExploreViz.getSessionById(panel);
        var netWorkData = session.getD3Data();
        var myMask = metExploreD3.createLoadMask("Duplicate in progress...", panel);
        if(myMask!= undefined){

            metExploreD3.showMask(myMask);

            metExploreD3.deferFunction(function() {
                vis.selectAll("g.node")
                    .filter(function(d) {
                        return d.getIsSideCompound() && d.getBiologicalType()=="metabolite";
                    })
                    .filter(function(d){
                        if(this.getAttribute("duplicated")==undefined) return true;
                        else return !this.getAttribute("duplicated");
                    })
                    .each(function(node){

                        metExploreD3.GraphNetwork.duplicateSideCompound(node, panel);
                        sideCompounds.push(node);
                    });

                metExploreD3.hideMask(myMask);
                sideCompounds.forEach(function(sideC){
                    netWorkData.removeNode(sideC);
                    //metExploreD3.GraphNetwork.removeANode(sideC, panel);
                });


                var activePanel = _MyThisGraphNode.activePanel;
                if(!activePanel) activePanel='viz';
                metExploreD3.applyTolinkedNetwork(
                    activePanel,
                    function(panelLinked, sessionLinked) {
                        metExploreD3.GraphNetwork.updateNetwork(panelLinked, sessionLinked);
                    });

                metExploreD3.fireEvent("vizIdDrawing", "enableMakeClusters");
                if(_metExploreViz.isLinkedByTypeOfMetabolite()){
                    metExploreD3.GraphLink.linkTypeOfMetabolite();
                }

                var sessions = _metExploreViz.getSessionsSet();
                var aSession = _metExploreViz.getSessionById(panel);

                if (func!=undefined) {func()};

                if(panel!='viz' && aSession.isLinked()){
                    metExploreD3.fireEvent('graphPanel', 'afterDuplicate');
                }
                else
                {
                    for (var key in sessions) {
                        if(sessions[key].isLinked() && sessions[key].getId()!='viz')
                            metExploreD3.deferFunction(function() {

                                sessions[key].setLinked(false);
                                metExploreD3.GraphNetwork.looksLinked();

                                var force = sessions[key].getForce();
                                // force.restart();

                                var mainSession = _metExploreViz.getSessionById('viz');
                                if(sessions[key]!=undefined)
                                {
                                    if(mainSession.getDuplicatedNodesCount()>0){

                                        var force = sessions[key].getForce();
                                        sessions[key].setLinked(true);
                                        mainSession.setLinked(true);

                                        metExploreD3.GraphNetwork.duplicateSideCompounds(sessions[key].getId());

                                        metExploreD3.GraphNetwork.looksLinked();
                                        if(sessions[key].isLinked()){
                                            metExploreD3.GraphNetwork.graphAlignment(sessions[key].getId(), "viz");
                                        }
                                    }
                                    else
                                    {
                                        metExploreD3.GraphNetwork.graphAlignment(sessions[key].getId(), "viz");
                                        sessions[key].setLinked(true);
                                        mainSession.setLinked(true);
                                    }
                                }
                            }, 100);
                    };
                }
            }, 1);
        }
        metExploreD3.GraphNetwork.initCentroids(panel);
    },

    /*******************************************
     * Duplicate side compounds with an ids array
     * @param {} panel : The panel where the SC must be duplicated
     */
    duplicateSideCompoundsById : function(ids, panel){

        var vis = d3.select("#"+panel).select("#D3viz");
        var sideCompounds = [];
        var session = _metExploreViz.getSessionById(panel);
        var netWorkData = session.getD3Data();
        var myMask = metExploreD3.createLoadMask("Duplicate in progress...", panel);
        if(myMask!= undefined){

            metExploreD3.showMask(myMask);

            metExploreD3.deferFunction(function() {
                vis.selectAll("g.node")
                    .filter(function(d) {
                        return ids.indexOf(d.getId())!=-1;
                    })
                    .filter(function(d){
                        if(this.getAttribute("duplicated")==undefined) return true;
                        else return !this.getAttribute("duplicated");
                    })
                    .each(function(node){

                        metExploreD3.GraphNetwork.duplicateSideCompound(node, panel);
                        sideCompounds.push(node);
                    });


                metExploreD3.hideMask(myMask);
                sideCompounds.forEach(function(sideC){
                    netWorkData.removeNode(sideC);
                });


                var activePanel = _MyThisGraphNode.activePanel;
                if(!activePanel) activePanel='viz';
                metExploreD3.applyTolinkedNetwork(
                    activePanel,
                    function(panelLinked, sessionLinked) {
                        metExploreD3.GraphNetwork.updateNetwork(panelLinked, sessionLinked);
                    });

                metExploreD3.fireEvent("vizIdDrawing", "enableMakeClusters");


                if(_metExploreViz.isLinkedByTypeOfMetabolite()){
                    metExploreD3.GraphLink.linkTypeOfMetabolite();
                }

            }, 0);
        }
        metExploreD3.GraphNetwork.initCentroids(panel);
    },

    /*******************************************
     * Duplicate side compounds which is selected
     * @param {} panel : The panel where the SC must be duplicated
     */
    duplicateSideCompoundsSelected : function(panel) {
        var vis = d3.select("#"+panel).select("#D3viz");
        var sideCompounds = [];
        var session = _metExploreViz.getSessionById(panel);
        var netWorkData = session.getD3Data();
        var myMask = metExploreD3.createLoadMask("Duplicate in progress...", panel);
        if(myMask!= undefined){

            metExploreD3.showMask(myMask);

            metExploreD3.deferFunction(function() {
                vis.selectAll("g.node")
                    .filter(function(d) {
                        return d.isSelected() && d.getBiologicalType()=="metabolite";
                    })
                    .filter(function(d){
                        if(this.getAttribute("duplicated")==undefined) return true;
                        else return !this.getAttribute("duplicated");
                    })
                    .each(function(node){
                        if(metExploreD3.getMetabolitesSet()!=undefined){
                            var theMeta = metExploreD3.getMetaboliteById(metExploreD3.getMetabolitesSet(), node.getId());
                            theMeta.set("sideCompound", true);
                        }

                        node.setIsSideCompound(true);
                        metExploreD3.GraphNetwork.duplicateSideCompound(node, panel);
                        sideCompounds.push(node);
                    });


                metExploreD3.hideMask(myMask);
                sideCompounds.forEach(function(sideC){
                    netWorkData.removeNode(sideC);
                    //metExploreD3.GraphNetwork.removeANode(sideC, panel);
                });



                var activePanel = _MyThisGraphNode.activePanel;
                if(!activePanel) activePanel='viz';
                metExploreD3.applyTolinkedNetwork(
                    activePanel,
                    function(panelLinked, sessionLinked) {
                        metExploreD3.GraphNetwork.updateNetwork(panelLinked, sessionLinked);

                    });

                metExploreD3.fireEvent("vizIdDrawing", "enableMakeClusters");

                if(_metExploreViz.isLinkedByTypeOfMetabolite()){
                    metExploreD3.GraphLink.linkTypeOfMetabolite();
                }

                var sessions = _metExploreViz.getSessionsSet();
                var aSession = _metExploreViz.getSessionById(panel);

                if(panel!='viz' && aSession.isLinked()){
                    metExploreD3.fireEvent('graphPanel', 'afterDuplicate');
                }
                else
                {
                    for (var key in sessions) {
                        if(sessions[key].isLinked() && sessions[key].getId()!='viz')
                            metExploreD3.deferFunction(function() {

                                sessions[key].setLinked(false);
                                metExploreD3.GraphNetwork.looksLinked();

                                var force = sessions[key].getForce();
                                // force.restart();

                                var mainSession = _metExploreViz.getSessionById('viz');
                                if(sessions[key]!=undefined)
                                {
                                    if(mainSession.getDuplicatedNodesCount()>0){

                                        var force = sessions[key].getForce();
                                        sessions[key].setLinked(true);
                                        mainSession.setLinked(true);

                                        metExploreD3.GraphNetwork.duplicateSideCompoundsSelected(sessions[key].getId());

                                        metExploreD3.GraphNetwork.looksLinked();
                                        if(sessions[key].isLinked()){
                                            metExploreD3.GraphNetwork.graphAlignment(sessions[key].getId(), "viz");
                                        }
                                    }
                                    else
                                    {
                                        metExploreD3.GraphNetwork.graphAlignment(sessions[key].getId(), "viz");
                                        sessions[key].setLinked(true);
                                        mainSession.setLinked(true);
                                    }
                                }
                            }, 100);
                    };
                }
            }, 0);
        }
        metExploreD3.GraphNetwork.initCentroids(panel);
    },

    /*******************************************
     * Duplicate a side compound which is selected
     * @param {} panel : The panel where the SC must be duplicated
     */
    duplicateASideCompoundSelected : function(theNode, panel) {
        var session = _metExploreViz.getSessionById(panel);
        var netWorkData = session.getD3Data();

        var vis = d3.select("#"+panel).select("#D3viz");
        var sideCompounds = [];

        var myMask = metExploreD3.createLoadMask("Duplicate in progress...", panel);
        if(myMask!= undefined){

            metExploreD3.showMask(myMask);


            metExploreD3.deferFunction(function() {

                if(!theNode.isDuplicated()){
                    if(metExploreD3.getMetabolitesSet()!=undefined){
                        var theMeta = metExploreD3.getMetaboliteById(metExploreD3.getMetabolitesSet(), theNode.getId());
                        theMeta.set("sideCompound", true);
                    }
                    theNode.setIsSideCompound(true);
                    metExploreD3.GraphNetwork.duplicateSideCompound(theNode, panel);
                    sideCompounds.push(theNode);
                }


                metExploreD3.hideMask(myMask);
                sideCompounds.forEach(function(sideC){
                    netWorkData.removeNode(sideC);
                    // metExploreD3.GraphNetwork.removeANode(sideC, panel);
                });


                var activePanel = _MyThisGraphNode.activePanel;
                if(!activePanel) activePanel='viz';
                metExploreD3.applyTolinkedNetwork(
                    activePanel,
                    function(panelLinked, sessionLinked) {
                        metExploreD3.GraphNetwork.updateNetwork(panelLinked, sessionLinked);
                    });

                metExploreD3.fireEvent("vizIdDrawing", "enableMakeClusters");


                if(_metExploreViz.isLinkedByTypeOfMetabolite()){
                    metExploreD3.GraphLink.linkTypeOfMetabolite();
                }

                var sessions = _metExploreViz.getSessionsSet();
                var aSession = _metExploreViz.getSessionById(panel);

                if(panel!='viz' && aSession.isLinked()){
                    metExploreD3.fireEvent('graphPanel', 'afterDuplicate');
                }
                else
                {
                    for (var key in sessions) {
                        if(sessions[key].isLinked() && sessions[key].getId()!='viz')
                        {
                            metExploreD3.deferFunction(function() {

                                sessions[key].setLinked(false);
                                metExploreD3.GraphNetwork.looksLinked();

                                var force = sessions[key].getForce();
                                // force.restart();

                                var mainSession = _metExploreViz.getSessionById('viz');
                                if(sessions[key]!=undefined)
                                {
                                    if(mainSession.getDuplicatedNodesCount()>0){

                                        var force = sessions[key].getForce();
                                        sessions[key].setLinked(true);
                                        mainSession.setLinked(true);

                                        var node = sessions[key].getD3Data().getNodeById(theNode.getId());
                                        metExploreD3.GraphNetwork.duplicateASideCompoundSelected(node, sessions[key].getId());

                                        metExploreD3.GraphNetwork.looksLinked();
                                        if(sessions[key].isLinked()){
                                            metExploreD3.GraphNetwork.graphAlignment(sessions[key].getId(), "viz");
                                        }
                                    }
                                    else
                                    {
                                        metExploreD3.GraphNetwork.graphAlignment(sessions[key].getId(), "viz");
                                        sessions[key].setLinked(true);
                                        mainSession.setLinked(true);
                                    }
                                }
                            }, 100);
                        }
                    }
                }
            }, 0);
        }
        metExploreD3.GraphNetwork.initCentroids(panel);
    },

    /*******************************************
     * Duplication of side compounds
     * @param {} theNodeElement : node to duplicate
     * @param {} panel :panel where node must be duplicated
     */
    duplicateSideCompound : function(theNodeElement, panel){

        metExploreD3.GraphFunction.removeCycleContainingNode(theNodeElement);
        var session = _metExploreViz.getSessionById(panel);

        var vis = d3.select("#"+panel).select("#D3viz");

        if(session!=undefined)
        {
            // We stop the previous animation
            if(session.isLinked()){
                var session = _metExploreViz.getSessionById('viz');
                if(session!=undefined)
                {
                    var force = session.getForce();
                    if(force!=undefined)
                    {
                        if(metExploreD3.GraphNetwork.isAnimated("viz")== "true" || metExploreD3.GraphNetwork.isAnimated("viz")==true)
                            force.restart();
                    }
                }
            }
            else
            {

                var force = session.getForce();
                if(force!=undefined)
                {
                    if(metExploreD3.GraphNetwork.isAnimated(panel)== "true" || metExploreD3.GraphNetwork.isAnimated(panel)==true)
                        force.restart();

                }
            }
        }
        metExploreD3.GraphNetwork.duplicateANode(theNodeElement, panel);


        if(session!=undefined)
        {
            if(force!=undefined)
            {
                if(metExploreD3.GraphNetwork.isAnimated(panel)== "true" || metExploreD3.GraphNetwork.isAnimated(panel)==true)
                    force.restart();
            }
        }
        metExploreD3.GraphNetwork.initCentroids(panel);
    },

    /*******************************************
     * Remove selected nodes
     * @param {} panel : The panel where are selected nodes
     */
    removeSelectedNode : function(panel) {
        var session = _metExploreViz.getSessionById(panel);

        var myMask = metExploreD3.createLoadMask("Remove in process...", panel);
        if(myMask!= undefined){

            metExploreD3.showMask(myMask);

            // listMask.push(myMask);

            metExploreD3.deferFunction(function() {

                if(session!=undefined)
                {
                    // We stop the previous animation
                    if(session.isLinked()){
                        var session = _metExploreViz.getSessionById('viz');
                        if(session!=undefined)
                        {
                            var force = session.getForce();
                            if(force!=undefined)
                            {
                                if(metExploreD3.GraphNetwork.isAnimated("viz")=="true")
                                    force.restart();
                            }
                        }
                    }
                    else
                    {

                        var force = session.getForce();
                        if(force!=undefined)
                        {
                            if(metExploreD3.GraphNetwork.isAnimated(panel)=="true")
                                force.restart();

                        }
                    }
                }

                metExploreD3.applyTolinkedNetwork(
                    panel,
                    function(panelLinked, sessionLinked) {
                        var networkData = sessionLinked.getD3Data();
                        var vis = d3.select("#"+panelLinked).select("#D3viz");
                        var nodeToRemove = [];
                        vis.selectAll("g.node")
                            .filter(function(d) {
                                return d.isSelected();
                            })
                            .each(function(node){
                                nodeToRemove.push(node);
                            });


                        metExploreD3.GraphNetwork.removeIsolatedNode(nodeToRemove, panelLinked);

                        nodeToRemove.forEach(function(node){
                                networkData.removeNode(node);
                            });


                        metExploreD3.GraphNetwork.updateNetwork(panelLinked, sessionLinked);

                    });

                metExploreD3.fireEvent("vizIdDrawing", "enableMakeClusters");

                if(session!=undefined)
                {
                    if(force!=undefined)
                    {
                        if(metExploreD3.GraphNetwork.isAnimated(panel)=="true")
                            force.restart();
                    }
                }

                metExploreD3.hideMask(myMask);
            }, 1);
        }
        metExploreD3.GraphNetwork.initCentroids(panel);
    },

    /*******************************************
     * Remove only clicked node
     * @param {} panel : The panel where are selected nodes
     */
    removeOnlyClickedNode : function(theNode, panel) {
        var session = _metExploreViz.getSessionById(panel);

        var myMask = metExploreD3.createLoadMask("Remove in process...", panel);
        if(myMask!= undefined){

            metExploreD3.showMask(myMask);

            // listMask.push(myMask);

            metExploreD3.deferFunction(function() {

                if(session!=undefined)
                {
                    // We stop the previous animation
                    if(session.isLinked()){
                        var session = metExploreD3.getSessionById(sessionsStore, 'viz');
                        if(session!=undefined)
                        {
                            var force = session.getForce();
                            if(force!=undefined)
                            {
                                if(metExploreD3.GraphNetwork.isAnimated("viz")=="true")
                                    force.restart();
                            }
                        }
                    }
                    else
                    {

                        var force = session.getForce();
                        if(force!=undefined)
                        {
                            if(metExploreD3.GraphNetwork.isAnimated(panel)=="true")
                                force.restart();

                        }
                    }
                }

                var activePanel = _MyThisGraphNode.activePanel;
                if(!activePanel) activePanel='viz';
                metExploreD3.applyTolinkedNetwork(
                    panel,
                    function(panelLinked, sessionLinked) {
                        var networkData = sessionLinked.getD3Data();
                        var n = networkData.getNodeByDbIdentifier(theNode.getDbIdentifier());
                        metExploreD3.GraphNetwork.removeIsolatedNode([n], panelLinked);
                        networkData.removeNode(n);

                        metExploreD3.GraphNetwork.updateNetwork(panelLinked, sessionLinked);

                    });

                if(session!=undefined)
                {
                    if(force!=undefined)
                    {
                        if(metExploreD3.GraphNetwork.isAnimated(panel)=="true")
                            force.restart();
                    }
                }

                metExploreD3.hideMask(myMask);
            }, 100);
        }
    },

    updateNetwork : function(panelLinked, sessionLinked){
        metExploreD3.GraphNode.refreshNode(panelLinked);

        var linkStyle = metExploreD3.getLinkStyle();

        metExploreD3.GraphLink.refreshDataLink(panelLinked, sessionLinked);
        metExploreD3.GraphLink.refreshLink(panelLinked, linkStyle);

        var s_GeneralStyle = _metExploreViz.getGeneralStyle();


        metExploreD3.GraphCaption.majCaption(panelLinked);

        if(s_GeneralStyle.isDisplayedConvexhulls()==="Pathways") {
            s_GeneralStyle.setDisplayConvexhulls(false);
            metExploreD3.GraphLink.displayConvexhulls(panelLinked);
            metExploreD3.GraphNetwork.tick(panelLinked);

            s_GeneralStyle.setDisplayConvexhulls("Pathways");
            metExploreD3.GraphLink.displayConvexhulls(panelLinked);
            metExploreD3.GraphNetwork.tick(panelLinked);

            s_GeneralStyle.setDisplayCaption("Pathways");
            metExploreD3.GraphCaption.majCaption(panelLinked);
        }
        var networkData = sessionLinked.getD3Data();
        var force = sessionLinked.getForce();

        // Get bound effect
        // console.log(force.alpha());
        var visibleLinks = networkData.getLinks()
            .filter(function (link) {
                var target, source;
                target = link.getTarget();
                source = link.getSource();

                return !source.isHidden() && !target.isHidden();
            });

        var visibleNodes = networkData.getNodes()
            .filter(function (node) {
                return !node.isHidden();
            });

        force
            .nodes(visibleNodes)
            .links(visibleLinks);

        metExploreD3.GraphNetwork.tick(panelLinked);
        if(sessionLinked!=undefined)
        {
            if(force!=undefined)
            {
                if(metExploreD3.GraphNetwork.isAnimated(panelLinked)=="true")
                    force.restart();
            }
        }
        metExploreD3.fireEvent("vizIdDrawing", "enableMakeClusters");
    },

    /*******************************************
     * Remove a node from convex hull (pathway or compartment)
     * @param {} theNode : The node to remove
     * @param {} panel : The panel
     */
    removeNodeFromConvexHull : function(theNode, panel, setdata) {
        if(setdata===undefined) setdata=true;
        var session = _metExploreViz.getSessionById(panel);
        // Remove the node from group to draw convex hulls

        session.groups.forEach(function(group){


            var nodeToRemove = group.values.find(function (node) {
                return theNode.getId() === node.getId();
            });

            if(nodeToRemove!=null){

                var componentDisplayed = metExploreD3.getGeneralStyle().isDisplayedConvexhulls();

                var index = group.values.indexOf(nodeToRemove);
                group.values.splice(index, 1);
                if(componentDisplayed=="Compartments") {


                    var metabolitesInCompartment = group.values.filter(function getMetabolite(node) {
                        return node.getBiologicalType() == "metabolite";
                    })

                    if (metabolitesInCompartment.length == 0) {
                        index = session.groups.indexOf(group);
                        if (index != -1) {
                            d3.select("#" + panel).select("#D3viz")
                                .selectAll("path.convexhull")
                                .filter(function (conv) {
                                    return conv.key == group.key;
                                })
                                .remove();
                        }
                        if(setdata){
                            var compartment = session.getD3Data().getCompartmentByName(group.key);
                            if (compartment != null)
                                session.getD3Data().removeCompartment(session.getD3Data().getCompartmentByName(group.key));

                            group.values = [];
                            session.removeAGroup(group);
                        }
                    }
                }
                else {

                    var reactionsInPathway = group.values.filter(function getReaction(node) {
                        return node.getBiologicalType() == "reaction";
                    })

                    if (reactionsInPathway.length == 0) {
                        index = session.groups.indexOf(group);
                        if (index != -1) {
                            d3.select("#" + panel).select("#D3viz")
                                .selectAll("path.convexhull")
                                .filter(function (conv) {
                                    return conv.key == group.key;
                                })
                                .remove();
                        }
                        var pathway = session.getD3Data().getPathwayByName(group.key);
                        if(setdata) {
                            if (pathway != null)
                                session.getD3Data().removePathway(session.getD3Data().getPathwayByName(group.key));

                            group.values.forEach(function (metabolite) {
                                var theMeta = session.getD3Data().getNodeById(metabolite.getId());
                                theMeta.removePathway(group.key);
                                metabolite.removePathway(group.key);
                            })
                            group.values = [];
                            session.removeAGroup(group);
                        }
                    }
                }
            }

        });
    },

    /*******************************************
     * Remove node which is Isolated
     * @param {} panel : The panel
     */
    removeIsolatedNode : function(nodeRemoved, panel) {
        var session = _metExploreViz.getSessionById(panel);
        var networkData = session.getD3Data();
        var nodesToRemove = [];
        var vis = d3.select("#"+panel).select("#D3viz");

        var arrayId = [];
        var nodes = networkData.getNodes()
            .filter(function (node) {
                return !node.isHidden();
            })
            .map(function(node){
                return node.getId();
            });

        networkData.getLinks()
            .forEach(function (l) {
                var source = l.getSource();
                var target = l.getTarget();
                if(nodeRemoved.includes(source)) nodesToRemove.push(target);
                if(nodeRemoved.includes(target)) nodesToRemove.push(source);
            });

        nodesToRemove
            .filter(function(n){
                var linkWithTheNode = networkData.getLinks().filter(function (l) {
                    var source = l.getSource();
                    var target = l.getTarget();
                    if(n===source || n===target) return true;
                    return false;
                });

                if(linkWithTheNode.length>1) return false;
                return true;
            })
            .forEach(function(node){
                // Remove the node from group to draw convex hulls
                metExploreD3.GraphNetwork.removeNodeFromConvexHull(node, panel);
                networkData.removeNode(node);
            })
    },

    /*******************************************
     * Remove side compounds
     */
    removeSideCompounds : function(){
        var session = _metExploreViz.getSessionById("viz");
        var networkData = session.getD3Data();
        var nodeToRemove = [];

        var vis = d3.select("#viz").select("#D3viz");
        vis.selectAll("g.node")
            .filter(function(d) {
                return d.getBiologicalType()=="metabolite" && d.getIsSideCompound();
            })
            .each(function(node){
                nodeToRemove.push(node);
                networkData.removeNode(node);
            });

        var activePanel = _MyThisGraphNode.activePanel;
        if(!activePanel) activePanel='viz';
        metExploreD3.applyTolinkedNetwork(
            activePanel,
            function(panelLinked, sessionLinked) {
                metExploreD3.GraphNetwork.updateNetwork(panelLinked, sessionLinked);
            });

        metExploreD3.GraphNetwork.tick(panel);
        metExploreD3.fireEvent("vizIdDrawing", "enableMakeClusters");
        metExploreD3.GraphNetwork.initCentroids("viz");
    },

    /*******************************************
     * Update animation of graph
     * @param {} panel : The panel to animate or not
     * @param {} bool
     */
    setAnimated: function(panel, bool){
        if(bool){
            d3.select("#"+panel).select("#D3viz").attr("animation", "true");
            _metExploreViz.getSessionById(panel).setAnimated(true);
        }
        else
        {
            d3.select("#"+panel).select("#D3viz").attr("animation", "false");
            _metExploreViz.getSessionById(panel).setAnimated(false);
        }
    },

    /*******************************************
     * True if graph is animated
     * @param {} panel : The panel animated or not
     */
    isAnimated : function(panel){
        return d3.select("#"+panel).select("#D3viz").attr("animation");
    },

    /*******************************************
     * Function to select all nodes (back-end)
     * @param {} panel
     */
    selectAllNodes : function(panel){
        return d3.select("#"+panel).select("#D3viz").selectAll("g.node");
    },

    /*******************************************
     * Function to stop force
     */
    stopForce : function(session){
        var force = session.getForce();
        if(force!=undefined)
        {
            force.stop();
            metExploreD3.GraphNetwork.setAnimated(session.getId(), false);
        }
    },

    defineInteractionButtons : function(panel){
        var tooltip =  d3.select("#"+panel).select('#tooltipButtons');

        d3
            .select("#"+panel)
            .select("#D3viz")
            .append("svg:g")
            .attr("class","buttonLink").attr("id","buttonLink")
            .attr("isLink", "false")
            .on("click", metExploreD3.GraphNetwork.setLink)
            .on("mouseover", function(){
                tooltip.text("Link compared networks");
                return tooltip.style("top", "55px").style("left","50px").style("visibility", "visible");
            })
            .on("mouseout", function(){
                return tooltip.style("visibility", "hidden");
            })
            .style("cursor", "hand")
            .append("image")
            .attr("xlink:href", document.location.href.split("index.html")[0] + "resources/icons/unlink.svg")
            .attr("width", "50")
            .attr("height", "50")
            .attr("transform", "translate(10,50) scale(.5)");

        d3
            .select("#"+panel)
            .select("#D3viz")
            .append("svg:g")
            .attr("class","buttonExportCoordinates").attr("id","buttonExportCoordinates")
            .on("click", function(){
                metExploreD3.GraphNetwork.animationButtonOff("viz");
                metExploreD3.GraphNetwork.graphAlignment("viz", panel);
            })
            .style("cursor", "hand")
            .append("image")
            .attr("xlink:href", document.location.href.split("index.html")[0] + "resources/icons/exportCoordinates.png")
            .attr("width", "50")
            .attr("height", "50")
            .attr("transform", "translate(10,90) scale(.5)")
            .on("mouseup", function(){
                d3.select(this).attr("transform", "translate(10,90) scale(.5)");
            })
            .on("mousedown", function(){
                d3.select(this).attr("transform", "translate(10,90) scale(.46)");
            })
            .on("mouseover", function(){
                tooltip.text("Assign coordinates from "+ _metExploreViz.getComparedPanelById(panel).getTitle() +" to main");
                return tooltip.style("top", "95px").style("left","50px").style("visibility", "visible");
            })
            .on("mouseout", function(){
                return tooltip.style("visibility", "hidden");
            });

        d3
            .select("#"+panel)
            .select("#D3viz")
            .append("svg:g")
            .attr("class","buttonImportCoordinates").attr("id","buttonImportCoordinates")
            .on("click", function(){
                metExploreD3.GraphNetwork.animationButtonOff(panel);
                metExploreD3.GraphNetwork.graphAlignment(panel, "viz");
            })
            .style("cursor", "hand")
            .append("image")
            .attr("xlink:href", document.location.href.split("index.html")[0] + "resources/icons/importCoordinates.png")
            .attr("width", "50")
            .attr("height", "50")
            .attr("transform", "translate(10,130) scale(.5)")
            .on("mouseup", function(){
                d3.select(this).attr("transform", "translate(10,130) scale(.5)");
            })
            .on("mousedown", function(){
                d3.select(this).attr("transform", "translate(10,130) scale(.46)");
            })
            .on("mouseover", function(){
                tooltip.text("Assign coordinates from main to "+ _metExploreViz.getComparedPanelById(panel).getTitle());
                return tooltip.style("top", "135px").style("left","50px").style("visibility", "visible");
            })
            .on("mouseout", function(){
                return tooltip.style("visibility", "hidden");
            });

        d3
            .select("#"+panel)
            .select("#D3viz")
            .append("svg:g")
            .attr("class","buttonAlignMapping").attr("id","buttonAlignMapping")
            .on("click", metExploreD3.GraphNetwork.mappingAlignment)
            .style("cursor", "hand")
            .append("image")
            .attr("xlink:href", document.location.href.split("index.html")[0] + "resources/icons/alignMapping.svg")
            .attr("width", "50")
            .attr("height", "50")
            .attr("transform", "translate(10,170) scale(.5)")
            .on("mouseup", function(){
                d3.select(this).attr("transform", "translate(10,170) scale(.5)");
            })
            .on("mousedown", function(){
                d3.select(this).attr("transform", "translate(10,170) scale(.46)");
            })
            .on("mouseover", function(){
                tooltip.text("Copy main mapping on "+ _metExploreViz.getComparedPanelById(panel).getTitle());
                return tooltip.style("top", "175px").style("left","50px").style("visibility", "visible");
            })
            .on("mouseout", function(){
                return tooltip.style("visibility", "hidden");
            });
    },

    defineBasalButtons : function(panel, animated){
        var tooltipPathways = d3
            .select("#"+panel)
            .select("#D3viz")
            .append("g")
            .attr("id", "tooltipPathways")
            .attr('dy', '20')
            .style("position", "absolute");

        tooltipPathways
            .append("path")
            .attr("id", "tooltipPathwaysPath")
            .style("fill", "#005EFF")
            .attr("d","M 0,0 L -10,-10 H -60 Q -70,-10 -70,-20 V -50 Q -70,-60 -60,-60 H 60 Q 70,-60 70,-50 V -20 Q 70,-10 60,-10 H 10 Z");

        var tooltipText = tooltipPathways
            .append("text")
            .style("fill", "white")
            .attr("id", "tooltipPathwaysText")
            .attr("transform","translate(0, -40) scale(1,1)")
            .style("text-anchor","middle");

        tooltipText.text('');
        var nameDOMFormat = $("<div/>").html("").text();
        tooltipText.append('tspan')
            .text(nameDOMFormat)
            .attr('id', 'tooltipTextPathwayCoverage');

        nameDOMFormat = $("<div/>").html("").text();

        var tspan = tooltipText.append('tspan')
            .attr('id', 'tooltipTextPathwayEnrichment')
            .text(nameDOMFormat);
        tspan.attr('x', '0')
            .attr('dy', '20');

        var tooltip = d3
            .select("#"+panel)
            .append("div")
            .attr("id", "tooltipButtons")
            .style("z-index", "10")
            .style("visibility", "hidden");

        var h = parseInt(metExploreD3.GraphPanel.getHeight(panel));
        var w = parseInt(metExploreD3.GraphPanel.getWidth(panel));
        d3
            .select("#"+panel)
            .select("#D3viz")
            .attr("animation", function(){
                if(animated)
                    return "true";
                else
                    return "false";
            })
            .append("svg:g")
            .attr("class","buttonAnim").attr("id","buttonAnim")
            .on("click", metExploreD3.GraphNetwork.play)
            .style("cursor", "hand")
            .append("image")
            .attr("xlink:href", function(){
                if(animated)
                    return document.location.href.split("index.html")[0] + "resources/icons/pause.svg";
                else
                    return document.location.href.split("index.html")[0] + "resources/icons/play.svg";
            })
            .attr("width", "50")
            .attr("height", "50")
            .attr("transform", "translate(10,10) scale(.5)");

        d3
            .select("#"+panel)
            .select("#D3viz")
            .append("svg:g")
            .attr("class","buttonRescale").attr("id","buttonRescale")
            .on("click", function(){
                metExploreD3.GraphNetwork.rescale(panel);
            })
            .style("cursor", "hand")
            .append("image")
            .attr("xlink:href", function(){
                return document.location.href.split("index.html")[0] + "resources/icons/rescale.png";
            })
            .attr("width", "50")
            .attr("height", "50")
            .attr("transform", "translate(80,10) scale(.5)")
            .on("mouseup", function(){
                d3.select(this).attr("transform", "translate(80,10) scale(.5)");
            })
            .on("mousedown", function(){
                d3.select(this).attr("transform", "translate(80,10) scale(.46)");
            })
            .on("mouseover", function(){
                tooltip.text("Center network on window");
                return tooltip.style("top", "15px").style("left","120px").style("visibility", "visible");
            })
            .on("mouseout", function(){
                return tooltip.style("visibility", "hidden");
            });

        d3
            .select("#"+panel)
            .select("#D3viz")
            .append("svg:g")
            .attr("class","buttonZoomIn").attr("id","buttonZoomIn")
            .attr('x', (w-60))
            .attr('y', 10)
            .on("click", metExploreD3.GraphNetwork.zoomIn)
            .style("cursor", "hand")
            .append("image")
            .attr("xlink:href", document.location.href.split("index.html")[0] + "resources/icons/zoomin.svg")
            .attr("width", "50")
            .attr("height", "50")
            .style("opacity", 0.2)
            .attr("transform", "translate("+(w-60)+",10) scale(1)")
            .on("mouseover", function(d) {
                d3.select(this).transition().duration(500).style("opacity", 1);
            })
            .on("mouseout", function(d) {
                d3.select(this).transition().duration(500).style("opacity", 0.2);
            });


        d3
            .select("#"+panel)
            .select("#D3viz")
            .append("svg:g")
            .attr("class","buttonZoomOut").attr("id","buttonZoomOut")
            .attr('x', (w-110))
            .attr('y', 10)
            .on("click", metExploreD3.GraphNetwork.zoomOut)
            .style("cursor", "hand")
            .append("image")
            .attr("xlink:href", document.location.href.split("index.html")[0] + "resources/icons/zoomout.svg")
            .attr("width", "50")
            .attr("height", "50")
            .style("opacity", 0.2)
            .attr("transform", "translate("+(w-110)+",10) scale(1)")
            .on("mouseover", function(d) {
                d3.select(this).transition().duration(500).style("opacity", 1);
            })
            .on("mouseout", function(d) {
                d3.select(this).transition().duration(500).style("opacity", 0.2);
            });

        d3
            .select("#"+panel)
            .select("#D3viz")
            .append("svg:g")
            .attr("class","buttonHand").attr("id","buttonHand")
            .attr('x', (w-160))
            .attr('y', 10)
            .attr("scrollable", "false")
            .on("click", metExploreD3.GraphNetwork.moveGraph)
            .style("opacity", 1)
            .style("cursor", "hand")
            .append("image")
            .attr("xlink:href", document.location.href.split("index.html")[0] + "resources/icons/handcursor.svg")
            .attr("width", "50")
            .attr("height", "50")
            .attr("transform", "translate("+(w-160)+",10) scale(1)");

        d3
            .select("#"+panel)
            .select("#D3viz")
            .select("buttonHand")
            .style("opacity", 0);

        d3.select('#'+panel)
            .on("mouseover", function(){
                d3.select("#"+panel)
                    .select("#D3viz")
                    .select("#buttonZoomOut")
                    .transition().duration(500).style("opacity", 1);

                d3.select("#"+panel)
                    .select("#D3viz")
                    .select("#buttonZoomIn")
                    .transition().duration(500).style("opacity", 1);

                var session = _metExploreViz.getSessionById(panel);
                // if visualisation is actived we add item to menu
                if(session.isActive()){
                    var scrollable = d3.select("#"+panel).select("#buttonHand").attr("scrollable");
                    if(scrollable == "false")
                        d3.select("#"+panel)
                            .select("#D3viz")
                            .select("#buttonHand")
                            .transition().duration(500).style("opacity", 0.2);
                    else
                        d3.select("#"+panel)
                            .select("#D3viz")
                            .select("#buttonHand")
                            .transition().duration(500).style("opacity", 1);
                }

            })
            .on("mouseout", function(){
                d3.select("#"+panel)
                    .select("#D3viz")
                    .select("#buttonZoomOut")
                    .transition().duration(500).style("opacity", 0);

                d3.select("#"+panel)
                    .select("#D3viz")
                    .select("#buttonZoomIn")
                    .transition().duration(500).style("opacity", 0);

                d3.select("#"+panel)
                    .select("#D3viz")
                    .select("#buttonHand")
                    .transition().duration(500).style("opacity", 0);
            });
    }
};
