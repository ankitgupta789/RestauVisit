// Note.js
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { addnote } from "../services/operations/note2"
const Note = ({ show, onClose, onSave, documentName }) => {
    const [note, setNote] = useState('');
    const { user } = useSelector((state) => state.profile);
    const email=user.email;
    const handleSaveNote = () => {
        //console.log("hello");
      //  console.log("printing data",note,email,documentName);
        addnote(note,email,documentName);
        setNote('');
    };

    if (!show) {
        return null;
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div className="bg-white rounded-lg p-6 overflow-y-auto max-h-[80vh] max-w-[80vw] border border-gray-300 shadow-md">
                <h2 className="text-lg font-semibold text-blue-600 mb-2">Add Note</h2>
                <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4 resize-none"
                    rows={6}
                    placeholder="Write your note here..."
                />
                <div className="flex justify-between space-x-2">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={onClose}>Close</button>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={handleSaveNote}>Save Note</button>
                </div>
            </div>
        </div>
    )
}

export default Note;
