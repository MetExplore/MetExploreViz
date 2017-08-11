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
				enabledTo: ["Cottret", "Poupin", "Chazalviel", "Jourdan"]
			},
        	"layouts":
            {
                description: "layouts",
                enabledTo: ["nobodyhasacces"]
            },
            "algorithm":
            {
                description: "layouts",
                enabledTo: ["nobodyhasacces"]
            },
            "align":
            {
                description: "align",
                enabledTo: ["all"]
            }
	},

    isEnabled : function(feature, currentUser) {
    	if(this.features[feature]!=undefined)
    	 	return this.isEnabledForUser(feature, currentUser) || this.isEnabledForAll(feature) ;
    	return false;
    }, 
   
    isEnabledForUser : function(feature, currentUser) {
    	if(this.features[feature]!=undefined)
    		return this.features[feature].enabledTo.indexOf(currentUser)!=-1;
    	return false;
    },

    isEnabledForAll : function(feature) {
    	if(this.features[feature]!=undefined)
    		return this.features[feature].enabledTo.indexOf("all")!=-1;
    	return false;
    }
}