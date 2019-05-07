/**
 * @author MC
 * (a)description 
 */
 /**
 * Scale
 */
var Scale = function(graphName){
   this.graphName = graphName;
};

Scale.prototype = {
 
    // Getters & Setters
    setScale:function(newzoomScale, newzoomScaleCompare, newzoom)
    {
        this.zoomScale = newzoomScale;
        this.zoomScaleCompare = newzoomScaleCompare;
        this.zoom = newzoom;
    },

    getGraphName:function()
    {
      return this.graphName;
    },

    setGraphName:function(newData)
    {
      this.graphName = newData;
    },

    getZoomScale:function()
    {
      return this.zoomScale;
    },

    setZoomScale:function(newData)
    {
      this.zoomScale = newData;
    },

    getZoomScaleCompare:function()
    {
      return this.zoomScaleCompare;
    },

    setZoomScaleCompare:function(newData)
    {
      this.zoomScaleCompare = newData;
    },
    getZoom:function()
    {
      return this.zoom;
    },

    setZoom:function(newData)
    {
      this.zoom = newData;
    }
};