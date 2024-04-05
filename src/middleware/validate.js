const { validationResult } = require('express-validator');

const Validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
	 const errorObj = {};
	 errors.array().forEach(err => {
		errorObj[err.param] = err.msg;
	 });
	 return res.status(422).json({ error: errorObj });
  }
  next();
};

module.exports = Validate;


