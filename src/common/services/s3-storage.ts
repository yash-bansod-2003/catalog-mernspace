import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import config from "config";
import { FileData, FileStorage } from "../types/storage";

export class S3Storage implements FileStorage {
    private client: S3Client;

    constructor() {
        this.client = new S3Client({
            region: config.get("aws.s3.region"),
            credentials: {
                accessKeyId: config.get("aws.s3.accessKeyId"),
                secretAccessKey: config.get("aws.s3.secretAccessKey"),
            },
        });
    }

    async upload(data: FileData): Promise<void> {
        const objectParams = {
            Bucket: config.get("aws.s3.bucket"),
            Key: data.filename,
            Body: data.fileData,
        };

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-expect-error
        await this.client.send(new PutObjectCommand(objectParams));
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    delete(filename: string): void {
        throw new Error("Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getObjectUri(filename: string): string {
        throw new Error("Method not implemented.");
    }
}
