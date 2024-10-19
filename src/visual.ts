// Import necessary modules
import * as d3 from "d3";
import "./../style/visual.less";

import powerbi from "powerbi-visuals-api";
import IVisual = powerbi.extensibility.IVisual;
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;

export class Visual implements IVisual {
    private target: HTMLElement;
    private settings: any;

    constructor(options: VisualConstructorOptions) {
        this.target = options.element;
    }

    public update(options: VisualUpdateOptions) {
        this.target.innerHTML = "";
        
        // Optional chaining (checking if dataViews exists by using ?)
        const dataView = options.dataViews?.[0];
    
        // getting dates value into a dates format
        const categorical = dataView.categorical;
        const category = categorical.categories[0];

        const dateValues = category.values.map(value => new Date(value as string));

        //getting close and open numbers
        const openValues = categorical.values[0].values as number[];
        const closeValues = categorical.values[1].values as number[];
        
        // define the viewport
        const width = options.viewport.width;
        const height = options.viewport.height;
        const margin = { top: 20, right: 40, bottom: 30, left: 40};

        //create SVG canvas
        const svg = d3.select(this.target)
            .append("svg")
            .attr("width", width)
            .attr("heigh", height);
        
        //draw X axis on the SVG
        const xScale = d3.scaleTime()
            .domain(d3.extent(dateValues) as [Date, Date])
            .range([margin.left, width - margin.left]);

        const xAxis = d3.axisBottom(xScale)
            .ticks(d3.timeDay.every(1))
            .tickFormat(d3.timeFormat("%Y-%m-%d"))
            .tickSize(-height + margin.top + margin.bottom);

        svg.append("g")
            .attr("class", "x-axis")
            .attr("transform", `translate(0, ${height - margin.bottom})`)
            .call(xAxis);
        
        // draw, define Y axis on the SVG
        const yScale = d3.scaleLinear()
            .domain([d3.min(openValues.concat(closeValues)), d3.max(openValues.concat(closeValues))])
            .range([height - margin.bottom, margin.top]);

        // drawing bars for each day (open, close)
        const barWidth = 50;

        dateValues.forEach((date, i) => {
            const openValue = openValues[i];
            const closeValue = closeValues[i];

            const yOpen = yScale(openValue);
            const yClose = yScale(closeValue);

            const fillColor = closeValue >= openValue ? "green" : "red";

            svg.append("rect")
                .attr("x", xScale(date) - barWidth / 2)
                .attr("y", Math.min(yOpen, yClose))
                .attr("width", barWidth)
                .attr("height", Math.abs(yClose - yOpen))
                .attr("fill", fillColor);
            
        });
    }
}
