const Joi = require("joi");
module.exports.journalSchema = Joi.object({
  title: Joi.string().required(),
  content: Joi.string().required(),
  createdAt: Joi.date().iso().required(),
});
module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    body: Joi.string().required(),
  }).required(),
});
