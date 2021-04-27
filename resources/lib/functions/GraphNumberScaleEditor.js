/**
 * @class metExploreD3.GraphColorScaleEditor
 * @author Maxime Chazalviel
 * Manage the scale editor of numbers
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
    xVal: undefined,
    yVal: undefined,
    yRect: undefined,
    numberField: undefined,
    delButton: undefined,
    textfieldValue: undefined,
    numberMin: undefined,
    numberMax: undefined,
    selectedValue:"",
    valueMin: undefined,
    valueMax: undefined,

    numberRangeInit: undefined,
    numberPercentInit: undefined,
    numberDomainInit: undefined,
    numberMinInit: undefined,
    numberMaxInit: undefined,

    createNumberScaleCaption : function(svg, width, height, margin, scaleRange){
        var me = this;
        var height=height;
        var width=width;

        var x = d3.scaleLinear()
            .domain(d3.extent(scaleRange, function (d){ return  d.value;}))
            .range([20, width-20]);

        var y = d3.scaleLinear()
            .domain([0, d3.max(scaleRange, function (d){ return  d.styleValue;})]).nice()
            .range([ height, 0]);

        var yRect = d3.scaleLinear()
            .domain([0, d3.max(scaleRange, function (d){ return  d.styleValue;})]).nice()
            .range([0 , height]);

        var xVal = d3.scaleLinear()
            .domain([20, width-20])
            .range(d3.extent(scaleRange, function (d){ return  d.value;}));

        var yVal = d3.scaleLinear()
            .domain([height, 0]).nice()
            .range([0, d3.max(scaleRange, function (d){ return  d.styleValue;})]);

        var area = d3.area()
            .curve(d3.curveLinear)
            .x(function (d){ return x(d.value)})
            .y0(y(0))
            .y1(function (d){ return y(d.styleValue)});

        svg.select("#groupId").remove();
        var group= svg.append("g")
            .attr("id", "groupId")
            .attr("transform", "translate(30, 30)");

        // Area drawing
        group.append("path")
            .datum(scaleRange.filter(function (n, i) {
                if(i===0 || i===scaleRange.length-1)
                    return false;
                return true;
            }))
            .attr("id", "idArea")
            .attr("fill", "rgb(95, 130, 163)")
            .attr("d", area);

        group.append("rect")
            .attr("x", 0)
            .attr("y", height-yRect(scaleRange[0].styleValue))
            .attr("width", 20)
            .attr("height", yRect(scaleRange[0].styleValue))
            .attr("fill", "rgb(95, 130, 163)");

        group.append("rect")
            .attr("x", width-20)
            .attr("y", height-yRect(scaleRange[scaleRange.length-1].styleValue))
            .attr("width", 20)
            .attr("height", yRect(scaleRange[scaleRange.length-1].styleValue))
            .attr("fill", "rgb(95, 130, 163)");

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
            .attr("x", 7)
            .attr("y", height+20)
            .text(me.round(scaleRange[1].value));

        group.append("text")
            .attr("x", width-35)
            .attr("y", -10)
            .text("Max");

        group.append("text")
            .attr("x", width-35)
            .attr("y", height+20)
            .text(me.round(scaleRange[scaleRange.length-2].value));
    },
    createNumberScaleEditor : function(svg, width, height, but, textfieldValue, delButton, data){

        var me = this;
        me.svg = svg;
        me.numberField=but;
        me.delButton=delButton;
        me.textfieldValue=textfieldValue;
        me.height=height;
        me.width=width;

        me.data = data;

        me.begin = me.data.find(function (sr) { return sr.id==="begin"; });
        me.end = me.data.find(function (sr) { return sr.id==="end"; });

        me.valueMin = me.begin.styleValue;
        me.valueMax = me.end.styleValue;

        me.x = d3.scaleLinear()
            .domain(d3.extent(me.data, function (d){ return  d.value;}))
            .range([40, me.width-40]);

        me.y = d3.scaleLinear()
            .domain([0, d3.max(me.data, function (d){ return  d.styleValue;})]).nice()
            .range([me.height, 0]);

        me.yRect = d3.scaleLinear()
            .domain([0, d3.max(me.data, function (d){ return  d.styleValue;})]).nice()
            .range([0 , me.height]);

        var xVal = d3.scaleLinear()
            .domain([40, me.width-40])
            .range(d3.extent(me.data, function (d){ return  d.value;}));

        var yVal = d3.scaleLinear()
            .domain([me.height, 0]).nice()
            .range([0, d3.max(me.data, function (d){ return  d.styleValue;})]);

        var area = d3.area()
            .curve(d3.curveLinear)
            .x(function (d){ return me.x(d.value)})
            .y0(me.y(0))
            .y1(function (d){ return me.y(d.styleValue)});

        svg.select("#groupId").remove();
        var group= svg.append("g")
            .attr("id", "groupId")
            .attr("transform", "translate(70, 25)");

        // Area drawing
        group.append("path")
            .datum(me.data.filter(function (n, i) {
                if(i===0 || i===me.data.length-1)
                    return false;
                return true;
            }))
            .attr("id", "idArea")
            .attr("fill", "rgb(95, 130, 163)")
            .attr("d", area);

        group.append("rect")
            .attr("id", "rectInfinitybegin")
            .attr("x", 0)
            .attr("y", me.height-me.yRect(me.data[0].styleValue))
            .attr("width", 40)
            .attr("height", me.yRect(me.data[0].styleValue))
            .attr("fill", "rgb(95, 130, 163)");

        group.append("rect")
            .attr("id", "rectInfinityend")
            .attr("x", me.width-40)
            .attr("y", me.height-me.yRect(me.data[me.data.length-1].styleValue))
            .attr("width", 40)
            .attr("height", me.yRect(me.data[me.data.length-1].styleValue))
            .attr("fill", "rgb(95, 130, 163)");

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
            .attr("x1", 40)
            .attr("y1", me.height+20)
            .attr("x2", me.width-60)
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

        var indexYVal;
        var dragNodeHandler = d3.drag()
            .on("start", function (node) {
                var current = d3.select(this);
                var text = d3.select(this.parentNode).select("text");

                me.deltaY = current.attr("cy") - d3.event.y;
                me.deltaYText = text.attr("y") - d3.event.y;

                indexYVal = me.data.findIndex(function(pc){
                    return pc.id === node.id;
                });
                me.selectedValue=indexYVal;

                if(1 < me.selectedValue && me.selectedValue < me.data.length-2)
                    me.delButton.enable();
                else
                    me.delButton.disable();

                if(me.textfieldValue.getRawValue()!==me.data[indexYVal].value){

                    me.numberField.setRawValue(me.data[indexYVal].styleValue);
                    me.updateMinMaxNumberField(indexYVal);
                    me.textfieldValue.setRawValue(me.data[indexYVal].styleValue);
                    me.updateValNumberField(indexYVal);
                }
            })
            .on("drag", function (node) {
                var current = d3.select(this);
                var text = d3.select(this.parentNode).select("text");

                if(d3.event.y + me.deltaY>=0 && d3.event.y + me.deltaY<=me.height){

                    me.updateSizeNumber(node.id, yVal(d3.event.y + me.deltaY));

                    me.updateYOfSizeNode(node, d3.event.y);
                    text.html(function(d){ return me.round(parseFloat(d.styleValue)); });
                }

            })
            .on("end", function () {
                if(me.numberField.getRawValue()!==me.data[indexYVal]){
                    me.numberField.setRawValue(me.data[indexYVal].styleValue);
                }
            });

        nodes.append("circle")
            .attr("fill", "white")
            .attr("stroke", "#144778")
            .attr("stroke-width", "5px")
            .attr("r", "5px")
            .attr("cx", function (d){
                if(d.id==="begin") return 0;
                if(d.id==="end") return me.width;
                return me.x(d.value);
            })
            .attr("cy", function (d){ return me.y(d.styleValue)})
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
                var x;
                if(d.id==="begin")  x = 0;
                else
                {
                    if(d.id==="end") x = me.width;
                    else x = me.x(d.value);
                }

                var y = me.y(d.styleValue);
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
                var x;
                if(d.id==="begin")  x = 0;
                else
                {
                    if(d.id==="end") x = me.width;
                    else x = me.x(d.value);
                }
                var y = me.y(d.styleValue);
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
                var x;
                if(d.id==="begin")  x = 0;
                else
                {
                    if(d.id==="end") x = me.width;
                    else x = me.x(d.value);
                }
                var y = me.y(d.styleValue);
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
                var x;
                if(d.id==="begin")  x = 0;
                else
                {
                    if(d.id==="end") x = me.width;
                    else x = me.x(d.value);
                }
                var y = me.y(d.styleValue);
                var points ="M"+(x-8)+","+(y-10)+" L"+(x)+","+(y-13)+" L"+(x+8)+","+(y-10);
                return points;
            });

        nodes.append("svg:text")
            .html(function(d){ return me.round(parseFloat(d.styleValue)); })
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
            .attr("x", function (d){
                if(d.id==="begin") return 0;
                if(d.id==="end") return me.width;
                return me.x(d.value);
            })
            .attr("y", function (d){ return me.y(d.styleValue)-15});


        var indexVal;
        var dragValueHandler = d3.drag()
            .on("start", function (node) {
                var current = d3.select(this);
                var text = d3.select(this.parentNode).select("text");

                // me.numberField.value=metExploreD3.GraphUtils.RGBString2Color(me.color(iCol));
                // me.selectedValue=iCol;
                // // if(scalePercentInX(current.attr("x")-d3.event.x)>0 && scalePercentInX(current.attr("x")-d3.event.x)<100)
                me.deltaX = current.attr("cx") - d3.event.x;
                me.deltaXText = text.attr("x") - d3.event.x;
                //
                // indexVal = me.colorPercent.findIndex(function(pc){
                //     return metExploreD3.GraphColorScaleEditor.round(parseFloat(pc))===metExploreD3.GraphColorScaleEditor.round(parseFloat(theLinearGradient.attr("offset").replace("%","")))
                // });
                indexVal = me.data.findIndex(function(pc){
                    return pc.id === node.id;
                });
                me.selectedValue=indexVal;

                if(1 < me.selectedValue && me.selectedValue < me.data.length)
                    me.delButton.enable();
                else
                    me.delButton.disable();


                if(me.textfieldValue.getRawValue()!==me.data[indexVal].value){

                    me.updateMinMaxNumberField(indexVal);
                    me.numberField.setRawValue(me.data[indexVal].styleValue);
                    me.textfieldValue.setRawValue(me.data[indexVal].value);

                    me.textfieldValue.enable();
                }
            })
            .on("drag", function (node) {

                var text = d3.select(this.parentNode).select("text");

                if(me.x(me.data[indexVal-1].value) < d3.event.x+me.deltaX && d3.event.x + me.deltaX < me.x(me.data[indexVal+1].value)){
                    me.updateValueNumber(node.id, xVal(d3.event.x + me.deltaX));

                    me.updateXOfValueNode(node, d3.event.x);
                    text.html(function(d){ return me.round(parseFloat(d.value)); });

                }
            })
            .on("end", function () {
                if(me.textfieldValue.getRawValue()!==me.data[indexVal]){
                    me.textfieldValue.setRawValue(me.data[indexVal].value);
                }
            });

        groupVal
            .filter(function(node){
                return node.id === "begin";
            })
            .append("svg:g")
            .attr("id", "valuebegin")
            .append("svg:text")
            .html("< min")
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
            .attr("x", 0)
            .attr("y", 105-7);

        groupVal
            .filter(function(node){
                return node.id === me.data.length-2;
            })
            .append("svg:g")
            .attr("id", "valueend")
            .append("svg:text")
            .html("> max")
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
            .attr("x", me.width)
            .attr("y", 105-7);

        groupVal
            .filter(function(node){
                return node.id === 1;
            })
            .append("svg:g")
            .attr("id", "valueMin")
            .append("svg:text")
            .html(function(d){ return me.round(parseFloat(d.value)); })
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
            .attr("y", 105+10);

        groupVal
            .filter(function(node){
                return node.id === me.data.length-2;
            })
            .append("svg:g")
            .attr("id", "valueMax")
            .append("svg:text")
            .html(function(d){ return me.round(parseFloat(d.value)); })
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
            .attr("y", 105+10);

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
            .html(function(d){ return me.round(parseFloat(d.value)); })
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
        // me.numberRange = me.numberRangeInit.slice(0);
        // me.numberPercent = me.numberPercentInit.slice(0);
        // me.numberDomain = me.numberDomainInit.slice(0);

        // me.valueMin = me.numberMinInit;
        // me.ValueMax = me.numberMaxInit;
        // me.number.range(me.numberRange).domain(me.numberDomain);

        dataInit = [];
        dataInit.push(me.begin);
        dataInit.push({"id": 1, "value": me.begin.value, "styleValue": me.begin.styleValue});
        dataInit.push({"id": 2, "value": me.end.value, "styleValue": me.end.styleValue});
        dataInit.push(me.end);

        me.createNumberScaleEditor(me.svg, me.width, me.height, me.numberField, me.textfieldValue, me.delButton, dataInit);
    },

    updateSizeNumber : function(id, size){
        var me = this;
        var node = me.data.find(function (n) {
            return n.id === id;
        });

        node.styleValue = size;

        if(id==="begin" || id==="end")
            me.updateRectHeight(id, size);
        else
        {
            me.updateArea();
        }

    },
    updateRectHeight : function(id, value){
        var me = this;
        me.svg.select("#rectInfinity"+id)
            .attr("y", me.height-me.yRect(value))
            .attr("width", 40)
            .attr("height", me.yRect(value))
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

        var scalePercentInValueCaption = d3.scaleLinear()
            .domain([0, 100])
            .range([ me.data[0].value , me.data[me.data.length-1].value ]);

        var newVal = scalePercentInValueCaption(50);
        var i = me.data.findIndex(function (node) {
            return node.value>newVal;
        });

        var styleVal = (me.data[0].styleValue+me.data[me.data.length-1].styleValue)/2;
        me.data.splice(i, 0, {
            id:i,
            value:newVal,
            styleValue:styleVal
        });

        for (var j = i+1; j < me.data.length-1; j++) {
            me.data[j].id=j;
        }

        me.createNumberScaleEditor(me.svg, me.width, me.height, me.numberField, me.textfieldValue, me.delButton, me.data);

    },
    delNumber : function(){
        var me = this;
        if(me.data.length>4){
            me.data.splice(me.selectedValue, 1);
            me.createNumberScaleEditor(me.svg, me.width, me.height, me.numberField, me.textfieldValue, me.delButton, me.data);
        }
    },
    updateArea : function(){
        var me = this;
        var dArea = d3.area()
            .curve(d3.curveLinear)
            .x(function (d){ return me.x(d.value)})
            .y0(me.y(0))
            .y1(function (d){ return me.y(d.styleValue)});

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
    },

    updateMinMaxNumberField: function(indexVal){
        var me = this;

        var min, max;

        if(indexVal===0 || indexVal===me.data.length-1){
            if(indexVal===0){
                min = -Infinity;
                max = me.data[indexVal+1].value;
            }
            if(indexVal===me.data.length-1){
                min = me.data[indexVal-1].value;
                max = Infinity;
            }
        }
        else
        {
            min = me.data[indexVal-1].value;
            max = me.data[indexVal+1].value;
        }

        me.textfieldValue.setMinValue(min);
        me.textfieldValue.setMaxValue(max);
    },
    updateValNumberField: function(indexVal){
        var me = this;

        if(indexVal===0 || indexVal===me.data.length-1){
            if(indexVal===0){
                me.textfieldValue.setRawValue("< min");
                me.textfieldValue.disable();
            }
            if(indexVal===me.data.length-1){
                me.textfieldValue.setRawValue("> max");
                me.textfieldValue.disable();
            }
        }
        else
        {
            me.textfieldValue.setRawValue(me.data[indexVal].value);
            me.textfieldValue.enable();
        }
    },
    updateSize : function(value){
        var me = this;
        me.data[me.selectedValue].styleValue = value;
        me.createNumberScaleEditor(me.svg, me.width, me.height, me.numberField, me.textfieldValue, me.delButton, me.data);
    },
    updateValue : function(value){
        var me = this;
        var index = me.data.indexOf(me.data[me.selectedValue]);

        if(index === 1){
            me.data[0].value = value;
        }
        if(index === me.data.length-2){
            me.data[me.data.length-1].value = value;
        }

        me.data[me.selectedValue].value = value;
        me.createNumberScaleEditor(me.svg, me.width, me.height, me.numberField, me.textfieldValue, me.delButton, me.data);
    },
    getScaleRange: function(){
        var me = this;

        return me.data;
    }
};
