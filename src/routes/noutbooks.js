const express = require("express");
const multer = require("multer");
const { postNoutbook, getNoutbooks } = require("../controllers/noutbooks/index");
const { isLoggedIn } = require("../shared/auth");

const router = express.Router();

const upload = multer({
  limits: {
    fieldSize: 2 * 1024 * 1024,
  },
});

const mPostNoutBook=[isLoggedIn,upload.array("photo", 12)]

router.post("/noutbooks",mPostNoutBook ,postNoutbook);
router.get('/noutbooks',getNoutbooks)


module.exports = router;
