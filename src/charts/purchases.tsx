import * as d3 from 'd3';
import React, { useEffect } from "react";

function Purchases() {

    useEffect(() => {
        purchases();
    })

    return(
        <div className="col-lg-12 col-12 mb-3">
            <div className="card">
                <div className="card-header">Purchases Map</div>
                <div className="card-body">
                    <div>
                        <svg id="purchases-map" width="1200" height="500"></svg>
                    </div>
                </div>
            </div>
        </div>
    )
}

const purchases = () => {
    var tooltip = d3.select("#root")
        .append("div")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden")
        .style("background", "white")
        .style("background-color", "rgba(255, 255, 255, 0.5)");

    var svg_purchases = d3.select("#purchases-map");
    var width = +svg_purchases.attr("width");
    var height = +svg_purchases.attr("height");
    var projection = d3
                    .geoMercator()
                    .center([0.0, 30.0])
                    .scale(100.0)
                    .translate([ width/2.0, height/2.0 ]);

    var pathGenerator = d3.geoPath().projection(projection);
    d3.queue()
        .defer(d3.json, "/data/countries-purchases-count.json")
        .await(ready);
    function ready(error: any, groups: any) {
        var worldMap:  any = require("../assets/maps/world-map-min.json")
        // ****************MAP
        svg_purchases
            .selectAll("path")
            .data(worldMap.features)
            .enter()
            .append("path")
            .attr("name", function(d: any) {if (groups["Country"][d.properties.ADMIN] !== undefined) return d.properties.ADMIN})
            .attr("d", (d: any) => pathGenerator(d))
            .style("stroke", "white")
            .style("opacity", .6)
            .attr("fill", (d: any) => {if (groups["Country"][d.properties.ADMIN] !== undefined) {return "GREEN";} else return "Black"})
            .on("mouseover", function(d: any) {
                this.style.opacity = "0.9"
                if (groups["Country"][d.properties.ADMIN] !== undefined) {
                    tooltip.html(d.properties.ADMIN + ": " + groups["Country"][d.properties.ADMIN] + " purchases").style("visibility", "visible")
                } else {
                    tooltip.html(d.properties.ADMIN + ": "  + "No purchases").style("visibility", "visible")
                }
            })
            .on("mouseout", function(d) {
                this.style.opacity = "0.6";
                tooltip.style("visibility", "hidden")
                })
            .on("mousemove", function(){
                return tooltip
                            .style("top", `${d3.event.pageY-10}px`)
                            .style("left",`${d3.event.pageX+10}px`);
            })
    }
}

export default Purchases;