let dotenv = require('dotenv').config();
let config = require('config');
let cors = require('cors');
let express = require('express');
let mongoose = require('mongoose');
let cookieParser = require ('cookie-parser');
const portConect = config.Customer.dbConfig.port;
// Establece el valor de la URL de la base de datos
let DATABASE_URL = process.env.DATABASE_URL || config.Customer.dbConfig.DATABASE_URL;
// Conecta a la base de datos MongoDB
mongoose.connect(DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
.then(console.log('Connected to database :P'))
.catch((err) => console.log(err));

// Captura los eventos de conexión y error de la base de datos
let database = mongoose.connection;
database.on('error', (error) => console.error('Database connection error:', error));
database.once('connected', () => console.log('Database connected successfully'));

// Crea una instancia de la aplicación Express
let server = express();

// Middleware para habilitar CORS y el manejo de datos JSON
server.use(cors());
server.use(cors());
server.disable('x-powered-by'); //Reduce fingerprinting
server.use(cookieParser());
server.use(express.urlencoded({ extended: false }));
server.use(express.json());
server.use(express.json());


// Importa las rutas del archivo de rutas
let routes = require('./src/routes/routes');

// Usa el enrutador en la ruta '/api'
server.use('/api', routes);

// Inicia el servidor en el puerto especificado en la configuración
let PORT = process.env.PORT || portConect;
server.listen(PORT, () => console.log(`Server started at port ${portConect}`));
