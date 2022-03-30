/**
 * @author MC
 * (a)description CaptionFormController : Control displaying pathway and compartment caption
 */

Ext.define('metExploreViz.view.form.captionForm.CaptionFormController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.form-captionForm-captionForm',

    /**
     * Aplies event linsteners to the view
     */
    init:function(){
        var me 		= this,
            viewModel   = me.getViewModel(),
            view      	= me.getView();

        // Regex to remove bad chars in dom ids
        me.regexpPanel=/\.|>|<| |,|\/|=|\(|\)/g;

        view.on({
            afterColorCalculating : this.addComponentCaptionForm,
            scope:me
        });
    },
    /*******************************************
     * Add the panel caption corresponding to shown component
     * @param {} type : component type (Pathway, Compartment)
     */
    addComponentCaptionForm : function() {
        var me 		= this,
            viewModel   = me.getViewModel(),
            view      	= me.getView();

            // We add form corresponding to the component data type
        var captionForm = view;
        if(view.getTitle()=="Pathways")
            var components = metExploreD3.getPathwaysSet('viz');
        else
            var components = metExploreD3.getCompartmentInBiosourceSet();

        if(Ext.getCmp('panel' + view.getTitle().replace(me.regexpPanel, "")))
            view.removeAll();

        if(captionForm !=undefined) {

            var idColors = [];
            var listComponentCaptionForm = [];

            var that = this;

            components=components.sort(function (comp, comp2) {
                if (comp.getName()<comp2.getName())
                    return -1;
                if (comp.getName()>comp2.getName())
                    return 1;
                // a doit être égal à b
                return 0;
            });

            // For each value we add corresponding color caption
            components.forEach(function (component, i) {
                    var colorName = component.getName();

                    var parser = new DOMParser;
                    var dom = parser.parseFromString(colorName, 'text/html');
                    var value = dom.body.textContent;
                    var newId = i;
                    var that=me;
                    var newComponentCaptionForm = Ext.create('metExploreViz.view.form.ComponentCaptionForm', {

                        itemId: 'componentCaptionForm' + newId,

                        margin: '0 0 10 0',
                        padding: '0 0 0 0',
                        border: false,
                        items:
                            [
                                {
                                    itemId: 'chooseColorReaction' + newId,
                                    xtype: 'panel',
                                    border: false,
                                    layout: {
                                        type: 'hbox',
                                        align: 'stretch'
                                    },
                                    items: [
                                        {
                                            xtype: 'checkbox',
                                            forId: 'componentCheckbox',
                                            margin: '0 0 0 10',
                                            checked: !component.hidden(),
                                            listeners: {
                                                change: function (that, newValue, oldValue) {

                                                    var activePanel = _MyThisGraphNode.activePanel;
                                                    if(!activePanel) activePanel='viz';

                                                    metExploreD3.applyTolinkedNetwork(
                                                        activePanel,
                                                        function(panelLinked, sessionLinked) {
                                                            if (view.getTitle() == "Pathways")
                                                                var comp = metExploreD3.getPathwayByName(component.getName(), panelLinked);
                                                            else
                                                                var comp = metExploreD3.getCompartmentByName(component.getName());

                                                            comp.setHidden(!newValue);
                                                            metExploreD3.GraphLink.majConvexhullsVisibility(panelLinked, view.getTitle());
                                                            if(metExploreD3.getGeneralStyle().isDisplayedPathwaysOnLinks())
                                                                metExploreD3.GraphCaption.majCaptionComponentOnLink("PathwaysLink");

                                                            if(metExploreD3.getGeneralStyle().isDisplayedCompartmentsOnLinks())
                                                                metExploreD3.GraphCaption.majCaptionComponentOnLink("CompartmentsLink");
                                                        });
                                                }
                                            }
                                        },
                                        {
                                            xtype: 'label',
                                            forId: 'color',
                                            text: value + ' :',
                                            margin: '0 0 0 10',
                                            flex: 1,
                                            border: false
                                        }, {
                                            border: false,
                                            xtype: 'hiddenfield',
                                            itemId: 'hidden' + newId,
                                            value: component.getColor(),
                                            listeners: {
                                                change: function (that) {

                                                    var activePanel = _MyThisGraphNode.activePanel;
                                                    if(!activePanel) activePanel='viz';

                                                    this.lastValue = that.value;
                                                    metExploreD3.applyTolinkedNetwork(
                                                        activePanel,
                                                        function(panelLinked, sessionLinked) {
                                                            if (view.getTitle() === "Pathways"){
                                                                var componentsLinked = metExploreD3.getPathwaysSet(panelLinked);
                                                            }
                                                            else
                                                            {
                                                                var componentsLinked = metExploreD3.getCompartmentInBiosourceSet();
                                                            }

                                                            component.setColor(that.value);
                                                            metExploreD3.GraphCaption.majCaptionColor(componentsLinked, view.getTitle(), panelLinked);
                                                        });
                                                }
                                            }
                                        },
                                        {
                                            border: false,
                                            margin: '0 10 0 0',
                                            width: "40%",
                                            html: '<input ' +
                                            'type="color" ' +
                                            'id="html5colorpicker" ' +
                                            'onchange="Ext.getCmp(\'captionForm'+view.getTitle()+'\').down(\'#hidden'+newId+'\').fireEvent(\'change\',this, \''+component.getColor()+'\')" ' +
                                            'value="'+component.getColor()+'" ' +
                                            'style="width:85%;">'
                                        }
                                    ]
                                }
                            ]
                    });

                    listComponentCaptionForm.push(newComponentCaptionForm);
                    idColors.push(newId);
                }
            );

            var newConditionPanel = Ext.create('Ext.panel.Panel', {
                id: 'panel' + view.getTitle().replace(me.regexpPanel, ""),
                border: false,
                width: '100%',
                bodyBorder: false,
                xtype: 'panel',
                layout: {
                    type: 'vbox',
                    align: 'stretch'
                }
            });

            var s_GeneralStyle = _metExploreViz.getGeneralStyle();
            var checkComponent = false;
            if(s_GeneralStyle.isDisplayedConvexhulls()===view.getTitle())
                checkComponent=true;

            // Create checkbox to display convex hull around each components
            var highlightCheckbox = Ext.create('Ext.form.field.Checkbox', {
                tooltip: 'Display convex hull around each ' + view.getTitle(),
                boxLabel: 'Highlight '+view.getTitle().toLowerCase(),
                margin: '0 0 0 10',
                id: 'highlightCheckbox' + view.getTitle(),
                checked: checkComponent
            });

            highlightCheckbox.on({
                change : function (that, newV, oldVV, e) {

                    switch (view.getTitle()) {
                        case "Pathways":
                            Ext.getCmp("vizIdConvexHullMenu").lookupReference('highlightPathways').setChecked(newV);
                            Ext.getCmp("vizIdConvexHullMenu").lookupReference('highlightPathways')
                                .fireEvent("click", Ext.getCmp("vizIdConvexHullMenu").lookupReference('highlightPathways'));
                            break;
                        case "Compartments":
                            Ext.getCmp("vizIdConvexHullMenu").lookupReference('highlightCompartments').setChecked(newV);
                            Ext.getCmp("vizIdConvexHullMenu").lookupReference('highlightCompartments')
                                .fireEvent("click", Ext.getCmp("vizIdConvexHullMenu").lookupReference('highlightCompartments'));

                            break;
                        default:
                    }
                },
                scope:highlightCheckbox
            });
            newConditionPanel.add(highlightCheckbox);

            if(view.getTitle()=="Pathways"){


                var mappingPanel = Ext.create('Ext.panel.Panel', {
                    border: false,
                    width: '100%',
                    bodyBorder: false,
                    xtype: 'panel',
                    layout: {
                        type: 'vbox',
                        align: 'stretch'
                    },
                    items: [
                        {
                            margin: "15 15 5 15",
                            xtype: 'label',
                            html: 'Select mapping to map pathway enrichment on pathway nodes :'
                        }
                        ,
                        {
                            margin: '5 10 10 10',
                            xtype: "selectMapping",
                            id: 'selectMapping',
                            reference: 'panelMappingPathways',
                            listeners:{
                                change : function(that, newMapping, old){
                                    var session = _metExploreViz.getSessionById('viz');
                                    d3.select("#viz").select("#D3viz").select("#graphComponent").selectAll("g.node")
                                        .filter(function (n) { return n.getBiologicalType()==="pathway";})
                                        .each(function (d) {
                                            var thePathwayElement = d3.select(this);

                                            thePathwayElement.select(".mapped-segment").classed("hide", true);
                                            thePathwayElement.select(".notmapped-segment").classed("hide", true);

                                            var pathwayModel = session.getD3Data().getPathwayByName(d.getName());
                                            var pathwaySize = 20;

                                            thePathwayElement.setNodeForm(
                                                pathwaySize*3,
                                                pathwaySize*3,
                                                pathwaySize*3,
                                                pathwaySize*3,
                                                pathwayModel.getColor(),
                                                pathwaySize*3/5
                                            );

                                            // Lock Image definition
                                            var box = thePathwayElement.select("locker")
                                                .attr("width", pathwaySize * 3)
                                                .attr("height", pathwaySize * 3)
                                                .attr("preserveAspectRatio", "xMinYMin")
                                                .attr("y", -pathwaySize * 3)
                                                .attr("x", -pathwaySize * 3);

                                            box
                                                .select("backgroundlocker")
                                                .attr("d", function (node) {
                                                    var pathBack = "M" + pathwaySize * 3 + "," + pathwaySize * 3 +
                                                        " L0," + pathwaySize * 3 +
                                                        " L0," + pathwaySize * 3 / 2 * 2 +
                                                        " A" + pathwaySize * 3 / 2 * 2 + "," + pathwaySize * 3 / 2 * 2 + ",0 0 1 " + pathwaySize * 3 / 2 * 2 + ",0" +
                                                        " L" + pathwaySize * 3 + ",0";
                                                    return pathBack;
                                                })
                                                .attr("opacity", "0.20")
                                                .attr("fill", "#000000");

                                            box
                                                .select("iconlocker")
                                                .attr("y", pathwaySize * 3 / 2 / 4 - (pathwaySize * 3 - pathwaySize * 3 * 2) / 8)
                                                .attr("x", pathwaySize * 3 / 2 / 4 - (pathwaySize * 3 - pathwaySize * 3 * 2) / 8)
                                                .attr("width", "40%")
                                                .attr("height", "40%");
                                        });

                                    if(newMapping!=="None"){

                                        var myMask = metExploreD3.createLoadMask("Mapping in progress...", 'graphPanel');

                                        if(myMask!= undefined){

                                            metExploreD3.showMask(myMask);
                                            setTimeout(
                                                function() {
                                                    try {
                                                        var nbMapped=0;
                                                        var session = _metExploreViz.getSessionById('viz');
                                                        var force = session.getForce();
                                                        force.stop();

                                                        d3.select("#viz").select("#D3viz").select("#graphComponent").selectAll("g.node")
                                                            .filter(function (n) { return n.getBiologicalType()==="pathway";})
                                                            // .filter(function (d) {
                                                            // 	if (this.getAttribute("mapped") == undefined || this.getAttribute("mapped") == false || this.getAttribute("mapped") == "false") return true;
                                                            // 	else return false;
                                                            // })
                                                            .each(function (d) {
                                                                var thePathwayElement = d3.select(this);

                                                                thePathwayElement
                                                                    .select("text")
                                                                    .remove();

                                                                metExploreD3.GraphNode.addText(d, "viz");

                                                                var exposant = 0;

                                                                if (d.getMappingDataByNameAndCond(newMapping, "PathwayEnrichment") != null) {

                                                                    nbMapped++;

                                                                    d3.select(this)
                                                                        .attr("mapped", "true");

                                                                    var mapData = d.getMappingDataByNameAndCond(newMapping, "PathwayEnrichment");

                                                                    if (mapData.getMapValue() < 0.001) {
                                                                        exposant = 1.2;
                                                                    } else {
                                                                        if (mapData.getMapValue() < 0.01) {
                                                                            exposant = 0.9;
                                                                        } else {
                                                                            if (mapData.getMapValue() < 0.05) {
                                                                                exposant = 0.6;
                                                                            }
                                                                        }
                                                                    }
                                                                    session.addMappedNode(d.getId());
                                                                }

                                                                var pathwaySize = 20 + 100 * exposant;

                                                                //interligne
                                                                d3.select(this)
                                                                    .select("text")
                                                                    .style("stroke-width", 10)
                                                                    .style("font-weight", 'bold')
                                                                    .style("font-size", pathwaySize - 40 + "px")
                                                                    .each(function (text) {
                                                                        d3.select(this).selectAll("tspan")
                                                                            .each(function (tspan, i) {
                                                                                if (i > 0)
                                                                                    d3.select(this).attr("dy", pathwaySize - 40);
                                                                            });
                                                                    });

                                                                var width = pathwaySize * 3;
                                                                var height = pathwaySize * 3;
                                                                var rx = pathwaySize * 3;
                                                                var ry = pathwaySize * 3;
                                                                var strokewidth = pathwaySize * 3 / 5;

                                                                thePathwayElement.select("rect.pathway")
                                                                    .attr("width", width)
                                                                    .attr("height", height)
                                                                    .attr("rx", rx)
                                                                    .attr("ry", ry)
                                                                    .attr("transform", "translate(-" + width / 2 + ",-"
                                                                        + height / 2
                                                                        + ")")
                                                                    .style("stroke-width", strokewidth);

                                                                thePathwayElement.select("rect.fontSelected")
                                                                    .attr("width", width)
                                                                    .attr("height", height)
                                                                    .attr("rx", rx)
                                                                    .attr("ry", ry)
                                                                    .attr("transform", "translate(-" + width / 2 + ",-" + height / 2 + ")");


                                                                // Lock Image definition
                                                                var box = thePathwayElement.select(".locker").attr(
                                                                    "viewBox",
                                                                    function (d) {
                                                                        +" " + pathwaySize * 3;
                                                                    }
                                                                )
                                                                    .attr("width", pathwaySize * 3)
                                                                    .attr("height", pathwaySize * 3)
                                                                    .attr("preserveAspectRatio", "xMinYMin")
                                                                    .attr("y", -pathwaySize * 3)
                                                                    .attr("x", -pathwaySize * 3);

                                                                box
                                                                    .select(".backgroundlocker")
                                                                    .attr("d", function (node) {
                                                                        var pathBack = "M" + pathwaySize * 3 + "," + pathwaySize * 3 +
                                                                            " L0," + pathwaySize * 3 +
                                                                            " L0," + pathwaySize * 3 / 2 * 2 +
                                                                            " A" + pathwaySize * 3 / 2 * 2 + "," + pathwaySize * 3 / 2 * 2 + ",0 0 1 " + pathwaySize * 3 / 2 * 2 + ",0" +
                                                                            " L" + pathwaySize * 3 + ",0";
                                                                        return pathBack;
                                                                    })
                                                                    .attr("opacity", "0.20")
                                                                    .attr("fill", "#000000");

                                                                box
                                                                    .select(".iconlocker")
                                                                    .attr("y", pathwaySize * 3 / 2 / 4 - (pathwaySize * 3 - pathwaySize * 3 * 2) / 8)
                                                                    .attr("x", pathwaySize * 3 / 2 / 4 - (pathwaySize * 3 - pathwaySize * 3 * 2) / 8)
                                                                    .attr("width", "40%")
                                                                    .attr("height", "40%");



                                                                if (d.getMappingDataByNameAndCond(newMapping, "PathwayCoverage") !== null) {

                                                                    var thePathwayElement = d3.select(this);
                                                                    var mapped = thePathwayElement.select(".mapped-segment");
                                                                    var notmapped = thePathwayElement.select(".notmapped-segment");

                                                                    thePathwayElement.select(".mapped-segment").classed("hide", false);
                                                                    thePathwayElement.select(".notmapped-segment").classed("hide", false);
                                                                    var mapData = d.getMappingDataByNameAndCond(newMapping, "PathwayCoverage");

                                                                    var coverage = mapData.getMapValue();
                                                                    var radius = (width - strokewidth) / 2;
                                                                    var halfRadius = radius / 2;
                                                                    var halfCircumference = 2 * Math.PI * halfRadius;

                                                                    // 0deg drawn up to this point
                                                                    var degreesDrawn = -90;

                                                                    mapped
                                                                        .attr('r', halfRadius)
                                                                        .attr('stroke-width', radius)
                                                                        .attr('stroke', "#FF7560")
                                                                        .attr('stroke-dasharray',
                                                                            halfCircumference * coverage
                                                                            + ' '
                                                                            + halfCircumference)
                                                                        .style('transform', 'rotate(' + degreesDrawn + 'deg)');

                                                                    // 119.988deg drawn up to this point
                                                                    degreesDrawn += 360 * coverage;

                                                                    notmapped
                                                                        .attr('fill', 'transparent')
                                                                        .attr('r', halfRadius)
                                                                        .attr('stroke-width', radius)
                                                                        .attr('stroke', '#144778')
                                                                        .attr('stroke-dasharray',
                                                                            halfCircumference * (1.0 - coverage)
                                                                            + ' '
                                                                            + halfCircumference)
                                                                        .style('transform', 'rotate(' + degreesDrawn + 'deg)');

                                                                }

                                                            });

                                                        metExploreD3.hideMask(myMask);
                                                        if(nbMapped===0){
                                                            metExploreD3.displayMessage("Warning", 'No mapped node on network.');

                                                            metExploreD3.fireEvent('selectMappingVisu', 'disableMapping');
                                                        }

                                                        var anim = session.isAnimated("viz");
                                                        if (anim) {
                                                            var session = _metExploreViz.getSessionById('viz');
                                                            var force = session.getForce();

                                                            force.alpha(force.alpha()).restart();
                                                        }
                                                    }
                                                    catch (e) {

                                                        e.functionUsed="mapNodes";
                                                        metExploreD3.hideMask(myMask);

                                                        var anim=session.isAnimated("viz");
                                                        if (anim=== true) {
                                                            var session = _metExploreViz.getSessionById('viz');
                                                            var force = session.getForce();

                                                            force.alpha(force.alpha()).restart();
                                                        }
                                                        throw e;
                                                    }
                                                }, 1
                                            );
                                        }
                                    }
                                }
                            }
                        }
                    ]
                });
                captionForm.add(mappingPanel);

                var line = Ext.create('Ext.Component', {
                    hidden: false,
                    autoEl: {
                        tag: 'hr'
                    }
                });

                captionForm.add(line);

            }

            // Create checkbox to display convex hull around each components
            var highlightLinkCheckbox = Ext.create('Ext.form.field.Checkbox', {
                tooltip: 'Display convex hull around each ' + view.getTitle(),
                boxLabel: 'Highlight '+view.getTitle().toLowerCase() +' on links' ,
                margin: '0 0 20 10',
                id: 'highlightCheckbox' + view.getTitle() + "Link",
                checked: s_GeneralStyle.isDisplayedPathwaysOnLinks()
            });

            highlightLinkCheckbox.on({
                change : function (that, newV, oldVV, e) {

                    switch (view.getTitle()) {
                        case "Pathways":
                            Ext.getCmp("vizIdConvexHullMenu").lookupReference('highlightPathwaysLink').setChecked(newV);
                            Ext.getCmp("vizIdConvexHullMenu").lookupReference('highlightPathwaysLink')
                                .fireEvent("click", Ext.getCmp("vizIdConvexHullMenu").lookupReference('highlightPathwaysLink'));
                            break;

                        case "Compartments":
                            Ext.getCmp("vizIdConvexHullMenu").lookupReference('highlightCompartmentsLink').setChecked(newV);
                            Ext.getCmp("vizIdConvexHullMenu").lookupReference('highlightCompartmentsLink')
                                .fireEvent("click", Ext.getCmp("vizIdConvexHullMenu").lookupReference('highlightCompartmentsLink'));

                            break;

                        default:
                    }
                },
                scope:highlightLinkCheckbox
            });
            newConditionPanel.add(highlightLinkCheckbox);


            // Add component caption to captionForm panel
            if (captionForm != undefined) {
                captionForm.add(newConditionPanel);
                // Create checkbox to display convex hull around each components
                var selectAllButton = Ext.create('Ext.button.Button', {
                    tooltip: 'Select or unselect all fields',
                    text: 'Select/Unselect all',
                    margin: '10 10 10 10',
                    id: 'selectAllButton' + view.getTitle()
                });

                selectAllButton.on({
                    click : function (that, newV, oldVV, e) {
                        if(view.id==="captionFormCompartments"){
                        var arrayCheckBox = Ext.getCmp("captionFormCompartments").query('checkbox[forId=componentCheckbox]');
                    }else if(view.id==="captionFormPathways"){
                        var arrayCheckBox = Ext.getCmp("captionFormPathways").query('checkbox[forId=componentCheckbox]');
                    }

                        var allIsSelected = arrayCheckBox.every(function(checkbox){return checkbox.checked});
                        if(allIsSelected){
                            arrayCheckBox.forEach(function (checkBox) {
                                checkBox.setValue(false);
                            })
                        }
                        else {
                            arrayCheckBox.forEach(function (checkBox) {
                                checkBox.setValue(true);
                            })
                        }

                    },
                    scope:selectAllButton
                });

                captionForm.add(selectAllButton);
                listComponentCaptionForm.forEach(function (aComponentCaptionForm) {
                    captionForm.add(aComponentCaptionForm);
                });
            }
        }
    }
});
