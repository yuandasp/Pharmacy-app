const multer = require("multer");
const path = require("path");
const maxSize = 1 * 1024 * 1024;

//setup destination and folder
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "src/public/payment");
  },
  filename: (req, file, cb) => {
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
  storage: fileStorage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Only .jpg and png format allowed!"));
    }
  },
  limits: { fileSize: maxSize },
});

const uploadPayment = (req, res, next) => {
  upload.single("file")(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res
          .status(400)
          .json({ error: "File size exceeds the limit (1mb)" });
      }
      return res.status(400).json({ error: "Error uploading files" });
    } else if (err) {
      return res.status(400).json({ error: err.message });
    }
    next();
  });
};

module.exports = uploadPayment;
