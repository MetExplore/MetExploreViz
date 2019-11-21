

/**
 * @author Maxime Chazalviel
 * (a)description : Style Edition
 */

metExploreD3.GraphColorScaleEditor = {

    colorRange: undefined,
    values: undefined,
    colorDomain: undefined,
    color: undefined,
    xScale: undefined,
    scaleXInPercent: undefined,
    scalePercentInX: undefined,
    button: undefined,
    delButton: undefined,
    textfieldValue: undefined,
    valueMin: undefined,
    valueMax: undefined,
    selectedValue:"",
    scaleValueInPercentCaption: undefined,
    scalePercentInValueCaption: undefined,

    colorRangeInit: undefined,
    valuesInit: undefined,
    colorDomainInit: undefined,
    valueMinInit: undefined,
    valueMaxInit: undefined,

    createColorScaleCaption : function(svg, width, height, margin, scaleRange){
        var me = this;

        var begin = scaleRange.find(function (sr) { return sr.id==="begin"; });
        var end = scaleRange.find(function (sr) { return sr.id==="end"; });

        var colorDomainCaption = [];
        var colorRangeCaption = scaleRange.filter(function (sr) { return !isNaN(sr.id); })
            .map(function (sr, i) {
                colorDomainCaption.push(i+1);
                return sr.color;
            });

        var values = scaleRange.filter(function (sr) { return !isNaN(sr.id); })
            .map(function (sr) {
                return sr.value;
            });

        var scaleValueInPercentCaption = d3.scaleLinear()
            .domain([ values[0] , values[values.length-1] ])
            .range([0, 100]);

        var colorCaption = d3.scaleLinear().range(colorRangeCaption).domain(colorDomainCaption);

        var valueMin = begin.color;
        var valueMax = end.color;

        var scalePercentInXCaption = d3.scaleLinear()
            .domain([0, 100])
            .range([0, width]);

        var linearUniqueId = "linear-gradientCaption" + svg.node().parentNode.id;
        var group= svg.append("g")
            .attr("transform", "translate(" + (margin + 30) + ",20)");

        group.append("rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", "20px")
            .attr("height", height)
            .style("fill", valueMin);

        group.append("rect")
            .attr("x", 20)
            .attr("y", 0)
            .attr("width", width)
            .attr("height", height)
            .style("fill", "url(#"+linearUniqueId+")");


        group.append("text")
            .attr("x", 7)
            .attr("y", -10)
            .text("Min");

        group.append("text")
            .attr("x", 7)
            .attr("y", height+20)
            .text(me.round(values[0]));

        group.append("rect")
            .attr("x", width+20)
            .attr("y", 0)
            .attr("width", "20px")
            .attr("height", height)
            .style("fill", valueMax);

        group.append("text")
            .attr("x", width+5)
            .attr("y", -10)
            .text("Max");

        group.append("text")
            .attr("x", width+5)
            .attr("y", -10)
            .text("Max");

        group.append("text")
            .attr("x", width+5)
            .attr("y", height+20)
            .text(me.round(values[values.length-1]));

        group.append("rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", width+40)
            .attr("height", height)
            .style("stroke", "#000000")
            .style("fill-opacity", "0")
            .style("stroke-width", 2);

        group.select("#"+linearUniqueId).remove();
        group.selectAll("#sliderId").remove();

        var linearGradient = group.append("defs")
            .append("linearGradient")
            .attr("id", linearUniqueId);

        values.forEach(function(value, index){
            var iCol = index+1;
            var colPercent = scaleValueInPercentCaption(value)+"%";

            var theLinearGradient = linearGradient.append("stop")
                .attr("offset", colPercent)
                .attr("stop-color", colorCaption(iCol));

            group.append('svg')
                .attr("height", "45px")
                .attr("width", "40px")
                .attr("transform", "translate(8, 0)")
                .attr("x", scalePercentInXCaption( me.round(parseFloat(theLinearGradient.attr("offset").replace("%","")))) )
                .attr("y", -32);

        })
    },

    createColorScaleEditor : function(svg, width, height, margin, but, textfieldValue, delButton, scaleRange){
        var me = this;
        me.svg=svg;
        me.button=but;
        me.delButton=delButton;
        me.textfieldValue=textfieldValue;
        me.width=width;
        me.height=height;

        me.begin = scaleRange.find(function (sr) { return sr.id==="begin"; });
        me.end = scaleRange.find(function (sr) { return sr.id==="end"; });

        me.colorDomain = [];
        me.colorRange = scaleRange.filter(function (sr) { return !isNaN(sr.id); })
            .map(function (sr, i) {
                me.colorDomain.push(i+1);
                return sr.color;
            });

        me.values = scaleRange.filter(function (sr) { return !isNaN(sr.id); })
            .map(function (sr) {
                return sr.value;
            });

        me.scaleValueInPercentCaption = d3.scaleLinear()
            .domain([ me.values[0] , me.values[me.values.length-1] ])
            .range([0, 100]);

        me.scalePercentInValueCaption = d3.scaleLinear()
            .domain([0, 100])
            .range([ me.values[0] , me.values[me.values.length-1] ]);

        me.color = d3.scaleLinear().range(me.colorRange).domain(me.colorDomain);

        me.valueMin = me.begin.color;
        me.valueMax = me.end.color;

        me.colorRangeInit = me.colorRange.slice(0);
        me.valuesInit = me.values.slice(0);
        me.colorDomainInit =  me.colorDomain.slice(0);
        me.valueMinInit = me.valueMin.slice(0);
        me.valueMaxInit = me.valueMax.slice(0);

        me.xScale = d3.scaleLinear()
            .domain([60, width+60])
            .range([0, width]);

        me.scaleXInPercent = d3.scaleLinear()
            .domain([0, width])
            .range([0, 100]);

        me.scalePercentInX = d3.scaleLinear()
            .domain([0, 100])
            .range([0, width]);

        me.linearUniqueId = "linear-gradientCaption" + svg.node().parentNode.id;

        var group= svg.append("g")
            .attr("id", "groupId")
            .attr("transform", "translate(" + (margin + 30) + ",35)");

        group.append("rect")
            .attr("x", 17)
            .attr("y", 0)
            .attr("width", width)
            .attr("height", height)
            .attr("id", "rectId")
            .style("fill", "url(#"+me.linearUniqueId+")");

        group.append("rect")
            .attr("x", -33)
            .attr("y", 0)
            .attr("id", "minRect")
            .attr("width", "50px")
            .attr("height", height)
            .style("fill", me.valueMin);

        group.append("text")
            .attr("x", 7)
            .attr("y", -20)
            .attr("id", "minText")
            .text("Min");

        group.append("svg")
            .attr("x", -78)
            .attr("y", -10)
            .on("click", function () {
                me.button.value=me.valueMin;
                me.textfieldValue.setValue("< min");
                me.textfieldValue.disable();
                me.selectedValue="min";
            })
            .append("polygon")
            .attr("id", "min")
            .attr("width", "50px")
            .attr("height", "50px")
            .style("fill", me.valueMin)
            .style("stroke", "#000000")
            .style("stroke-width", 4)
            .attr("points", "35,15 35,35 20,25");

        group.append("rect")
            .attr("x", width+17)
            .attr("y", 0)
            .attr("id", "maxRect")
            .attr("width", "50px")
            .attr("height", height)
            .style("fill", me.valueMax);

        group.append("text")
            .attr("x", width+5)
            .attr("y", -20)
            .attr("id", "maxText")
            .text("Max");

        group.append("svg")
            .attr("x", width+50+10)
            .attr("y", -10)
            .on("click", function () {
                me.button.value=me.valueMax;
                me.textfieldValue.setValue("> max");
                me.textfieldValue.disable();
                me.selectedValue="max";
            })
            .append("polygon")
            .attr("id", "max")
            .attr("width", "50px")
            .attr("height", "50px")
            .style("fill", me.valueMax)
            .style("stroke", "#000000")
            .style("stroke-width", 4)
            .attr("points", "15,15 30,25 15,35");

        group.append("rect")
            .attr("x", -33)
            .attr("y", 0)
            .attr("width", width+100)
            .attr("height", height)
            .style("stroke", "#000000")
            .style("fill-opacity", "0")
            .style("stroke-width", 4);

        me.update();
    },

    reset : function(){
        var me = this;
        me.colorRange = me.colorRangeInit.slice(0);
        me.values = me.valuesInit.slice(0);
        me.colorDomain = me.colorDomainInit.slice(0);

        me.valueMin = me.valueMinInit.slice(0);
        me.valueMax = me.valueMaxInit.slice(0);
        me.color.range(me.colorRange).domain(me.colorDomain);

        me.update();
    },
    updateValues : function(val){
        var me = this;
        var indexVal = me.selectedValue-1;
        if(val!==me.values[indexVal])
        {

            if(indexVal===0 || indexVal===me.values.length-1){
                if(indexVal===0 && val>me.values[1]){
                    Ext.Msg.show({
                        title:'Warning',
                        msg: "Please enter a lower value than next values("+me.values[1]+").",
                        icon: Ext.Msg.WARNING
                    });
                }
                else {
                    if(indexVal===me.values.length-1 && val<me.values[me.values.length-2]){
                        Ext.Msg.show({
                            title:'Warning',
                            msg: "Please enter a higher value than previous values("+me.values[me.values.length-2]+").",
                            icon: Ext.Msg.WARNING
                        });
                    }
                    else
                    {
                        me.values[indexVal]=val;
                        me.scaleValueInPercentCaption = d3.scaleLinear()
                            .domain([ me.values[0] , me.values[me.values.length-1] ])
                            .range([0, 100]);

                        me.scalePercentInValueCaption = d3.scaleLinear()
                            .domain([0, 100])
                            .range([ me.values[0] , me.values[me.values.length-1] ]);
                        me.update();
                    }
                }
            }
            else
            {
                if(val>me.values[indexVal+1] || val<me.values[indexVal-1] ){
                    Ext.Msg.show({
                        title:'Warning',
                        msg: "Please enter a number between previous and next values("+me.values[indexVal-1]+ " < x < " +me.values[indexVal+1]+").",
                        icon: Ext.Msg.WARNING
                    });
                }
                else
                {
                    me.values[indexVal]=val;
                    me.update();
                }
            }
        }
    },
    updateLinearGradient : function(indexVal,theLinearGradient, deltaX){
        this.values.splice(indexVal, 1, this.scalePercentInValueCaption(this.round(this.scaleXInPercent(d3.event.x+deltaX))));
        theLinearGradient
            .attr("offset", this.round(this.scaleXInPercent(d3.event.x+deltaX))+"%");
    },
    updateColor : function(color, svg){

        if(isNaN(this.selectedValue)){
            if(this.selectedValue==="min")
                this.valueMin=color;
            else
                this.valueMax=color;

            svg.select("#"+this.selectedValue).style("fill", color);
            svg.select("#"+this.selectedValue+"Rect").style("fill", color)
        }
        else
        {
            this.colorRange.splice(this.selectedValue-1, 1, color);
            this.color.range(this.colorRange).domain(this.colorDomain);
            this.update();
        }
    },
    round : function(operation){
        return Math.round((operation) * 100) / 100;
    },
    addColor : function(svg){
        var me = this;

        me.values.push(me.scalePercentInValueCaption(70));
        me.values.sort(function(a, b) {
            return a - b;
        });

        var i = me.values.findIndex(function(n){return n===me.scalePercentInValueCaption(70)});
        me.colorRange.splice(i, 0, "#FFFFFF");

        me.colorDomain.push(me.colorDomain.length+1);

        me.color.range(me.colorRange).domain(me.colorDomain);

        me.update();
    },
    delColor : function(){
        var me = this;
        if(me.values.length>2)
        {
            me.colorRange.splice(me.selectedValue - 1, 1);
            me.values.splice(me.selectedValue - 1, 1);
            me.colorDomain.pop();

            me.color.range(me.colorRange).domain(me.colorDomain);

            me.update();
        }
    },
    update : function(){
        var me = this;
        var svg = me.svg;
        var group = svg.select('#groupId');

        group.select("#"+me.linearUniqueId).remove();
        group.selectAll("#sliderId").remove();

        var linearGradient = group.append("defs")
            .append("linearGradient")
            .attr("id", me.linearUniqueId);

        me.values.forEach(function(value, index){
            var iCol = index+1;
            var colPercent = me.scaleValueInPercentCaption(value)+"%";

            var theLinearGradient = linearGradient.append("stop")
                .attr("offset", colPercent)
                .attr("stop-color", me.color(iCol));

            var deltaX, deltaY, deltaYIcon, indexVal;

            var dragHandler = d3.drag()
                .on("start", function () {
                    var current = d3.select(this);


                    me.button.value=metExploreD3.GraphUtils.RGBString2Color(me.color(iCol));
                    me.selectedValue=iCol;
                    console.log(me.selectedValue);
                    console.log(me.values.length-1);
                    if(1 < me.selectedValue && me.selectedValue < me.values.length)
                        me.delButton.enable();
                    else
                        me.delButton.disable();

                    // if(scalePercentInX(current.attr("x")-d3.event.x)>0 && scalePercentInX(current.attr("x")-d3.event.x)<100)
                    deltaX = current.attr("x") - d3.event.x;

                    indexVal = me.values.findIndex(function(pc){
                        return me.round(parseFloat(pc))===me.round(me.scalePercentInValueCaption(parseFloat(theLinearGradient.attr("offset").replace("%",""))))
                    });

                    if(me.textfieldValue.getValue()!==me.values[indexVal]){
                        me.textfieldValue.setValue(me.values[indexVal]);
                        me.textfieldValue.enable();
                    }

                })
                .on("drag", function () {

                    if(indexVal===0)
                    {
                        // if( 0 <= me.scaleXInPercent(d3.event.x+deltaX) && me.scaleXInPercent(d3.event.x+deltaX) < me.values[indexVal+1] ){
                        //
                        //     me.updateValues(indexVal,theLinearGradient, deltaX);
                        //     d3.select(this)
                        //         .attr("x", d3.event.x + deltaX);
                        // }
                    }
                    else
                    {
                        if( indexVal===me.values.length-1 )
                        {
                            // if(me.values[indexVal-1] < me.scaleXInPercent(d3.event.x+deltaX) && me.scaleXInPercent(d3.event.x+deltaX) <= 100){
                            //     me.updateValues(indexVal,theLinearGradient, deltaX);
                            //     d3.select(this)
                            //         .attr("x", d3.event.x + deltaX);
                            // }
                        }
                        else
                        {
                            if(me.scaleValueInPercentCaption(me.values[indexVal-1]) < me.scaleXInPercent(d3.event.x+deltaX) && me.scaleXInPercent(d3.event.x+deltaX) < me.scaleValueInPercentCaption(me.values[indexVal+1]))
                            {
                                me.updateLinearGradient(indexVal, theLinearGradient, deltaX);
                                d3.select(this)
                                    .attr("x", d3.event.x + deltaX);
                                d3.select(this).select('text').text(me.values[indexVal]);
                            }
                        }
                    }
                })
                .on("end", function () {
                    if(me.textfieldValue.getValue()!==me.values[indexVal]){
                        me.textfieldValue.setValue(me.values[indexVal]);
                        me.textfieldValue.enable();
                    }
                });


            var pathD = "" ;
            if(index===0 || index===me.values.length-1 )
            {
                pathD = "M0 40L25 64L50 40L0 40Z";
            }
            else
            {
                pathD = "M0 40L25 64L50 40L50 0L0 0L0 40Z";

            }

            var slider = group.append('svg')
                .attr("height", "150px")
                .attr("width", "40px")
                .attr("transform", "translate(8, 0)")
                .call(dragHandler)
                .attr("x", me.scalePercentInX( me.round(parseFloat(theLinearGradient.attr("offset").replace("%","")))) )
                .attr("y", -32)
                .append("g")
                .attr("id", "sliderId");

            slider
                .append('path')
                .attr("transform", "translate(8, 2) scale(0.4)")
                .attr("stroke", "#000000")
                .attr("stroke-width", "10px")
                .attr("d", pathD)
                .attr("fill", me.color(iCol));

            slider
                .append("text")
                .attr("x", 0)
                .attr("y", me.height+50)
                .text(me.round(value));
        })


    },
    getScaleRange: function(){
        var me = this;

        var scaleRange = [];

        scaleRange.push({
            id:"begin",
            value:me.values[0],
            color:this.valueMin
        });

        me.colorDomain.forEach(function (domain, i) {
            scaleRange.push(
                {
                    id:domain,
                    value:me.values[i],
                    color:me.colorRange[i]
                }
            );
        });

        scaleRange.push({
            id:"end",
            value:me.values[me.values.length-1],
            color:this.valueMax
        });

        return scaleRange;
    }
};