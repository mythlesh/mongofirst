module.exports = function (app) {

    var users = require('../controllers/user_controller.js');

    // Create a new Note
    app.post('/createUser', users.create);

    app.post('/login', users.login);

    app.patch('/changePassword', users.changePassword);

    app.get('/getUser', users.getUser);
}