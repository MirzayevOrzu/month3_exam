const express = require("express");
const Validator = require("../shared/validator");
const { patchSchema,postSchema } = require("../controllers/brands/schemas");
const {postBrand,
    getBrands,
    deleteBrand,
    patchBrand,
    showBrand}=require('../controllers/brands')

const router = express.Router();

router.post("/brands", Validator(postSchema), postBrand);
router.get('/brands',getBrands)
router.delete('/brands/:id',deleteBrand)
router.patch('/brands/:id',patchBrand)
router.get('/brands/:name',(req,res,next)=>{
    console.log(req.params,'mmmm');
    next()
},showBrand)

module.exports = router;
