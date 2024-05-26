import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getAllDocuments } from '../services/operations/document';
import { useSelector } from 'react-redux';
const MyDoc = () => {
    const {user} =useSelector((state)=>state.profile );
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showInstructions, setShowInstructions] = useState(false);
    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                const response = await getAllDocuments();
                // Filter documents to only include those with category "Explore Universe"
                const filteredDocuments = response.filter(doc => doc.email === user.email);
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

    return (
        <div className="container mx-auto bg-white p-6 min-h-screen">
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
                        <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded" onClick={handleCloseInstructions}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MyDoc;
