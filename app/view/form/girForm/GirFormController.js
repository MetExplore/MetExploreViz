/**
 * @author JCG
 * (a)description GirFormController : Control GIR parameters
 */

Ext.define('metExploreViz.view.form.girForm.GirFormController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.form-girForm-girForm',

    /**
     * Aplies event linsteners to the view
     */
    init:function(){
        var me 		= this,
            viewModel   = me.getViewModel(),
            view      	= me.getView();

        // Regex to remove bad chars in dom ids
        me.regexpPanel=/\.|>|<| |,|\/|=|\(|\)/g;

        view.on({
            fileLoad: function() {
                var name = _metExploreViz.rank.name;
                view.lookupReference('selectFile').setValue(name);

                me.parseFile(_metExploreViz.rank);
            }
        });

        view.lookupReference('launchGIR').on({
            click: function() {
                if (metExploreD3.GraphRank.launchGIR === false) {
                    view.lookupReference('launchGIR').setText("quit GIR");
                    view.lookupReference('extractNQuit').enable();

                    // var listMi = view.lookupReference('selectStart').value;
                    var listMi = []
                    var nbMi = view.lookupReference('miBox').items.items.length;
                    for (var i = 1; i < nbMi+1; i++){
                        listMi.push(view.lookupReference('selectStart'+i).value);
                    }


                    metExploreD3.GraphRank.launchGIR = true;
                    metExploreD3.GraphRank.startGir(listMi);
                }
                else {
                    view.lookupReference('launchGIR').setText("launch GIR");
                    view.lookupReference('extractNQuit').disable();

                    metExploreD3.GraphRank.launchGIR = false;
                    metExploreD3.GraphRank.quitGir();
                }
            }
        });

        view.lookupReference('loadRankFile').on({
            change: function() {
                metExploreD3.GraphUtils.handleFileSelect(view.lookupReference('loadRankFile').fileInputEl.dom, me.loadData);
                view.lookupReference('loadRankFile').fileInputEl.dom.value = "";
            }
        });

        view.lookupReference('extractNQuit').on({
            click: function() {
                metExploreD3.GraphRank.quitAndExtract();

                view.lookupReference('launchGIR').setText("launch GIR");
                view.lookupReference('extractNQuit').disable();

                metExploreD3.GraphRank.launchGIR = false;
            }
        });

        view.lookupReference('addMi').on({
            click: function() {
                var nbMi = view.lookupReference('miBox').items.items.length + 1;
                var boxRef = "box"+nbMi;
                var storeRef = "selectStart"+nbMi;

                var newBox = new Ext.panel.Panel({
                    layout: {
                        type: 'hbox'
                    },
                    reference: boxRef,
                    items: [
                        {
                            store: {
                                fields: ['metabolites']
                            },
                            xtype: 'combobox',
                            displayField: 'metabolites',
                            valueField: 'metabolites',
                            queryMode: 'local',
                            editable: false,
                            emptyText: '-- Select metabolite --',
                            margin: '5 5 5 5',
                            width: '100%',
                            anyMatch: true,
                            reference: storeRef
                        }
                    ]
                });
                view.lookupReference('miBox').add(newBox);
                if (_metExploreViz.rank.data !== undefined){
                    me.parseFile(_metExploreViz.rank);
                }
            }
        });

        view.lookupReference('delMi').on({
            click: function() {
                var nbMi = view.lookupReference('miBox').items.items.length;
                if (nbMi > 1){
                    var boxRef = "box"+nbMi;
                    var box = view.lookupReference(boxRef)
                    view.lookupReference('miBox').remove(box);
                }
            }
        });
        
    },

    loadData : function(tabTxt, title) {
		var me=this;
        var mask = metExploreD3.createLoadMask("Loading data","viz");

		var data = tabTxt;
		tabTxt = tabTxt.replace(/\r/g, "");
	    var lines = tabTxt.split('\n');

	    var firstLine = lines.splice(0, 1);
	    firstLine = firstLine[0].split('\t');

	    var targetName = firstLine.splice(0, 1);
	    var array = [];

        for (var i = 0; i < _metExploreViz.rank.length; i++){
            if (title === _metExploreViz.rank[i].name){
                metExploreD3.displayWarning("Loaded file", "This file has already been loaded");
                return;
            }
        }

		if(targetName[0]=="Identifier" || targetName[0]=="reactionId" || targetName[0]=="Name") {
            metExploreD3.showMask(mask);
            metExploreD3.deferFunction(
                function(){
                    for (var i = lines.length - 1; i >= 0; i--) {
            	    	lines[i] = lines[i].split('\t').map(function (val) {
            				return val.replace(",", ".");
            			});
                        if (lines[i].length === 1){
                            lines.pop(i);
                        }
            	    }

                    var rankScore = {};
                    lines.map(function(line, i){
                        rankScore[line[0]] = [line[1],line[2]];
                    });

                    var data = metExploreD3.GraphRank.saveNetwork();
                    var rank = new Rank(title, data, "rankData", rankScore);

                    _metExploreViz.addRank(rank);
                    metExploreD3.fireEvent("girParams","fileLoad");

                    metExploreD3.hideMask(mask);
                }, 100);
        }
        else {
			// Warning for bad syntax file
			metExploreD3.displayWarning("Syntaxe error",
                'File have bad syntax. See <a target="_blank" href="http://metexplore.toulouse.inra.fr/metexploreViz/doc/documentation.php#fluxImport">MetExploreViz documentation</a>.'
            );
		}
	},

    parseFile: function(rankData) {
        var view = this.getView();
        var nbMi = view.lookupReference('miBox').items.items.length;

        var session = _metExploreViz.getSessionById("viz");
        var networkData = session.getD3Data();

        var rankScore = rankData.rank;
        var allMetabolite = Object.keys(rankScore);
        var listMi = [];

        allMetabolite.forEach(function(data){
            var rankIn = parseInt(rankScore[data][0]);
            var rankOut = parseInt(rankScore[data][1]);
            if (rankIn < 26 || rankOut < 26) {
                var nodeName = metExploreD3.GraphRank.transformId(data, "name");

                if (nodeName !== undefined){
                    var mi = {metabolites:nodeName};
                    listMi.push(mi);
                }
                // if (node === undefined){
                //     var mi = {metabolites:data};
                // }
                // listMi.push(mi);
            }
        });

        for (var i = 1; i < nbMi+1; i++){
            var comboComponent = this.getView().lookupReference('selectStart'+i);
            var metaStore = comboComponent.getStore();
            metaStore.setData(listMi);
        }
    }

});
