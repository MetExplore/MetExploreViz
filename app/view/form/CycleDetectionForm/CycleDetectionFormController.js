
/**
 * @author MC
 * @description class to control settings or configs
 */

Ext.define('metExploreViz.view.form.cycleDetectionForm.CycleDetectionFormController', {
	extend: 'Ext.app.ViewController',
	alias: 'controller.form-cycleDetectionForm-cycleDetectionForm',

	/**
	 * Init function Checks the changes on drawing style
	 */
	init : function() {
		var me 		= this,
		viewModel   = me.getViewModel(),
		view      	= me.getView();

		view.on({
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

	drawMetaboliteCycle: function () {
		var me 		= this,
			viewModel   = me.getViewModel(),
			view      	= me.getView();

		this.lookupReference('cycleDetectionPanel').items.each(function (d) {
			if (d.checked){
				metExploreD3.GraphFunction.drawMetaboliteCycle(d.cycle);
			}
		})
	},

	hideMetaboliteCycle: function () {
		var me 		= this,
			viewModel   = me.getViewModel(),
			view      	= me.getView();

		this.lookupReference('cycleDetectionPanel').items.each(function (d) {
			if (d.checked){
				d.setValue(false);
				metExploreD3.GraphFunction.removeHighlightCycle(d.cycle);
			}
		})
	},

	listCycles: function (cycles) {
		var me 		= this,
			viewModel   = me.getViewModel(),
			view      	= me.getView();

		view.enable();
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
			Ext.getCmp('comparisonSidePanel').expand();
			view.show();
			view.expand();
			this.lookupReference('buttonDrawCycle').show();
			this.lookupReference('buttonHideCycle').show();
		}
		else {
			this.lookupReference('buttonDrawCycle').hide();
			this.lookupReference('buttonHideCycle').hide();
		}
	}
});

