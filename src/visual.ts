// Import necessary modules
import * as d3 from "d3";
import "./../style/visual.less";

import powerbi from "powerbi-visuals-api";
import IVisual = powerbi.extensibility.IVisual;
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;

export class Visual implements IVisual {
    private target: HTMLElement;

    constructor(options: VisualConstructorOptions) {
        this.target = options.element;
    }

    public update(options: VisualUpdateOptions) {
        // Clear any existing content
        this.target.innerHTML = "";

        // Get the first dataView
        const dataView = options.dataViews[0];
        if (!dataView || !dataView.categorical) return;

        const categories = dataView.categorical.categories;
        if (!categories || categories.length === 0) return;

        const dates = categories[0].values.map(value => new Date(value.toString()));

        // Set SVG dimensions
        const width = options.viewport.width;
        const height = options.viewport.height;

        // Create SVG
        const svg = d3.select(this.target)
            .append("svg")
            .attr("width", width)
            .attr("height", height);

        // Define margins
        const margin = { top: 20, right: 20, bottom: 30, left: 40 };
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;

        // Create a group element for margins
        const g = svg.append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // Define xScale as band scale
        const xScale = d3.scaleBand()
            .domain(dates.map(d => d.toISOString().split('T')[0])) // Format dates as YYYY-MM-DD
            .range([0, innerWidth])
            .padding(0.1);

        // Define yScale as linear scale (dummy for now)
        const yScale = d3.scaleLinear()
            .domain([0, 1]) // Dummy y-scale
            .range([innerHeight, 0]);

        // Create x-axis
        const xAxis = d3.axisBottom(xScale)
            .tickFormat(d => d as string) // Display date strings
            .tickValues(xScale.domain().filter((d, i) => !(i % Math.ceil(dates.length / 10)))); // Show up to 10 ticks

        // Append x-axis to the group
        g.append("g")
            .attr("transform", `translate(0,${innerHeight})`)
            .call(xAxis)
            .selectAll("text")	
                .style("text-anchor", "center")
                .attr("dx", "-0.8em")
                .attr("dy", "0.15em")
                .attr("transform", "rotate(0)");
    }
}
