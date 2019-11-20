

/**
 * @author Maxime Chazalviel
 * (a)description : Style Edition
 */

metExploreD3.GraphColorScaleEditor = {

    colorRange: undefined,
    colorPercent: undefined,
    colorDomain: undefined,
    color: undefined,
    xScale: undefined,
    scaleXInPercent: undefined,
    scalePercentInX: undefined,
    button: undefined,
    valueMin: undefined,
    valueMax: undefined,
    selectedValue:"",

    colorRangeInit: undefined,
    colorPercentInit: undefined,
    colorDomainInit: undefined,
    valueMinInit: undefined,
    valueMaxInit: undefined,

    createColorScaleCaption : function(svg, width, height, margin, scaleRange){
        var me = this;
        console.log(scaleRange);
        var begin = scaleRange.find(function (sr) { return sr.id==="begin"; });
        var end = scaleRange.find(function (sr) { return sr.id==="end"; });

        var colorDomainCaption = [];
        var colorRangeCaption = scaleRange.filter(function (sr) { return !isNaN(sr.id); })
            .map(function (sr, i) {
                colorDomainCaption.push(i+1);
                return sr.color;
            });

        var colorPercentCaption = scaleRange.filter(function (sr) { return !isNaN(sr.id); })
            .map(function (sr) {
                return sr.value;
            });

        var colorCaption = d3.scaleLinear().range(colorRangeCaption).domain(colorDomainCaption);

        var valueMin = begin.color;
        var valueMax = end.color;

        console.log(colorRangeCaption);
        console.log(colorPercentCaption);
        console.log(colorDomainCaption);
        console.log(scaleRange);
        console.log(begin);
        console.log(end);


        var scalePercentInXCaption = d3.scaleLinear()
            .domain([0, 100])
            .range([0, width]);

        console.log(svg);
        var linearUniqueId = "linear-gradientCaption" + svg.node().parentNode.id;
        var group= svg.append("g")
            .attr("transform", "translate(" + (margin + 30) + ",30)");

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

        colorPercentCaption.forEach(function(aColorPercent, index){
            var iCol = index+1;
            var colPercent = aColorPercent+"%";

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

    createColorScaleEditor : function(svg, width, height, margin, but, scaleRange){
        var me = this;
        me.svg=svg;
        me.button=but;


        me.begin = scaleRange.find(function (sr) { return sr.id==="begin"; });
        me.end = scaleRange.find(function (sr) { return sr.id==="end"; });

        me.colorDomain = [];
        me.colorRange = scaleRange.filter(function (sr) { return !isNaN(sr.id); })
            .map(function (sr, i) {
                me.colorDomain.push(i+1);
                return sr.color;
            });

        me.colorPercent = scaleRange.filter(function (sr) { return !isNaN(sr.id); })
            .map(function (sr) {
                return sr.value;
            });

        me.color = d3.scaleLinear().range(me.colorRange).domain(me.colorDomain);

        me.valueMin = me.begin.color;
        me.valueMax = me.end.color;

        me.colorRangeInit = me.colorRange.slice(0);
        me.colorPercentInit = me.colorPercent.slice(0);
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
        me.colorPercent = me.colorPercentInit.slice(0);
        me.colorDomain = me.colorDomainInit.slice(0);

        me.valueMin = me.valueMinInit.slice(0);
        me.valueMax = me.valueMaxInit.slice(0);
        me.color.range(me.colorRange).domain(me.colorDomain);

        me.update();
    },
    updateColorPercent : function(indexVal,theLinearGradient, deltaX){
        this.colorPercent.splice(indexVal, 1, this.round(this.scaleXInPercent(d3.event.x+deltaX)));
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
        console.log("add")

        me.colorPercent.push(70);
        me.colorPercent.sort(function(a, b) {
            return a - b;
        });

        var i = me.colorPercent.findIndex(function(n){return n===70});
        me.colorRange.splice(i, 0, "#FFFF00");

        me.colorDomain.push(me.colorDomain.length+1);

        me.color.range(me.colorRange).domain(me.colorDomain);

        me.update();
    },
    delColor : function(){
        var me = this;
        console.log("del");

        me.colorRange.splice(me.selectedValue-1, 1);
        me.colorPercent.splice(me.selectedValue-1, 1);
        me.colorDomain = me.colorDomain.pop();

        me.color.range(me.colorRange).domain(me.colorDomain);

        me.update();
    },
    update : function(){
        console.log("update");
        var me = this;
        var svg = me.svg;
        var group = svg.select('#groupId');

        group.select("#"+me.linearUniqueId).remove();
        group.selectAll("#sliderId").remove();

        var linearGradient = group.append("defs")
            .append("linearGradient")
            .attr("id", me.linearUniqueId);

        me.colorPercent.forEach(function(aColorPercent, index){
            var iCol = index+1;
            var colPercent = aColorPercent+"%";

            var theLinearGradient = linearGradient.append("stop")
                .attr("offset", colPercent)
                .attr("stop-color", me.color(iCol));

            var deltaX, deltaY, deltaYIcon, indexVal;

            var dragHandler = d3.drag()
                .on("start", function () {
                    var current = d3.select(this);

                    me.button.value=metExploreD3.GraphUtils.RGBString2Color(me.color(iCol));
                    me.selectedValue=iCol;
                    // if(scalePercentInX(current.attr("x")-d3.event.x)>0 && scalePercentInX(current.attr("x")-d3.event.x)<100)
                    deltaX = current.attr("x") - d3.event.x;

                    indexVal = me.colorPercent.findIndex(function(pc){
                        return me.round(parseFloat(pc))===me.round(parseFloat(theLinearGradient.attr("offset").replace("%","")))
                    });
                })
                .on("drag", function () {
                    var current = d3.select(this);
                    if(indexVal===0)
                    {
                        // if( 0 <= me.scaleXInPercent(d3.event.x+deltaX) && me.scaleXInPercent(d3.event.x+deltaX) < me.colorPercent[indexVal+1] ){
                        //
                        //     me.updateColorPercent(indexVal,theLinearGradient, deltaX);
                        //     d3.select(this)
                        //         .attr("x", d3.event.x + deltaX);
                        // }
                    }
                    else
                    {
                        if( indexVal===me.colorPercent.length-1 )
                        {
                            // if(me.colorPercent[indexVal-1] < me.scaleXInPercent(d3.event.x+deltaX) && me.scaleXInPercent(d3.event.x+deltaX) <= 100){
                            //     me.updateColorPercent(indexVal,theLinearGradient, deltaX);
                            //     d3.select(this)
                            //         .attr("x", d3.event.x + deltaX);
                            // }
                        }
                        else
                        {
                            if(me.colorPercent[indexVal-1] < me.scaleXInPercent(d3.event.x+deltaX) && me.scaleXInPercent(d3.event.x+deltaX) < me.colorPercent[indexVal+1])
                            {
                                me.updateColorPercent(indexVal, theLinearGradient, deltaX);
                                d3.select(this)
                                    .attr("x", d3.event.x + deltaX);
                            }
                        }
                    }
                });


            var pathD = "" ;
            if(index===0 || index===me.colorPercent.length-1 )
            {
                pathD = "M0 40L25 64L50 40L0 40Z";
            }
            else
            {
                pathD = "M0 40L25 64L50 40L50 0L0 0L0 40Z";

            }

            group.append('svg')
                .attr("height", "45px")
                .attr("width", "40px")
                .attr("transform", "translate(8, 0)")
                .call(dragHandler)
                .attr("x", me.scalePercentInX( me.round(parseFloat(theLinearGradient.attr("offset").replace("%","")))) )
                .attr("y", -32)
                .attr("id", "sliderId")
                .append('path')
                .attr("transform", "translate(8, 2) scale(0.4)")
                .attr("stroke", "#000000")
                .attr("stroke-width", "10px")
                .attr("d", pathD)
                .attr("fill", me.color(iCol))

        })


    },
    getScaleRange: function(){
        var me = this;

        var scaleRange = [];

        scaleRange.push({
            id:"begin",
            value:0,
            color:this.valueMin
        });

        me.colorDomain.forEach(function (domain, i) {
            scaleRange.push(
                {
                    id:domain,
                    value:me.colorPercent[i],
                    color:me.colorRange[i]
                }
            );
        });

        scaleRange.push({
            id:"end",
            value:100,
            color:this.valueMax
        });

        return scaleRange;
    }
};