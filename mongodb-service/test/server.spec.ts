import * as chai from "chai";
import { describe, it } from "mocha";
import { Server, HttpMethod } from "typescript-rest";

const expect = chai.expect;

/**
 * API Server tests ensure that all the expected endpoints are exposed at runtime. It also ensures that their paths have the expected types (GET, POST, PUT, DELETE, ...)
 */
describe("Rest Server Tests", () => {
    describe("Check the exposed routes", () => {
        it("Contains all paths and they are of the correct type", (done) => {
            expect(Server.getPaths()).to.include.members([
                '/ms/aggregation/getAll',
                '/ms/aggregation/:id',
                '/ms/aggregation',
                '/ms/aggregation/multiple',
                '/ms/aggregation/byUser/:id',
                '/ms/aggregation/byJob/:id',
                '/ms/aggregation/recursive/:id',

                '/ms/cluster/getAll',
                '/ms/cluster/byAgg/:id',
                '/ms/cluster/multiple',
                '/ms/cluster',

                '/ms/filter/getAll',
                '/ms/filter/byAgg/:id',
                '/ms/filter/multiple',
                '/ms/filter',

                '/ms/job/getAll',
                '/ms/job/:id',
                '/ms/job',
                '/ms/job/noAws',
                '/ms/job/recursive/:id',
                '/ms/job/byUser/:id',
                '/ms/job/getUploadFileUrl',
                '/ms/job/readFile',
                '/ms/job/recursive/:id',

                '/ms/plot/getAll',
                '/ms/plot/byJob/:id',
                '/ms/plot/multiple',
                '/ms/plot',

                '/ms/user/authenticate',
                '/ms/user/byEmail/:email',
                '/ms/user/getAll',
                '/ms/user/:id',
                '/ms/user',
                '/ms/user/recursive/:id'
            ]);

            // Checking types of user endpoints
            expect(Server.getHttpMethods("/ms/user/:id")).to.have.members([HttpMethod.GET, HttpMethod.PUT, HttpMethod.DELETE]);
            expect(Server.getHttpMethods("/ms/user")).to.have.members([HttpMethod.POST]);
            expect(Server.getHttpMethods("/ms/user/recursive/:id")).to.have.members([HttpMethod.DELETE]);
            expect(Server.getHttpMethods("/ms/user/authenticate")).to.have.members([HttpMethod.POST]);
            expect(Server.getHttpMethods("/ms/user/byEmail/:email")).to.have.members([HttpMethod.GET]);
            expect(Server.getHttpMethods("/ms/user/getAll")).to.have.members([HttpMethod.GET]);

            // Checking types of job endpoints
            expect(Server.getHttpMethods("/ms/job/getAll")).to.have.members([HttpMethod.GET]);
            expect(Server.getHttpMethods("/ms/job/:id")).to.have.members([HttpMethod.PUT, HttpMethod.GET, HttpMethod.DELETE]);
            expect(Server.getHttpMethods("/ms/job")).to.have.members([HttpMethod.POST]);
            expect(Server.getHttpMethods("/ms/job/noAws")).to.have.members([HttpMethod.POST]);
            expect(Server.getHttpMethods("/ms/job/byUser/:id")).to.have.members([HttpMethod.GET]);
            expect(Server.getHttpMethods("/ms/job/getUploadFileUrl")).to.have.members([HttpMethod.POST]);
            expect(Server.getHttpMethods("/ms/job/readFile")).to.have.members([HttpMethod.POST]);
            expect(Server.getHttpMethods("/ms/job/recursive/:id")).to.have.members([HttpMethod.DELETE]);

            // Checking types of aggregation endpoints
            expect(Server.getHttpMethods("/ms/aggregation/getAll")).to.have.members([HttpMethod.GET]);
            expect(Server.getHttpMethods("/ms/aggregation/:id")).to.have.members([HttpMethod.PUT, HttpMethod.GET, HttpMethod.DELETE]);
            expect(Server.getHttpMethods("/ms/aggregation")).to.have.members([HttpMethod.POST]);
            expect(Server.getHttpMethods("/ms/aggregation/byUser/:id")).to.have.members([HttpMethod.GET]);
            expect(Server.getHttpMethods("/ms/aggregation/multiple")).to.have.members([HttpMethod.POST]);
            expect(Server.getHttpMethods("/ms/aggregation/byJob/:id")).to.have.members([HttpMethod.GET]);

            // Checking types of cluster endpoints
            expect(Server.getHttpMethods("/ms/cluster/getAll")).to.have.members([HttpMethod.GET]);
            expect(Server.getHttpMethods("/ms/cluster/byAgg/:id")).to.have.members([HttpMethod.GET]);
            expect(Server.getHttpMethods("/ms/cluster/multiple")).to.have.members([HttpMethod.POST]);
            expect(Server.getHttpMethods("/ms/cluster")).to.have.members([HttpMethod.POST]);
            
            // Checking types of plot endpoints
            expect(Server.getHttpMethods("/ms/plot/getAll")).to.have.members([HttpMethod.GET]);
            expect(Server.getHttpMethods("/ms/plot/byJob/:id")).to.have.members([HttpMethod.GET]);
            expect(Server.getHttpMethods("/ms/plot/multiple")).to.have.members([HttpMethod.POST]);
            expect(Server.getHttpMethods("/ms/plot")).to.have.members([HttpMethod.POST]);
            
            // Checking types of filter endpoints
            expect(Server.getHttpMethods("/ms/filter/getAll")).to.have.members([HttpMethod.GET]);
            expect(Server.getHttpMethods("/ms/filter/byAgg/:id")).to.have.members([HttpMethod.GET]);
            expect(Server.getHttpMethods("/ms/filter/multiple")).to.have.members([HttpMethod.POST]);
            expect(Server.getHttpMethods("/ms/filter")).to.have.members([HttpMethod.POST]);

            done();
        });
    });
})