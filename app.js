/**
* @author MC
* (a)description : Interface with other developments
*/
Ext.require('metExploreViz.view.panel.networkPanel.NetworkPanel');

Ext.onReady(function() {
    var _networkPanelMetExplore = Ext.create('metExploreViz.view.panel.networkPanel.NetworkPanel', {
        closable: false,
        xtype : 'networkPanel',
        id : 'networkPanel'
    });
});


