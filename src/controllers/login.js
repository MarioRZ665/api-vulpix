const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
exports.loginUser = async (req, res) => {
	const { email, password } = req.body;
	try {
		const user = await User.findOne({ email }).select('+password');
		if (!user)
			return res.status(401).json({
				status: 'failed',
				data: [],
				message: 'Invalid email or password. Please try again with the correct credentials.',
			});

		const isPasswordValid = bcrypt.compare(`${req.body.password}`, user.password,);
		if (!isPasswordValid)
			return res.status(401).json({
				status: 'failed',
				data: [],
				message:
					'Invalid email or password. Please try again with the correct credentials.',
			});

		const token = jwt.sign(
			{ _id: user._id, email: user.email },
			process.env.SECRET_ACCESS_TOKEN,
			{ expiresIn: '1h' } // Token expiration time
		);


		let options = {
			maxAge: 20 * 60 * 1000, // would expire in 20minutes
			httpOnly: true, // The cookie is only accessible by the web server
			secure: true,
			sameSite: 'None',
		};

		res.cookie('SessionID', token, options); // set the token to response header, so that the client sends it back on each subsequent request
		res.status(200).json({
		  status: 'success',
		  message: 'You have successfully logged in.',
		});
		
		/*const { password, ...user_data } = user._doc;
		res.status(200).json({
			status: 'success',
			data: [user_data],
			message: 'You have successfully logged in.',
		});*/
	} catch (err) {
		res.status(500).json({
			status: 'error',
			code: 500,
			data: [],
			message: 'Internal Server Error',
		});
	}
}
