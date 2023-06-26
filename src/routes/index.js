const express = require("express");
const userRouter = require("./users");
const categoryRouter=require('./categories')
const brandsRouter=require('./brands')
const modelsRouter=require('./models')
const noutbooksRouter=require('./noutbooks')

const router = express.Router();

router.use(userRouter);
router.use(categoryRouter)
router.use(brandsRouter)
router.use(modelsRouter)
router.use(noutbooksRouter)


module.exports = router;
