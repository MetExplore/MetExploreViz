/**
 * @author MC
 * (a)description 
 */
 /**
 * draw a reaction
 */
 
var ReactionStyle = function(height, width, rx, ry, displayNodeName, fontSize, strokeColor, strokeWidth, useAlias){
    this.height = height;
    this.width = width;
    this.rx = rx;
    this.ry = ry;
    this.label = displayNodeName;
    this.strokeColor = strokeColor;
    this.fontSize = fontSize;
    this.strokeWidth = strokeWidth;
    this.useAlias = useAlias;
    this.labelOpacity = 1.0;
};

ReactionStyle.prototype = {
	// Getters & Setters
    getHeight:function()
    {
      return this.height;
    },

    setHeight:function(newData)
    {
      this.height = newData;
    },

    getStrokeWidth:function()
    {
      return this.strokeWidth;
    },

    setStrokeWidth:function(newData)
    {
      this.strokeWidth = newData;
    },

    getWidth:function()
    {
      return this.width;
    },

    setWidth:function(newData)
    {
      this.width = newData;
    },

    getRX:function()
    {
      return this.rx;
    },

    setRX:function(newData)
    {
      this.rx = newData;
    },

    getRY:function()
    {
      return this.ry;
    },

    setRY:function(newData)
    {
      this.ry = newData;
    },

    getStrokeColor:function()
    {
      return this.strokeColor;
    },

    setStrokeColor:function(newData)
    {
      this.strokeColor = newData;
    },
    getFontSize:function()
    {
      return this.fontSize;
    },
    setFontSize:function(newData)
    {
      this.fontSize = newData;
    },


    getLabel:function()
    {
      return this.label;
    },

    setLabel:function(newData)
    {
      this.label = newData;
    },


    isUseAlias:function()
    {
      return this.useAlias;
    },

    setUseAlias:function(newData)
    {
      this.useAlias = newData;
    },

    getDisplayLabel:function(node, label, useAlias)
    {
        var displayedLabel;
        if (node.getLabel()!=undefined) displayedLabel = node.getLabel();
        else
        {
           if(useAlias){
                displayedLabel = node.getAlias();
                if(displayedLabel === undefined)
                    displayedLabel = this.labelToDisplay(node, label);
                else
                    if(displayedLabel.isEmpty()) displayedLabel = this.labelToDisplay(node, label);

            }
            else
            {
                displayedLabel = this.labelToDisplay(node, label);
            }
        }
        return displayedLabel;
    },

    labelToDisplay:function(node, label){
        var displayedLabel = undefined;
        switch(label) {
            case "ec":
                displayedLabel = node.getEC();
                break;
            case "name":
                displayedLabel = node.getName();
                break;
            case "dbIdentifier":
                displayedLabel = node.getDbIdentifier();
                break;
            default:
                displayedLabel = node.getName();
        }

        if(displayedLabel == undefined)
            displayedLabel = node.getName();

        return displayedLabel;
    },
    getLabelOpacity:function()
    {
        return this.labelOpacity;
    },

    setLabelOpacity:function(newData)
    {
        this.labelOpacity = newData;
    }
};