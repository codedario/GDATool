import * as chai from "chai";
import chaiHttp = require('chai-http');
import { before, describe, it } from "mocha";
import { IAggregationModel } from "../../src/models/aggregationModel";
import { IFilterModel } from "../../src/models/filterModel";
import { AggregationRepository } from "../../src/repositories/aggregationRepository";
import { FilterRepository } from "../../src/repositories/filterRepository";
import { deleteIfPresent } from "../deleteIfPresent.spec";

/**
 * Filter Controller tests.
 */
chai.use(chaiHttp);
const expect = chai.expect;
let aggregationRepository: AggregationRepository;
let filterRepository: FilterRepository;

const testfilter1: IFilterModel = {
    _id: "161616161616161616161616",
    aggId: "",
    aggName: "",
    query: "fliter1_test_query"
};

const testfilter2: IFilterModel = {
    _id: "171717171717171717171717",
    aggId: "",
    aggName: "",
    query: "fliter2_test_query"
};

const testAggregation: IAggregationModel = {
    _id: "181818181818181818181818",
    jobId: "191919191919191919191919",
    operations: [],
    featureColumns: [],
    metricColumn: "aggregation_test_metricColumn",
    name: "aggregation_test_name",
    sortColumnName: "aggregation1_test_sortColumnName"
};

before(async () => {
    aggregationRepository = new AggregationRepository();
    filterRepository = new FilterRepository();

    await deleteIfPresent(testAggregation, aggregationRepository);
    await deleteIfPresent(testfilter1, filterRepository);
    await deleteIfPresent(testfilter2, filterRepository);

    await aggregationRepository.create(testAggregation);
    testfilter1.aggId = testAggregation._id;
    testfilter2.aggId = testAggregation._id;
    testfilter1.aggName = testAggregation.name;
    testfilter2.aggName = testAggregation.name;
});

describe("Filter Controller tests", () => {
    describe("create filter", () => {
        it("create a single filter succeeds", (done) => {
            chai.request("http://localhost:5000")
                .post("/ms/filter")
                .send(testfilter1)
                .end(function (err, res) {
                    const returnfilter: IFilterModel = res.body;
                    testfilter1._id = returnfilter._id;
                    expect(returnfilter.query).to.equal(returnfilter.query);
                    expect(res).to.have.status(200);
                    done();
                });
        });

        it("create multiple filters succeeds", (done) => {
            chai.request("http://localhost:5000")
                .post("/ms/filter/multiple")
                .send([testfilter2])
                .end(function (err, res) {
                    const returnfilters: Array<IFilterModel> = res.body;
                    expect(returnfilters).to.be.an('array');
                    expect(returnfilters).to.not.have.lengthOf(0);
                    expect(returnfilters[0]).to.have.ownProperty("_id");
                    expect(res).to.have.status(200);
                    done();
                });
        });
    });

    describe("get filter", () => {
        it("get filters with an existing aggregation id succeeds", (done) => {
            chai.request("http://localhost:5000")
                .get("/ms/filter/byAgg/" + testAggregation._id)
                .end(function (err, res) {
                    const returnfilters: Array<IFilterModel> = res.body;
                    expect(returnfilters).to.be.an('array');
                    expect(returnfilters).to.not.have.lengthOf(0);
                    expect(returnfilters[0]).to.have.ownProperty("_id");
                    expect(res).to.have.status(200);
                    done();
                });
        });

        it("get filters with a non existing aggregation id returns empty list and succeeds", (done) => {
            chai.request("http://localhost:5000")
                .get("/ms/filter/byAgg/wrongId")
                .end(function (err, res) {
                    const returnfilters: Array<IFilterModel> = res.body;
                    expect(returnfilters).to.be.an('array');
                    expect(returnfilters).to.have.lengthOf(0);
                    expect(res).to.have.status(200);
                    done();
                });
        });

        it("get all filters succeeds", (done) => {
            chai.request("http://localhost:5000")
                .get("/ms/filter/getAll")
                .end(function (err, res) {
                    const returnfilters: Array<IFilterModel> = res.body;
                    expect(returnfilters).to.be.an('array');
                    expect(returnfilters).to.not.have.lengthOf(0);
                    expect(returnfilters[0]).to.have.ownProperty("_id");
                    expect(res).to.have.status(200);
                    done();
                });
        });
    });

    describe("delete filters", () => {
        it("filter using non existing id fails", (done) => {
            chai.request("http://localhost:5000")
                .delete("/ms/filter/wrongId")
                .end(function (err, res) {
                    expect(res).to.have.status(500);
                    done();
                });
        });

        it("filter using existing id succeeds", (done) => {
            chai.request("http://localhost:5000")
                .delete("/ms/filter/" + testfilter1._id)
                .end(function (err, res) {
                    const returnfilter: IFilterModel = res.body;
                    expect(returnfilter._id).to.equal(returnfilter._id);
                    expect(res).to.have.status(200);
                    done();
                });
        });

        it("filter2 using existing id succeeds", (done) => {
            chai.request("http://localhost:5000")
                .delete("/ms/filter/" + testfilter2._id)
                .end(function (err, res) {
                    const returnfilter: IFilterModel = res.body;
                    expect(returnfilter._id).to.equal(returnfilter._id);
                    expect(res).to.have.status(200);
                    done();
                });
        });

        it("aggregation2 using existing id succeeds", (done) => {
            chai.request("http://localhost:5000")
                .delete("/ms/aggregation/" + testAggregation._id)
                .end(function (err, res) {
                    const returnAggregation: IAggregationModel = res.body;
                    expect(returnAggregation._id).to.equal(testAggregation._id);
                    expect(res).to.have.status(200);
                    done();
                });
        });
    });
});