/*Ext.define('metExploreViz.view.button.buttonImportImage.ButtonImportImage', {
    extend: 'Ext.form.Panel',
    alias:'widget.buttonImportImage',
    controller : 'buttonImportImage',
    requires: [
        'metExploreViz.view.button.buttonImportImage.ButtonImportImageController'
    ],
    text: 'Import images',

    items: [{
        xtype: 'filefield',
        name : 'fileData',
        buttonOnly: true,
        height:'100%',
        width:'100px',
        reference : 'importImage',
        multiple: true,
        buttonConfig: {
            id : 'IDimportImage'
        }
    }],
    hideLabel: true
});*/


Ext.define('metExploreViz.view.button.buttonImportImage.ButtonImportImage', {
    extend: 'Ext.form.field.File',
    alias:'widget.buttonImportImage',
    controller : 'buttonImportImage',
    requires: [
        'metExploreViz.view.button.buttonImportImage.ButtonImportImageController'
    ],

    /**
     * @cfg {Boolean} multiple
     */

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
    }
});


