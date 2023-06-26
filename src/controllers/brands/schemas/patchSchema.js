const Joi = require("joi");

exports.patchSchema = Joi.object({
  name: Joi.string().min(2),
});
