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
    
        // getting first value from the array
        const firstValue = dataView.categorical.categories[0].values[0];

        // Get the font size setting from Power BI, or use the default if none is set
        const objects = dataView.metadata.objects;
        if (objects && objects.visualSettings) {
            this.settings.fontSize = objects.visualSettings.fontSize || 12;
          }

        const svg = d3.select(this.target)
            .append("svg")
            .attr("width", options.viewport.width)
            .attr("height", options.viewport.height);

        svg.append("text")
            .attr("x", options.viewport.width/2)
            .attr("y", options.viewport.height/2)
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "middle")
            .text(firstValue.toString())
            .style("font-size", `${this.settings.fontSize}px`)
            .style("fill", "black");
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
