import React, { useState, useEffect } from 'react';
import { getAllNote, deleteNote } from '../services/operations/note2';
import { useSelector } from 'react-redux';

const MyNotes = () => {
    const { user } = useSelector((state) => state.profile);
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchNotes = async () => {
            try {
                const response = await getAllNote();

                // Check if response.Note is an array before filtering
                if (!Array.isArray(response.Note)) {
                    throw new Error('Invalid data received');
                }

                // Filter documents to only include those with the user's email
                const filteredNotes = response.Note.filter(doc => doc.email === user.email);
                setNotes(filteredNotes);
                setLoading(false);
            } catch (err) {
                setError(err.message); // Handle error by setting error state
                setLoading(false);
            }
        };

        fetchNotes();
    }, [user.email]); // useEffect dependency on user.email to refetch notes when user changes

    const handleDeleteNote = async (noteId) => {
        const confirmed = window.confirm('Are you sure you want to delete this note?');
        if (confirmed) {
            try {
                await deleteNote(noteId);
                setNotes((prevNotes) => prevNotes.filter(note => note._id !== noteId));
            } catch (err) {
                setError('Failed to delete note');
            }
        }
    };

    if (loading) {
        return <p className="text-center mt-4">Loading...</p>; // Placeholder for loading state
    }

    if (error) {
        return <p className="text-center mt-4 text-red-600">{error}</p>; // Display error message if fetching notes fails
    }

    return (
        <div className="h-full w-full bg-white overflow-auto">
            <div className="container mx-auto p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {notes.map(note => (
                        <div key={note._id} className="bg-gray-200 p-4 rounded-md shadow-md relative">
                            <button
                                className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded-md"
                                onClick={() => handleDeleteNote(note._id)}
                            >
                                Delete
                            </button>
                            <h3 className="text-lg font-bold mb-2">{note.documentName}</h3>
                            <p className="text-gray-700">{note.note}</p>
                            <p className="text-sm text-gray-500">{new Date(note.createdAt).toLocaleString()}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MyNotes;
