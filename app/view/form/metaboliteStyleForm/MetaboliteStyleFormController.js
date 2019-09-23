
/**
 * @author MC
 * (a)description class to control metabolite styles or configs
 */

Ext.define('metExploreViz.view.form.metaboliteStyleForm.MetaboliteStyleFormController', {
	extend: 'Ext.app.ViewController',
	alias: 'controller.form-metaboliteStyleForm-metaboliteStyleForm',

	/**
	 * Init function Checks the changes on metabolite style
	 */
	init : function() {
		var me 		= this,
		view      	= me.getView();
			
		view.on({
			setMetaboliteStyle : function(){
				var s_MetaboliteStyle = metExploreD3.getMetaboliteStyle();
				
		        view.lookupReference('chooseHeightMetabolite').setValue(s_MetaboliteStyle.getHeight());   
	
		        view.lookupReference('chooseWidthMetabolite').setValue(s_MetaboliteStyle.getWidth());   
	
		        view.lookupReference('chooseRxMetabolite').setValue(s_MetaboliteStyle.getRX());   
		   
		        view.lookupReference('chooseRyMetabolite').setValue(s_MetaboliteStyle.getRY());   
		    
		        view.lookupReference('chooseStrokeMetabolite').setValue(s_MetaboliteStyle.getStrokeWidth());   
		   
      			Ext.getCmp('selectDisplayMetaboliteLabel').setValue(s_MetaboliteStyle.getLabel());   

      			view.lookupReference('checkboxAlias').setValue(s_MetaboliteStyle.isUseAlias());
			},
			scope:me
		});

		view.on({
			checkCheckboxAlias : function(){
				view.lookupReference('checkboxAlias').setValue(true);
				view.lookupReference('checkboxAlias').checked=true;
			},
			scope : me
		});

		view.lookupReference('refreshMetaboliteStyle').on({
			click : function() 
			{	
				var s_MetaboliteStyle = metExploreD3.getMetaboliteStyle();
				var isset = false;
				
				var height = view.lookupReference('chooseHeightMetabolite').getValue();
				var newHeight = ((!isNaN(height) && height>0 && height<200) ? height : s_MetaboliteStyle.getHeight());
				
				var width = view.lookupReference('chooseWidthMetabolite').getValue();
				var newWidth = (!isNaN(width) && width>0 && width<200) ? width : s_MetaboliteStyle.getWidth();
				
				var strokewidth = view.lookupReference('chooseStrokeMetabolite').getValue();
				var newstrokewidth = (!isNaN(strokewidth) && strokewidth>0 && strokewidth<200) ? strokewidth :s_MetaboliteStyle.getStrokeWidth();
				
				var rx = view.lookupReference('chooseRxMetabolite').getValue();
				var newrx = (!isNaN(rx) && rx>=-100 && rx<200) ? rx : s_MetaboliteStyle.getRX();
				
				var ry = view.lookupReference('chooseRyMetabolite').getValue();
				var newry = (!isNaN(ry) && ry>=0 && ry<200) ? ry : s_MetaboliteStyle.getRY();

				var newLabel = view.lookupReference('selectDisplayMetaboliteLabel').getValue();
				var isAlias = view.lookupReference('checkboxAlias').getValue();
			    
				if(newLabel!==s_MetaboliteStyle.getLabel()
                    || isAlias!==s_MetaboliteStyle.isUseAlias()
                    || (newHeight !== s_MetaboliteStyle.getHeight())
					|| (newWidth !== s_MetaboliteStyle.getWidth())
					|| (newstrokewidth !== s_MetaboliteStyle.getStrokeWidth())
					|| (newrx !== s_MetaboliteStyle.getRX())
					|| (newry !== s_MetaboliteStyle.getRY())
				){
					isset=true;
					s_MetaboliteStyle.setHeight(parseFloat(newHeight));
					s_MetaboliteStyle.setWidth(parseFloat(newWidth));
					s_MetaboliteStyle.setStrokeWidth(parseFloat(newstrokewidth));
					s_MetaboliteStyle.setRX(parseFloat(newrx));
					s_MetaboliteStyle.setRY(parseFloat(newry));
					s_MetaboliteStyle.setLabel(newLabel);
					s_MetaboliteStyle.setUseAlias(isAlias);
				}		

				if(isset){
					metExploreD3.GraphNode.refreshStyleOfMetabolite();								
					metExploreD3.GraphCaption.refreshStyleOfMetabolite();								
				}
			},
			scope : me
		});

		view.lookupReference('chooseHeightMetabolite').on({
			afterrender: function(){
				var s_MetaboliteStyle = metExploreD3.getMetaboliteStyle();
				
		        view.lookupReference('chooseHeightMetabolite').setValue(s_MetaboliteStyle.getHeight());   
		    },
		    change: function(thas, newValue){
				if(!isNaN(newValue) && newValue>0 && newValue<200){
		    		me.changeHeight(newValue);
				}
			},
			scope : me
		});

		view.lookupReference('chooseWidthMetabolite').on({
			afterrender: function(){
				var s_MetaboliteStyle = metExploreD3.getMetaboliteStyle();
				
		        view.lookupReference('chooseWidthMetabolite').setValue(s_MetaboliteStyle.getWidth());   
		    },
		    change: function(thas, newValue){
				if(!isNaN(newValue) && newValue>0 && newValue<200){
		    		me.changeWidth(newValue);
				}
			},
			scope : me
		});

		view.lookupReference('chooseStrokeMetabolite').on({
			afterrender: function(){
				var s_MetaboliteStyle = metExploreD3.getMetaboliteStyle();
				
		        view.lookupReference('chooseStrokeMetabolite').setValue(s_MetaboliteStyle.getStrokeWidth());   
		    },
		    change: function(that, newValue){
				if(!isNaN(newValue) && newValue>0 && newValue<200){
		    		me.changeStroke(newValue);
				}
			},
			scope : me
		});

		view.lookupReference('checkboxAlias').on({
			afterrender: function(){
				var s_MetaboliteStyle = metExploreD3.getMetaboliteStyle();

		        view.lookupReference('checkboxAlias').setValue(s_MetaboliteStyle.isUseAlias());
		    },
			scope : me
		});

		view.lookupReference('chooseRxMetabolite').on({
			afterrender: function(){
				var s_MetaboliteStyle = metExploreD3.getMetaboliteStyle();
				
		        view.lookupReference('chooseRxMetabolite').setValue(s_MetaboliteStyle.getRX());   
		    },
		    change: function(thas, newValue){
				if(!isNaN(newValue) && newValue>=0 && newValue<200){
		    		me.changeRx(newValue);
				}
			},
			scope : me
		});

		view.lookupReference('chooseRyMetabolite').on({
			afterrender: function(){
				var s_MetaboliteStyle = metExploreD3.getMetaboliteStyle();
				
		        view.lookupReference('chooseRyMetabolite').setValue(s_MetaboliteStyle.getRY());   
		    },
		    change: function(thas, newValue){
				if(!isNaN(newValue) && newValue>=0 && newValue<200){
		    		me.changeRy(newValue);
				}
			},
			scope : me
		});

		this.control({
			'metaboliteStyleForm' : {
		        show : function() {
					this.displayNode();
				} 
			},
			// Listeners to manage changed of label nodes
			'selectDisplayMetaboliteLabel': 
			{
				afterrender: function(me){
					var s_MetaboliteStyle = metExploreD3.getMetaboliteStyle();
					
			        me.setValue(s_MetaboliteStyle.getLabel());   
			    },
				change : function(that, newLabel){
					me.changeLabel(newLabel);
				}
			}
		});
	},
	changeHeight : function(height) {
		metExploreD3.NodeStyleForm.changeHeightExemple(height, "Metabolite");
	},

	changeWidth : function(width) {
		metExploreD3.NodeStyleForm.changeWidthExemple(width, "Metabolite");
	},

	changeStroke : function(stroke) {
		metExploreD3.NodeStyleForm.changeStrokeExemple(stroke, "Metabolite");
	},

	changeRx : function(rx) {
		metExploreD3.NodeStyleForm.changeRxExemple(rx, "Metabolite");
	},

	changeRy : function(ry) {
		metExploreD3.NodeStyleForm.changeRyExemple(ry, "Metabolite");
	},

	changeLabel : function(label) {
		metExploreD3.NodeStyleForm.changeLabelExemple(label, "Metabolite");
	},

	displayNode : function() {
		metExploreD3.NodeStyleForm.displayNodeExemple("Metabolite");
	},

	zoom:function() {
		metExploreD3.NodeStyleForm.zoomExemple("Metabolite");
	}
	
});

