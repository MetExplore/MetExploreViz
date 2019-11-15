
/**
 * @author MC
 * (a)description : To manage node exemple in style forms
 */


metExploreD3.NodeStyleForm = {
    changeHeightExemple : function(height, object) {
        if(d3.select("#vizExemple"+object).select("#D3vizExemple").node()!=null){

            var vis = d3.select("#vizExemple"+object)
                .select("#D3vizExemple");
            vis.select("g.node").select("rect").attr("height", height);

            vis.select("g.node")
                .select("text")
                .attr("y",height);
        }
    },

    changeWidthExemple : function(width, object) {
        if(d3.select("#vizExemple"+object).select("#D3vizExemple").node()!=null){

            var vis = d3.select("#vizExemple"+object)
                .select("#D3vizExemple");
            vis.select("g.node").select("rect").attr("width", width);
        }

    },
    changeStrokeExemple : function(stroke, object) {
        if(d3.select("#vizExemple"+object).select("#D3vizExemple").node()!=null){

            var vis = d3.select("#vizExemple"+object)
                .select("#D3vizExemple");
            vis.select("g.node").select("rect").style("stroke-width", stroke);
        }
    },
    changeRxExemple : function(ry, object) {
        if(d3.select("#vizExemple"+object).select("#D3vizExemple").node()!=null){

            var vis = d3.select("#vizExemple"+object)
                .select("#D3vizExemple");
            vis.select("g.node").select("rect").attr("ry", ry);
        }
    },
    changeRyExemple : function(ry, object) {
        if(d3.select("#vizExemple"+object).select("#D3vizExemple").node()!=null){

            var vis = d3.select("#vizExemple"+object)
                .select("#D3vizExemple");
            vis.select("g.node").select("rect").attr("ry", ry);
        }
    },
    changeLabelExemple : function(label, object) {
        if(d3.select("#vizExemple"+object).select("#D3vizExemple").node()!=null){

            var vis = d3.select("#vizExemple"+object)
                .select("#D3vizExemple");
            vis.select("g.node").select('text').text(function(d) {

                var text=$("<div/>").html(label).text();
                if(text==="")
                    text=$("<div/>").html(label).text();
                return text;
            })
        }
    },
    zoomExemple : function(object) {
        d3.select("#vizExemple"+object).select("#D3vizExemple").select("#graphComponent").attr("transform", "translate(" + d3.event.transform.y + ")scale(" + d3.event.transform.k + ")");
    },
    displayNodeExemple : function(object) {
        var vis;
        if (d3.select("#vizExemple"+object).select("#D3vizExemple").node() != null) {

            d3.select("#vizExemple"+object).select("#D3vizExemple")
                .selectAll("*").remove();
            vis = d3.select("#vizExemple"+object)
                .select("#D3vizExemple");
        }
        else
        {
            vis = d3.select("#vizExemple"+object)
                .append("svg")
                .attr("width", "100%")
                .attr("height", "100%")
                .attr("class", "D3vizExemple")
                .attr("id", "D3vizExemple")
        }


        var that = this;

        var zoomListener = d3.zoom()
            .scaleExtent([ 0.1, 20 ])
            .on("zoom", function(e){
                that.zoomExemple(object);
            });

        vis = vis.call(zoomListener)
        // Remove zoom on double click
            .attr("pointer-events", "all")
            .append('svg:g')
            .attr("class","graphComponent").attr("id","graphComponent");

        // Get height and witdh of viz panel
        var h = parseInt(d3.select("#vizExemple"+object).style("height"));
        var w = parseInt(d3.select("#vizExemple"+object).style("width"));

        vis.append("svg:g").attr("class", "node")
            .style("fill", "white")
            .attr("cx",w/2).attr("cy",h/2)
            .attr("transform", "translate("+w/2+","+h/2+")")
            .append("rect")
            .attr("width", style.getWidth())
            .attr("height", style.getHeight())
            .attr("rx", style.getRX())
            .attr("ry", style.getRY())
            .attr("transform", "translate(-" + style.getWidth() / 2 + ",-"
                + style.getHeight() / 2
                + ")")
            .style("stroke", style.getStrokeColor())
            .style("stroke-width", style.getStrokeWidth());

        var minDim = Math.min(style.getWidth(),style.getHeight());
        vis.select("g.node")
            .append("svg:text")
            .attr("class", "metabolite")
            .attr("id", "metabolite")
            .attr("fill", "#000000")
            .text(function(d) {

                var text=$("<div/>").html(style.getLabel()).text();
                if(text=="")
                    text=$("<div/>").html(style.getLabel()).text();
                return text;
            })
            .style("font-size",style.getFontSize())
            .style("paint-order","stroke")
            .style("stroke-width", '1')
            .style("stroke", "white")
            .style("stroke-opacity", "0.7")
            .attr("dy", ".4em")
            .style("font-weight", 'bold')
            .attr("y",style.getHeight());
    }
};
