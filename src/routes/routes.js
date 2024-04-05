let express = require('express');
let router = express.Router();
let modelController = require('../controllers/modelController');

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


module.exports = router;


