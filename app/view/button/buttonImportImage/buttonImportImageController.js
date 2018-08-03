Ext.define('metExploreViz.view.button.buttonImportImage.ButtonImportImageController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.buttonImportImage',

    init: function() {
        var me=this,
            view      = me.getView();
        
        view.on({
            change: function (filefield, newFileName, oldFileName) {
                var fileList = filefield.getFileList();
                metExploreD3.GraphMapping.mapImageToNode(fileList, view.target);
            }
        });
    }
});
