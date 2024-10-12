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
        this.target.innerHTML = "";
        
        // Optional chaining (checking if dataViews exists by using ?)
        const dataView = options.dataViews?.[0];
        console.log(dataView);
    }
}
