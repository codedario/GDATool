import * as mongoose from "mongoose";
import Aggregation, { IAggregation, IAggregationModel } from "../models/aggregationModel";
import Cluster, { IClusterModel } from "../models/clusterModel";
import Filter, { IFilterModel } from "../models/filterModel";
import Job from "../models/jobModel";
import { Repository } from "./repository";

/**
 * Extends the base Repository class and adds methods unique to Aggregations.
 */
export class AggregationRepository extends Repository<IAggregation> {
    constructor() {
        super(Aggregation);
    }

    /**
     * Returns a collection of Aggregations matching a given User id.
     * @param id 
     */
    public async getAggsByUser(id: string): Promise<Array<IAggregationModel>> {
        const jobIds = new Array();
        const jobs = await Job.find({ userId: id }).exec();
        jobs.forEach((job: any) => {
            jobIds.push(job._id);
        });
        return Aggregation.find({ jobId: { $in: jobIds } }).exec();
    }

    /**
     * Returns a collection of Aggregations matching a given Job id.
     * @param id 
     */
    public getAggsByJob(id: string): Promise<Array<IAggregationModel>> {
        return Aggregation.find({ jobId: id }).exec();
    }

    /**
     * Save a colelction of Aggregations.
     * @param aggregations 
     */
    public async createMultipleAggregations(aggregations: Array<IAggregationModel>): Promise<Array<IAggregationModel>> {
        const returnAggregations = [];
        for (const agg of aggregations) {
            const newAgg = await this.create(agg);
            returnAggregations.push(newAgg);
        }
        return returnAggregations;
    }

    /**
     * Delete an Aggregation recursively given an id. For Aggregations this involves also
     * deleting recursively the following entities: Clusters, Filters.
     * @param id 
     */
    public async deleteRecursive(id: string): Promise<IAggregationModel> {
        mongoose.set("useFindAndModify", false);
        const filters: Array<IFilterModel> = await Filter.find({ aggId: id }).exec();
        const clusters: Array<IClusterModel> = await Cluster.find({ aggId: id }).exec();

        // Delete Clusers
        await clusters.forEach((cluster: IClusterModel) => {
            Cluster.findByIdAndRemove(cluster._id).exec();
        });

        // Delete Filters
        await filters.forEach((filter: IFilterModel) => {
            Filter.findByIdAndRemove(filter._id).exec();
        });

        // Delete Aggregation
        return await Aggregation.findByIdAndRemove(id).exec();
    }
}
