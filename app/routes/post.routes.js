module.exports = function (app) {

    var posts = require('../controllers/post.controller.js');

    // Create a new Note
    app.post('/createPost', posts.create);
    //fetch posts
    app.get('/getPosts', posts.getPosts);
    //like post
    app.get('/likePost/:postId', posts.likePost);
    //delete post
    app.get('/deletePost/:postId', posts.deletePost);
}
