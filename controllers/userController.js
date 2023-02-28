var User = require('../models/user.js');
var Message = require('../models/message.js');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

const passwords = {
	member: process.env.memberCode || '123456',
	admin: process.env.adminCode || '123456',
};

exports.user_create_get = (req, res) => {
	res.render('signup_form', { title: 'Sign Up', user: req.user });
};

exports.user_create_post = [
	body('username', 'Username required')
		.trim()
		.isLength({ min: 6, max: 18 })
		.withMessage(
			'Username must be at least 6 characters and at most 18 characters'
		)
		.escape(),
	body('password', 'Password required')
		.trim()
		.isLength({ min: 6, max: 18 })
		.withMessage(
			'Password must be at least 6 characters and at most 18 characters'
		)
		.escape(),
	body('confirm_password')
		.trim()
		.escape()
		.custom((value, { req }) => value === req.body.password)
		.withMessage('Password does not match confirm password'),
	body('first_name', 'First name required')
		.trim()
		.isLength({ min: 1 })
		.escape(),
	body('last_name', 'Last name required').trim().isLength({ min: 1 }).escape(),

	async (req, res, next) => {
		const errors = validationResult(req);

		const hash = await bcrypt.hash(req.body.password, 10);

		var user = new User({
			username: req.body.username,
			password: hash,
			first_name: req.body.first_name,
			last_name: req.body.last_name,
			avatar: req.body.avatar,
			is_admin: req.body.is_admin,
		});

		if (!errors.isEmpty()) {
			res.render('signup_form', {
				title: 'Sign Up',
				user: user,
				errors: errors.array(),
			});
			return;
		} else {
			User.findOne({ username: req.body.username }).exec((err, found_user) => {
				if (err) return next(err);

				if (found_user) {
					res.render('message', {
						msg: 'User already exists',
						type: 'danger',
						user: req.user,
					});
				} else {
					user.save(err => {
						if (err) return next(err);

						res.redirect('/login');
					});
				}
			});
		}
	},
];

exports.user_update_membership = [
	body('member_code', 'Code required')
		.trim()
		.isLength({ min: 6, max: 6 })
		.withMessage('Enter the 6-character code')
		.escape(),

	(req, res, next) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			res.render('membership_form', {
				title: 'Join Membership',
				errors: errors.array(),
				user: req.user,
			});
			return;
		} else {
			if (req.body.member_code === passwords.member) {
				User.findByIdAndUpdate(req.user._id, { membership: true }, {}, err => {
					if (err) return next(err);

					res.render('message', {
						title: 'Join Membership',
						msg: 'Successfully joined as member',
						type: 'success',
						user: req.user,
					});
				});
			} else {
				res.render('message', {
					title: 'Join Membership',
					msg: 'You have entered the wrong code',
					type: 'danger',
					user: req.user,
				});
			}
		}
	},
];
