/**
 * @author MC
 * (a)description AllStylesFormController : Control displaying pathway and compartment caption
 */

Ext.define('metExploreViz.view.form.allStylesForm.AllStylesFormController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.form-allStylesForm-allStylesForm',

    /**
     * Aplies event linsteners to the view
     */
    init:function(){
        var me 		= this,
            viewModel   = me.getViewModel(),
            view      	= me.getView();

        view.on({
            refreshAllStyles : this.reloadAllScales,
            scope:me
        });

         view.query("allStylesByTypeForm").forEach(function (allStylesByTypeForm) {
            allStylesByTypeForm.lookupReference('saveAllScales')
                .on({
                    click : me.saveAllScales,
                    scope:me
                });
        });

        view.query("allStylesByTypeForm").forEach(function (allStylesByTypeForm) {
            allStylesByTypeForm.lookupReference('importAllScales')
                .on({
                    change : me.importAllScales,
                    scope:allStylesByTypeForm.controller
                });
        });



    },
    saveAllScales:function () {
        var me 		= this,
            viewModel   = me.getViewModel(),
            view      	= me.getView();

        var scales = [];

        view.query("allStylesByTypeForm").forEach(function (allStylesByTypeForm) {

            var partOfAllScales = allStylesByTypeForm.query("aStyleForm")
                .map(function (aStyleForm) {
                    return {
                        biologicalType:aStyleForm.biologicalType,
                        linkedStyles:aStyleForm.linkedStyles,
                        title:aStyleForm.title,
                        default : aStyleForm.default,
                        scaleRange : aStyleForm.scaleRange,
                        valueDiscreteMappings : aStyleForm.valueDiscreteMappings,
                        valueAsSelectionMappings : aStyleForm.valueAsSelectionMappings,
                        valueAliasMappings : aStyleForm.valueAliasMappings
                    };
                });

            scales = scales.concat(partOfAllScales);
        });

        metExploreD3.GraphUtils.saveStyles(scales, true);
    },
    importAllScales:function () {
        var me 		= this,
            viewModel   = me.getViewModel(),
            view      	= me.getView();

        var scales = [];

        metExploreD3.GraphUtils.handleFileSelect(view.lookupReference('importAllScales').fileInputEl.dom, function(allStyles){
            // Allows to reload the same file

            var allScales = metExploreD3.GraphUtils.decodeJSON(allStyles);
            allScales.forEach(function (scale) {
                var form = Ext.getCmp(scale.biologicalType+"StyleForm");
                if(form){
                    var theStyleForm = form.query("aStyleForm").find(function (aStyleForm) { return aStyleForm.title===scale.title;});
                    if(theStyleForm){
                        if (scale.default){
                            if(scale.default!==theStyleForm.default){

                                theStyleForm.default=scale.default;

                                theStyleForm.getController().updateDefaultFormValues();
                                metExploreD3.GraphStyleEdition.setCollectionStyle(theStyleForm.target, theStyleForm.attrType, theStyleForm.attrName, theStyleForm.biologicalType, scale.default);
                            }
                        }
                        if (scale.linkedStyles){
                                theStyleForm.linkedStyles=scale.linkedStyles;
                        }

                        if (scale.scaleRange){
                            if(scale.scaleRange!==theStyleForm.scaleRange){
                                theStyleForm.scaleRange=scale.scaleRange;

                                var selectConditionForm = theStyleForm.lookupReference('selectConditionForm');
                                var selectCondition = selectConditionForm.lookupReference('selectCondition');
                                var selectConditionType = selectConditionForm.lookupReference('selectConditionType');

                                var dataType = selectConditionType.getValue();
                                var selectedCondition = selectCondition.getValue();
                                if(dataType==="Continuous" && selectedCondition!==null){
                                    theStyleForm.getController().updateContinuousCaption();
                                    theStyleForm.getController().updateContinuousMapping();
                                }
                            }
                        }

                        if (scale.valueDiscreteMappings){
                            var newArray = scale.valueDiscreteMappings.map(function (val) {
                                return new ValueMapping(val.name, val.value);
                            });

                            if(newArray!==theStyleForm.valueDiscreteMappings){
                                theStyleForm.valueDiscreteMappings=newArray;

                                var selectConditionForm = theStyleForm.lookupReference('selectConditionForm');
                                var selectCondition = selectConditionForm.lookupReference('selectCondition');
                                var selectConditionType = selectConditionForm.lookupReference('selectConditionType');

                                var dataType = selectConditionType.getValue();
                                var selectedCondition = selectCondition.getValue();
                                if(dataType==="Discrete" && selectedCondition!==null){
                                    theStyleForm.getController().updateDiscreteMapping();
                                }
                            }
                        }

                        if (scale.valueAsSelectionMappings){
                            var newArray = scale.valueAsSelectionMappings.map(function (val) {
                                return new ValueMapping(val.name, val.value);
                            });

                            if(scale.valueAsSelectionMappings!==theStyleForm.valueAsSelectionMappings){
                                theStyleForm.valueAsSelectionMappings=newArray;

                                var selectConditionForm = theStyleForm.lookupReference('selectConditionForm');
                                var selectCondition = selectConditionForm.lookupReference('selectCondition');
                                var selectConditionType = selectConditionForm.lookupReference('selectConditionType');

                                var dataType = selectConditionType.getValue();
                                var selectedCondition = selectCondition.getValue();
                                if(dataType==="As selection" && selectedCondition!==null){
                                    theStyleForm.getController().updateDiscreteMapping();
                                }
                            }
                        }

                        if (scale.valueAliasMappings){
                            var newArray = scale.valueAliasMappings.map(function (val) {
                                return new ValueMapping(val.name, val.value);
                            });

                            if(scale.valueAliasMappings!==theStyleForm.valueAliasMappings){
                                theStyleForm.valueAliasMappings=newArray;

                                var selectConditionForm = theStyleForm.lookupReference('selectConditionForm');
                                var selectCondition = selectConditionForm.lookupReference('selectCondition');
                                var selectConditionType = selectConditionForm.lookupReference('selectConditionType');

                                var dataType = selectConditionType.getValue();
                                var selectedCondition = selectCondition.getValue();
                                if(dataType==="Alias" && selectedCondition!==null){
                                    theStyleForm.getController().updateDiscreteMapping();
                                }
                            }
                        }

                    }
                }

            });

            view.query("allStylesByTypeForm")
                .forEach(function (allStylesByTypeForm) {
                    allStylesByTypeForm.query("aStyleForm")
                        .forEach(function (aStyleForm) {
                            if (aStyleForm.scaleRange)
                                viewAStyleForm.getController().updateContinuousCaption();

                        })
                });
        });


    },
    reloadAllScales:function () {
        var me 		= this,
            viewModel   = me.getViewModel(),
            view      	= me.getView();
        var allScales = [];
        view.query("allStylesByTypeForm").forEach(function (allStylesByTypeForm) {
            var partOfAllScales = allStylesByTypeForm.query("aStyleForm")
                .forEach(function (scale) {
                    var form = Ext.getCmp(scale.biologicalType+"StyleForm");
                    if(form){
                        var theStyleForm = form.query("aStyleForm").find(function (aStyleForm) { return aStyleForm.title===scale.title;});
                        if(theStyleForm){

                            var selectConditionForm = theStyleForm.lookupReference('selectConditionForm');
                            var selectCondition = selectConditionForm.lookupReference('selectCondition');
                            var selectConditionType = selectConditionForm.lookupReference('selectConditionType');

                            var dataType = selectConditionType.getValue();
                            var selectedCondition = selectCondition.getValue();

                            if (scale.scaleRange){
                                if(dataType==="Continuous" && selectedCondition!==null){
                                    selectConditionForm.getController().map(true, true, theStyleForm);
                                }
                            }

                            if (scale.valueDiscreteMappings){
                                if(dataType==="Discrete" && selectedCondition!==null){
                                    selectConditionForm.getController().map(true, true, theStyleForm);
                                }
                            }

                            if (scale.valueAsSelectionMappings){
                               if(dataType==="As selection" && selectedCondition!==null){
                                    selectConditionForm.getController().map(true, true, theStyleForm);
                                }
                            }

                            if (scale.valueAliasMappings){
                                if(dataType==="Alias" && selectedCondition!==null){
                                    selectConditionForm.getController().map(true, true, theStyleForm);
                                }
                            }
                        }
                    }
                });
        });

        /*
        view.query("allStylesByTypeForm")
            .forEach(function (allStylesByTypeForm) {
                allStylesByTypeForm.query("aStyleForm")
                    .forEach(function (aStyleForm) {
                        if (aStyleForm.scaleRange)
                            aStyleForm.getController().updateContinuousCaption();

                    })
            });
        */
    }
});