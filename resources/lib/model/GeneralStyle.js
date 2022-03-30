
/**
 * @author MC
 * (a)description
 */
 /**
 * General style
 */
var GeneralStyle = function(siteName, minContinuous, maxContinuous, max, dispLabel, dispLink, dispConvexhull, dispPathwaysOnLinks, clust, dispCaption, eventForNodeInfo, loadButtonHidden, windowsAlertDisable){
    this.websiteName = siteName;
    this.valueMinMappingContinuous = minContinuous;
    this.valueMaxMappingContinuous = maxContinuous;
    this.maxReactionThreshold = max;
    this.displayLabelsForOpt = dispLabel;
    this.displayLinksForOpt = dispLink;
    this.displayConvexhulls = dispConvexhull;
    this.displayPathwaysOnLinks = dispPathwaysOnLinks;
    this.displayCompartmentsOnLinks = false;
    this.displayCaption = dispCaption;
    this.eventForNodeInfo=eventForNodeInfo;
    this.loadButtonHidden=false;
    this.windowsAlertDisable=false;
    this.clustered=clust;
};

GeneralStyle.prototype = {
    loadButtonIsHidden:function(){
        return this.loadButtonHidden;
    },
    setLoadButtonIsHidden:function(bool){
        this.loadButtonHidden = bool;
        metExploreD3.fireEvent("graphPanel", "setLoadButtonHidden");
    },
    windowsAlertIsDisable:function(){
        return this.windowsAlertDisable;
    },
    setWindowsAlertDisable:function(bool){
        this.windowsAlertDisable = bool;
    },
    // Getters & Setters
    getValueMinMappingContinuous:function()
    {
      return this.valueMinMappingContinuous;
    },
    getValueMaxMappingContinuous:function()
    {
      return this.valueMaxMappingContinuous;
    },

    setMaxValueMappingContinuous:function(newValue)
    {
      this.valueMaxMappingContinuous = newValue;
    },

    setMinValueMappingContinuous:function(newValue)
    {
      this.valueMinMappingContinuous = newValue;
    },

    getWebsiteName:function(){return this.websiteName;},

//If there are less than this number of reactions in the store, then different graph components are displayed.
    getReactionThreshold:function(){return this.maxReactionThreshold;},
    setReactionThreshold:function(maxReaction){this.maxReactionThreshold = maxReaction;},

    hasEventForNodeInfo:function(){return this.eventForNodeInfo;},
    setEventForNodeInfo:function(bool){this.eventForNodeInfo = bool;},

    isDisplayedLabelsForOpt:function(){return this.displayLabelsForOpt;},
    setDisplayLabelsForOpt:function(dispLabel){this.displayLabelsForOpt = dispLabel;},

    isDisplayedLinksForOpt:function(){return this.displayLinksForOpt;},
    setDisplayLinksForOpt:function(dispLink){this.displayLinksForOpt = dispLink;},

    isDisplayedConvexhulls:function(){return this.displayConvexhulls;},
    setDisplayConvexhulls:function(dispConvexhull){this.displayConvexhulls = dispConvexhull;},

    isDisplayedPathwaysOnLinks:function(){return this.displayPathwaysOnLinks;},
    setDisplayPathwaysOnLinks:function(dispPathwaysOnLinks){this.displayPathwaysOnLinks = dispPathwaysOnLinks;},

    isDisplayedCompartmentsOnLinks:function(){return this.displayCompartmentsOnLinks;},
    setDisplayCompartmentsOnLinks:function(dispCompartmentsOnLinks){this.displayCompartmentsOnLinks = dispCompartmentsOnLinks;},

    isDisplayedCaption:function(){return this.displayCaption;},
    setDisplayCaption:function(dispCaption){this.displayCaption = dispCaption;},

    useClusters:function(){return this.clustered;},
    setUseClusters:function(bool){this.clustered = bool;}
};
