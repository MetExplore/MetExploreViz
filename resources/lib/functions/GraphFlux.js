/**
 * @class metExploreD3.GraphFlux
 * Function to manage flux data
 *
 * Map flux data on nodes
 *
 * @author JCG
 * @uses metExploreD3.GraphLink
 * @uses metExploreD3.GraphStyleEdition
 * @uses metExploreD3.GraphCaption
 */

metExploreD3.GraphFlux = {

    /**
     * Get the parameters from flux panel and call display function
     * @param {Array} fluxData flux values
     * @param {String} targetLabel label use in dataset
     * @param {String} nbCol number of condition to visualize
     * @param {String} color color associated conditions
     * @param {String} scaleSelector scale selected
     * @param {Array} scaleRange1 scale range for the first condition
     * @param {Array} scaleRange2 scale range for the second condition
     */
    displayChoice: function(fluxData, targetLabel, nbCol, color, scaleSelector, scaleRange1){
        var session = _metExploreViz.getSessionById('viz');
        var networkData = session.getD3Data();

        if (nbCol === "one"){
            this.oneCompute(fluxData, networkData, targetLabel, color, scaleSelector, scaleRange1);
        }
        if (nbCol === "two"){
            this.twoCompute(fluxData, networkData, targetLabel, color, scaleSelector, scaleRange1);
        }
    },

    /**
     * Create scale range from flux data
     * @param {Array} fluxData flux values
     * @param {String} targetLabel label use in dataset
     */
    getScale: function(fluxData, targetLabel){
        var valuesPos = [];
        var valuesNeg = [];
        var session = _metExploreViz.getSessionById('viz');
        var networkData = session.getD3Data();

        for (var i = 0; i < fluxData.length; i++){
            if (targetLabel === "Name"){
                var nodes = networkData.getNodeByName(fluxData[i][0]);
            }
            if (targetLabel === "reactionId"){
                var nodes = networkData.getNodeById(fluxData[i][0]);
            }
            if (targetLabel === "Identifier"){
                var nodes = networkData.getNodeByDbIdentifier(fluxData[i][0]);
            }

            if (nodes !== undefined){
                var value = parseInt(fluxData[i][1], 10);
                if (value > 0){
                    valuesPos.push(value);
                }
                if (value < 0){
                    valuesNeg.push(value);
                }
            }
        }
        var distribPos = metExploreD3.GraphFlux.fluxDistribution(valuesPos);
        var distribNeg = metExploreD3.GraphFlux.fluxDistribution(valuesNeg);

        if (distribNeg["max"] !== undefined && distribNeg["min"] !== undefined){
            var minNeg = distribNeg["min"];
            var maxNeg = distribNeg["max"];
        }
        if (distribPos["max"] !== undefined && distribPos["min"] !== undefined){
            var minPos = distribPos["min"];
            var maxPos = distribPos["max"];
        }

        if (maxPos > maxNeg*(-1)){
            maxNeg = maxPos*(-1);
        }
        if (maxPos < maxNeg*(-1)) {
            maxPos = maxNeg*(-1);
        }

        if (minPos < minNeg*(-1)){
            minNeg = minPos*(-1);
        }
        if (minPos > minNeg*(-1)) {
            minPos = minNeg*(-1);
        }

        if (maxPos !== undefined && maxNeg !== undefined){
            var scaleRange = [
                {id:"begin",value:maxNeg,styleValue:5},
                {id:1,value:maxNeg,styleValue:5},
                {id:2,value:minNeg,styleValue:1},
                {id:3,value:minPos,styleValue:1},
                {id:4,value:maxPos,styleValue:5},
                {id:"end",value:maxPos,styleValue:5}
            ];
            if (maxPos === minPos && maxNeg !== minNeg){
                var shift = maxPos / 2;
                var min = maxPos - shift;
                var max = maxPos + shift;
                var scaleRange = [
                    {id:"begin",value:maxNeg,styleValue:5},
                    {id:1,value:maxNeg,styleValue:5},
                    {id:2,value:minNeg,styleValue:1},
                    {id:3,value:min,styleValue:1},
                    {id:4,value:maxPos,styleValue:3},
                    {id:5,value:max,styleValue:5},
                    {id:"end",value:max,styleValue:5}
                ];
            }
            if (maxPos !== minPos && maxNeg === minNeg){
                var shift = maxNeg / 2;
                var min = maxNeg + shift;
                var max = maxNeg - shift;
                var scaleRange = [
                    {id:"begin",value:max,styleValue:5},
                    {id:1,value:max,styleValue:5},
                    {id:2,value:maxNeg,styleValue:3},
                    {id:2,value:min,styleValue:1},
                    {id:3,value:minPos,styleValue:1},
                    {id:4,value:maxPos,styleValue:5},
                    {id:"end",value:maxPos,styleValue:5}
                ];
            }
            if (maxPos === minPos && maxNeg === minNeg){
                var shiftPos = maxPos / 2;
                var minPos = maxPos - shiftPos;
                var maxPos = maxPos + shiftPos;
                var shiftNeg = maxNeg / 2;
                var minNeg = maxNeg + shiftNeg;
                var maxNeg = maxNeg - shiftNeg;
                var scaleRange = [
                    {id:"begin",value:minNeg,styleValue:5},
                    {id:1,value:minNeg,styleValue:5},
                    {id:2,value:maxNeg,styleValue:3},
                    {id:3,value:maxNeg,styleValue:1},
                    {id:4,value:minPos,styleValue:1},
                    {id:5,value:maxPos,styleValue:3},
                    {id:6,value:maxPos,styleValue:5},
                    {id:"end",value:maxPos,styleValue:5}
                ];
            }
        }

        if (maxPos !== undefined && maxNeg === undefined){
            var scaleRange = [
                {id:"begin",value:minPos,styleValue:1},
                {id:1,value:minPos,styleValue:1},
                {id:2,value:maxPos,styleValue:5},
                {id:"end",value:maxPos,styleValue:5}
            ];
            if (maxPos === minPos){
                var shift = maxPos / 2;
                var min = maxPos - shift;
                var max = maxPos + shift;
                var scaleRange = [
                    {id:"begin",value:min,styleValue:1},
                    {id:1,value:min,styleValue:1},
                    {id:2,value:maxPos,styleValue:3},
                    {id:3,value:max,styleValue:5},
                    {id:"end",value:max,styleValue:5}
                ];
            }
        }

        if (maxPos === undefined && maxNeg !== undefined){
            var scaleRange = [
                {id:"begin",value:maxNeg,styleValue:5},
                {id:1,value:maxNeg,styleValue:5},
                {id:2,value:minNeg,styleValue:1},
                {id:"end",value:minNeg,styleValue:1}
            ];
            if (maxNeg === minNeg){
                var shift = maxNeg / 2;
                var min = maxNeg + shift;
                var max = maxNeg - shift;
                var scaleRange = [
                    {id:"begin",value:max,styleValue:5},
                    {id:1,value:max,styleValue:5},
                    {id:2,value:maxNeg,styleValue:3},
                    {id:3,value:min,styleValue:1},
                    {id:"end",value:min,styleValue:1}
                ];
            }
        }

        return scaleRange;
    },

    /**
     * Display flux visualisation for one condition
     * @param {Array} fluxData flux values
     * @param {NetworkData} networkData
     * @param {String} targetLabel label use in dataset
     * @param {String} color color associated conditions
     * @param {String} scaleSelector scale selected
     * @param {Array} scaleRange scale range
     */
    oneCompute: function(fluxData, networkData, targetLabel, color, scaleSelector, scaleRange){
        var valuePos = {};
        var valueNeg = {};
        var valDistri = [];

        for (var i = 0; i < fluxData.length; i++){

            if (targetLabel === "Name"){
                var nodes = networkData.getNodeByName(fluxData[i][0]);
            }
            if (targetLabel === "reactionId"){
                var nodes = networkData.getNodeById(fluxData[i][0]);
            }
            if (targetLabel === "Identifier"){
                var nodes = networkData.getNodeByDbIdentifier(fluxData[i][0]);
            }

            if (nodes !== undefined){
                var value = parseInt(fluxData[i][1], 10);
                if (value === 0){
                    nodes.fluxDirection1 = value;
                    nodes.valueCond1 = value;
                    nodes.color1 = color;
                }
                if (value > 0){
                    valuePos[nodes.id] = value;
                    valDistri.push(value);
                    nodes.valueCond1 = value;
                }
                if (value < 0){
                    valueNeg[nodes.id] = value;
                    valDistri.push(value*(-1));
                    nodes.valueCond1 = value;
                }
            }
        }

        var distrib = metExploreD3.GraphFlux.fluxDistribution(valDistri);

        for (var i = 0; i < fluxData.length; i++){

            if (targetLabel === "Name"){
                var nodes = networkData.getNodeByName(fluxData[i][0]);
            }
            if (targetLabel === "reactionId"){
                var nodes = networkData.getNodeById(fluxData[i][0]);
            }
            if (targetLabel === "Identifier"){
                var nodes = networkData.getNodeByDbIdentifier(fluxData[i][0]);
            }

            if (nodes !== undefined){
                if (Object.keys(valuePos).includes(nodes.id)){
                    var edgeWidth = metExploreD3.GraphFlux.computeWidth(distrib, valuePos[nodes.id], scaleSelector, scaleRange);
                    nodes.fluxDirection1 = edgeWidth;
                    nodes.color1 = color;
                }
                if (Object.keys(valueNeg).includes(nodes.id)){
                    var edgeWidth = metExploreD3.GraphFlux.computeWidth(distrib, valueNeg[nodes.id], scaleSelector, scaleRange);
                    nodes.fluxDirection1 = edgeWidth*(-1);
                    nodes.color1 = color;
                }
            }
        }
        metExploreD3.GraphFlux.curveEdge();
    },

    /**
     * Display flux visualisation for two condition
     * @param {Array} fluxData flux values
     * @param {NetworkData} networkData
     * @param {String} targetLabel label use in dataset
     * @param {String} color colors associated conditions
     * @param {String} scaleSelector scale selected
     * @param {Array} scaleRange1 scale range for the first condition
     * @param {Array} scaleRange2 scale range for the second condition
     */
    twoCompute: function(fluxData, networkData, targetLabel, color, scaleSelector, scaleRange1){
        var valuePos = {first:{}, second:{}};
        var valueNeg = {first:{}, second:{}};
        var valDistri = [];

        for (var i = 0; i < fluxData.length; i++){

            if (targetLabel === "Name"){
                var nodes = networkData.getNodeByName(fluxData[i][0]);
            }
            if (targetLabel === "reactionId"){
                var nodes = networkData.getNodeById(fluxData[i][0]);
            }
            if (targetLabel === "Identifier"){
                var nodes = networkData.getNodeByDbIdentifier(fluxData[i][0]);
            }

            if (nodes !== undefined){
                var value1 = parseInt(fluxData[i][1], 10);
                var value2 = parseInt(fluxData[i][2], 10);
                if (value1 === 0){
                    nodes.fluxDirection1 = value1;
                    nodes.color1 = color[0];
                    nodes.valueCond1 = value1;
                }
                if (value1 > 0){
                    valuePos["first"][nodes.id] = value1;
                    valDistri.push(value1);
                    nodes.valueCond1 = value1;
                }
                if (value1 < 0){
                    valueNeg["first"][nodes.id] = value1;
                    valDistri.push(value1*(-1));
                    nodes.valueCond1 = value1;
                }
                if (value2 === 0){
                    nodes.fluxDirection2 = value2;
                    nodes.color2 = color[1];
                    nodes.valueCond2 = value2;
                }
                if (value2 > 0){
                    valuePos["second"][nodes.id] = value2;
                    valDistri.push(value2);
                    nodes.valueCond2 = value2;
                }
                if (value2 < 0){
                    valueNeg["second"][nodes.id] = value2;
                    valDistri.push(value2*(-1));
                    nodes.valueCond2 = value2;
                }
            }
        }

        var distrib = metExploreD3.GraphFlux.fluxDistribution(valDistri);

        for (var i = 0; i < fluxData.length; i++){

            if (targetLabel === "Name"){
                var nodes = networkData.getNodeByName(fluxData[i][0]);
            }
            if (targetLabel === "reactionId"){
                var nodes = networkData.getNodeById(fluxData[i][0]);
            }
            if (targetLabel === "Identifier"){
                var nodes = networkData.getNodeByDbIdentifier(fluxData[i][0]);
            }

            if (nodes !== undefined){
                if (Object.keys(valuePos["first"]).includes(nodes.id)){
                    var edgeWidth = metExploreD3.GraphFlux.computeWidth(distrib, valuePos["first"][nodes.id], scaleSelector, scaleRange1);
                    nodes.fluxDirection1 = edgeWidth;
                    nodes.color1 = color[0];
                }
                if (Object.keys(valueNeg["first"]).includes(nodes.id)){
                    var edgeWidth = metExploreD3.GraphFlux.computeWidth(distrib, valueNeg["first"][nodes.id], scaleSelector, scaleRange1);
                    nodes.fluxDirection1 = edgeWidth*(-1);
                    nodes.color1 = color[0];
                }

                if (Object.keys(valuePos["second"]).includes(nodes.id)){
                    var edgeWidth = metExploreD3.GraphFlux.computeWidth(distrib, valuePos["second"][nodes.id], scaleSelector, scaleRange1);
                    nodes.fluxDirection2 = edgeWidth;
                    nodes.color2 = color[1];
                }
                if (Object.keys(valueNeg["second"]).includes(nodes.id)){
                    var edgeWidth = metExploreD3.GraphFlux.computeWidth(distrib, valueNeg["second"][nodes.id], scaleSelector, scaleRange1);
                    nodes.fluxDirection2 = edgeWidth*(-1);
                    nodes.color2 = color[1];
                }
            }
        }
        metExploreD3.GraphFlux.curveTwoEdge();
    },

    /**
     * Compute link width in function of his flux value
     * @param {Dict} fluxDistri Object that contains min, max and intermediate values for the current dataset
     * @param {Int} fluxValue flux value
     * @param {String} scaleSelector scale mod selected
     * @param {Array} scaleRange scale range for this condition
     * @returns {Int}
     */
    computeWidth: function(fluxDistri, fluxValue, scaleSelector, scaleRange){
        if (scaleSelector === "Manual"){
            return metExploreD3.GraphFlux.computeManualWidth(scaleRange, fluxValue);
        }

        var min = fluxDistri["min"];
        var inter = fluxDistri["inter"];
        var max = fluxDistri["max"];

        if (fluxValue < 0){
            fluxValue = fluxValue*(-1);
        }
        if (fluxValue === min){
            return 1;
        }
        if (fluxValue === max){
            return 5;
        }

        if (scaleSelector === "Automatic"){
            if (fluxValue === inter){
                return 3;
            }
            if (fluxValue > inter){
                var coef = 2 / (max - inter);
                var widthCompute = 3 + (fluxValue - inter) * coef;
                return widthCompute;
            }
            if (fluxValue < inter){
                var coef = 2 / (inter - min);
                var widthCompute = 3 - (inter - fluxValue) * coef;
                return widthCompute;
            }
        }

        if (scaleSelector === "Proportional"){
            var coef = 4 / (max - min);
            var widthCompute = 1 + (fluxValue - min) * coef;
            return widthCompute;
        }
    },

    /**
     * Compute link width in function of his flux value when manual scale is active
     * @param {Array} scaleRange scale range for one condition
     * @param {Int} fluxValue flux value
     * @returns {Int}
     */
    computeManualWidth: function(scaleRange, fluxValue){
        var data = [];
        var rangeCaption = [];
        var domainCaption = [];

        rangeCaption = scaleRange
            .map(function (sr, i) {
                return sr.styleValue;
            });
        domainCaption = scaleRange
            .map(function (sr, i) {
                return sr.value;
            });

        var linearScale = d3.scaleLinear().range(rangeCaption).domain(domainCaption);
        if (fluxValue === scaleRange[0].value){
            return scaleRange[0].styleValue;
        }
        if (fluxValue === scaleRange[scaleRange.length - 1].value){
            return scaleRange[scaleRange.length - 1].styleValue;
        }
        else{
            return linearScale(fluxValue);
        }
    },

    /**
     * Create dict which contains min, max and intermediate value from dataset
     * @param {Array} fluxValues flux values for one specific condition
     * @returns {Dict}
     */
    fluxDistribution: function(fluxValues){
        var distrib = {};

        var fluxQuantile = metExploreD3.GraphFlux.findQuantile(fluxValues, 0.5);

        if (fluxQuantile[1] === fluxQuantile[2]){
            fluxQuantile = metExploreD3.GraphFlux.findQuantile(fluxValues, 0.25);
        }

        else if (fluxQuantile[1] === fluxQuantile[0]){
            fluxQuantile = metExploreD3.GraphFlux.findQuantile(fluxValues, 0.75);
        }

        distrib["min"] = fluxQuantile[0];
        distrib["inter"] = fluxQuantile[1];
        distrib["max"] = fluxQuantile[2];

        return distrib;
    },

    /**
     * Find specific quantile from dataset
     * @param {Array} values flux values for one specific condition
     * @param {Int} q quantile to find in the dataset
     * @returns {Array}
     */
    findQuantile: function(values, q){
        var sortedValues = values.slice().sort(function(a, b){
            return a - b;
        });
        var pos = (sortedValues.length) * q;
        var base = Math.ceil(pos) - 1;

        var quantile = sortedValues[base];
        var minValue = sortedValues[0];
        var maxValue = sortedValues[sortedValues.length - 1];

        return [minValue, quantile, maxValue];
    },

    /**
     * browse reactions nodes, assign width and color to their link for one condition and call caption function
     */
    curveEdge: function(){
        var panel = "viz";
        var reactionStyle = metExploreD3.getReactionStyle();
        var linkStyle = metExploreD3.getLinkStyle();
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

            // Check if some links are part of a cycle and return the midsection of the arc instead of the centroid if this is the case
            var centroidSourceX = 0;
            var centroidSourceY = 0;
            var centroidTargetX = 0;
            var centroidTargetY = 0;
            var isCycleReaction = false;

            enteringLinks.each(function (link) {
                if (link.partOfCycle === true){
                    isCycleReaction = true;
                }
            });
            exitingLinks.each(function (link) {
                if (link.partOfCycle === true){
                    isCycleReaction = true;
                }
            });



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
            if (node.fluxDirection1 === 0){
                enteringLinks
                    .each(function (link) {
                        var path;
                        if (link.partOfCycle === true){
                            path = metExploreD3.GraphFlux.computeTwoPath(link.getSource(), link.getTarget(), link, 0, "not");
                        }
                        else if (isCycleReaction === true){
                            path = metExploreD3.GraphFlux.computeTwoPath(link.getSource(), link.getTarget(), link, 0, "not");
                        }
                        else if (enteringY == node.y){
                            path = metExploreD3.GraphLink.computePathHorizontal(node, enteringX, enteringY, link.getSource());
                            axe="horizontal";
                        }
                        else {
                            path = metExploreD3.GraphLink.computePathVertical(node, enteringX, enteringY, link.getSource());
                            axe="vertical";
                        }
                        node.axe = axe;
                        d3.select(this).attr("d", path)
                            .attr("fill", "none")
                            .classed("horizontal", false)
                            .classed("vertical", false)
                            .classed(axe, true)
                            .classed("fluxstylelink", true)
                            .style("opacity", 0.6)
                            .style("stroke-width",1)
                            .style("stroke","blue")
                            .style("stroke-dasharray",8);
                    });

                exitingLinks
                    .each(function (link) {
                        var path;
                        if (link.partOfCycle === true){
                            path = metExploreD3.GraphFlux.computeTwoPath(link.getSource(), link.getTarget(), link, 0, "not");
                        }
                        else if (isCycleReaction === true){
                            path = metExploreD3.GraphFlux.computeTwoPath(link.getSource(), link.getTarget(), link, 0, "not");
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
                            .classed("fluxstylelink", true)
                            .style("opacity", 0.6)
                            .style("stroke-width",1)
                            .style("stroke","blue")
                            .style("stroke-dasharray",8);
                    });
            }
            if (node.fluxDirection1 > 0){
                enteringLinks
                    .each(function (link) {
                        var path;
                        if (link.partOfCycle === true){
                            path = metExploreD3.GraphFlux.computeTwoPath(link.getSource(), link.getTarget(), link, 0, "not");
                        }
                        else if (isCycleReaction === true){
                            path = metExploreD3.GraphFlux.computeTwoPath(link.getSource(), link.getTarget(), link, 0, "not");
                        }
                        else if (enteringY == node.y){
                            path = metExploreD3.GraphLink.computePathHorizontal(node, enteringX, enteringY, link.getSource());
                            axe="horizontal";
                        }
                        else {
                            path = metExploreD3.GraphLink.computePathVertical(node, enteringX, enteringY, link.getSource());
                            axe="vertical";
                        }
                        node.axe = axe;
                        d3.select(this).attr("d", path)
                            .attr("fill", "none")
                            .classed("horizontal", false)
                            .classed("vertical", false)
                            .classed(axe, true)
                            .classed("fluxstylelink", true)
                            .style("opacity", 1)
                            .style("stroke", node.color1)
                            .style("stroke-width",node.fluxDirection1);
                    });

                exitingLinks
                    .each(function (link) {
                        var path;
                        var endNode = link.getTarget();
                        var fluxValue = node.fluxDirection1*(-1);
                        if (link.partOfCycle === true){
                            path = metExploreD3.GraphFlux.computeTwoPathEnd(link.getSource(), link.getTarget(), link, 0, "not");
                        }
                        else if (isCycleReaction === true){
                            path = metExploreD3.GraphFlux.computeTwoPathEnd(link.getSource(), link.getTarget(), link, 0, "not");
                        }
                        else if (exitingY == node.y){
                            path = metExploreD3.GraphFlux.computePathHorizontalEnd(node.x, node.y, exitingX, exitingY, endNode.x, endNode.y, fluxValue, 0);
                            axe="horizontal";
                        }
                        else {
                            path = metExploreD3.GraphFlux.computePathVerticalEnd(node.x, node.y, exitingX, exitingY, endNode.x, endNode.y, fluxValue, 0);
                            axe="vertical";
                        }

                        d3.select(this).attr("d", path)
                            .attr("fill", "none")
                            .classed("horizontal", false)
                            .classed("vertical", false)
                            .classed(axe, true)
                            .classed("fluxstylelink", true)
                            .style("opacity", 1)
                            .style("stroke-linejoin", "miter")
                            .style("stroke", node.color1)
                            .style("stroke-width",node.fluxDirection1);
                    });
            }
            if (node.fluxDirection1 < 0){
                enteringLinks
                    .each(function (link) {
                        var path;
                        var endNode = link.getSource()
                        if (link.partOfCycle === true){
                            path = metExploreD3.GraphFlux.computeTwoPathEnd(link.getTarget(), link.getSource(), link, 0, "switch");
                        }
                        else if (isCycleReaction === true){
                            path = metExploreD3.GraphFlux.computeTwoPathEnd(link.getTarget(), link.getSource(), link, 0, "switch");
                        }
                        else if (enteringY == node.y){
                            path = metExploreD3.GraphFlux.computePathHorizontalEnd(node.x, node.y, enteringX, enteringY, endNode.x, endNode.y, node.fluxDirection1, 0);
                            axe="horizontal";
                        }
                        else {
                            path = metExploreD3.GraphFlux.computePathVerticalEnd(node.x, node.y, enteringX, enteringY, endNode.x, endNode.y, node.fluxDirection1, 0);
                            axe="vertical";
                        }
                        node.axe = axe;
                        d3.select(this).attr("d", path)
                            .attr("fill", "none")
                            .classed("horizontal", false)
                            .classed("vertical", false)
                            .classed(axe, true)
                            .classed("fluxstylelink", true)
                            .style("opacity", 1)
                            .style("stroke-linejoin", "miter")
                            .style("stroke", node.color1)
                            .style("stroke-width",node.fluxDirection1*(-1));
                    });

                exitingLinks
                    .each(function (link) {
                        var path;
                        if (link.partOfCycle === true){
                            path = metExploreD3.GraphFlux.computeTwoPath(link.getSource(), link.getTarget(), link, 0, "not");
                        }
                        else if (isCycleReaction === true){
                            path = metExploreD3.GraphFlux.computeTwoPath(link.getSource(), link.getTarget(), link, 0, "not");
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
                            .classed("fluxstylelink", true)
                            .style("opacity", 1)
                            .style("stroke", node.color1)
                            .style("stroke-width",node.fluxDirection1*(-1));
                    });
            }
            if (node.fluxDirection1 === undefined){
                var color = linkStyle.getStrokeColor();
                enteringLinks
                    .each(function (link) {
                        var path;
                        var endNode = link.getSource();
                        if (link.partOfCycle === true){
                            path = metExploreD3.GraphFlux.computeTwoPath(link.getSource(), link.getTarget(), link, 0, "not");
                        }
                        else if (isCycleReaction === true){
                            path = metExploreD3.GraphFlux.computeTwoPath(link.getSource(), link.getTarget(), link, 0, "not");
                        }
                        else if (enteringY == node.y){
                            path = metExploreD3.GraphFlux.twoPathHorizontal(node.x, node.y, enteringX, enteringY, endNode.x, endNode.y, 0);
                            axe="horizontal";
                        }
                        else {
                            path = metExploreD3.GraphFlux.twoPathVertical(node.x, node.y, enteringX, enteringY, endNode.x, endNode.y, 0);
                            axe="vertical";
                        }
                        node.axe = axe;
                        d3.select(this).attr("d", path)
                            .attr("fill", "none")
                            .attr("stroke", color)
                            .classed("horizontal", false)
                            .classed("vertical", false)
                            .classed(axe, true)
                            .classed("fluxstylelink", true)
                            .style("opacity", 0.6)
                            .style("stroke-width",1);
                    });

                exitingLinks
                    .each(function (link) {
                        var path;
                        var endNode = link.getTarget();
                        if (link.partOfCycle === true){
                            path = metExploreD3.GraphFlux.computeTwoPathEnd(link.getSource(), link.getTarget(), link, 0, "not");
                        }
                        else if (isCycleReaction === true){
                            path = metExploreD3.GraphFlux.computeTwoPathEnd(link.getSource(), link.getTarget(), link, 0, "not");
                        }
                        else if (exitingY == node.y){
                            path = metExploreD3.GraphFlux.computePathHorizontalEnd(node.x, node.y, exitingX, exitingY, endNode.x, endNode.y, 0, 0);
                            axe="horizontal";
                        }
                        else {
                            path = metExploreD3.GraphFlux.computePathVerticalEnd(node.x, node.y, exitingX, exitingY, endNode.x, endNode.y, 0, 0);
                            axe="vertical";
                        }

                        d3.select(this).attr("d", path)
                            .attr("fill", "none")
                            .attr("stroke", color)
                            .classed("horizontal", false)
                            .classed("vertical", false)
                            .classed(axe, true)
                            .classed("fluxstylelink", true)
                            .style("opacity", 0.6)
                            .style("stroke-width",1);
                    });
            }
        });
        metExploreD3.GraphCaption.drawCaptionFluxMode();

    },

    /**
     * browse reactions nodes, assign width and color to their link for two conditions and call caption function
     */
    curveTwoEdge: function(){
        var reactionStyle = metExploreD3.getReactionStyle();
        var linkStyle = metExploreD3.getLinkStyle();
        var reactions = d3.select("#viz").select("#D3viz").select("#graphComponent")
            .selectAll("g.node")
            .filter(function(node){
                return node.getBiologicalType()=="reaction";
            });
        d3.select("#viz").select("#D3viz").select("#graphComponent").selectAll("path.link.clone").remove();

        var links = d3.select("#viz").select("#D3viz").select("#graphComponent").selectAll("path.link.reaction");

        reactions.each(function (node) {
            var enteringLinks = links.filter(function (link) {
                return node.id==link.getTarget();
            });
            var exitingLinks = links.filter(function (link) {
                return node.id==link.getSource();
            });

            // Check if some links are part of a cycle and return the midsection of the arc instead of the centroid if this is the case
            var isCycleReaction = false;
            enteringLinks.each(function (link) {
                if (link.partOfCycle === true){
                    isCycleReaction = true;
                }
            });
            exitingLinks.each(function (link) {
                if (link.partOfCycle === true){
                    isCycleReaction = true;
                }
            });

            var resultComputeCentroid = metExploreD3.GraphLink.computeCentroid(node, enteringLinks, exitingLinks);
            centroidSourceX1 = resultComputeCentroid[0];
            centroidSourceY1 = resultComputeCentroid[1];
            centroidTargetX1 = resultComputeCentroid[2];
            centroidTargetY1 = resultComputeCentroid[3];

            // For each node, compare the difference between the x-coordinates of the 2 centroids and the difference between their y-coordinates
            // to determine if the axis of the reaction should be horizontal or vertical
            // From those test, attribute the coordinate for the entry and exit points of that node
            var distanceSource = Math.sqrt(Math.pow(centroidSourceX1 - node.x, 2) + Math.pow(centroidSourceY1 - node.y, 2));
            var distanceTarget = Math.sqrt(Math.pow(centroidTargetX1 - node.x, 2) + Math.pow(centroidTargetY1 - node.y, 2));
            var enteringX = node.x;
            var enteringY = node.y;
            if (Math.abs(centroidSourceX1 - centroidTargetX1) > Math.abs(centroidSourceY1 - centroidTargetY1)){
                if (centroidSourceX1 < centroidTargetX1){
                    enteringX -= reactionStyle.getWidth() / 2 + 10;
                }
                else {
                    enteringX += reactionStyle.getWidth() / 2 + 10;
                }
            }
            else {
                if (centroidSourceY1 < centroidTargetY1){
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
            if (node.fluxDirection1 === 0){
                enteringLinks
                    .each(function (link) {
                        var path;
                        var endNode = link.getSource();
                        if (link.partOfCycle === true){
                            path = metExploreD3.GraphFlux.computeTwoPath(link.getSource(), link.getTarget(), link, -5, "not");
                        }
                        else if (isCycleReaction === true){
                            path = metExploreD3.GraphFlux.computeTwoPath(link.getSource(), link.getTarget(), link, -5, "not");
                        }
                        else if (enteringY == node.y){
                            path = metExploreD3.GraphFlux.twoPathHorizontal(node.x, node.y-5, enteringX, enteringY-5, endNode.x, endNode.y-5, -5);
                            axe="horizontal";
                        }
                        else {
                            path = metExploreD3.GraphFlux.twoPathVertical(node.x-5, node.y, enteringX-5, enteringY, endNode.x-5, endNode.y, -5);
                            axe="vertical";
                        }
                        node.axe = axe;
                        d3.select(this).attr("d", path)
                            .attr("fill", "none")
                            .classed("horizontal", false)
                            .classed("vertical", false)
                            .classed(axe, true)
                            .classed("fluxstylelink", true)
                            .style("opacity", 0.6)
                            .style("stroke-width",1)
                            .style("stroke", node.color1)
                            .style("stroke-dasharray",8);
                    });

                exitingLinks
                    .each(function (link) {
                        var path;
                        var endNode = link.getTarget();
                        if (link.partOfCycle === true){
                            path = metExploreD3.GraphFlux.computeTwoPath(link.getSource(), link.getTarget(), link, -5, "not");
                        }
                        else if (isCycleReaction === true){
                            path = metExploreD3.GraphFlux.computeTwoPath(link.getSource(), link.getTarget(), link, -5, "not");
                        }
                        else if (exitingY == node.y){
                            path = metExploreD3.GraphFlux.twoPathHorizontal(node.x, node.y-5, exitingX, exitingY-5, endNode.x, endNode.y-5, -5);
                            axe="horizontal";
                        }
                        else {
                            path = metExploreD3.GraphFlux.twoPathVertical(node.x-5, node.y, exitingX-5, exitingY, endNode.x-5, endNode.y, -5);
                            axe="vertical";
                        }

                        d3.select(this).attr("d", path)
                            .attr("fill", "none")
                            .classed("horizontal", false)
                            .classed("vertical", false)
                            .classed(axe, true)
                            .classed("fluxstylelink", true)
                            .style("opacity", 0.6)
                            .style("stroke-width",1)
                            .style("stroke", node.color1)
                            .style("stroke-dasharray",8);
                    });
            }
            if (node.fluxDirection2 === 0){
                var newEnter = enteringLinks.clone();
                d3.select("#viz").select("#D3viz").select("graphComponent").append(newEnter);
                newEnter
                    .each(function (link) {
                        var path;
                        var endNode = link.getSource();
                        if (link.partOfCycle === true){
                            path = metExploreD3.GraphFlux.computeTwoPath(link.getSource(), link.getTarget(), link, 5, "not");
                        }
                        else if (isCycleReaction === true){
                            path = metExploreD3.GraphFlux.computeTwoPath(link.getSource(), link.getTarget(), link, 5, "not");
                        }
                        else if (enteringY == node.y){
                            path = metExploreD3.GraphFlux.twoPathHorizontal(node.x, node.y+5, enteringX, enteringY+5, endNode.x, endNode.y+5, 5);
                            axe="horizontal";
                        }
                        else {
                            path = metExploreD3.GraphFlux.twoPathVertical(node.x+5, node.y, enteringX+5, enteringY, endNode.x+5, endNode.y, 5);
                            axe="vertical";
                        }
                        d3.select(this).attr("d", path)
                            .attr("fill", "none")
                            .classed("clone",true)
                            .classed("horizontal", false)
                            .classed("vertical", false)
                            .classed(axe, true)
                            .classed("fluxstylelink", true)
                            .classed("reaction",false)
                            .style("opacity", 0.6)
                            .style("stroke-width",1)
                            .style("stroke", node.color2)
                            .style("stroke-dasharray",8);
                    });
                var newExit = exitingLinks.clone();
                d3.select("#viz").select("#D3viz").select("graphComponent").append(newExit);
                newExit
                    .each(function (link) {
                        var path;
                        var endNode = link.getTarget();
                        if (link.partOfCycle === true){
                            path = metExploreD3.GraphFlux.computeTwoPath(link.getSource(), link.getTarget(), link, 5, "not");
                        }
                        else if (isCycleReaction === true){
                            path = metExploreD3.GraphFlux.computeTwoPath(link.getSource(), link.getTarget(), link, 5, "not");
                        }
                        else if (exitingY == node.y){
                            path = metExploreD3.GraphFlux.twoPathHorizontal(node.x, node.y+5, exitingX, exitingY+5, endNode.x, endNode.y+5, 5);
                            axe="horizontal";
                        }
                        else {
                            path = metExploreD3.GraphFlux.twoPathVertical(node.x+5, node.y, exitingX+5, exitingY, endNode.x+5, endNode.y, 5);
                            axe="vertical";
                        }

                        d3.select(this).attr("d", path)
                            .attr("fill", "none")
                            .classed("clone",true)
                            .classed("horizontal", false)
                            .classed("vertical", false)
                            .classed(axe, true)
                            .classed("fluxstylelink", true)
                            .style("opacity", 0.6)
                            .style("stroke-width",1)
                            .style("stroke", node.color2)
                            .style("stroke-dasharray",8);
                    });
            }
            if (node.fluxDirection1 > 0){
                enteringLinks
                    .each(function (link) {
                        var path;
                        var endNode = link.getSource();
                        if (link.partOfCycle === true){
                            path = metExploreD3.GraphFlux.computeTwoPath(link.getSource(), link.getTarget(), link, -5, "not");
                        }
                        else if (isCycleReaction === true){
                            path = metExploreD3.GraphFlux.computeTwoPath(link.getSource(), link.getTarget(), link, -5, "not");
                        }
                        else if (enteringY == node.y){
                            path = metExploreD3.GraphFlux.twoPathHorizontal(node.x, node.y-5, enteringX, enteringY-5, endNode.x, endNode.y-5, -5);
                            axe="horizontal";
                        }
                        else {
                            path = metExploreD3.GraphFlux.twoPathVertical(node.x-5, node.y, enteringX-5, enteringY, endNode.x-5, endNode.y, -5);
                            axe="vertical";
                        }
                        node.axe = axe;
                        d3.select(this).attr("d", path)
                            .attr("fill", "none")
                            .classed("horizontal", false)
                            .classed("vertical", false)
                            .classed(axe, true)
                            .classed("fluxstylelink", true)
                            .style("opacity", 1)
                            .style("stroke", node.color1)
                            .style("stroke-width",node.fluxDirection1);
                    });

                exitingLinks
                    .each(function (link) {
                        var path;
                        var endNode = link.getTarget();
                        var fluxValue = node.fluxDirection1*(-1);
                        if (link.partOfCycle === true){
                            path = metExploreD3.GraphFlux.computeTwoPathEnd(link.getSource(), link.getTarget(), link, -5, "not");
                        }
                        else if (isCycleReaction === true){
                            path = metExploreD3.GraphFlux.computeTwoPathEnd(link.getSource(), link.getTarget(), link, -5, "not");
                        }
                        else if (exitingY == node.y){
                            path = metExploreD3.GraphFlux.computePathHorizontalEnd(node.x, node.y-5, exitingX, exitingY-5, endNode.x, endNode.y-5, fluxValue, -5);
                            axe="horizontal";
                        }
                        else {
                            path = metExploreD3.GraphFlux.computePathVerticalEnd(node.x-5, node.y, exitingX-5, exitingY, endNode.x-5, endNode.y, fluxValue, -5);
                            axe="vertical";
                        }

                        d3.select(this).attr("d", path)
                            .attr("fill", "none")
                            .classed("horizontal", false)
                            .classed("vertical", false)
                            .classed(axe, true)
                            .classed("fluxstylelink", true)
                            .style("opacity", 1)
                            .style("stroke-linejoin", "miter")
                            .style("stroke", node.color1)
                            .style("stroke-width",node.fluxDirection1);
                    });
            }
            if (node.fluxDirection2 > 0){
                var newEnter = enteringLinks.clone();
                d3.select("#viz").select("#D3viz").select("graphComponent").append(newEnter);
                newEnter
                    .each(function (link) {
                        var path;
                        var endNode = link.getSource();
                        if (link.partOfCycle === true){
                            path = metExploreD3.GraphFlux.computeTwoPath(link.getSource(), link.getTarget(), link, 5, "not");
                        }
                        else if (isCycleReaction === true){
                            path = metExploreD3.GraphFlux.computeTwoPath(link.getSource(), link.getTarget(), link, 5, "not");
                        }
                        else if (enteringY == node.y){
                            path = metExploreD3.GraphFlux.twoPathHorizontal(node.x, node.y+5, enteringX, enteringY+5, endNode.x, endNode.y+5, 5);
                            axe="horizontal";
                        }
                        else {
                            path = metExploreD3.GraphFlux.twoPathVertical(node.x+5, node.y, enteringX+5, enteringY, endNode.x+5, endNode.y, 5);
                            axe="vertical";
                        }
                        d3.select(this).attr("d", path)
                            .attr("fill", "none")
                            .classed("clone",true)
                            .classed("horizontal", false)
                            .classed("vertical", false)
                            .classed(axe, true)
                            .classed("fluxstylelink", true)
                            .classed("reaction",false)
                            .style("opacity", 1)
                            .style("stroke-dasharray", null)
                            .style("stroke", node.color2)
                            .style("stroke-width", node.fluxDirection2);
                    });
                var newExit = exitingLinks.clone();
                d3.select("#viz").select("#D3viz").select("graphComponent").append(newExit);
                newExit
                    .each(function (link) {
                        var path;
                        var fluxValue = node.fluxDirection2*(-1);
                        var endNode = link.getTarget();
                        if (link.partOfCycle === true){
                            path = metExploreD3.GraphFlux.computeTwoPathEnd(link.getSource(), link.getTarget(), link, 5, "not");
                        }
                        else if (isCycleReaction === true){
                            path = metExploreD3.GraphFlux.computeTwoPathEnd(link.getSource(), link.getTarget(), link, 5, "not");
                        }
                        else if (exitingY == node.y){
                            path = metExploreD3.GraphFlux.computePathHorizontalEnd(node.x, node.y+5, exitingX, exitingY+5, endNode.x, endNode.y+5, fluxValue, 5);
                            axe="horizontal";
                        }
                        else {
                            path = metExploreD3.GraphFlux.computePathVerticalEnd(node.x+5, node.y, exitingX+5, exitingY, endNode.x+5, endNode.y, fluxValue, 5);
                            axe="vertical";
                        }

                        d3.select(this).attr("d", path)
                            .attr("fill", "none")
                            .classed("clone",true)
                            .classed("horizontal", false)
                            .classed("vertical", false)
                            .classed(axe, true)
                            .classed("fluxstylelink", true)
                            .style("stroke-linejoin", "miter")
                            .style("opacity", 1)
                            .style("stroke-dasharray", null)
                            .style("stroke", node.color2)
                            .style("stroke-width", node.fluxDirection2);
                    });
            }
            if (node.fluxDirection1 < 0){
                enteringLinks
                    .each(function (link) {
                        var path;
                        var endNode = link.getSource();
                        if (link.partOfCycle === true){
                            path = metExploreD3.GraphFlux.computeTwoPathEnd(link.getTarget(), link.getSource(), link, -5, "switch");
                        }
                        else if (isCycleReaction === true){
                            path = metExploreD3.GraphFlux.computeTwoPathEnd(link.getTarget(), link.getSource(), link, -5, "switch");
                        }
                        else if (enteringY == node.y){
                            path = metExploreD3.GraphFlux.computePathHorizontalEnd(node.x, node.y-5, enteringX, enteringY-5, endNode.x, endNode.y-5, node.fluxDirection1, -5);
                            axe="horizontal";
                        }
                        else {
                            path = metExploreD3.GraphFlux.computePathVerticalEnd(node.x-5, node.y, enteringX-5, enteringY, endNode.x-5, endNode.y, node.fluxDirection1, -5);
                            axe="vertical";
                        }
                        node.axe = axe;
                        d3.select(this).attr("d", path)
                            .attr("fill", "none")
                            .classed("horizontal", false)
                            .classed("vertical", false)
                            .classed(axe, true)
                            .classed("fluxstylelink", true)
                            .style("opacity", 1)
                            .style("stroke-linejoin", "miter")
                            .style("stroke", node.color1)
                            .style("stroke-width",node.fluxDirection1*(-1));
                    });

                exitingLinks
                    .each(function (link) {
                        var path;
                        var endNode = link.getTarget();
                        if (link.partOfCycle === true){
                            path = metExploreD3.GraphFlux.computeTwoPath(link.getSource(), link.getTarget(), link, -5, "not");
                        }
                        else if (isCycleReaction === true){
                            path = metExploreD3.GraphFlux.computeTwoPath(link.getSource(), link.getTarget(), link, -5, "not");
                        }
                        else if (exitingY == node.y){
                            path = metExploreD3.GraphFlux.twoPathHorizontal(node.x, node.y-5, exitingX, exitingY-5, endNode.x, endNode.y-5, -5);
                            axe="horizontal";
                        }
                        else {
                            path = metExploreD3.GraphFlux.twoPathVertical(node.x-5, node.y, exitingX-5, exitingY, endNode.x-5, endNode.y, -5);
                            axe="vertical";
                        }

                        d3.select(this).attr("d", path)
                            .attr("fill", "none")
                            .classed("horizontal", false)
                            .classed("vertical", false)
                            .classed(axe, true)
                            .classed("fluxstylelink", true)
                            .style("opacity", 1)
                            .style("stroke", node.color1)
                            .style("stroke-width",node.fluxDirection1*(-1));
                    });
            }
            if (node.fluxDirection2 < 0){
                var newEnter = enteringLinks.clone();
                d3.select("#viz").select("#D3viz").select("graphComponent").append(newEnter);
                newEnter
                    .each(function (link) {
                        var path;
                        var endNode = link.getSource();
                        if (link.partOfCycle === true){
                            path = metExploreD3.GraphFlux.computeTwoPathEnd(link.getTarget(), link.getSource(), link, 5, "switch");
                        }
                        else if (isCycleReaction === true){
                            path = metExploreD3.GraphFlux.computeTwoPathEnd(link.getTarget(), link.getSource(), link, 5, "switch");
                        }
                        else if (enteringY == node.y){
                            path = metExploreD3.GraphFlux.computePathHorizontalEnd(node.x, node.y+5, enteringX, enteringY+5, endNode.x, endNode.y+5, node.fluxDirection2, 5);
                            axe="horizontal";
                        }
                        else {
                            path = metExploreD3.GraphFlux.computePathVerticalEnd(node.x+5, node.y, enteringX+5, enteringY, endNode.x+5, endNode.y, node.fluxDirection2, 5);
                            axe="vertical";
                        }
                        d3.select(this).attr("d", path)
                            .attr("fill", "none")
                            .classed("clone",true)
                            .classed("horizontal", false)
                            .classed("vertical", false)
                            .classed(axe, true)
                            .classed("fluxstylelink", true)
                            .classed("reaction",false)
                            .style("stroke-linejoin", "miter")
                            .style("opacity", 1)
                            .style("stroke-dasharray", null)
                            .style("stroke", node.color2)
                            .style("stroke-width",node.fluxDirection2*(-1));
                    });
                var newExit = exitingLinks.clone();
                d3.select("#viz").select("#D3viz").select("graphComponent").append(newExit);
                newExit
                    .each(function (link) {
                        var path;
                        var endNode = link.getTarget();
                        if (link.partOfCycle === true){
                            path = metExploreD3.GraphFlux.computeTwoPath(link.getSource(), link.getTarget(), link, 5, "not");
                        }
                        else if (isCycleReaction === true){
                            path = metExploreD3.GraphFlux.computeTwoPath(link.getSource(), link.getTarget(), link, 5, "not");
                        }
                        else if (exitingY == node.y){
                            path = metExploreD3.GraphFlux.twoPathHorizontal(node.x, node.y+5, exitingX, exitingY+5, endNode.x, endNode.y+5, 5);
                            axe="horizontal";
                        }
                        else {
                            path = metExploreD3.GraphFlux.twoPathVertical(node.x+5, node.y, exitingX+5, exitingY, endNode.x+5, endNode.y, 5);
                            axe="vertical";
                        }

                        d3.select(this).attr("d", path)
                            .attr("fill", "none")
                            .classed("clone",true)
                            .classed("horizontal", false)
                            .classed("vertical", false)
                            .classed(axe, true)
                            .classed("fluxstylelink", true)
                            .style("stroke-dasharray", null)
                            .style("opacity", 1)
                            .style("stroke", node.color2)
                            .style("stroke-width",node.fluxDirection2*(-1));
                    });
            }
            if (node.fluxDirection1 === undefined || node.fluxDirection2 === undefined){
                var color = linkStyle.getStrokeColor();
                enteringLinks
                    .each(function (link) {
                        var path;
                        var endNode = link.getSource();
                        if (link.partOfCycle === true){
                            path = metExploreD3.GraphFlux.computeTwoPath(link.getSource(), link.getTarget(), link, 0, "not");
                        }
                        else if (isCycleReaction === true){
                            path = metExploreD3.GraphFlux.computeTwoPath(link.getSource(), link.getTarget(), link, 0, "not");
                        }
                        else if (enteringY == node.y){
                            path = metExploreD3.GraphFlux.twoPathHorizontal(node.x, node.y, enteringX, enteringY, endNode.x, endNode.y, 0);
                            axe="horizontal";
                        }
                        else {
                            path = metExploreD3.GraphFlux.twoPathVertical(node.x, node.y, enteringX, enteringY, endNode.x, endNode.y, 0);
                            axe="vertical";
                        }
                        node.axe = axe;
                        d3.select(this).attr("d", path)
                            .attr("fill", "none")
                            .classed("horizontal", false)
                            .classed("vertical", false)
                            .classed(axe, true)
                            .classed("fluxstylelink", true)
                            .style("opacity", 0.6)
                            .style("stroke-width",1);
                    });

                exitingLinks
                    .each(function (link) {
                        var path;
                        var endNode = link.getTarget();
                        if (link.partOfCycle === true){
                            path = metExploreD3.GraphFlux.computeTwoPath(link.getSource(), link.getTarget(), link, 0, "not");
                        }
                        else if (isCycleReaction === true){
                            path = metExploreD3.GraphFlux.computeTwoPath(link.getSource(), link.getTarget(), link, 0, "not");
                        }
                        else if (exitingY == node.y){
                            path = metExploreD3.GraphFlux.computePathHorizontalEnd(node.x, node.y, exitingX, exitingY, endNode.x, endNode.y, 0, 0);
                            axe="horizontal";
                        }
                        else {
                            path = metExploreD3.GraphFlux.computePathVerticalEnd(node.x, node.y, exitingX, exitingY, endNode.x, endNode.y, 0, 0);
                            axe="vertical";
                        }

                        d3.select(this).attr("d", path)
                            .attr("fill", "none")
                            .classed("horizontal", false)
                            .classed("vertical", false)
                            .classed(axe, true)
                            .classed("fluxstylelink", true)
                            .style("opacity", 0.6)
                            .style("stroke-width",1);
                    });
            }
        });
        metExploreD3.GraphCaption.drawCaptionTwoFluxMode();
    },

    computeShiftedCoor: function(source, target, shiftValue, link, dir){
        var radius = link.cycleRadius;

        var sweepFlag = (link.arcDirection === "clockwise") ? 1 : 0;

        var yTarget = target.y;
        var xTarget = target.x;

        var xSource = source.x;
        var ySource = source.y;

        if (Math.abs(ySource - yTarget) < Math.pow(10, -10)){
            if (sweepFlag === 1 && dir === "switch") {
                sweepFlag = 0;
            }
            else if (sweepFlag === 0 && dir === "switch") {
                sweepFlag = 1;
            }
            if (xSource < xTarget){
                if (sweepFlag === 1){
                    ySource += shiftValue;
                    yTarget += shiftValue;

                    xSource += shiftValue;
                    xTarget += shiftValue;
                }
                if (sweepFlag === 0){
                    ySource -= shiftValue;
                    yTarget -= shiftValue;

                    xSource += shiftValue;
                    xTarget -= shiftValue;
                }
            }
            if (xSource > xTarget){
                if (sweepFlag === 1){
                    ySource -= shiftValue;
                    yTarget -= shiftValue;

                    xSource -= shiftValue;
                    xTarget += shiftValue;
                }
                if (sweepFlag === 0){
                    ySource += shiftValue;
                    yTarget += shiftValue;

                    xSource -= shiftValue;
                    xTarget += shiftValue;
                }
            }

            return [xSource, ySource, xTarget, yTarget];
        }

        if (Math.abs(xSource - xTarget) < Math.pow(10, -10)){
            if (sweepFlag === 1){
                ySource += shiftValue;
                yTarget += shiftValue;
            }
            if (sweepFlag === 0){
                ySource -= shiftValue;
                yTarget -= shiftValue;
            }

            return [xSource, ySource, xTarget, yTarget];
        }

        if (xSource < xTarget && ySource < yTarget){
            if (sweepFlag === 1){
                xSource += shiftValue;
                yTarget -= shiftValue;

                ySource -= shiftValue;
                xTarget += shiftValue;
            }
            if (sweepFlag === 0){
                xSource -= shiftValue;
                yTarget += shiftValue;

                ySource += shiftValue;
                xTarget -= shiftValue;
            }

            return [xSource, ySource, xTarget, yTarget];
        }

        if (xSource > xTarget && ySource < yTarget){ // ok
            if (sweepFlag === 1){
                xSource += shiftValue;
                yTarget += shiftValue;

                ySource += shiftValue;
                xTarget += shiftValue;
            }
            if (sweepFlag === 0){
                xSource -= shiftValue;
                yTarget -= shiftValue;

                ySource -= shiftValue;
                xTarget -= shiftValue;
            }

            return [xSource, ySource, xTarget, yTarget];
        }

        if (xSource < xTarget && ySource > yTarget){ // ok
            if (sweepFlag === 1){
                ySource += shiftValue;
                xTarget += shiftValue;

                xSource += shiftValue;
                yTarget += shiftValue;
            }
            if (sweepFlag === 0){
                ySource -= shiftValue;
                xTarget -= shiftValue;

                xSource -= shiftValue;
                yTarget -= shiftValue;
            }

            return [xSource, ySource, xTarget, yTarget];
        }

        if (xSource > xTarget && ySource > yTarget){ // ok
            if (sweepFlag === 1){
                ySource -= shiftValue;
                xTarget += shiftValue;

                xSource += shiftValue;
                yTarget -= shiftValue;
            }
            if (sweepFlag === 0){
                ySource += shiftValue;
                xTarget -= shiftValue;

                xSource -= shiftValue;
                yTarget += shiftValue;
            }

            return [xSource, ySource, xTarget, yTarget];
        }
    },

    /**
     * Default drawing of links : path with arrow head
     * @param {LinkData} link The link to draw
     * @param {String} panel
     * @returns {String}
     */
    computeTwoPath: function (source, target, link, shiftValue, dir) {
        var coor = metExploreD3.GraphFlux.computeShiftedCoor(source, target, shiftValue, link, dir);

        var xSource = coor[0];
        var ySource = coor[1];
        var xTarget = coor[2];
        var yTarget = coor[3];

        return "M" + xSource + "," + ySource +
            "L" + xTarget + "," + yTarget;
    },

    /**
     * Default drawing of links : path with arrow head
     * @param {LinkData} link The link to draw
     * @param {String} panel
     * @returns {String}
     */
    computeTwoPathEnd: function (source, target, link, shiftValue, dir) {
        var path;

        var coor = metExploreD3.GraphFlux.computeShiftedCoor(source, target, shiftValue, link, dir);

        var xSource = coor[0];
        var ySource = coor[1];
        var xTarget = coor[2];
        var yTarget = coor[3];

        var d = Math.sqrt(Math.pow(xTarget - xSource, 2) + Math.pow(yTarget - ySource, 2));

        var dX = (xTarget - xSource);
        var dY = (yTarget - ySource);

        if (source.getBiologicalType() == "metabolite") {
            var rTW = (Math.abs(d) * target.getSvgWidth() / 2) / Math.abs(dX);
            var rTH = (Math.abs(d) * target.getSvgHeight() / 2) / Math.abs(dY);
            var largeurNoeudT = (rTW < rTH) ? rT = rTW : rt = rTH;
        }
        else {
            var rTW = (Math.abs(d) * target.getSvgWidth() / 2) / Math.abs(dX);
            var rTH = (Math.abs(d) * target.getSvgHeight() / 2) / Math.abs(dY);
            var largeurNoeudT = (rTW < rTH) ? rT = rTW : rt = rTH;
        }

        var xTarget = xSource + dX * ((d - largeurNoeudT) / d);
        var yTarget = ySource + dY * ((d - largeurNoeudT) / d);

        var heightArrow = 4;
        var xBaseArrowT = xSource + dX * ((d - largeurNoeudT - heightArrow) / d);
        var yBaseArrowT = ySource + dY * ((d - largeurNoeudT - heightArrow) / d);

        var xWBaseArrowT1 = xBaseArrowT + dY * (2 / d);
        var yWBaseArrowT1 = yBaseArrowT - dX * (2 / d);
        var xWBaseArrowT2 = xBaseArrowT - dY * (2 / d);
        var yWBaseArrowT2 = yBaseArrowT + dX * (2 / d);


        path = "M" + xSource + "," + ySource +
            "L" + xBaseArrowT + "," + yBaseArrowT +
            "L" + xWBaseArrowT1 + "," + yWBaseArrowT1 +
            "L" + xTarget + "," + yTarget +
            "L" + xWBaseArrowT2 + "," + yWBaseArrowT2 +
            "L" + xBaseArrowT + "," + yBaseArrowT;

        return path;
    },

    /**
     * Compute link path with arrow head with horizontal start
     * @param {Int} startX position X of the start node
     * @param {Int} startY position Y of the start node
     * @param {Int} firstPointX first X control point for the path
     * @param {Int} firstPointY first Y control point for the path
     * @param {Int} endX position X of the end node
     * @param {Int} endY position Y of the end node
     * @param {Int} fluxValue flux value assign to the start node to know the direction of the reaction
     * @param {Int} shiftValue shift value for two edge compute
     * @returns {String}
     */
    computePathHorizontalEnd : function (startX, startY, firstPointX, firstPointY, endX, endY, fluxValue, shiftValue) {
        // Compute the coordinates of the last point of the arc (the point in contact of the periphery of the target node)
        var metaboliteStyle = metExploreD3.getMetaboliteStyle();
        // Compute the coordinates of the control point used for drawing the path
        var controlX = endX;
        var controlY = startY;
        if (firstPointX < startX && controlX > firstPointX){
            controlX = firstPointX - 15;
        }
        else if (firstPointX > startX && controlX < firstPointX){
            controlX = firstPointX + 15;
        }
        // Compute the path of the link for 3 different cases
        var path;
        var lastPointX = endX;
        var lastPointY = endY;
        var beforeLastPointX = lastPointX;
        var beforeLastPointY = lastPointY;
        if (controlX == endX){
            // 1st case: The end node is on the correct side of the starting node, and is close to the axe of the the reaction
            if (Math.abs(endY - startY) < 15){
                if (firstPointX < startX){
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
                if (firstPointX == startX){
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

                path = "M" + startX + "," + startY +
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
                if (endY < startY){
                    if (endX > startX){
                        beforeLastPointX = beforeLastPointX + shiftValue;
                        lastPointX = lastPointX + shiftValue;
                        controlX = controlX + shiftValue;
                    }
                    if (endX < startX){
                        beforeLastPointX = beforeLastPointX - shiftValue;
                        lastPointX = lastPointX - shiftValue;
                        controlX = controlX - shiftValue;
                    }
                    lastPointY = lastPointY + (metaboliteStyle.getHeight() / 2) - shiftValue;
                    beforeLastPointY = lastPointY + 5;
                }
                else {
                    if (endX > startX){
                        beforeLastPointX = beforeLastPointX - shiftValue;
                        lastPointX = lastPointX - shiftValue;
                        controlX = controlX - shiftValue;
                    }
                    if (endX < startX){
                        beforeLastPointX = beforeLastPointX + shiftValue;
                        lastPointX = lastPointX + shiftValue;
                        controlX = controlX + shiftValue;
                    }
                    lastPointY = lastPointY - (metaboliteStyle.getHeight() / 2) - shiftValue;
                    beforeLastPointY = lastPointY - 5;
                }
                var x1 = beforeLastPointX - 2;
                var x2 = beforeLastPointX + 2;
                var xMo = (beforeLastPointX+lastPointX)/2;

                path = "M" + startX + "," + startY +
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
            if (endY < startY){
                if (firstPointX < startX){
                    lastPointX = endX - (metaboliteStyle.getWidth() / 2);
                    beforeLastPointX = lastPointX - 5;
                    beforeLastPointY = beforeLastPointY - (shiftValue*2);
                    lastPointY = lastPointY - (shiftValue*2);

                    firstPointX -= shiftValue;
                    controlX = controlX - shiftValue;
                    controlY = controlY - shiftValue;
                    var control2X = controlX - shiftValue;
                    var control2Y = endY - shiftValue;
                }
                else {
                    lastPointX = endX + (metaboliteStyle.getWidth() / 2);
                    beforeLastPointX = lastPointX + 5;
                    beforeLastPointY = beforeLastPointY - (shiftValue*2);
                    lastPointY = lastPointY - (shiftValue*2);

                    firstPointX += shiftValue;
                    controlX = controlX + shiftValue;
                    controlY = controlY - shiftValue;
                    var control2X = controlX + shiftValue;
                    var control2Y = endY - shiftValue;
                }
            }
            else {
                if (firstPointX < startX){
                    lastPointX = endX - (metaboliteStyle.getWidth() / 2);
                    beforeLastPointX = lastPointX - 5;
                    beforeLastPointY = beforeLastPointY - (shiftValue*2);
                    lastPointY = lastPointY - (shiftValue*2);

                    firstPointX += shiftValue;
                    controlX = controlX + shiftValue;
                    controlY = controlY - shiftValue;
                    var control2X = controlX + shiftValue;
                    var control2Y = endY - shiftValue;
                }
                else {
                    lastPointX = endX + (metaboliteStyle.getWidth() / 2);
                    beforeLastPointX = lastPointX + 5;
                    beforeLastPointY = beforeLastPointY - (shiftValue*2);
                    lastPointY = lastPointY - (shiftValue*2);

                    firstPointX -= shiftValue;
                    controlX = controlX - shiftValue;
                    controlY = controlY - shiftValue;
                    var control2X = controlX - shiftValue;
                    var control2Y = endY - shiftValue;
                }
            }
            var y1 = beforeLastPointY + 2;
            var y2 = beforeLastPointY - 2;
            var yMo = (lastPointY + beforeLastPointY)/2

            path = "M" + startX + "," + startY +
                "L" + firstPointX + "," + firstPointY +
                "C" + controlX + "," + controlY + "," + control2X + "," + control2Y + "," + beforeLastPointX + "," + beforeLastPointY +
                "L" + beforeLastPointX + "," + y2 +
                "L" + lastPointX + "," + yMo +
                "L" + beforeLastPointX + "," + y1 +
                "L" + beforeLastPointX + "," + beforeLastPointY;
        }
        return path;
    },

    /**
     * Compute link path with arrow head with vertical start
     * @param {Int} startX position X of the start node
     * @param {Int} startY position Y of the start node
     * @param {Int} firstPointX first X control point for the path
     * @param {Int} firstPointY first Y control point for the path
     * @param {Int} endX position X of the end node
     * @param {Int} endY position Y of the end node
     * @param {Int} fluxValue flux value assign to the start node to know the direction of the reaction
     * @param {Int} shiftValue shift value for two edge compute
     * @returns {String}
     */
    computePathVerticalEnd : function (startX, startY, firstPointX, firstPointY, endX, endY, fluxValue, shiftValue) {
        // Compute the coordinates of the last point of the arc (the point in contact of the periphery of the target node)
        var metaboliteStyle = metExploreD3.getMetaboliteStyle();
        // Compute the coordinates of the control point used for drawing the path
        var controlX = startX;
        var controlY = endY;
        if (firstPointY < startY && controlY > firstPointY){
            controlY = firstPointY - 15;
        }
        else if (firstPointY > startY && controlY < firstPointY){
            controlY = firstPointY + 15;
        }
        // Compute the path of the link for 3 different cases
        var path;
        var lastPointX = endX;
        var lastPointY = endY;
        var beforeLastPointX = lastPointX;
        var beforeLastPointY = lastPointY;
        if (controlY == endY){
            // 1st case: The end node is on the correct side of the starting node, and is close to the axe of the the reaction
            if (Math.abs(endX - startX) < 15){
                if (firstPointY < startY){
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
                if (firstPointX == startX){
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

                path = "M" + startX + "," + startY +
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
                if (endX < startX){
                    if (endY > startY){
                        beforeLastPointY = beforeLastPointY + shiftValue;
                        lastPointY = lastPointY + shiftValue;
                        controlY = controlY + shiftValue;
                    }
                    if (endY < startY){
                        beforeLastPointY = beforeLastPointY - shiftValue;
                        lastPointY = lastPointY - shiftValue;
                        controlY = controlY - shiftValue;
                    }
                    lastPointX = lastPointX + (metaboliteStyle.getWidth() / 2) - shiftValue;
                    beforeLastPointX = lastPointX + 5;
                }
                else {
                    if (endY > startY){
                        beforeLastPointY = beforeLastPointY - shiftValue;
                        lastPointY = lastPointY - shiftValue;
                        controlY = controlY - shiftValue;
                    }
                    if (endY < startY){
                        beforeLastPointY = beforeLastPointY + shiftValue;
                        lastPointY = lastPointY + shiftValue;
                        controlY = controlY + shiftValue;
                    }
                    lastPointX = lastPointX - (metaboliteStyle.getWidth() / 2) - shiftValue;
                    beforeLastPointX = lastPointX - 5;
                }
                var y1 = beforeLastPointY + 2;
                var y2 = beforeLastPointY - 2;
                var yMo = (lastPointY + beforeLastPointY)/2

                path = "M" + startX + "," + startY +
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
            if (endX < startX){
                if (firstPointY < startY){
                    lastPointY = endY - (metaboliteStyle.getWidth() / 2);
                    beforeLastPointY = lastPointY - 5;
                    beforeLastPointX = beforeLastPointX - (shiftValue*2);
                    lastPointX = lastPointX - (shiftValue*2);

                    firstPointY -= shiftValue;
                    controlX = controlX - shiftValue;
                    controlY = controlY - shiftValue;
                    var control2X = endX - shiftValue;
                    var control2Y = controlY - shiftValue;
                }
                else {
                    lastPointY = endY + (metaboliteStyle.getWidth() / 2);
                    beforeLastPointY = lastPointY + 5;
                    beforeLastPointX = beforeLastPointX - (shiftValue*2);
                    lastPointX = lastPointX - (shiftValue*2);

                    firstPointY += shiftValue;
                    controlX = controlX - shiftValue;
                    controlY = controlY + shiftValue;
                    var control2X = endX - shiftValue;
                    var control2Y = controlY + shiftValue;
                }
            }
            if (endX > startX){
                if (firstPointY < startY){
                    lastPointY = endY - (metaboliteStyle.getWidth() / 2);
                    beforeLastPointY = lastPointY - 5;
                    beforeLastPointX = beforeLastPointX - (shiftValue*2);
                    lastPointX = lastPointX - (shiftValue*2);

                    firstPointY += shiftValue;
                    controlX = controlX - shiftValue;
                    controlY = controlY + shiftValue;
                    var control2X = endX - shiftValue;
                    var control2Y = controlY + shiftValue;
                }
                else {
                    lastPointY = endY + (metaboliteStyle.getWidth() / 2);
                    beforeLastPointY = lastPointY + 5;
                    beforeLastPointX = beforeLastPointX - (shiftValue*2);
                    lastPointX = lastPointX - (shiftValue*2);

                    firstPointY -= shiftValue;
                    controlX = controlX - shiftValue;
                    controlY = controlY - shiftValue;
                    var control2X = endX - shiftValue;
                    var control2Y = controlY - shiftValue;
                }
            }
            var x1 = beforeLastPointX - 2;
            var x2 = beforeLastPointX + 2;
            var xMo = (beforeLastPointX+lastPointX)/2;

            path = "M" + startX + "," + startY +
                "L" + firstPointX + "," + firstPointY +
                "C" + controlX + "," + controlY + "," + control2X + "," + control2Y + "," + beforeLastPointX + "," + beforeLastPointY +
                "L" + x1 + "," + beforeLastPointY +
                "L" + xMo + "," + lastPointY +
                "L" + x2 + "," + beforeLastPointY +
                "L" + beforeLastPointX + "," + beforeLastPointY;
        }
        return path;
    },

    /**
     * Remove flux display and restore link style
     * @param {LinkStyle} linkStyle Store which contains links style
     */
    restoreStyles: function(linkStyle){
        // remove all flux value from nodes
        var reactions = d3.select("#viz").select("#D3viz").select("#graphComponent")
            .selectAll("g.node")
            .filter(function(node){
                return node.getBiologicalType()=="reaction";
            });
        reactions.each(function(node) {
            node.fluxDirection1 = undefined;
            node.fluxDirection2 = undefined;

            node.valueCond1 = undefined;
            node.valueCond2 = undefined;

            node.color1 = undefined;
            node.color2 = undefined;

            node.axe = undefined;
        });

        // remove link clone
        d3.select("#viz").select("#D3viz").select("#graphComponent").selectAll("path.link.clone").remove();

        // restore link style
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
                        .classed("fluxstylelink", false)
                        .style("stroke", linkStyle.getStrokeColor())
                        .style("stroke-width", linkStyle.getLineWidth())
                        .style("opacity", linkStyle.getOpacity())
                        .style("stroke-dasharray", null);
        });
        if (metExploreD3.GraphStyleEdition.curvedPath === true){
            metExploreD3.GraphLink.bundleLinks("viz");
        }
        if(_metExploreViz.getMappingsLength()>0){
    		metExploreD3.GraphLink.majMapping(Ext.ComponentQuery.query('aStyleForm'));
        }
    },

    /**
     * Create distribution graph for one condition
     * @param {Array} fluxData flux data for the first condition
     * @param {String} color hexadecimal to color graph first condition
     * @param {Boolean} switchGraph switch between only data on network and all data in dataset
     * @param {String} scaleSelector compute different graph in function of scale selector mod select
     * @param {Array} scaleRange scale range for the first condition
     */
    graphDistribOne: function(fluxData, color, switchGraph, scaleSelector, scaleRange){
        var data = [];
        var valNeg = [];
        var valPos = [];
        var valDistrib = [];

        var min = 0;
        var max = 0;

        if (switchGraph === false){
            fluxData.forEach(function(value) {
                var val = value[1]*1;
                data.push({cond:val});
                if (min > val){
                    min = val;
                }
                if (max < val){
                    max = val;
                }
                if (val < 0){
                    valNeg.push(val);
                    valDistrib.push(val*(-1));
                }
                if (val > 0){
                    valPos.push(val);
                    valDistrib.push(val);
                }
            });
        }

        if (switchGraph === true){
            var session = _metExploreViz.getSessionById('viz');
            var networkData = session.getD3Data();
            fluxData.forEach(function(value) {
                var nodeName = networkData.getNodeByName(value[0]);
                var nodeId = networkData.getNodeByDbIdentifier(value[0]);
                if (nodeName !== undefined || nodeId !== undefined){
                    var val = value[1]*1;
                    data.push({cond:val});
                    if (min > val){
                        min = val;
                    }
                    if (max < val){
                        max = val;
                    }
                    if (val < 0){
                        valNeg.push(val);
                        valDistrib.push(val*(-1));
                    }
                    if (val > 0){
                        valPos.push(val);
                        valDistrib.push(val);
                    }
                }
            });
        }

        var margin = {top: 30, right: 30, bottom: 80, left: 50},
            width = 460 - margin.left - margin.right,
            height = 450 - margin.top - margin.bottom;

        var svg = d3.select("#graphDistrib")
                    .append("svg")
                        .attr("id", "distrib")
                        .attr("width", width + margin.left + margin.right)
                        .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                        .attr("transform", "translate("+ margin.left + "," + margin.right +")");

        var x = d3.scaleLinear()
                    .domain([min, max])
                    .range([0, width]);

        svg.append("g")
            .attr("transform", "translate(0,"+ height + ")")
            .call(d3.axisBottom(x));

        var histogram = d3.histogram()
            .value(function(d){ return d.cond; })
            .domain(x.domain())
            .thresholds(x.ticks(50));

        var bins = histogram(data);

        var y = d3.scaleLinear()
                .range([height, 0]);
        y.domain([0, d3.max(bins, function(d) { return d.length; })]);

        svg.append("g")
            .call(d3.axisLeft(y));

        svg.selectAll("rect")
            .data(bins)
            .enter()
            .append("rect")
                .attr("x", 1)
                .attr("opacity", 0.6)
                .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
                .attr("width", function(d) { return x(d.x1) - x(d.x0); })
                .attr("height", function(d) { return height - y(d.length); })
                .style("fill", color);


        svg.append("text")
            .attr("x", (width / 2))
            .attr("y", (height+50))
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .style("text-decoration", "underline")
            .text("Distribution Graph");

        if (scaleSelector === "Automatic"){
            var distrib = metExploreD3.GraphFlux.fluxDistribution(valDistrib);
            var interLineNeg = {x1: distrib["inter"]*(-1), x2: distrib["inter"]*(-1), y1: 0, y2: 340};
            var interLinePos = {x1: distrib["inter"], x2: distrib["inter"], y1: 0, y2: 340};

            if (min < 0) {
                if (interLineNeg.x1 !== undefined){
                    svg.append("line")
                        .attr("x1", function(){ return x(interLineNeg.x1) })
                        .attr("x2", function(){ return x(interLineNeg.x2) })
                        .attr("y1", interLineNeg.y1)
                        .attr("y2", interLineNeg.y2)
                        .attr("stroke","black");
                }
            }

            if (max > 0) {
                if (interLinePos.x1 !== undefined){
                    svg.append("line")
                        .attr("x1", function(){ return x(interLinePos.x1) })
                        .attr("x2", function(){ return x(interLinePos.x2) })
                        .attr("y1", interLinePos.y1)
                        .attr("y2", interLinePos.y2)
                        .attr("stroke","black");
                }
            }
        }

        if (scaleSelector === "Manual"){
            for (var i = 2; i < scaleRange.length - 2; i++){
                var stroke = scaleRange[i];
                var interLine = {x1: stroke.value, x2: stroke.value, y1: 0, y2: 340};

                svg.append("line")
                    .attr("x1", function(){ return x(interLine.x1) })
                    .attr("x2", function(){ return x(interLine.x2) })
                    .attr("y1", interLine.y1)
                    .attr("y2", interLine.y2)
                    .attr("stroke","black");
            }
        }
    },

    /**
     * Create distribution graph for two condition
     * @param {Array} fluxData flux data for the two conditions
     * @param {String} color hexadecimal to color graph two conditions
     * @param {Boolean} switchGraph switch between only data on network and all data in dataset
     * @param {String} scaleSelector compute different graph in function of scale selector mod select
     * @param {Array} scaleRange1 scale range for the first condition
     * @param {Array} scaleRange2 scale range for the second condition
     */
    graphDistribTwo: function(fluxData, color, switchGraph, scaleSelector, scaleRange1){
        var data = [];
        var valNeg = [];
        var valPos = [];
        var valDistrib = [];

        var min = 0;
        var max = 0;

        if (switchGraph === false){
            fluxData.forEach(function(value) {
                var val1 = value[1]*1;
                var val2 = value[2]*1;
                data.push({cond:1, value:val1});
                data.push({cond:2, value:val2});
                if (min > val1){
                    min = val1;
                }
                if (max < val1){
                    max = val1;
                }
                if (min > val2){
                    min = val2;
                }
                if (max < val2){
                    max = val2;
                }
                if (val1 < 0){
                    valNeg.push(val1);
                    valDistrib.push(val1*(-1));
                }
                if (val1 > 0){
                    valPos.push(val1);
                    valDistrib.push(val1);
                }
                if (val2 < 0){
                    valNeg.push(val2);
                    valDistrib.push(val2*(-1));
                }
                if (val2 > 0){
                    valPos.push(val2);
                    valDistrib.push(val2);
                }
            });
        }
        if (switchGraph === true){
            var session = _metExploreViz.getSessionById('viz');
            var networkData = session.getD3Data();
            fluxData.forEach(function(value) {
                var nodeName = networkData.getNodeByName(value[0]);
                var nodeId = networkData.getNodeByDbIdentifier(value[0]);
                if (nodeName !== undefined || nodeId !== undefined){
                    var val1 = value[1]*1;
                    var val2 = value[2]*1;
                    data.push({cond:1, value:val1});
                    data.push({cond:2, value:val2});
                    if (min > val1){
                        min = val1;
                    }
                    if (max < val1){
                        max = val1;
                    }
                    if (min > val2){
                        min = val2;
                    }
                    if (max < val2){
                        max = val2;
                    }
                    if (val1 < 0){
                        valNeg.push(val1);
                        valDistrib.push(val1*(-1));
                    }
                    if (val1 > 0){
                        valPos.push(val1);
                        valDistrib.push(val1);
                    }
                    if (val2 < 0){
                        valNeg.push(val2);
                        valDistrib.push(val2*(-1));
                    }
                    if (val2 > 0){
                        valPos.push(val2);
                        valDistrib.push(val2);
                    }
                }
            });
        }

        // set the dimensions and margins of the graph
        var margin = {top: 30, right: 30, bottom: 80, left: 50},
            width = 460 - margin.left - margin.right,
            height = 450 - margin.top - margin.bottom;

        // append the svg object to the body of the page
        var svg = d3.select("#graphDistrib")
            .append("svg")
                .attr("id", "distrib")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                    .attr("transform",
                    "translate(" + margin.left + "," + margin.top + ")");

        var x = d3.scaleLinear()
                    .domain([min, max])
                    .range([0, width]);

        svg.append("g")
            .attr("transform", "translate(0,"+ height + ")")
            .call(d3.axisBottom(x));

        var histogram = d3.histogram()
            .value(function(d){ return d.value; })
            .domain(x.domain())
            .thresholds(x.ticks(50));

        var bins1 = histogram(data.filter(function(d){return d.cond===1}));
        var bins2 = histogram(data.filter(function(d){return d.cond===2}));
        var bins = histogram(data);

        var y = d3.scaleLinear()
                .range([height, 0]);
        y.domain([0, d3.max(bins, function(d) { return d.length; })]);

        svg.append("g")
            .call(d3.axisLeft(y));

        svg.selectAll("rect")
            .data(bins1)
            .enter()
            .append("rect")
                .attr("x", 1)
                .attr("opacity", 0.6)
                .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
                .attr("width", function(d) { return x(d.x1) - x(d.x0); })
                .attr("height", function(d) { return height - y(d.length); })
                .style("fill", color[0]);

        svg.selectAll("rect2")
            .data(bins2)
            .enter()
            .append("rect")
                .attr("x", 1)
                .attr("opacity", 0.6)
                .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
                .attr("width", function(d) { return x(d.x1) - x(d.x0); })
                .attr("height", function(d) { return height - y(d.length); })
                .style("fill", color[1]);

        // Handmade legend
        svg.append("circle").attr("cx",(width / 2)).attr("cy",(height+40)).attr("r", 6).style("fill", color[0]);
        svg.append("circle").attr("cx",(width / 2)).attr("cy",(height+70)).attr("r", 6).style("fill", color[1]);
        svg.append("text").attr("x", ((width / 2)+20)).attr("y", (height+40)).text("First Condition").style("font-size", "15px").attr("alignment-baseline","middle");
        svg.append("text").attr("x", ((width / 2)+20)).attr("y", (height+70)).text("Second Condition").style("font-size", "15px").attr("alignment-baseline","middle");

        svg.append("text")
            .attr("x", 70)
            .attr("y", (height+40))
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .style("text-decoration", "underline")
            .text("Distribution Graph");

        if (scaleSelector === "Automatic"){
            var distrib = metExploreD3.GraphFlux.fluxDistribution(valDistrib);
            var interLineNeg = {x1: distrib["inter"]*(-1), x2: distrib["inter"]*(-1), y1: 100, y2: 340};
            var interLinePos = {x1: distrib["inter"], x2: distrib["inter"], y1: 100, y2: 340};

            if (interLineNeg.x1 !== undefined){
                if (min < 0) {
                    svg.append("line")
                        .attr("x1", function(){ return x(interLineNeg.x1) })
                        .attr("x2", function(){ return x(interLineNeg.x2) })
                        .attr("y1", interLineNeg.y1)
                        .attr("y2", interLineNeg.y2)
                        .attr("stroke","black");
                }
            }

            if (interLinePos.x1 !== undefined){
                if (max > 0) {
                    svg.append("line")
                        .attr("x1", function(){ return x(interLinePos.x1) })
                        .attr("x2", function(){ return x(interLinePos.x2) })
                        .attr("y1", interLinePos.y1)
                        .attr("y2", interLinePos.y2)
                        .attr("stroke","black");
                }
            }
        }

        if (scaleSelector === "Manual"){
            for (var i = 2; i < scaleRange1.length - 2; i++){
                var stroke = scaleRange1[i];
                var interLine = {x1: stroke.value, x2: stroke.value, y1: 0, y2: 340};

                svg.append("line")
                    .attr("x1", function(){ return x(interLine.x1) })
                    .attr("x2", function(){ return x(interLine.x2) })
                    .attr("y1", interLine.y1)
                    .attr("y2", interLine.y2)
                    .attr("stroke", color[0]);
            }
        }
    },

    /**
     * Remove distribution graph
     */
    removeGraphDistrib: function(){
        d3.select("#graphDistrib").selectAll("#distrib").remove();
    },

    /**
     * Compute link path without arrow head for vertical start
     * @param {Int} startX position X of the start node
     * @param {Int} startY position Y of the start node
     * @param {Int} firstPointX first X control point for the path
     * @param {Int} firstPointY first Y control point for the path
     * @param {Int} endX position X of the end node
     * @param {Int} endY position Y of the end node
     * @param {Int} shiftValue shift value for two edge compute
     * @returns {String}
     */
    twoPathVertical : function (startX, startY, firstPointX, firstPointY, endX, endY, shiftValue) {
        // Compute the coordinates of the last point of the arc (the point in contact of the periphery of the target node)
        var metaboliteStyle = metExploreD3.getMetaboliteStyle();
        // Compute the coordinates of the control point used for drawing the path
        var controlX = startX;
        var controlY = endY;
        if (firstPointY < startY && controlY > firstPointY){
            controlY = firstPointY - 15;
        }
        else if (firstPointY > startY && controlY < firstPointY){
            controlY = firstPointY + 15;
        }
        // Compute the path of the link for 3 different cases
        var path;
        var lastPointX = endX;
        var lastPointY = endY;
        var beforeLastPointX = lastPointX;
        var beforeLastPointY = lastPointY;
        if (controlY == endY){
            // 1st case: The end node is on the correct side of the starting node, and is close to the axe of the the reaction
            if (Math.abs(endX - startX) < 15){
                if (firstPointY < startY){
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
                if (firstPointX == startX){
                    firstSidePointX = firstPointX;
                    secondSidePointX = lastPointX;
                }
                else {
                    firstSidePointY = firstPointY;
                    secondSidePointY = lastPointY;
                }
                path = "M" + startX + "," + startY +
                    "L" + firstPointX + "," + firstPointY +
                    "Q" + firstSidePointX + "," + firstSidePointY + "," + middlePointX + "," + middlePointY +
                    "Q" + secondSidePointX + "," + secondSidePointY + "," + beforeLastPointX + "," + beforeLastPointY +
                    "L" + lastPointX + "," + lastPointY;
            }
            // 2nd case: The end node is on the correct side of the starting node, and is not close to the axe of the the reaction
            else {
                if (endX < startX){
                    if (endY > startY){
                        beforeLastPointY = beforeLastPointY + shiftValue;
                        lastPointY = lastPointY + shiftValue;
                        controlY = controlY + shiftValue;
                    }
                    if (endY < startY){
                        beforeLastPointY = beforeLastPointY - shiftValue;
                        lastPointY = lastPointY - shiftValue;
                        controlY = controlY - shiftValue;
                    }
                    lastPointX = lastPointX + (metaboliteStyle.getWidth() / 2) - shiftValue;
                    beforeLastPointX = lastPointX + 5;
                }
                else {
                    if (endY > startY){
                        beforeLastPointY = beforeLastPointY - shiftValue;
                        lastPointY = lastPointY - shiftValue;
                        controlY = controlY - shiftValue;
                    }
                    if (endY < startY){
                        beforeLastPointY = beforeLastPointY + shiftValue;
                        lastPointY = lastPointY + shiftValue;
                        controlY = controlY + shiftValue;
                    }
                    lastPointX = lastPointX - (metaboliteStyle.getWidth() / 2) - shiftValue;
                    beforeLastPointX = lastPointX - 5;
                }
                path = "M" + startX + "," + startY +
                    "L" + firstPointX + "," + firstPointY +
                    "Q" + controlX + "," + controlY + "," + beforeLastPointX + "," + beforeLastPointY +
                    "L" + lastPointX + "," + lastPointY;
            }
        }
        // 3rd case: The end node is not on the correct side of the reaction
        else {
            if (endX < startX){
                if (firstPointY < startY){
                    lastPointY = endY - (metaboliteStyle.getWidth() / 2);
                    beforeLastPointY = lastPointY - 5;
                    beforeLastPointX = beforeLastPointX - (shiftValue*2);
                    lastPointX = lastPointX - (shiftValue*2);

                    firstPointY -= shiftValue;
                    controlX = controlX - shiftValue;
                    controlY = controlY - shiftValue;
                    var control2X = endX - shiftValue;
                    var control2Y = controlY - shiftValue;
                }
                else {
                    lastPointY = endY + (metaboliteStyle.getWidth() / 2);
                    beforeLastPointY = lastPointY + 5;
                    beforeLastPointX = beforeLastPointX - (shiftValue*2);
                    lastPointX = lastPointX - (shiftValue*2);

                    firstPointY += shiftValue;
                    controlX = controlX - shiftValue;
                    controlY = controlY + shiftValue;
                    var control2X = endX - shiftValue;
                    var control2Y = controlY + shiftValue;
                }
            }
            if (endX > startX){
                if (firstPointY < startY){
                    lastPointY = endY - (metaboliteStyle.getWidth() / 2);
                    beforeLastPointY = lastPointY - 5;
                    beforeLastPointX = beforeLastPointX - (shiftValue*2);
                    lastPointX = lastPointX - (shiftValue*2);

                    firstPointY += shiftValue;
                    controlX = controlX - shiftValue;
                    controlY = controlY + shiftValue;
                    var control2X = endX - shiftValue;
                    var control2Y = controlY + shiftValue;
                }
                else {
                    lastPointY = endY + (metaboliteStyle.getWidth() / 2);
                    beforeLastPointY = lastPointY + 5;
                    beforeLastPointX = beforeLastPointX - (shiftValue*2);
                    lastPointX = lastPointX - (shiftValue*2);

                    firstPointY -= shiftValue;
                    controlX = controlX - shiftValue;
                    controlY = controlY - shiftValue;
                    var control2X = endX - shiftValue;
                    var control2Y = controlY - shiftValue;
                }
            }

            path = "M" + startX + "," + startY +
                "L" + firstPointX + "," + firstPointY +
                "C" + controlX + "," + controlY + "," + control2X + "," + control2Y + "," + beforeLastPointX + "," + beforeLastPointY +
                "L" + lastPointX + "," + lastPointY;
        }
        return path;
    },

    /**
     * Compute link path without arrow head for horizontal start
     * @param {Int} startX position X of the start node
     * @param {Int} startY position Y of the start node
     * @param {Int} firstPointX first X control point for the path
     * @param {Int} firstPointY first Y control point for the path
     * @param {Int} endX position X of the end node
     * @param {Int} endY position Y of the end node
     * @param {Int} shiftValue shift value for two edge compute
     * @returns {String}
     */
    twoPathHorizontal : function (startX, startY, firstPointX, firstPointY, endX, endY, shiftValue) {
        // Compute the coordinates of the last point of the arc (the point in contact of the periphery of the target node)
        var metaboliteStyle = metExploreD3.getMetaboliteStyle();
        // Compute the coordinates of the control point used for drawing the path
        var controlX = endX;
        var controlY = startY;
        if (firstPointX < startX && controlX > firstPointX){
            controlX = firstPointX - 15;
        }
        else if (firstPointX > startX && controlX < firstPointX){
            controlX = firstPointX + 15;
        }
        // Compute the path of the link for 3 different cases
        var path;
        var lastPointX = endX;
        var lastPointY = endY;
        var beforeLastPointX = lastPointX;
        var beforeLastPointY = lastPointY;
        if (controlX == endX){
            // 1st case: The end node is on the correct side of the starting node, and is close to the axe of the the reaction
            if (Math.abs(endY - startY) < 15){
                if (firstPointX < startX){
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
                if (firstPointX == startX){
                    firstSidePointX = firstPointX;
                    secondSidePointX = lastPointX;
                }
                else {
                    firstSidePointY = firstPointY;
                    secondSidePointY = lastPointY;
                }
                path = "M" + startX + "," + startY +
                    "L" + firstPointX + "," + firstPointY +
                    "Q" + firstSidePointX + "," + firstSidePointY + "," + middlePointX + "," + middlePointY +
                    "Q" + secondSidePointX + "," + secondSidePointY + "," + beforeLastPointX + "," + beforeLastPointY +
                    "L" + lastPointX + "," + lastPointY;
            }
            // 2nd case: The end node is on the correct side of the starting node, and is not close to the axe of the the reaction
            else {
                if (endY < startY){
                    if (endX > startX){
                        beforeLastPointX = beforeLastPointX + shiftValue;
                        lastPointX = lastPointX + shiftValue;
                        controlX = controlX + shiftValue;
                    }
                    if (endX < startX){
                        beforeLastPointX = beforeLastPointX - shiftValue;
                        lastPointX = lastPointX - shiftValue;
                        controlX = controlX - shiftValue;
                    }
                    lastPointY = lastPointY + (metaboliteStyle.getHeight() / 2) - shiftValue;
                    beforeLastPointY = lastPointY + 5;
                }
                else {
                    if (endX > startX){
                        beforeLastPointX = beforeLastPointX - shiftValue;
                        lastPointX = lastPointX - shiftValue;
                        controlX = controlX - shiftValue;
                    }
                    if (endX < startX){
                        beforeLastPointX = beforeLastPointX + shiftValue;
                        lastPointX = lastPointX + shiftValue;
                        controlX = controlX + shiftValue;
                    }
                    lastPointY = lastPointY - (metaboliteStyle.getHeight() / 2) - shiftValue;
                    beforeLastPointY = lastPointY - 5;
                }
                path = "M" + startX + "," + startY +
                    "L" + firstPointX + "," + firstPointY +
                    "Q" + controlX + "," + controlY + "," + beforeLastPointX + "," + beforeLastPointY +
                    "L" + lastPointX + "," + lastPointY;
            }
        }
        // 3rd case: The end node is not on the correct side of the reaction
        else {
            if (endY < startY){
                if (firstPointX < startX){
                    lastPointX = endX - (metaboliteStyle.getWidth() / 2);
                    beforeLastPointX = lastPointX - 5;
                    beforeLastPointY = beforeLastPointY - (shiftValue*2);
                    lastPointY = lastPointY - (shiftValue*2);

                    firstPointX -= shiftValue;
                    controlX = controlX - shiftValue;
                    controlY = controlY - shiftValue;
                    var control2X = controlX - shiftValue;
                    var control2Y = endY - shiftValue;
                }
                else {
                    lastPointX = endX + (metaboliteStyle.getWidth() / 2);
                    beforeLastPointX = lastPointX + 5;
                    beforeLastPointY = beforeLastPointY - (shiftValue*2);
                    lastPointY = lastPointY - (shiftValue*2);

                    firstPointX += shiftValue;
                    controlX = controlX + shiftValue;
                    controlY = controlY - shiftValue;
                    var control2X = controlX + shiftValue;
                    var control2Y = endY - shiftValue;
                }
            }
            else {
                if (firstPointX < startX){
                    lastPointX = endX - (metaboliteStyle.getWidth() / 2);
                    beforeLastPointX = lastPointX - 5;
                    beforeLastPointY = beforeLastPointY - (shiftValue*2);
                    lastPointY = lastPointY - (shiftValue*2);

                    firstPointX += shiftValue;
                    controlX = controlX + shiftValue;
                    controlY = controlY - shiftValue;
                    var control2X = controlX + shiftValue;
                    var control2Y = endY - shiftValue;
                }
                else {
                    lastPointX = endX + (metaboliteStyle.getWidth() / 2);
                    beforeLastPointX = lastPointX + 5;
                    beforeLastPointY = beforeLastPointY - (shiftValue*2);
                    lastPointY = lastPointY - (shiftValue*2);

                    firstPointX -= shiftValue;
                    controlX = controlX - shiftValue;
                    controlY = controlY - shiftValue;
                    var control2X = controlX - shiftValue;
                    var control2Y = endY - shiftValue;
                }
            }
            path = "M" + startX + "," + startY +
                "L" + firstPointX + "," + firstPointY +
                "C" + controlX + "," + controlY + "," + control2X + "," + control2Y + "," + beforeLastPointX + "," + beforeLastPointY +
                "L" + lastPointX + "," + lastPointY;
        }
        return path;
    },

    /**
     * Add label and flux value on network
     * @param {Int} size font size
     * @param {String} label label to display
     */
    addValueOnEdge: function(size, label){
        var reactions = d3.select("#viz").select("#D3viz").select("#graphComponent")
            .selectAll("g.node")
            .filter(function(node){
                return node.getBiologicalType()=="reaction";
            });

        var labelDrag = d3.drag()
            .on("drag", metExploreD3.GraphFlux.dragMove);

        reactions.each(function(react){
            if (label === "Reaction Name"){
                var textLabel = react.name+" : ";
            }
            if (label === "Reaction Identifier"){
                var textLabel = react.dbIdentifier+" : ";
            }
            if (label === "None"){
                var textLabel = "";
            }

            if (react.axe === "horizontal"){
                var posX = react.x-20;
                var posY = react.y+15;
            }
            if (react.axe === "vertical"){
                var posX = react.x+15;
                var posY = react.y;
            }
            if (react.valueCond1 !== undefined && react.valueCond2 === undefined){
                var target = d3.select("#viz").select("#D3viz").select("#graphComponent");
                target.append("text")
                    .attr("x", posX)
                    .attr("y", posY)
                    .attr("fill", react.color1)
                    .attr("font-size", size)
                    .classed("valueLabel", true)
                    .text(textLabel+react.valueCond1)
                    .call(labelDrag);
            }
            if (react.valueCond2 !== undefined && react.valueCond1 !== undefined){
                var target = d3.select("#viz").select("#D3viz").select("#graphComponent");
                var valueLabel = target.append("g")
                                        .attr("class","label")
                                        .attr("x", posX)
                                        .attr("y", posY)
                                        .call(labelDrag);
                valueLabel.append("text")
                        .attr("fill", react.color1)
                        .attr("x", posX)
                        .attr("y", posY)
                        .attr("font-size", size)
                        .classed("valueLabel", true)
                        .text(textLabel+react.valueCond1);
                valueLabel.append("text")
                        .attr("fill", react.color2)
                        .attr("x", posX)
                        .attr("y", posY+15)
                        .attr("font-size", size)
                        .classed("valueLabel", true)
                        .text(textLabel+react.valueCond2);
            }
        });
    },

    addSdOnEdge: function(size, label, sdData){
        var reactions = d3.select("#viz").select("#D3viz").select("#graphComponent")
            .selectAll("g.node")
            .filter(function(node){
                return node.getBiologicalType()=="reaction";
            });

        var targetLabel = sdData[1];
        var data = sdData[0];
        var sd = {};

        for (var i = 0; i < data.length; i++){
            sd[data[i][0]] = data[i][1];
        }

        var labelDrag = d3.drag()
            .on("drag", metExploreD3.GraphFlux.dragMove);

        reactions.each(function(react){
            if (targetLabel === "Name"){
                var sdReact = sd[react.name];
            }
            if (targetLabel === "reactionId"){
                var sdReact = sd[react.id];
            }
            if (targetLabel === "Identifier"){
                var sdReact = sd[react.dbIdentifier];
            }
            if (label === "Reaction Name"){
                var textLabel = react.name+" : "+sdReact;
            }
            if (label === "Reaction Identifier"){
                var textLabel = react.dbIdentifier+" : "+sdReact;
            }
            if (label === "None"){
                var textLabel = sdReact;
            }

            if (react.axe === "horizontal"){
                var posX = react.x-20;
                var posY = react.y+15;
            }
            if (react.axe === "vertical"){
                var posX = react.x+15;
                var posY = react.y;
            }

            if (sdReact !== undefined){
                var target = d3.select("#viz").select("#D3viz").select("#graphComponent");
                target.append("text")
                    .attr("x", posX)
                    .attr("y", posY)
                    .attr("fill", react.color1)
                    .attr("font-size", size)
                    .classed("valueLabel", true)
                    .text(textLabel)
                    .call(labelDrag);
            }
        });
    },

    /**
     * Remove label and flux value on network
     */
    removeValueOnEdge: function(){
        d3.select("#viz").select("#D3viz").select("#graphComponent").selectAll("text.valueLabel").remove();
    },

    /**
     * Drag function for label and flux value on network
     * @param {Object} d
     */
    dragMove: function(d){
        d3.select(this)
            .attr("y", d3.event.y)
            .attr("x", d3.event.x);
        var labels = d3.select(this).selectAll("text.valueLabel");
        var labelGroup = labels._groups;
        labelGroup[0].forEach(function(label, i){
            d3.select(label).attr("x", d3.event.x)
                            .attr("y", d3.event.y+(i*15));

        });
    },

    /**
     * Set font size for label and flux value on network
     * @param {Int} size font size
     */
    setFontSize: function(size){
        var labels = d3.select("#viz").select("#D3viz").select("#graphComponent").selectAll("text.valueLabel");
        var labelGroup = labels._groups;
        labelGroup[0].forEach(function(label){
            d3.select(label).attr("font-size", size);
        });
    }

};
