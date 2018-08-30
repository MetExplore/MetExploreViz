/**
 * @author MC
 * (a)description : Drawing links
 */
metExploreD3.GraphLink = {

    link: "",
    panelParent: "",

    /**********************************************/
    // INIT FUNCTIONS
    /**********************************************/
    delayedInitialisation: function (parent) {
        metExploreD3.GraphLink.panelParent = parent;
    },

    

    //arrayValue already scale
    funcPathForFlux: function (link, panel, linkId) {
        var source, target, path, reaction;
        var mappingName = _metExploreViz.getSessionById('viz').getActiveMapping();
        var conditions = _metExploreViz.getSessionById(panel).isMapped();
        var map1, map2;
        var minValue = undefined;
        var maxValue = undefined;

        d3.select("#" + panel).select("#D3viz").select("#graphComponent").selectAll(".linklabel")
            .attr("x", function (d) {
                return (d.source.x + d.target.x) / 2;
            })
            .attr("y", function (d) {
                return (d.source.y + d.target.y) / 2;
            });

        var colors = _metExploreViz.getSessionById('viz').getColorMappingsSet();
        colors.forEach(function (color) {
            if (maxValue == undefined | color.getName() > maxValue) maxValue = color.getName();
        });

        var scaleValue = d3.scale.linear()
            .domain([-maxValue, 0, 0, maxValue])
            .range([-7, -1, 1, 7]);

        function pathForReversibleReactions(source, target) {
            var metaboliteStyle = metExploreD3.getMetaboliteStyle();
            var reactionStyle = metExploreD3.getReactionStyle();

            map1 = reaction.getMappingDataByNameAndCond(mappingName, conditions[0]);
            map2 = reaction.getMappingDataByNameAndCond(mappingName, conditions[1]);
            // Check whether to use linear flux value or discretized value
            var map1Value;
            var map2Value;
            if (map1 !== null){
                map1Value = map1.getMapValue();
                if (map1.hasOwnProperty('binnedMapValue')) {
                    map1Value = map1.binnedMapValue;
                }
            }
            if (map2 !== null){
                map2Value = map2.getMapValue();
                if (map2.hasOwnProperty('binnedMapValue')) {
                    map2Value = map2.binnedMapValue;
                }
            }

            var d = Math.sqrt(Math.pow(target.x - source.x, 2) + Math.pow(target.y - source.y, 2));
            var dX = (target.x - source.x);
            var dY = (target.y - source.y);
            var diffX = dX / Math.abs(dX);
            var diffY = dY / Math.abs(dY);
            if (linkId == 'linkRev') {
                if (map2 == null)
                    var value = 0;
                else {
                    if (isNaN(map2Value))
                        var value = 0;
                    else
                        var value = scaleValue(map2Value);
                }

                if (value == -1 || value == 1)
                    value = 0;

                if (value < 0)
                    path = pathSimple(target, source, value);
                else
                    path = pathSimpleOtherSide(source, target, value);

            }
            else {
                if (map1 == null)
                    var value = 0;
                else {
                    if (isNaN(map1Value))
                        var value = 0;
                    else
                        var value = scaleValue(map1Value);
                }

                if (value == -1 || value == 1)
                    value = 0;

                if (value < 0)
                    path = pathSimpleOtherSide(target, source, value);
                else
                    path = pathSimple(source, target, value);
            }

            return path;
        }

        function pathSimpleOtherSide(source, target, value) {

            var metaboliteStyle = metExploreD3.getMetaboliteStyle();
            var reactionStyle = metExploreD3.getReactionStyle();
            var d = Math.sqrt(Math.pow(target.x - source.x, 2) + Math.pow(target.y - source.y, 2));
            var dX = (target.x - source.x);
            var dY = (target.y - source.y);
            var diffX = dX / Math.abs(dX);
            var diffY = dY / Math.abs(dY);
            if (source.getBiologicalType() == "metabolite") {
                var rTW = (Math.abs(d) * reactionStyle.getWidth() / 2) / Math.abs(dX);
                var rTH = (Math.abs(d) * reactionStyle.getHeight() / 2) / Math.abs(dY);
                var largeurNoeudT = (rTW < rTH) ? rT = rTW : rt = rTH;
            }
            else {
                var rTW = (Math.abs(d) * metaboliteStyle.getWidth() / 2) / Math.abs(dX);
                var rTH = (Math.abs(d) * metaboliteStyle.getHeight() / 2) / Math.abs(dY);
                var largeurNoeudT = (rTW < rTH) ? rT = rTW : rt = rTH;
            }

            var xTarget = source.x + dX * ((d - largeurNoeudT) / d);
            var yTarget = source.y + dY * ((d - largeurNoeudT) / d);

            // 5 -- 15
            var heightArrow = 2 * Math.abs(value);
            if (heightArrow < 3) heightArrow = 3;
            var xBaseArrow = source.x + dX * ((d - largeurNoeudT - heightArrow) / d);
            var yBaseArrow = source.y + dY * ((d - largeurNoeudT - heightArrow) / d);

            // 2 -- 6
            var widthArrow = 2.5 * Math.abs(value);
            var widthFeet = (2.5 * Math.abs(value)) * 1 / 2;
            if (widthArrow < 2) widthArrow = 2;

            var xWBaseArrow = xBaseArrow + dY * (-widthArrow / d);
            var yWBaseArrow = yBaseArrow - dX * (-widthArrow / d);

            var xIntermBaseArrow = xBaseArrow + dY * (-widthFeet / d);
            var yIntermBaseArrow = yBaseArrow - dX * (-widthFeet / d);

            // 1.5 -- 4.5
            var heightFeet = Math.abs(value);
            var xBaseFeet = source.x + dX * (heightFeet / d);
            var yBaseFeet = source.y + dY * (heightFeet / d);

            var xWBaseFeet = xBaseFeet + dY * (-widthFeet / d);
            var yWBaseFeet = yBaseFeet - dX * (-widthFeet / d);

            var d2 = Math.sqrt(Math.pow(xTarget - source.x, 2) + Math.pow(yTarget - source.y, 2));
            if (heightArrow + heightFeet > d2) {
                xWBaseFeet = xIntermBaseArrow;
                yWBaseFeet = yIntermBaseArrow;
            }

            var xSource = source.x;
            var ySource = source.y;
            // if(heightArrow>d2){
            // 	xSource=xBaseArrow;
            // 	ySource=yBaseArrow;
            // }

            if (linkId == 'linkRev')
                return "M" + (xSource + dY * (-2 / d)) + "," + (ySource - dX * (-2 / d)) +
                    "L" + (xTarget + dY * (-2 / d)) + "," + (yTarget - dX * (-2 / d)) +
                    "L" + (xWBaseArrow + dY * (-2 / d)) + "," + (yWBaseArrow - dX * (-2 / d)) +
                    "L" + (xIntermBaseArrow + dY * (-2 / d)) + "," + (yIntermBaseArrow - dX * (-2 / d)) +
                    "L" + (xWBaseFeet + dY * (-2 / d)) + "," + (yWBaseFeet - dX * (-2 / d)) +
                    "L" + (xSource + dY * (-2 / d)) + "," + (ySource - dX * (-2 / d)) + "Z";
            else
                return "M" + xSource + "," + ySource + "L" + xTarget + "," + yTarget + "L" + xWBaseArrow + "," + yWBaseArrow + "L" + xIntermBaseArrow + "," + yIntermBaseArrow + "L" + xWBaseFeet + "," + yWBaseFeet + "L" + source.x + "," + source.y + "Z";
        }

        function pathSimple(source, target, value) {

            var metaboliteStyle = metExploreD3.getMetaboliteStyle();
            var reactionStyle = metExploreD3.getReactionStyle();
            var d = Math.sqrt(Math.pow(target.x - source.x, 2) + Math.pow(target.y - source.y, 2));
            var dX = (target.x - source.x);
            var dY = (target.y - source.y);
            var diffX = dX / Math.abs(dX);
            var diffY = dY / Math.abs(dY);
            if (source.getBiologicalType() == "metabolite") {
                var rTW = (Math.abs(d) * reactionStyle.getWidth() / 2) / Math.abs(dX);
                var rTH = (Math.abs(d) * reactionStyle.getHeight() / 2) / Math.abs(dY);
                var largeurNoeudT = (rTW < rTH) ? rT = rTW : rt = rTH;
            }
            else {
                var rTW = (Math.abs(d) * metaboliteStyle.getWidth() / 2) / Math.abs(dX);
                var rTH = (Math.abs(d) * metaboliteStyle.getHeight() / 2) / Math.abs(dY);
                var largeurNoeudT = (rTW < rTH) ? rT = rTW : rt = rTH;
            }

            var xTarget = source.x + dX * ((d - largeurNoeudT) / d);
            var yTarget = source.y + dY * ((d - largeurNoeudT) / d);

            // 5 -- 15
            var heightArrow = 2 * Math.abs(value);
            if (heightArrow < 3) heightArrow = 3;
            var xBaseArrow = source.x + dX * ((d - largeurNoeudT - heightArrow) / d);
            var yBaseArrow = source.y + dY * ((d - largeurNoeudT - heightArrow) / d);

            // 2 -- 6
            var widthArrow = 2.5 * Math.abs(value);
            var widthFeet = (2.5 * Math.abs(value)) * 1 / 2;
            if (widthArrow < 2) widthArrow = 2;
            var xWBaseArrow = xBaseArrow + dY * (widthArrow / d);
            var yWBaseArrow = yBaseArrow - dX * (widthArrow / d);

            var xIntermBaseArrow = xBaseArrow + dY * (widthFeet / d);
            var yIntermBaseArrow = yBaseArrow - dX * (widthFeet / d);

            // 1.5 -- 4.5
            var heightFeet = Math.abs(value);
            var xBaseFeet = source.x + dX * (heightFeet / d);
            var yBaseFeet = source.y + dY * (heightFeet / d);

            var xWBaseFeet = xBaseFeet + dY * (widthFeet / d);
            var yWBaseFeet = yBaseFeet - dX * (widthFeet / d);

            var d2 = Math.sqrt(Math.pow(xTarget - source.x, 2) + Math.pow(yTarget - source.y, 2));
            if (heightArrow + heightFeet > d2) {
                xWBaseFeet = xIntermBaseArrow;
                yWBaseFeet = yIntermBaseArrow;
            }

            var xSource = source.x;
            var ySource = source.y;
            // if(heightArrow>d2){
            // 	xSource=xBaseArrow;
            // 	ySource=yBaseArrow;
            // }

            if (linkId == 'linkRev')
                return "M" + (xSource + dY * (2 / d)) + "," + (ySource - dX * (2 / d)) +
                    "L" + (xTarget + dY * (2 / d)) + "," + (yTarget - dX * (2 / d)) +
                    "L" + (xWBaseArrow + dY * (2 / d)) + "," + (yWBaseArrow - dX * (2 / d)) +
                    "L" + (xIntermBaseArrow + dY * (2 / d)) + "," + (yIntermBaseArrow - dX * (2 / d)) +
                    "L" + (xWBaseFeet + dY * (2 / d)) + "," + (yWBaseFeet - dX * (2 / d)) +
                    "L" + (xSource + dY * (2 / d)) + "," + (ySource - dX * (2 / d)) + "Z";
            else
                return "M" + xSource + "," + ySource + "L" + xTarget + "," + yTarget + "L" + xWBaseArrow + "," + yWBaseArrow + "L" + xIntermBaseArrow + "," + yIntermBaseArrow + "L" + xWBaseFeet + "," + yWBaseFeet + "L" + source.x + "," + source.y + "Z";
        }

        if (link.getSource().x == undefined) {
            var networkData = _metExploreViz.getSessionById(panel).getD3Data();
            var nodes = networkData.getNodes();

            source = nodes[link.getSource()];
            target = nodes[link.getTarget()];

            if (source.getBiologicalType() == "reaction")
                reaction = source;
            else
                reaction = target;

            if (source.x != undefined && source.y != undefined && target.x != undefined && target.y != undefined) {
                // if(value<0)
                path = pathForReversibleReactions(source, target);
                // else
                // 	path = pathSimple(source, target);
            }
            else {
                path = "M0,0L0,0Z";
            }
        }
        else {
            source = link.getSource();
            target = link.getTarget();

            if (source.getBiologicalType() == "reaction")
                reaction = source;
            else
                reaction = target;

            if (source.x != undefined && source.y != undefined && target.x != undefined && target.y != undefined) {
                // if(value<0)
                path = pathForReversibleReactions(source, target);
                // else
                // path = pathSimple(source, target);
            }
            else {
                path = "M0,0L0,0Z";
            }
        }

        return path;
    },

    //arrayValue already scale
    funcPathForFlux3: function (link, panel, linkId, value) {
        var source, target, path;

        function pathSimple(source, target) {
            var metaboliteStyle = metExploreD3.getMetaboliteStyle();
            var reactionStyle = metExploreD3.getReactionStyle();
            var d = Math.sqrt(Math.pow(target.x - source.x, 2) + Math.pow(target.y - source.y, 2));
            var dX = (target.x - source.x);
            var dY = (target.y - source.y);
            var diffX = dX / Math.abs(dX);
            var diffY = dY / Math.abs(dY);
            if (source.getBiologicalType() == "metabolite") {
                var rTW = (Math.abs(d) * reactionStyle.getWidth() / 2) / Math.abs(dX);
                var rTH = (Math.abs(d) * reactionStyle.getHeight() / 2) / Math.abs(dY);
                var largeurNoeudT = (rTW < rTH) ? rT = rTW : rt = rTH;
            }
            else {
                var rTW = (Math.abs(d) * metaboliteStyle.getWidth() / 2) / Math.abs(dX);
                var rTH = (Math.abs(d) * metaboliteStyle.getHeight() / 2) / Math.abs(dY);
                var largeurNoeudT = (rTW < rTH) ? rT = rTW : rt = rTH;
            }

            var xTarget = source.x + dX * ((d - largeurNoeudT) / d);
            var yTarget = source.y + dY * ((d - largeurNoeudT) / d);

            // 5 -- 15
            var heightArrow = 5 * Math.abs(value);
            var xBaseArrow = source.x + dX * ((d - largeurNoeudT - heightArrow) / d);
            var yBaseArrow = source.y + dY * ((d - largeurNoeudT - heightArrow) / d);

            // 2 -- 6
            widthArrow = 2 * Math.abs(value);
            var xWBaseArrow = xBaseArrow + dY * (widthArrow / d);
            var yWBaseArrow = yBaseArrow - dX * (widthArrow / d);

            var xIntermBaseArrow = xBaseArrow + dY * ((2 * widthArrow / 3) / d);
            var yIntermBaseArrow = yBaseArrow - dX * ((2 * widthArrow / 3) / d);

            // 1.5 -- 4.5
            var heightFeet = 1.5 * Math.abs(value);
            var xBaseFeet = source.x + dX * (heightFeet / d);
            var yBaseFeet = source.y + dY * (heightFeet / d);

            var widthFeet = 2 * Math.abs(value);
            var xWBaseFeet = xBaseFeet + dY * ((2 * widthFeet / 3) / d);
            var yWBaseFeet = yBaseFeet - dX * ((2 * widthFeet / 3) / d);

            return "M" + source.x + "," + source.y + "L" + xTarget + "," + yTarget + "L" + xWBaseArrow + "," + yWBaseArrow + "L" + xIntermBaseArrow + "," + yIntermBaseArrow + "L" + xWBaseFeet + "," + yWBaseFeet + "L" + source.x + "," + source.y + "Z";
        }

        if (link.getSource().x == undefined) {
            var networkData = _metExploreViz.getSessionById(panel).getD3Data();
            var nodes = networkData.getNodes();

            source = nodes[link.getSource()];
            target = nodes[link.getTarget()];
            if (source.x != undefined && source.y != undefined && target.x != undefined && target.y != undefined) {
                if (value < 0)
                    path = pathSimple(target, source);
                else
                    path = pathSimple(source, target);
            }
            else {
                path = "M0,0L0,0Z";
            }
        }
        else {
            source = link.getSource();
            target = link.getTarget();
            if (source.x != undefined && source.y != undefined && target.x != undefined && target.y != undefined) {
                if (value < 0)
                    path = pathSimple(target, source);
                else
                    path = pathSimple(source, target);

            }
            else {
                path = "M0,0L0,0Z";
            }
        }

        return path;
    },


    funcPath1: function (link, panel) {
        var source, target, path;

        function pathForReversibleReactions(source, target) {
            var metaboliteStyle = metExploreD3.getMetaboliteStyle();
            var reactionStyle = metExploreD3.getReactionStyle();
            var d = Math.sqrt(Math.pow(target.x - source.x, 2) + Math.pow(target.y - source.y, 2));
            var dX = (target.x - source.x);
            var dY = (target.y - source.y);
            var diffX = dX / Math.abs(dX);
            var diffY = dY / Math.abs(dY);

            if (source.getBiologicalType() == "metabolite") {
                var rTW = (Math.abs(d) * metaboliteStyle.getWidth() / 2) / Math.abs(dX);
                var rTH = (Math.abs(d) * metaboliteStyle.getHeight() / 2) / Math.abs(dY);
                var largeurNoeudS = (rTW < rTH) ? rT = rTW : rt = rTH;

                var rTW = (Math.abs(d) * reactionStyle.getWidth() / 2) / Math.abs(dX);
                var rTH = (Math.abs(d) * reactionStyle.getHeight() / 2) / Math.abs(dY);
                var largeurNoeudT = (rTW < rTH) ? rT = rTW : rt = rTH;
            }
            else {
                var rTW = (Math.abs(d) * reactionStyle.getWidth() / 2) / Math.abs(dX);
                var rTH = (Math.abs(d) * reactionStyle.getHeight() / 2) / Math.abs(dY);
                var largeurNoeudS = (rTW < rTH) ? rT = rTW : rt = rTH;

                var rTW = (Math.abs(d) * metaboliteStyle.getWidth() / 2) / Math.abs(dX);
                var rTH = (Math.abs(d) * metaboliteStyle.getHeight() / 2) / Math.abs(dY);
                var largeurNoeudT = (rTW < rTH) ? rT = rTW : rt = rTH;
            }

            var xSource = source.x + dX * (1 - (d - largeurNoeudS) / d);
            var ySource = source.y + dY * (1 - (d - largeurNoeudS) / d);

            var xTarget = source.x + dX * ((d - largeurNoeudT) / d);
            var yTarget = source.y + dY * ((d - largeurNoeudT) / d);

            var heightArrow = 5;
            var xBaseArrowT = source.x + dX * ((d - largeurNoeudT - heightArrow) / d);
            var yBaseArrowT = source.y + dY * ((d - largeurNoeudT - heightArrow) / d);

            var xWBaseArrowT = xBaseArrowT + dY * (3 / d);
            var yWBaseArrowT = yBaseArrowT - dX * (3 / d);

            var xBaseArrowS = source.x + dX * (1 - (d - largeurNoeudS - heightArrow) / d);
            var yBaseArrowS = source.y + dY * (1 - (d - largeurNoeudS - heightArrow) / d);

            var xWBaseArrowS = xBaseArrowS - dY * (3 / d);
            var yWBaseArrowS = yBaseArrowS + dX * (3 / d);
            return "M" + xSource + "," + ySource + "L" + xTarget + "," + yTarget + "L" + xWBaseArrowT + "," + yWBaseArrowT + "L" + xBaseArrowT + "," + yBaseArrowT + "L" + xSource + "," + ySource + "L" + xWBaseArrowS + "," + yWBaseArrowS + "L" + xBaseArrowS + "," + yBaseArrowS + "Z";
        }

        function path(source, target) {
            var metaboliteStyle = metExploreD3.getMetaboliteStyle();
            var reactionStyle = metExploreD3.getReactionStyle();
            var d = Math.sqrt(Math.pow(target.x - source.x, 2) + Math.pow(target.y - source.y, 2));
            var dX = (target.x - source.x);
            var dY = (target.y - source.y);
            var diffX = dX / Math.abs(dX);
            var diffY = dY / Math.abs(dY);

            if (source.getBiologicalType() == "metabolite") {
                var rTW = (Math.abs(d) * reactionStyle.getWidth() / 2) / Math.abs(dX);
                var rTH = (Math.abs(d) * reactionStyle.getHeight() / 2) / Math.abs(dY);
                var largeurNoeudT = (rTW < rTH) ? rT = rTW : rt = rTH;
            }
            else {
                var rTW = (Math.abs(d) * metaboliteStyle.getWidth() / 2) / Math.abs(dX);
                var rTH = (Math.abs(d) * metaboliteStyle.getHeight() / 2) / Math.abs(dY);
                var largeurNoeudT = (rTW < rTH) ? rT = rTW : rt = rTH;
            }

            var xTarget = source.x + dX * ((d - largeurNoeudT) / d);
            var yTarget = source.y + dY * ((d - largeurNoeudT) / d);

            var heightArrow = 5;
            var xBaseArrow = source.x + dX * ((d - largeurNoeudT - heightArrow) / d);
            var yBaseArrow = source.y + dY * ((d - largeurNoeudT - heightArrow) / d);

            var xWBaseArrow = xBaseArrow + dY * (3 / d);
            var yWBaseArrow = yBaseArrow - dX * (3 / d);
            return "M" + source.x + "," + source.y + "L" + xTarget + "," + yTarget + "L" + xWBaseArrow + "," + yWBaseArrow + "L" + xBaseArrow + "," + yBaseArrow + "Z";
        }


        if (link.getSource().x == undefined) {
            var networkData = _metExploreViz.getSessionById(panel).getD3Data();
            var nodes = networkData.getNodes();

            source = nodes[link.getSource()];
            target = nodes[link.getTarget()];
            if (source.x != undefined && source.y != undefined && target.x != undefined && target.y != undefined) {
                if (source.getReactionReversibility() || target.getReactionReversibility())
                    path = pathForReversibleReactions(source, target);
                else
                    path = path(source, target);
            }
            else {
                path = "M0,0L0,0Z";
            }
        }
        else {
            source = link.getSource();
            target = link.getTarget();
            if (source.x != undefined && source.y != undefined && target.x != undefined && target.y != undefined) {
                if (source.getReactionReversibility() || target.getReactionReversibility())
                    path = pathForReversibleReactions(source, target);
                else
                    path = path(source, target);
            }
            else {
                path = "M0,0L0,0Z";
            }
        }

        return path;
    },

    funcPath2: function (link, panel) {
        var source, target, path;

        function pathForReversibleReactions(source, target) {
            var metaboliteStyle = metExploreD3.getMetaboliteStyle();
            var reactionStyle = metExploreD3.getReactionStyle();
            var d = Math.sqrt(Math.pow(target.x - source.x, 2) + Math.pow(target.y - source.y, 2));
            var dX = (target.x - source.x);
            var dY = (target.y - source.y);
            var diffX = dX / Math.abs(dX);
            var diffY = dY / Math.abs(dY);

            if (source.getBiologicalType() == "metabolite") {
                var rTW = (Math.abs(d) * reactionStyle.getWidth() / 2) / Math.abs(dX);
                var rTH = (Math.abs(d) * reactionStyle.getHeight() / 2) / Math.abs(dY);
                var largeurNoeudT = (rTW < rTH) ? rT = rTW : rt = rTH;
            }
            else {
                var rTW = (Math.abs(d) * metaboliteStyle.getWidth() / 2) / Math.abs(dX);
                var rTH = (Math.abs(d) * metaboliteStyle.getHeight() / 2) / Math.abs(dY);
                var largeurNoeudT = (rTW < rTH) ? rT = rTW : rt = rTH;
            }

            var xSource = source.x + dX * (1 - (d - largeurNoeudS) / d);
            var ySource = source.y + dY * (1 - (d - largeurNoeudS) / d);

            var xTarget = source.x + dX * ((d - largeurNoeudT) / d);
            var yTarget = source.y + dY * ((d - largeurNoeudT) / d);

            var heightArrow = 5;
            var xBaseArrowT = source.x + dX * ((d - largeurNoeudT - heightArrow) / d);
            var yBaseArrowT = source.y + dY * ((d - largeurNoeudT - heightArrow) / d);

            var xWBaseArrowT1 = xBaseArrowT + dY * (3 / d);
            var yWBaseArrowT1 = yBaseArrowT - dX * (3 / d);
            var xWBaseArrowT2 = xBaseArrowT - dY * (3 / d);
            var yWBaseArrowT2 = yBaseArrowT + dX * (3 / d);

            var xBaseArrowS = source.x + dX * (1 - (d - largeurNoeudS - heightArrow) / d);
            var yBaseArrowS = source.y + dY * (1 - (d - largeurNoeudS - heightArrow) / d);

            var xWBaseArrowS1 = xBaseArrowS - dY * (3 / d);
            var yWBaseArrowS1 = yBaseArrowS + dX * (3 / d);
            var xWBaseArrowS2 = xBaseArrowS + dY * (3 / d);
            var yWBaseArrowS2 = yBaseArrowS - dX * (3 / d);

            return "M" + xSource + "," + ySource +
                "L" + xWBaseArrowS1 + "," + yWBaseArrowS1 +
                "L" + xBaseArrowS + "," + yBaseArrowS +
                "L" + xBaseArrowT + "," + yBaseArrowT +
                "L" + xWBaseArrowT1 + "," + yWBaseArrowT1 +
                "L" + xTarget + "," + yTarget +
                "L" + xWBaseArrowT2 + "," + yWBaseArrowT2 +
                "L" + xBaseArrowT + "," + yBaseArrowT +
                "L" + xBaseArrowS + "," + yBaseArrowS +
                "L" + xWBaseArrowS2 + "," + yWBaseArrowS2 +
                "L" + xSource + "," + ySource +
                "Z";
        }

        function path(source, target) {
            var metaboliteStyle = metExploreD3.getMetaboliteStyle();
            var reactionStyle = metExploreD3.getReactionStyle();
            var d = Math.sqrt(Math.pow(target.x - source.x, 2) + Math.pow(target.y - source.y, 2));
            var dX = (target.x - source.x);
            var dY = (target.y - source.y);
            var diffX = dX / Math.abs(dX);
            var diffY = dY / Math.abs(dY);

            if (source.getBiologicalType() == "metabolite") {
                var largeurNoeudT = (reactionStyle.getWidth() + reactionStyle.getHeight()) / 2 / 2;
                var largeurNoeudS = (metaboliteStyle.getHeight() + metaboliteStyle.getWidth()) / 2 / 2;
            }
            else {
                var largeurNoeudT = (metaboliteStyle.getHeight() + metaboliteStyle.getWidth()) / 2 / 2;
                var largeurNoeudS = (reactionStyle.getWidth() + reactionStyle.getHeight()) / 2 / 2;
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
            if (source.x != undefined && source.y != undefined && target.x != undefined && target.y != undefined) {
                if (source.getReactionReversibility() || target.getReactionReversibility())
                    path = pathForReversibleReactions(source, target);
                else
                    path = path(source, target);
            }
            else {
                path = "M0,0L0,0Z";
            }
        }
        else {
            source = link.getSource();
            target = link.getTarget();
            if (source.x != undefined && source.y != undefined && target.x != undefined && target.y != undefined) {
                if (source.getReactionReversibility() || target.getReactionReversibility())
                    path = pathForReversibleReactions(source, target);
                else
                    path = path(source, target);
            }
            else {
                path = "M0,0L0,0Z";
            }
        }

        return path;
    },

    funcPath3: function (link, panel) {
        var source, target, path;

        function pathForReversibleReactions(source, target) {
            var metaboliteStyle = metExploreD3.getMetaboliteStyle();
            var reactionStyle = metExploreD3.getReactionStyle();
            var d = Math.sqrt(Math.pow(target.x - source.x, 2) + Math.pow(target.y - source.y, 2));
            var dX = (target.x - source.x);
            var dY = (target.y - source.y);
            var diffX = dX / Math.abs(dX);
            var diffY = dY / Math.abs(dY);

            if (source.getBiologicalType() == "metabolite") {
                var rTW = (Math.abs(d) * reactionStyle.getWidth() / 2) / Math.abs(dX);
                var rTH = (Math.abs(d) * reactionStyle.getHeight() / 2) / Math.abs(dY);
                var largeurNoeudT = (rTW < rTH) ? rT = rTW : rt = rTH;
            }
            else {
                var rTW = (Math.abs(d) * metaboliteStyle.getWidth() / 2) / Math.abs(dX);
                var rTH = (Math.abs(d) * metaboliteStyle.getHeight() / 2) / Math.abs(dY);
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
            var metaboliteStyle = metExploreD3.getMetaboliteStyle();
            var reactionStyle = metExploreD3.getReactionStyle();
            var d = Math.sqrt(Math.pow(target.x - source.x, 2) + Math.pow(target.y - source.y, 2));
            var dX = (target.x - source.x);
            var dY = (target.y - source.y);
            var diffX = dX / Math.abs(dX);
            var diffY = dY / Math.abs(dY);

            if (source.getBiologicalType() == "metabolite") {
                var rTW = (Math.abs(d) * reactionStyle.getWidth() / 2) / Math.abs(dX);
                var rTH = (Math.abs(d) * reactionStyle.getHeight() / 2) / Math.abs(dY);
                var largeurNoeudT = (rTW < rTH) ? rT = rTW : rt = rTH;
            }
            else {
                var rTW = (Math.abs(d) * metaboliteStyle.getWidth() / 2) / Math.abs(dX);
                var rTH = (Math.abs(d) * metaboliteStyle.getHeight() / 2) / Math.abs(dY);
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
                    if (source.getReactionReversibility() || target.getReactionReversibility())
                        path = pathForReversibleReactions(source, target);
                    else
                        path = path(source, target);
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
                    if (source.getReactionReversibility() || target.getReactionReversibility())
                        path = pathForReversibleReactions(source, target);
                    else
                        path = path(source, target);
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

    funcPath4: function (link, panel) {
        var source, target, path;

        function pathForReversibleReactions(source, target) {

            var metaboliteStyle = metExploreD3.getMetaboliteStyle();
            var reactionStyle = metExploreD3.getReactionStyle();
            var d = Math.sqrt(Math.pow(target.x - source.x, 2) + Math.pow(target.y - source.y, 2));
            var dX = (target.x - source.x);
            var dY = (target.y - source.y);
            var diffX = dX / Math.abs(dX);
            var diffY = dY / Math.abs(dY);

            if (source.getBiologicalType() == "metabolite") {
                var largeurNoeudS = (metaboliteStyle.getHeight() + metaboliteStyle.getWidth()) / 2 / 2;

                var xSource = source.x + dX * (1 - (d - largeurNoeudS) / d);
                var ySource = source.y + dY * (1 - (d - largeurNoeudS) / d);

                var heightArrow = 5;

                var xBaseArrowS = source.x + dX * (1 - (d - largeurNoeudS - heightArrow) / d);
                var yBaseArrowS = source.y + dY * (1 - (d - largeurNoeudS - heightArrow) / d);

                var xBaseArrowRev = source.x + dX * (1 - (d - largeurNoeudS - heightArrow - heightArrow) / d);
                var yBaseArrowRev = source.y + dY * (1 - (d - largeurNoeudS - heightArrow - heightArrow) / d);

                var xWBaseArrowS1 = xBaseArrowS - dY * (3 / d);
                var yWBaseArrowS1 = yBaseArrowS + dX * (3 / d);
                var xWBaseArrowS2 = xBaseArrowS + dY * (3 / d);
                var yWBaseArrowS2 = yBaseArrowS - dX * (3 / d);


                path =
                    // "M"+xWBaseArrowS1+","+yWBaseArrowS1+
                    // 		"L"+xWBaseArrowS2+","+yWBaseArrowS2+
                    // 		"L"+xSource+","+ySource+
                    // 		"Z"+
                    "M" + xBaseArrowRev + "," + yBaseArrowRev +
                    "L" + xWBaseArrowS1 + "," + yWBaseArrowS1 +
                    "L" + xWBaseArrowS2 + "," + yWBaseArrowS2 +
                    "L" + xSource + "," + ySource +
                    "L" + xWBaseArrowS1 + "," + yWBaseArrowS1 +
                    "L" + xWBaseArrowS2 + "," + yWBaseArrowS2 +
                    "L" + xBaseArrowRev + "," + yBaseArrowRev +
                    "L" + target.x + "," + target.y +
                    "Z";
            }
            else {
                var largeurNoeudS = (metaboliteStyle.getWidth() + metaboliteStyle.getHeight()) / 2 / 2;
                var xSource = source.x + dX * (1 - (d - largeurNoeudS) / d);
                var ySource = source.y + dY * (1 - (d - largeurNoeudS) / d);

                var heightArrow = 5;


                var xTarget = source.x + dX * ((d - largeurNoeudS) / d);
                var yTarget = source.y + dY * ((d - largeurNoeudS) / d);

                var heightArrow = 5;
                var xBaseArrowT = source.x + dX * ((d - largeurNoeudS - heightArrow) / d);
                var yBaseArrowT = source.y + dY * ((d - largeurNoeudS - heightArrow) / d);

                var xWBaseArrowT1 = xBaseArrowT + dY * (3 / d);
                var yWBaseArrowT1 = yBaseArrowT - dX * (3 / d);
                var xWBaseArrowT2 = xBaseArrowT - dY * (3 / d);
                var yWBaseArrowT2 = yBaseArrowT + dX * (3 / d);

                var xBaseArrowRev = source.x + dX * ((d - largeurNoeudS - heightArrow - heightArrow) / d);
                var yBaseArrowRev = source.y + dY * ((d - largeurNoeudS - heightArrow - heightArrow) / d);


                path =
                    // "M"+xWBaseArrowT1+","+yWBaseArrowT1+
                    // 		"L"+xWBaseArrowT2+","+yWBaseArrowT2+
                    // 		"L"+xBaseArrowRev+","+yBaseArrowRev+
                    // 		"Z"+
                    "M" + source.x + "," + source.y +
                    "L" + xBaseArrowRev + "," + yBaseArrowRev +
                    "L" + xWBaseArrowT1 + "," + yWBaseArrowT1 +
                    "L" + xWBaseArrowT2 + "," + yWBaseArrowT2 +
                    "L" + xTarget + "," + yTarget +
                    "L" + xWBaseArrowT1 + "," + yWBaseArrowT1 +
                    "L" + xWBaseArrowT2 + "," + yWBaseArrowT2 +
                    "L" + xBaseArrowRev + "," + yBaseArrowRev +
                    "Z";
            }
            return path;

        }

        function path(source, target) {
            var metaboliteStyle = metExploreD3.getMetaboliteStyle();
            var reactionStyle = metExploreD3.getReactionStyle();
            var d = Math.sqrt(Math.pow(target.x - source.x, 2) + Math.pow(target.y - source.y, 2));
            var dX = (target.x - source.x);
            var dY = (target.y - source.y);
            var diffX = dX / Math.abs(dX);
            var diffY = dY / Math.abs(dY);

            if (source.getBiologicalType() == "metabolite") {
                var largeurNoeudS = (metaboliteStyle.getHeight() + metaboliteStyle.getWidth()) / 2 / 2;

                var xSource = source.x + dX * (1 - (d - largeurNoeudS) / d);
                var ySource = source.y + dY * (1 - (d - largeurNoeudS) / d);

                var heightArrow = 5;

                var xPointeS = source.x + dX * (1 - (d - largeurNoeudS - heightArrow) / d);
                var yPointeS = source.y + dY * (1 - (d - largeurNoeudS - heightArrow) / d);

                var xWBaseArrowS1 = xSource - dY * (3 / d);
                var yWBaseArrowS1 = ySource + dX * (3 / d);
                var xWBaseArrowS2 = xSource + dY * (3 / d);
                var yWBaseArrowS2 = ySource - dX * (3 / d);

                return "M" + target.x + "," + target.y +
                    "L" + xPointeS + "," + yPointeS +
                    "L" + xWBaseArrowS1 + "," + yWBaseArrowS1 +
                    "L" + xSource + "," + ySource +
                    "L" + xWBaseArrowS2 + "," + yWBaseArrowS2 +
                    "L" + xPointeS + "," + yPointeS +
                    "Z";
            }
            else {
                var largeurNoeudS = (metaboliteStyle.getWidth() + metaboliteStyle.getHeight()) / 2 / 2;
                var xTarget = source.x + dX * ((d - largeurNoeudS) / d);
                var yTarget = source.y + dY * ((d - largeurNoeudS) / d);

                var heightArrow = 5;
                var xBaseArrowT = source.x + dX * ((d - largeurNoeudS - heightArrow) / d);
                var yBaseArrowT = source.y + dY * ((d - largeurNoeudS - heightArrow) / d);

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

            return path;
        }


        if (link.getSource().x == undefined) {
            var networkData = _metExploreViz.getSessionById(panel).getD3Data();
            var nodes = networkData.getNodes();

            source = nodes[link.getSource()];
            target = nodes[link.getTarget()];
            if (source.x != undefined && source.y != undefined && target.x != undefined && target.y != undefined) {
                if (source.getReactionReversibility() || target.getReactionReversibility())
                    path = pathForReversibleReactions(source, target);
                else
                    path = path(source, target);
            }
            else {
                path = "M0,0L0,0Z";
            }
        }
        else {
            source = link.getSource();
            target = link.getTarget();
            if (source.x != undefined && source.y != undefined && target.x != undefined && target.y != undefined) {
                if (source.getReactionReversibility() || target.getReactionReversibility())
                    path = pathForReversibleReactions(source, target);
                else
                    path = path(source, target);
            }
            else {
                path = "M0,0L0,0Z";
            }
        }

        return path;
    },

    funcPath5: function (link, panel) {
        var source, target, path;

        function pathForReversibleReactions(source, target) {
            var metaboliteStyle = metExploreD3.getMetaboliteStyle();
            var reactionStyle = metExploreD3.getReactionStyle();
            var d = Math.sqrt(Math.pow(target.x - source.x, 2) + Math.pow(target.y - source.y, 2));
            var dX = (target.x - source.x);
            var dY = (target.y - source.y);
            var diffX = dX / Math.abs(dX);
            var diffY = dY / Math.abs(dY);

            if (source.getBiologicalType() == "metabolite") {
                var rTW = (Math.abs(d) * reactionStyle.getWidth() / 2) / Math.abs(dX);
                var rTH = (Math.abs(d) * reactionStyle.getHeight() / 2) / Math.abs(dY);
                var largeurNoeudT = (rTW < rTH) ? rT = rTW : rt = rTH;
            }
            else {
                var rTW = (Math.abs(d) * metaboliteStyle.getWidth() / 2) / Math.abs(dX);
                var rTH = (Math.abs(d) * metaboliteStyle.getHeight() / 2) / Math.abs(dY);
                var largeurNoeudT = (rTW < rTH) ? rT = rTW : rt = rTH;
            }

            var largeurNoeudS = (metaboliteStyle.getHeight() + metaboliteStyle.getWidth()) / 2 / 2;

            var xSource = source.x + dX * (1 - (d - largeurNoeudS) / d);
            var ySource = source.y + dY * (1 - (d - largeurNoeudS) / d);

            var heightArrow = 5;

            var xBaseArrowS = source.x + dX * (1 - (d - largeurNoeudS - heightArrow) / d);
            var yBaseArrowS = source.y + dY * (1 - (d - largeurNoeudS - heightArrow) / d);

            var xBaseArrowRevS = source.x + dX * (1 - (d - largeurNoeudS - heightArrow - heightArrow) / d);
            var yBaseArrowRevS = source.y + dY * (1 - (d - largeurNoeudS - heightArrow - heightArrow) / d);

            var xWBaseArrowS1 = xBaseArrowS - dY * (3 / d);
            var yWBaseArrowS1 = yBaseArrowS + dX * (3 / d);
            var xWBaseArrowS2 = xBaseArrowS + dY * (3 / d);
            var yWBaseArrowS2 = yBaseArrowS - dX * (3 / d);


            var xTarget = source.x + dX * ((d - largeurNoeudS) / d);
            var yTarget = source.y + dY * ((d - largeurNoeudS) / d);

            var xBaseArrowT = source.x + dX * ((d - largeurNoeudS - heightArrow) / d);
            var yBaseArrowT = source.y + dY * ((d - largeurNoeudS - heightArrow) / d);

            var xWBaseArrowT1 = xBaseArrowT + dY * (3 / d);
            var yWBaseArrowT1 = yBaseArrowT - dX * (3 / d);
            var xWBaseArrowT2 = xBaseArrowT - dY * (3 / d);
            var yWBaseArrowT2 = yBaseArrowT + dX * (3 / d);

            var xBaseArrowRevT = source.x + dX * ((d - largeurNoeudS - heightArrow - heightArrow) / d);
            var yBaseArrowRevT = source.y + dY * ((d - largeurNoeudS - heightArrow - heightArrow) / d);


            return "M" + xSource + "," + ySource +
                "L" + xWBaseArrowS1 + "," + yWBaseArrowS1 +
                "L" + xWBaseArrowS2 + "," + yWBaseArrowS2 +
                "M" + xBaseArrowRevT + "," + yBaseArrowRevT +
                "L" + xWBaseArrowT1 + "," + yWBaseArrowT1 +
                "L" + xWBaseArrowT2 + "," + yWBaseArrowT2 +
                "M" + xBaseArrowRevS + "," + yBaseArrowRevS +
                "L" + xWBaseArrowS1 + "," + yWBaseArrowS1 +
                "L" + xWBaseArrowS2 + "," + yWBaseArrowS2 +
                "L" + xSource + "," + ySource +
                "L" + xWBaseArrowS1 + "," + yWBaseArrowS1 +
                "L" + xWBaseArrowS2 + "," + yWBaseArrowS2 +
                "L" + xBaseArrowRevS + "," + yBaseArrowRevS +
                "L" + xBaseArrowRevT + "," + yBaseArrowRevT +
                "L" + xWBaseArrowT1 + "," + yWBaseArrowT1 +
                "L" + xWBaseArrowT2 + "," + yWBaseArrowT2 +
                "L" + xTarget + "," + yTarget +
                "L" + xWBaseArrowT1 + "," + yWBaseArrowT1 +
                "L" + xWBaseArrowT2 + "," + yWBaseArrowT2 +
                "L" + xBaseArrowRevT + "," + yBaseArrowRevT +
                "Z";
        }

        function path(source, target) {
            var metaboliteStyle = metExploreD3.getMetaboliteStyle();
            var reactionStyle = metExploreD3.getReactionStyle();
            var d = Math.sqrt(Math.pow(target.x - source.x, 2) + Math.pow(target.y - source.y, 2));
            var dX = (target.x - source.x);
            var dY = (target.y - source.y);
            var diffX = dX / Math.abs(dX);
            var diffY = dY / Math.abs(dY);

            if (source.getBiologicalType() == "metabolite") {
                var largeurNoeudT = (reactionStyle.getWidth() + reactionStyle.getHeight()) / 2 / 2;
                var largeurNoeudS = (metaboliteStyle.getHeight() + metaboliteStyle.getWidth()) / 2 / 2;
            }
            else {
                var largeurNoeudT = (metaboliteStyle.getHeight() + metaboliteStyle.getWidth()) / 2 / 2;
                var largeurNoeudS = (reactionStyle.getWidth() + reactionStyle.getHeight()) / 2 / 2;
            }
            var xSource = source.x + dX * (1 - (d - largeurNoeudS) / d);
            var ySource = source.y + dY * (1 - (d - largeurNoeudS) / d);

            var xTarget = source.x + dX * ((d - largeurNoeudT) / d);
            var yTarget = source.y + dY * ((d - largeurNoeudT) / d);

            var heightArrow = 5;
            var xBaseArrowT = source.x + dX * ((d - largeurNoeudT - heightArrow) / d);
            var yBaseArrowT = source.y + dY * ((d - largeurNoeudT - heightArrow) / d);


            var xWBaseArrowT1 = xBaseArrowT + dY * (3 / d);
            var yWBaseArrowT1 = yBaseArrowT - dX * (3 / d);
            var xWBaseArrowT2 = xBaseArrowT - dY * (3 / d);
            var yWBaseArrowT2 = yBaseArrowT + dX * (3 / d);

            var xPointeS = source.x + dX * (1 - (d - largeurNoeudS - heightArrow) / d);
            var yPointeS = source.y + dY * (1 - (d - largeurNoeudS - heightArrow) / d);

            var xWBaseArrowS1 = xSource - dY * (3 / d);
            var yWBaseArrowS1 = ySource + dX * (3 / d);
            var xWBaseArrowS2 = xSource + dY * (3 / d);
            var yWBaseArrowS2 = ySource - dX * (3 / d);

            return "M" + xPointeS + "," + yPointeS +
                "L" + xWBaseArrowS1 + "," + yWBaseArrowS1 +
                "L" + xWBaseArrowS2 + "," + yWBaseArrowS2 +
                "L" + xPointeS + "," + yPointeS +
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
            if (source.x != undefined && source.y != undefined && target.x != undefined && target.y != undefined) {
                if (source.getReactionReversibility() || target.getReactionReversibility())
                    path = pathForReversibleReactions(source, target);
                else
                    path = path(source, target);
            }
            else {
                path = "M0,0L0,0Z";
            }
        }
        else {
            source = link.getSource();
            target = link.getTarget();
            if (source.x != undefined && source.y != undefined && target.x != undefined && target.y != undefined) {
                if (source.getReactionReversibility() || target.getReactionReversibility())
                    path = pathForReversibleReactions(source, target);
                else
                    path = path(source, target);
            }
            else {
                path = "M0,0L0,0Z";
            }
        }

        return path;
    },

    funcPath6: function (link, panel) {
        var source, target, path;

        function pathForReversibleReactions(source, target) {
            var metaboliteStyle = metExploreD3.getMetaboliteStyle();
            var reactionStyle = metExploreD3.getReactionStyle();
            var d = Math.sqrt(Math.pow(target.x - source.x, 2) + Math.pow(target.y - source.y, 2));
            var dX = (target.x - source.x);
            var dY = (target.y - source.y);
            var diffX = dX / Math.abs(dX);
            var diffY = dY / Math.abs(dY);

            if (source.getBiologicalType() == "metabolite") {
                var rTW = (Math.abs(d) * reactionStyle.getWidth() / 2) / Math.abs(dX);
                var rTH = (Math.abs(d) * reactionStyle.getHeight() / 2) / Math.abs(dY);
                var largeurNoeudT = (rTW < rTH) ? rT = rTW : rt = rTH;
            }
            else {
                var rTW = (Math.abs(d) * metaboliteStyle.getWidth() / 2) / Math.abs(dX);
                var rTH = (Math.abs(d) * metaboliteStyle.getHeight() / 2) / Math.abs(dY);
                var largeurNoeudT = (rTW < rTH) ? rT = rTW : rt = rTH;
            }

            var xSource = source.x + dX * (1 - (d - largeurNoeudS) / d);
            var ySource = source.y + dY * (1 - (d - largeurNoeudS) / d);

            var xTarget = source.x + dX * ((d - largeurNoeudT) / d);
            var yTarget = source.y + dY * ((d - largeurNoeudT) / d);

            var heightArrow = 5;
            var xBaseArrowT = source.x + dX * ((d - largeurNoeudT - heightArrow) / d);
            var yBaseArrowT = source.y + dY * ((d - largeurNoeudT - heightArrow) / d);

            var xWBaseArrowT1 = xBaseArrowT + dY * (3 / d);
            var yWBaseArrowT1 = yBaseArrowT - dX * (3 / d);
            var xWBaseArrowT2 = xBaseArrowT - dY * (3 / d);
            var yWBaseArrowT2 = yBaseArrowT + dX * (3 / d);

            var xBaseArrowS = source.x + dX * (1 - (d - largeurNoeudS - heightArrow) / d);
            var yBaseArrowS = source.y + dY * (1 - (d - largeurNoeudS - heightArrow) / d);

            var xWBaseArrowS1 = xBaseArrowS - dY * (3 / d);
            var yWBaseArrowS1 = yBaseArrowS + dX * (3 / d);
            var xWBaseArrowS2 = xBaseArrowS + dY * (3 / d);
            var yWBaseArrowS2 = yBaseArrowS - dX * (3 / d);

            return "M" + xSource + "," + ySource +
                "L" + xWBaseArrowS1 + "," + yWBaseArrowS1 +
                "L" + xWBaseArrowS2 + "," + yWBaseArrowS2 +
                "M" + xSource + "," + ySource +
                "L" + xWBaseArrowS1 + "," + yWBaseArrowS1 +
                "L" + xBaseArrowS + "," + yBaseArrowS +
                "L" + xBaseArrowT + "," + yBaseArrowT +
                "L" + xWBaseArrowT1 + "," + yWBaseArrowT1 +
                "L" + xTarget + "," + yTarget +
                "L" + xWBaseArrowT2 + "," + yWBaseArrowT2 +
                "L" + xBaseArrowT + "," + yBaseArrowT +
                "L" + xBaseArrowS + "," + yBaseArrowS +
                "L" + xWBaseArrowS2 + "," + yWBaseArrowS2 +
                "L" + xSource + "," + ySource +
                "Z";
        }

        function path(source, target) {
            var metaboliteStyle = metExploreD3.getMetaboliteStyle();
            var reactionStyle = metExploreD3.getReactionStyle();
            var d = Math.sqrt(Math.pow(target.x - source.x, 2) + Math.pow(target.y - source.y, 2));
            var dX = (target.x - source.x);
            var dY = (target.y - source.y);
            var diffX = dX / Math.abs(dX);
            var diffY = dY / Math.abs(dY);

            if (source.getBiologicalType() == "metabolite") {
                var largeurNoeudT = (reactionStyle.getWidth() + reactionStyle.getHeight()) / 2 / 2;
                var largeurNoeudS = (metaboliteStyle.getHeight() + metaboliteStyle.getWidth()) / 2 / 2;
            }
            else {
                var largeurNoeudT = (metaboliteStyle.getHeight() + metaboliteStyle.getWidth()) / 2 / 2;
                var largeurNoeudS = (reactionStyle.getWidth() + reactionStyle.getHeight()) / 2 / 2;
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
            if (source.x != undefined && source.y != undefined && target.x != undefined && target.y != undefined) {
                if (source.getReactionReversibility() || target.getReactionReversibility())
                    path = pathForReversibleReactions(source, target);
                else
                    path = path(source, target);
            }
            else {
                path = "M0,0L0,0Z";
            }
        }
        else {
            source = link.getSource();
            target = link.getTarget();
            if (source.x != undefined && source.y != undefined && target.x != undefined && target.y != undefined) {
                if (source.getReactionReversibility() || target.getReactionReversibility())
                    path = pathForReversibleReactions(source, target);
                else
                    path = path(source, target);
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
     * @param {} metaboliteStyle : Store which contains metabolites style
     */
    refreshLink1: function (parent, session, linkStyle, metaboliteStyle) {
        metExploreD3.GraphLink.panelParent = "#" + parent;
        var networkData = session.getD3Data();

        var size = 20;
        // The y-axis coordinate of the reference point which is to be aligned exactly at the marker position.
        var refY = linkStyle.getMarkerWidth() / 2;
        // The x-axis coordinate of the reference point which is to be aligned exactly at the marker position.
        // var refX = linkStyle.getMarkerHeight / 2;

        // Adding arrow on links
        // d3.select("#"+parent).select("#D3viz").select("#graphComponent").append("svg:defs").selectAll("marker")
        // 	.data(["in", "out"])
        // 	.enter().append("svg:marker")
        // 	.attr("id", String)
        // 	.attr("viewBox", "0 0 "+linkStyle.getMarkerWidth()+" "+linkStyle.getMarkerHeight())
        // 	.attr("refY", refY)
        // 	.attr("markerWidth", linkStyle.getMarkerWidth())
        // 	.attr("markerHeight", linkStyle.getMarkerHeight())
        // 	.attr("orient", "auto")
        // 	.append("svg:path")
        // 	.attr("class", String)
        // 	.attr("d", "M0,0L"+linkStyle.getMarkerWidth()+","+linkStyle.getMarkerHeight()/2+"L0,"+linkStyle.getMarkerWidth()+"Z")
        // 	.style("visibility", "hidden");
        // .attr("d", "M"+linkStyle.getMarkerWidth()+" "+linkStyle.getMarkerHeight()/2+" L"+linkStyle.getMarkerWidth()/2+" "+(3*linkStyle.getMarkerHeight()/4)+" A"+linkStyle.getMarkerHeight()+" "+linkStyle.getMarkerHeight()+" 0 0 0 "+linkStyle.getMarkerWidth()/2+" "+(1*linkStyle.getMarkerHeight()/4)+" L"+linkStyle.getMarkerWidth()+" "+linkStyle.getMarkerHeight()/2+"Z")
        // Append link on panel
        metExploreD3.GraphLink.link = d3.select("#" + parent).select("#D3viz").select("#graphComponent").selectAll("path.link")
            .data(networkData.getLinks())
            .enter()
            .append("svg:path")
            .attr("class", String)
            .attr("d", function (link) {
                return metExploreD3.GraphLink.funcPath1(link, parent);
            })
            .attr("class", "link")
            .attr("fill-rule", "evenodd")
            .attr("fill", function (d) {
                if (d.interaction == "out")
                    return linkStyle.getMarkerOutColor();
                else
                    return linkStyle.getMarkerInColor();
            })
            .style("stroke", linkStyle.getStrokeColor())
            .style("stroke-width", 0.5)
            .style("stroke-linejoin", "bevel");

    },

    /*******************************************
     * Init the visualization of links
     * @param {} parent : The panel where the action is launched
     * @param {} session : Store which contains global characteristics of session
     * @param {} linkStyle : Store which contains links style
     * @param {} linkStyle : Store which contains links style
     * @param {} metaboliteStyle : Store which contains metabolites style
     */
    refreshLink: function (parent, session, linkStyle, metaboliteStyle) {
        metExploreD3.GraphLink.panelParent = "#" + parent;
        var networkData = session.getD3Data();

        var size = 20;
        // The y-axis coordinate of the reference point which is to be aligned exactly at the marker position.
        var refY = linkStyle.getMarkerWidth() / 2;
        // The x-axis coordinate of the reference point which is to be aligned exactly at the marker position.
        // var refX = linkStyle.getMarkerHeight / 2;

        d3.select("#" + parent).select("#D3viz").select("#graphComponent")
            .selectAll(".linkGroup")
            .remove();

        d3.select("#" + parent).select("#D3viz").select("#graphComponent").selectAll("path.link")
            .data(networkData.getLinks())
            .enter()
            .insert("svg:g", ":first-child")
            .attr("class", "linkGroup")
            .append("svg:path")
            .attr("class", String)
            .attr("d", function (link) {
                return metExploreD3.GraphLink.funcPath3(link, parent, this.id, 3);
            })
            .attr("class", "link")
            .attr("fill-rule", "evenodd")
            .attr("fill", function (d) {
                if (d.interaction == "out")
                    return linkStyle.getMarkerOutColor();
                else
                    return linkStyle.getMarkerInColor();
            })
            .style("stroke", linkStyle.getStrokeColor())
            .style("stroke-width", 0.5)
            .style("opacity", 1)
            .style("stroke-dasharray", null);

        // d3.select("#"+parent).select("#D3viz").select("#graphComponent").selectAll(".linkGroup")
        //     .append("svg:text")
        //     .style("font-size",'6px')
        //     .attr("class", "linklabel")
        //    // .classed('hide', true)
        // 	.style("paint-order","stroke")
        // 	.style("stroke-width",  1)
        // 	.style("stroke", "white")
        // 	.style("stroke-opacity", "0.7")
        // 	.attr("dy", ".4em")
        // 	.style("font-weight", 'bold')
        // 	.style("pointer-events", 'none')
        // 	.text('eeee');

        metExploreD3.GraphLink.link = d3.select("#" + parent).select("#D3viz").select("#graphComponent").selectAll("path.link")
    },

    loadLinksForFlux: function (parent, networkData, linkStyle, metaboliteStyle, showValues, conditionName) {
        d3.select("#" + parent).select("#D3viz").select("#graphComponent").selectAll(".linkGroup").remove();
        _metExploreViz.getSessionById(parent).setMappingDataType("Flux");

        var divs = d3.select("#" + parent).select("#D3viz").select("#graphComponent").selectAll("path.link")
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
                .attr("class", "link")
                .attr("fill-rule", "evenodd")
                .attr("id", "link")
                .style("stroke", linkStyle.getStrokeColor())
                .style("stroke-width", 0.5)

            d3.select(this)
                .append("svg:path")
                .attr("class", String)
                .attr("id", "linkRev")
                .attr("d", function (link) {
                    return metExploreD3.GraphLink.funcPathForFlux(link, parent, this.id);
                })
                .attr("class", "link")
                .attr("fill-rule", "evenodd")
                .style("stroke", linkStyle.getStrokeColor())
                .style("stroke-width", 0.5);

        });

        metExploreD3.GraphNetwork.tick('viz');
    },

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
                var conditions = mapping.getConditions();

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
            .style("stroke-width", 1)
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
                    var conditions = mapping.getConditions();

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
                .style("stroke-width", 1)
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
    reloadLinks : function(panel, networkData, linkStyle, metaboliteStyle){
        d3.select("#"+panel).select("#D3viz").select("#graphComponent").selectAll("path.link")
            .data(networkData.getLinks())
            .enter()
            .insert("path",":first-child")
            .attr("class", String)
            .attr("d", function(link){ return metExploreD3.GraphLink.funcPath3(link, parent, this.id, 3);})
            .attr("class", "link")
            .attr("fill-rule", "evenodd")
            .attr("fill", function (d) {
                if (d.interaction=="out")
                    return linkStyle.getMarkerOutColor();
                else
                    return linkStyle.getMarkerInColor();
            })
            .style("stroke",linkStyle.getStrokeColor())
            .style("stroke-width",0.5)
            .style("stroke-linejoin", "bevel");
    },

    // A n'appliquer que sur les petits graphes
    linkTypeOfMetabolite : function(){
        _metExploreViz.setLinkedByTypeOfMetabolite(true);
        var panel = "viz";
        var session = _metExploreViz.getSessionById("viz");

        if(session!=undefined)
        {
            // We stop the previous animation
            var force = session.getForce();
            if(force!=undefined)
            {
                force.stop();
            }
        }

        var myMask = metExploreD3.createLoadMask("Link in progress...", panel);
        if(myMask!= undefined){

            metExploreD3.showMask(myMask);

            metExploreD3.deferFunction(function() {
                // Hash table definition to create hidden edges
                // Hidden edges are created to put products next to products and substract next to substracts
                var src = {};
                var tgt = {};

                var reacSrc = {};
                var reacTgt = {};

                d3.select("#viz").select("#D3viz").select("#graphComponent")
                    .selectAll("path.link")
                    .filter(function(link){
                        return link.getInteraction()!="hiddenForce";
                    })
                    .each(function(alink){
                        if(alink.getInteraction()=='in'){
                            if(src[alink.getTarget()]==null)
                                src[alink.getTarget()]=[]

                            src[alink.getTarget()][src[alink.getTarget()].length]=alink.getSource();

                            if(reacTgt[alink.getSource()]==null)
                                reacTgt[alink.getSource()]=[]

                            reacTgt[alink.getSource()][reacTgt[alink.getSource()].length]=alink.getTarget();
                        }
                        else{
                            if(tgt[alink.getSource()]==null)
                                tgt[alink.getSource()]=[];
                            tgt[alink.getSource()][tgt[alink.getSource()].length]=alink.getTarget();

                            if(reacSrc[alink.getTarget()]==null)
                                reacSrc[alink.getTarget()]=[];
                            reacSrc[alink.getTarget()][reacSrc[alink.getTarget()].length]=alink.getSource();

                        }
                    });

                for (var key in src) {
                    var i = -1;
                    src[key].forEach(function(reactantX1){
                        i++;
                        src[key].forEach(function(reactantX2){
                            if(reactantX1!=reactantX2 && reactantX1!=undefined){
                                metExploreD3.GraphLink.addHiddenLinkInDrawing(reactantX1+" -- "+reactantX2,reactantX1,reactantX2,'viz');
                            }
                        })
                        delete src[key][i];
                    })
                }

                for (var key in tgt) {
                    var i = -1;
                    tgt[key].forEach(function(produitX1){
                        i++;
                        tgt[key].forEach(function(produitX2){
                            if(produitX1!=produitX2 && produitX1!=undefined){
                                metExploreD3.GraphLink.addHiddenLinkInDrawing(produitX1+" -- "+produitX2,produitX1,produitX2,'viz');
                            }
                        })
                        delete tgt[key][i];
                    })
                }

                for (var key in reacSrc) {
                    var i = -1;
                    reacSrc[key].forEach(function(reactantX1){
                        i++;
                        reacSrc[key].forEach(function(reactantX2){
                            if(reactantX1!=reactantX2 && reactantX1!=undefined){
                                metExploreD3.GraphLink.addHiddenLinkInDrawing(reactantX1+" -- "+reactantX2,reactantX1,reactantX2,'viz');
                            }
                        })
                        delete reacSrc[key][i];
                    })
                }

                for (var key in reacTgt) {
                    var i = -1;
                    reacTgt[key].forEach(function(produitX1){
                        i++;
                        reacTgt[key].forEach(function(produitX2){
                            if(produitX1!=produitX2 && produitX1!=undefined){
                                metExploreD3.GraphLink.addHiddenLinkInDrawing(produitX1+" -- "+produitX2,produitX1,produitX2,'viz');
                            }
                        })
                        delete reacTgt[key][i];
                    })
                }
                metExploreD3.hideMask(myMask);
                var animLinked=metExploreD3.GraphNetwork.isAnimated(session.getId());
                if (animLinked=='true') {
                    var force = session.getForce();
                    if(force!=undefined)
                    {
                        if((metExploreD3.GraphNetwork.isAnimated(session.getId()) == 'true')
                            || (metExploreD3.GraphNetwork.isAnimated(session.getId()) == null)) {
                            force.start();
                        }
                    }
                }
            }, 100);
        }
    },

    // A n'appliquer que sur les petits graphes
    removeLinkTypeOfMetabolite : function(){
        _metExploreViz.setLinkedByTypeOfMetabolite(false);
        var panel = "viz";
        var session = _metExploreViz.getSessionById("viz");

        if(session!=undefined)
        {
            // We stop the previous animation
            var force = session.getForce();
            if(force!=undefined)
            {
                force.stop();
            }
        }

        var myMask = metExploreD3.createLoadMask("Remove hidden link in progress...", panel);
        if(myMask!= undefined){

            metExploreD3.showMask(myMask);

            metExploreD3.deferFunction(function() {
                metExploreD3.GraphLink.removeHiddenLinkInDrawing('viz');

                metExploreD3.hideMask(myMask);
                var animLinked=metExploreD3.GraphNetwork.isAnimated(session.getId());
                if (animLinked=='true') {
                    var force = session.getForce();
                    if(force!=undefined)
                    {
                        if((metExploreD3.GraphNetwork.isAnimated(session.getId()) == 'true')
                            || (metExploreD3.GraphNetwork.isAnimated(session.getId()) == null)) {
                            force.start();
                        }
                    }
                }
            }, 100);
        }
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
    addHiddenLinkInDrawing:function(identifier,source,target,panel){
        var session = _metExploreViz.getSessionById(panel);
        var networkData = session.getD3Data();
        networkData.addLink(identifier,source,target,"hiddenForce",false);
        var metaboliteStyle = metExploreD3.getMetaboliteStyle();
        var linkStyle = metExploreD3.getLinkStyle();
        var force = session.getForce();

        link=d3.select("#"+panel).select("#graphComponent").selectAll("path.link")
            .data(force.links(), function(d) {
                return d.source.id + "-" + d.target.id;
            })
            .enter()
            .insert("path",":first-child")
            .attr("class", "link")//it comes from resources/css/networkViz.css
            .style("stroke",linkStyle.getStrokeColor())
            .style("opacity",0);
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
    removeHiddenLinkInDrawing:function(panel){
        var session = _metExploreViz.getSessionById(panel);

        var networkData = session.getD3Data();
        var linksToRemove = [];
        var force = session.getForce();

        var link=d3.select("#"+panel).select("#graphComponent").selectAll("path.link")
            .filter(function(link){
                return link.getInteraction()=="hiddenForce";
            })
            .each(function(link){ linksToRemove.push(link); })
            .remove();

        setTimeout(
            function() {

                for (i = 0; i < linksToRemove.length; i++) {
                    var link = linksToRemove[i];

                    networkData.removeLink(link);

                    var index = force.links().indexOf(link);

                    if(index!=-1)
                        force.links().splice(index, 1);
                }
            }
            , 100);
    },

// 	function getRandomArbitrary(min, max) {
//   	return Math.random() * (max - min) + min;
// }

// d3.select("#viz").select("#D3viz").selectAll("path.link")
// 	.each(function(link){
// 		if(link.getSource().getReactionReversibility() || link.getTarget().getReactionReversibility())
// 			link.value = getRandomArbitrary(-4, 4);
// 		else
// 			link.value = getRandomArbitrary(0, 4);
// 		console.log(link.value);
// 	}); 
// function getRandomArbitrary(min, max) {
//   	return Math.random() * (max - min) + min;
// }

// d3.select("#viz").select("#D3viz").selectAll("path.link")
// 	.each(function(link){
// 		if(link.getSource().getReactionReversibility() || link.getTarget().getReactionReversibility())
// 			link.value = getRandomArbitrary(-4, 4);
// 		else
// 			link.value = getRandomArbitrary(0, 4);

// 		if(link.getSource().value==undefined)
// 			link.getSource().value = link.value;
// 		else
// 			if(Math.abs(link.getSource().value)<Math.abs(link.value))
// 				link.getSource().value = link.value;

// 		if(link.getTarget().value==undefined)
// 			link.getTarget().value = link.value;
// 		else
// 			if(Math.abs(link.getTarget().value)<Math.abs(link.value))
// 				link.getTarget().value = link.value;
// 	}); 

    /*******************************************
     * Tick function of links
     * @param {} panel : The panel where the action is launched
     * @param {} scale = Ext.getStore('S_Scale').getStoreByGraphName(panel);
     */
    tick : function(panel, scale) {
        // If you want to use selection on compartments path
        d3.select("#"+metExploreD3.GraphNode.panelParent).select("#D3viz").selectAll("path.convexhull")
            .attr("d", metExploreD3.GraphNode.groupPath)
            .attr("transform", d3.select("#"+panel).select("#D3viz").select("#graphComponent").attr("transform"));
        if (metExploreD3.GraphStyleEdition.curvedPath == true){
            var flux = _metExploreViz.getSessionById(panel).getMappingDataType()=="Flux";
            if(flux) {
                funcPath = metExploreD3.GraphLink.funcPathForFlux;
                d3.select("#"+panel).select("#D3viz").select("#graphComponent")
                    .selectAll("path.link")
                    .attr("fill", function (d) {
                        if (d.interaction == "out")
                            return metExploreD3.getLinkStyle().getMarkerOutColor();
                        else
                            return metExploreD3.getLinkStyle().getMarkerInColor();
                    })
                    .attr("d", function(link){  return funcPath(link, panel, this.id);})
                    .style("stroke-linejoin", "bevel");
            }
            else {
                metExploreD3.GraphLink.bundleLinks(panel);
            }
        }
        else {
            var flux = _metExploreViz.getSessionById(panel).getMappingDataType()=="Flux";
            if(flux) {
                funcPath = metExploreD3.GraphLink.funcPathForFlux;
            }
            else {
                funcPath = metExploreD3.GraphLink.funcPath3;
            }

            // If you want to use selection on compartments path
            /*d3.select("#"+metExploreD3.GraphNode.panelParent).select("#D3viz").selectAll("path.convexhull")
                .attr("d", metExploreD3.GraphNode.groupPath)
                .attr("transform", d3.select("#"+panel).select("#D3viz").select("#graphComponent").attr("transform"));*/

            d3.select("#"+panel).select("#D3viz").select("#graphComponent")
                .selectAll("path.link")
                .attr("fill", function (d) {
                    if (d.interaction == "out")
                        return metExploreD3.getLinkStyle().getMarkerOutColor();
                    else
                        return metExploreD3.getLinkStyle().getMarkerInColor();
                })
                .attr("d", function(link){  return funcPath(link, panel, this.id);})
                .style("stroke-linejoin", "bevel");
        }
    },

    displayConvexhulls : function(panel){


        var generalStyle = _metExploreViz.getGeneralStyle();

        var convexHullPath = d3.select("#"+panel).select("#D3viz").selectAll("path.convexhull");


        var isDisplay = generalStyle.isDisplayedConvexhulls();

        if(!isDisplay){
            convexHullPath.remove();
        }
        else
        {
            if(convexHullPath[0].length==0)
                metExploreD3.GraphNode.loadPath(panel, isDisplay);

            convexHullPath
                .attr("d", metExploreD3.GraphNode.groupPath)
                .attr("transform", d3.select("#"+panel).select("#D3viz").select("#graphComponent").attr("transform"));
        }
    },

    // /*******************************************
    // * Init the visualization of links
    // * @param {} parent : The panel where the action is launched
    // * @param {} session : Store which contains global characteristics of session
    // * @param {} linkStyle : Store which contains links style
    // * @param {} metaboliteStyle : Store which contains metabolites style
    // */
    // loadLink : function(parent, session, linkStyle, metaboliteStyle) {

    // 	metExploreD3.GraphLink.panelParent = "#"+parent;
    // 	var networkData=session.getD3Data();

    // 	var size=20;
    // 	// The y-axis coordinate of the reference point which is to be aligned exactly at the marker position.
    // 	var refY = linkStyle.getMarkerWidth() / 2;
    // 	// The x-axis coordinate of the reference point which is to be aligned exactly at the marker position.
    // 	// var refX = linkStyle.getMarkerHeight / 2;

    //   // Adding arrow on links
    // 	d3.select("#"+parent).select("#D3viz").select("#graphComponent").append("svg:defs").selectAll("marker")
    // 		.data(["in", "out"])
    // 		.enter().append("svg:marker")
    // 		.attr("id", String)
    // 		.attr("viewBox", "0 0 "+linkStyle.getMarkerWidth()+" "+linkStyle.getMarkerHeight())
    // 		.attr("refY", refY)
    // 		.attr("markerWidth", linkStyle.getMarkerWidth())
    // 		.attr("markerHeight", linkStyle.getMarkerHeight())
    // 		.attr("orient", "auto")
    // 		.append("svg:path")
    // 		.attr("class", String)
    // 		.attr("d", "M0,0L"+linkStyle.getMarkerWidth()+","+linkStyle.getMarkerHeight()/2+"L0,"+linkStyle.getMarkerWidth()+"Z")
    // 		.style("visibility", "hidden");

    // 		// .attr("d", "M"+linkStyle.getMarkerWidth()+" "+linkStyle.getMarkerHeight()/2+" L"+linkStyle.getMarkerWidth()/2+" "+(3*linkStyle.getMarkerHeight()/4)+" A"+linkStyle.getMarkerHeight()+" "+linkStyle.getMarkerHeight()+" 0 0 0 "+linkStyle.getMarkerWidth()/2+" "+(1*linkStyle.getMarkerHeight()/4)+" L"+linkStyle.getMarkerWidth()+" "+linkStyle.getMarkerHeight()/2+"Z")


    // 	// Append link on panel
    // 	metExploreD3.GraphLink.link=d3.select("#"+parent).select("#D3viz").select("#graphComponent").selectAll("path.link")
    // 		.data(networkData.getLinks())
    // 		.enter()
    // 		.append("path")
    // 		.attr("class", "link")//it comes from resources/css/networkViz.css
    // 		.attr("marker-end", function (d) {
    // 			if (d.interaction=="out")
    // 			{
    // 			   d3.select("#"+parent).select("#D3viz").select("#graphComponent").select("#" + d.interaction)
    // 				.attr("refX", (metaboliteStyle.getWidth()+metaboliteStyle.getHeight())/2/2  + (linkStyle.getMarkerWidth() ))
    // 				.style("fill", linkStyle.getMarkerOutColor())
    // 					.style("stroke",linkStyle.getMarkerStrokeColor())
    // 					.style("stroke-width",linkStyle.getMarkerStrokeWidth());

    // 			   return "url(#" + d.interaction + ")";
    // 			}
    // 			else
    // 			{
    // 			  return "none";
    // 			}

    // 			})
    // 		.attr("marker-start", function (d) {
    // 			if (d.interaction=="out")
    // 			{
    // 			   return "none";
    // 			}
    // 			else
    // 			{
    // 			  d3.select("#"+parent).select("#D3viz").select("#graphComponent").select("#" + d.interaction)
    // 				.attr("refX",-((metaboliteStyle.getWidth()+metaboliteStyle.getHeight())/2/2 ))
    // 				.style("fill", linkStyle.getMarkerInColor())
    // 				.style("stroke",linkStyle.getMarkerStrokeColor())
    // 					.style("stroke-width",linkStyle.getMarkerStrokeWidth());

    // 			  return "url(#" + d.interaction + ")";
    // 			}
    // 			})
    // 		.style("stroke",linkStyle.getStrokeColor());

    // 	metExploreD3.GraphLink.link
    // 		.filter(function(link){
    // 			return link.getInteraction()=="hiddenForce";
    // 		})
    // 		.style("opacity",0);
    // }

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
            .attr("orient", "auto")
            .attr("fill", "green").attr("stroke", "black")
            .append("path")
            .attr("d", "M0,6L-5,12L9,6L-5,0L0,6");
        d3.select("#"+panel).select("#D3viz").select("#graphComponent").append("defs").append("marker")
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

            // For each node, compute the path of the arcs exiting that node, and the path of the arcs exiting that node
            enteringLinks.each(function (link) {
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
                }
                else {
                    path = metExploreD3.GraphLink.computePathVertical(node, enteringX, enteringY, link.getSource());
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
                    path = metExploreD3.GraphLink.computePathArcSibling(node, centroidTargetX, centroidTargetY, link.getTarget(), exitingArcLink);
                }
                else if (exitingY == node.y){
                    path = metExploreD3.GraphLink.computePathHorizontal(node, exitingX, exitingY, link.getTarget());

                }
                else {
                    path = metExploreD3.GraphLink.computePathVertical(node, exitingX, exitingY, link.getTarget());
                }
                d3.select(this).attr("d", path)
                    .attr("fill", "none")
                    .style("opacity", 1);
            }).attr("marker-end", "url(#markerExit)");
        });
        //
        metExploreD3.GraphCaption.drawCaptionEditMode();

        var pathways = d3.select("#"+panel).select("#D3viz").select("#graphComponent")
            .selectAll("g.node")
            .filter(function(node){
                return node.getBiologicalType()==="pathway";
            });

        links = d3.select("#"+panel).select("#D3viz").select("#graphComponent").selectAll("path.link");
        var pathwayLinks = null;
        pathways.each(function(path){
            console.log(path);
            pathwayLinks = links.filter(function (link) {
                return path.getId()===link.getTarget().getId() || path.getId()===link.getSource().getId();
            });
        });
        if(pathwayLinks!=null){
            pathwayLinks
                .attr("fill", function (d) {
                    if (d.interaction == "out")
                        return metExploreD3.getLinkStyle().getMarkerOutColor();
                    else
                        return metExploreD3.getLinkStyle().getMarkerInColor();
                })
                .attr("d", function(link){  return metExploreD3.GraphLink.funcPath3(link, panel, this.id);})
                .style("stroke-linejoin", "bevel");
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
    }
}