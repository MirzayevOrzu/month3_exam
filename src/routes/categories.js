const express = require("express");
const Validator = require("../shared/validator");
const { isLoggedIn, hasRole } = require("../shared/auth/index");
const {
  patchSchema,
  postSchema,
} = require("../controllers/categories/schemas");
const {
  postCategory,
  getCategory,
  deleteCategory,
  patchCategory,
  showCtegoryBrands,
  showCategoryNoutbooks,
} = require("../controllers/categories");

const mPostCategory=[ isLoggedIn,hasRole(["admin"]),Validator(postSchema)]
const mpatchCategory=[isLoggedIn,hasRole(["admin"]),Validator(patchSchema)]
const mDeleteCategory=[isLoggedIn,hasRole(["admin"])]

const router = express.Router();

router.post("/categories",mPostCategory,postCategory);
router.get("/categories", getCategory);
router.delete("/categories/:id",mDeleteCategory,deleteCategory);
router.patch("/categories/:id",mPostCategory,patchCategory);
router.get("/product-category/:category_name", showCategoryNoutbooks);
router.get("/product-category/:category_name/:brand_name", showCtegoryBrands);

module.exports = router;
