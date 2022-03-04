import * as d3 from 'd3';
import { useEffect } from "react";

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
                        <svg id="purchases-map" width="1200" height="800"></svg>
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
        .style("visibility", "hidden");
    
    var svg_purchases = d3.select("#purchases-map");
    var width = +svg_purchases.attr("width");
    var height = +svg_purchases.attr("height");
    var projection = d3.geoMercator()
        .center([0,20])                // GPS of location to zoom on
        .scale(99)                       // This is like the zoom
        .translate([ width/2, height/2 ]);
    d3.queue()
        .defer(d3.json, "/data/countries-purchases-count.json")
        .await(ready);
    function ready(error, groups) {
        var worldMap = require("../assets/maps/world-map.json")
        // ****************MAP
        svg_purchases.append("g")
            .selectAll("path")
            .data(worldMap.features)
            .enter()
            .append("path")
            .attr("name", function(d) {if (groups["Country"][d.properties.ADMIN] !== undefined) return d.properties.ADMIN})
            .attr("d", d3.geoPath().projection(projection))
            .style("stroke", "white")
            .style("opacity", .6)
            .attr("fill", function(d) {if (groups["Country"][d.properties.ADMIN] !== undefined) {this.style.fill = "GREEN";}})
            .on("mouseover", function(d) {
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
            .on("mousemove", function(){return tooltip.style("top",
                (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");})
    }
}

export default Purchases;