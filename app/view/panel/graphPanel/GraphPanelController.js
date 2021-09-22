Ext.define('metExploreViz.view.panel.graphPanel.GraphPanelController', {
	extend: 'Ext.app.ViewController',
	alias: 'controller.panel-graphpanel-graphpanel',

/**
 * Aplies event linsteners to the view
 */
	init:function(){
		var me 		= this,
		viewModel   = me.getViewModel(),
		view      	= me.getView();

		Ext.QuickTips.init();
		// Ext.tip.QuickTipManager.init();

		view.on({
			setLoadButtonHidden : me.changeoption,
			afterrefresh : function(){
				var buttonCopyNetwork = view.lookupReference('buttonCopyNetwork');
				var buttonSaveNetwork = view.lookupReference('buttonSaveNetwork');
				var vizMiningMenu = view.lookupReference('vizMiningMenuID');
                var vizImportMenuID = view.lookupReference('vizImportMenuID');
                var vizExportMenuID = view.lookupReference('vizExportMenuID');
                var vizSaveMenuID = view.lookupReference('vizSaveMenuID');
                var vizDrawingMenu = view.lookupReference('vizDrawingMenuID');
                var vizLoadMenu = view.lookupReference('vizLoadMenuID');
                var searchNode = view.lookupReference('searchNode');

				Ext.getCmp("allStylesForm").query("allStylesByTypeForm").forEach(function (allStylesByTypeForm) {
						allStylesByTypeForm.lookupReference('captiontoolbar').enable();
				});


				if(searchNode!=undefined)
				{
					searchNode.setDisabled(false);
				}

				if(buttonCopyNetwork!=undefined)
				{
					buttonCopyNetwork.setDisabled(false);
					buttonCopyNetwork.setTooltip('The graph will be copied in an other frame');
				}

				if(buttonSaveNetwork!=undefined)
				{
					buttonSaveNetwork.setDisabled(false);
					buttonSaveNetwork.setTooltip('The graph will be saved in json file');
				}

                if(vizMiningMenu!=undefined)
				{
	                vizMiningMenu.setDisabled(false);
	                vizMiningMenu.setTooltip('Sub-network extraction/visualisation');
                }

                if(vizExportMenuID!=undefined)
				{
	                vizExportMenuID.setDisabled(false);
					vizExportMenuID.setTooltip('Export network as an image');
                }

                if(vizImportMenuID!=undefined)
				{
	                vizImportMenuID.setDisabled(false);
					vizImportMenuID.setTooltip('Import data on nodes');
                }

                if(vizSaveMenuID!=undefined)
				{
	                vizSaveMenuID.setDisabled(false);
					vizSaveMenuID.setTooltip('Save drawing');
                }

                if(vizDrawingMenu!=undefined)
				{
	                vizDrawingMenu.setDisabled(false);
	                vizDrawingMenu.setTooltip('Change network drawing');
	            }

                if(vizLoadMenu!=undefined)
				{
	                vizLoadMenu.setDisabled(false);
	                vizLoadMenu.setTooltip('Load a network in the visualisation');
	            }
			},
			initSearch : me.initSearch,
			scope:me
		});

		view.on({
			afterrefresh : me.drawCaption,
			scope:me
		});

		view.lookupReference('vizLoadMenuID').on({
			mouseover : function(){this.lookupReference('vizLoadMenuID').setIconCls("importToRsx");},
			mouseout : function(){this.lookupReference('vizLoadMenuID').setIconCls("importToRsxwhite");},
			menuhide : function(){this.lookupReference('vizLoadMenuID').setIconCls("importToRsxwhite");},
			scope : me
		});

		view.lookupReference('searchNodeButton').on({
			click : me.searchNode,
			scope : me
		});

		view.lookupReference('enterMetaboRankMode').on({
			click: me.metaboRankMode,
			scope: me
		});

	},

	metaboRankMode : function(){
		var me = this;
		var view = me.getView();

		var metaboRankPanel = view.lookupReference("metaboRankPanel");
		var sidePanel = view.lookupReference("comparisonSidePanel");
		var enterBtn = view.lookupReference("enterMetaboRankMode");

		if (metaboRankPanel.open === false) {
			sidePanel.setHidden(true);
			metaboRankPanel.setHidden(false);
			enterBtn.setText("Exit MetaboRank mode");

			metExploreD3.GraphRank.enterMetaboRankMode();
			metExploreD3.GraphNetwork.animationButtonOff('viz');
            var force = _metExploreViz.getSessionById("viz").getForce();
            force.stop();

			metaboRankPanel.open = true;
			metExploreD3.GraphRank.metaboRankMode = true;
		}
		else {
			sidePanel.setHidden(false);
			metaboRankPanel.setHidden(true);
			enterBtn.setText("Enter MetaboRank mode");

			metExploreD3.GraphRank.exitMetaboRankMode();
			metExploreD3.GraphNetwork.animationButtonOn('viz');

			metaboRankPanel.open = false;
			metExploreD3.GraphRank.metaboRankMode = false;
		}
	},

	changeoption : function(){
		var me 		= this,
		view      	= me.getView();

		if(metExploreD3.getGeneralStyle().loadButtonIsHidden()){
			metExploreD3.hideInitialLoadButtons();
			if(!view.lookupReference('vizLoadMenuID').hidden)
				view.lookupReference('vizLoadMenuID').setHidden(true);
		}
	},

	drawCaption : function(){
		metExploreD3.GraphCaption.drawCaption();
	},

	/*****************************************************
	* init field
	*/
	initSearch : function() {
		var me 		= this,
		viewModel   = me.getViewModel(),
		view      	= me.getView();
		if(view.lookupReference("searchNodeTextField").getValue()!="")
		{
			view.lookupReference("searchNodeTextField").reset();
		}
	},


	/*****************************************************
	* Search node in the visualisation by name, ec, compartment
	*/
	searchNode : function() {
		var me 		= this,
		viewModel   = me.getViewModel(),
		view      	= me.getView();
		if(view.lookupReference("searchNodeTextField").getValue()=="joyeuxnoel")
		{
			metExploreD3.GraphNetwork.easterEggNoel();
		}

		if(view.lookupReference("searchNodeTextField").getValue()=="halloween")
		{
			metExploreD3.GraphNetwork.easterEggHalloween();
		}

		metExploreD3.GraphNode.searchNode(view.lookupReference("searchNodeTextField").getValue());
	},


	/*******************************************
    * Export a json which describe a metabolic network.
    */
	exportJSON : function() {
		var storeNetworkData = Ext.getStore('S_NetworkData');
		var storeReaction = metExploreD3.getReactionsSet();
		var storeMetabolite = metExploreD3.getMetabolitesSet();
		var storeCompartmentInBioSource = Ext.getStore('S_CompartmentInBioSource');
		var stringJSON = "";
		stringJSON+="{\"reaction\":[";
		var storeReactionMap  = Ext.create('Ext.data.Store',{
		    fields : ['id','ec','name','reversible']
		});

		storeReaction.each(function(reaction){
			storeNetworkData.getStoreById('viz').getNodes().forEach(function(node){
				if(node.getId() == reaction.get('id')){
					storeReactionMap.add({
					    id: node.getId(),
						ec: reaction.get('ec'),
					    name: node.getName(),
					    reversible: node.getReactionReversibility()
					});
				}
			});
		})

		for(var i=0 ; i<storeReactionMap.getCount() ; i++){
			stringJSON+=Ext.JSON.encode(storeReactionMap.getRange()[i].data);
			if(i!=storeReactionMap.getCount()-1)
				stringJSON+=',\n';
		}
		stringJSON+="],\n\n\"metabolite\":[";
		var storeMetaboliteMap  = Ext.create('Ext.data.Store',{
		    fields : ['id','name','chemicalFormula','compartment','inchi']
		});

		// var storeMapping = Ext.getStore('S_Mapping');

		storeNetworkData.getStoreById('viz').getNodes().forEach(function(node){
			storeMetabolite.each(function(metabolite){
				if(node.getId() == metabolite.get('id')){
					var mapped = metabolite.get('mapped')>0;
					// if(metabolite.get('mapped')>0){
					// 	storeMapping.each(function(map){
					// 		arrayId = map.get('idMapped').split(',');
					// 		arrayId.forEach(function(id){
					// 			if(id==node.getId())
					// 			{
					// 				var ndCond = map.get('condName').length;
					// 				for(var i =0; i<ndCond ; i++){

					// 				}
					// 			}
					// 		});
					// 	});
					// }
					storeMetaboliteMap.add({
					    id: node.getId(),
						name: metabolite.get('name'),
						formula: metabolite.get('chemicalFormula'),
						compartment: metabolite.get('compartment'),
						inchi: metabolite.get('inchi'),
						mapped: mapped
					});
				}
			});
			if(node.isSideCompound()){
				var idNode = node.getId();
				idNode = idNode.split('-');
				var metabolite = storeMetabolite.getMetaboliteById(idNode[0]);
				var mapped = metabolite.get('mapped')>0;
				// if(metabolite.get('mapped')>0){
				// 	storeMapping.each(function(map){
				// 		arrayId = map.get('idMapped').split(',');
				// 		arrayId.forEach(function(id){
				// 			if(id==node.getId())
				// 			{
				// 				var ndCond = map.get('condName').length;
				// 				for(var i =0; i<ndCond ; i++){

				// 				}
				// 			}
				// 		});
				// 	});
				// }
				storeMetaboliteMap.add({
				    id: node.getId(),
					name: metabolite.get('name'),
					formula: metabolite.get('chemicalFormula'),
					compartment: metabolite.get('compartment'),
					inchi: metabolite.get('inchi'),
					mapped: mapped
				});
			}
		})

		for(var i=0; i<storeMetaboliteMap.getCount() ; i++){
			stringJSON+=Ext.JSON.encode(storeMetaboliteMap.getRange()[i].data);
			if(i!=storeMetaboliteMap.getCount()-1)
				stringJSON+=',\n';
		}

		stringJSON+="],\n\n\"link\":[";
		var storeLinkMap  = Ext.create('Ext.data.Store',{
		    fields : ['source','target','interaction']
		});

		storeNetworkData.getStoreById('viz').getLinks().forEach(function(link){
			storeLinkMap.add({
				source: link.source.getId(),
			    target: link.target.getId(),
			    interaction: link.interaction
			});
		});

		for(var i=0; i<storeLinkMap.getCount() ; i++){
			stringJSON+=Ext.JSON.encode(storeLinkMap.getRange()[i].data);
			if(i!=storeLinkMap.getCount()-1)
				stringJSON+=',\n';
		}

		stringJSON+="],\n\n\"compartment\":[";
		var storeCompartment  = Ext.create('Ext.data.Store',{
		    fields : ['name','color']
		});

		storeCompartmentInBioSource.each(function(compartmentInBioSource){
			storeCompartment.add({
			    name: compartmentInBioSource.get('name'),
				color: compartmentInBioSource.get('color')
			});
		});

		for(var i=0; i<storeCompartment.getCount() ; i++){
			stringJSON+=Ext.JSON.encode(storeCompartment.getRange()[i].data);
			if(i!=storeCompartment.getCount()-1)
				stringJSON+=',\n';
		}
		stringJSON+=']}\n';

		return stringJSON;
	},

	/*******************************************
    * Export a json file which describe a metabolic network.
    */
	exportJsonFile : function() {
		var stringJSON = this.exportJSON();
		var link = document.createElement('a');
		link.download = 'data.json';
		var blob = new Blob([stringJSON], {type: 'text/plain'});
		link.href = window.URL.createObjectURL(blob);
		link.click();
	},

	/*******************************************
    * Export a XGMML file which describe a metabolic network.
    */
	exportXGMML: function(){

		if (lib.javascript.metExploreViz.globals.Session.idUser == ""
			|| lib.javascript.metExploreViz.globals.Session.idUser == -1) {
			var winWarning = Ext.create("Ext.window.MessageBox", {
				height : 300
			});

			winWarning
			.alert('Warning',
			'You are not connected, the job will be available only during your session. ');

			winWarning.setPosition(50);
		}

		var svg = encodeURIComponent(metExploreD3.GraphUtils.exportMainSVG());
		var json = encodeURIComponent(this.exportJSON().replace(/\n/g,''));

		var bs = {"analysis_title":'Xgmml Export', "java_class": "metexplore.XgmmlExporter", "json": json, "svg": svg};
		Ext.Ajax.request({
			url:'src/php/application_binding/launchJavaApplication.php',
			method:'POST',
			params: bs,
			success: function(response, opts) {
				var json=Ext.decode(response.responseText);


				if (json["success"] == false) {
					Ext.Msg
					.alert("Failed",
					"Problem in getting results from the server (success = false)");
					return;

				} else {

					var message = json["message"];

					var win = Ext.create("Ext.window.MessageBox", {
						height : 300
					});

					win.show({
						title : "Application message",
						msg : message
					});

					var sidePanel = Ext.ComponentQuery.query("sidePanel")[0];
					var gridJobs = sidePanel.down("gridJobs");
					gridJobs.expand();

					Ext.getStore("S_Analyses").reload();

				}
			},
			failure: function(response, opts) {
				Ext.MessageBox.alert('Server-side failure with status code ' + response.status);
			}
		});
	}
});
