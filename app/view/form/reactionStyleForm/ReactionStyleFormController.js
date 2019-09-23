
/**
 * @author MC
 * (a)description class to control reaction styles or configs
 */

Ext.define('metExploreViz.view.form.reactionStyleForm.ReactionStyleFormController', {
	extend: 'Ext.app.ViewController',
	alias: 'controller.form-reactionStyleForm-reactionStyleForm',

	/**
	 * Init function Checks the changes on reaction style
	 */
	init : function() {
		var me 		= this,
		view      	= me.getView();
		
		view.on({
			setReactionStyle : function(){
				var s_ReactionStyle = metExploreD3.getReactionStyle();
				
		        view.lookupReference('chooseHeightReaction').setValue(s_ReactionStyle.getHeight());   
	
		        view.lookupReference('chooseWidthReaction').setValue(s_ReactionStyle.getWidth());   
	
		        view.lookupReference('chooseRxReaction').setValue(s_ReactionStyle.getRX());   
		   
		        view.lookupReference('chooseRyReaction').setValue(s_ReactionStyle.getRY());   
		    
		        view.lookupReference('chooseStrokeReaction').setValue(s_ReactionStyle.getStrokeWidth());   
		    
		    	view.down('#hiddenColor').lastValue = s_ReactionStyle.getStrokeColor();
				
				metExploreD3.fireEventArg("chooseStrokeColorReactionPicker", "change", s_ReactionStyle.getStrokeColor());

      			Ext.getCmp('selectDisplayReactionLabel').setValue(s_ReactionStyle.getLabel());   
			
				view.lookupReference('checkboxAlias').setValue(s_ReactionStyle.isUseAlias());
			
			},
			scope:me
		});

		view.lookupReference('refreshReactionStyle').on({
			click : function() 
			{	
				var s_ReactionStyle = metExploreD3.getReactionStyle();
				var isset = false;
				
				var height = view.lookupReference('chooseHeightReaction').getValue();
				var newHeight = ((!isNaN(height) && height>0 && height<200) ? height : s_ReactionStyle.getHeight());
				
				var color = view.down('#hiddenColor').lastValue;
				var newColor = (color!=='init' ? color : s_ReactionStyle.getStrokeColor());
				
				var width = view.lookupReference('chooseWidthReaction').getValue();
				var newWidth = (!isNaN(width) && width>0 && width<200) ? width : s_ReactionStyle.getWidth();
				
				var strokewidth = view.lookupReference('chooseStrokeReaction').getValue();
				var newstrokewidth = (!isNaN(strokewidth) && strokewidth>0 && strokewidth<200) ? strokewidth :s_ReactionStyle.getStrokeWidth();
				
				var rx = view.lookupReference('chooseRxReaction').getValue();
				var newrx = (!isNaN(rx) && rx>=0 && rx<200) ? rx : s_ReactionStyle.getRX();
				
				var ry = view.lookupReference('chooseRyReaction').getValue();
				var newry = (!isNaN(ry) && ry>=0 && ry<200) ? ry : s_ReactionStyle.getRY();

				var newLabel = view.lookupReference('selectDisplayReactionLabel').getValue();
				var isAlias = view.lookupReference('checkboxAlias').getValue();

				if(newLabel!=s_ReactionStyle.getLabel()
                    || isAlias!==s_ReactionStyle.isUseAlias()
					|| (newHeight != s_ReactionStyle.getHeight())
					|| (newWidth != s_ReactionStyle.getWidth())
					|| (newstrokewidth != s_ReactionStyle.getStrokeWidth())
					|| (newrx != s_ReactionStyle.getRX())
					|| (newry != s_ReactionStyle.getRY())
					|| (newColor != s_ReactionStyle.getStrokeColor())
				){
					isset=true;
					s_ReactionStyle.setStrokeColor(newColor);
					s_ReactionStyle.setHeight(parseFloat(newHeight));
					s_ReactionStyle.setWidth(parseFloat(newWidth));
					s_ReactionStyle.setStrokeWidth(parseFloat(newstrokewidth));
					s_ReactionStyle.setRX(parseFloat(newrx));
					s_ReactionStyle.setRY(parseFloat(newry));
					s_ReactionStyle.setLabel(newLabel);
					s_ReactionStyle.setUseAlias(isAlias);
				}	

				if(isset){
					metExploreD3.GraphNode.refreshStyleOfReaction();							
					metExploreD3.GraphCaption.refreshStyleOfReaction();							

				}
			},
			scope : me
		});


		view.lookupReference('checkboxAlias').on({
			afterrender: function(){
				var s_ReactionStyle = metExploreD3.getReactionStyle();

		        view.lookupReference('checkboxAlias').setValue(s_ReactionStyle.isUseAlias());
		    },
			scope : me
		});
		
		view.lookupReference('chooseHeightReaction').on({
			afterrender: function(me){
				var s_ReactionStyle = metExploreD3.getReactionStyle();
				
		        view.lookupReference('chooseHeightReaction').setValue(s_ReactionStyle.getHeight());   
		    },
		    change: function(thas, newValue, oldValue){
				if(!isNaN(newValue) && newValue>0 && newValue<200){
		    		me.changeHeight(newValue);
				}
			},
			scope : me
		});

		view.lookupReference('chooseWidthReaction').on({
			afterrender: function(me){
				var s_ReactionStyle = metExploreD3.getReactionStyle();
				
		        view.lookupReference('chooseWidthReaction').setValue(s_ReactionStyle.getWidth());   
		    },
		    change: function(thas, newValue, oldValue){
				if(!isNaN(newValue) && newValue>0 && newValue<200){
		    		me.changeWidth(newValue);
				}
			},
			scope : me
		});

		view.lookupReference('chooseRxReaction').on({
			afterrender: function(me){
				var s_ReactionStyle = metExploreD3.getReactionStyle();
				
		        view.lookupReference('chooseRxReaction').setValue(s_ReactionStyle.getRX());   
		    },
		    change: function(thas, newValue, oldValue){
				if(!isNaN(newValue) && newValue>=0 && newValue<200){
		    		me.changeRx(newValue);
				}
			},
			scope : me
		});

		view.lookupReference('chooseRyReaction').on({
			afterrender: function(me){
				var s_ReactionStyle = metExploreD3.getReactionStyle();
				
		        view.lookupReference('chooseRyReaction').setValue(s_ReactionStyle.getRY());   
		    },
		    change: function(thas, newValue, oldValue){
				if(!isNaN(newValue) && newValue>=0 && newValue<200){
		    		me.changeRy(newValue);
				}
			},
			scope : me
		});

		view.lookupReference('chooseStrokeReaction').on({
			afterrender: function(me){
				var s_ReactionStyle = metExploreD3.getReactionStyle();
				
		        view.lookupReference('chooseStrokeReaction').setValue(s_ReactionStyle.getStrokeWidth());   
		    },
		    change: function(thas, newValue, oldValue){
				if(!isNaN(newValue) && newValue>0 && newValue<200){
		    		me.changeStroke(newValue);
				}
			},
			scope : me
		});

		view.down('#hiddenColor').on({
		    change: function(newValue, oldValue){
		    	view.down('#hiddenColor').lastValue = newValue.value;
			},
			scope : me
		});

		this.control({
			'reactionStyleForm' : {
				beforerender : function(){
					var reactionStyle = metExploreD3.getReactionStyle();


				 	var picker = new Ext.Panel({
				 		id:'chooseStrokeColorReactionPicker',
			            border:false,
                        html: '<input ' +
                        'type="color" ' +
                        'onchange="Ext.getCmp(\'reactionStyleForm\').down(\'#hiddenColor\').fireEvent(\'change\',this, \''+reactionStyle.getStrokeColor()+'\');" ' +
                        'value=\''+reactionStyle.getStrokeColor().split("#")[1]+'\'' +
                        '\'style="width:85%;">'
				 	});
	      			Ext.getCmp('chooseStrokeColorReaction').add(picker);	


		            //Ext.getCmp('reactionStyleForm').down('#hidden').fireEvent('change', reactionStyle.getStrokeColor(), 'init');
		        },
		        show : function() {
					this.displayNode();
				} 
			},
			// Listeners to manage changed of label nodes
			'selectDisplayReactionLabel': 
			{
				afterrender: function(me){
					var s_ReactionStyle = metExploreD3.getReactionStyle();
					
			        me.setValue(s_ReactionStyle.getLabel());   
			    },
				change : function(that, newLabel, old){
					me.changeLabel(newLabel);
				}
			}
		});

		
	},

	changeHeight : function(height) {
		metExploreD3.NodeStyleForm.changeHeightExemple(height, "Reaction");
	},

	changeWidth : function(width) {
		metExploreD3.NodeStyleForm.changeWidthExemple(width, "Reaction");
	},

	changeStroke : function(stroke) {
		metExploreD3.NodeStyleForm.changeStrokeExemple(stroke, "Reaction");
	},

	changeRx : function(rx) {
		metExploreD3.NodeStyleForm.changeRxExemple(rx, "Reaction");
	},

	changeRy : function(ry) {
		metExploreD3.NodeStyleForm.changeRyExemple(ry, "Reaction");
	},

	changeLabel : function(label) {
		metExploreD3.NodeStyleForm.changeLabelExemple(label, "Reaction");
	},

	displayNode : function() {
		metExploreD3.NodeStyleForm.displayNodeExemple("Reaction");
	},

	zoom:function() {
		metExploreD3.NodeStyleForm.zoomExemple("Reaction");
	}
});

