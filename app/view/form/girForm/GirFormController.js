/**
 * @author JCG
 * (a)description metaboRankFormController : Control GIR parameters
 */

Ext.define('metExploreViz.view.form.girForm.GirFormController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.form-girForm-girForm',
    requires: [

    ],

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
                var index = _metExploreViz.rank.length - 1;
                var lastFile = _metExploreViz.rank[index];
                view.lookupReference('selectFile').setValue(lastFile.name);

                me.parseFile(_metExploreViz.rank[index]);
            }
        });

        view.lookupReference('launchGIR').on({
            click: function() {
                if (metExploreD3.GraphRank.launchGIR === false) {
                    view.lookupReference('launchGIR').setText("quit GIR");
                    view.lookupReference('extractNQuit').enable();

                    var listMi = view.lookupReference('selectStart').value;

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
            }
        });
    },

    loadData : function(tabTxt, title) {
		var me=this;

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
		    var rank = new Rank(title, firstLine, targetName[0], array);
            for (var i = lines.length - 1; i >= 0; i--) {
    	    	lines[i] = lines[i].split('\t').map(function (val) {
    				return val.replace(",", ".");
    			});
                if (lines[i].length === 1){
                    lines.pop(i);
                }
    	    }
            rank.data = lines;

            _metExploreViz.addRank(rank);
            metExploreD3.fireEvent("girParams","fileLoad");
        }
        else {
			// Warning for bad syntax file
			metExploreD3.displayWarning("Syntaxe error",
                'File have bad syntax. See <a target="_blank" href="http://metexplore.toulouse.inra.fr/metexploreViz/doc/documentation.php#fluxImport">MetExploreViz documentation</a>.'
            );
		}
	},

    parseFile: function(rankData) {
        var allData = rankData.data;
        var listMi = [];
        allData.forEach(function(data){
            var rankIn = parseInt(data[1]);
            var rankOut = parseInt(data[2]);
            if (rankIn < 26 || rankOut < 26) {
                var mi = {metabolites:data[0]}
                listMi.push(mi);
            }
        });
        var comboComponent = this.getView().lookupReference('selectStart');
        var metaStore = comboComponent.getStore();
        metaStore.setData(listMi);
    }

});
