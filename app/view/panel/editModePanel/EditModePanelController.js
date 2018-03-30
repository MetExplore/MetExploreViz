Ext.define('metExploreViz.view.panel.editModePanel.EditModePanelController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.panel-editModePanel-editModePanel',

    // requires:['metexplore.model.d3.Network','metexplore.global.Graph'],


    /**
     * Aplies event linsteners to the view
     */
    init:function(){
        var me 		= this,
            viewModel   = me.getViewModel(),
            view      	= me.getView();
        view.lookupReference('chooseFontSize').setValue('10');

        view.on({
            //newMapping : me.drawCaption,
            scope:me
        });

        view.lookupReference('refreshLabelStyle').on({
            click : function()
            {
                var fontType = view.lookupReference('chooseFontType').getValue();
                var fontSize = view.lookupReference('chooseFontSize').getValue();
                var fontBold = view.lookupReference('checkBoldFont').getValue();
                var fontItalic = view.lookupReference('checkItalicFont').getValue();
                var fontUnderline = view.lookupReference('checkUnderlineFont').getValue();
                metExploreD3.GraphFunction.changeAllFontType(fontType);
                (!isNaN(fontSize) && fontSize>0 && fontSize<40) ? metExploreD3.GraphFunction.changeAllFontSize(fontSize) : null;
                metExploreD3.GraphFunction.changeAllFontBold(fontBold);
                metExploreD3.GraphFunction.changeAllFontItalic(fontItalic);
                metExploreD3.GraphFunction.changeAllFontUnderline(fontUnderline);
            },
            scope : me
        });
    },

    drawCaption : function(){
        metExploreD3.GraphCaption.drawCaption();
    }
});