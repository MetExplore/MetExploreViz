/**
 * @author MC
 * (a)description 
 */
var ColorComponent = function(name, value){
    this.name = name;
    this.value = value;
};


ColorComponent.prototype = {
	// Getters & Setters
    getName:function()
    {
      return this.name;
    },

    setName:function(newData)
    {
      this.name = newData;
    },

    getValue:function()
    {
      return this.value;
    },

    setValue:function(newData)
    {
        this.value = newData;
    }
};