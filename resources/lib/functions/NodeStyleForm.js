
/**
 * @author MC
 * (a)description : To manage node exemple in style forms
 */


metExploreD3.NodeStyleForm = {
    changeHeightExemple : function(height, object) {
        if(d3.select("#vizExemple"+object).select("#D3vizExemple")[0]!=null){

            var vis = d3.select("#vizExemple"+object)
                .select("#D3vizExemple");
            vis.select("g.node").select("rect").attr("height", height);

            vis.select("g.node")
                .select("text")
                .attr("y",height);
        }
    },

    changeWidthExemple : function(width, object) {
        if(d3.select("#vizExemple"+object).select("#D3vizExemple")[0]!=null){

            var vis = d3.select("#vizExemple"+object)
                .select("#D3vizExemple");
            vis.select("g.node").select("rect").attr("width", width);
        }

    },
    changeStrokeExemple : function(stroke, object) {
        if(d3.select("#vizExemple"+object).select("#D3vizExemple")[0]!=null){

            var vis = d3.select("#vizExemple"+object)
                .select("#D3vizExemple");
            vis.select("g.node").select("rect").style("stroke-width", stroke);
        }
    }
};
