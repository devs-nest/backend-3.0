const multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "Content");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 * 100 },
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpg|png|mp4|mkv|flv|mov|wmv|gif/;
    const mimeType = fileTypes.test(file.mimetype);
    const extname = fileTypes.test(path.extname(file.originalname));

    if (mimeType && extname) {
      return cb(null, true);
    }
    cb("Give proper files formate to upload");
  },
}).single("content");

module.exports = upload;
