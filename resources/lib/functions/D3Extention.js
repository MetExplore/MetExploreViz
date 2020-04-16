/*******************************
 * @author MC
 * Functions to extend d3js selection functions
 */

/*******************************
 * Manage attribute setting
 * @param attr
 * @param val
 */
d3.selection.prototype.attrEditor = function(attr, val) {
	var selection = this;

	if(!val)
		return selection.attr(attr);
	else
	{
		if(typeof val === 'function')
		{
			selection.each(function (n) {
				d3.select(this).attrEditor(attr, val(n));
			});
		}
		else
		{
			selection.attr(attr, val);
			if(attr === "height" || attr === "width"){

				selection.each(function (n) {
					if(attr === "height")
						n.setSvgHeight(val);

					if(attr === "width")
						n.setSvgWidth(val);
				});
				selection.attr("transform", "translate(-"+(parseFloat(this.attr("width"))/2)+",-"+(parseFloat(this.attr("height"))/2)+") scale(1)");
			}
		}
	}
};

/*******************************
 * Node shape generation
 * @param width
 * @param height
 * @param rx
 * @param ry
 * @param stroke
 * @param strokewidth
 * @param backgroundColor
 * @param transparency
 */
d3.selection.prototype.addNodeForm = function(width, height, rx, ry, stroke, strokewidth, backgroundColor, transparency) {

	this.append("rect")
			.attr("class", function(d) { return d.getBiologicalType(); })
			.attr("id", function(d) { return d.getId(); })
			.attr("identifier", function(d) { return d.getId(); })
			.attr("width", function(d) { return d.getSvgWidth(); })
			.attr("height", function(d) { return d.getSvgHeight(); })
			.attr("rx", rx)
			.attr("ry", ry)
			.attr("transform", "translate(-" + width/2 + ",-"
									+ height/2
									+ ")")
			.style("stroke", stroke)
			.style("stroke-width", strokewidth)
			.style("fill", backgroundColor)
			.style("opacity", transparency);

	this.append("rect").attr("class","fontSelected")
		.attr("width", function(d) { return d.getSvgWidth(); })
		.attr("height", function(d) { return d.getSvgHeight(); })
		.attr("rx", rx)
		.attr("ry", ry)
		.attr( "transform", "translate(-" + width/2 + ",-" + height/2 + ")")
		.style("fill-opacity", '0')
		.style("fill", "#000")
		.style("opacity", transparency);
};

/****************************************
 * Node shape setter
 * @param width
 * @param height
 * @param rx
 * @param ry
 * @param stroke
 * @param strokewidth
 */
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

/*******************************
 * Add text to node
 * @param style in function of node biological type
 */
