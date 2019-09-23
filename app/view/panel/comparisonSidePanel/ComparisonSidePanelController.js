Ext.define('metExploreViz.view.panel.comparisonSidePanel.ComparisonSidePanelController', {
	extend: 'Ext.app.ViewController',
	alias: 'controller.panel-comparisonSidePanel-comparisonSidePanel',

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

		view.lookupReference('cycleDetectionPanel').on({
			listCycles : me.listCycles,
			scope:me
		});

		view.lookupReference('buttonDrawCycle').on({
			click:me.drawMetaboliteCycle,
			scope:me
		});

        view.lookupReference('buttonHideCycle').on({
            click:me.hideMetaboliteCycle,
            scope:me
        });
	},
	
	drawCaption : function(){
		metExploreD3.GraphCaption.drawCaption();
	},

    drawMetaboliteCycle: function () {
        this.lookupReference('cycleDetectionPanel').items.each(function (d) {
			if (d.checked){
                metExploreD3.GraphFunction.drawMetaboliteCycle(d.cycle);
			}
        })
    },

    hideMetaboliteCycle: function () {
        this.lookupReference('cycleDetectionPanel').items.each(function (d) {
            if (d.checked){
                d.setValue(false);
                metExploreD3.GraphFunction.removeHighlightCycle(d.cycle);
            }
        })
    },

	listCycles: function (cycles) {
	    this.lookupReference('cycleDetection').setVisible(true);
        this.lookupReference('cycleDetectionPanel').removeAll(true);
        if (cycles.length > 0) {
            for (var i = 0; i < cycles.length; i++) {
                var newCheckbox = Ext.create('Ext.form.field.Radio', {
                    reference: 'radioCycle' + i,
                    boxLabel: 'Cycle ' + (i + 1),
                    name: 'cycle',
                    cycle: cycles[i],
                    margin: '0 0 0 20',
                    listeners: {
                        change: function () {
                            if (this.checked === true) {
                                metExploreD3.GraphFunction.highlightCycle(this.cycle);
                            }
                        }
                    }

                });
                this.lookupReference('cycleDetectionPanel').add(newCheckbox);
                if (i === 0) {
                    this.lookupReference('radioCycle' + i).setValue(true);
                }
            }
            this.getView().expand();
            this.lookupReference('cycleDetection').expand();
            Ext.getCmp('selectConditionForm').collapsed = true;
            Ext.getCmp('captionFormPathways').collapsed = true;
            Ext.getCmp('captionFormCompartments').collapsed = true;
            this.lookupReference('buttonDrawCycle').show();
            this.lookupReference('buttonHideCycle').show();
        }
        else {
            this.lookupReference('buttonDrawCycle').hide();
            this.lookupReference('buttonHideCycle').hide();
		}
    }
});
