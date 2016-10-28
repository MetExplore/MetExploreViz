/**
 * @author MC
 * @description : Feature flipping
 */
metExploreD3.Features = {
	
	features:
	{
			"highlightSubnetwork":
			{
				description: "highlightSubnetwork",
				enabledTo: ["lcottret", "npoupin"]
			},
			"drawHierarchicalLayout":
			{
				description: "drawHierarchicalLayout",
				enabledTo: ["lcottret", "npoupin"]
			}
	},

    isEnabled : function(feature, currentUser) {
    	 return this.isEnabledForUser(feature, currentUser) || this.isEnabledForAll(feature) ;
    }, 
   
    isEnabledForUser : function(feature, currentUser) {
    	return this.features[feature].enabledTo.indexOf(currentUser)!=-1;
    },

    isEnabledForAll : function(feature) {
    	return this.features[feature].enabledTo.indexOf("all")!=-1;
    }
}