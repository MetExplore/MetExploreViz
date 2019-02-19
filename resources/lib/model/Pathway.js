var Pathway = function(id, name, hide, color, collapsed, nodes){
	this.id = id;
	this.identifier = name;
	this.name = name;

	if(color)
	    this.color = color;
	else
	    this.color = "";

	if(nodes)
	    this.nodes = nodes;
	else
        this.nodes = [];

    if(hide)
        this.hide = hide;
    else
        this.hide = "";

    if(collapsed)
        this.collapsed = collapsed;
    else
        this.collapsed = false;
};

Pathway.prototype = {

    addNode:function(node)
    {
        this.nodes.push(node);
    },
    getNodes:function()
    {
        return this.nodes;
    },

    removeNode:function(node)
    {
        var index = this.nodes.indexOf(node);
        if(index!=-1) this.nodes.splice(index, 1);
    },

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
      this.hide = bool;
    },
    isCollapsed:function()
    {
      return this.collapsed;
    },
    setCollapsed:function(bool)
    {
      this.collapsed = bool;
    }
};
