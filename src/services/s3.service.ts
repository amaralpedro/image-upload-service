import { S3 } from "aws-sdk";

import { aws } from "../lib/config";


export class S3Service {
  protected readonly s3: S3;
  private readonly bucket: string;
  private readonly expires: number;

  constructor(bucket: string, region: string = aws.region, signedUrlExpiration: number = aws.s3SignedUrlExpiration) {
    this.s3 = new S3({ region, signatureVersion: 'v4' });
    this.bucket = bucket;
    this.expires = signedUrlExpiration;
  }

  public async putObject(key: string, data: Buffer, contentType: string): Promise<void> {
    const params = {
      Bucket: this.bucket,
      Key: key,
      Body: data,
      ContentType: contentType
    }
    await this.s3.putObject(params).promise();
  }

  public async getObject(key: string): Promise<Buffer> {
    const params = {
      Bucket: this.bucket,
      Key: key
    };

    const result = await this.s3.getObject(params).promise();
    return result.Body as Buffer;
  }

  public createSignedUrl(key: string, contentType: string): string {
    const params = {
      Bucket: this.bucket,
      Key: key,
      Expires: this.expires,
      ContentType: contentType
    };

    return this.s3.getSignedUrl('putObject', params);
  }
}