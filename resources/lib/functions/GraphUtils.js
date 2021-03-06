/**
 * @class metExploreD3.GraphUtils
 * Basic functions
 *
 * Save, exports, imports
 * Color converters
 * Web Services facilities
 *
 * @author MC
 * @uses metExploreD3.GraphNode
 * @uses metExploreD3.GraphNetwork
 * @uses metExploreD3.GraphStyleEdition
 */
metExploreD3.GraphUtils = {

    /*****************************************************
     * Decode external JSONs
     * @param {String} json Active string from imports
     */
    decodeJSON : function(json){
        try {
            var jsonParsed = Ext.decode(json);
        }
        catch (ex) {
            metExploreD3.displayWarning('Invalid JSON String', 'Unable to parse the JSON');
        }
        return jsonParsed;
    },

    /*****************************************************
     * Function to facilitate launching of MetExplore Web Service
     * @param {String} url WebService to call https://vm-metexplore-prod.toulouse.inra.fr/metexplore-webservice-documentation/
     * @param {Function} func Callback function
     *
     * Example :
     * 		@example
     *		metExploreViz.GraphUtils.launchWebService(
     *			"http://metexplore.toulouse.inra.fr:8080/metExploreWebService/mapping/graphresult/38285/filteredbypathway?pathwayidlist=(123757,123787)",
     *			function(myJsonString){
     *		})
     *
     */
    launchWebService : function(url, func){
        //var mapJSON = '{"name": "mapping_D-Galactose", "mappings":[{"name": "conditionName1", "data": [{"node" : "D-Galactose"}, {"node" : "D-galactose"}]  }]}';
        $.ajax({
            url: "src/php/metExplore.php",
            type: "POST",
            dataType: "text",
            data: {data:url},
            success: function (data) {
                func(data);
            },
            error: function (data) {
                alert("Bad");
            }
        });
    },


    /*****************************************************
     * Function to facilitate parsing of MetExplore Web Service mapping results
     * @param {String} myJsonMapping JSON string result of MetExplore Web Service
     * @return {String} mapJSON String that you can map programmatically in MetExploreViz
     */
    parseWebServiceMapping : function(myJsonMapping){
        //var mapJSON = '{"name": "mapping_D-Galactose", "mappings":[{"name": "conditionName1", "data": [{"node" : "D-Galactose"}, {"node" : "D-galactose"}]  }]}';
        var mappingJSON = Ext.decode(myJsonMapping);
        var conditions = mappingJSON.mappingdata[0].mappings;
        conditions.forEach(function(condition){
            var mappingDatas = condition.data;
            var i = 0;
            var valueIsSet = false;
            while (i < mappingDatas.length && !valueIsSet) {
                if(mappingDatas.value != undefined)
                    valueIsSet=true;

                i++;
            }
            if(!valueIsSet)
                condition.name="undefined"
        });

        var mapJSON = JSON.stringify(mappingJSON.mappingdata[0]);

        //Load mapping
        return mapJSON;
    },

    /*****************************************************
     * Function to pass in array filter to allow unicity of array elements
     * If the current iterator object hasn't the same index that the first similar element find with find index return false and remove it through filter
     * @param {Object} value Current value
     * @param {Number} index Current index
     * @param {Array} self The array
     *
     * Example :
     * 		@example
     * 		var arrayOfNodes = [1,1,2,3,5,7,7,10];
     *		console.log(arrayOfNodes.filter(metExploreD3.GraphUtils.onlyUnique));
     *		//[1,2,3,5,7,10];
     *
     */
    onlyUnique : function(value, index, self) {
        return self
            .findIndex(
                function(x){return x===value;}
            ) === index;
    },

    /*****************************************************
     * Read input file
     * @param {Element} input DOM element of input file
     * @param {Function} func Callback function
     */
    handleFileSelect : function(input, func){

        if (!window.File || !window.FileReader || !window.FileList || !window.Blob) {
            alert('The File APIs are not fully supported in this browser.');
            return;
        }

        if (!input) {
            alert("couldn't find the fileinput element.");
        }
        else if (!input.files) {
            alert("This browser doesn't seem to support the `files` property of file inputs.");
        }
        else {
            file = input.files[0];

            var reader = new FileReader();
            reader.onload = function(){
                func(reader.result, file.name);
            };
            reader.readAsText(file);
        }
    },


    /*******************************************
     * Convert colorName in hex
     * @param {String} color Classic color name
     * @return {String}
     */
    colorNameToHex : function(color) {
        var colors = {"aliceblue":"#f0f8ff","antiquewhite":"#faebd7","aqua":"#00ffff","aquamarine":"#7fffd4","azure":"#f0ffff",
            "beige":"#f5f5dc","bisque":"#ffe4c4","black":"#000000","blanchedalmond":"#ffebcd","blue":"#0000ff","blueviolet":"#8a2be2","brown":"#a52a2a","burlywood":"#deb887",
            "cadetblue":"#5f9ea0","chartreuse":"#7fff00","chocolate":"#d2691e","coral":"#ff7f50","cornflowerblue":"#6495ed","cornsilk":"#fff8dc","crimson":"#dc143c","cyan":"#00ffff",
            "darkblue":"#00008b","darkcyan":"#008b8b","darkgoldenrod":"#b8860b","darkgray":"#a9a9a9","darkgreen":"#006400","darkkhaki":"#bdb76b","darkmagenta":"#8b008b","darkolivegreen":"#556b2f",
            "darkorange":"#ff8c00","darkorchid":"#9932cc","darkred":"#8b0000","darksalmon":"#e9967a","darkseagreen":"#8fbc8f","darkslateblue":"#483d8b","darkslategray":"#2f4f4f","darkturquoise":"#00ced1",
            "darkviolet":"#9400d3","deeppink":"#ff1493","deepskyblue":"#00bfff","dimgray":"#696969","dodgerblue":"#1e90ff",
            "firebrick":"#b22222","floralwhite":"#fffaf0","forestgreen":"#228b22","fuchsia":"#ff00ff",
            "gainsboro":"#dcdcdc","ghostwhite":"#f8f8ff","gold":"#ffd700","goldenrod":"#daa520","gray":"#808080","green":"#008000","greenyellow":"#adff2f",
            "honeydew":"#f0fff0","hotpink":"#ff69b4",
            "indianred ":"#cd5c5c","indigo":"#4b0082","ivory":"#fffff0","khaki":"#f0e68c",
            "lavender":"#e6e6fa","lavenderblush":"#fff0f5","lawngreen":"#7cfc00","lemonchiffon":"#fffacd","lightblue":"#add8e6","lightcoral":"#f08080","lightcyan":"#e0ffff","lightgoldenrodyellow":"#fafad2",
            "lightgrey":"#d3d3d3","lightgreen":"#90ee90","lightpink":"#ffb6c1","lightsalmon":"#ffa07a","lightseagreen":"#20b2aa","lightskyblue":"#87cefa","lightslategray":"#778899","lightsteelblue":"#b0c4de",
            "lightyellow":"#ffffe0","lime":"#00ff00","limegreen":"#32cd32","linen":"#faf0e6",
            "magenta":"#ff00ff","maroon":"#800000","mediumaquamarine":"#66cdaa","mediumblue":"#0000cd","mediumorchid":"#ba55d3","mediumpurple":"#9370d8","mediumseagreen":"#3cb371","mediumslateblue":"#7b68ee",
            "mediumspringgreen":"#00fa9a","mediumturquoise":"#48d1cc","mediumvioletred":"#c71585","midnightblue":"#191970","mintcream":"#f5fffa","mistyrose":"#ffe4e1","moccasin":"#ffe4b5",
            "navajowhite":"#ffdead","navy":"#000080",
            "oldlace":"#fdf5e6","olive":"#808000","olivedrab":"#6b8e23","orange":"#ffa500","orangered":"#ff4500","orchid":"#da70d6",
            "palegoldenrod":"#eee8aa","palegreen":"#98fb98","paleturquoise":"#afeeee","palevioletred":"#d87093","papayawhip":"#ffefd5","peachpuff":"#ffdab9","peru":"#cd853f","pink":"#ffc0cb","plum":"#dda0dd","powderblue":"#b0e0e6","purple":"#800080",
            "red":"#ff0000","rosybrown":"#bc8f8f","royalblue":"#4169e1",
            "saddlebrown":"#8b4513","salmon":"#fa8072","sandybrown":"#f4a460","seagreen":"#2e8b57","seashell":"#fff5ee","sienna":"#a0522d","silver":"#c0c0c0","skyblue":"#87ceeb","slateblue":"#6a5acd","slategray":"#708090","snow":"#fffafa","springgreen":"#00ff7f","steelblue":"#4682b4",
            "tan":"#d2b48c","teal":"#008080","thistle":"#d8bfd8","tomato":"#ff6347","turquoise":"#40e0d0",
            "violet":"#ee82ee",
            "wheat":"#f5deb3","white":"#ffffff","whitesmoke":"#f5f5f5",
            "yellow":"#ffff00","yellowgreen":"#9acd32"};

        if (typeof colors[color.toLowerCase()] != 'undefined')
            return colors[color.toLowerCase()];

        return false;
    },

    /*******************************************
     * Convert rgb in hexa
     * @param {Number} r : Red
     * @param {Number} g : green
     * @param {Number} b : Bleu
     * @return {String}
     */
    RGB2Color : function(r,g,b){
        return '#' + metExploreD3.GraphUtils.byte2Hex(r) + metExploreD3.GraphUtils.byte2Hex(g) + metExploreD3.GraphUtils.byte2Hex(b);
    },

    /*******************************************
     * Choose text color in function of contrast with background
     * @param {String} backgroundColor Background color
     * @return {String} The color assigned to text
     */
    RGBString2Color : function(backgroundColor){
        if(backgroundColor!=undefined){
            var color;
            if(backgroundColor.slice(0,3) == "rgb"){
                backgroundColor = backgroundColor.replace("rgb","");
                backgroundColor = backgroundColor.replace("(","");
                backgroundColor = backgroundColor.replace(")","");
                rgb = backgroundColor.split(",");
                var red = rgb[0];
                var green = rgb[1];
                var blue = rgb[2];
                return metExploreD3.GraphUtils.RGB2Color(red, green, blue)
            }
            if(backgroundColor.slice(0,1) == "#")
                return backgroundColor;
        }
    },

    /*******************************************
     * Choose text color in function of contrast with background
     * @param {} backgroundColor : Color of background
     * @return {String}
     * @private
     */
    chooseTextColor : function(backgroundColor){
        if(backgroundColor!=undefined){
            var color;
            if(backgroundColor.slice(0,1) == "#"){
                var rgb = metExploreD3.GraphUtils.hexToRGB(backgroundColor);
                var red = rgb.r;
                var green = rgb.g;
                var blue = rgb.b;
                if ((red*0.299 + green*0.687 + blue*0.114) > 186)
                    color = "#000000";
                else
                    color = "white";
            }
            else
            {
                if(backgroundColor.slice(0,3) == "rgb"){
                    backgroundColor = backgroundColor.replace("rgb","");
                    backgroundColor = backgroundColor.replace("(","");
                    backgroundColor = backgroundColor.replace(")","");
                    rgb = backgroundColor.split(",");
                    var red = rgb[0];
                    var green = rgb[1];
                    var blue = rgb[2];
                    if ((red*0.299 + green*0.687 + blue*0.114) > 186)
                        color = "#000000";
                    else
                        color = "white";
                }
                else
                    color = "#000000";
            }
            return color;
        }
        else
            return "#000000";
    },

    /*******************************************
     * Convert byte in hexa
     * @param {String} n : Color in byte
     * @return {String}
     */
    byte2Hex : function(n){
        var nybHexString = "0123456789ABCDEF";
        return String(nybHexString.substr((n >> 4) & 0x0F,1)) + nybHexString.substr(n & 0x0F,1);
    },

    /*******************************************
     * Convert a hexidecimal color string to 0..255 R,G,B
     * @param {String} hex Color in hex
     * @return {String}
     */
    hexToRGB : function(hex){
        // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
        var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, function(m, r, g, b) {
            return r + r + g + g + b + b;
        });

        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    },

    /*******************************************
     * EXPORT FUNCTIONS
     *****************************************/

    /*******************************************
     * Export a metabolic network in PNG.
     * @param {Number} size Number to multiply the size
     */
    exportPNG: function (size) {
        metExploreD3.GraphUtils.escapeUnExportNode();

        window.URL = (window.URL || window.webkitURL);

        metExploreD3.GraphUtils.initialize('png', size);
    },

    /*******************************************
     * Export a metabolic network in JPG.
     * @param {Number} size Number to multiply the size
     */
    exportJPG : function(size){
        metExploreD3.GraphUtils.escapeUnExportNode();

        window.URL = (window.URL || window.webkitURL);

        metExploreD3.GraphUtils.initialize('jpeg', size);
    },

    /*******************************************
     * Escape nodes which don't appear in export.
     */
    escapeUnExportNode: function(){
        var brush = d3.selectAll("#brush");
        if(brush!=null)
            brush.style("display", "none");

        d3.selectAll("#D3viz")
            .style("box-shadow", "");
    },

    /*******************************************
     * Export a metabolic network in SVG.
     */
    exportSVG : function(){

        metExploreD3.GraphUtils.escapeUnExportNode();

        window.URL = (window.URL || window.webkitURL);

        var stringSvg = metExploreD3.GraphUtils.initialize("svg");
    },

    /*******************************************
     * Initialize export
     * @param {String} type PNG, JPG, SVG
     * @param {Number} size Number to multiply the size
     * @private
     */
    initialize : function(type, size){
        var session = _metExploreViz.getSessionById('viz');
        var force = session.getForce();
        if(session!==undefined)
        {
            // We stop the previous animation
            if(force!==undefined)
            {
                if(metExploreD3.GraphNetwork.isAnimated('viz'))
                    force.stop();

            }
        }

        var prefix = {
            xmlns: "http://www.w3.org/2000/xmlns/",
            xlink: "http://www.w3.org/1999/xlink",
            svg: "http://www.w3.org/2000/svg"
        };

        var documents = [window.document],
            SVGSources = [];
        iframes = document.querySelectorAll("iframe"),
            objects = document.querySelectorAll("object");

        // add empty svg element
        var emptySvg = window.document.createElementNS(prefix.svg, 'svg');
        window.document.body.appendChild(emptySvg);
        var myMask = metExploreD3.createLoadMask("Export initialization...", 'graphPanel');
        if(myMask !== undefined){

            metExploreD3.showMask(myMask);
            metExploreD3.deferFunction(function() {
                [].forEach.call(iframes, function(el) {
                    try {
                        if (el.contentDocument) {
                            documents.push(el.contentDocument);
                        }
                    } catch(err) {
                        console.log(err);
                    }
                });

                [].forEach.call(objects, function(el) {
                    try {
                        if (el.contentDocument) {
                            documents.push(el.contentDocument);
                        }
                    } catch(err) {
                        console.log(err)
                    }
                });

                documents.forEach(function(doc) {
                    var newSources = metExploreD3.GraphUtils.getSources(doc, prefix);
                    // because of prototype on NYT pages
                    for (var i = 0; i < newSources.length; i++) {

                        if(newSources[i].classe.includes("D3viz"))
                            SVGSources.push(newSources[i]);
                    }
                });

                metExploreD3.hideMask(myMask);

                var parent = emptySvg.parentNode;
                parent.removeChild(emptySvg);

                if (SVGSources.length > 1) {
                    metExploreD3.GraphUtils.createPopover(SVGSources, type, size);
                } else if (SVGSources.length > 0) {
                    return metExploreD3.GraphUtils.download(SVGSources[0], type, size);
                } else {
                    alert("Couldn???t find any SVG nodes.");
                }
            }, 100);
        }
    },

    /*******************************************
     * Permits to make a choice between all networks
     * @param {Object} sources Several networks compared in MetExplore
     * @param {String} type PNG, JPG, SVG
     * @param {Number} size Number to multiply the size
     * @private
     */
    createPopover : function(sources, type, size) {
        metExploreD3.GraphUtils.cleanup();

        sources.forEach(function(s1) {
            sources.forEach(function(s2) {
                if (s1 !== s2) {
                    if ((Math.abs(s1.top - s2.top) < 38) && (Math.abs(s1.left - s2.left) < 38)) {
                        s2.top += 38;
                        s2.left += 38;
                    }
                }
            });
        });

        var buttonsContainer = document.createElement("div");
        document.body.appendChild(buttonsContainer);

        buttonsContainer.setAttribute("class", "svg-crowbar");
        buttonsContainer.style["z-index"] = 1e7;
        buttonsContainer.style["position"] = "absolute";
        buttonsContainer.style["top"] = 0;
        buttonsContainer.style["left"] = 0;



        var background = document.createElement("div");
        document.body.appendChild(background);

        background.setAttribute("class", "svg-crowbar");
        background.style["background"] = "rgba(255, 255, 255, 0.7)";
        background.style["position"] = "fixed";
        background.style["left"] = 0;
        background.style["top"] = 0;
        background.style["width"] = "100%";
        background.style["height"] = "100%";

        sources.forEach(function(d, i) {
            var buttonWrapper = document.createElement("div");
            buttonsContainer.appendChild(buttonWrapper);
            buttonWrapper.setAttribute("class", "svg-crowbar");
            buttonWrapper.style["position"] = "absolute";
            buttonWrapper.style["top"] = (d.top + document.body.scrollTop) + "px";
            buttonWrapper.style["left"] = (document.body.scrollLeft + d.left) + "px";
            buttonWrapper.style["padding"] = "4px";
            buttonWrapper.style["border-radius"] = "3px";
            buttonWrapper.style["color"] = "white";
            buttonWrapper.style["text-align"] = "center";
            buttonWrapper.style["font-family"] = "'Helvetica Neue'";
            buttonWrapper.style["background"] = "rgba(0, 0, 0, 0.8)";
            buttonWrapper.style["box-shadow"] = "0px 4px 18px rgba(0, 0, 0, 0.4)";
            buttonWrapper.style["cursor"] = "move";
            buttonWrapper.textContent =  "SVG #" + i + ": " + (d.id ? "#" + d.id : "") + (d.classe ? "." + d.classe : "");

            var button = document.createElement("button");
            buttonWrapper.appendChild(button);
            button.setAttribute("data-source-id", i);
            button.style["width"] = "150px";
            button.style["font-size"] = "12px";
            button.style["line-height"] = "1.4em";
            button.style["margin"] = "5px 0 0 0";
            button.textContent = "Download";

            button.onclick = function(el) {
                metExploreD3.GraphUtils.download(d, type, size);
            };
        });
    },

    /*******************************************
     * Cleanup svg of unused thinks
     * @private
     */
    cleanup : function() {
        var crowbarElements = document.querySelectorAll(".svg-crowbar");

        [].forEach.call(crowbarElements, function(el) {
            el.parentNode.removeChild(el);
        });

        var brush = d3.selectAll("#brush");
        if(brush!=null)
            brush.style("display", "inline");

        var buttonLink = d3.selectAll("#buttonLink");
        if(buttonLink!=null)
            buttonLink.style("display ", "inline");

        var buttonImportCoordinates = d3.selectAll("#buttonImportCoordinates");
        if(buttonImportCoordinates!=null)
            buttonImportCoordinates.style("display ", "inline");

        var buttonAlignMapping = d3.selectAll("#buttonAlignMapping");
        if(buttonAlignMapping!=null)
            buttonAlignMapping.style("display ", "inline");

        var buttonExportCoordinates = d3.selectAll("#buttonExportCoordinates");
        if(buttonExportCoordinates!=null)
            buttonExportCoordinates.style("display ", "inline");

        d3.select("#"+_MyThisGraphNetwork.activePanel).select("#D3viz")
            .style("box-shadow", " 0px 0px 10px 3px #144778 inset");
    },

    /*******************************************
     * Get all networks displayed all networks
     * @param {Object} doc DOM in window
     * @param {Number} prefix Namespace prefix
     * @return {Array} All D3viz in the DOM
     * @private
     */
    getSources : function(doc, prefix) {
        var svgInfo = [],
            svgs = doc.querySelectorAll("svg");

        [].forEach.call(svgs, function (aSvg) {
            svg = aSvg;

            if(svg.id==="D3viz")
            {
                function clonef(selector) {
                    var node = d3.select(selector).node();
                    return d3.select(node.parentNode.insertBefore(node.cloneNode(true), node.nextSibling)).node();
                }

                var clone = clonef(svg);

                clone.setAttribute("version", "1.1");

                // removing attributes so they aren't doubled up
                clone.removeAttribute("xmlns");
                clone.removeAttribute("xlink");

                // These are needed for the svg
                if (!clone.hasAttributeNS(prefix.xmlns, "xmlns")) {
                    clone.setAttributeNS(prefix.xmlns, "xmlns", prefix.svg);
                }

                if (!clone.hasAttributeNS(prefix.xmlns, "xmlns:xlink")) {
                    clone.setAttributeNS(prefix.xmlns, "xmlns:xlink", prefix.xlink);
                }

                var buttonImportCoordinates = clone.getElementById("buttonImportCoordinates");
                if(buttonImportCoordinates!=null)
                    buttonImportCoordinates.parentNode.removeChild(buttonImportCoordinates);

                var buttonLink = clone.getElementById("buttonLink");
                if(buttonLink!=null)
                    buttonLink.parentNode.removeChild(buttonLink);

                var buttonAlignMapping = clone.getElementById("buttonAlignMapping");
                if(buttonAlignMapping!=null)
                    buttonAlignMapping.parentNode.removeChild(buttonAlignMapping);

                var buttonExportCoordinates = clone.getElementById("buttonExportCoordinates");
                if(buttonExportCoordinates!=null)
                    buttonExportCoordinates.parentNode.removeChild(buttonExportCoordinates);

                var brush = clone.getElementById("brush");
                if(brush!=null)
                    brush.parentNode.removeChild(brush);

                var allElements;

                var d3Clone = d3.select(clone);
                var rectSvg = svg.parentNode.getBoundingClientRect();
                var canvasWidth = rectSvg.width;

                var canvasHeight = rectSvg.height;

                d3Clone.select(".logoViz")
                    .each(function(){
                        var url = this.firstChild.getAttribute("href");
                        if (window.XDomainRequest) {
                            xdr = new XDomainRequest();
                        } else if (window.XMLHttpRequest) {
                            var XMLrequest = new XMLHttpRequest(); // new XML request
                            XMLrequest.open("GET", url, false); // URL of the SVG file on server
                            XMLrequest.send(null); // get the SVG file
                            if(XMLrequest.responseXML!=null){
                                var mySVG = XMLrequest.responseXML.getElementsByTagName("svg")[0];
                                if(this.firstChild.getAttribute('width')!=null){

                                    mySVG.setAttribute("x", this.firstChild.getAttribute("x"));
                                    mySVG.setAttribute("y", this.firstChild.getAttribute("y"));
                                    mySVG.setAttribute("width", this.firstChild.getAttribute("width").split('px')[0]);
                                    mySVG.setAttribute("height", this.firstChild.getAttribute("height").split('px')[0]);
                                    mySVG.setAttribute("class", "logoViz");

                                    var parent = this;
                                    parent.removeChild(this.firstChild);
                                    parent.appendChild(mySVG);

                                }
                            }
                        } else {
                            alert("Votre navigateur ne g??re pas l'AJAX cross-domain !");
                        }
                    });

                d3Clone.selectAll(".locker, .fontSelected")
                    .each(function(){
                            this.parentNode.removeChild(this);
                        }
                    );

                d3Clone.selectAll(".hide").remove();

                var nbNodes = d3Clone.select("#graphComponent").selectAll("g.node").data().length;
                if(nbNodes){
                    d3Clone.select("#graphComponent").selectAll("g.node")
                        .select(".structure_metabolite")
                        .each(function(){
                            var url = this.firstChild.getAttribute("href");
                            if (window.XDomainRequest) {
                                xdr = new XDomainRequest();
                            } else if (window.XMLHttpRequest) {
                                var XMLrequest = new XMLHttpRequest(); // new XML request
                                XMLrequest.open("GET", url, false); // URL of the SVG file on server
                                XMLrequest.send(null); // get the SVG file
                                if(XMLrequest.responseXML!=null){
                                    var mySVG = XMLrequest.responseXML.getElementsByTagName("svg")[0];
                                    if(this.getAttribute('width')!=null){

                                        var scale = parseFloat(this.getAttribute("width").split('px')[0])/parseFloat(mySVG.getAttribute("width").split('px')[0]);

                                        mySVG.setAttribute("x", this.getAttribute("x"));
                                        mySVG.setAttribute("y", this.getAttribute("y"));
                                        mySVG.setAttribute("width", this.getAttribute("width").split('px')[0]);
                                        mySVG.setAttribute("height", this.getAttribute("height").split('px')[0]);
                                        mySVG.setAttribute("class", "structure_metabolite");

                                        var nodeChilds = mySVG.children;
                                        for (var i = 0; i < nodeChilds.length; i++) {
                                            nodeChilds[i].setAttribute("transform", "scale("+scale+")");
                                        };

                                        var parent = this.parentNode;
                                        parent.removeChild(this);
                                        parent.appendChild(mySVG);
                                    }
                                }
                            } else {
                                alert("Votre navigateur ne g??re pas l'AJAX cross-domain !");
                            }
                        });

                    metExploreD3.GraphUtils.setInlineStyles(clone, allElements);
                }
                else
                {
                    d3Clone.selectAll('g.node text')
                        .each(function(){
                            this.parentNode.removeChild(this);
                        });
                }

                var rectGraphComponent = d3Clone.select("#graphComponent").node().getBoundingClientRect();

                var translateX = rectSvg.left+100 - rectGraphComponent.left;
                var translateY = rectSvg.top+50 - rectGraphComponent.top;

                d3Clone.select("#graphComponent").attr("transform",  "translate(" + translateX + "," + translateY + ") scale(1)");

                rectGraphComponent = d3Clone.select("#graphComponent").node().getBoundingClientRect();
                if((rectSvg.width + rectGraphComponent.right - rectSvg.right +20 )>canvasWidth){
                    canvasWidth = rectSvg.width + rectGraphComponent.right - rectSvg.right +20;
                }
                else
                {
                    d3Clone.select("#graphComponent").attr("transform",  "translate(0," + translateY + ") scale(1)");
                }
                clone.setAttribute("width",  canvasWidth);
                if((rectSvg.height + rectGraphComponent.bottom - rectSvg.bottom +20 )>canvasHeight)
                    canvasHeight = rectSvg.height + rectGraphComponent.bottom - rectSvg.bottom +20;
                clone.setAttribute("height", canvasHeight);

                d3Clone.select("#graphComponent").attr("transform",  d3.select(svg).select("#graphComponent").attr("transform"));

                var canvasWidth = rectSvg.width;
                clone.setAttribute("width",  canvasWidth);

                var canvasHeight = rectSvg.height;
                clone.setAttribute("height", canvasHeight);

                var source = (new XMLSerializer()).serializeToString(clone);
                var doctype = '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">';

                svgInfo.push({
                    top: rectSvg.top,
                    left: rectSvg.left,
                    width: parseInt(clone.getAttribute("width"))*2,
                    height: parseInt(clone.getAttribute("height"))*2,
                    classe: clone.getAttribute("class"),
                    id: clone.getAttribute("id"),
                    parent: svg.parentNode.id,
                    childElementCount: clone.childElementCount,
                    source: [doctype + source]
                });

                d3Clone.remove();
            }
        });

        return svgInfo;
    },

    /**
     * Save file or data directly, with a given filename --> cause download dialog in the browser
     * @param {String} uri File or data to download
     * @param {String} filename Default filename of the downloaded file
     * @private
     */
    saveAsSvg: function(uri, filename) {
        var link = document.createElement('a');
        if (typeof link.download === 'string') {
            link.href = uri;
            link.download = filename;

            //Firefox requires the link to be in the body
            document.body.appendChild(link);

            //simulate click
            link.click();

            //remove the link when done
            document.body.removeChild(link);
        }
        else {
            window.open(uri);
        }

        var session = _metExploreViz.getSessionById('viz');
        var force = session.getForce();

        if(session!=undefined)
        {
            if(force!=undefined)
            {
                if(session.isAnimated("viz"))
                    force.alpha(1).restart();
            }
        }
    },

    /*******************************************
     * Get image from computer to import it in SVG
     * @param {String} url File location on client computer
     * @param {Function} callback Callback function
     * @private
     */
    getDataUri : function(url, callback) {

        var XMLrequest = new XMLHttpRequest(); // new XML request
        XMLrequest.open("GET", url, false); // URL of the SVG file on server
        XMLrequest.send(null); // get the SVG file
        var res = XMLrequest.responseXML;
        if (res!==null){
            var mySVG = res.getElementsByTagName("svg")[0];

            var svg = new XMLSerializer().serializeToString(mySVG);
            var base64 = window.btoa(svg);

            callback('data:image/svg+xml;base64,' + base64);
        }
        else
        {

            var image = new Image();

            image.onload = function () {
                var canvas = document.createElement('canvas');
                canvas.width = this.naturalWidth; // or 'width' if you want a special/scaled size
                canvas.height = this.naturalHeight; // or 'height' if you want a special/scaled size

                canvas.getContext('2d').drawImage(this, 0, 0);

                // Get raw image data
                callback(canvas.toDataURL('image/png').replace(/^data:image\/(png|jpg);base64,/, ''));

                // ... or get as Data URI
                callback(canvas.toDataURL('image/png'));
            };
            image.src=url;
        }
    },

    /*******************************************
     * Convert canvas to file URL
     * @param {CanvasDrawImage} canvas Canvas drawn to export PNG or JPG
     * @param {String} type PNG or JPG
     * @return {String} Url used to download exported file
     * @private
     */
    binaryblob : function(canvas, type){

        var byteString = window.atob(canvas.toDataURL("image/"+type).replace(/^data:image\/(png|jpeg);base64,/, ""));
        var ab = new ArrayBuffer(byteString.length);
        var ia = new Uint8Array(ab);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        var dataView = new DataView(ab);
        var blob = new Blob([dataView], {type: "image/"+type});
        var DOMURL = self.URL || self.webkitURL || self;
        var newurl = DOMURL.createObjectURL(blob);

        var img = '<img src="'+newurl+'">';
        d3.select("#img").html(img);
        return newurl;
    },

    /*******************************************
     * Save file or data directly, with a given filename --> cause download dialog in the browser
     * @param {Object} source Element(a D3viz svg) to export
     * @param {String} filename Default filename of the downloaded file
     * @param {String} type PNG or JPG
     * @param {Number} size Number to multiply the size
     * @private
     */
    saveAsBinary: function(source, filename, type, size) {
        var imgsrc = 'data:image/svg+xml;base64,'+ window.btoa(unescape(encodeURIComponent(source.source)));

        var canvas = document.createElement('canvas');
        canvas.id = "canvas";
        canvas.height = source.height*size;
        canvas.width = source.width*size;
        canvas.style.zIndex = 8;
        canvas.style.position = "absolute";
        canvas.style.border = "1px solid";
        var body = document.getElementsByTagName("body")[0];
        body.appendChild(canvas);

        context = canvas.getContext("2d");
        var image = new Image();

        image.onload = function() {
            var myMask = metExploreD3.createLoadMask("Export in progress...", source.parent);
            if(myMask!= undefined){

                metExploreD3.showMask(myMask);
                metExploreD3.deferFunction(function() {
                    context.drawImage(image, 0, 0, source.width*size, source.height*size);

                    var newurl = metExploreD3.GraphUtils.binaryblob(canvas, type);

                    var link = document.createElement('a');
                    if (typeof link.download === 'string') {
                        link.download = filename;
                        link.href = newurl;

                        //Firefox requires the link to be in the body
                        document.body.appendChild(link);

                        //simulate click
                        link.click();

                        //remove the link when done
                        document.body.removeChild(link);
                    }
                    else {
                        window.open(newurl);
                    }

                    var parent = canvas.parentNode;
                    parent.removeChild(canvas);
                    metExploreD3.hideMask(myMask);

                    var session = _metExploreViz.getSessionById('viz');
                    var force = session.getForce();

                    if(session!=undefined)
                    {
                        if(force!=undefined)
                        {
                            if(session.isAnimated("viz"))
                                force.alpha(1).restart();
                        }
                    }
                }, 100);
            }
        };
        image.src = imgsrc;
    },

    /*******************************************
     * Download, define the name and apply export in function of type
     * @param {Object} source Element(a D3viz svg) to export
     * @param {String} type PNG or JPG or SVG
     * @param {Number} size Number to multiply the size
     * @private
     */
    download : function(source, type, size) {
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!
        var yyyy = today.getFullYear();

        if(dd<10) {
            dd='0'+dd
        }

        if(mm<10) {
            mm='0'+mm
        }

        today = mm+'-'+dd+'-'+yyyy;

        if(type=='jpeg' || type=='png')
            metExploreD3.GraphUtils.saveAsBinary(source, "MetExploreViz_"+today+"."+type, type, size);

        if(type=='svg'){
            var blob = new Blob([source.source], {type: "data:image/svg+xml"}); // pass a useful mime type here
            var url = URL.createObjectURL(blob);
            metExploreD3.GraphUtils.saveAsSvg(url, "MetExploreViz_"+today+".svg");
        }

        metExploreD3.GraphUtils.cleanup();

    },

    /*******************************************
     * Fix all styles
     * @param {Object} element Element to export
     * @private
     */
    explicitlySetStyle : function(element) {
        var cSSStyleDeclarationComputed = getComputedStyle(element);
        var i, len, key, value;
        var computedStyleStr = [];
        var deuxPoints = ":";
        var sep = ";";
        for (i=0, len=cSSStyleDeclarationComputed.length; i<len; i++) {
            key=cSSStyleDeclarationComputed[i];

            if(element.tagName == "rect")
            {
                if(element.getAttribute("class")=="stroke"){
                    if(key!="height" && key!="width"){
                        value=cSSStyleDeclarationComputed.getPropertyValue(key);
                        computedStyleStr.push(key);
                        computedStyleStr.push(deuxPoints);
                        computedStyleStr.push(value);
                        computedStyleStr.push(sep);
                    }
                }
                else
                {
                    if(key!="fill" && key!="height" && key!="width"){
                        value=cSSStyleDeclarationComputed.getPropertyValue(key);

                        computedStyleStr.push(key);
                        computedStyleStr.push(deuxPoints);
                        computedStyleStr.push(value);
                        computedStyleStr.push(sep);
                    }
                }
            }
            else
            {
                if(key!="marker-start" && key!="marker-end"){
                    value=cSSStyleDeclarationComputed.getPropertyValue(key);

                    computedStyleStr.push(key);
                    computedStyleStr.push(deuxPoints);
                    computedStyleStr.push(value);
                    computedStyleStr.push(sep);
                }
            }
        }

        element.setAttribute('style', computedStyleStr.join(""));
    },

    /*******************************************
     * Route all nodes
     * @param {Object} obj Element to export
     * @private
     */
    traverse : function(obj){
        var tree = [];
        tree.push(obj);
        visit(obj);
        function visit(node) {

            if ((!(node.className.baseVal /*&& node.className.baseVal=="linkGroup"*/)) && node.tagName!='line' ){

                if (node && node.hasChildNodes()) {
                    var child = node.firstChild;
                    if(child.className!=undefined)
                    {
                        // if(child.tagName=="image")
                        //  {
                        //      	if (window.XDomainRequest) {
                        // 	xdr = new XDomainRequest();
                        // } else if (window.XMLHttpRequest) {
                        // 	var XMLrequest = new XMLHttpRequest(); // new XML request
                        // 	XMLrequest.open("GET", 'resources/images/structure_metabolite/MetEx_M_100.svg', false); // URL of the SVG file on server
                        // 	XMLrequest.send(null); // get the SVG file

                        // 	var mySVG = XMLrequest.responseXML.getElementsByTagName("svg")[0];
                        // 	if(node.getAttribute('width')!=null){
                        // 		console.log(mySVG.getAttribute("width"));

                        // 		var scale = parseFloat(node.getAttribute("width").split('px')[0])/parseFloat(mySVG.getAttribute("width").split('px')[0]);
                        // 		console.log(scale);
                        // 		d3.select(mySVG).attr('transform','translate(0,0) scale('+scale+','+scale+')');

                        // 		mySVG.setAttribute("x", node.getAttribute("x"));
                        // 		mySVG.setAttribute("y", node.getAttribute("y"));
                        // 		mySVG.setAttribute("width", node.getAttribute("width").split('px')[0]);
                        // 		mySVG.setAttribute("height", node.getAttribute("height").split('px')[0]);

                        // 		mySVG.setAttribute("transform", "translate(0,0) scale("+scale+","+scale+")");

                        // 		var parent = node.parentNode;
                        // 		parent.removeChild(node);
                        // 		parent.appendChild(mySVG);
                        // 		console.log(parent.lastChild);
                        //      			child = mySVG;
                        // 	}
                        // } else {
                        // 	alert("Votre navigateur ne g??re pas l'AJAX cross-domain !");
                        // }

                        // }

                        if(child.tagName!="image" || child.className.baseVal=="mappingImage" )
                        {

                            while (child) {
                                if(child.getAttribute!=undefined){
                                    if(child.getAttribute("href")!="resources/icons/pause.svg"
                                        && child.getAttribute("href")!="resources/icons/rescale.png"
                                        && child.getAttribute("href")!="resources/icons/link.svg"
                                        && child.getAttribute("href")!="resources/icons/exportCoordinates.png"
                                        && child.getAttribute("href")!="resources/icons/importCoordinates.png"
                                        && child.getAttribute("href")!="resources/icons/alignMapping.svg"
                                        && child.getAttribute("href")!="resources/icons/unlink.svg")
                                    {
                                        if(child.className.baseVal=="mappingImage")
                                            // console.log(child.getAttribute("href"));
                                            if (child.nodeType === 1 && child.nodeName != 'SCRIPT'){
                                                tree.push(child);
                                                visit(child);
                                            }
                                        child = child.nextSibling;
                                    }
                                }
                                else
                                {
                                    if (child.nodeType === 1 && child.nodeName != 'SCRIPT'){
                                        visit(child);
                                    }
                                    child = child.nextSibling;
                                }
                            }
                        }
                    }
                    else
                    {
                        while (child) {

                            if (child.nodeType === 1 && child.nodeName != 'SCRIPT'){
                                visit(child);
                            }
                            child = child.nextSibling;
                        }
                    }
                }
            }
        }
        return tree;
    },

    /*******************************************
     * Fix all styles
     * @param {Object} obj Element to export
     * @param {Object} allElmts Element to export
     * @private
     */
    setInlineStyles : function(svg, allElmts) {

        // hardcode computed css styles inside svg
        var allElements = metExploreD3.GraphUtils.traverse(svg);
        allElmts=allElements;
        var i = allElements.length;
        while (i--){
            metExploreD3.GraphUtils.explicitlySetStyle(allElements[i]);
        }
        return allElmts;
    },

    /*******************************************
     * Export networt to DOT format
     */
    saveNetworkDot : function() {
        var myMask = metExploreD3.createLoadMask("Export DOT file...", 'graphPanel');
        if(myMask!= undefined){

            metExploreD3.showMask(myMask);

            metExploreD3.deferFunction(function() {
                var networkJSON ="digraph dotGraph {";
                var links =  _metExploreViz.getSessionById('viz').getD3Data().getLinks();
                var size =links.length;
                var ids = {};
                var id = 0;
                links.forEach(function(link){

                    var source = link.getSource().getId();
                    var target = link.getTarget().getId();
                    if(ids[source]==undefined){
                        ids[source]=i;
                        source=i;
                        i++;
                    }
                    else
                    {
                        source=ids[source];
                    }

                    if(ids[target]==undefined){
                        ids[target]=i;
                        target=i
                        i++;
                    }
                    else
                    {
                        target=ids[target];
                    }

                    if(link.isReversible()=="true"){
                        networkJSON+=source+" -> "+target;
                        networkJSON+=",\n";
                        networkJSON+=target+" -> "+source;
                    }
                    else
                    {
                        networkJSON+=source+" -> "+target;
                    }

                    if(links.indexOf(link)!=size-1)
                        networkJSON+=",\n";
                });

                networkJSON+="}";


                var blob = new Blob([networkJSON], {type: "text"}); // pass a useful mime type here
                var url = URL.createObjectURL(blob);
                var link = document.createElement('a');
                if (typeof link.download === 'string') {
                    link.href = url;

                    var today = new Date();
                    var dd = today.getDate();
                    var mm = today.getMonth()+1; //January is 0!
                    var yyyy = today.getFullYear();

                    if(dd<10) {
                        dd='0'+dd
                    }

                    if(mm<10) {
                        mm='0'+mm
                    }

                    today = mm+'-'+dd+'-'+yyyy;

                    link.download = "MetExploreViz_"+today+".dot";

                    //Firefox requires the link to be in the body
                    document.body.appendChild(link);

                    //simulate click
                    link.click();

                    //remove the link when done
                    document.body.removeChild(link);
                }
                else {
                    window.open(uri);
                }

                metExploreD3.hideMask(myMask);

            }, 100);
        }
    },

    /*******************************************
     * Export networt to GML format
     */
    saveNetworkGml : function() {
        var myMask = metExploreD3.createLoadMask("Export GML file...", 'graphPanel');
        if(myMask!==undefined){

            metExploreD3.showMask(myMask);

            metExploreD3.deferFunction(function() {
                var networkJSON ="graph [";
                networkJSON +="\ndirected 1\n";
                var i = 0;
                //var corresp = {};
                var sideCompounds = {};

                _metExploreViz.getSessionById('viz').getD3Data().getNodes()
                    .filter(function(node){return !node.isHidden();})
                    .forEach(function(node){
                        //corresp[node.getId()] = i;
                        networkJSON+="node [\n";
                        networkJSON+="id "+node.getId()+"\n";
                        if(node.getIsSideCompound()){
                            if(sideCompounds[node.getName()]!==undefined)
                            {
                                sideCompounds[node.getName()]++;
                            }
                            else
                            {
                                sideCompounds[node.getName()]=1;
                            }
                            networkJSON+='label "'+node.getName()+'('+sideCompounds[node.getName()]+')"\n';
                        }
                        else{
                            networkJSON+='label "'+node.getName()+'"\n';
                        }

                        networkJSON+="graphics [\n";
                        networkJSON+="x "+node.x+"\n";
                        networkJSON+="y "+node.y+"\n";
                        networkJSON+="]\n";
                        networkJSON+="]\n";
                        i++;
                    });

                _metExploreViz.getSessionById('viz').getD3Data().getLinks()
                    .filter(function(link){
                        return ((!link.getSource().isHidden()) &&
                            (!link.getTarget().isHidden()));
                    })
                    .forEach(function(link){

                        networkJSON+="edge [\n";
                        //networkJSON+="source "+corresp[link.getSource().getId()]+"\n";
                        networkJSON+="source "+link.getSource().getId()+"\n";
                        networkJSON+="target "+link.getTarget().getId()+"\n";
                        networkJSON+='label "'+
                            link.getSource().getId().replace("-", "")+
                            "-"+
                            link.getTarget().getId().replace("-", "")+
                            '"\n';
                        networkJSON+="]\n";

                        if(link.isReversible()==="true"){
                            networkJSON+="edge [\n";
                            networkJSON+="source "+link.getTarget().getId()+"\n";
                            networkJSON+="target "+link.getSource().getId()+"\n";
                            networkJSON+='label "'+
                                link.getSource().getId().replace("-", "")+
                                "-"+
                                link.getTarget().getId().replace("-", "")+
                                '"\n';
                            networkJSON+="]\n";
                        }
                    });

                networkJSON+="]";

                var blob = new Blob([networkJSON], {type: "text"}); // pass a useful mime type here
                var url = URL.createObjectURL(blob);

                // var url = 'data:text/json;charset=utf8,' + encodeURIComponent(networkJSON);
                var link = document.createElement('a');
                if (typeof link.download === 'string') {
                    link.href = url;

                    var today = new Date();
                    var dd = today.getDate();
                    var mm = today.getMonth()+1; //January is 0!
                    var yyyy = today.getFullYear();

                    if(dd<10) {
                        dd='0'+dd
                    }

                    if(mm<10) {
                        mm='0'+mm
                    }

                    today = mm+'-'+dd+'-'+yyyy;

                    link.download = "MetExploreViz_"+today+".gml";
                    //Firefox requires the link to be in the body
                    document.body.appendChild(link);

                    //simulate click
                    link.click();

                    //remove the link when done
                    document.body.removeChild(link);
                }
                else {
                    window.open(uri);
                }
                metExploreD3.hideMask(myMask);

            }, 100);
        }
    },

    /*****************************************************
     * Retrieve all necessary data to load saved visualization
     */
    saveNetworkJSON : function() {
        var myMask = metExploreD3.createLoadMask("Saving...", 'graphPanel');
        if(myMask!= undefined){

            metExploreD3.showMask(myMask);

            metExploreD3.deferFunction(function() {


                var networkJSON ="{";
                networkJSON+="\n\"versionMetExploreViz\":"+JSON.stringify(Ext.manifest.version);
                networkJSON+=",\n\"linkStyle\":"+JSON.stringify(metExploreD3.getLinkStyle());
                networkJSON+=",\n\"reactionStyle\":"+JSON.stringify(metExploreD3.getReactionStyle());
                networkJSON+=",\n\"biosource\":"+JSON.stringify(_metExploreViz.getBiosource());
                networkJSON+=",\n\"generalStyle\":"+JSON.stringify(metExploreD3.getGeneralStyle());
                networkJSON+=",\n\"metaboliteStyle\":"+JSON.stringify(metExploreD3.getMetaboliteStyle());
                networkJSON+=",\n\"comparedPanels\":"+JSON.stringify(_metExploreViz.comparedPanels);
                networkJSON+=",\n\"linkedByTypeOfMetabolite\":"+JSON.stringify(_metExploreViz.linkedByTypeOfMetabolite);
                networkJSON+=",\n\"mappings\":"+JSON.stringify(_metExploreViz.mappings);

                networkJSON+=",\n\"sessions\":{";

                var sessions = _metExploreViz.getSessionsSet();
                var nbSession=0;
                for (var key in sessions) {

                    sessions[key].getD3Data().initNodeIndex();


                    // networkJSON+=JSON.stringify(_metExploreViz.getSessionById(key));

                    networkJSON+="\n"+JSON.stringify(key)+":{\n\"id\":\"" + _metExploreViz.getSessionById(key).getId() + "\",";
                    networkJSON+="\n\"animated\": false ,";

                    var allDrawnCycles = metExploreD3.GraphStyleEdition.allDrawnCycles;
                    if (Array.isArray(allDrawnCycles) && allDrawnCycles.length) {
                        networkJSON += "\n\"drawnCycles\":" + JSON.stringify(metExploreD3.GraphStyleEdition.allDrawnCycles) + ",";
                    }

                    networkJSON+="\n\"d3Data\":{\"id\":"+JSON.stringify(key)+"," ;
                    networkJSON+="\"pathways\":[" ;

                    /**************
                     * Saving pathways
                     */
                    _metExploreViz.getSessionById(key).getD3Data().getPathways().forEach(function(pathway){

                        networkJSON+="{\"name\":"+JSON.stringify(pathway.getName());

                        if(pathway.getIdentifier()!=undefined){
                            networkJSON+=","+"\"identifier\":"+JSON.stringify(pathway.getIdentifier());
                        }

                        if(pathway.getId()!=undefined){
                            networkJSON+=","+"\"id\":"+JSON.stringify(pathway.getId());
                        }

                        if(pathway.getColor()!=undefined){
                            networkJSON+=","+"\"color\":"+JSON.stringify(pathway.getColor());
                        }

                        if(pathway.hidden()!=undefined){
                            networkJSON+=","+"\"hidden\":"+JSON.stringify(pathway.hidden());
                        }

                        if(pathway.isCollapsed()!=undefined){
                            networkJSON+=","+"\"collapsed\":"+JSON.stringify(pathway.isCollapsed());
                        }
                        networkJSON+="}";
                        var index = _metExploreViz.getSessionById(key).getD3Data().getPathways().indexOf(pathway);
                        if(index != _metExploreViz.getSessionById(key).getD3Data().getPathways().length-1)
                            networkJSON+=",";
                    });

                    networkJSON+="],";

                    networkJSON+="\"nodes\":[" ;

                    /**************
                     * Saving nodes
                     */
                    _metExploreViz.getSessionById(key).getD3Data().getNodes().forEach(function(node){

                        networkJSON+="{\"name\":"+JSON.stringify(node.getName());

                        if(node.getLabel()!=undefined){
                            networkJSON+=","+"\"label\":"+JSON.stringify(node.getLabel());
                        }

                        if(node.getAlias()!=undefined){
                            networkJSON+=","+"\"alias\":"+JSON.stringify(node.getAlias());
                        }

                        if(node.getCompartment()!=undefined){
                            networkJSON+=","+"\"compartment\":"+JSON.stringify(node.getCompartment());
                        }

                        if(node.getPathways()!=undefined){
                            networkJSON+=","+"\"pathways\":"+JSON.stringify(node.getPathways());
                        }

                        networkJSON+=","+"\"dbIdentifier\":"+JSON.stringify(node.getDbIdentifier());

                        if(node.getIdentifier()!=undefined){
                            networkJSON+=","+"\"identifier\":"+JSON.stringify(node.getIdentifier());
                        }

                        if(node.getEC()!=undefined){
                            networkJSON+=","+"\"ec\":"+JSON.stringify(node.getEC());
                        }

                        networkJSON+=","+"\"id\":"+JSON.stringify(node.getId());

                        if(node.getIdentifier()!=undefined){
                            networkJSON+=","+"\"identifier\":"+JSON.stringify(node.getIdentifier());
                        }

                        if(node.getReactionReversibility()!=undefined){
                            networkJSON+=","+"\"reactionReversibility\":"+JSON.stringify(node.getReactionReversibility());
                        }

                        if(node.getIsSideCompound()!=undefined){
                            networkJSON+=","+"\"isSideCompound\":"+JSON.stringify(node.getIsSideCompound());
                        }

                        networkJSON+=","+"\"biologicalType\":"+JSON.stringify(node.getBiologicalType());

                        networkJSON+=","+"\"selected\":"+JSON.stringify(node.isSelected());
                        networkJSON+=","+"\"locked\":"+JSON.stringify(node.isLocked());

                        if(node.isDuplicated()!=undefined)
                            networkJSON+=","+"\"duplicated\":"+JSON.stringify(node.isDuplicated());
                        else
                            networkJSON+=","+"\"duplicated\":false";

                        if(node.isHidden()!=undefined)
                            networkJSON+=","+"\"hidden\":"+JSON.stringify(node.isHidden());
                        else
                            networkJSON+=","+"\"hidden\":false";

                        networkJSON+=","+"\"labelVisible\":"+JSON.stringify(node.getLabelVisible());

                        if(node.getSvg()!=undefined){
                            networkJSON+=","+"\"svg\":"+JSON.stringify(node.getSvg());
                            networkJSON+=","+"\"svgWidth\":"+JSON.stringify(node.getSvgWidth());
                            networkJSON+=","+"\"svgHeight\":"+JSON.stringify(node.getSvgHeight());
                        }

                        var labelStyle = JSON.stringify(metExploreD3.GraphStyleEdition.createLabelStyleObject(node, key));
                        if(labelStyle !== undefined)
                            networkJSON+=","+"\"labelFont\":"+labelStyle ;

                        var imagePosition = metExploreD3.GraphStyleEdition.createImageStyleObject(node, key);
                        if (imagePosition !== undefined) {
                            networkJSON += ","+"\"imagePosition\":" + JSON.stringify(imagePosition);
                        }

                        if(node.x!=undefined) networkJSON+=","+"\"x\":"+JSON.stringify(node.x);
                        if(node.y!=undefined) networkJSON+=","+"\"y\":"+JSON.stringify(node.y);
                        if(node.px!=undefined) networkJSON+=","+"\"px\":"+JSON.stringify(node.px);
                        if(node.py!=undefined) networkJSON+=","+"\"py\":"+JSON.stringify(node.py);
                        networkJSON+="}";
                        var index = _metExploreViz.getSessionById(key).getD3Data().getNodes().indexOf(node);
                        if(index != _metExploreViz.getSessionById(key).getD3Data().getNodes().length-1)
                            networkJSON+=",";
                    });

                    networkJSON+="],";


                    /**************
                     * Saving links
                     */
                    networkJSON+="\"links\":[" ;
                    var linksToSave = _metExploreViz.getSessionById(key).getD3Data().getLinks()

                    linksToSave.forEach(function(link){
                        networkJSON+="{\"id\":"+JSON.stringify(link.getId())+",";
                        networkJSON+="\"source\":"+JSON.stringify(link.getSource().index)+",";
                        networkJSON+="\"target\":"+JSON.stringify(link.getTarget().index)+",";
                        networkJSON+="\"interaction\":"+JSON.stringify(link.getInteraction())+",";
                        networkJSON+="\"reversible\":"+JSON.stringify(link.isReversible());
                        networkJSON+="}";
                        var index = linksToSave.indexOf(link);
                        if(index != linksToSave.length-1)
                            networkJSON+=",";
                    });
                    networkJSON+="]},";

                    networkJSON+="\n\"linked\":" + JSON.stringify(_metExploreViz.getSessionById(key).isLinked()) + ",";
                    networkJSON+="\n\"active\":" + JSON.stringify(_metExploreViz.getSessionById(key).isActive()) + ",";

                    networkJSON+="\n\"duplicatedNodes\":" + JSON.stringify(_metExploreViz.getSessionById(key).getDuplicatedNodes()) + ",";

                    networkJSON+="\n\"selectedNodes\":" + JSON.stringify(_metExploreViz.getSessionById(key).getSelectedNodes()) + ",";
                    // networkJSON+="\n\"metabolites\":" + _metExploreViz.getSessionById(key).isAnimated() + ",";
                    // networkJSON+="\n\"reactions\":" + _metExploreViz.getSessionById(key).isAnimated() + ",";
                    networkJSON+="\n\"resizable\":" + _metExploreViz.getSessionById(key).isResizable();

                    networkJSON+="}";
                    if(nbSession < Object.keys(sessions).length-1)
                        networkJSON+=",";
                    nbSession++;
                }

                networkJSON+="}}";

                // console.log(networkJSON);
                // console.log(JSON.parse(networkJSON));
                var blob = new Blob([networkJSON], {type: "text/json"}); // pass a useful mime type here
                var url = URL.createObjectURL(blob);
                // var url = 'data:text/json;charset=utf8,' + encodeURIComponent(networkJSON);
                var link = document.createElement('a');
                if (typeof link.download === 'string') {
                    link.href = url;


                    var today = new Date();
                    var dd = today.getDate();
                    var mm = today.getMonth()+1; //January is 0!
                    var yyyy = today.getFullYear();

                    if(dd<10) {
                        dd='0'+dd
                    }

                    if(mm<10) {
                        mm='0'+mm
                    }

                    today = mm+'-'+dd+'-'+yyyy;

                    link.download = "MetExploreViz_"+today+".json";

                    //Firefox requires the link to be in the body
                    document.body.appendChild(link);

                    //simulate click
                    link.click();

                    //remove the link when done
                    document.body.removeChild(link);
                }
                else {
                    window.open(uri);
                }
                metExploreD3.hideMask(myMask);

            }, 100);
        }
    },

    /*****************************************************
     * Save nodes coordinates
     */
    saveNetworkCoordinates : function() {
        var myMask = metExploreD3.createLoadMask("Saving...", 'graphPanel');
        if(myMask!= undefined){

            metExploreD3.showMask(myMask);

            metExploreD3.deferFunction(function() {


                var networkJSON ="{";
                var session = _metExploreViz.getSessionById('viz');
                session.getD3Data().initNodeIndex();


                networkJSON+="\"nodes\":[" ;

                /**************
                 * Saving nodes
                 */
                session.getD3Data().getNodes()
                    .filter(function (node) {
                        return !node.getIsSideCompound();
                    })
                    .forEach(function(node, index){
                            networkJSON+="{";
                            if(node.dbIdentifier!==undefined) networkJSON+="\"dbIdentifier\":"+JSON.stringify(node.getDbIdentifier())+",";
                            if(node.x!==undefined) networkJSON+="\"x\":"+JSON.stringify(node.x)+",";
                            if(node.y!==undefined) networkJSON+="\"y\":"+JSON.stringify(node.y)+",";
                            if(node.px!==undefined) networkJSON+="\"px\":"+JSON.stringify(node.px)+",";
                            if(node.py!==undefined) networkJSON+="\"py\":"+JSON.stringify(node.py);
                            networkJSON+="}";

                            if(index !== session.getD3Data().getNodes().length-1)
                                networkJSON+=",";
                        }
                    );

                networkJSON+="]}";

                // console.log(networkJSON);
                // console.log(JSON.parse(networkJSON));
                var blob = new Blob([networkJSON], {type: "text/json"}); // pass a useful mime type here
                var url = URL.createObjectURL(blob);
                // var url = 'data:text/json;charset=utf8,' + encodeURIComponent(networkJSON);
                var link = document.createElement('a');
                if (typeof link.download === 'string') {
                    link.href = url;


                    var today = new Date();
                    var dd = today.getDate();
                    var mm = today.getMonth()+1; //January is 0!
                    var yyyy = today.getFullYear();

                    if(dd<10) {
                        dd='0'+dd
                    }

                    if(mm<10) {
                        mm='0'+mm
                    }

                    today = mm+'-'+dd+'-'+yyyy;

                    link.download = "MetExploreVizCoordinates_"+today+".json";

                    //Firefox requires the link to be in the body
                    document.body.appendChild(link);

                    //simulate click
                    link.click();

                    //remove the link when done
                    document.body.removeChild(link);
                }
                else {
                    window.open(uri);
                }
                metExploreD3.hideMask(myMask);

            }, 100);
        }
    },

    /*****************************************************
     * Save nodes coordinates
     * @param {Object} scaleRange Styles applied
     * @param {Boolean} all Boolean to know if it save all styles or only one
     */
    saveStyles : function(scaleRange, all) {
        var myMask = metExploreD3.createLoadMask("Saving...", 'graphPanel');
        if(myMask!= undefined){

            metExploreD3.showMask(myMask);

            metExploreD3.deferFunction(function() {

                var scaleRangeString = JSON.stringify(scaleRange);

                var blob = new Blob([scaleRangeString], {type: "text/json"}); // pass a useful mime type here
                var url = URL.createObjectURL(blob);

                var link = document.createElement('a');
                if (typeof link.download === 'string') {
                    link.href = url;

                    var today = new Date();
                    var dd = today.getDate();
                    var mm = today.getMonth()+1; //January is 0!
                    var yyyy = today.getFullYear();

                    if(dd<10) {
                        dd='0'+dd
                    }

                    if(mm<10) {
                        mm='0'+mm
                    }

                    today = mm+'-'+dd+'-'+yyyy;

                    if(all)
                        link.download = "MetExploreVizAllScales_"+today+".json";
                    else link.download = "MetExploreVizStyleScale_"+today+".json";


                    //Firefox requires the link to be in the body
                    document.body.appendChild(link);

                    //simulate click
                    link.click();

                    //remove the link when done
                    document.body.removeChild(link);
                }
                else {
                    window.open(uri);
                }
                metExploreD3.hideMask(myMask);

            }, 100);
        }
    },

    /*****************************************************
     * Save cycles
     */
    saveCyclesList : function () {
        var allDrawnCycles = metExploreD3.GraphStyleEdition.allDrawnCycles;
        if ( metExploreD3.GraphStyleEdition.allDrawnCycles.length) {
            var myMask = metExploreD3.createLoadMask("Saving...", 'graphPanel');
            if (myMask != undefined) {

                metExploreD3.showMask(myMask);

                metExploreD3.deferFunction(function () {


                    var cycleList = "";
                    for (var i = 0; i < allDrawnCycles.length; i++) {
                        for (var j = 0; j < allDrawnCycles[i].length; j++) {
                            cycleList += allDrawnCycles[i][j];
                            if (j !== allDrawnCycles[i].length - 1) {
                                cycleList += ",";
                            }
                            else {
                                cycleList += "\n";
                            }
                        }
                    }

                    var blob = new Blob([cycleList], {type: "text"}); // pass a useful mime type here
                    var url = URL.createObjectURL(blob);
                    // var url = 'data:text/json;charset=utf8,' + encodeURIComponent(networkJSON);
                    var link = document.createElement('a');
                    if (typeof link.download === 'string') {
                        link.href = url;


                        var today = new Date();
                        var dd = today.getDate();
                        var mm = today.getMonth() + 1; //January is 0!
                        var yyyy = today.getFullYear();

                        if (dd < 10) {
                            dd = '0' + dd
                        }

                        if (mm < 10) {
                            mm = '0' + mm
                        }

                        today = mm + '-' + dd + '-' + yyyy;

                        link.download = "MetExploreVizCycles_" + today + ".txt";

                        //Firefox requires the link to be in the body
                        document.body.appendChild(link);

                        //simulate click
                        link.click();

                        //remove the link when done
                        document.body.removeChild(link);
                    }
                    else {
                        window.open(uri);
                    }
                    metExploreD3.hideMask(myMask);
                    console.log(cycleList);

                }, 100);
            }
        }
        else {
            metExploreD3.displayWarning('No cycles found', 'There is not any cycles to export');
        }
    }
};

String.prototype.isEmpty = function() {
    return (!this.trim());
};
