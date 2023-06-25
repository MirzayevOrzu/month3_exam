const express = require("express");
const userRouter = require("./users");
const categoryRouter=require('./categories')

const router = express.Router();

router.use(userRouter);
router.use(categoryRouter)

module.exports = router;
