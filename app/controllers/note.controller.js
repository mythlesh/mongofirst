var Note = require('../models/note.model.js');

exports.create = async function (req, res) {
    try {
        if (!req.body.title) {
            res.status(400).send({ message: "Notes title can not be empty" });
        }
        if (!req.body.content) {
            res.status(400).send({ message: "Note can not be empty" });
        }
        var note = await Note.create({ title: req.body.title || "Untitled Note", content: req.body.content });
        if (!note) {
            return res.status(404).send({
                success: false,
                message: "Unable to create Note!"
            });
        }
        res.send({
            success: true,
            notes: note,
            message: "Notes Created successfully!"
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "An error occurred while Created the notes.",
            error: error.message
        });
    }

};

exports.findAll = async function (req, res) {
    // Retrieve and return all notes from the database.
    try {
        let notes = await Note.find();
        if (!notes) {
            return res.status(404).send({
                success: false,
                message: "Notes not found!"
            });
        }
        res.send({
            success: true,
            notes: notes,
            message: "Notes Found successfully!"
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "An error occurred while Finding the notes.",
            error: error.message
        });
    }
};

exports.findOne = async function (req, res) {
    try {
        let note = await Note.findOne({ _id: req.params.noteId });
        if (!note) {
            return res.status(404).send({
                success: false,
                message: "Note not found!"
            });
        }
        res.send({
            success: true,
            note: note,
            message: "Note Found successfully!"
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "An error occurred while Finding the note.",
            error: error.message
        });
    }
};

exports.update = async function (req, res) {
    try {
        let note = await Note.findOneAndUpdate(
            { _id: req.params.noteId }, { title: req.body.title, content: req.body.content }, { new: true }
        );
        if (!note) {
            return res.status(404).send({
                success: false,
                message: "Note not found!"
            });
        }
        res.send({
            success: true,
            note: note,
            message: "Note Updated successfully!"
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "An error occurred while updating the note.",
            error: error.message
        });
    }
};

exports.delete = async function (req, res) {
    try {
        const note = await Note.findOneAndDelete({ _id: req.params.noteId });
        if (!note) {
            return res.status(404).send({
                success: false,
                message: "Note not found!"
            });
        }
        res.send({
            success: true,
            deletedNote: note,
            message: "Note deleted successfully!"
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "An error occurred while deleting the note.",
            error: error.message
        });
    }
};

