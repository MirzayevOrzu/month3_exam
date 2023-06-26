const Joi = require("joi");

exports.postSchema = Joi.object({
  name: Joi.string().required(),
});
