/**
 * @author MC
 * (a)description GeneralStyleForm : Display Settings
 */
Ext.define('metExploreViz.view.form.generalStyleForm.GeneralStyleForm', {
    extend: 'Ext.panel.Panel',  
    alias: 'widget.generalStyleForm',
    requires: [
        "metExploreViz.view.form.generalStyleForm.GeneralStyleFormController",
        "metExploreViz.view.form.SelectDisplayReactionLabel",
        "metExploreViz.view.form.SelectDisplayMetaboliteLabel"
    ],
    controller: "form-generalStyleForm-generalStyleForm",
    
    region:'north',
    margin :'0 0 0 0',
    flex:1,
    width:'100%',
    border:false,
    autoScroll:true,
    layout: {
        type: 'vbox',
        align: 'stretch'
    }, 
    items: [
    {   
        xtype: 'textfield',
        reference:'chooseMaxNodes',
        fieldLabel: "Threshold of reactions displayed for optimization :",
        tooltip: "When this Threshold is exceed link or name will be undisplayed",
        displayField: 'threshold',
        editable:true,
        margin:'5 5 5 5',
        width:'100%', 
        listeners: {
            change: function(newValue, oldValue){
                this.lastValue = newValue;
            }   
        }        
    }
    ,  
    {
        xtype      : 'fieldcontainer',
        fieldLabel : 'Remove from visualisation if reaction threeshold is exceed.',
        reference:'chooseDisplayForOpt',
        margin:'5 5 5 5',
        defaultType: 'checkboxfield',
        items: [
            {
                boxLabel  : 'Name on nodes',
                name      : 'display',
                inputValue: '1',
                checked   : true,
                id        : 'name'
            }, {
                boxLabel  : 'Links',
                name      : 'display',
                inputValue: '2',
                checked   : true,
                id        : 'links'
            }
        ]
    }
    ,  
    {
        xtype:'button',
        iconCls:'refresh',
        margin:'5 5 5 0',
        reference: 'refreshGeneralConf',
        action: 'refreshGeneralConf'  
    }
    ]  
});