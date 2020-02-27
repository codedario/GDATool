import { Inject } from "typescript-ioc";
import { DELETE, GET, Path, PathParam, POST, PUT } from "typescript-rest";
import {Controller} from "../../../common-service/src/controllers/controller";
import { IJob, IJobModel } from "../../../common-service/src/models/jobModel";
import { UploadUrlModel } from "../../../common-service/src/models/uploadUrlModel";
import { JobRepository } from "../../../common-service/src/repositories/jobRepository";
import { S3BucketServiceProxy } from "../s3/s3BucketServiceProxy";

@Path("/ms/job")
export class JobController extends Controller<IJob> {

    private bucketName: string;

    constructor(@Inject private jobRepository: JobRepository,
        @Inject private s3BucketServiceProxy: S3BucketServiceProxy) {
        super(jobRepository);
        this.bucketName = process.env.BUCKET_NAME;       
    }

    @Path("getAll")
    @GET
    public async getAllJobs(): Promise<Array<IJobModel>> {
        return await this.jobRepository.getAll();
    }

    @Path(":id")
    @GET
    public async getJobById(@PathParam("id") id: string): Promise<IJobModel> {
        return await this.jobRepository.getById(id);
    }

    @Path("noAws")
    @POST
    public async createJobWithoutAWSInitialization(job: IJobModel): Promise<IJobModel> {
        return await this.jobRepository.create(job);
    }

    @POST
    public async createJob(job: IJobModel): Promise<IJobModel> {
        const newJob: IJob = await this.jobRepository.create(job);
        newJob.rawInputDirectory = `${newJob.userId}/${newJob._id}/raw`;
        newJob.stagingFileName = `${newJob.userId}/${newJob._id}/staging`;
        
        await this.s3BucketServiceProxy.createFolder(this.bucketName, newJob.rawInputDirectory + "/schema.json");
        await this.s3BucketServiceProxy.createFolder(this.bucketName, newJob.stagingFileName + "/foo");
        
        return this.updateJob(newJob._id, newJob);
    }

    @Path(":id")
    @PUT
    public async updateJob(@PathParam("id") id: string, job: IJobModel): Promise<IJobModel> {
        return await this.jobRepository.update(id, job);
    }

    @Path(":id")
    @DELETE
    public async deleteJob(@PathParam("id") id: string): Promise<IJobModel> {
        return await this.jobRepository.delete(id);
    }

    @Path("recursive/:id")
    @DELETE
    public async deleteJobRecursive(@PathParam("id") id: string): Promise<IJobModel> {
        return await this.jobRepository.deleteRecursive(id);
    }

    @Path("byUser/:id")
    @GET
    public async getJobsByUser(@PathParam("id") id: string): Promise<Array<IJobModel>> {
        return await this.jobRepository.getjobsByUserId(id);
    }

    @Path("getUploadFileUrl")
    @POST
    public async getUploadFileUrl(uploadUrlModel: UploadUrlModel): Promise<string> {
        const job: IJob = await this.jobRepository.getById(uploadUrlModel.jobId);
        const filePath = `${job.rawInputDirectory}/${uploadUrlModel.fileName}`;
        return this.s3BucketServiceProxy.getSignedUrlValidFor30minutes(process.env.BUCKET_NAME, filePath);
    }

    @Path("readFile")
    @POST
    public async readFile(job: IJobModel) {
        const filePath = `${job.userId}/${job._id}/raw/schema.json`;
        const res = await this.s3BucketServiceProxy.readFile(process.env.BUCKET_NAME, filePath);
        return res.Body.toString();
    }
}
