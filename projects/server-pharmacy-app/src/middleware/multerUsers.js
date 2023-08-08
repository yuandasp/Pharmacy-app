const multer = require("multer");
const path = require("path");
const maxSize = 1 * 1024 * 1024;
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "src/public/users");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      path.parse(file.originalname).name +
        "-" +
        Date.now() +
        path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/gif" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("only .jpg,.png,.gif,and.jpeg file can uploaded"));
    }
  },
  limits: { fileSize: maxSize },
});
const uploadMiddleware = (req, res, next) => {
  upload.single("file")(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res
          .status(400)
          .json({ error: "File size exceeds the limit (1mb)" });
      }
      return res.status(400).json({ error: "Error uploading file" });
    } else if (err) {
      return res.status(400).json({ error: err.message });
    }

    next();
  });
};

module.exports = uploadMiddleware;
