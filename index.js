const express = require("express");
const multer = require("multer");
const path = require("path");
const app = express();

let PORT = 5000;

var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "file_upload");
  },
  filename: function (req, file, callback) {
    callback(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

var upload = multer({ storage: storage });

app.post("/upload", upload.single("file"), function (req, res) {});

app.post("/uploads", upload.array("photos", 2), function (req, res, next) {});

app.use("/static", express.static(__dirname + "/file_upload"));

app.listen(PORT, () => {
  console.log("Server açıldı");
});
