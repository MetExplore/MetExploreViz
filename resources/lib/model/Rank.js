/**
 * @author JCG
 * Model to handle List of Rank data for GIR
 */

var Rank = function(name, data, id, rank){
    this.id = id;
    this.data = data;
    this.name = name;
    this.rank = rank;
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
    }
};
