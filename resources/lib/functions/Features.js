/**
 * @author MC
 * (a)description : Feature flipping allows to enable function in function of user
 */
metExploreD3.Features = {

	// functions swhich can be disabled
	features:
	{
			"highlightSubnetwork":
			{
				description: "highlightSubnetwork",
				enabledTo: []
			},
        	"layouts":
            {
                description: "layouts",
                enabledTo: []
            },
            "algorithm":
            {
                description: "layouts",
                enabledTo: []
            },
            "align":
            {
                description: "align",
                enabledTo: ["all"]
            }
	},

	/**
	 * Test if feature must be active for particular user or all users
	 * @param feature
	 * @param currentUser
	 * @returns {*|boolean|boolean}
	 */
    isEnabled : function(feature, currentUser) {
    	if(this.features[feature]!=undefined)
    	 	return this.isEnabledForUser(feature, currentUser) || this.isEnabledForAll(feature) ;
    	return false;
    },

	/**
	 * Test if feature must be active for particular user
	 * @param feature
	 * @param currentUser
	 * @returns {boolean}
	 */
    isEnabledForUser : function(feature, currentUser) {
    	if(this.features[feature]!=undefined)
    		return this.features[feature].enabledTo.indexOf(currentUser)!=-1;
    	return false;
    },

	/**
	 * Test if feature must be active for all users
	 * @param feature
	 * @returns {boolean}
	 */
    isEnabledForAll : function(feature) {
    	if(this.features[feature]!==undefined)
    		return this.features[feature].enabledTo.indexOf("all")!==-1;
    	return false;
    }
}