/**
 * @author JCG
 * Model to handle List of Flux data
 */

var Flux = function(title, conditions, targetLabel, id){

    this.name = title;
    this.conditions = conditions;
    this.sdConditions = [];
    this.sdData = [];
    this.targetLabel = targetLabel;
    this.data = [];
    this.id = id;
};

Flux.prototype = {
    getId : function(){
		return this.id;
	},
	setId : function(newid){
		this.id = newid;
	},

	getName : function(){
		return this.name;
	},

	setName : function(newName){
		this.name = newName;
	},

	getConditions : function(){
		return this.conditions;
	},

	getTargetLabel : function(){
		return this.targetLabel;
	},

	getConditionByName : function(name){
		var theCondition = null;
        this.comparedPanels.forEach(function(aCondition){
            if(aCondition.name==name)
                theCondition = aCondition;
        });
        return theCondition;
	},

	addMap : function(map){
		this.data.push(map);
	},

	getData : function(){
		return this.data;
	},

    getSdData : function(){
        return this.sdData;
    },

    getSdConditions : function(){
        return this.sdConditions;
    }
};
