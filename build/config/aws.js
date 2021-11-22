"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var aws_sdk_1 = __importDefault(require("aws-sdk"));
var config_1 = __importDefault(require("./config"));
// AWS-S3 Preparation
// @ts-ignore
var s3 = new aws_sdk_1.default.S3({ accessKeyId: config_1.default.bucket.accessKeyId, secretAccessKey: config_1.default.bucket.secretAccessKey, Bucket: config_1.default.bucket.name });
exports.default = s3;
// Ec2 Instance Node deployment tutorial ( https, domain setting and everything you need )
// https://www.youtube.com/watch?v=ehITvx8VPFI&ab_channel=Red62%21
