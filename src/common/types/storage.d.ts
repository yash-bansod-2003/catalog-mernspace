import { DeleteObjectCommandOutput } from "@aws-sdk/client-s3";
import { BodyDataTypes } from "@aws-sdk/lib-storage";

interface FileData {
    filename: string;
    fileData: BodyDataTypes;
}

export interface FileStorage {
    upload(data: FileData): Promise<void>;
    delete(filename: string): Promise<DeleteObjectCommandOutput>;
    getObjectUri(filename: string): string | undefined;
}
