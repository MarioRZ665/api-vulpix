let express = require('express');
let router = express.Router();
let modelController = require('../controllers/modelController');
let auth = require('../controllers/auth');
const { check, validationResult } = require('express-validator');
const Validate = require('../middleware/validate'); 

const registrationValidationRules = [
  check('email').isEmail().withMessage('Enter a valid email address').normalizeEmail(),
  check('first_name').not().isEmpty().withMessage('You first name is required').trim().escape(),
  check('last_name').not().isEmpty().withMessage('You last name is required').trim().escape(),check('password').notEmpty().isLength({ min: 8 }).withMessage('Must be at least 8 chars long'),
  ];

// Método POST
router.post('/post', modelController.createData);
// Método GET para obtener todos
router.get('/getAll', modelController.getAllData);
// Método GET para obtener por ID
router.get('/getOne/:id', modelController.getDataById);
// Método PATCH para actualizar por ID
router.patch('/update/:id', modelController.updateDataById);
// Método DELETE para eliminar por ID
router.delete('/delete/:id', modelController.deleteDataById);

//Login and register
// Define the route
router.post('/register', Validate, registrationValidationRules, (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    } 
    // If validation passes, continue with the request handling
    // Call the createUser function from the auth module
    auth.createUser(req, res); // Assuming createUser handles user creation logic
  });


module.exports = router;


