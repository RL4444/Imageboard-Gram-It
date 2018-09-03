const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const db = require("./sql/db");
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");
const s3 = require("./s3");
const config = require("./config");

const diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});

const handleFile = uploader.single("file");

app.use(bodyParser.json());

app.use(express.static(__dirname + "/public"));

app.get("/getimages", (req, res) => {
    db.getImagesData().then(image => {
        // console.log("image in 'get' getimages route json:", image);
        res.json(image);
    });
});
app.get("/getimages/:id", (req, res) => {
    db.getImagesId(req.params.id).then(image => {
        // console.log("image in 'get' getimages route json:", image);
        console.log(image);
        res.json(image);
        console.log("is this the id? ", req.params.id);
    });
});

app.post("/getimages/:id", (req, res) => {
    console.log(req.body);
    let imageId = req.params.id;
    db.addComment()
        .then(comment => {
            req.comment;
            console.log("is this even doing anything? - getting to comments");
        })
        .catch("err in images/:id post route", err);
});

app.get("/comments/:id", (req, res) => {
    db.getComments(req.params.id)
        .then(comments => {
            console.log("comments from comments get route:", comments);
            res.json(comments);
        })
        .catch(err => console.log(err));
});

app.post("/submit-comment", function(req, res) {
    console.log("req.body in post /submitcomment route: ", req.body);

    db.addComment(req.body.username, req.body.comment, req.body.id).then(
        result => {
            res.json({
                success: true,
                result
            });
            console.log("result", result);
        }
    );
});

app.post("/upload", handleFile, s3.upload, function(req, res) {
    if (req.file) {
        console.log(
            "properties of the body in post route of '/upload'",
            req.body
        );
        db.addImage(
            req.body.title,
            req.body.description,
            req.body.username,
            config.s3Url + req.file.filename
        ).then(result => {
            res.json({
                success: true,
                image: result
            });
        });
        // console.log(req.file);
    } else {
        console.log("error in upload post route");
        res.json({ success: false });
    }
});

app.listen(process.env.PORT || 8080);
