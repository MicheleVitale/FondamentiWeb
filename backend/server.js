const express = require ('express');
const mongoose = require ('mongoose');
const cors = require ('cors');

require('dotenv').config();

// Importazioni Swagger
const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

const authRoutes = require('./routes/authRoutes');
const jobRoutes = require('./routes/jobRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Configurazione Swagger
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Jobby API',
            version: '1.0.0',
            description: 'Documentazione delle API backend per il progetto Jobby',
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [{ bearerAuth: [] }],
    },
    // NOTA: il percorso punta alla cartella routes
    apis: ['./routes/*.js'], 
};

// Inizializzazione di Swagger UI all'endpoint /api-docs
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);

mongoose.connect(process.env.MONGODB_URI)
.then (() => console.log('Connesso al DataBase'))
.catch ((err) => console.log('Qualcosa è andato storto'))

const PORT = process.env.PORT || 3000; 
app.listen(PORT, () => {
    console.log("Server attivo sulla porta: " + PORT)
})


// http://localhost:3000/api-docs