/**
 * @author Adrien Rohan
 * Class to control label style edition option
 */

Ext.define('metExploreViz.view.form.allLabelStyleForm.AllLabelStyleFormController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.form-allLabelStyleForm-allLabelStyleForm',

    /**
     * Init function Checks the changes on label style
     */
    init : function() {
        var me = this,
            view = me.getView();

        var targetObjects = Ext.getCmp("selectLabelObject");

        view.lookupReference('refreshLabelStyle').on({
            click: function () {
                console.log(targetObjects.rawValue);
                var flag = targetObjects.rawValue.toLowerCase();
                var fontType = view.lookupReference('chooseFontType').getValue();
                var fontSize = view.lookupReference('chooseFontSize').getValue();
                var fontBold = view.lookupReference('checkBoldFont').getValue();
                var fontItalic = view.lookupReference('checkItalicFont').getValue();
                var fontUnderline = view.lookupReference('checkUnderlineFont').getValue();
                var labelOpacity = (view.lookupReference('checkHideLabel').getValue()) ? 0.0 : 1.0;
                metExploreD3.GraphStyleEdition.changeAllFontType(fontType, flag);
                (!isNaN(fontSize) && fontSize > 0 && fontSize < 40) ? metExploreD3.GraphStyleEdition.changeAllFontSize(fontSize, flag) : null;
                metExploreD3.GraphStyleEdition.changeAllFontBold(fontBold, flag);
                metExploreD3.GraphStyleEdition.changeAllFontItalic(fontItalic, flag);
                metExploreD3.GraphStyleEdition.changeAllFontUnderline(fontUnderline, flag);
                var s_MetaboliteStyle = metExploreD3.getMetaboliteStyle();
                var s_ReactionStyle = metExploreD3.getReactionStyle();
                d3.select("#viz").select("#D3viz").select("#graphComponent")
                    .selectAll("g.node")
                    .filter(function (node) {
                        if (flag === "all"){
                            s_MetaboliteStyle.setLabelOpacity(labelOpacity);
                            s_ReactionStyle.setLabelOpacity(labelOpacity);
                            return true;
                        }
                        else if (flag === "selection"){
                            return node.isSelected();
                        }
                        else if (flag === "reaction") {
                            s_ReactionStyle.setLabelOpacity(labelOpacity);
                            return node.getBiologicalType() == "reaction";
                        }

                        else if (flag === "metabolite") {
                            s_MetaboliteStyle.setLabelOpacity(labelOpacity);
                            return node.getBiologicalType() == "metabolite";
                        }
                    })
                    .select("text")
                    .attr("opacity", labelOpacity);
            },
            scope: me
        });
    }

});

