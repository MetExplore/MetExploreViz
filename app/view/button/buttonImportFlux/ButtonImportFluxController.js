/**
 * @author JCG
 * ButtonImportFluxController : Allows flux data import from a tab file
 * This class is the controller for the ButtonImportFlux view
 */
Ext.define('metExploreViz.view.button.buttonImportFlux.ButtonImportFluxController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.buttonImportFlux',

    init: function() {
		var me    = this,
		    view  = me.getView();

		// Listener which allows opening file manager of client side
        view.lookupReference('importFluxHidden').on({
			change: function(){
				metExploreD3.GraphUtils.handleFileSelect(view.lookupReference('importFluxHidden').fileInputEl.dom, me.loadData);
                view.lookupReference('importFluxHidden').fileInputEl.dom.value = "";
			},
			scope:me
		});
	},

	/*****************************************************
	 * Parse file and create flux object
     * @param tabTxt : file content
     * @param title : file title
     */
	loadData : function(tabTxt, title) {
		var me=this;
		var data = tabTxt;
		tabTxt = tabTxt.replace(/\r/g, "");
	    var lines = tabTxt.split('\n');

	    var firstLine = lines.splice(0, 1);
	    firstLine = firstLine[0].split('\t');

        var conditions = [];
        var sdConditions = [];
        var conditionsIndex = [];
        var sdIndex = [0];
        for (var i = 0; i < firstLine.length; i++){
            if (firstLine[i].includes("sd_")){
                sdConditions.push(firstLine[i]);
                sdIndex.push(i);
            }
            else {
                conditions.push(firstLine[i]);
                conditionsIndex.push(i);
            }
        }

	    var targetName = conditions.splice(0, 1);

	    var array = [];

        for (var i = 0; i < _metExploreViz.flux.length; i++){
            if (title === _metExploreViz.flux[i].name){
                metExploreD3.displayWarning("Loaded file", "This file has already been loaded");
                return;
            }
        }

        var fluxData = [];
        var sdData = [];

		if(targetName[0]=="Identifier" || targetName[0]=="reactionId" || targetName[0]=="Name") {
		    var flux = new Flux(title, conditions, targetName[0], array);
            for (var i = lines.length - 1; i >= 0; i--) {
                lines[i] = lines[i].split('\t').map(function (val) {
        				return val.replace(",", ".");
        		});
                if (lines[i].length === 1){
                    continue;
                }
                var tmpFlux = [];
                var tmpSd = [];
                for (var j = 0; j < sdIndex.length; j++){
                    if (lines[i] !== undefined){
                        tmpSd.push(lines[i][sdIndex[j]]);
                    }
                }
                for (var k = 0; k < conditionsIndex.length; k++){
                    if (lines[i] !== undefined){
                        tmpFlux.push(lines[i][conditionsIndex[k]]);
                    }
                }
                sdData.push(tmpSd);
                fluxData.push(tmpFlux);
    	    }
            flux.data = fluxData;
            flux.sdData = sdData;
            flux.sdConditions = sdConditions;

            _metExploreViz.addFlux(flux);
            metExploreD3.fireEvent("fluxMapping","fileParse");
            metExploreD3.fireEvent("fluxMapping","fileLoad");
            // metExploreD3.fireEvent("comparisonSidePanel","newFlux");
        }
        else {
			// Warning for bad syntax file
			metExploreD3.displayWarning("Syntaxe error",
                'File have bad syntax. See <a target="_blank" href="http://metexplore.toulouse.inra.fr/metexploreViz/doc/documentation.php#fluxImport">MetExploreViz documentation</a>.'
            );
		}
	}

});
