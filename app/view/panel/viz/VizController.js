Ext.define('metExploreViz.view.panel.viz.VizController', {
	extend: 'Ext.app.ViewController',
	alias: 'controller.panel-viz-viz',

/**
 * Aplies event linsteners to the view
 */
	init:function(){
		var me 		= this,
		viewModel   = me.getViewModel(),
		view      	= me.getView();

		view.on({
			initiateViz : me.initiateViz,
            initAnimationButton : me.initAnimationButton,
			scope:me
		});

        view.lookupReference('zoomin').on({
            click : function() {
                metExploreD3.GraphNetwork.zoomIn();
            },
            scope:me
        });

        view.lookupReference('zoomout').on({
            click : function() {
                metExploreD3.GraphNetwork.zoomOut();
            },
            scope:me
        });

        view.lookupReference('handcursor').on({
            click : function() {
                metExploreD3.GraphNetwork.moveGraph();

                if(view.lookupReference('handcursor').hasCls('focus')){
                    view.lookupReference('handcursor').removeCls('focus');
                }
                else
                {
                    view.lookupReference('handcursor').addCls('focus');
                }
            },
            scope:me
        });

        view.lookupReference('rescale').on({
            click : function() {
                metExploreD3.GraphNetwork.rescale("viz");

            },
            scope:me
        });

        view.lookupReference('curve').on({
            click : function() {
                if (metExploreD3.GraphStyleEdition.curvedPath === false) {
                    metExploreD3.GraphStyleEdition.curvedPath = true;
                    metExploreD3.GraphLink.bundleLinks("viz");
                }
                else {
                    metExploreD3.GraphStyleEdition.curvedPath = false;
                    metExploreD3.GraphNetwork.removeMarkerEnd();
                    metExploreD3.GraphCaption.drawCaption();
                    metExploreD3.GraphLink.tick("viz");
                }

                if(view.lookupReference('curve').hasCls('focus')){
                    view.lookupReference('curve').removeCls('focus');
                }
                else
                {
                    view.lookupReference('curve').addCls('focus');
                }
            },
            scope:me
        });

        view.lookupReference('textSelection').on({
            click : function() {
                if(view.lookupReference('textSelection').hasCls('focus')){
                    view.lookupReference('textSelection').removeCls('focus');
                }
                else
                {
                    view.lookupReference('textSelection').addCls('focus');
                }
                me.enterEditMode();
            },
            scope:me
        });

        view.lookupReference('metaboliteSelection').on({
            click : function() {
                if(view.lookupReference('metaboliteSelection').hasCls('focus')){
                    view.lookupReference('metaboliteSelection').removeCls('focus');
                }
                else
                {
                    view.lookupReference('metaboliteSelection').addCls('focus');
                }
            },
            scope:me
        });

        view.lookupReference('reactionSelection').on({
            click : function() {
                if(view.lookupReference('reactionSelection').hasCls('focus')){
                    view.lookupReference('reactionSelection').removeCls('focus');
                }
                else
                {
                    view.lookupReference('reactionSelection').addCls('focus');
                }
            },
            scope:me
        });

        view.lookupReference('edgesSelection').on({
            click : function() {
                if(view.lookupReference('edgesSelection').hasCls('focus')){
                    view.lookupReference('edgesSelection').removeCls('focus');
                }
                else
                {
                    view.lookupReference('edgesSelection').addCls('focus');
                }
            },
            scope:me
        });

        view.lookupReference('animation').on({
            click : function() {
                if(metExploreD3.GraphNetwork.isAnimated("viz")){
                    view.lookupReference('animation').setIconCls('play');
                }
                else
                {
                    view.lookupReference('animation').setIconCls("pause");
                }
                metExploreD3.GraphNetwork.play();
            },
            scope:me
        });

        view.on({
			resize : function() {
				metExploreD3.GraphPanel.resizeViz("viz");
				var session = _metExploreViz.getSessionById("viz");
	    		// if visualisation is actived we add item to menu
	    		if(session.isActive()){

					metExploreD3.GraphPanel.resizePanels('viz');

				}
			},
            hideContextMenu: function() {
                var viz = Ext.getCmp('viz');
                if(viz){
                    if(viz.CtxMenu){
                        viz.CtxMenu.hide();
                    }
                }
            },
			scope:me
		});
	},
	/*****************************************************
	* Initialization of visualization
    * @param {} vizEngine : library used to make the visualization
	*/
	initiateViz : function() {

		$("#viz").on('contextmenu', function(e) {
			// devalide le menu contextuel du navigateur
			e.preventDefault();
			var networkVizSessionStore = _metExploreViz.getSessionById("viz");
			// Define the right click to remove elements and display information
			var viz = Ext.getCmp('viz');
			if(viz!= undefined){
				if(e.target.id=="D3viz"
					|| e.target.parentNode.parentNode.id=="D3viz"
					|| e.target.parentNode.id=="graphComponent")
				{

					viz.CtxMenu = new Ext.menu.Menu({
						items : [{
							text : 'Collapse selected pathway(s)',
							hidden : networkVizSessionStore.getSelectedPathways().length===0,
							iconCls:"removeNode",
							handler :function(){
								var sessionStore = _metExploreViz.getSessionById("viz");
								sessionStore.getSelectedPathways().forEach(function (path, i) {
								    setTimeout(function(){
                                        metExploreD3.GraphNetwork.collapsePathway(path);
                                        metExploreD3.GraphNetwork.initPathway(path);
                                    }, i*1000);
								});
								sessionStore.removeAllSelectedPathways();
							}
                        },{
                            text : 'Collapse all pathways',
                            iconCls:"removeNode",
                            hidden : networkVizSessionStore.getD3Data().getNodes().filter(function(node){return node.getBiologicalType()==="pathway" && node.isHidden()}).length===0,
                            handler :function(){
                                var sessionStore = _metExploreViz.getSessionById("viz");
                                metExploreD3.GraphNetwork.collapseAllPathway();
                                sessionStore.removeAllSelectedPathways();
                            }
                        },{
                            text : 'Select all nodes of selected pathway(s)',
                            hidden : networkVizSessionStore.getSelectedPathways().length===0,
                            iconCls:"removeNode",
                            handler :function(){
                                var sessionStore = _metExploreViz.getSessionById("viz");
                                sessionStore.getSelectedPathways().forEach(function (path, i) {
                                    metExploreD3.GraphNode.selectNodesOfPathway(path, "viz");
                                });
                            }
                        },{
                            text : 'Expand selected pathway nodes',
                            hidden : networkVizSessionStore.getD3Data().getNodes().filter(function(node){return node.getBiologicalType()==="pathway" && node.isSelected()}).length===0,
                            iconCls:"removeNode",
                            handler :function(){
                                networkVizSessionStore.getD3Data().getNodes()
                                    .filter(function(node){return node.getBiologicalType()==="pathway" && node.isSelected()})
                                    .forEach(function (path, i) {
                                        setTimeout(function(){
                                            path.setIsSelected(false);
                                            metExploreD3.GraphNetwork.expandPathwayNode(path.getName(), "viz");
                                        }, i*1000);
                                    });
                            }
                        },{
                            text : 'Expand all pathway nodes',
                            hidden : networkVizSessionStore.getD3Data().getPathways().filter(function(path){return path.isCollapsed()}).length===0,
                            iconCls:"removeNode",
                            handler :function(){
                                metExploreD3.GraphNetwork.expandAllPathwayNode("viz");
                            }
                        },{
							text : 'Remove selected nodes',
							hidden : networkVizSessionStore.getSelectedNodes().length===0,
							iconCls:"removeNode",
							handler :function(){
								metExploreD3.GraphNetwork.removeSelectedNode("viz");
								metExploreD3.fireEvent("girParams","changeOnNetwork");
							}
						},{
							text : 'Fix selected nodes',
							hidden : networkVizSessionStore.getSelectedNodes().length===0,
							iconCls:"lock_font_awesome",
							handler :function(){ metExploreD3.GraphNode.fixSelectedNode("viz") }
						},{
                            text : 'Unfix selected nodes',
                            iconCls:"unlock_font_awesome",
                            hidden : networkVizSessionStore.getSelectedNodes().length===0,
                            handler :function(){ metExploreD3.GraphNode.unfixSelectedNode("viz") }
                        },{
							text : 'Duplicate selected nodes as side compounds',
							hidden : networkVizSessionStore.getSelectedNodes().length===0,
							iconCls:"duplicate-sideCompounds",
							handler : function(){
								metExploreD3.GraphNetwork.duplicateSideCompoundsSelected("viz");
								metExploreD3.GraphLink.refreshLinkActivity("viz", _metExploreViz.getSessionById("viz"), metExploreD3.getLinkStyle());
							}
						}
						,{
							text : 'Select selected nodes in table',
							hidden : !metExploreD3.getGeneralStyle().hasEventForNodeInfo() && networkVizSessionStore.getSelectedNodes().length===0,
							iconCls:"search",
							handler : function() {
								var selectedNodesIds = networkVizSessionStore.getSelectedNodes();
								var selectedNodesObj = [];
								networkData = networkVizSessionStore.getD3Data();

								selectedNodesIds.forEach(function(id){
									var node = networkData.getNodeById(id);
									if(node)
										selectedNodesObj.push(node);
								})
								metExploreD3.fireEventParentWebSite("selectNodesInTable", selectedNodesObj);
							}
						}]
					});

				}
				else
				{

					if(e.target.id=='')
					{
						if(e.target.parentNode.textContent!=""){
							if(e.target.previousSibling.previousSibling==null)
								var target = e.target.previousSibling;
							else
								var target = e.target.previousSibling.previousSibling;

						}
						else
							var target = e.target.parentNode.parentNode.firstChild;


					}
					else
						var target = e.target;


					var theNode = metExploreD3.GraphNode.selectNodeData(e.target);
					var mappedImage = metExploreD3.GraphMapping.selectMappedImages(theNode);
					var isMetabolite = (theNode.getBiologicalType()=="metabolite");
					var isPathway = (theNode.getBiologicalType()=="pathway");
					var isPartOfCycle = metExploreD3.GraphFunction.checkIfPartOfCycle(theNode, "viz");

                    viz.selectMenu = new Ext.menu.Menu({
                        items : [{
                            text : 'Only this node',
                            hidden : !metExploreD3.getGeneralStyle().hasEventForNodeInfo(),
                            iconCls:"search",
                            handler : function() {
                                var selectedNodesIds = networkVizSessionStore.getSelectedNodes();
                                var selectedNodesObj = [theNode];
                                metExploreD3.fireEventParentWebSite("selectNodesInTable", selectedNodesObj);
                            }
                        },
                            {
                                text : 'All selected nodes',
                                hidden : !metExploreD3.getGeneralStyle().hasEventForNodeInfo(),
                                iconCls:"search",
                                handler : function() {
                                    var selectedNodesIds = networkVizSessionStore.getSelectedNodes();
                                    var selectedNodesObj = [];
                                    var networkData = networkVizSessionStore.getD3Data();

                                    selectedNodesIds.forEach(function(id){
                                        var node = networkData.getNodeById(id);
                                        if(node)
                                            selectedNodesObj.push(node);
                                    });
                                    metExploreD3.fireEventParentWebSite("selectNodesInTable", selectedNodesObj);
                                }
                            }]
                    });

                    viz.removeMenu = new Ext.menu.Menu({
                        items : [{
                            text : 'This node',
                            hidden : false,
                            iconCls:"removeNode",
                            handler : function(){
                                metExploreD3.GraphNetwork.removeOnlyClickedNode(theNode, "viz");
								metExploreD3.fireEvent("girParams","changeOnNetwork");
                            }
                        },{
                            text : 'All selected nodes',
                            hidden : false,
                            iconCls:"removeNode",
                            handler :function(){
								metExploreD3.GraphNetwork.removeSelectedNode("viz");
								metExploreD3.fireEvent("girParams","changeOnNetwork");
							}
                        }]
                    });

                    viz.duplicateMenu = new Ext.menu.Menu({
                        items : [{
                            text : 'This node',
                            hidden : !isMetabolite,
                            iconCls:"duplicate-sideCompounds",
                            handler : function(){
                                if (metExploreD3.GraphFunction.checkIfPartOfCycle(theNode, "viz")){
                                    var text = "This node is part of a drawn cycle and duplicationg it will break the cycle. Do you want to proceed ?";
                                    metExploreD3.displayMessageYesNo("Warning", text, function (btn) {
                                        if (btn === "yes") {
											metExploreD3.GraphNetwork.duplicateASideCompoundSelected(theNode, "viz");
											metExploreD3.GraphLink.refreshLinkActivity("viz", _metExploreViz.getSessionById("viz"), metExploreD3.getLinkStyle());
										}
                                    });
                                }
                                else {
									metExploreD3.GraphNetwork.duplicateASideCompoundSelected(theNode, "viz");
									metExploreD3.GraphLink.refreshLinkActivity("viz", _metExploreViz.getSessionById("viz"), metExploreD3.getLinkStyle());
								}
                            }
                        },{
                            text : 'All selected nodes',
                            hidden : false,
                            iconCls:"duplicate-sideCompounds",
                            handler : function(){
                                if (metExploreD3.GraphFunction.checkIfSelectionIsPartOfCycle("viz")){
                                    var text = "Some of the selected nodes are part of a drawn cycle and duplicationg them will break the cycle. Do you want to proceed ?";
                                    metExploreD3.displayMessageYesNo("Warning", text, function (btn) {
                                        if (btn === "yes") {
											metExploreD3.GraphNetwork.duplicateSideCompoundsSelected("viz");
											metExploreD3.GraphLink.refreshLinkActivity("viz", _metExploreViz.getSessionById("viz"), metExploreD3.getLinkStyle());
										}
                                    });
                                }
                                else {
									metExploreD3.GraphNetwork.duplicateSideCompoundsSelected("viz");
									metExploreD3.GraphLink.refreshLinkActivity("viz", _metExploreViz.getSessionById("viz"), metExploreD3.getLinkStyle());
								}
                            }
                        }]
                    });

					viz.expandMenu = new Ext.menu.Menu({
						items: [
							{
								text: 'Successors',
								iconCls: 'expandOut',
								handler: function() {
									metExploreD3.GraphRank.showNeighbours(theNode, "next");
									metExploreD3.GraphRank.visit(theNode);
									theNode.setLocked(true);
			                        metExploreD3.GraphNode.fixNode(theNode);
			                        metExploreD3.GraphRank.updateNbHidden();
								}
							},
							{
								text: 'Predecessors',
								iconCls: 'expandIn',
								handler: function() {
									metExploreD3.GraphRank.showNeighbours(theNode, "previous");
									metExploreD3.GraphRank.visit(theNode);
									theNode.setLocked(true);
			                        metExploreD3.GraphNode.fixNode(theNode);
			                        metExploreD3.GraphRank.updateNbHidden();
								}
							}
						]
					});

                    if (metExploreD3.GraphRank.launchGIR === false){
						viz.CtxMenu = new Ext.menu.Menu({
	                        items: [{
	                            text: 'Expand pathway',
	                            hidden: !isPathway,
	                            iconCls: "duplicate-sideCompounds",
	                            handler: function () {
	                                metExploreD3.GraphNetwork.expandPathwayNode(theNode.getName(), "viz");
	                            }
	                        }, {
	                            text: 'Remove nodes',
	                            hidden: false,
	                            iconCls: "removeNode",
	                            menu: viz.removeMenu
	                        }, {
	                            text: 'Duplicate nodes as side compounds',
	                            hidden: false,
	                            iconCls: "duplicate-sideCompounds",
	                            menu: viz.duplicateMenu
	                        }, {
	                            text: 'Change name',
	                            hidden: false,
	                            iconCls: "edit",
	                            handler: function () {
	                                metExploreD3.GraphNode.changeName(theNode);
	                            }
	                        }, {
	                            text: 'Select neighbours (N+select)',
	                            hidden: false,
	                            iconCls: "neighbours",
	                            handler: function () {
	                                metExploreD3.GraphNode.selectNeighbours(theNode, "viz");
	                            }
	                        }, {
	                            text: 'See more information',
	                            hidden: !metExploreD3.getGeneralStyle().hasEventForNodeInfo(),
	                            iconCls: "info",
	                            handler: function () {
	                                metExploreD3.fireEventParentWebSite("seeMoreInformation", theNode);
	                            }
	                        }, {
	                            text: 'Select node in table',
	                            hidden: !metExploreD3.getGeneralStyle().hasEventForNodeInfo(),
	                            iconCls: "search",
	                            menu: viz.selectMenu
	                        }, {
	                            text: 'Fix selected nodes',
	                            hidden: false,
	                            iconCls: "lock_font_awesome",
	                            handler: function () {
	                                metExploreD3.GraphNode.fixSelectedNode("viz")
	                            }
	                        },{
	                            text : 'Unfix selected nodes',
	                            hidden : false,
	                            iconCls: "unlock_font_awesome",
	                            handler :function(){ metExploreD3.GraphNode.unfixSelectedNode("viz") }
	                        }, {
	                            text: 'Detect longest cycles',
	                            iconCls: "longCycle",
	                            menu: [{
	                                text: 'Going through this node',
	                                handler: function () {
	                                    var longestCycles = metExploreD3.GraphFunction.findLongestCycles([theNode]);
	                                    if (longestCycles.length >= 1) {
	                                        metExploreD3.GraphFunction.highlightCycle(longestCycles[0]);
	                                    }
	                                    if (longestCycles.length === 0){
	                                        metExploreD3.displayWarning('No cycles found', 'There is no cycles of more than 2 reactions going through the selected nodes');
	                                    }
	                                    metExploreD3.fireEventArg('cycleDetection', "listCycles", longestCycles);
	                                }
	                            },{
	                                text: 'Going through all selected nodes',
	                                handler: function () {
	                                    var selectedNodesIds = networkVizSessionStore.getSelectedNodes();
	                                    var selectedNodes = [];
	                                    var networkData = networkVizSessionStore.getD3Data();
	                                    selectedNodesIds.forEach(function(id){
	                                        var node = networkData.getNodeById(id);
	                                        if (node) {
	                                            selectedNodes.push(node);
	                                        }
	                                    });
	                                    var longestCycles = metExploreD3.GraphFunction.findLongestCycles(selectedNodes);
	                                    if (longestCycles.length >= 1) {
	                                        metExploreD3.GraphFunction.highlightCycle(longestCycles[0]);
	                                    }
	                                    if (longestCycles.length === 0){
	                                        metExploreD3.displayWarning('No cycles found', 'There is no cycles of more than 2 reactions going through the selected nodes');
	                                    }
	                                    metExploreD3.fireEventArg('cycleDetection', "listCycles", longestCycles);
	                                }
	                            }]
	                        },{
	                            text: 'Detect shortest cycles',
	                            iconCls: "shortCycle",
	                            menu: [{
	                                text: 'Going through this node',
	                                handler: function () {
	                                    var shortestCycles = metExploreD3.GraphFunction.findShortestCycles([theNode]);
	                                    if (shortestCycles.length >= 1) {
	                                        metExploreD3.GraphFunction.highlightCycle(shortestCycles[0]);
	                                    }
	                                    if (shortestCycles.length === 0){
	                                        metExploreD3.displayWarning('No cycles found', 'There is no cycles of more than 2 reactions going through the selected nodes');
	                                    }
	                                    metExploreD3.fireEventArg('cycleDetection', "listCycles", shortestCycles);
	                                }
	                            },{
	                                text: 'Going through all selected nodes',
	                                handler: function () {
	                                    var selectedNodesIds = networkVizSessionStore.getSelectedNodes();
	                                    var selectedNodes = [];
	                                    networkData = networkVizSessionStore.getD3Data();
	                                    selectedNodesIds.forEach(function(id){
	                                        var node = networkData.getNodeById(id);
	                                        if (node) {
	                                            selectedNodes.push(node);
	                                        }
	                                    });
	                                    var shortestCycles = metExploreD3.GraphFunction.findShortestCycles(selectedNodes);
	                                    if (shortestCycles.length >= 1) {
	                                        metExploreD3.GraphFunction.highlightCycle(shortestCycles[0]);
	                                    }
	                                    if (shortestCycles.length === 0){
	                                        metExploreD3.displayWarning('No cycles found', 'There is no cycles of more than 2 reactions going through the selected nodes');
	                                    }
	                                    metExploreD3.fireEventArg('cycleDetection', "listCycles", shortestCycles);
	                                }
	                            }]
	                        },{
	                            text: 'Change font',
	                            iconCls: "font",
	                            hidden: (!metExploreD3.GraphStyleEdition.editMode),
	                            menu: [{
	                                text: 'This node',
	                                handler: function () {
	                                    Ext.create('Ext.window.Window', {
	                                        title: 'Choose font',
	                                        width: 400,
	                                        layout: 'fit',
	                                        items: [{
	                                            xtype: 'combo',
	                                            id : 'fontStyleWindow',
	                                            fieldLabel: 'Font type:',
	                                            width:'95%',
	                                            margin:'5 5 5 5',
	                                            emptyText:'-- Choose a font --',
	                                            store: [
	                                                ['Open Sans', 'Open Sans'],
	                                                ['Arial', 'Arial'],
	                                                ['Helvetica', 'Helvetica'],
	                                                ['Times', 'Times'],
	                                                ['Verdana', 'Verdana']
	                                            ],
	                                            editable: false
	                                        }],
	                                        buttons: [
	                                            {
	                                                text: 'Ok',
	                                                handler: function () {
	                                                    metExploreD3.applyTolinkedNetwork(
	                                                        _MyThisGraphNode.activePanel,
	                                                        function(panelLinked, sessionLinked) {
	                                                            var fontType = Ext.getCmp('fontStyleWindow').getValue();
	                                                            metExploreD3.GraphStyleEdition.changeFontType(theNode, fontType, panelLinked);
	                                                        });
	                                                }
	                                            }
	                                        ]
	                                    }).show();
	                                }
	                            },{
	                                text: 'All selected nodes',
	                                handler: function () {
	                                    Ext.create('Ext.window.Window', {
	                                        title: 'Choose font',
	                                        width: 400,
	                                        layout: 'fit',
	                                        items: [{
	                                            xtype: 'combo',
	                                            id : 'fontStyleSelectedWindow',
	                                            fieldLabel: 'Font type:',
	                                            width:'95%',
	                                            margin:'5 5 5 5',
	                                            emptyText:'-- Choose a font --',
	                                            store: [
	                                                ['Open Sans', 'Open Sans'],
	                                                ['Arial', 'Arial'],
	                                                ['Helvetica', 'Helvetica'],
	                                                ['Times', 'Times'],
	                                                ['Verdana', 'Verdana']
	                                            ],
	                                            editable: false
	                                        }],
	                                        buttons: [
	                                            {
	                                                text: 'Ok',
	                                                handler: function () {
	                                                    metExploreD3.applyTolinkedNetwork(
	                                                        _MyThisGraphNode.activePanel,
	                                                        function(panelLinked, sessionLinked) {
	                                                            var fontType = Ext.getCmp('fontStyleSelectedWindow').getValue();
	                                                            metExploreD3.GraphStyleEdition.changeAllFontType(fontType ,"selection", panelLinked);
	                                                        });
	                                                }
	                                            }
	                                        ]
	                                    }).show();
	                                }
	                            }]
	                        },{
	                            text: 'Change font size',
	                            iconCls: "fontSize",
	                            hidden: (!metExploreD3.GraphStyleEdition.editMode),
	                            fontSizemenu: [{
	                                text: 'This node',
	                                handler: function () {
	                                    metExploreD3.applyTolinkedNetwork(
	                                        _MyThisGraphNode.activePanel,
	                                        function(panelLinked, sessionLinked) {
	                                            metExploreD3.GraphStyleEdition.changeFontSize(theNode, panelLinked);
	                                        });
	                                }
	                            },{
	                                text: 'All selected nodes',
	                                handler: function () {
	                                    metExploreD3.displayPrompt("Font Size", "Enter a font size", function(btn, text) {
	                                        if (text!=null && text!="" && !isNaN(text) && btn=="ok") {
	                                            metExploreD3.applyTolinkedNetwork(
	                                                _MyThisGraphNode.activePanel,
	                                                function(panelLinked, sessionLinked) {
	                                                    metExploreD3.GraphStyleEdition.changeAllFontSize(text, "selection", panelLinked);
	                                                });
	                                        }
	                                    })
	                                }
	                            }]
	                        },{
	                            text: 'Change font style',
	                            iconCls: "fontStyle",
	                            hidden: (!metExploreD3.GraphStyleEdition.editMode),
	                            menu: [{
	                                text: 'This node',
	                                menu: [{
	                                    text: 'Bold',
	                                    iconCls: "bold",
	                                    handler: function () {
	                                        metExploreD3.applyTolinkedNetwork(
	                                            _MyThisGraphNode.activePanel,
	                                            function(panelLinked, sessionLinked) {
	                                                metExploreD3.GraphStyleEdition.changeFontBold(theNode, panelLinked);
	                                            });
	                                    }
	                                },{
	                                    text: 'Italic',
	                                    iconCls: "italic",
	                                    handler: function () {
	                                        metExploreD3.applyTolinkedNetwork(
	                                            _MyThisGraphNode.activePanel,
	                                            function(panelLinked, sessionLinked) {
	                                                metExploreD3.GraphStyleEdition.changeFontItalic(theNode, panelLinked);
	                                            });
	                                    }
	                                },{
	                                    text: 'Underline',
	                                    iconCls: "underline",
	                                    handler: function () {
	                                        metExploreD3.applyTolinkedNetwork(
	                                            _MyThisGraphNode.activePanel,
	                                            function(panelLinked, sessionLinked) {
	                                                metExploreD3.GraphStyleEdition.changeFontUnderline(theNode, panelLinked);
	                                            });
	                                    }
	                                }]
	                            },{
	                                text: 'All selected nodes',
	                                menu: [{
	                                    text: 'Bold',
	                                    iconCls: "bold",
	                                    handler: function () {
	                                        metExploreD3.applyTolinkedNetwork(
	                                            _MyThisGraphNode.activePanel,
	                                            function(panelLinked, sessionLinked) {
	                                                metExploreD3.GraphStyleEdition.changeAllFontBold(true, "selection", panelLinked);
	                                            });
	                                    }
	                                },{
	                                    text: 'Italic',
	                                    iconCls: "italic",
	                                    handler: function () {
	                                        metExploreD3.applyTolinkedNetwork(
	                                            _MyThisGraphNode.activePanel,
	                                            function(panelLinked, sessionLinked) {
	                                                metExploreD3.GraphStyleEdition.changeAllFontItalic(true, "selection", panelLinked);
	                                            });
	                                    }
	                                },{
	                                    text: 'Underline',
	                                    iconCls: "underline",
	                                    handler: function () {
	                                        metExploreD3.applyTolinkedNetwork(
	                                            _MyThisGraphNode.activePanel,
	                                            function(panelLinked, sessionLinked) {
	                                                metExploreD3.GraphStyleEdition.changeAllFontUnderline(true, "selection", panelLinked);
	                                            });
	                                    }
	                                }]
	                            }]
	                        },{
	                            text: 'Display/hide mappedImage',
	                            reference: 'displayMappedImage',
	                            hidden: (mappedImage.empty()) ? true : false,
	                            handler: function () {
	                                metExploreD3.GraphMapping.displayMappedImage(theNode);
	                            }
	                        },{
	                            text: 'Remove cycle drawing',
	                            iconCls: "removeCycle",
	                            reference: 'unfixCycle',
	                            hidden: (!isPartOfCycle),
	                            handler: function () {
	                                metExploreD3.GraphFunction.removeCycleContainingNode(theNode);
	                            }
	                        }]
	                    });
					}
					// GIR activated
					if (metExploreD3.GraphRank.launchGIR === true) {
						viz.CtxMenu = new Ext.menu.Menu({
							items: [
								{
									text: 'Expand',
									iconCls: 'neighbours',
									hidden: theNode.getBiologicalType()==="reaction",
									menu: viz.expandMenu
								},
								{
									text: 'Expand hidden metabolite',
									iconCls: 'neighbours',
									hidden: theNode.getBiologicalType()==="metabolite",
									handler: function(){
										metExploreD3.GraphRank.showMeta(theNode);
									}
								},
								{
									text: (theNode.isVisited() ? 'Unvisit' : 'Visit'),
									iconCls: 'neighbours',
									hidden: (theNode.getBiologicalType()==="reaction"),
									handler: function() {
										if (theNode.isVisited() === true){
											metExploreD3.GraphRank.unvisit(theNode);
				                            theNode.setLocked(false);
				                            metExploreD3.GraphNode.unfixNode(theNode);
										}
										else {
											metExploreD3.GraphRank.visit(theNode);
											theNode.setLocked(true);
					                        metExploreD3.GraphNode.fixNode(theNode);
										}
									}
								},
								{
									text: 'Collapse',
									iconCls: 'removeNode',
									handler: function() {
										metExploreD3.GraphRank.hideNeighbours(theNode);
										metExploreD3.GraphRank.unvisit(theNode);
										metExploreD3.GraphRank.updateNbHidden();
									}
								},
								{
									text: (theNode.sideCompoundsHidden ? 'Show side compounds' : 'Hide side compounds'),
									iconCls: (theNode.sideCompoundsHidden ? 'neighbours' : 'removeNode'),
									disabled: theNode.asSideCompounds === false,
									hidden: theNode.getBiologicalType()==="metabolite",
									handler: function() {
										if (theNode.sideCompoundsHidden === false){
											metExploreD3.GraphRank.hideSideCompounds(theNode);
										}
										else {
											metExploreD3.GraphRank.showSideCompounds(theNode);
										}
									}
								}
							]
						});

					}
				}
			}
			var a=viz.CtxMenu.items.items.filter(function (menu) { return !menu.hidden; });

			// positionner le menu au niveau de la souris
			if(viz.CtxMenu!=undefined)
				if(a.length>0)
					viz.CtxMenu.showAt(e.clientX, e.clientY);
		});
	},

    /*****************************************************
	* Initialization of visualization
    * @param {} vizEngine : library used to make the visualization
	*/
    initAnimationButton : function() {
        var me 		= this,
        viewModel   = me.getViewModel(),
        view      	= me.getView();

        if(!metExploreD3.GraphNetwork.isAnimated("viz")){
            view.lookupReference('animation').setIconCls('play');
        }
        else
        {
            view.lookupReference('animation').setIconCls("pause");
        }
	},
    enterEditMode: function () {
        metExploreD3.GraphStyleEdition.toggleEditMode();
        //(metExploreD3.GraphStyleEdition.editMode) ? Ext.getCmp('editModePanel').show() : Ext.getCmp('editModePanel').hide();
    }
});
