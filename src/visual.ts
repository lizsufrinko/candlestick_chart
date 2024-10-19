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

        //getting close, open, high, low and Volume numbers
        const openValues = categorical.values[0].values as number[];
        const closeValues = categorical.values[1].values as number[];
        const highValues = categorical.values[2].values as number[];
        const lowValues = categorical.values[3].values as number[];
        const volumeValues = categorical.values[4].values as number[];
        
        // define the viewport
        const width = options.viewport.width;
        const height = options.viewport.height;

        const margin = { top: 20, right: 100, bottom: 30, left: 40};
        const chartHeightRatio = 0.80;

        const candlestickHeight = (height - margin.top - margin.bottom) * chartHeightRatio;
        const volumeChartHeight = (height - margin.top - margin.bottom) * (1 - chartHeightRatio);

        //create SVG canvas
        const svg = d3.select(this.target)
            .append("svg")
            .attr("width", width)
            .attr("height", height);
        
        //draw X axis on the SVG
        const xScale = d3.scaleTime()
            .domain(d3.extent(dateValues) as [Date, Date])
            .range([margin.left, width - margin.right]);

        const xAxis = d3.axisBottom(xScale)
            .ticks(d3.timeDay.every(1))
            .tickFormat(d3.timeFormat("%Y-%m-%d"))
            .tickSize(-height + margin.top + margin.bottom);

        svg.append("g")
            .attr("class", "x-axis")
            .attr("transform", `translate(0, ${height - margin.bottom})`)
            .call(xAxis);

        //Define and Draw Y scale for prices
        const allPriceValues = openValues.concat(closeValues, highValues, lowValues);
        
        const minPrice = d3.min(allPriceValues);
        const maxPrice = d3.max(allPriceValues);
        const pricePadding = (maxPrice - minPrice) * 0.01;

        const yScale = d3.scaleLinear()
            .domain([minPrice - pricePadding, maxPrice + pricePadding])
            .range([margin.top + candlestickHeight, margin.top]);
        
        const yAxis = d3.axisRight(yScale)
            .ticks(3)
            .tickSize(-width + margin.left + margin.right)
            .tickFormat(d3.format(".2f"));
    
        svg.append("g")
            .attr("class", "y-axis")
            .attr("transform", `translate(${width - margin.right}, 0)`)
            .call(yAxis);
        
        // Define and Draw Y scale for volumes
        const maxVolume = d3.max(volumeValues);
        const volumePadding = maxVolume * 0.05;

        const yScaleVolume = d3.scaleLinear()
            .domain([0, maxVolume + volumePadding])
            .range([height - margin.bottom, height - margin.bottom - volumeChartHeight]);
       
        const yAxisVolume = d3.axisRight(yScaleVolume)
            .ticks(3)
            .tickSize(-width + margin.left + margin.right)
            .tickFormat(d3.format(".2s")); 

        svg.append("g")
            .attr("class", "y-axis-volume")
            .attr("transform", `translate(${width - margin.right}, 0)`)
            .call(yAxisVolume)
            .selectAll(".tick line")
            .style("stroke", (d, i, nodes) => {
                return i === nodes.length - 1 ? "yellow" : "none"; //style yellow top line of volumes
            });

        // drawing bars for each day (open, close)
        const numberOfBars = dateValues.length;
        const stepSize = (width - margin.left - margin.right) / (numberOfBars - 1);
        const barWidth = stepSize * 0.25;

        dateValues.forEach((date, i) => {
            const openValue = openValues[i];
            const closeValue = closeValues[i];
            const highValue = highValues[i];
            const lowValue = lowValues[i];

            const yOpen = yScale(openValue);
            const yClose = yScale(closeValue);
            const yHigh = yScale(highValue);
            const yLow = yScale(lowValue);

            const fillColor = closeValue >= openValue ? "green" : "red";

            const xPos = 
                i === 0 ? xScale(date) // align first bar left
                : i === numberOfBars - 1 ? xScale(date) - barWidth // align last bar right
                : xScale(date) - barWidth / 2;  //others middle
    
            svg.append("rect")
                .attr("x", xPos)
                .attr("y", Math.min(yOpen, yClose))
                .attr("width", barWidth)
                .attr("height", Math.abs(yClose - yOpen))
                .attr("fill", fillColor);
            
            // drawing wick based on high and low numbers
            svg.append("line")
                .attr("x1", xPos + barWidth / 2)
                .attr("x2", xPos + barWidth / 2)
                .attr("y1", yHigh)
                .attr("y2", yLow)
                .attr("stroke", fillColor)
                .attr("stroke-width", 5);
            
            // drawing the percentage inside bar
            const percentageChange = ((closeValue - openValue) / openValue) * 100;

            svg.append("text")
                .attr("class", "percentage-text")
                .attr("x", xPos + barWidth / 2)
                .attr("y", (yOpen + yClose) / 2)
                .attr("dy", ".15em")
                .text(percentageChange.toFixed(2) + '%');
        });

        // drawing volume bars
        dateValues.forEach((date, i) => {
            const volumeValue = volumeValues[i];

            const xPos =
                i === 0 ? xScale(date) // align first bar left
                : i === numberOfBars - 1 ? xScale(date) - barWidth // align last bar right
                : xScale(date) - barWidth / 2; //others middle
            
            const yVolume = yScaleVolume(volumeValue);
            const volumeHeight = height - margin.bottom - yVolume;

            svg.append("rect")
                .attr("x", xPos)
                .attr("y", yVolume)
                .attr("width", barWidth)
                .attr("height", volumeHeight)
                .attr("fill", "#dddddd")
                .attr("opacity", 0.3);
        });
    }
}
