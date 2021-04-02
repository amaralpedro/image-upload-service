import * as gm from "gm";

import { S3Service } from "../services";
import { s3Buckets } from "../lib/config";

const im = gm.subClass({imageMagick: true});


export class ProcessImageHandler {
  constructor(
    private readonly s3Service = new S3Service(s3Buckets.images)
  ) {}

  public async execute(event): Promise<void> {
    const key: string = event.Records[0].s3.object.key;

    const file = await this.s3Service.getObject(key);
    const metadataFilename = key.replace('image-', 'metadata-');
    const metadata = await this.extractMetadata(file, key);

    await this.s3Service.putObject(`${metadataFilename}.json`, Buffer.from(metadata), 'application/json');
  }

  private async extractMetadata(file: Buffer, key: string): Promise<string> {
    return new Promise((resolve, reject) => {
      im(file, key).identify({ bufferStream: true}, (err, info) => err ? reject(err) : resolve(JSON.stringify(info)));
    });
  }
}
