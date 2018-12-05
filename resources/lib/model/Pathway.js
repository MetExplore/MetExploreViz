var Pathway = function(id, name, hide, color, collapsed){
	this.id = id;
	this.identifier = name;
	this.name = name;
	if(color)
	    this.color = color;
	else
	    this.color = "";

    if(hide)
        this.hide = hide;
    else
        this.hide = "";

    if(collapsed)
        this.collapsed = collapsed;
    else
        this.collapsed = "";
};

Pathway.prototype = {
		

   	getId:function()
    {
      return this.id;
    },
    getIdentifier:function()
    {
      return this.identifier;
    },
    getName:function()
    {
      return this.name;
  	},
    getColor:function()
    {
      return this.color;
    },
    setColor:function(newColor)
    {
      return this.color = newColor;
    },
    hidden:function()
    {
      return this.hide;
    },
    setHidden:function(bool)
    {
      return this.hide = bool;
    },
    isCollapsed:function()
    {
      return this.hide;
    },
    setCollapsed:function(bool)
    {
      return this.hide = bool;
    }
};
