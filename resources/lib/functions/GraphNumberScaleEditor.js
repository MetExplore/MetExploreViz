/**
 * @author Maxime Chazalviel
 * (a)description : Style Edition
 */

metExploreD3.GraphNumberScaleEditor = {

    svg: undefined,
    width: undefined,
    height: undefined,
    data: undefined,
    numberRange: undefined,
    numberPercent: undefined,
    numberDomain: undefined,
    number: undefined,
    x: undefined,
    y: undefined,
    scaleXInPercent: undefined,
    scalePercentInX: undefined,
    button: undefined,
    numberMin: undefined,
    numberMax: undefined,
    selectedValue:"",

    numberRangeInit: undefined,
    numberPercentInit: undefined,
    numberDomainInit: undefined,
    numberMinInit: undefined,
    numberMaxInit: undefined,

    createNumberScaleCaption : function(svg, width, height, margin, data){
        var height=height;
        var width=width;

        var x = d3.scaleLinear()
            .domain(d3.extent(data, function (d){ return  d.value;}))
            .range([0, width]);

        var y = d3.scaleLinear()
            .domain([0, d3.max(data, function (d){ return  d.size;})]).nice()
            .range([ height, 0]);

        var xVal = d3.scaleLinear()
            .domain([0, width])
            .range(d3.extent(data, function (d){ return  d.value;}));

        var yVal = d3.scaleLinear()
            .domain([height, 0]).nice()
            .range([0, d3.max(data, function (d){ return  d.size;})]);

        var area = d3.area()
            .curve(d3.curveLinear)
            .x(function (d){ return x(d.value)})
            .y0(y(0))
            .y1(function (d){ return y(d.size)});

        svg.select("#groupId").remove();
        var group= svg.append("g")
            .attr("id", "groupId")
            .attr("transform", "translate(30, 30)");

        // Area drawing
        group.append("path")
            .datum(data)
            .attr("id", "idArea")
            .attr("fill", "rgb(95, 130, 163)")
            .attr("d", area);

        // diagram rect border drawing
        group.append("rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", width)
            .attr("height", height)
            .style("stroke", "#000000")
            .style("fill-opacity", 0)
            .style("stroke-width", 2);

        group.append("text")
            .attr("x", 7)
            .attr("y", -10)
            .text("Min");

        group.append("text")
            .attr("x", width-35)
            .attr("y", -10)
            .text("Max");
    },

    createNumberScaleEditor : function(svg, width, height, but){
        var me = this;
        me.svg = svg;
        me.button=but;
        me.height=height;
        me.width=width;

        me.data = [
            {id:"begin", value:0, size:1},
            {id:1, value:10, size:1},
            {id:2, value:30, size:2},
            {id:3, value:90, size:10},
            {id:"end", value:100, size:10}
            ];

        console.log("init");
        me.x = d3.scaleLinear()
            .domain(d3.extent(me.data, function (d){ return  d.value;}))
            .range([0, me.width]);

        me.y = d3.scaleLinear()
            .domain([0, d3.max(me.data, function (d){ return  d.size;})]).nice()
            .range([me.height, 0]);

        var xVal = d3.scaleLinear()
            .domain([0, me.width])
            .range(d3.extent(me.data, function (d){ return  d.value;}));

        var yVal = d3.scaleLinear()
            .domain([me.height, 0]).nice()
            .range([0, d3.max(me.data, function (d){ return  d.size;})]);

        var area = d3.area()
            .curve(d3.curveLinear)
            .x(function (d){ return me.x(d.value)})
            .y0(me.y(0))
            .y1(function (d){ return me.y(d.size)});

        svg.select("#groupId").remove();
        var group= svg.append("g")
            .attr("id", "groupId")
            .attr("transform", "translate(70, 25)");

        // Area drawing
        group.append("path")
            .datum(me.data)
            .attr("id", "idArea")
            .attr("fill", "rgb(95, 130, 163)")
            .attr("d", area);

        // Y axis drawing
        var yAxis = group.append("svg:g")
            .attr("id", "xAxis");


        yAxis.append("defs").append("marker")
            .attr("id", "arrowhead")
            .attr("markerWidth", "6")
            .attr("markerHeight", "10")
            .attr("refX", 0)
            .attr("refY", 2)
            .attr("orient", "auto")
            .append("polygon")
            .attr("points", "0 0, 5 2, 0 4");

        yAxis.append("line")
            .attr("x1", -20)
            .attr("y1", me.height + 3)
            .attr("x2", -20)
            .attr("y2", 10)
            .attr("stroke", "#000")
            .attr("stroke-width", 4)
            .attr("marker-end", "url(#arrowhead)");

        var nameyAxis = "stroke width";
        yAxis.append("svg:text")
            .html(nameyAxis)
            .style("font-size",10)
            .attr("dy", ".4em")
            .style("font-weight", 'bold')
            .style("pointer-events", 'none')
            .style("text-anchor", 'middle')
            .attr("id", "size")
            .attr("x", -55)
            .attr("y", -40)
            .attr("transform", "rotate(-90)");

        // X axis drawing
        var xAxis = group.append("svg:g")
            .attr("id", "yAxis");

        xAxis.append("defs").append("marker")
            .attr("id", "arrowhead")
            .attr("markerWidth", "6")
            .attr("markerHeight", "10")
            .attr("refX", 0)
            .attr("refY", 2)
            .attr("orient", "auto")
            .append("polygon")
            .attr("points", "0 0, 5 2, 0 4");

        xAxis.append("line")
            .attr("x1", -2)
            .attr("y1", me.height+20)
            .attr("x2", me.width-20)
            .attr("y2", me.height+20)
            .attr("stroke", "#000")
            .attr("stroke-width", 4)
            .attr("marker-end", "url(#arrowhead)");

        // diagram rect border drawing
        group.append("rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", me.width)
            .attr("height", me.height)
            .style("stroke", "#000000")
            .style("fill-opacity", 0)
            .style("stroke-width", 4);

        // Dragable nodes drawing
        var groupVal = group.selectAll("g#node")
            .data(me.data)
            .enter()
            .append("svg:g")
            .attr("id", "groupVal");

        var nodes = groupVal.append("svg:g")
            .attr("id", "node");

        var dragNodeHandler = d3.drag()
            .on("start", function () {
                var current = d3.select(this);
                var text = d3.select(this.parentNode).select("text");

                me.deltaY = current.attr("cy") - d3.event.y;
                me.deltaYText = text.attr("y") - d3.event.y;
            })
            .on("drag", function (node) {
                var current = d3.select(this);
                var text = d3.select(this.parentNode).select("text");
                if(d3.event.y + me.deltaY>0 && d3.event.y + me.deltaY<me.height){

                    me.updateSizeNumber(node.id, yVal(d3.event.y + me.deltaY));

                    me.updateYOfSizeNode(node, d3.event.y);
                }

            });

        nodes.append("circle")
            .attr("fill", "white")
            .attr("stroke", "#144778")
            .attr("stroke-width", "5px")
            .attr("r", "5px")
            .attr("cx", function (d){ return me.x(d.value)})
            .attr("cy", function (d){ return me.y(d.size)})
            .on("mouseenter", function () {
                d3.select(this.parentNode).selectAll("path").classed("hide", false);
            })
            .on("mouseleave", function () {
                d3.select(this.parentNode).selectAll("path").classed("hide", true);
            })
            .call(dragNodeHandler);


        nodes
            .append("path")
            .attr("width", "50px")
            .attr("height", "50px")
            .style("paint-order","stroke")
            .style("stroke-width", 4)
            .style("fill", "none")
            .style("stroke", "white")
            .style("stroke-opacity", "0.8")
            .attr("dy", ".4em")
            .classed("down", true)
            .classed("hide", true)
            .style("font-weight", 'bold')
            .style("pointer-events", 'none')
            .attr("d", function (d){
                var x = me.x(d.value);
                var y = me.y(d.size);
                var points ="M"+(x-8)+","+(y+10)+" L"+(x)+","+(y+13)+" L"+(x+8)+","+(y+10);
                return points;
            });

        nodes
            .append("path")
            .attr("width", "50px")
            .attr("height", "50px")
            .style("paint-order","stroke")
            .style("stroke-width", 2)
            .style("fill", "none")
            .style("stroke", "#000000")
            .style("stroke-opacity", "0.8")
            .attr("dy", ".4em")
            .style("font-weight", 'bold')
            .style("pointer-events", 'none')
            .classed("down", true)
            .classed("hide", true)
            .attr("d", function (d){
                var x = me.x(d.value);
                var y = me.y(d.size);
                var points ="M"+(x-8)+","+(y+10)+" L"+(x)+","+(y+13)+" L"+(x+8)+","+(y+10);
                return points;
            });

        nodes
            .append("path")
            .attr("width", "50px")
            .attr("height", "50px")
            .style("paint-order","stroke")
            .style("stroke-width", 4)
            .style("fill", "none")
            .style("stroke", "white")
            .style("stroke-opacity", "0.8")
            .attr("dy", ".4em")
            .style("font-weight", 'bold')
            .style("pointer-events", 'none')
            .classed("up", true)
            .classed("hide", true)
            .attr("d", function (d){
                var x = me.x(d.value);
                var y = me.y(d.size);
                var points ="M"+(x-8)+","+(y-10)+" L"+(x)+","+(y-13)+" L"+(x+8)+","+(y-10);
                return points;
            });

        nodes
            .append("path")
            .attr("width", "50px")
            .attr("height", "50px")
            .style("paint-order","stroke")
            .style("stroke-width", 2)
            .style("fill", "none")
            .style("stroke", "#000000")
            .style("stroke-opacity", "0.8")
            .attr("dy", ".4em")
            .style("font-weight", 'bold')
            .style("pointer-events", 'none')
            .classed("up", true)
            .classed("hide", true)
            .attr("d", function (d){
                var x = me.x(d.value);
                var y = me.y(d.size);
                var points ="M"+(x-8)+","+(y-10)+" L"+(x)+","+(y-13)+" L"+(x+8)+","+(y-10);
                return points;
            });

        nodes.append("svg:text")
            .html(function(d){ return d.size; })
            .style("font-size",15)
            .style("paint-order","stroke")
            .style("stroke-width", 3)
            .style("stroke", "white")
            .style("stroke-opacity", "0.8")
            .attr("dy", ".4em")
            .style("font-weight", 'bold')
            .style("pointer-events", 'none')
            .style("text-anchor", 'middle')
            .attr("id", "size")
            .attr("x", function (d){ return me.x(d.value)})
            .attr("y", function (d){ return me.y(d.size)-15});


        var dragValueHandler = d3.drag()
            .on("start", function () {
                var current = d3.select(this);
                var text = d3.select(this.parentNode).select("text");

                // me.button.value=metExploreD3.GraphUtils.RGBString2Color(me.color(iCol));
                // me.selectedValue=iCol;
                // // if(scalePercentInX(current.attr("x")-d3.event.x)>0 && scalePercentInX(current.attr("x")-d3.event.x)<100)
                me.deltaX = current.attr("cx") - d3.event.x;
                me.deltaXText = text.attr("x") - d3.event.x;
                //
                // indexVal = me.colorPercent.findIndex(function(pc){
                //     return metExploreD3.GraphColorScaleEditor.round(parseFloat(pc))===metExploreD3.GraphColorScaleEditor.round(parseFloat(theLinearGradient.attr("offset").replace("%","")))
                // });
            })
            .on("drag", function (node) {
                var indexVal = me.data.findIndex(function(pc){
                    return pc.id === node.id;
                });

                if(me.x(me.data[indexVal-1].value) < d3.event.x+me.deltaX && d3.event.x + me.deltaX < me.x(me.data[indexVal+1].value)){
                    // me.updateColorPercent(indexVal, theLinearGradient, me.deltaX);
                    me.updateValueNumber(node.id, xVal(d3.event.x + me.deltaX));

                    me.updateXOfValueNode(node, d3.event.x);
                }
            });

        var valueNode = groupVal
            .filter(function(node){
                var indexVal = me.data.findIndex(function(pc){
                    return pc.id === node.id;
                });

                return indexVal>1 && indexVal<me.data.length-2;
            })
            .append("svg:g")
            .attr("id", "valueNode");

        valueNode.append("circle")
            .attr("fill", "white")
            .attr("stroke", "#144778")
            .attr("stroke-width", "3px")
            .attr("r", "4px")
            .attr("cx", function (d){ return me.x(d.value)})
            .attr("cy", "105px")
            .on("mouseenter", function () {
                d3.select(this.parentNode).selectAll("path").classed("hide", false);
            })
            .on("mouseleave", function () {
                d3.select(this.parentNode).selectAll("path").classed("hide", true);
            })
            .call(dragValueHandler);

        valueNode
            .append("path")
            .attr("width", "50px")
            .attr("height", "50px")
            .style("paint-order","stroke")
            .style("stroke-width", 4)
            .style("fill", "none")
            .style("stroke", "white")
            .style("stroke-opacity", "0.8")
            .attr("dy", ".4em")
            .classed("left", true)
            .classed("hide", true)
            .style("font-weight", 'bold')
            .style("pointer-events", 'none')
            .attr("d", function (d){
                var x = me.x(d.value);
                var y = 105;
                var points ="M"+(x-6)+","+(y-5)+" L"+(x-10)+","+(y)+" L"+(x-6)+","+(y+5);
                return points;
            });

        valueNode
            .append("path")
            .attr("width", "50px")
            .attr("height", "50px")
            .style("paint-order","stroke")
            .style("stroke-width", 2)
            .style("fill", "none")
            .style("stroke", "#000000")
            .style("stroke-opacity", "0.8")
            .attr("dy", ".4em")
            .style("font-weight", 'bold')
            .style("pointer-events", 'none')
            .classed("left", true)
            .classed("hide", true)
            .attr("d", function (d){
                var x = me.x(d.value);
                var y = 105;
                var points ="M"+(x-6)+","+(y-5)+" L"+(x-10)+","+(y)+" L"+(x-6)+","+(y+5);
                return points;
            });

        valueNode
            .append("path")
            .attr("width", "50px")
            .attr("height", "50px")
            .style("paint-order","stroke")
            .style("stroke-width", 4)
            .style("fill", "none")
            .style("stroke", "white")
            .style("stroke-opacity", "0.8")
            .attr("dy", ".4em")
            .style("font-weight", 'bold')
            .style("pointer-events", 'none')
            .classed("right", true)
            .classed("hide", true)
            .attr("d", function (d){
                var x = me.x(d.value);
                var y = 105;
                var points ="M"+(x+6)+","+(y-5)+" L"+(x+10)+","+(y)+" L"+(x+6)+","+(y+5);
                return points;
            });

        valueNode
            .append("path")
            .attr("width", "50px")
            .attr("height", "50px")
            .style("paint-order","stroke")
            .style("stroke-width", 2)
            .style("fill", "none")
            .style("stroke", "#000000")
            .style("stroke-opacity", "0.8")
            .attr("dy", ".4em")
            .style("font-weight", 'bold')
            .style("pointer-events", 'none')
            .classed("right", true)
            .classed("hide", true)
            .attr("d", function (d){
                var x = me.x(d.value);
                var y = 105;
                var points ="M"+(x+6)+","+(y-5)+" L"+(x+10)+","+(y)+" L"+(x+6)+","+(y+5);
                return points;
            });

        valueNode.append("svg:text")
            .html(function(d){ return d.value; })
            .style("font-size",15)
            .style("paint-order","stroke")
            .style("stroke-width", 3)
            .style("stroke", "white")
            .style("stroke-opacity", "0.8")
            .attr("dy", ".4em")
            .style("font-weight", 'bold')
            .style("pointer-events", 'none')
            .style("text-anchor", 'middle')
            .attr("id", "size")
            .attr("x", function (d){ return me.x(d.value)+15})
            .attr("y", function (d){
                if(me.data.indexOf(d)%2 === 0)
                    return 105+10;
                else
                    return 105-10;
            });
    },

    reset : function(){
        var me = this;
        me.numberRange = me.numberRangeInit.slice(0);
        me.numberPercent = me.numberPercentInit.slice(0);
        me.numberDomain = me.numberDomainInit.slice(0);

        me.numberMin = me.numberMinInit.slice(0);
        me.numberMax = me.numberMaxInit.slice(0);
        me.number.range(me.numberRange).domain(me.numberDomain);

        metExploreD3.GraphNumberScaleEditor.update();
    },
    updateNumberPercent : function(indexVal,theLinearGradient, deltaX){
        this.numberPercent.splice(indexVal, 1, metExploreD3.GraphNumberScaleEditor.round(this.scaleXInPercent(d3.event.x+me.deltaX)));
        theLinearGradient
            .attr("offset", metExploreD3.GraphNumberScaleEditor.round(this.scaleXInPercent(d3.event.x+me.deltaX))+"%");
    },
    updateSizeNumber : function(id, size){
        var me = this;
        var node = me.data.find(function (n) {
            return n.id === id;
        });

        node.size = size;
        me.updateArea();
    },
    updateValueNumber : function(id, value){
        var me = this;
        var node = me.data.find(function (n) {
            return n.id === id;
        });

        node.value = value;
        me.updateArea();
        me.updateXOfSizeNode(id, me.x(value));
    },
    round : function(operation){
        return Math.round((operation) * 100) / 100;
    },
    addNumber : function(svg){
        var me = this;
        console.log("add")

        createNumberScaleEditor
        me.numberPercent.push(70);
        me.numberPercent.sort(function(a, b) {
            return a - b;
        });

        var i = me.numberPercent.findIndex(function(n){return n===70});
        me.numberRange.splice(i, 0, "#FFFF00");

        me.numberDomain.push(me.numberDomain.length+1);

        me.number.range(me.numberRange).domain(me.numberDomain);

        metExploreD3.GraphNumberScaleEditor.update();
    },
    delNumber : function(){
        var me = this;
        console.log("del");

        me.numberRange.splice(me.selectedValue-1, 1);
        me.numberPercent.splice(me.selectedValue-1, 1);
        me.numberDomain = me.numberDomain.pop();

        me.number.range(me.numberRange).domain(me.numberDomain);

        metExploreD3.GraphNumberScaleEditor.update();
    },
    updateArea : function(){
        var me = this;
        var dArea = d3.area()
            .curve(d3.curveLinear)
            .x(function (d){ return me.x(d.value)})
            .y0(me.y(0))
            .y1(function (d){ return me.y(d.size)});;

        me.svg.select("#idArea")
            .attr("d", dArea);
    },
    updateXOfSizeNode : function(id, x){
        var me = this;

        var theCircle = me.svg.selectAll("g#node>circle")
            .filter(function (n) {
               return n.id===id;
            })
            .attr("cx", x);

        var theCircleX = parseInt(theCircle.attr("cx"));
        var theCircleY = parseInt(theCircle.attr("cy"));

        me.svg.selectAll("g#node>text")
            .filter(function (n) {
                return n.id===id;
            })
            .attr("x", x);

        var dUp ="M"+(theCircleX-8)+","+(theCircleY-10)+" L"+(theCircleX)+","+(theCircleY-13)+" L"+(theCircleX+8)+","+(theCircleY-10);
        me.svg.selectAll("g#node>path.up")
            .filter(function (n) {
                return n.id===id;
            })
            .attr("d",dUp);

        var dDown ="M"+(theCircleX-8)+","+(theCircleY+10)+" L"+(theCircleX)+","+(theCircleY+13)+" L"+(theCircleX+8)+","+(theCircleY+10);
        me.svg.selectAll("g#node>path.down")
            .filter(function (n) {
                return n.id===id;
            })
            .attr("d",dDown);
    },
    updateXOfValueNode : function(node, x){
        var me = this;

        var theCircle = me.svg.selectAll("g#valueNode>circle")
            .filter(function (n) {
               return n.id===node.id;
            })
            .attr("cx", x + me.deltaX);

        var theCircleX = parseInt(theCircle.attr("cx"));
        var theCircleY = parseInt(theCircle.attr("cy"));

        me.svg.selectAll("g#valueNode>text")
            .filter(function (n) {
                return n.id===node.id;
            })
            .attr("x", x + me.deltaXText);


        var dLeft ="M"+(theCircleX-6)+","+(theCircleY-5)+" L"+(theCircleX-10)+","+(theCircleY)+" L"+(theCircleX-6)+","+(theCircleY+5);
        me.svg.selectAll("g#valueNode>path.left")
            .filter(function (n) {
                return n.id===node.id;
            })
            .attr("d",dLeft);

        var dRight ="M"+(theCircleX+6)+","+(theCircleY-5)+" L"+(theCircleX+10)+","+(theCircleY)+" L"+(theCircleX+6)+","+(theCircleY+5);
        me.svg.selectAll("g#valueNode>path.right")
            .filter(function (n) {
                return n.id===node.id;
            })
            .attr("d",dRight);
    },

    updateYOfSizeNode : function(node, y){
        var me = this;

        var theCircle = me.svg.selectAll("g#node>circle")
            .filter(function (n) {
               return n.id===node.id;
            })
            .attr("cy",y + me.deltaY );

        var theCircleX = parseInt(theCircle.attr("cx"));
        var theCircleY = parseInt(theCircle.attr("cy"));

        me.svg.selectAll("g#node>text")
            .filter(function (n) {
                return n.id===node.id;
            })
            .attr("y", y + me.deltaYText);

        var dUp ="M"+(theCircleX-8)+","+(theCircleY-10)+" L"+(theCircleX)+","+(theCircleY-13)+" L"+(theCircleX+8)+","+(theCircleY-10);
        me.svg.selectAll("g#node>path.up")
            .filter(function (n) {
                return n.id===node.id;
            })
            .attr("d",dUp);

        var dDown ="M"+(theCircleX-8)+","+(theCircleY+10)+" L"+(theCircleX)+","+(theCircleY+13)+" L"+(theCircleX+8)+","+(theCircleY+10);
        me.svg.selectAll("g#node>path.down")
            .filter(function (n) {
                return n.id===node.id;
            })
            .attr("d",dDown);
    }
};