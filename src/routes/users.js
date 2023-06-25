const express = require("express");
const validator = require("../shared/validator");
const { loginUser } = require("../controllers/users");
const {loginSchema} = require("../controllers/users/schemas");

const router = express.Router();

router.post("/login", validator(loginSchema), loginUser);

module.exports = router;
