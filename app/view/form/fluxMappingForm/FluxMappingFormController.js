/**
 * @author JCG
 * (a)description fluxMappingFormController : Control displaying flux value
 */

Ext.define('metExploreViz.view.form.fluxMappingForm.FluxMappingFormController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.form-fluxMappingForm-fluxMappingForm',
    requires: [
        "metExploreViz.view.form.fluxScaleEditor.FluxScaleEditor"
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
            fileParse: function(){
                me.fileParse();
            },
            fileLoad: function(){
                view.enable();
            },
            updateScaleEditor: function(){
                me.updateScaleEditor();
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
                if (view.lookupReference('selectColNumber').getValue() === "two"){
                    view.lookupReference("secondConditionLabel").setHidden(false);
                    view.lookupReference("firstConditionLabel").setHidden(false);
                    view.lookupReference("secondConditionBox").setHidden(false);
                    if (view.lookupReference('scaleSelector').getValue() === "Manual"){
                        view.lookupReference('scaleEditorLabel1').setHidden(false);
                        view.lookupReference('scaleEditorLabel2').setHidden(false);
                        view.lookupReference('scaleEditor2').setHidden(false);
                    }
                }
                if (view.lookupReference('selectColNumber').getValue() === "one"){
                    view.lookupReference("secondConditionLabel").setHidden(true);
                    view.lookupReference("firstConditionLabel").setHidden(true);
                    view.lookupReference("secondConditionBox").setHidden(true);
                    if (view.lookupReference('scaleSelector').getValue() === "Manual"){
                        view.lookupReference('scaleEditorLabel2').setHidden(true);
                        view.lookupReference('scaleEditorLabel1').setHidden(true);
                        view.lookupReference('scaleEditor2').setHidden(true);
                    }
                }
                if (view.lookupReference('selectFile').getValue() !== null){
                    if (view.lookupReference('selectColNumber').getValue() === "one"){
                        var selectedFile = view.lookupReference("selectFile").getValue();
                        me.colParse(1, selectedFile);
                    }
                    if (view.lookupReference('selectColNumber').getValue() === "two"){
                        var selectedFile = view.lookupReference("selectFile").getValue();
                        me.colParse(2, selectedFile);
                    }
                }
            }
        });

        view.lookupReference('runFluxVizu').on({
            click: function(){
                if (metExploreD3.GraphStyleEdition.fluxPath1 === false && metExploreD3.GraphStyleEdition.fluxPath2 === false){
                    var selectedFile = view.lookupReference('selectFile').getValue();
                    var nbColSelect = view.lookupReference('selectColNumber').getValue();
                    var condSelect = view.lookupReference('selectConditionFlux').getValue();
                    var switchGraph = view.lookupReference('displayGraphDistrib').getValue();
                    var scaleSelector = view.lookupReference('scaleSelector').getValue();

                    if (selectedFile !== null && nbColSelect !== null && condSelect !== null){
                        if (nbColSelect === "one"){
                            var color = document.getElementById("html5colorpickerFlux1").value;
                            metExploreD3.GraphStyleEdition.fluxPath1 = true;
                            me.computeFlux(selectedFile, nbColSelect, condSelect, "null", color, switchGraph, scaleSelector);
                        }
                        if (nbColSelect === "two"){
                            var color = [document.getElementById("html5colorpickerFlux1").value,
                                        document.getElementById("html5colorpickerFlux2").value];
                            metExploreD3.GraphStyleEdition.fluxPath2 = true;
                            var condSelect2 = view.lookupReference('selectConditionFlux2').getValue();
                            me.computeFlux(selectedFile, nbColSelect, condSelect, condSelect2, color, switchGraph, scaleSelector);
                        }
                        if (view.lookupReference('addValueNetwork').getValue() === true){
                            var size = view.lookupReference('fontSize').getValue();
                            var label = view.lookupReference('selectLabelDisplayed').getValue();
                            metExploreD3.GraphFlux.addValueOnEdge(size, label);
                        }
                        view.lookupReference('runNewParams').enable();
                        view.lookupReference('runFluxVizu').setText("Remove display");
                    }
                }

                else{
                    metExploreD3.GraphStyleEdition.fluxPath1 = false;
                    metExploreD3.GraphStyleEdition.fluxPath2 = false;
                    metExploreD3.GraphLink.tick('viz');
                    metExploreD3.GraphCaption.drawCaption();
                    metExploreD3.GraphFlux.restoreStyles(_metExploreViz.linkStyle);
                    metExploreD3.GraphFlux.removeGraphDistrib();
                    metExploreD3.GraphFlux.removeValueOnEdge();

                    view.lookupReference('runNewParams').disable();
                    view.lookupReference('runFluxVizu').setText("Display");
                }

            }
        });

        view.lookupReference('runNewParams').on({
            click: function(){
                metExploreD3.GraphStyleEdition.fluxPath1 = false;
                metExploreD3.GraphStyleEdition.fluxPath2 = false;
                metExploreD3.GraphLink.tick('viz');
                metExploreD3.GraphCaption.drawCaption();
                metExploreD3.GraphFlux.restoreStyles(_metExploreViz.linkStyle);
                metExploreD3.GraphFlux.removeGraphDistrib();
                metExploreD3.GraphFlux.removeValueOnEdge();

                var selectedFile = view.lookupReference('selectFile').getValue();
                var nbColSelect = view.lookupReference('selectColNumber').getValue();
                var condSelect = view.lookupReference('selectConditionFlux').getValue();
                var switchGraph = view.lookupReference('displayGraphDistrib').getValue();
                var scaleSelector = view.lookupReference('scaleSelector').getValue();

                if (selectedFile !== null && nbColSelect !== null && condSelect !== null){
                    if (nbColSelect === "one"){
                        var color = document.getElementById("html5colorpickerFlux1").value;
                        metExploreD3.GraphStyleEdition.fluxPath1 = true;
                        me.computeFlux(selectedFile, nbColSelect, condSelect, "null", color, switchGraph, scaleSelector);
                    }
                    if (nbColSelect === "two"){
                        var color = [document.getElementById("html5colorpickerFlux1").value,
                                    document.getElementById("html5colorpickerFlux2").value];
                        metExploreD3.GraphStyleEdition.fluxPath2 = true;
                        var condSelect2 = view.lookupReference('selectConditionFlux2').getValue();
                        me.computeFlux(selectedFile, nbColSelect, condSelect, condSelect2, color, switchGraph, scaleSelector);
                    }
                    if (view.lookupReference('addValueNetwork').getValue() === true){
                        var size = view.lookupReference('fontSize').getValue();
                        var label = view.lookupReference('selectLabelDisplayed').getValue();
                        metExploreD3.GraphFlux.addValueOnEdge(size, label);
                    }
                }
            }
        });

        view.lookupReference('addValueNetwork').on({
            change: function(){
                if (metExploreD3.GraphStyleEdition.fluxPath1 === true || metExploreD3.GraphStyleEdition.fluxPath2 === true){
                    if (view.lookupReference('addValueNetwork').getValue() === true){
                        var size = view.lookupReference('fontSize').getValue();
                        var label = view.lookupReference('selectLabelDisplayed').getValue();
                        metExploreD3.GraphFlux.addValueOnEdge(size, label);
                    }
                    if (view.lookupReference('addValueNetwork').getValue() === false){
                        metExploreD3.GraphFlux.removeValueOnEdge();
                    }
                }
                if (view.lookupReference('addValueNetwork').getValue() === true){
                    view.lookupReference('fontSize').setHidden(false);
                    view.lookupReference('selectLabel').setHidden(false);
                }
                if (view.lookupReference('addValueNetwork').getValue() === false){
                    view.lookupReference('fontSize').setHidden(true);
                    view.lookupReference('selectLabel').setHidden(true);
                }
            }
        });

        view.lookupReference('fontSize').on({
            keypress: function(field, event){
                if (event.getKey() === event.ENTER){
                    var size = view.lookupReference('fontSize').getValue();
                    metExploreD3.GraphFlux.setFontSize(size);
                }
            }
        });

        view.lookupReference('selectLabelDisplayed').on({
            change: function(){
                if (metExploreD3.GraphStyleEdition.fluxPath1 === true || metExploreD3.GraphStyleEdition.fluxPath2 === true){
                    if (view.lookupReference('addValueNetwork').getValue() === true){
                        metExploreD3.GraphFlux.removeValueOnEdge();
                        var size = view.lookupReference('fontSize').getValue();
                        var label = view.lookupReference('selectLabelDisplayed').getValue();
                        metExploreD3.GraphFlux.addValueOnEdge(size, label);
                    }
                }
            }
        });

        view.lookupReference('scaleSelector').on({
            change: function(){
                if (this.getValue() === "Manual"){
                    var nbCol = view.lookupReference('selectColNumber').getValue();
                    if (nbCol === "one"){
                        var condSelect = view.lookupReference('selectConditionFlux').getValue();
                        if (condSelect !== null){
                            view.lookupReference('scaleEditor').setHidden(false);
                            var selectedFile = view.lookupReference('selectFile').getValue();
                            me.drawScaleEditor(selectedFile, condSelect, "null", nbCol);
                        }
                    }
                    if (nbCol === "two"){
                        var condSelect = view.lookupReference('selectConditionFlux').getValue();
                        var condSelect2 = view.lookupReference('selectConditionFlux2').getValue();
                        if (condSelect !== null){
                            view.lookupReference('scaleEditor').setHidden(false);
                            view.lookupReference('scaleEditorLabel1').setHidden(false);
                        }
                        if (condSelect2 !== null){
                            view.lookupReference('scaleEditor2').setHidden(false);
                            view.lookupReference('scaleEditorLabel2').setHidden(false);
                        }
                        if (condSelect !== null && condSelect2 !== null){
                            var selectedFile = view.lookupReference('selectFile').getValue();
                            me.drawScaleEditor(selectedFile, condSelect, condSelect2, nbCol);
                        }
                    }
                }
                if (this.getValue() !== "Manual"){
                    view.lookupReference('scaleEditor').setHidden(true);
                    view.lookupReference('scaleEditor2').setHidden(true);
                    view.lookupReference('scaleEditorLabel1').setHidden(true);
                    view.lookupReference('scaleEditorLabel2').setHidden(true);
                }
            }
        });

        view.lookupReference('selectConditionFlux').on({
            change: function(){
                if (view.lookupReference('scaleSelector').getValue() === "Manual"){
                    view.lookupReference('scaleEditor').setHidden(false);

                    var condSelect = view.lookupReference('selectConditionFlux').getValue();
                    var condSelect2 = view.lookupReference('selectConditionFlux2').getValue();
                    var selectedFile = view.lookupReference('selectFile').getValue();
                    var nbColSelect = view.lookupReference('selectColNumber').getValue();
                    if (condSelect2 === undefined){
                        me.drawScaleEditor(selectedFile, condSelect, "null", nbColSelect);
                    }
                    if (condSelect2 !== undefined){
                        me.drawScaleEditor(selectedFile, condSelect, condSelect2, nbColSelect);
                    }
                }
            }
        });

        view.lookupReference('selectConditionFlux2').on({
            change: function(){
                if (view.lookupReference('scaleSelector').getValue() === "Manual"){
                    view.lookupReference('scaleEditor2').setHidden(false);
                    view.lookupReference('scaleEditorLabel2').setHidden(false);
                    view.lookupReference('scaleEditorLabel1').setHidden(false);

                    var condSelect = view.lookupReference('selectConditionFlux').getValue();
                    var condSelect2 = view.lookupReference('selectConditionFlux2').getValue();
                    var selectedFile = view.lookupReference('selectFile').getValue();
                    var nbColSelect = view.lookupReference('selectColNumber').getValue();
                    me.drawScaleEditor(selectedFile, condSelect, condSelect2, nbColSelect);
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

        var listCond = [];

        for (var i = 0; i < fluxCondition.length; i++){
            var cond = fluxCondition[i];
            var tmp = {fluxCond:cond};
            listCond.push(tmp);
        }

        if (nbCol === 1){
            var comboComponent = this.getView().lookupReference('selectConditionFlux');
            var condStore = comboComponent.getStore();

            condStore.setData(listCond);
        }
        if (nbCol === 2){
            var comboComponent = this.getView().lookupReference('selectConditionFlux');
            var comboComponent2 = this.getView().lookupReference('selectConditionFlux2');
            var condStore = comboComponent.getStore();
            var condStore2 = comboComponent2.getStore();

            condStore.setData(listCond);
            condStore2.setData(listCond);
        }
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

    computeFlux: function(selectedFile, nbCol, condSelect, condSelect2, color, switchGraph, scaleSelector){
        var me = this;
        var view = me.getView();

        var data = this.getFluxData(selectedFile, nbCol, condSelect, condSelect2);
        var conData = data[0];
        var targetLabel = data[1];
        var scaleRange1 = [];
        var scaleRange2 = [];

        var scaleSave = view[selectedFile];

        if (scaleSave !== undefined){
            var scaleRange1 = scaleSave[condSelect];
            var scaleRange2 = scaleSave[condSelect2];
        }

        metExploreD3.GraphFlux.displayChoice(conData, targetLabel, nbCol, color, scaleSelector, scaleRange1, scaleRange2);

        if (nbCol === "one"){
            metExploreD3.GraphFlux.graphDistribOne(conData, color, switchGraph, scaleSelector, scaleRange1);
        }
        if (nbCol === "two"){
            metExploreD3.GraphFlux.graphDistribTwo(conData, color, switchGraph, scaleSelector, scaleRange1, scaleRange2);
        }
    },

    getFluxData: function(selectedFile, nbCol, condSelect, condSelect2){
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
            var condSplit = [condSelect, condSelect2];
            var indexCond1;
            var indexCond2;

            for (var i = 0; i < fluxCond.length; i++){
                if (condSplit[0] === fluxCond[i]){
                    indexCond1 = i+1;
                }
                if (condSplit[1] === fluxCond[i]){
                    indexCond2 = i+1;
                }
            }
            for (var i = 0; i < fluxData.length; i++){
                var data = [];
                data.push(fluxData[i][0]);
                data.push(fluxData[i][indexCond1]);
                data.push(fluxData[i][indexCond2]);
                conData.push(data);
            }
        }
        var fluxData = [conData, targetLabel];
        return fluxData;
    },

    drawScaleEditor: function(selectedFile, selectedCond, selectedCond2, nbCol) {
		var me = this;
		var view = me.getView();

		var margin = 0;
		var width = 190;
		var height = 50;

        var data = this.getFluxData(selectedFile, nbCol, selectedCond, selectedCond2);
        var fluxData = data[0];
        var targetLabel = data[1];

        var dataSave = view[selectedFile];
        if (dataSave === undefined){
            dataSave = {};
        }

        if (nbCol === "two"){
            var fluxData1 = [];
            var fluxData2 = [];
            for (var i = 0; i < fluxData.length; i++){
                var tmp = [fluxData[i][0], fluxData[i][1]];
                fluxData1.push(tmp);
                var tmp = [fluxData[i][0], fluxData[i][2]];
                fluxData2.push(tmp);
            }
            var scaleRange1 = metExploreD3.GraphFlux.getScale(fluxData1, targetLabel);
            var scaleRange2 = metExploreD3.GraphFlux.getScale(fluxData2, targetLabel);

            if (dataSave[selectedCond] !== undefined){
                scaleRange1 = dataSave[selectedCond];
            }
            if (dataSave[selectedCond] === undefined) {
                dataSave[selectedCond] = scaleRange1;
            }

            if (dataSave[selectedCond2] !== undefined){
                scaleRange2 = dataSave[selectedCond2];
            }
            if (dataSave[selectedCond2] === undefined) {
                dataSave[selectedCond2] = scaleRange2;
            }

            view[selectedFile] = dataSave;

            var svg = d3.select(view.lookupReference('scaleEditor').el.dom).select("#scaleEditor");

    		metExploreD3.GraphNumberScaleEditor.createNumberScaleCaption(svg, width, height, margin, scaleRange1);

    		svg.on("click", function(){
    			var win = Ext.create("metExploreViz.view.form.fluxScaleEditor.FluxScaleEditor", {
                    scaleRange: scaleRange1,
                    cond: "first"
                });

    			win.show();
    		});

            var svg2 = d3.select(view.lookupReference('scaleEditor2').el.dom).select("#scaleEditor2");

    		metExploreD3.GraphNumberScaleEditor.createNumberScaleCaption(svg2, width, height, margin, scaleRange2);

    		svg2.on("click", function(){
    			var win = Ext.create("metExploreViz.view.form.fluxScaleEditor.FluxScaleEditor", {
                    scaleRange: scaleRange2,
                    cond: "second"
                });

    			win.show();
    		});
        }

        if (nbCol === "one"){
            var scaleRange = metExploreD3.GraphFlux.getScale(fluxData, targetLabel);

            if (dataSave[selectedCond] !== undefined){
                scaleRange = dataSave[selectedCond];
            }
            else {
                dataSave[selectedCond] = scaleRange;
            }

            view[selectedFile] = dataSave;

    		var svg = d3.select(view.lookupReference('scaleEditor').el.dom).select("#scaleEditor");

    		metExploreD3.GraphNumberScaleEditor.createNumberScaleCaption(svg, width, height, margin, scaleRange);

    		svg.on("click", function(){
    			var win = Ext.create("metExploreViz.view.form.fluxScaleEditor.FluxScaleEditor", {
                    scaleRange: scaleRange,
                    cond: "first"
                });

    			win.show();
    		});
        }

    },

    updateScaleEditor: function(){
        var me = this;
        var view = me.getView();

        var margin = 0;
		var width = 190;
		var height = 50;

        var selectedFile = view.lookupReference('selectFile').getValue();

        var scaleRange = Ext.getCmp("fluxScaleEditorID").scaleRange;
        var cond = Ext.getCmp("fluxScaleEditorID").cond;

        if (cond === "first"){
            var selectedCond = view.lookupReference('selectConditionFlux').getValue();

            var dataSave = view[selectedFile];
            if (dataSave !== undefined){
                dataSave[selectedCond] = scaleRange;
            }
            else {
                dataSave = {};
                dataSave[selectedCond] = scaleRange;
            }
            view[selectedFile] = dataSave;

            var svg = d3.select(view.lookupReference('scaleEditor').el.dom).select("#scaleEditor");
            svg.selectAll("*").remove();

            svg = d3.select(view.lookupReference('scaleEditor').el.dom).select("#scaleEditor");

            metExploreD3.GraphNumberScaleEditor.createNumberScaleCaption(svg, width, height, margin, scaleRange);

            svg.on("click", function(){
    			var win = Ext.create("metExploreViz.view.form.fluxScaleEditor.FluxScaleEditor", {
                    scaleRange: scaleRange,
                    cond: 'first'
                });

    			win.show();
    		});
        }

        if (cond === "second"){
            var selectedCond = view.lookupReference('selectConditionFlux2').getValue();

            var dataSave = view[selectedFile];
            if (dataSave !== undefined){
                dataSave[selectedCond] = scaleRange;
            }
            else {
                dataSave = {};
                dataSave[selectedCond] = scaleRange;
            }
            view[selectedFile] = dataSave;

            var svg = d3.select(view.lookupReference('scaleEditor2').el.dom).select("#scaleEditor2");
            svg.selectAll("*").remove();

            svg = d3.select(view.lookupReference('scaleEditor2').el.dom).select("#scaleEditor2");

            metExploreD3.GraphNumberScaleEditor.createNumberScaleCaption(svg, width, height, margin, scaleRange);

            svg.on("click", function(){
    			var win = Ext.create("metExploreViz.view.form.fluxScaleEditor.FluxScaleEditor", {
                    scaleRange: scaleRange,
                    cond: 'second'
                });

    			win.show();
    		});
        }


    }

});
