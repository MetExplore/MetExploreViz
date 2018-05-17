/**
 * @author MC
 * (a)description 
 */
 /**
 * draw a Metabolite
 */
var MetaboliteStyle = function(height, width, rx, ry, fontSize, strokeWidth, displayNodeName, strokeColor, useAlias){

    this.height = height;
    this.width = width;
    this.rx = rx;
    this.ry = ry;
    this.strokeWidth = strokeWidth;
    this.fontSize = fontSize;
    this.label = displayNodeName;
    this.strokeColor = strokeColor;
    this.useAlias = useAlias;
    //Ajout
    this.labelOpacity = 1.0;
    //Fin Ajout
};

MetaboliteStyle.prototype = {
    // Getters & Setters
    getHeight:function()
    {
      return this.height;
    },

    setHeight:function(newData)
    {
      this.height = newData;
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

    getStrokeWidth:function()
    {
      return this.strokeWidth;
    },

    setStrokeWidth:function(newData)
    {
      this.strokeWidth = newData;
    },

    getFontSize:function()
    {
      return this.fontSize;
    },

    setFontSize:function(newData)
    {
      this.fontSize = newData;
    },


    isUseAlias:function()
    {
      return this.useAlias;
    },

    setUseAlias:function(newData)
    {
      this.useAlias = newData;
    },

    getLabel:function()
    {
      return this.label;
    },

    setLabel:function(newData)
    {
      this.label = newData;
    },

    getDisplayLabel:function(node, label, useAlias)
    {
        var displayedLabel;
        if (node.getLabel()!==undefined) displayedLabel = node.getLabel();
        else
        {
            if(useAlias){
                displayedLabel = node.getAlias();
                if(displayedLabel === undefined)
                    displayedLabel = this.labelToDisplay(node, label);
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
            case "name":
                displayedLabel = node.getName();
                break;
            case "dbIdentifier":
                displayedLabel = node.getDbIdentifier();
                break;
            default:
                displayedLabel = node.getName();
        }

        if(displayedLabel === undefined)
            displayedLabel = node.getName();

        return displayedLabel;
    }
    //Ajout
    ,
    getLabelOpacity:function()
    {
	return this.labelOpacity;
    },

    setLabelOpacity:function(newData)
    {
	this.labelOpacity = newData;
    }
    //Fin Ajout
};
