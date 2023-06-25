const express = require("express");
const Validator = require("../shared/validator");
const { postCategory } = require("../controllers/categories");
const { patchSchema,postSchema } = require("../controllers/categories/schemas");

const router = express.Router();

router.post("/categories", Validator(postSchema), postCategory);

module.exports = router;
