import React, { useEffect, useState } from "react";
import * as d3 from 'd3';


var globalData: any;
var x: d3.ScaleTime<number, number>;
var y: d3.ScaleLinear<number, number>;
var margin = { top: 10, right: 0, bottom: 0, left: 60 },
    width = 700 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;
var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
    'Oct', 'Nov', 'Dec'];

function CoronaLine() {

    const [selection, setSelection]: [string, React.Dispatch<React.SetStateAction<string>>] = useState("Italy");



    useEffect(() => {
        chart();
    }, [])

    return (
        <div className="col-lg-12 col-12 mb-3">
            <div className="card">
                <div className="card-header">Corona Cases Line Chart</div>
                <div className="card-body">
                    <h4 id="title" style={{ textAlign: "center" }}>Italy: cases with respect to date (2020)</h4>
                    <div>
                        <svg id="my_dataviz" width="930" height="450"></svg>
                    </div>
                    <select value={selection} onChange={update} id="select">
                        <option value="Italy">Italy</option>
                        <option value="Spain">Spain</option>
                        <option value="France">France</option>
                        <option value="Germany">Germany</option>
                        <option value="United Kingdom">United Kingdom</option>
                    </select>
                </div>
            </div>
        </div>
    );

    function chart() {
        // set the dimensions and margins of the graph
        // append the svg object to the body of the page
        var svg = d3.select("#my_dataviz")
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");
        //Read the data
        d3.queue()
            .defer(d3.csv, "/data/time-series-19-covid-combined.csv")
            .await(ready);
        function ready(error: any, result: any) {
            globalData = result;
            const data = convertDataCumulative(selection);
            var extent: any = d3.extent(data, (d: any) => { return new Date(d.Date); })
            console.log(extent)
            x = d3.scaleTime()
                .domain(extent)
                .range([0, width]);
            y = d3.scaleLinear()
                .domain([0, 30000])
                .range([height, 0]);
            // Add X axis
            svg.append("g")
                .attr("transform", `translate(0, ${height})`)
                .attr("dx", "-.8em")
                .attr("dy", ".15em")
                .call(d3.axisBottom(x).tickFormat((d: any) => {
                    return `${d.getDate()}th of ${months[d.getMonth()]}`
                }))
                .selectAll("text")
                .style("text-anchor", "end")
                .attr("dx", "-.8em")
                .attr("dy", ".15em")
                .attr("transform", "rotate(-25)");
            // Add Y axis
            svg.append("g")
                .call(d3.axisLeft(y));
            // Add the line
            svg.append("path")
                .datum(data)
                .transition()
                .duration(1000)
                .attr("fill", "none")
                .attr("stroke", "#69B3A2")
                .attr("stroke-width", 1.5)
                .attr("d", d3.line()
                    .x(function (d: any) { return x(new Date(d.Date)) })
                    .y(function (d: any) { return y(+d.Confirmed) })
                )
                .attr("id", "confirmed");
            svg.append("path")
                .datum(data)
                .transition()
                .duration(1000)
                .attr("fill", "none")
                .attr("stroke", "#ff5b5b")
                .attr("stroke-width", 1.5)
                .attr("d", d3.line()
                    .x((d: any) => { return x(new Date(d.Date)) })
                    .y((d: any) => { return y(+d.Deaths) })
                )
                .attr("id", "deaths");
            svg.append("path")
                .datum(data)
                .transition()
                .duration(1000)
                .attr("fill", "none")
                .attr("stroke", "#9ACD34")
                .attr("stroke-width", 1.5)
                .attr("d", d3.line()
                    .x((d: any) => { return x(new Date(d.Date)) })
                    .y((d: any) => { return y(+d.Recovered) })
                )
                .attr("id", "recovered");

            // Legend
            var legendSymbol: string | null = d3.line()([[0, 0], [20, 4], [30, 10], [40, 0]])
            var g = svg.append("g")
                .attr("transform", "translate(740, 180)");
            g.append("path")
                .attr("fill", "none")
                .attr("stroke", "#69B3A2")
                .attr("stroke-width", 1.5)
                .attr("d", legendSymbol!);
            g.append("text")
                .text("New cases")
                .attr("transform", "translate(50, 10)");

            g = svg.append("g")
                .attr("transform", "translate(740, 220)");
            g.append("path")
                .attr("fill", "none")
                .attr("stroke", "#FF5B5B")
                .attr("stroke-width", 1.5)
                .attr("d", legendSymbol!);
            g.append("text")
                .text("Deaths")
                .attr("transform", "translate(50, 10)");


            g = svg.append("g")
                .attr("transform", "translate(740, 200)");
            g.append("path")
                .attr("fill", "none")
                .attr("stroke", "#9ACD34")
                .attr("stroke-width", 1.5)
                .attr("d", legendSymbol!);
            g.append("text")
                .text("Recoveries")
                .attr("transform", "translate(50, 10)");
        }

    }

    /**
     * Filters the data for the country of selection, creates cumulative results
     * and creates cumulutive ferquency data (discovered cases over time)
     * @returns 
     */
    function convertDataCumulative(country: string) {
        var data = globalData
            .filter((d: any, i: number) => {
                return d.Confirmed > 100 && d.Country.localeCompare(country) === 0;
            })
            .sort((a: any, b: any) => {
                //
                if (a.Date.localeCompare(b.Date) !== 0)
                    return a.Date.localeCompare(b.Date);
                else if (a.State.localeCompare(b.State) !== 0)
                    return a.State.localeCompare(b.State);
                else
                    return a.Confirmed - b.Confirmed;
            })
        // assuming that the data is sorted, combine frequency for cases of a country in a certain date
        data = data.filter((d: any, i: number) => {
            if (i !== data.length - 1)
                if (data[i].Country.localeCompare(data[i + 1].Country) === 0 && data[i].Date.localeCompare(data[i + 1].Date) === 0) {
                    // var a = parseInt(data[i].Confirmed);
                    // var b = parseInt(data[i + 1].Confirmed);
                    data[i + 1].Confirmed = +data[i + 1].Confirmed + +d.Confirmed;
                    data[i + 1].Recovered = +data[i + 1].Recovered + +d.Recovered;
                    data[i + 1].Deaths = +data[i + 1].Deaths + +d.Deaths;
                    return false;
                }
            return true;
        })
        return data;
    }
    /**
     * On the event of changing the country selection
     */
    async function update(event: React.ChangeEvent<HTMLSelectElement>) {
        var data = convertDataCumulative(event.target.value);
        var confirmedLine = d3.select("#confirmed");
        var deathsLine = d3.select("#deaths");
        var recoveredLine = d3.select("#recovered");

        confirmedLine
            .datum(data)
            .transition()
            .duration(1000)
            .attr("d", d3.line()
                .x((d: any) => { return x(new Date(d.Date)) })
                .y((d: any) => { return y(+d.Confirmed) })
            );

        deathsLine
            .datum(data)
            .transition()
            .duration(1000)
            .attr("d", d3.line()
                .x((d: any) => { return x(new Date(d.Date)) })
                .y((d: any) => { return y(+d.Deaths) })
            );

        recoveredLine
            .datum(data)
            .transition()
            .duration(1000)
            .attr("d", d3.line()
                .x((d: any) => { return x(new Date(d.Date)) })
                .y((d: any) => { return y(+d.Recovered) })
            );
        d3.select('#title')
            .text(`${selection}: cases with respect to date (2020)`)
    }
}

export default CoronaLine; 