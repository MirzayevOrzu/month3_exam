const express = require("express");
const userRouter = require("./users");
const categoryRouter=require('./categories')
const brandsRouter=require('./brands')
const modelsRouter=require('./models')

const router = express.Router();

router.use(userRouter);
router.use(categoryRouter)
router.use(brandsRouter)
router.use(modelsRouter)

module.exports = router;
