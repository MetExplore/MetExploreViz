/**
 * LinkData class
 * id : a String for the identifier of the Link
 * Contains a source Node
 * Contains a target Node
 * Boolean telling wether the Link is directed or not
 */

var LinkData = function(id, source, target, interaction, reversible){
    this.id = id;
    this.source = source;
    this.target = target; 
    this.interaction = interaction;
    this.reversible = reversible;

    this.mappingDatas = [];
};

LinkData.prototype = {
    
    equals : function(x){
		if(this.id!=x.id)
			return false;
				
			return true;
	},

    isReversible :function(){
    return this.reversible;
    },

    // Getters & Setters
    getId:function(){
        return this.id;
    },
   
    setInteraction:function(inte){
        this.interaction = inte;
    },

    getInteraction:function(){
        return this.interaction;
    },

    getSource:function(){
        return this.source;
    },
    getReaction:function(){
        var reaction;
        if(this.getSource().getBiologicalType()==="reaction")
            reaction = this.getSource();
        else
            reaction = this.getTarget();

        if(reaction){
            return reaction;
        }
        return undefined;
    },

    getTarget:function(){
        return this.target;
    },

    setSource:function(source){
        this.source = source;
    },

    setTarget:function(target){
        this.target = target;
    },


    resetMapping : function(){
        this.mappingDatas=[];
    },
    addMappingData : function(aMappingData){
        this.mappingDatas.push(aMappingData);
    },
    removeMappingData : function(mappingTitle){
        var mapDatasToRemove = [];
        this.mappingDatas.forEach(function(mapData){
            if(mapData.getMappingName()==mappingTitle)
            {
                mapDatasToRemove.push(mapData);
            }
        });
        mapDatasToRemove.forEach(function(mapDataToRemove){
            var i = mapDatasToRemove.indexOf(mapDataToRemove);
            if(i!=-1)
                mapDatasToRemove.splice(i, 1);
        })
    },
    getMappingDatasLength : function(){
        return this.mappingDatas.length;
    },
    getMappingDatas : function(){
        return this.mappingDatas;
    },
    getMappingDataByNameAndCond : function(name, cond){
        var themappingData = null;
        this.mappingDatas.forEach(function(aMappingData){
            if(aMappingData.getMappingName()==name && aMappingData.getConditionName()==cond)
                themappingData = aMappingData;
        });
        return themappingData;
    },
    getMappingDataByName : function(name){
        var themappingData = null;
        this.mappingDatas.forEach(function(aMappingData){
            if(aMappingData.getMappingName()==name)
                themappingData = aMappingData;
        });
        return themappingData;
    },
    setMappingDataByNameAndCond : function(name, cond, val){
        var themappingData = null;
        this.mappingDatas.forEach(function(aMappingData){
            if(aMappingData.getMappingName()==name && aMappingData.getConditionName()==cond)
                themappingData = aMappingData;
        });
        themappingData.setMapValue(val);
    }
};