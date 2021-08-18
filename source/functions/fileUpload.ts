import multer = require('multer');
import path from 'path';

const fileStorageEngine = multer.diskStorage({
    destination: './source/images',
    filename: (req, file, cb) => {
        cb(
            null,
            path.basename(file.originalname, path.extname(file.originalname)) +
            "-" +
            Date.now() +
            path.extname(file.originalname)
        );
    }
});

const upload = multer({ storage: fileStorageEngine });

export default upload;

// **** For Reference **** //
// Single File Upload
// router.post("/single", upload.single("image"), (req, res) => {
//     console.log(req.file);
//     res.send("Single file Uploaded Successfully");
// });

// // Multiple File Upload
// router.post('/multiple', upload.array('images', 3),(req, res) => {
//     console.log(req.files);
//     res.send("Multiple files Uploaded Successfully");
// })