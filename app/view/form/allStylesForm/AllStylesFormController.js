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
                        title:aStyleForm.title,
                        default : aStyleForm.default,
                        scaleRange : aStyleForm.scaleRange,
                        valueMappings : aStyleForm.valueMappings
                    };
                });

            scales = scales.concat(partOfAllScales);
        });

        metExploreD3.GraphUtils.saveScaleRange(scales, true);
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
                console.log('--------------------------------------------------');
                console.log(scale);
                console.log('--------------------------------------------------');
                var form = Ext.getCmp(scale.biologicalType+"StyleForm");
                if(form){
                    console.log(form);
                    var theStyleForm = form.query("aStyleForm").find(function (aStyleForm) { return aStyleForm.title===scale.title;});
                    if(theStyleForm){
                        console.log(theStyleForm);
                        if (scale.default){
                            if(scale.default!==theStyleForm.default){
                                theStyleForm.default=scale.default;

                                metExploreD3.GraphStyleEdition.setCollectionStyle(theStyleForm.target, theStyleForm.attrType, theStyleForm.attrName, theStyleForm.biologicalType, scale.default);
                            }
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

                        // if (scale.valueMappings){
                        //     if(scale.valueMappings!==theStyleForm.valueMappings){
                        //         theStyleForm.valueMappings=scale.valueMappings;
                        //
                        //         var selectConditionForm = theStyleForm.lookupReference('selectConditionForm');
                        //         var selectCondition = selectConditionForm.lookupReference('selectCondition');
                        //         var selectConditionType = selectConditionForm.lookupReference('selectConditionType');
                        //
                        //         var dataType = selectConditionType.getValue();
                        //         var selectedCondition = selectCondition.getValue();
                        //         if((dataType==="Discrete" || dataType==="As Selection") && selectedCondition!==null){
                        //             theStyleForm.getController().updateContinuousCaption();
                        //             theStyleForm.getController().updateContinuousMapping();
                        //         }
                        //     }
                        // }
                    }
                }

                console.log('--------------------------------------------------');
            });

            view.query("allStylesByTypeForm")
                .forEach(function (allStylesByTypeForm) {
                    allStylesByTypeForm.query("aStyleForm")
                        .forEach(function (aStyleForm) {
                            if (aStyleForm.scaleRange)
                                viewAStyleForm.getController().updateContinuousCaption();

                            if (aStyleForm.scaleRange)
                                viewAStyleForm.getController().updateContinuousCaption();

                        })
                });
        });


    }
});