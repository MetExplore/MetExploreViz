/**
 * @author Adrien Rohan
 * Component for loading multiple files
 */

Ext.define('metExploreViz.view.button.buttonImportImage.ButtonImportImage', {
    extend: 'Ext.form.field.File',
    alias:'widget.buttonImportImage',
    controller : 'buttonImportImage',
    requires: [
        'metExploreViz.view.button.buttonImportImage.ButtonImportImageController'
    ],
    target:"ID",

    /**
     * Override that adds the multiple config to the fileInputEl.dom
     */
    onRender: function () {
        this.callParent(arguments);
        this.fileInputEl.dom.setAttribute('multiple', this.multiple);
    },

    /**
     * Convenience method that will return the files in the fileInputEl.dom
     */
    getFileList: function () {
        return this.fileInputEl.dom.files;
    },

    changeTarget: function(arg) {
        this.target = arg;
    }
});


