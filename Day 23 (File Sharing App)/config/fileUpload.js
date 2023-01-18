const multer = require("multer");
const path = require("path");

let fileStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, "uploads/"),
  filename: (_req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

let upload = multer({
  storage: fileStorage,
  limit: { fileSize: 10 ** 7 },
}).single("uploadedFile");

module.exports = upload;
