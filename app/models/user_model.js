var mongoose = require('mongoose');

var UserSchema = mongoose.Schema({
    name: String,
    email: String,
    password: String,
    phone: String,
    token: String
}, {
    timestamps: true
});

module.exports = mongoose.model('User', UserSchema);
