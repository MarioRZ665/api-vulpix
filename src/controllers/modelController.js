const Model = require('../models/model');

// Controller para manejar solicitudes POST
exports.createData = async (req, res) => {
    const data = new Model({
        name: req.body.name,
        age: req.body.age
    });

    try {
        const dataToSave = await data.save();
        res.status(200).json(dataToSave);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Controller para manejar solicitudes GET para recuperar todos los documentos
exports.getAllData = async (req, res) => {
    try {
        const data = await Model.find();
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Controller para manejar solicitudes GET para recuperar un solo documento por ID
exports.getDataById = async (req, res) => {
    try {
        const data = await Model.findById(req.params.id);
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Controller para manejar solicitudes PATCH para actualizar un documento por ID
exports.updateDataById = async (req, res) => {
    try {
        const id = req.params.id;
        const updatedData = req.body;
        const options = { new: true };

        const result = await Model.findByIdAndUpdate(id, updatedData, options);

        res.send(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Controller para manejar solicitudes DELETE para eliminar un documento por ID
exports.deleteDataById = async (req, res) => {
    try {
        const id = req.params.id;
        const data = await Model.findByIdAndDelete(id);
        res.send(`Documento con ${data.name} ha sido eliminado.`);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
