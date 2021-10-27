import aws from 'aws-sdk';
import config from './config';

// AWS-S3 Preparation
// @ts-ignore
const s3 = new aws.S3({ accessKeyId: config.bucket.accessKeyId, secretAccessKey: config.bucket.secretAccessKey, Bucket: config.bucket.name });

export default s3;
