const mongoose = require ('mongoose');
const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    }, 
    description: {
        type: String, 
        required: true
    }, 
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required: true
    },
    // Aggiungo applicants in modo da controllare gli utenti che si candidano
    applicants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
})

module.exports = mongoose.model('Job', jobSchema);