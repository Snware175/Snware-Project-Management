const joi = require("joi");

const signupValidation = (req, res, next) => {
  const schema = joi.object({
    name: joi.string().min(3).max(100).required(),

    email: joi
      .string()
      .email()
      .pattern(/^[a-zA-Z0-9._%+-]+@snwareresearch\.com$/)
      .required()
      .messages({
        "string.pattern.base": "Only @snwareresearch.com emails are allowed!",
      }),

    password: joi
      .string()
      .min(6)
      .max(100)
      .pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]+$/)
      .required()
      .messages({
        "string.pattern.base":
          "Password must be alphanumeric and contain at least one special character.",
      }),

    role: joi
      .string()
      .valid("Super Admin", "Admin", "Manager", "Executive")
      .required(),

    department: joi
      .array()
      .items(joi.string().min(1).max(100))
      .min(1)
      .required()
      .messages({
        "array.base": "Department must be an array.",
        "array.min": "At least one department is required.",
      }),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    console.log("Validation Error:", error.details); // Add this line
    console.log("Received Body:", req.body); // Add this too
    return res
      .status(400)
      .json({ message: "Bad request", error: error.details });
  }

  next();
};

module.exports = signupValidation;

const loginValidation = (req, res, next) => {
  const schema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(4).max(100).required(),
  });

  const { value, error } = schema.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json({ message: "Bad request", error: error.details, success: false });
  }
  req.body = value;
  next();
};

module.exports = { signupValidation, loginValidation };
