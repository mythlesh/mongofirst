module.exports = function (app) {

    var notes = require('../controllers/note.controller.js');

    // Create a new Note
    app.post('/createNote', notes.create);

    // Retrieve all Notes
    app.get('/getAllNotes', notes.findAll);

    // Retrieve a single Note with noteId
    app.get('/readNote/:noteId', notes.findOne);

    // Update a Note with noteId
    app.put('/updateNote/:noteId', notes.update);

    // Delete a Note with noteId
    app.delete('/deleteNote/:noteId', notes.delete);
}