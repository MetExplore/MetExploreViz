/**
 * @author Adrien Rohan
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

    createColorScaleEditor : function(svg, width, height, margin){
        colorRange = ['#6f867b', '#F6F6F4', '#925D60'];
        colorPercent = [0, 50, 100];
        colorDomain = [1,2,3];
        color = d3.scaleLinear().range(colorRange).domain(colorDomain);

        xScale = d3.scaleLinear()
            .domain([60, width+60])
            .range([0, width]);

        scaleXInPercent = d3.scaleLinear()
            .domain([0, width])
            .range([0, 100]);

        scalePercentInX = d3.scaleLinear()
            .domain([0, 100])
            .range([0, width]);

        group= svg.append("g")
            .attr("id", "groupId")
            .attr("transform", "translate(" + (margin + 30) + ",45)");

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
            .attr("width", "50px")
            .attr("height", height)
            .style("fill", "black");

        group.append("svg")
            .attr("x", -78)
            .attr("y", -10)
            .append("polygon")
            .attr("width", "50px")
            .attr("height", "50px")
            .style("fill", "black")
            .style("stroke", "black")
            .style("stroke-width", 4)
            .attr("points", "35,15 35,35 20,25");

        group.append("rect")
            .attr("x", width+17)
            .attr("y", 0)
            .attr("width", "50px")
            .attr("height", height)
            .style("fill", "red");

        group.append("svg")
            .attr("x", width+50+10)
            .attr("y", -10)
            .append("polygon")
            .attr("width", "50px")
            .attr("height", "50px")
            .style("fill", "red")
            .style("stroke", "black")
            .style("stroke-width", 4)
            .attr("points", "15,15 30,25 15,35");


        group.append("rect")
            .attr("x", -33)
            .attr("y", 0)
            .attr("width", width+100)
            .attr("height", height)
            .style("stroke", "black")
            .style("fill-opacity", "0")
            .style("stroke-width", 4);

        metExploreD3.GraphColorScaleEditor.update();
    },
    updateColorPercent : function(indexVal,theLinearGradient, deltaX){
        colorPercent.splice(indexVal, 1, round(scaleXInPercent(d3.event.x+deltaX)));
        theLinearGradient
            .attr("offset", round(scaleXInPercent(d3.event.x+deltaX))+"%");
    },
    round : function(operation){
        return Math.round((operation) * 100) / 100;
    },
    addColor : function(){
        console.log("add")

        colorPercent.push(70);
        colorPercent.sort(function(a, b) {
            return a - b;
        });

        var i = colorPercent.findIndex(function(n){return n===70});
        colorRange.splice(i, 0, "#FFFF00");

        colorDomain.push(colorDomain.length+1);

        color.range(colorRange).domain(colorDomain);

        metExploreD3.GraphColorScaleEditor.update();
    },
    update : function(){
        console.log("update");

        var me = this;
        var group = d3.select('#groupId');

        group.select("#linear-gradient").remove();
        group.selectAll("#sliderId").remove();

        var linearGradient = group.append("defs")
            .append("linearGradient")
            .attr("id", "linear-gradient");

        colorPercent.forEach(function(aColorPercent, index){
            var iCol = index+1;
            var colPercent = aColorPercent+"%";

            var theLinearGradient = linearGradient.append("stop")
                .attr("offset", colPercent)
                .attr("stop-color", color(iCol));

            var deltaX, deltaY, deltaYIcon, indexVal;

            var dragHandler = d3.drag()
                .on("start", function () {
                    var current = d3.select(this);
                    console.log(current);
                    console.log(current.attr("x"));
                    console.log( d3.event.x);
                    // if(scalePercentInX(current.attr("x")-d3.event.x)>0 && scalePercentInX(current.attr("x")-d3.event.x)<100)
                    deltaX = current.attr("x") - d3.event.x;

                    console.log(deltaX);

                    indexVal = colorPercent.findIndex(function(pc){
                        return metExploreD3.GraphColorScaleEditor.round(parseFloat(pc))===metExploreD3.GraphColorScaleEditor.round(parseFloat(theLinearGradient.attr("offset").replace("%","")))
                    });
                    console.log(indexVal);
                })
                .on("drag", function () {
                    var current = d3.select(this);
                    if(indexVal===0)
                    {
                        if( 0 <= scaleXInPercent(d3.event.x+deltaX) && scaleXInPercent(d3.event.x+deltaX) < colorPercent[indexVal+1] ){

                            me.updateColorPercent(indexVal,theLinearGradient, deltaX);
                            d3.select(this)
                                .attr("x", d3.event.x + deltaX);
                        }
                    }
                    else
                    {
                        if( indexVal===colorPercent.length-1 )
                        {
                            if(colorPercent[indexVal-1] < scaleXInPercent(d3.event.x+deltaX) && scaleXInPercent(d3.event.x+deltaX) <= 100){
                                me.updateColorPercent(indexVal,theLinearGradient, deltaX);
                                d3.select(this)
                                    .attr("x", d3.event.x + deltaX);
                            }
                        }
                        else
                        {
                            if(colorPercent[indexVal-1] < scaleXInPercent(d3.event.x+deltaX) && scaleXInPercent(d3.event.x+deltaX) < colorPercent[indexVal+1])
                            {
                                me.updateColorPercent(indexVal, theLinearGradient, deltaX);
                                d3.select(this)
                                    .attr("x", d3.event.x + deltaX);
                            }
                        }
                    }
                });

            // group.append('image')
            //     .attr("x", scalePercentInX( metExploreD3.GraphColorScaleEditor.round(parseFloat(theLinearGradient.attr("offset").replace("%","")))) )
            //     .attr("id", "sliderId")
            //     .attr("transform", "translate("+ (-9) +", -28)")
            //     .attr("height", "25px")
            //     .attr("width", "20px")
            //     .attr('xlink:href', 'https://vm-metexplore-test.toulouse.inra.fr/tmp/slider.svg')
            //     .attr("fill", "red")
            //     .call(dragHandler);

            group.append('svg')
                .attr("height", "45px")
                .attr("width", "40px")
                .attr("transform", "translate(8, 0)")
                .call(dragHandler)
                .attr("x", scalePercentInX( metExploreD3.GraphColorScaleEditor.round(parseFloat(theLinearGradient.attr("offset").replace("%","")))) )
                .attr("y", -32)
                .attr("id", "sliderId")
                .append('path')
                .attr("transform", "translate(8, 2) scale(0.4)")
                .attr("stroke", "black")
                .attr("stroke-width", "10px")
                .attr("d", "M0 40L25 64L50 40L50 0L0 0L0 40Z")
                .attr("fill", color(iCol))
        })


    }
};