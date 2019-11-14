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
    colorMin: undefined,
    colorMax: undefined,
    selectedValue:"",

    colorRangeInit: undefined,
    colorPercentInit: undefined,
    colorDomainInit: undefined,
    colorMinInit: undefined,
    colorMaxInit: undefined,

    createColorScaleCaption : function(svg, width, height, margin){
        var colorRangeCaption = ['#6f867b', '#F6F6F4', '#925D60'];
        var colorPercentCaption = [0, 50, 100];
        var colorDomainCaption = [1,2,3];
        var colorCaption = d3.scaleLinear().range(colorRangeCaption).domain(colorDomainCaption);

        var colorMin = "#6f867b";
        var colorMax = "#925D60";

        var xScaleCaption = d3.scaleLinear()
            .domain([60, width+60])
            .range([0, width]);

        var scaleXInPercentCaption = d3.scaleLinear()
            .domain([0, width])
            .range([0, 100]);

        var scalePercentInXCaption = d3.scaleLinear()
            .domain([0, 100])
            .range([0, width]);


        var group= svg.append("g")
            .attr("transform", "translate(" + (margin + 30) + ",30)");

        group.append("rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", "20px")
            .attr("height", height)
            .style("fill", colorMin);

        group.append("rect")
            .attr("x", 20)
            .attr("y", 0)
            .attr("width", width)
            .attr("height", height)
            .style("fill", "url(#linear-gradientCaption)");


        group.append("text")
            .attr("x", 7)
            .attr("y", -10)
            .text("Min");

        group.append("rect")
            .attr("x", width+20)
            .attr("y", 0)
            .attr("width", "20px")
            .attr("height", height)
            .style("fill", colorMax);

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

        group.select("#linear-gradientCaption").remove();
        group.selectAll("#sliderId").remove();

        var linearGradient = group.append("defs")
            .append("linearGradient")
            .attr("id", "linear-gradientCaption");

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
                .attr("x", scalePercentInXCaption( metExploreD3.GraphColorScaleEditor.round(parseFloat(theLinearGradient.attr("offset").replace("%","")))) )
                .attr("y", -32);

        })
    },

    createColorScaleEditor : function(svg, width, height, margin, but){
        var me = this;
        me.svg=svg;
        me.button=but;
        me.colorRange = ['#6f867b', '#F6F6F4', '#925D60'];
        me.colorPercent = [0, 50, 100];
        me.colorDomain = [1,2,3];
        me.color = d3.scaleLinear().range(me.colorRange).domain(me.colorDomain);
        me.colorMin = "#6f867b";
        me.colorMax = "#925D60";

        me.colorRangeInit = me.colorRange.slice(0);
        me.colorPercentInit = me.colorPercent.slice(0);
        me.colorDomainInit =  me.colorDomain.slice(0);
        me.colorMinInit = me.colorMin.slice(0);
        me.colorMaxInit = me.colorMax.slice(0);

        me.xScale = d3.scaleLinear()
            .domain([60, width+60])
            .range([0, width]);

        me.scaleXInPercent = d3.scaleLinear()
            .domain([0, width])
            .range([0, 100]);

        me.scalePercentInX = d3.scaleLinear()
            .domain([0, 100])
            .range([0, width]);


        var group= svg.append("g")
            .attr("id", "groupId")
            .attr("transform", "translate(" + (margin + 30) + ",35)");

        group.append("rect")
            .attr("x", 17)
            .attr("y", 0)
            .attr("width", width)
            .attr("height", height)
            .attr("id", "rectId")
            .style("fill", "url(#linear-gradient)");

        group.append("rect")
            .attr("x", -33)
            .attr("y", 0)
            .attr("id", "minRect")
            .attr("width", "50px")
            .attr("height", height)
            .style("fill", me.colorMin);

        group.append("text")
            .attr("x", 7)
            .attr("y", -20)
            .attr("id", "minText")
            .text("Min");

        group.append("svg")
            .attr("x", -78)
            .attr("y", -10)
            .on("click", function () {
                me.button.value=me.colorMin;
                me.selectedValue="min";
            })
            .append("polygon")
            .attr("id", "min")
            .attr("width", "50px")
            .attr("height", "50px")
            .style("fill", me.colorMin)
            .style("stroke", "#000000")
            .style("stroke-width", 4)
            .attr("points", "35,15 35,35 20,25");

        group.append("rect")
            .attr("x", width+17)
            .attr("y", 0)
            .attr("id", "maxRect")
            .attr("width", "50px")
            .attr("height", height)
            .style("fill", me.colorMax);

        group.append("text")
            .attr("x", width+5)
            .attr("y", -20)
            .attr("id", "maxText")
            .text("Max");

        group.append("svg")
            .attr("x", width+50+10)
            .attr("y", -10)
            .on("click", function () {
                me.button.value=me.colorMax;
                me.selectedValue="max";
            })
            .append("polygon")
            .attr("id", "max")
            .attr("width", "50px")
            .attr("height", "50px")
            .style("fill", me.colorMax)
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

        metExploreD3.GraphColorScaleEditor.update();
    },

    reset : function(){
        var me = this;
        me.colorRange = me.colorRangeInit.slice(0);
        me.colorPercent = me.colorPercentInit.slice(0);
        me.colorDomain = me.colorDomainInit.slice(0);

        me.colorMin = me.colorMinInit.slice(0);
        me.colorMax = me.colorMaxInit.slice(0);
        me.color.range(me.colorRange).domain(me.colorDomain);

        metExploreD3.GraphColorScaleEditor.update();
    },
    updateColorPercent : function(indexVal,theLinearGradient, deltaX){
        this.colorPercent.splice(indexVal, 1, metExploreD3.GraphColorScaleEditor.round(this.scaleXInPercent(d3.event.x+deltaX)));
        theLinearGradient
            .attr("offset", metExploreD3.GraphColorScaleEditor.round(this.scaleXInPercent(d3.event.x+deltaX))+"%");
    },
    updateColor : function(color, svg){

        if(isNaN(this.selectedValue)){
            if(this.selectedValue==="min")
                this.colorMin=color;
            else
                this.colorMax=color;

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

        metExploreD3.GraphColorScaleEditor.update();
    },
    delColor : function(){
        var me = this;
        console.log("del");

        me.colorRange.splice(me.selectedValue-1, 1);
        me.colorPercent.splice(me.selectedValue-1, 1);
        me.colorDomain = me.colorDomain.pop();

        me.color.range(me.colorRange).domain(me.colorDomain);

        metExploreD3.GraphColorScaleEditor.update();
    },
    update : function(){
        console.log("update");
        var me = this;
        var svg = me.svg;
        var group = svg.select('#groupId');

        group.select("#linear-gradient").remove();
        group.selectAll("#sliderId").remove();

        var linearGradient = group.append("defs")
            .append("linearGradient")
            .attr("id", "linear-gradient");

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
                        return metExploreD3.GraphColorScaleEditor.round(parseFloat(pc))===metExploreD3.GraphColorScaleEditor.round(parseFloat(theLinearGradient.attr("offset").replace("%","")))
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
                .attr("x", me.scalePercentInX( metExploreD3.GraphColorScaleEditor.round(parseFloat(theLinearGradient.attr("offset").replace("%","")))) )
                .attr("y", -32)
                .attr("id", "sliderId")
                .append('path')
                .attr("transform", "translate(8, 2) scale(0.4)")
                .attr("stroke", "#000000")
                .attr("stroke-width", "10px")
                .attr("d", pathD)
                .attr("fill", me.color(iCol))

        })


    }
};