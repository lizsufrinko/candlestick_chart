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
        this.target.innerHTML = "";

        const svg = d3.select(this.target)
            .append("svg")
            .attr("width", options.viewport.width)
            .attr("height", options.viewport.height);
        
        svg.append("text")
            .attr("x", options.viewport.width/2)
            .attr("y", options.viewport.height/2)
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "middle")
            .text("Hello World")
            .style("font-size", "24px")
            .style("fill", "black");
    }
}