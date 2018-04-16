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
        //view.lookupReference('chooseFontSize').setValue('10');

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

        view.lookupReference('refreshLabelStyleSelection').on({
            click : function()
            {
                var fontType = view.lookupReference('chooseFontTypeSelection').getValue();
                var fontSize = view.lookupReference('chooseFontSizeSelection').getValue();
                var fontBold = view.lookupReference('checkBoldFontSelection').getValue();
                var fontItalic = view.lookupReference('checkItalicFontSelection').getValue();
                var fontUnderline = view.lookupReference('checkUnderlineFontSelection').getValue();
                metExploreD3.GraphFunction.changeAllFontType(fontType, "selection");
                (!isNaN(fontSize) && fontSize>0 && fontSize<40) ? metExploreD3.GraphFunction.changeAllFontSize(fontSize, "selection") : null;
                metExploreD3.GraphFunction.changeAllFontBold(fontBold, "selection");
                metExploreD3.GraphFunction.changeAllFontItalic(fontItalic, "selection");
                metExploreD3.GraphFunction.changeAllFontUnderline(fontUnderline, "selection");
            },
            scope : me
        });

        view.lookupReference('refreshLabelStyleMetabolite').on({
            click : function()
            {
                var fontType = view.lookupReference('chooseFontTypeMetabolite').getValue();
                var fontSize = view.lookupReference('chooseFontSizeMetabolite').getValue();
                var fontBold = view.lookupReference('checkBoldFontMetabolite').getValue();
                var fontItalic = view.lookupReference('checkItalicFontMetabolite').getValue();
                var fontUnderline = view.lookupReference('checkUnderlineFontMetabolite').getValue();
                metExploreD3.GraphFunction.changeAllFontType(fontType, "metabolite");
                (!isNaN(fontSize) && fontSize>0 && fontSize<40) ? metExploreD3.GraphFunction.changeAllFontSize(fontSize, "metabolite") : null;
                metExploreD3.GraphFunction.changeAllFontBold(fontBold, "metabolite");
                metExploreD3.GraphFunction.changeAllFontItalic(fontItalic, "metabolite");
                metExploreD3.GraphFunction.changeAllFontUnderline(fontUnderline, "metabolite");
            },
            scope : me
        });

        view.lookupReference('refreshLabelStyleReaction').on({
            click : function()
            {
                var fontType = view.lookupReference('chooseFontTypeReaction').getValue();
                var fontSize = view.lookupReference('chooseFontSizeReaction').getValue();
                var fontBold = view.lookupReference('checkBoldFontReaction').getValue();
                var fontItalic = view.lookupReference('checkItalicFontReaction').getValue();
                var fontUnderline = view.lookupReference('checkUnderlineFontReaction').getValue();
                metExploreD3.GraphFunction.changeAllFontType(fontType, "reaction");
                (!isNaN(fontSize) && fontSize>0 && fontSize<40) ? metExploreD3.GraphFunction.changeAllFontSize(fontSize, "reaction") : null;
                metExploreD3.GraphFunction.changeAllFontBold(fontBold, "reaction");
                metExploreD3.GraphFunction.changeAllFontItalic(fontItalic, "reaction");
                metExploreD3.GraphFunction.changeAllFontUnderline(fontUnderline, "reaction");
            },
            scope : me
        });

        view.lookupReference('refreshCurve').on({
            click : function()
            {
                var curveBundling = view.lookupReference('EdgeBundling').getValue();
                if (curveBundling == true) {
                    metExploreD3.GraphFunction.curvedPath = true;
                    metExploreD3.GraphFunction.bundleLinks();
                }
                else {
                    metExploreD3.GraphFunction.curvedPath = false;
                    metExploreD3.GraphLink.tick("viz");
                }
            },
            scope : me
        });
    },

    drawCaption : function(){
        metExploreD3.GraphCaption.drawCaption();
    }
});