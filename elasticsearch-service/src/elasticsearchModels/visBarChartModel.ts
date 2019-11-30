import { IVisualization } from "./visualizationModel";

export interface IVisBarCHart extends IVisualization {
    explorerTitle: string;
    featureColumn: string;
    aggregationName: string;
    metricColumn: string;
    index: string;
}
