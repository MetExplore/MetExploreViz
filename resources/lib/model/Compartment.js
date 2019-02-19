var Compartment = function(id, name, hide, color){
	this.id = id;
	this.identifier = name;
	this.name = name;
	this.color = "";
    if(hide)
        this.hide = hide;
    else
        this.hide = false;

    if(color)
        this.color = color;
    else
        this.color = "";
};

Compartment.prototype = {
		

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
    }
};
