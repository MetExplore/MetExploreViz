/**
 * @author MC
 * (a)description : Feature flipping allows to enable fonction in function of user
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
                enabledTo: ["Cottret", "Poupin", "Chazalviel", "Jourdan"]
            },
            "algorithm":
            {
                description: "layouts",
                enabledTo: ["Cottret", "Poupin", "Chazalviel", "Jourdan"]
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