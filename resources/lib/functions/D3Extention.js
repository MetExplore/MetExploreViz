d3.selection.prototype.addNodeForm = function(width, height, rx, ry, stroke, strokewidth) {
	this.append("rect")
			.attr("class", function(d) { return d.getBiologicalType(); })
			.attr("id", function(d) { return d.getId(); })
			.attr("identifier", function(d) { return d.getId(); })
			.attr("width", width)
			.attr("height", height)
			.attr("rx", rx)
			.attr("ry", ry)
			.attr("transform", "translate(-" + width/2 + ",-"
									+ height/2
									+ ")")
			.style("stroke", stroke)
			.style("stroke-width", strokewidth);

	this.append("rect").attr("class","fontSelected")
		.attr("width", width)
		.attr("height", height)
		.attr("rx", rx)
		.attr("ry", ry)
		.attr( "transform", "translate(-" + width/2 + ",-" + height/2 + ")")
		.style("fill-opacity", '0')
		.style("fill", '#000');
};

d3.selection.prototype.setNodeForm = function(width, height, rx, ry, stroke, strokewidth) {
	this.style("opacity", 1)
		.select("rect")
		.attr("width", width)
		.attr("height", height)
		.attr("rx", rx)
		.attr("ry", ry)
		.attr("transform", "translate(-" + width/2 + ",-"
								+ height/2
								+ ")")
		.style("stroke", stroke)
		.style("stroke-width", strokewidth);

	this.select(".fontSelected")
		.attr("width", width)
		.attr("height", height)
		.attr("rx", rx)
		.attr("ry", ry)
		.attr( "transform", "translate(-" + width/2 + ",-" + height/2 + ")")
		.style("stroke-width", strokewidth);
};

d3.selection.prototype.addNodeText = function(style) {

	var minDim = Math.min(style.getWidth(),style.getHeight());

	this
		.append("svg:text")
		.attr("fill", "black")
		.attr("class", function(d) { return d.getBiologicalType(); })
		.each(function(d) {
			var el = d3.select(this);

			var name = style.getDisplayLabel(d, style.getLabel(), style.isUseAlias());
			name = name.split(' ');
			el.text('');
			for (var i = 0; i < name.length; i++) {
				var nameDOMFormat = $("<div/>").html(name[i]).text();
				var tspan = el.append('tspan').text(nameDOMFormat);
				if (i > 0)
					tspan.attr('x', 0).attr('dy', '10');
			}
		})
		.style("font-size",style.getFontSize())
		.style("paint-order","stroke")
		.style("stroke-width", 1)
		.style("stroke", "white")
		.style("stroke-opacity", "0.7")
		.attr("dy", ".4em")
		.style("font-weight", 'bold')
		.style("pointer-events", 'none')
		.style("text-anchor", 'middle')
		.attr("y",minDim/2+5)
		.style("font-family",function(node) { if (node.labelFont) if (node.labelFont.font) return node.labelFont.font; })
		.style("font-size",function(node) { if (node.labelFont) if (node.labelFont.fontSize) return node.labelFont.fontSize; })
		.style("font-weight",function(node) { if (node.labelFont) if (node.labelFont.fontBold) return node.labelFont.fontBold; })
		.style("font-style",function(node) { if (node.labelFont) if (node.labelFont.fontItalic) return node.labelFont.fontItalic; })
		.style("text-decoration-line",function(node) { if (node.labelFont) if (node.labelFont.fontUnderline) return node.labelFont.fontUnderline; })
		.style("opacity",function(node) { if (node.labelFont) if (node.labelFont.fontOpacity) return node.labelFont.fontOpacity; })
		.style("x",function(node) { if (node.labelFont) if (node.labelFont.fontX) return node.labelFont.fontX; })
		.style("y",function(node) { if (node.labelFont) if (node.labelFont.fontY) return node.labelFont.fontY; })
		.style("transform",function(node) { if (node.labelFont) if (node.labelFont.fontTransform) return node.labelFont.fontTransform; });

};

