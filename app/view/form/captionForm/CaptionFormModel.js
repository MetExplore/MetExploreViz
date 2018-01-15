Ext.define('metExploreViz.view.form.captionForm.CaptionFormModel', {
    extend: 'Ext.app.ViewModel',

   /* requires:['metexplore.model.d3.Network',
    'metexplore.model.d3.LinkReactionMetabolite'],
*/
    alias: 'viewmodel.form-captionForm-captionForm',

    parent:'graphPanel',
    data: {
        name: 'metExploreViz'
    }

    /*stores:{
    	d3network:{
            model:'metexplore.model.d3.Network',
            autoLoad:false
        },
        linkReactionMetab:{
            model:'metexplore.model.d3.LinkReactionMetabolite',
            autoLoad:false
        }
    }*/

});
