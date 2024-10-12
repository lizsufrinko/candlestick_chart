import { Visual } from "../../src/visual";
import powerbiVisualsApi from "powerbi-visuals-api";
import IVisualPlugin = powerbiVisualsApi.visuals.plugins.IVisualPlugin;
import VisualConstructorOptions = powerbiVisualsApi.extensibility.visual.VisualConstructorOptions;
import DialogConstructorOptions = powerbiVisualsApi.extensibility.visual.DialogConstructorOptions;
var powerbiKey: any = "powerbi";
var powerbi: any = window[powerbiKey];
var candlestickchartCBC86C3F2C914CD3BDF86EFE7F985E9A_DEBUG: IVisualPlugin = {
    name: 'candlestickchartCBC86C3F2C914CD3BDF86EFE7F985E9A_DEBUG',
    displayName: 'candlestick_chart',
    class: 'Visual',
    apiVersion: '5.3.0',
    create: (options?: VisualConstructorOptions) => {
        if (Visual) {
            return new Visual(options);
        }
        throw 'Visual instance not found';
    },
    createModalDialog: (dialogId: string, options: DialogConstructorOptions, initialState: object) => {
        const dialogRegistry = (<any>globalThis).dialogRegistry;
        if (dialogId in dialogRegistry) {
            new dialogRegistry[dialogId](options, initialState);
        }
    },
    custom: true
};
if (typeof powerbi !== "undefined") {
    powerbi.visuals = powerbi.visuals || {};
    powerbi.visuals.plugins = powerbi.visuals.plugins || {};
    powerbi.visuals.plugins["candlestickchartCBC86C3F2C914CD3BDF86EFE7F985E9A_DEBUG"] = candlestickchartCBC86C3F2C914CD3BDF86EFE7F985E9A_DEBUG;
}
export default candlestickchartCBC86C3F2C914CD3BDF86EFE7F985E9A_DEBUG;