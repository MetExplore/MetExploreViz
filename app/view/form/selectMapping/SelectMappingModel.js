Ext.define('metExploreViz.view.form.selectMapping.SelectMappingModel', {
    extend: 'Ext.app.ViewModel',

    alias: 'viewmodel.form-selectMapping-selectMapping',

    parent:'selectCondiditionForm',
    data: {
        name: 'metExploreViz'
    }

    // stores:{
    //     allMappings:{
    //         model:'metExploreViz.model.Mapping',
    //         storeId:'Mapping',
    //         autoLoad:false
    //     }
    // }
});
