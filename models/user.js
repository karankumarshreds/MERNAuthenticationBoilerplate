const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {type: String},
    email: {type: String, unique: true, required: true},
    password: {type: String, minlength: 5, required: true}
});

module.exports = mongoose.model('User', userSchema);
