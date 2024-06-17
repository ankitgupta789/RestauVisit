import React, { useEffect, useState } from 'react';
import { getAllDocuments } from '../services/operations/document';
import Query from './Query'; // Import the Query component
import Note from './Note';
const ExploreUniverse = () => {
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showInstructions, setShowInstructions] = useState(false);
    const [showQueryModal, setShowQueryModal] = useState(false);
    const [selectedEmail, setSelectedEmail] = useState(''); // State to manage selected email
    const [showNoteSection, setShowNoteSection] = useState(false); // State for showing note section
  //  const [selectedEmail, setSelectedEmail] = useState(''); // State to manage selected email
    const [noteContent, setNoteContent] = useState(''); // State for note content

    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                const response = await getAllDocuments();
                // Filter documents to only include those with category "Explore Universe"
                const filteredDocuments = response.filter(doc => doc.category === "Explore Universe");
                setDocuments(filteredDocuments);
                console.log('Filtered documents: ', filteredDocuments);
                setLoading(false);
            } catch (err) {
                setError(err);
                setLoading(false);
            }
        };

        fetchDocuments();
    }, []);

    const handleClick = (index) => {
        setSelectedDocument(index);
        setShowInstructions(true);
    };

    const handleCloseInstructions = () => {
        setSelectedDocument(null);
        setShowInstructions(false);
    };

    const handleSendQuery = () => {
        if (selectedDocument !== null) {
            setSelectedEmail(documents[selectedDocument].email); // Set the selected email
            setShowQueryModal(true); // Show the query modal when Send Query button is clicked
        }
    };

    const handleCloseQueryModal = () => {
        setShowQueryModal(false); // Close the query modal
    };

    const handleQuerySubmit = (query, email) => {
        console.log('Query:', query);
        console.log('Email:', email);
        setShowQueryModal(false);
        // Handle the actual query submission logic here (e.g., send to server)
    };
    const handleSaveNote = () => {
        //setShowQueryModal(false); // Close the query modal
        setShowNoteSection(false);
    };

    return (
        <div className=" relative container mx-auto bg-white p-6 min-h-screen">
            {loading && <p className="text-center text-xl">Loading...</p>}
            {error && <p className="text-center text-xl text-red-500">Error: {error.message}</p>}
            {!loading && !error && documents.length > 0 && (
                <div className="grid grid-cols-3 gap-4">
                    {documents.map((doc, index) => (
                        <div
                            key={index}
                            className="bg-gray-200 rounded-lg p-4 cursor-pointer border border-gray-300 shadow-md hover:shadow-lg transition-shadow duration-300 transform hover:scale-105 hover:bg-blue-100"
                            onClick={() => handleClick(index)}
                        >
                            <h2 className="text-lg font-semibold text-blue-600 mb-2">Document {index + 1}: {doc.documentName}</h2>
                            <p className="text-gray-700">{doc.whatWeWillLearn}</p>
                        </div>
                    ))}
                </div>
            )}
            {selectedDocument !== null && showInstructions && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
                    <div className="bg-white rounded-lg p-6 overflow-y-auto max-h-[80vh] max-w-[80vw] border border-gray-300 shadow-md">
                        <h2 className="text-lg font-semibold text-blue-600 mb-2">Document Instructions</h2>
                        <textarea
                            readOnly
                            value={documents[selectedDocument].instructions}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4 resize-none"
                            rows={18}
                            cols={120}
                        />
                        <div className="flex justify-between space-x-2">
                            <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={handleCloseInstructions}>Close</button>
                            <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={handleSendQuery}>Send Query</button>
                            <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={() => setShowNoteSection(true)}>Add Note</button>
                        </div>
                        
                    </div>
                </div>
            )}
            {showQueryModal && (
                <Query
                    show={showQueryModal}
                    onClose={handleCloseQueryModal}
                    onSubmit={handleQuerySubmit}
                    email={selectedEmail} // Pass the selected email to the Query component
                />
            )}
            <div className="absolute bg-white border border-gray-300 rounded-lg p-4 shadow-md" style={{ bottom: '80px', right: '20px' }}>
            {showNoteSection && (
                <Note
                    show={showNoteSection}
                    onClose={() => setShowNoteSection(false)}
                    onSave={handleSaveNote}
                    documentName={documents[selectedDocument].documentName}
                />
            )}
            </div>
              
        </div>
    );
};

export default ExploreUniverse;
