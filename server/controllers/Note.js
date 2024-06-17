const Note = require("../models/Note");

exports.createNote = async (req, res) => {
    const { note,email,documentName } = req.body;
    

    try {
        console.log("hello2");
        const newNote = await Note.create({
            note,email,documentName
        });
        
        
        console.log(newNote);
      
        return res.status(200).json({
            success: true,
            data: newNote,
            message: "newNote Created Successfully",
        });
    } catch (error) {
        // Handle any errors that occur during the creation of the Note
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to create Note",
            error: error.message,
        });
    }
};
exports.getAllNote = async (req, res) => {
    try {
        // Fetch all feedback from the database
        const allNote = await Note.find();

        res.status(200).json({ Note: allNote });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};
exports.deleteNote = async (req, res) => {
    try {
        const { noteId } = req.params;
        // Find the query by ID and delete it
        const deletedNote = await Note.findByIdAndDelete(noteId);
        console.log("printing noteid",noteId);
        if (!deletedNote) {
            return res.status(404).json({
                success: false,
                message: "Note not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Note deleted successfully",
        });
    } catch (error) {
        // Handle any errors that occur during the deletion of the note
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete note",
            error: error.message,
        });
    }
};
