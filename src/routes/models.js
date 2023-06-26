const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const db = require("../db");
const { postModel, getModel } = require("../controllers/models");
const router = express.Router();
console.log(__dirname, "dsd");
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//       cb(null, 'uploads/');
//     },
//     filename: (req, file, cb) => {
//       cb(null, file.originalname);
//     }
//   });
const upload = multer({
  limits: {
    fieldSize: 2 * 1024 * 1024,
  },
});

router.post("/models", upload.array("photo", 12),postModel);
router.get('/models',getModel)


module.exports = router;
