const bodyParser = require("body-parser");
const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Buffer = require("buffer");
const gm = require("gm").subClass({
  imageMagick: true
});
const app = express();

let PORT = 5000;

var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "file_upload");
  },
  filename: function (req, file, callback) {
    callback(
      null,
      Date.now() + path.extname(file.originalname)
    );
  },
});

var upload = multer({
  storage: storage
});

const randomfileName = () => {
  return "file_upload/" + Date.now() + ".png";
}

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
  extended: true
}));

app.post("/upload", upload.single("file"), function (req, res) {
  let file_width = 0;
  let file_height = 0;
  if (req.body.file) {
    let filename = randomfileName();
    var base64Data = req.body.file.replace(/^data:image\/png;base64,/, "");

    require("fs").writeFile(filename, base64Data, 'base64', function (err) {
      if (err) {
        console.log(err);
      }
    });

    gm(filename).size((err, val) => {
      file_width = val.width;
      file_height = val.height;
    });

    gm(filename)
      .composite("logo-remove.png")
      .geometry("+0+0").write(filename, function (err) {
        if (err) res.send(err)
      });

  } else {

    gm(req.file.path).size((err, val) => {
      file_width = val.width;
      file_height = val.height;
    });

    gm(req.file.path)
      .composite("logo-remove.png")
      .geometry("+0+0").write(req.file.path, function (err) {
        if (err) res.send(err)
      });

  }
});

app.post("/uploads", upload.array("photos", 2), function (req, res, next) {});

app.use("/static", express.static(__dirname + "/file_upload"));

app.listen(PORT, () => {
  console.log("Server açıldı");
});