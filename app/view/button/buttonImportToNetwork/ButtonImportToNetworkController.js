/**
 * This class is the controller for the main view for the application. It is specified as
 * the "controller" of the Main view class.
 *
 * TODO - Replace this content of this view to suite the needs of your application.
 */
Ext.define('metExploreViz.view.button.buttonImportToNetwork.ButtonImportToNetworkController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.buttonImportToNetwork',
   
    init: function() {
		var me=this,
		viewModel = me.getViewModel(),
		view      = me.getView();		

		view.lookupReference('importNetwork').on({
			change: function () {
				metExploreD3.GraphUtils.handleFileSelect(view.lookupReference('importNetwork').fileInputEl.dom, metExploreD3.GraphPanel.refreshPanel);
				// Ext.create('Ext.window.Window', {
				//     title: 'Hello',
				//     height: 200,
				//     width: 400,
				//     layout: 'fit',
				//     items: {  // Let's put an empty grid in just to illustrate fit layout
				//         xtype: 'panel', // A dummy empty data store
				//         listeners: {
				//         	render : function(){
				//         		var categories2 = [
				// 		            'Alanine and aspartate metabolism',
				// 		            'Alkaloid synthesis',
				// 		            'Aminosugar metabolism',
				// 		            'Androgen and estrogen synthesis and metabolism',
				// 		            'Arachidonic acid metabolism',
				// 		            'Arginine and Proline Metabolism',
				// 		            'beta-Alanine metabolism',
				// 		            'Bile acid synthesis',
				// 		            'Biotin metabolism',
				// 		            'Blood group synthesis',
				// 		            'Butanoate metabolism',
				// 		            'C5-branched dibasic acid metabolism',
				// 		            'Cholesterol metabolism',
				// 		            'Chondroitin sulfate degradation',
				// 		            'Chondroitin synthesis',
				// 		            'Citric acid cycle',
				// 		            'CoA catabolism',
				// 		            'CoA synthesis',
				// 		            'Cysteine Metabolism',
				// 		            'Cytochrome metabolism',
				// 		            'D-alanine metabolism',
				// 		            'Dietary fiber binding',
				// 		            'Eicosanoid metabolism',
				// 		            'Exchange/demand reaction',
				// 		            'Fatty acid oxidation',
				// 		            'Fatty acid synthesis',
				// 		            'Folate metabolism',
				// 		            'Fructose and mannose metabolism',
				// 		            'Galactose metabolism',
				// 		            'Glutamate metabolism',
				// 		            'Glutathione metabolism',
				// 		            'Glycerophospholipid metabolism',
				// 		            'Glycine, serine, alanine and threonine metabolism',
				// 		            'Glycolysis/gluconeogenesis',
				// 		            'Glycosphingolipid metabolism',
				// 		            'Glyoxylate and dicarboxylate metabolism',
				// 		            'Heme degradation',
				// 		            'Heme synthesis',
				// 		            'Heparan sulfate degradation',
				// 		            'Histidine metabolism',
				// 		            'Hyaluronan metabolism',
				// 		            'Inositol phosphate metabolism',
				// 		            'Keratan sulfate degradation',
				// 		            'Keratan sulfate synthesis',
				// 		            'Limonene and pinene degradation',
				// 		            'Linoleate metabolism',
				// 		            'Lipoate metabolism',
				// 		            'Lysine metabolism',
				// 		            'Methionine and cysteine metabolism',
				// 		            'Miscellaneous',
				// 		            'N-glycan degradation',
				// 		            'N-glycan synthesis',
				// 		            'NAD metabolism',
				// 		            'Nucleotide interconversion',
				// 		            'Nucleotide salvage pathway',
				// 		            'Nucleotide sugar metabolism',
				// 		            'O-glycan synthesis',
				// 		            'Oxidative phosphorylation',
				// 		            'Pentose phosphate pathway',
				// 		            'Phenylalanine metabolism',
				// 		            'Phosphatidylinositol phosphate metabolism',
				// 		            'Propanoate metabolism',
				// 		            'Purine catabolism',
				// 		            'Purine synthesis',
				// 		            'Pyrimidine catabolism',
				// 		            'Pyrimidine synthesis',
				// 		            'Pyruvate metabolism',
				// 		            'R group synthesis',
				// 		            'ROS detoxification',
				// 		            'Selenoamino acid metabolism',
				// 		            'Sphingolipid metabolism',
				// 		            'Squalene and cholesterol synthesis',
				// 		            'Starch and sucrose metabolism',
				// 		            'Steroid metabolism',
				// 		            'Stilbene, coumarine and lignin synthesis',
				// 		            'Taurine and hypotaurine metabolism',
				// 		            'Tetrahydrobiopterin metabolism',
				// 		            'Thiamine metabolism',
				// 		            'Transport, endoplasmic reticular',
				// 		            'Transport, extracellular',
				// 		            'Transport, golgi apparatus',
				// 		            'Transport, lysosomal',
				// 		            'Transport, mitochondrial',
				// 		            'Transport, nuclear',
				// 		            'Transport, peroxisomal',
				// 		            'Triacylglycerol synthesis',
				// 		            'Tryptophan metabolism',
				// 		            'Tyrosine metabolism',
				// 		            'Ubiquinone synthesis',
				// 		            'Unassigned',
				// 		            'Urea cycle',
				// 		            'Valine, leucine, and isoleucine metabolism',
				// 		            'Vitamin A metabolism',
				// 		            'Vitamin B12 metabolism',
				// 		            'Vitamin B2 metabolism',
				// 		            'Vitamin B6 metabolism',
				// 		            'Vitamin C metabolism',
				// 		            'Vitamin D metabolism',
				// 		            'Vitamin E metabolism',
				// 		            'Xenobiotics metabolism'
				// 				];
				// 		        var conditions2=
				// 		        [
				// 		            {
				// 		                name: '3j',
				// 		                data: [-20.2, -20.02, -20.3, -2.5, -20.7, -30.1, -3.2,
				// 		                                -30.0, -30.2, -40.3, -4.4, -30.6, -30.1, -20.4,
				// 		                                -20.5, -20.3, -10.2, -0.6, -0.2, -0.0,-20.2, -20.02, -20.3, -2.5, -20.7, -30.1, -3.2,
				// 		                                -30.0, -30.2, -40.3, -4.4, -30.6, -30.1, -20.4,
				// 		                                -20.5, -20.3, -10.2, -0.6, -0.2, -0.0,-20.2, -20.02, -20.3, -2.5, -20.7, -30.1, -3.2,
				// 		                                -30.0, -30.2, -40.3, -4.4, -30.6, -30.1, -20.4,
				// 		                                -20.5, -20.3, -10.2, -0.6, -0.2, -0.0,-20.2, -20.02, -20.3, -2.5, -20.7, -30.1, -3.2,
				// 		                                -30.0, -30.2, -40.3, -4.4, -30.6, -30.1, -20.4,
				// 		                                -20.5, -20.3, -10.2, -0.6, -0.2, -0.0, -0.0]
				// 		            }, {
				// 		                name: '30j',
				// 		                data: [2.1, 2.0, 2.2, 2.4, 2.6, 3.0, 3.1, 2.9,
				// 		                                3.1, 4.1, 4.3, 33.6, 3.4, 2.6, 2.9, 2.9,
				// 		                                1.8, 1.2, 0.6, 0.1, 2.1, 2.0, 2.2, 2.4, 2.6, 3.0, 3.1,42.9,
				// 		                                3.1, 4.1, 4.3, 3.6, 3.24, 2.26, 2.9, 2.9,
				// 		                                1.8, 1.2,20.6, 0.1, 2.1, 2.0, 2.2, 2.4, 24.6, 3.0, 3.1, 2.9,
				// 		                                3.1, 4.1, 4.3, 3.6, 3.4, 2.6, 2.9, 2.9,
				// 		                                1.8, 1.2, 0.6, 0.1, 22.1, 2.0, 42.2, 2.4, 2.6, 3.0, 3.1, 2.9,
				// 		                                3.1, 4.1, 4.3, 3.6, 3.4, 2.6, 2.9, 2.9,
				// 		                                1.8, 1.2, 0.6, 0.1, 0.0]
				// 		            }
				// 		        ];
				// 		        var dataChart2 = {categories:categories2, conditions:conditions2};
				// 		        var compareChart = new MetXCompareBar(dataChart2, 1300, 1000, "xaxis", "yaxis", "title");
						        
				// 				document.getElementById(this.id).insertBefore(compareChart, document.getElementById(this.id).firstChild);
				//         	}
				//         }
				//     }
				// }).show();
            },
            scope : me
		});

		view.on({
			reloadMapping:me.reloadMapping,
			scope:me
		});
	},

	

	reloadMapping : function(bool){
	    if(_metExploreViz.getMappingsLength()!=0){
	    	var component = Ext.getCmp('comparisonSidePanel');
	        if(component!= undefined){
				
				var comboMapping = Ext.getCmp('selectMappingVisu');
				var store = comboMapping.getStore();
				store.loadData([], false);
				comboMapping.clearValue();
	            //take an array to store the object that we will get from the ajax response
				var records = [];
				console.log(bool);
				// comboMapping.bindStore(store);
				if(bool){

					var mappings = _metExploreViz.getMappingsSet();
					mappings.forEach(function(mapping){
						records.push(new Ext.data.Record({
		                    name: mapping.getName()
		                }));

						store.each(function(mappingName){
							records.push(new Ext.data.Record({
			                    name: mappingName.getData().name
			                }));
						});
					});

					store.loadData(records, false);
				}        	

                if(store.getCount()==0)
                	comboMapping.setDisabled(true);
	        }
	    }

		var comboCond = Ext.getCmp('selectCondition');
		var addCondition = Ext.getCmp('addCondition');
		var selectConditionType = Ext.getCmp('selectConditionType');
		
		if(addCondition!=undefined && selectCondition!=undefined && selectConditionType!=undefined){					
			comboCond.clearValue();

			addCondition.setDisabled(true);
			addCondition.setTooltip('You must choose a condition to add it');
				
			comboCond.setDisabled(true);
			selectConditionType.setDisabled(true);

		}

		var networkVizSession = _metExploreViz.getSessionById("viz");
		var that = this;
		// If the main network is already mapped we inform the user: OK/CANCEL
		// if(networkVizSession.isMapped()!='false')	
		// {
	        	
		// 	var newMapping ='true';
		// 	me.closeMapping(newMapping);
		// }
	}
});
