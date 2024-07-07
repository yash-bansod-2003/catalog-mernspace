import {
    S3Client,
    PutObjectCommand,
    PutObjectCommandInput,
    DeleteObjectCommand,
    DeleteObjectCommandOutput,
    DeleteObjectCommandInput,
} from "@aws-sdk/client-s3";
import config from "config";
import { FileData, FileStorage } from "../types/storage";
import createHttpError from "http-errors";

export class S3Storage implements FileStorage {
    private client: S3Client;

    constructor() {
        this.client = new S3Client({
            region: config.get("aws.s3.region"),
            credentials: {
                accessKeyId: config.get("aws.s3.key"),
                secretAccessKey: config.get("aws.s3.secret"),
            },
        });
    }

    /**
     * Uploads a file to an S3 bucket.
     *
     * @param {FileData} data - The file data to be uploaded.
     * @return {Promise<void>} - A promise that resolves when the file is successfully uploaded.
     */
    async upload(data: FileData): Promise<void> {
        const objectParams: PutObjectCommandInput = {
            Bucket: config.get("aws.s3.bucket"),
            Key: data.filename,
            Body: data.fileData,
        };
        await this.client.send(new PutObjectCommand(objectParams));
    }

    /**
     * Deletes a file from an S3 bucket.
     *
     * @param {string} filename - The name of the file to be deleted.
     * @return {Promise<DeleteObjectCommandOutput>} - A promise that resolves when the file is successfully deleted.
     */
    async delete(filename: string): Promise<DeleteObjectCommandOutput> {
        const payload: DeleteObjectCommandInput = {
            Bucket: config.get("aws.s3.bucket"),
            Key: filename,
        };
        return this.client.send(new DeleteObjectCommand(payload));
    }

    /**
     * Returns the URL of the S3 object with the given filename.
     *
     * @param {string} filename - The name of the S3 object.
     * @return {string | undefined} The URL of the S3 object, or undefined if the AWS S3 configuration is invalid.
     * @throws {HttpError} If the AWS S3 configuration is invalid.
     */
    getObjectUri(filename: string): string | undefined {
        const bucket = config.get("aws.s3.bucket");
        const region = config.get("aws.s3.region");
        if (typeof bucket === "string" && typeof region === "string") {
            return `https://${bucket}.s3.${region}.amazonaws.com/${filename}`;
        }
        const error = createHttpError(500, "invalid aws s3 config");
        throw error;
    }
}
