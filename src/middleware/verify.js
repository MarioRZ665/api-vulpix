
const User = require('../models/User');
const jwt = require('jsonwebtoken');


exports.Verify = async (req, res, next) => {
	try {
		const authHeader = req.headers['cookie']; // get the session cookie from request header
		if (!authHeader) return res.sendStatus(401); // if there is no cookie from request header, send an unauthorized response.
		const cookie = authHeader.split('=')[1];
		const accessToken = cookie.split(";")[0];
		const checkIfBlacklisted = await Blacklist.findOne({ token: accessToken }); // Check if that token is blacklisted
		// if true, send an unathorized message, asking for a re-authentication.
		if (checkIfBlacklisted)
			return res
				.status(401)
				.json({ message: "This session has expired. Please login" });
		jwt.verify(cookie, process.env.SECRET_ACCESS_TOKEN, async (err, decoded) => {
			if (err) {
				// if token has been altered or has expired, return an unauthorized error
				return res.status(401)
					.json({ message: 'This session has expired. Please login' });;
			}
			const { _id } = decoded; // get user id from the decoded token
			const user = await User.findById(_id); // find user by that `id`
			const { password, ...data } = user._doc; // return user object without the password
			req.user = data; // put the data object into req.user
			next();
		});
	} catch (err) {
		res.status(500).json({
			status: 'error',
			code: 500,
			data: [],
			message: 'Internal Server Error',
		});
	}

}


exports.VerifyRole = async (req, res, next) => {
	try {
		const user = req.user; // we have access to the user object from the request
		const { role } = user; // extract the user role
		// check if user has no advance privileges
		// return an unathorized response
		if (role !== '0x88') {
			return res.status(401).json({
				status: 'failed',
				message: 'You are not authorized to view this page.',
			});
		}
		next(); // continue to the next middleware or function
	} catch (err) {
		res.status(500).json({
			status: 'error',
			code: 500,
			data: [],
			message: 'Internal Server Error',
		});
	}
}
