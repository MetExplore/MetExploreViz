/**
 * @author JCG
 * (a)description GirForm : Manage Pathways for GIR
 */
Ext.define('metExploreViz.view.form.girPathwaysForm.GirPathwaysForm', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.girPathwaysForm',
    requires: [
        "metExploreViz.view.form.girPathwaysForm.GirPathwaysFormController"
    ],
    controller: "form-girPathwaysForm-girPathwaysForm",
    layout:{
       type:'vbox',
       align:'stretch'
    },
    region:'north',
    width:'100%',
    margins:'0 0 0 0',
    split:true,
    animation: true,
    autoScroll: true,
    autoHeight: true,
    id: "girPathwaysID",

});
