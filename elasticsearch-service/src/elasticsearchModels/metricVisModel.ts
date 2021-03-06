import { IESVisualization } from "./visualizationModel";

/**
 * Encapsulates the minimum metadata necessary to create a Metric visualization object.
 */
export interface IESMetricVis extends IESVisualization {
    explorerTitle: string;
    operationName: string;
    index: string;
}
