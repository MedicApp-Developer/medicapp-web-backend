import { Request } from 'express';
import config from "../config/config";
import multer from 'multer';
import multerS3 from 'multer-s3';
import path from 'path';
import s3 from '../config/aws';

export const uploadsOnlyVideo = multer({
    storage: multerS3({
      s3: s3,
      bucket: config.bucket.name,
      acl: "public-read",
      key: function (req: Request, file: any, cb: any) {
        cb(
          null,
          path.basename(file.originalname, path.extname(file.originalname)) +
            "-" +
            Date.now() +
            path.extname(file.originalname)
        );
      },
    }),
    limits: { fileSize: 50000000 }, // In bytes: 2000000 bytes = 50 MB
  }).single("video");
