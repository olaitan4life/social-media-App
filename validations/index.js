const Joi = require("joi");

const validateEditProfile = (user) => {
  const schema = Joi.object({
    surname: Joi.string().min(3).optional(),
    othernames: Joi.string().min(3).optional(),
    occupation: Joi.string().min(11).optional(),
    about_me: Joi.string().min(3).optional(),
  });
  return schema.validate(user);
};

// const userValidation = (user) => {
//   const schema = joi.object({
//     phone: joi.string().min(11).required(),
//     babaname: joi.string().optional(),
//     mamaname: joi.string().max(30).required(),
//     lovername: joi.string().optional(),
//   });
//   return schema.validate(user)
// };

const validateRegister = (user) => {
  const schema = Joi.object({
    surname: Joi.string().min(3).required(),
    othernames: Joi.string().min(3).required(),
    username: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });
  return schema.validate(user);
};

const validatePost = (user) => {
  const schema = Joi.object({
    post: Joi.string().min(3).required(),
  });
  return schema.validate(user);
};

const validateEditPost = (post) => {
  const schema = Joi.object({
    post: Joi.string().min(3).required(),
  });
  return schema.validate(post);
};

const validateAddComment = (comment) => {
  const schema = Joi.object({
    comment: Joi.string().min(3).required(),
  });
  return schema.validate(comment);
};

const validateEditComment = (comment) => {
  const schema = Joi.object({
    comment: Joi.string().min(3).required(),
  });
  return schema.validate(comment);
};

const validateReactionToPost = (comment) => {
  const schema = Joi.object({
    reaction: Joi.string().required().valid("like", "dislike", "love", "funny"),
  });
  return schema.validate(comment);
};

module.exports = {
  validateEditProfile,
  validateRegister,
  validatePost,
  validateEditPost,
  validateAddComment,
  validateEditComment,
  validateReactionToPost,
};
