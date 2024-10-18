// Import necessary modules
import * as d3 from "d3";
import "./../style/visual.less";

import powerbi from "powerbi-visuals-api";
import IVisual = powerbi.extensibility.IVisual;
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import VisualObjectInstance = powerbi.VisualObjectInstance;

export class Visual implements IVisual {
    private target: HTMLElement;
    private settings: any;

    constructor(options: VisualConstructorOptions) {
        this.target = options.element;
        this.settings = {
            fontSize: 12
        };
    }

    public update(options: VisualUpdateOptions) {
        this.target.innerHTML = "";
        
        // Optional chaining (checking if dataViews exists by using ?)
        const dataView = options.dataViews?.[0];
    
        // getting dates value into a dates format
        const categorical = dataView.categorical;
        const category = categorical.categories[0];

        const dateValues = category.values.map(value => new Date(value as string));

        // define the viewport
        const width = options.viewport.width;
        const height = options.viewport.height;
        const margin = { top: 20, right: 20, bottom: 30, left: 50};

        //create SVG canvas
        const svg = d3.select(this.target)
            .append("svg")
            .attr("width", width)
            .attr("heigh", height);
        
        //draw axis on the SVG
        const xScale = d3.scaleTime()
            .domain(d3.extent(dateValues) as [Date, Date])
            .range([margin.left, width - margin.left]);
        
        const xAxis = d3.axisBottom(xScale)
            .ticks(5)
            .tickSize(-height + margin.top + margin.bottom);

        svg.append("g")
            .attr("class", "x-axis")
            .attr("transform", `translate(0, ${height - margin.bottom})`)
            .call(xAxis)
            .selectAll(".tick line")
            .attr("stroke")
    }

    // Define the formatting options that will be available to the user in the formatting pane
    public enumerateObjectInstances(options: any): VisualObjectInstance[] {
        const instances: VisualObjectInstance[] = [];

        if (options.objectName === 'visualSettings') {
            instances.push({
                objectName: 'visualSettings',
                properties: {
                    fontSize: this.settings.fontSize
                },
                selector: null
            });
        }

        return instances;
    }
}
