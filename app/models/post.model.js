var mongoose = require('mongoose');

var PostSchema = mongoose.Schema({
    title: String,
    subtitle: String,
    postedBy: String,
    likesCount: Number,
    likedBy: Array
}, {
    timestamps: true
});

module.exports = mongoose.model('post', PostSchema);
