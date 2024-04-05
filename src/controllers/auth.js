const User = require('../models/User.js');
const bcrypt = require('bcrypt');

exports.createUser = async (req, res) => {
	const { first_name, last_name, email, password } = req.body;
	try {
		// Validación de datos de entrada
		if (!first_name || !last_name || !email || !password) {
			return res.status(400).json({
				status: 'failed',
				message: 'All fields are required.'
			});
		}
		// Hashing de la contraseña
		const hashedPassword = await bcrypt.hash(password, 10);
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(400).json({
				status: 'failed',
				message: 'It seems you already have an account. Please log in instead.'
			});
		}

		const newUser = new User({
			first_name,
			last_name,
			email,
			password: hashedPassword
		});

		const savedUser = await newUser.save();

		const { role, ...user_data } = savedUser._doc;
		return res.status(201).json({
			status: 'success',
			data: [user_data],
			message: 'Thank you for registering with us. Your account has been successfully created.'
		});
	} catch (error) {
		console.error('Error in createUser:', error);
		return res.status(500).json({
			status: 'error',
			message: 'Internal Server Error'
		});
	}
};
