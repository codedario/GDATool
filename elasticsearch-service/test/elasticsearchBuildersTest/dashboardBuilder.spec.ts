import * as chai from "chai";
import { before, describe, it } from "mocha";
import { DashboardBuilder } from "../../src/elasticsearchEntityJsonBuilders/DashboardBuilder";
import { IESDashboard } from "../../src/elasticsearchModels/dashboardModel";
import { IESVisualization } from '../../src/elasticsearchModels/visualizationModel';
import { dashboardSeed } from "./elasticsearchBuilderTestResources/dashboardBuilder.spec.resources";
import { expectedDashboard1, expectedDashboard2 } from "./elasticsearchBuilderTestResources/dashboardBuilder.spec.resources";

/**
 * Dashboard Builder tests.
 */
const assert = chai.assert;
let dashboardBuilder: DashboardBuilder;

before(async () => {
    dashboardBuilder = new DashboardBuilder();
});

describe("Dashbaord Builder tests", () => {
    describe("create dashboard entity", () => {
        it("create empty dashboard succeeds", (done) => {
            const testVisualization1: IESVisualization = {
                _id: "test_id1",
                type: "test_type1"
            };

            const testVisualization2: IESVisualization = {
                _id: "test_id2",
                type: "test_type2"
            };

            const testDashboardSeed: IESDashboard = {
                _id: "test_id",
                title: "test_title",
                visualizations: [[testVisualization1, testVisualization2], [testVisualization1, testVisualization2]],
                description: "test_description"
            };

            const json = dashboardBuilder.getBasicDashboard(testDashboardSeed);

            assert.deepEqual(json, expectedDashboard1);
            done();
        });
    });

    it("create populated dashboard succeeds", (done) => {
        const json = dashboardBuilder.getBasicDashboard(dashboardSeed);
        assert.deepEqual(json, expectedDashboard2);
        done();
    });
});