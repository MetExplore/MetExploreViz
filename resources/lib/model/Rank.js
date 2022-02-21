/**
 * @author JCG
 * Model to handle List of Rank data and numeric save of network for GIR
 */

var Rank = function(name, data, id, rank){
    this.id = id;
    this.data = data;
    this.name = name;
    this.rank = rank;
    this.threshold = undefined;
};

Rank.prototype = {
    getId: function(){
        return this.id;
    },
	getData: function(){
		return this.data;
	},
    getScore: function(){
        return this.rank;
    },
    getThreshold: function(){
        return this.threshold;
    },
    setThreshold: function(value){
        this.threshold = value;
    }
};
