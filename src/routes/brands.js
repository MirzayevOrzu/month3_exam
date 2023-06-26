const express = require("express");
const Validator = require("../shared/validator");
const { patchSchema,postSchema } = require("../controllers/brands/schemas");
const { isLoggedIn } = require("../shared/auth/index");
const {
    postBrand,
    getBrands,
    deleteBrand,
    patchBrand,
    showBrand,showBrandModel}=require('../controllers/brands')

const router = express.Router();

router.post("/brands", isLoggedIn,Validator(postSchema), postBrand);
router.get('/brands',getBrands)
router.delete('/brands/:id',isLoggedIn,deleteBrand)
router.patch('/brands/:id',isLoggedIn,patchBrand)
router.get('/brands/:name',showBrand)
router.get('/brands/:brand_name/:model_name',showBrandModel)
module.exports = router;
