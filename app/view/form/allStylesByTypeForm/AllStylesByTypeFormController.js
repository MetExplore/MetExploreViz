
/**
 * @author MC
 * @description class to control settings or configs
 */

Ext.define('metExploreViz.view.form.allStylesByTypeForm.AllStylesByTypeFormController', {
	extend: 'Ext.app.ViewController',
	alias: 'controller.form-allStylesByTypeForm-allStylesByTypeForm',

	/**
	 * Init function Checks the changes on drawing style
	 */
	init : function() {
		var me 		= this,
		viewModel   = me.getViewModel(),
		view      	= me.getView();


		view.store.data.forEach(function (styleBar) {

			var myPanel = Ext.create('metExploreViz.view.form.aStyleForm.AStyleForm', {
				title: styleBar.title,
				access: styleBar.access,
				biologicalType: styleBar.biologicalType,
				styleType: styleBar.type,
				default: styleBar.default,
				min: styleBar.min,
				max: styleBar.max,
				styleName: styleBar.style,
				attrName: styleBar.attr,
				attrType: styleBar.attrType,
				target: styleBar.target
			});
			view.lookupReference("listPanel").add(myPanel);
		});

		view.on(
		{
			show : function biologicalTypeChange ( sender, value, oldValue, eOpts ) {
				var conditionStore = Ext.getStore("conditionStore");
				conditionStore.clearFilter();
				if(conditionStore)
					conditionStore.filter(function(map){
						if(view.title==="Metabolite")
							return map.get("biologicalType")==="metabolite";
						if(view.title==="Reaction" || view.title==="Link")
							return map.get("biologicalType")==="reaction";
						return false;
					})
			},
			afterStyleLoading : me.updateForm,
			updateSelectionSet : me.updateSelection,
			afterrender : me.createCaption,
			scope:me
		});
	},
    createCaption : function(){
		var me = this;
		var view = me.getView();
		if(view)
		{
			var parentElement = view.lookupReference("caption").el.dom;
			// Obtenir une référence au premier enfant
			var theFirstChild = parentElement.firstChild;

			// Créer un nouvel élément
			var newElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
			parentElement.insertBefore(newElement, theFirstChild);
			var svg = d3.select(newElement)
				.style("background-color", "#eee")
				.attr("height", "40")
				.attr("width", "100%");

			svg.append("polygon")
				.attr("points", "6,38 6,25 40,0 78,0 42,25 42,38")
				.attr("fill", "rgb(20, 71, 120)");

			svg.append("text")
				.text("Default")
				.attr("transform","translate(36, 22) rotate(-35)")
				.style("text-anchor","middle")
				.style("fill", "#ffffff");

			svg.append("polygon")
				.attr("points", "42,38 42,25 78,0 114,0 78,25 78,38")
				.attr("fill", "rgb(95, 130, 163)");

			svg.append("text")
				.text("Mapping")
				.attr("transform","translate(71, 22) rotate(-35)")
				.style("text-anchor","middle")
				.style("fill", "#ffffff");

			svg.append("polygon")
				.attr("points", "78,38 78,25 114,0 150,0 114,25 114,38")
				.attr("fill", "rgb(20, 71, 120)");

			svg.append("text")
				.text("Bypass")
				.attr("transform","translate(106, 22) rotate(-35)")
				.style("text-anchor","middle")
				.style("fill", "#ffffff");
		}
	},
    updateForm : function(){
		var me = this;
		var view = me.getView();
		if(view)
		{
			view.query("aStyleForm").forEach(function (aStyleForm) {
				metExploreD3.fireEvent(aStyleForm.id, "afterStyleLoading");
			});
		}
	},
	updateSelection : function(){
		var me = this;
		var view = me.getView();
		if(view)
		{
			if(view.rendered)
			{
				view.query("aStyleForm").forEach(function (aStyleForm) {
					metExploreD3.fireEvent(aStyleForm.id, "updateSelectionSet");
				});
			}
		}
	}
});

