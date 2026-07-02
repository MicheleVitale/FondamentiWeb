const express = require ('express');
const mongoose = require ('mongoose');
const cors = require ('cors');

require('dotenv').config();


const authRoutes = require('./routes/authRoutes');
const jobRoutes = require('./routes/jobRoutes');


const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);

mongoose.connect(process.env.MONGODB_URI)
.then (() => console.log('Connesso al DataBase'))
.catch ((err) => console.log('Qualcosa è andato storto'))

const PORT = process.env.PORT || 3000; 
app.listen(PORT, () => {
    console.log("Server attivo sulla porta: " + PORT)
})

