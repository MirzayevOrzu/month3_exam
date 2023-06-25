const Joi = require("joi");

/**
 * @param {Joi.Schema} schema
 * @returns
 */
module.exports = function Validator(schema) {
  return async (req, res, next) => {
    try {
      await schema.validateAsync(req.body);

      next();
    } catch (error) {
      res.status(400).json({
        error: error.message,
      });
    }
  };
};
