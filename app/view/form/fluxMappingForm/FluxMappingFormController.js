/**
 * @author JCG
 * (a)description fluxMappingFormController : Control displaying flux value
 */

Ext.define('metExploreViz.view.form.fluxMappingForm.FluxMappingFormController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.form-fluxMappingForm-fluxMappingForm',

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
            fileParse: function(){
                me.fileParse();
            },
            fileLoad: function(){
                view.enable();
            }
        });

        view.lookupReference('selectFile').on({
            change: function(){
                var selectFile = this.getValue();
                var nbCol = view.lookupReference('selectColNumber').getValue();
                if (nbCol === "one"){
                    me.colParse(1, selectFile);
                }
                if (nbCol === "two"){
                    me.colParse(2, selectFile);
                }
            }
        });

        view.lookupReference('selectColNumber').on({
            change: function(){
                if (view.lookupReference('selectColNumber').getValue() === "one"){
                    console.log("just one col please");
                    var selectedFile = view.lookupReference("selectFile").getValue();
                    console.log("this file",selectedFile);
                    me.colParse(1, selectedFile);
                }
                if (view.lookupReference('selectColNumber').getValue() === "two"){
                    console.log("I take two col please");
                    var selectedFile = view.lookupReference("selectFile").getValue();
                    console.log("this file",selectedFile);
                    me.colParse(2, selectedFile);
                }
            }
        });

        view.lookupReference('runFluxVizu').on({
            click: function(){
                if (metExploreD3.GraphStyleEdition.fluxPath === false){
                    var selectedFile = view.lookupReference('selectFile').getValue();
                    var nbColSelect = view.lookupReference('selectColNumber').getValue();
                    var condSelect = view.lookupReference('selectConditionFlux').getValue();

                    me.computeFlux(selectedFile, nbColSelect, condSelect);

                    metExploreD3.GraphStyleEdition.fluxPath = true;
                    view.lookupReference('runFluxVizu').setText("Remove display");
                }

                else{
                    metExploreD3.GraphStyleEdition.fluxPath = false;
                    metExploreD3.GraphLink.tick('viz');
                    metExploreD3.GraphCaption.drawCaption();
                    metExploreD3.GraphFlux.restoreStyles(_metExploreViz.linkStyle);
                    metExploreD3.GraphFlux.removeGraphDistrib();

                    view.lookupReference('runFluxVizu').setText("Display");
                }

            }
        });
    },

    colParse: function(nbCol, selectedFile){
        var fluxList = _metExploreViz.flux;
        var fileIndex = [];
        fluxList.forEach(function(list, i){
            if (list.name === selectedFile){
                fileIndex.push(i);
            }
        });
        var fluxCondition = fluxList[fileIndex].conditions;

        var comboComponent = this.getView().lookupReference('selectConditionFlux');
        var condStore = comboComponent.getStore();

        var listCond = [];

        if(nbCol === 1){
            for (var i = 0; i < fluxCondition.length; i++){
                var cond = fluxCondition[i];
                var tmp = {fluxCond:cond};
                listCond.push(tmp);
            }
        }

        if(nbCol === 2){
            for (var i = 0; i < fluxCondition.length; i=i+2){
                var cond = fluxCondition[i]+" / "+fluxCondition[i+1];
                var tmp = {fluxCond:cond};
                listCond.push(tmp);
            }
        }

        condStore.setData(listCond);
    },

    fileParse: function(){
        var fluxList = _metExploreViz.flux;
        var fileName = [];

        fluxList.forEach(function(flux){
            fileName.push({'file':flux.name});
        });

        var comboComponent = this.getView().lookupReference('selectFile');
        var condStore = comboComponent.getStore();

        condStore.setData(fileName);
    },

    computeFlux: function(selectedFile, nbCol, condSelect){
        var fluxList = _metExploreViz.flux;
        var fileIndex = [];
        fluxList.forEach(function(list, i){
            if (list.name === selectedFile){
                fileIndex.push(i);
            }
        });

        var targetLabel = _metExploreViz.flux[fileIndex].targetLabel;
        var fluxData = _metExploreViz.flux[fileIndex].data;
        var fluxCond = _metExploreViz.flux[fileIndex].conditions;
        var conData = [];

        if (nbCol === "one"){
            for (var i = 0; i < fluxCond.length; i++){
                if (fluxCond[i] === condSelect){
                    var indexCond = i+1;
                }
            }
            for (var i = 0; i < fluxData.length; i++){
                var data = [];
                data.push(fluxData[i][0]);
                data.push(fluxData[i][indexCond]);
                conData.push(data)
            }
        }

        if (nbCol === "two"){
            var condSplit = condSelect.split(" / ");
            var indexCond = [];

            for (var i = 0; i < fluxCond.length; i++){
                condSplit.forEach(function(cond){
                    if (cond === fluxCond[i]){
                        indexCond.push(i+1);
                    }
                });
            }
            for (var i = 0; i < fluxData.length; i++){
                var data = [];
                data.push(fluxData[i][0]);
                indexCond.forEach(function(index){
                    data.push(fluxData[i][index]);
                });
                conData.push(data);
            }
        }
        metExploreD3.GraphFlux.displayChoice(conData, targetLabel, nbCol);
        metExploreD3.GraphFlux.graphDistrib(conData);
    }

});