d3.selection.prototype.addNodeText = function(style) {

	var minDim = Math.min(style.getWidth(),style.getHeight());

	// Listening font-size attribute to update tspan dy attr similarly
	var observer = new MutationObserver(function(mutations) {
		mutations.forEach(function(mutation) {
			if (mutation.type == "attributes") {
				if(mutation.oldValue){
					if(mutation.oldValue.split("font-size: ")[1]){
						if(mutation.target.style["font-size"]!==mutation.oldValue.split("font-size: ")[1].split(";")[0]){
							d3.select(mutation.target).selectAll("tspan")
								.each(function (ts, i) {
									if (i > 0){
										if(mutation.target.style["font-size"])
											d3.select(this).attr('dy', mutation.target.style["font-size"]);
										else d3.select(this).attr('dy', style.getFontSize());
									}
								});

						}
					}
				}
			}
		});
	});

	this
		.append("svg:text")
		.attr("fill", style.getFontColor())
		.attr("class", function(d) { return d.getBiologicalType(); })
		.each(function(d) {

			observer.observe(this, {
				attributes: true, //configure it to listen to attribute changes
				characterData: true,
				attributeOldValue: true,
				characterDataOldValue: true,
				attributeFilter:["style"]
			});

			var el = d3.select(this);

			var name = style.getDisplayLabel(d, style.getLabel(), style.isUseAlias());
			name = name.split(' ');
			el.text('');
			for (var i = 0; i < name.length; i++) {
				var nameDOMFormat = $("<div/>").html(name[i]).text();
				var tspan = el.append('tspan').text(nameDOMFormat);

				if (d.labelFont){
					if (d.labelFont.fontX) {
						tspan
							.attr('x', function () {
								return d.labelFont.fontX;
							});
					}
					else tspan.attr('x', 0);
				}
				else tspan.attr('x', 0);


				if (i > 0){
					tspan.attr('dy', style.getFontSize());
				}
			}
		})
		.style("paint-order","stroke")
		.style("stroke-width", 1)
		.style("stroke", "white")
		.style("stroke-opacity", "0.7")
		.attr("dy", ".4em")
		.style("font-weight", 'bold')
		.style("pointer-events", 'none')
		.style("text-anchor", 'middle')
		.style("font-family",function(node) { if (node.labelFont) if (node.labelFont.font) return node.labelFont.font; })
		.style("font-size", style.getFontSize())
		.style("font-weight", style.getFontWeight())
		.style("font-style",function(node) { if (node.labelFont) if (node.labelFont.fontItalic) return node.labelFont.fontItalic; })
		.style("text-decoration-line",function(node) { if (node.labelFont) if (node.labelFont.fontUnderline) return node.labelFont.fontUnderline; })
		.style("opacity", style.getLabelOpacity())
		.style("x",function(node) {
			if (node.labelFont) {
				if (node.labelFont.fontX){
					return node.labelFont.fontX;
				}
				else
				{
					return 0;
				}
			}
			else
			{
				return 0;
			}
		})
		.style("y",function(node) {
			var minDim = Math.min(node.getSvgWidth(),node.getSvgHeight());
			if (node.labelFont) {
				if (node.labelFont.fontY){
					return node.labelFont.fontY;
				}
				else
				{
					return minDim/2+5;
				}
			}
			else
			{
				return minDim/2+5;
			}
		})
		.style("transform",function(node) { if (node.labelFont) if (node.labelFont.fontTransform) return node.labelFont.fontTransform; });

};

/*******************************
 * Set node label
 * @param style in function of node biological type
 * @param label to give
 */
d3.selection.prototype.setLabelNodeText = function(style, label) {
	this
		.each(function(d) {

			var el = d3.select(this);
			var name = style.getDisplayLabel(d, label, false);

			name = name.split(' ');
			el.text('');

			if(label!=="hidden"){
				for (var i = 0; i < name.length; i++) {
					var nameDOMFormat = $("<div/>").html(name[i]).text();
					var tspan = el.append('tspan').text(nameDOMFormat);

					if (d.labelFont){
						if (d.labelFont.fontX) {
							tspan
								.attr('x', function () {
									return d.labelFont.fontX;
								});
						}
						else tspan.attr('x', 0);
					}
					else tspan.attr('x', 0);


					if (i > 0){
						tspan.attr('dy', style.getFontSize());
					}
				}
			}
		})

};

/*******************************
 * Add text to node
 * @param style in function of node biological type
 * @param val to use as label
 */
d3.selection.prototype.setLabelNodeTextByValue = function(style, val) {
	var selection = this;
	if(typeof val === 'function')
	{
		selection.each(function (n) {
			d3.select(this).setLabelNodeTextByValue(style, val(n).toString());
		});
	}
	else
	{
		selection
			.each(function(d) {
				//
				// observer.observe(this, {
				// 	attributes: true, //configure it to listen to attribute changes
				// 	characterData: true,
				// 	attributeOldValue: true,
				// 	characterDataOldValue: true,
				// 	attributeFilter:["style"]
				// });

				var el = d3.select(this);
				var name = val;
				name = name.split(' ');
				el.text('');
				for (var i = 0; i < name.length; i++) {
					var nameDOMFormat = $("<div/>").html(name[i]).text();
					var tspan = el.append('tspan').text(nameDOMFormat);

					if (d.labelFont){
						if (d.labelFont.fontX) {
							tspan
								.attr('x', function () {
									return d.labelFont.fontX;
								});
						}
						else tspan.attr('x', 0);
					}
					else tspan.attr('x', 0);


					if (i > 0){
						tspan.attr('dy', style.getFontSize());
					}
				}
			})
	}
};

