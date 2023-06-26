const express = require("express");
const multer = require("multer");
const { postNoutbook, getNoutbooks } = require("../controllers/noutbooks/index");
const router = express.Router();

const upload = multer({
  limits: {
    fieldSize: 2 * 1024 * 1024,
  },
});

router.post("/noutbooks", upload.array("photo", 12),postNoutbook);
router.get('/noutbooks',getNoutbooks)


module.exports = router;
