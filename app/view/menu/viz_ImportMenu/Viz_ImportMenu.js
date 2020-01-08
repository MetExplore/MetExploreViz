/**
 * @author Fabien Jourdan
 * (a)description Menu export network viz
 */

Ext.define('metExploreViz.view.menu.viz_ImportMenu.Viz_ImportMenu', {
    extend: 'Ext.menu.Menu', 
    alias: 'widget.vizImportMenu',
    
    requires: [
        'metExploreViz.view.menu.viz_ImportMenu.Viz_ImportMenuController',
        'metExploreViz.view.menu.viz_ImportMenu.Viz_ImportMenuModel'
    ],

    controller: "menu-vizImportMenu-vizImportMenu",
    viewModel: {
        type: "menu-vizImportMenu-vizImportMenu"
    },
   
    items:  [
        {
            text: 'Import mapping from tab file',
            reference:'importMapping',
            iconCls:'importData'
        },
        {
            hidden:true,
            id:'buttonMap',   
            xtype:'buttonImportMapping'/*,text: 'Refresh/Build network'*/
        }
        ,
        {
            text: 'Import side compounds from tab file',
            reference:'importSideCompounds',
            iconCls:'importData'
        },
        {
            hidden:true,
            id:'buttonSide',   
            xtype:'buttonImportSideCompounds'/*,text: 'Refresh/Build network'*/
        },
        {
            text: 'Import coordinates',
            reference:'importCoordinates',
            iconCls:'importCoordinates'
        },
        {
            hidden:true,
            id:'buttonImportCoords',
            xtype:'buttonImportCoordinates'/*,text: 'Refresh/Build network'*/
        },
        {
            hidden:true,
            id:'buttonImportGML',
            xtype:'buttonImportGML'/*,text: 'Refresh/Build network'*/
        },
        {
            text: 'Import Cycle',
            reference: 'importCycle',
            iconCls:'importCycle'
        },
        {
            hidden:true,
            id:'buttonCycle',
            xtype:'buttonImportCycle'
        },
        {
            text: 'Image Mapping',
            menu: {
                items: [
                    {
                        text: 'By Name',
                        reference: 'importImageMappingName',
                    },
                    {
                        text: 'By Id',
                        reference: 'importImageMappingID',

                    }]
            },
            iconCls:'importImage'
        },
        {
            xtype: 'buttonImportImage',
            reference: 'importImageMappingHidden',
            buttonConfig: {
                text: 'Add logo',
                width: '100%',
                ui: 'default-toolbar'
            },
            buttonOnly: true,
            multiple: true,
            hidden: true
        }
        // {
        //     text: 'Import saved network from JSON file',
        //     reference:'importSavedNetwork',
        //     tooltip:'Import saved network from JSON file',
        //     iconCls:'importData'
        // },
        // {
        //     hidden:true,
        //     id:'buttonImportSavedNetwork',   
        //     xtype:'buttonImportSavedNetwork'
        // }
    ]
});

