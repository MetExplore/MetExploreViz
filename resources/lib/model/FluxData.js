var FluxData = function(node, titleFlux, conditonName, val){
    this.node = node;
    this.mappingName = titleFlux;
    this.conditionName = conditionName;
    this.fluxValue = val;
};

FluxData.prototype = {
    getNode : function(){
		return this.node;
	},
	setNode : function(newNode){
		this.node = newNode;
	},

	getMappingName : function(){
		return this.mappingName;
	},

	getConditionName : function(){
		return this.conditionName;
	},

	getFluxValue : function(){
		return this.fluxValue;
	},
	setFluxValue : function(val){
		this.fluxValue = val;
	}
};
