/**
 * NetworkVizSession
 */
var NetworkVizSession = function(){
    this.active = false;
    this.activeMapping = "";
    this.animated = false;
    this.colorMappings = [];
    this.colorSuggestions = [];
    this.colorComponents = [];
    this.displayNodeName = "";
    this.duplicatedNodes = [];
    this.d3Data = new NetworkData();
    this.force = undefined;
    this.forceCentroids = undefined;
    this.groups = [];
    this.groupPath = "";
    this.id = "";
    this.linked = false;
    this.mapped = "none";
    this.mappingDataType = "";
    this.metabolites = [];
    this.nodesMap = [];
    this.reactions = [];
    this.resizable = false;
    this.selectedNodes = [];
    this.selectedPathways = [];
};

NetworkVizSession.prototype = {
    /*
    toJSON: function () {
        return 'Whatever you like' + this.id; // etc.
    },
    */
    getGroupByKey:function(key){
        var componentDisplayed = metExploreD3.getGeneralStyle().isDisplayedConvexhulls();
        var group = null;
        if(componentDisplayed=="Compartments"){
            this.groups.forEach(function(agroup){
                if (agroup.key.identifier==key)         
                    group = agroup ; 
            });
        }
        else
        {
            this.groups.forEach(function(agroup){
                if (agroup.key==key)         
                    group = agroup ; 
            });
        }
        return group; 
    },
    removeAGroup:function (group) {
        var index = this.groups.indexOf(group);
        if(index!=-1)
            this.groups.slice(index,1);

    },
    getActiveMapping:function()
    {
       return this.activeMapping;
    },    
    setActiveMapping:function(activeMapping)
    {
        this.nodesMap = [];
        this.activeMapping = activeMapping;
    },

    // ColorMapping
    getColorMappingsSet : function(){
        return this.colorMappings;
    },
    getColorMappingById : function(id){
        var theColorMapping = null;
        this.colorMappings.forEach(function(aColorMapping){            
            if(aColorMapping.getName()==id)
                theColorMapping = aColorMapping;
        });
        return theColorMapping;
    }, 
    getColorMappingsSetLength : function(){
        return this.colorMappings.length;
    },
    resetColorMapping : function(){
        this.colorMappings = [];
    },
    addColorMapping : function(n, c){
        this.colorMappings.push(new ColorMapping(n,c)); 
    },

    // ColorSuggestion
    getColorSuggestionsSet : function(){
        return this.colorSuggestions;
    },
    removeColorSuggestionById : function(id){
        var theColorSuggestion = null;
        theColorSuggestionIndex = this.colorSuggestions.findIndex(function(aColorSuggestion){
            return aColorSuggestion.getName()===id;
        });
        this.colorSuggestions.splice(theColorSuggestionIndex, 1);
    }, 
    getColorSuggestionById : function(id){
        var theColorSuggestion = null;
        this.colorSuggestions.forEach(function(aColorSuggestion){
            if(aColorSuggestion.getName()===id)
                theColorSuggestion = aColorSuggestion;
        });
        return theColorSuggestion;
    }, 
    getColorSuggestionsSetLength : function(){
        return this.colorSuggestions.length;
    },
    resetColorSuggestion : function(){
        this.colorSuggestions = [];
    },
    addColorSuggestion : function(n, c){
        this.colorSuggestions.push(new ColorMapping(n,c));
    },

    // ColorComponent
    getColorComponentsSet : function(){
        return this.colorComponents;
    },
    getColorComponentById : function(id){
        var theColorComponent = null;
        this.colorComponents.forEach(function(aColorComponent){
            if(aColorComponent.getName()==id)
                theColorComponent = aColorComponent;
        });
        return theColorComponent;
    },
    getColorComponentsSetLength : function(){
        return this.colorComponents.length;
    },
    resetColorComponent : function(){
        this.colorComponents = [];
    },
    addColorComponent : function(n, c){
        this.colorComponents.push(new ColorComponent(n,c));
    },

    addSelectedNode : function(nodeId){
        if(this.selectedNodes==undefined)
            this.selectedNodes = [];
        this.selectedNodes.push(nodeId);

        metExploreD3.fireEvent("metaboliteStyleForm", "updateSelectionSet");
        metExploreD3.fireEvent("reactionStyleForm", "updateSelectionSet");
    },
    addSelectedPathway : function(pathid){
        if(this.selectedPathways==undefined)
            this.selectedPathways = [];
        this.selectedPathways.push(pathid);
    },
    addMappedNode : function(nodeId){
        if(this.nodesMap==undefined)
            this.nodesMap = [];
        this.nodesMap.push(nodeId);
    },

    addDuplicatedNode : function(nodeId){
        if(this.duplicatedNodes==undefined)
            this.duplicatedNodes = [];
        this.duplicatedNodes.push(nodeId);
    },

    isAnimated : function(){
        return this.animated;
    },

    setAnimated : function(bool){
        this.animated = bool;
    },

    isActive : function(){
        return this.active;
    },

    setActivity : function(bool){
        this.active = bool;
    },

    /**
    * Add an array of nodes to the selection
    */
    addSelectedNodes : function(nodeIds){
        if(this.selectedNodes==undefined)
            this.selectedNodes = [];
        for(n in nodeIds)
        {
            this.selectedNodes.push(nodeId);                
        }
        metExploreD3.fireEvent("metaboliteStyleForm", "updateSelectionSet");
        metExploreD3.fireEvent("reactionStyleForm", "updateSelectionSet");
    },

    /**
    * Add an array of nodes to the selection
    */
    addDuplicatedNodes : function(nodeIds){
        if(this.duplicatedNodes==undefined)
            this.duplicatedNodes = [];
        for(n in nodeIds)
        {
            this.duplicatedNodes.push(nodeId);                
        }
    },

    reset : function(){
        this.emptyMetabolites();
        this.emptyReactions();
        this.selectedNodes = [];
        this.selectedPathways = [];
        this.groups = [];
        this.nodesMap = [];
        metExploreD3.fireEvent("metaboliteStyleForm", "updateSelectionSet");
        metExploreD3.fireEvent("reactionStyleForm", "updateSelectionSet");
    },

    getId:function()
    {
       return this.id;
    },    
    setId:function(newId)
    {
       this.id = newId;
    },

    getScale:function()
    {
       return this.scale;
    },    
    setScale:function(newscale)
    {
       this.scale = newscale;
    },

    getDisplayNodeName:function()
    {
       return this.displayNodeName;
    },    
    setDisplayNodeName:function(displayName)
    {
       this.displayNodeName = displayName;
    },

    getMetaboliteStyle:function()
    {
        return this.metaboliteStyle;
    },
    setMetaboliteStyle:function(met)
    {
        this.metaboliteStyle = met;
    },
    
    getMappingDataType:function()
    {
        return this.mappingDataType;
    },
    setMappingDataType:function(met)
    {
        this.mappingDataType = met;
    },

    isResizable:function()
    {
        return this.resizable;
    },
    setResizable:function(bool)
    {
        this.resizable = bool;
    },

    isMapped:function()
    {
        return this.mapped;
    },
    setMapped:function(bool)
    {
        this.mapped = bool;
    },

    isLinked:function()
    {
        return this.linked;
    },
    setLinked:function(bool)
    {
        this.linked = bool;
    },

    getLinkStyle:function()
    {
        return this.linkStyle;
    },
    setLinkStyle:function(link)
    {
        this.linkStyle = link;
    },

    getReactionStyle:function()
    {
        return this.reactionStyle;
    },
    setReactionStyle:function(reac)
    {
        this.reactionStyle = reac;
    },

    getD3Data:function()
    {
        return this.d3Data;
    },
    setD3Data:function(d3Data)
    {
        this.d3Data = d3Data;
    },

    getForce:function()
    {
        return this.force;
    },
    setForce:function(force)
    {
        this.force = force;
    },

    getForceCentroids:function()
    {
        return this.forceCentroids;
    },
    setForceCentroids:function(force)
    {
        this.forceCentroids = force;
    },

    getNodesMap : function(){
        if (this.nodesMap==undefined)
            this.nodesMap = [];
        return this.nodesMap;
    },        

    //Clearly not optimal...
    removeSelectedNode:function(nodeId){
        var found=false;
        var i=0;
        while(!found)
        {
            if(this.selectedNodes[i]==nodeId)
            {
                this.selectedNodes.splice(i,1);
                found=true;        
            }
            i++;
        }
        metExploreD3.fireEvent("metaboliteStyleForm", "updateSelectionSet");
        metExploreD3.fireEvent("reactionStyleForm", "updateSelectionSet");
    },

    removeAllSelectedNodes:function(){
        this.selectedNodes = [];
        metExploreD3.fireEvent("metaboliteStyleForm", "updateSelectionSet");
        metExploreD3.fireEvent("reactionStyleForm", "updateSelectionSet");
    },

    getSelectedNodes:function(){
        return this.selectedNodes;
    },

    //Clearly not optimal...
    removeSelectedPathway:function(pathwayId){
        var found=false;
        var i=0;
        while(!found)
        {
            if(this.selectedPathways[i]==pathwayId)
            {
                this.selectedPathways.splice(i,1);
                found=true;
            }
            i++;
        }
    },

    removeAllSelectedPathways:function(){
        this.selectedPathways = [];
    },

    getSelectedPathways:function(){
        return this.selectedPathways;
    },

    //Clearly not optimal...
    removeDuplicatedNode:function(nodeId){
        var found=false;
        var i=0;
        while(!found)
        {
            if(this.duplicatedNodes[i]==nodeId)
            {
                this.duplicatedNodes.splice(i,1);
                found=true;        
            }
            i++;
        }
    },

    removeAllDuplicatedNodes:function(){
        while(this.duplicatedNodes.length > 0) {
            this.duplicatedNodes.pop();
            }
    },
    
    getDuplicatedNodes:function(){
        return this.duplicatedNodes;
    },

    getDuplicatedNodesCount:function(){
        return this.duplicatedNodes.length;
    },

    removeReaction : function(reactionID){
        var found=false;
        var i=0;
        while(!found)
        {
            if(this.getReactions()[i].id==reactionID)
            {
                this.getReactions().splice(i,1);
                found=true;        
            }
            i++;
        }
    },
    removeMetabolite : function(metaboliteID){
        var found=false;
        var i=0;
        while(!found)
        {
            if(this.getMetabolites()[i].id==metaboliteID)
            {
                this.getMetabolites().splice(i,1);
                found=true;        
            }
            i++;
        }
    },
    // getReactions:function(){return this.data.reactions;},
    getReactions:function(){return this.reactions;},
    getMetabolites:function(){return this.metabolites;},
    emptyReactions:function(){this.reactions = [];},
    emptyMetabolites:function(){this.metabolites = [];},
    //Default is 'D3' for D3.js
    //'cytoscape' is for Cytoscape.js
    setVizEngine:function(viz){this.vizEngine = viz;},
    getVizEngine:function(){return this.vizEngine;}
};