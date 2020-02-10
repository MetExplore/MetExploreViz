/**
 * @author MC
 * (a)description
 */
/**
 * draw a link
 */
var LinkStyle = function(size, lineWidth, markerWidth, markerHeight, markerInColor, markerOutColor, markerStrokeColor, markerStrokeWidth, strokeColor, opacity, fontColor, fontSize, fontWeight, labelOpacity){
    this.size = size ;
    this.lineWidth = lineWidth;
    this.markerWidth = markerWidth;
    this.markerHeight = markerHeight;
    this.markerInColor = markerInColor;
    this.markerOutColor = markerOutColor;
    this.markerStrokeColor = markerStrokeColor;
    this.markerStrokeWidth = markerStrokeWidth;

    if(opacity)
        this.opacity = opacity;
    else
        this.opacity = "1.0";

    if(strokeColor)
        this.strokeColor = strokeColor;
    else
        this.strokeColor = "#000000";

    if(fontColor)
        this.fontColor = fontColor;
    else
        this.fontColor = "#000000";

    if(fontSize)
        this.fontSize = fontSize;
    else
        this.fontSize = 10;

    this.fontWeight = fontWeight;

    if(labelOpacity)
        this.labelOpacity = labelOpacity;
    else
        this.labelOpacity = 1.0;
};

LinkStyle.prototype = {
    // Getters & Setters
    getMarkerInColor:function()
    {
        return this.markerInColor;
    },

    getLineWidth:function()
    {
        return this.lineWidth;
    },

    getMarkerOutColor:function()
    {
        return this.markerOutColor;
    },

    getSize:function()
    {
        return this.size;
    },

    getMarkerWidth:function()
    {
        return this.markerWidth;
    },

    getMarkerStrokeWidth:function()
    {
        return this.markerStrokeWidth;
    },

    getMarkerHeight:function()
    {
        return this.markerHeight;
    },

    getMarkerStrokeColor:function()
    {
        return this.markerStrokeColor;
    },

    getStrokeColor:function()
    {
        return this.strokeColor;
    },

    getOpacity:function()
    {
        return this.opacity;
    },

    setMarkerInColor:function(newData)
    {
        this.markerInColor = newData;
    },

    setLineWidth:function(newData)
    {
        this.lineWidth = newData;
    },

    setMarkerOutColor:function(newData)
    {
        this.markerOutColor = newData;
    },

    setSize:function(newData)
    {
        this.size =  newData;
    },

    setMarkerWidth:function(newData)
    {
        this.markerWidth = newData;
    }

    ,setMarkerStrokeWidth:function(newData)
    {
        this.markerStrokeWidth = newData;;
    },

    setMarkerHeight:function(newData)
    {
        this.markerHeight = newData;;
    },

    setMarkerStrokeColor:function(newData)
    {
        this.markerStrokeColor = newData;;
    },

    setStrokeColor:function(newData)
    {
        this.strokeColor = newData;;
    }
};