const multer = require("multer");
const fs = require("fs");
const dir = process.cwd() + "/src/uploads";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extention =
      file.originalname.split(".")[file.originalname.split(".").length - 1];
    cb(null, file.fieldname + "-" + uniqueSuffix + "." + extention);
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
