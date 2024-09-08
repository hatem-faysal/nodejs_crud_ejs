const Joi = require('joi');

exports.createCategoryValidator = Joi.object({
  name: Joi.string().required().min(3).max(50).messages({
    'string.base': 'Name must be a string',
    'string.empty': 'Name is required',
    'string.min': 'Name must be at least 3 characters long',
    'string.max': 'Name must be at most 50 characters long'
  }),
});