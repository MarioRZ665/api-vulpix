let express = require('express');
let router = express.Router();
let modelController = require('../controllers/modelController');
let auth = require('../controllers/auth');
let Login = require('../controllers/login');
const { check, validationResult } = require('express-validator');
const Validate = require('../middleware/validate');
const { Verify,VerifyRole } = require('../middleware/verify'); // Importar la función Verify del middleware de autenticación

const registrationValidationRules = [
	check('email').isEmail().withMessage('Enter a valid email address').normalizeEmail(),
	check('first_name').not().isEmpty().withMessage('You first name is required').trim().escape(),
	check('last_name').not().isEmpty().withMessage('You last name is required').trim().escape(), check('password').notEmpty().isLength({ min: 8 }).withMessage('Must be at least 8 chars long'),
];

const loginRules = [
	check('email').isEmail().withMessage('Enter a valid email address').normalizeEmail(),
	check('password').not().isEmpty(),
];
// Método POST
router.post('/post', Verify,modelController.createData);
// Método GET para obtener todos
router.get('/getAll', Verify,modelController.getAllData);
// Método GET para obtener por ID
router.get('/getOne/:id',Verify, modelController.getDataById);
// Método PATCH para actualizar por ID
router.patch('/update/:id', Verify ,modelController.updateDataById);
// Método DELETE para eliminar por ID
router.delete('/delete/:id', Verify,modelController.deleteDataById);

router.post('/register', Validate, registrationValidationRules, (req, res) => {
	// Check for validation errors
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}
	auth.createUser(req, res);
});

router.post('/login', Validate, loginRules, (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}
	Login.loginUser(req, res);
});

router.get('/protected', Verify, (req, res) => { 
	res.status(200).json({
		status: 'success',
		message: 'Welcome to the your Dashboard!',
	  });
});

router.get('/admin', Verify, VerifyRole, (req, res) => { 
	res.status(200).json({
		status: 'success',
		message: 'Welcome to the your Dashboard!',
	  });
});
router.get('/logout', auth.Logout);
module.exports = router;


