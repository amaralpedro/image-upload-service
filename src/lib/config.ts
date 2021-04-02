import * as GetEnv from "getenv";
import { config } from "dotenv";


config()

const environment = GetEnv.string('ENVIRONMENT');
const aws = {
  region: GetEnv.string('AWS_REGION_CODE'),
  s3SignedUrlExpiration: GetEnv.int('AWS_S3_DEFAULT_SIGNED_URL_EXPIRATION')
}
const s3Buckets = {
  images: GetEnv.string('AWS_S3_IMAGES_BUCKET')
}

export {
  environment,
  aws,
  s3Buckets
}