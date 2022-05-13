import AWS from "aws-sdk";
import { ICreateSpaceState } from "../components/spaces/CreateSpace";
import { Space } from "../model/Model";
import { config } from "./config";

AWS.config.update({
    region: config.REGION,
});

export class DataService {
    private s3Client = new AWS.S3({ region: config.REGION });

    public async getSpaces(): Promise<Space[]> {
        const requestUrl = config.api.spacesUrl;
        const res = await (await fetch(requestUrl, { method: "GET" })).json();
        console.log(res);
        return res;
    }

    public async createSpace(input: ICreateSpaceState): Promise<string | undefined> {
        if (input.photo) {
            const photoUrl = await this._uploadFile(input.photo, config.PHOTO_BUCKET);
            input.photoUrl = photoUrl;
            input.photo = undefined;
        }
        const requestUrl = config.api.spacesUrl;
        const requestOptions: RequestInit = {
            method: "POST",
            body: JSON.stringify(input),
        };
        const res = await (await fetch(requestUrl, requestOptions)).json();
        return JSON.stringify(res);
    }

    public async reserveSpace(id: string): Promise<string | undefined> {
        if (id === "1001") {
            return "9999-1001";
        }
        return undefined;
    }

    private async _uploadFile(file: File, bucketName: string): Promise<string> {
        const fileName = this._generateRandomFilePrefix + file.name;
        const res = await new AWS.S3()
            .upload({
                Bucket: bucketName,
                Key: fileName,
                Body: file,
                ACL: "public-read",
            })
            .promise();
        return res.Location;
    }

    private _generateRandomFilePrefix(): string {
        return Math.random().toString(36).slice(2);
    }
}
