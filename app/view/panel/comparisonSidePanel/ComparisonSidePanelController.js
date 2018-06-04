Ext.define('metExploreViz.view.panel.comparisonSidePanel.ComparisonSidePanelController', {
	extend: 'Ext.app.ViewController',
	alias: 'controller.panel-comparisonSidePanel-comparisonSidePanel',

	// requires:['metexplore.model.d3.Network','metexplore.global.Graph'],


/**
 * Aplies event linsteners to the view
 */
	init:function(){
		var me 		= this,
		viewModel   = me.getViewModel(),
		view      	= me.getView();

		view.on({
			newMapping : me.drawCaption,
			scope:me
		});

		view.lookupReference('buttonDetectCycles').on({
			click:me.listGraphCycles,
			scope:me
		})
	},
	
	drawCaption : function(){
		metExploreD3.GraphCaption.drawCaption();
	},

    listGraphCycles: function () {
		var that = this;
        this.lookupReference('cycleDetectionPanel').removeAll(true);
        var result = [];
        /*d3.select("#viz").select("#D3viz").select("#graphComponent").selectAll("g.node")
            .filter(function (d) {
            	return d.id === "6632246";
            }).each(function (d) {
            	result = metExploreD3.GraphStyleEdition.findCycle(d);
        });*/
        var result = metExploreD3.GraphStyleEdition.findCycle2();
		console.log("Component :");
		for (var i=0; i<result.length; i++){
            var newCheckbox = Ext.create('Ext.form.field.Checkbox', {
            	reference: 'checkboxCycle' + i,
                boxLabel: 'Highlight Cycle ' + (i + 1),
                margin: '0 0 0 10',
				listValue: i,
				cycle: result[i],
				listeners: {
            		change: function () {
						if (this.checked === true){
                            metExploreD3.GraphStyleEdition.highlightCycle(this.cycle);
						}
						else if (this.checked === false){
                            metExploreD3.GraphStyleEdition.removeHighlightCycle(this.cycle);
						}
                    }
				}
            });
            this.lookupReference('cycleDetectionPanel').add(newCheckbox);
		}
    }
});
