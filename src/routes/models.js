const express = require("express");
const multer = require("multer");
const { isLoggedIn} = require("../shared/auth/index");
const { postModel, getModel } = require("../controllers/models");

const upload = multer({
  limits: {
    fieldSize: 2 * 1024 * 1024,
  },
});

const mPostModel=[isLoggedIn,upload.array("photo", 12)]

const router = express.Router();

router.post("/models",mPostModel ,postModel);
router.get('/models',getModel)


module.exports = router;
