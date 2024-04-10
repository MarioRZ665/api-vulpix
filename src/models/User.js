const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema(
	{
		first_name: {
			type: String,
			required: true,
			max: 25,
		},
		last_name: {
			type: String,
			required: true,
			max: 25,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true,
		},
		password: {
			type: String,
			required: true,
			select: false,
			max: 25,
		},
		role: {
			type: String,
			required: true,
			default: 'user',
		},
	},
	{ timestamps: true }
);

// Hash password before saving
UserSchema.pre('save', function (next) {
	const user = this;

	if (!user.isModified('password')) return next();

	bcrypt.genSalt(10, (err, salt) => {
		if (err) return next(err);

		bcrypt.hash(user.password, salt, (err, hash) => {
			if (err) return next(err);

			user.password = hash;
			next();
		});
	});
});

// Method to compare passwords
UserSchema.methods.comparePassword = function (password, callback) {
	bcrypt.compare(password, this.password, function (err, isMatch) {
		if (err) {
			return callback(err);
		}
		callback(null, isMatch);
	});
};

// Method to generate JWT token
UserSchema.methods.generateAuthToken = function () {
	return jwt.sign(
		{
			_id: this._id,
			email: this.email,
			role: this.role,
		},
		process.env.JWT_SECRET, // Use a secret key stored in environment variables
		{
			expiresIn: '1h', // Token expiration time
		}
	);
};

module.exports = mongoose.model('users', UserSchema);