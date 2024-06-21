const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: { type: String, unique: true },
    age: Number,
    password: String,
    role: { type: String, enum: ['regular', 'premium'], default: 'regular' },
    documents: [
        {
            name: String,
            reference: String
        }
    ],
    last_connection: Date
});

module.exports = mongoose.models.User || mongoose.model('User', userSchema);