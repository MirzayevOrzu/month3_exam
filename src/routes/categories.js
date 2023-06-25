const express = require("express");
const Validator = require("../shared/validator");
const { postCategory,getCategory ,deleteCategory,patchCategory} = require("../controllers/categories");
const { patchSchema,postSchema } = require("../controllers/categories/schemas");

const router = express.Router();

router.post("/categories", Validator(postSchema), postCategory);
router.get('/categories',getCategory)
router.delete('/categories/:id',deleteCategory)
router.patch('/categories/:id',patchCategory)
module.exports = router;
