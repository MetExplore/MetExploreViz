Ext.define('metExploreViz.view.button.buttonImportImage.ButtonImportImageController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.buttonImportImage',

    init: function() {
        var me=this,
            view      = me.getView();

        // Listener which allows opening file manager of client side
        /*view.lookupReference('importImage').on({
            change: function () {
                console.log(view.lookupReference('importImage'));
                var sessions = _metExploreViz.getSessionsSet();
                var input = view.lookupReference('importImage').fileInputEl.dom;
                if (!window.File || !window.FileReader || !window.FileList || !window.Blob) {
                    alert('The File APIs are not fully supported in this browser.');
                    return;
                }

                if (!input) {
                    alert("couldn't find the fileinput element.");
                }
                else if (!input.files) {
                    alert("This browser doesn't seem to support the `files` property of file inputs.");
                }
                else {
                    console.log(input.files);
                }
                console.log(view.lookupReference('importImage'));
            },
            scope : me
        });*/
        
        view.on({
            change: function (filefield, newFileName, oldFileName) {
                var fileList = filefield.getFileList();
                //console.log(fileList);
                //console.log(this.fileInputEl.dom);
                //console.log(view.fileInputEl.dom.files);
                metExploreD3.GraphStyleEdition.mapImageToNode(fileList);
            }
        })
    }

    /**
     * Override that adds the multiple config to the fileInputEl.dom
     */
    /*onRender: function () {
        this.callParent(arguments);
        this.fileInputEl.dom.setAttribute('multiple', this.multiple);
    },*/

    /**
     * Convenience method that will return the files in the fileInputEl.dom
     */
    /*getFileList: function () {
        return this.fileInputEl.dom.files;
    }*/
});
