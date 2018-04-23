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

        view.lookupReference('comboChoseLabelItem').on({
            change : function(that, newValue, oldValue){
                var newCombo = Ext.getCmp(newValue);
                if(newCombo)
                    newCombo.setVisible(true);
                if(oldValue){
                    var oldCombo = Ext.getCmp(oldValue);
                    if(oldCombo)
                        oldCombo.setVisible(false);
                }
            },
            scope : me
        });


        view.lookupReference('refreshLabelStyle').on({
            click : function()
            {
                var fontType = view.lookupReference('chooseFontType').getValue();
                var fontSize = view.lookupReference('chooseFontSize').getValue();
                var fontBold = view.lookupReference('checkBoldFont').getValue();
                var fontItalic = view.lookupReference('checkItalicFont').getValue();
                var fontUnderline = view.lookupReference('checkUnderlineFont').getValue();
                var labelOpacity = (view.lookupReference('checkHideLabel').getValue()) ? 0.0 : 1.0;
                metExploreD3.GraphStyleEdition.changeAllFontType(fontType);
                (!isNaN(fontSize) && fontSize>0 && fontSize<40) ? metExploreD3.GraphStyleEdition.changeAllFontSize(fontSize) : null;
                metExploreD3.GraphStyleEdition.changeAllFontBold(fontBold);
                metExploreD3.GraphStyleEdition.changeAllFontItalic(fontItalic);
                metExploreD3.GraphStyleEdition.changeAllFontUnderline(fontUnderline);
                var s_MetaboliteStyle = metExploreD3.getMetaboliteStyle();
                var s_ReactionStyle = metExploreD3.getReactionStyle();
                s_MetaboliteStyle.setLabelOpacity(labelOpacity);
                s_ReactionStyle.setLabelOpacity(labelOpacity);
                d3.select("#viz").select("#D3viz").select("#graphComponent")
                    .selectAll("g.node")
                    .select("text")
                    .attr("opacity",s_MetaboliteStyle.getLabelOpacity());
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
                var labelOpacity = (view.lookupReference('checkHideSelectionLabel').getValue()) ? 0.0 : 1.0;
                metExploreD3.GraphStyleEdition.changeAllFontType(fontType, "selection");
                (!isNaN(fontSize) && fontSize>0 && fontSize<40) ? metExploreD3.GraphStyleEdition.changeAllFontSize(fontSize, "selection") : null;
                metExploreD3.GraphStyleEdition.changeAllFontBold(fontBold, "selection");
                metExploreD3.GraphStyleEdition.changeAllFontItalic(fontItalic, "selection");
                metExploreD3.GraphStyleEdition.changeAllFontUnderline(fontUnderline, "selection");
                d3.select("#viz").select("#D3viz").select("#graphComponent")
                    .selectAll("g.node")
                    .filter(function(node){
                        return node.isSelected();
                    })
                    .select("text")
                    .attr("opacity",labelOpacity);

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
                var labelOpacity = (view.lookupReference('checkHideMetaboliteLabel').getValue()) ? 0.0 : 1.0;
                metExploreD3.GraphStyleEdition.changeAllFontType(fontType, "metabolite");
                (!isNaN(fontSize) && fontSize>0 && fontSize<40) ? metExploreD3.GraphStyleEdition.changeAllFontSize(fontSize, "metabolite") : null;
                metExploreD3.GraphStyleEdition.changeAllFontBold(fontBold, "metabolite");
                metExploreD3.GraphStyleEdition.changeAllFontItalic(fontItalic, "metabolite");
                metExploreD3.GraphStyleEdition.changeAllFontUnderline(fontUnderline, "metabolite");
                var s_MetaboliteStyle = metExploreD3.getMetaboliteStyle();
                s_MetaboliteStyle.setLabelOpacity(labelOpacity);
                d3.select("#viz").select("#D3viz").select("#graphComponent")
                    .selectAll("g.node")
                    .filter(function(node){
                        return node.getBiologicalType()=="metabolite";
                    })
                    .select("text")
                    .attr("opacity",s_MetaboliteStyle.getLabelOpacity());

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
                var labelOpacity = (view.lookupReference('checkHideReactionLabel').getValue()) ? 0.0 : 1.0;
                metExploreD3.GraphStyleEdition.changeAllFontType(fontType, "reaction");
                (!isNaN(fontSize) && fontSize>0 && fontSize<40) ? metExploreD3.GraphStyleEdition.changeAllFontSize(fontSize, "reaction") : null;
                metExploreD3.GraphStyleEdition.changeAllFontBold(fontBold, "reaction");
                metExploreD3.GraphStyleEdition.changeAllFontItalic(fontItalic, "reaction");
                metExploreD3.GraphStyleEdition.changeAllFontUnderline(fontUnderline, "reaction");
                var s_ReactionStyle = metExploreD3.getReactionStyle();
                s_ReactionStyle.setLabelOpacity(labelOpacity);
                d3.select("#viz").select("#D3viz").select("#graphComponent")
                    .selectAll("g.node")
                    .filter(function(node){
                        return node.getBiologicalType()=="reaction";
                    })
                    .select("text")
                    .attr("opacity",s_ReactionStyle.getLabelOpacity());

            },
            scope : me
        });

        view.lookupReference('refreshCurve').on({
            click : function()
            {
                var curveBundling = view.lookupReference('EdgeBundling').getValue();
                if (curveBundling == true) {
                    metExploreD3.GraphStyleEdition.curvedPath = true;
                    metExploreD3.GraphStyleEdition.bundleLinks();
                }
                else {
                    metExploreD3.GraphStyleEdition.curvedPath = false;
                    d3.select("#viz").select("#D3viz").select("#graphComponent").selectAll("path.link").attr("marker-end", "none")
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