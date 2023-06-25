const Joi = require('joi');

exports.loginStuffSchema = Joi.object({
  username: Joi.string().required().min(5).max(10),
  password: Joi.string().required().min(5),
});