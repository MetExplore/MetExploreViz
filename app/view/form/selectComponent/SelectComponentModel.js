Ext.define('metExploreViz.view.form.selectComponent.SelectComponentModel', {
    extend: 'Ext.app.ViewModel',

   /* requires:['metexplore.model.d3.Network',
    'metexplore.model.d3.LinkReactionMetabolite'],
*/
    alias: 'viewmodel.form-selectComponent-selectComponent',

    parent:'captionForm',
    data: {
        name: 'metExploreViz'
    }

    // stores:{
    //     allComponents:{
    //         model:'metExploreViz.model.Component',
    //         storeId:'Component',
    //         autoLoad:false
    //     }
    // }
});
