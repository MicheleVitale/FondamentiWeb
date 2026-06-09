const express = require ('express');
const mongoose = require ('mongoose');
const cors = require ('cors');

require('dotenv').config();

const app = express();
app.use(cors());


app.use(express.json());



mongoose.connect(process.env.MONGODB_URI)
.then (() => console.log('Connesso al DataBase'))
.catch ((err) => console.log('Qualcosa è andato storto'))

const PORT = process.env.PORT || 3000; 
app.listen(PORT, () => {
    console.log("Server attivo sulla porta:" + PORT)
})

