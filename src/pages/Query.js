import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { addquery } from '../services/operations/query';

const Query = ({ show, onClose, onSubmit, email, initialDocumentName }) => {
    const [query, setQuery] = useState('');
    const [documentName, setDocumentName] = useState(initialDocumentName || '');
  //  const [userEmail, setUserEmail] = useState('');
    const { user } = useSelector((state) => state.profile);
    
    const userEmail=user.email;
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(query, email, documentName, userEmail);
        addquery({ query, email, documentName, userEmail }); // Pass userEmail to the addquery function
        setQuery('');
         // Clear userEmail after submission
    };

    if (!show) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-10 bg-gray-900 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-lg font-semibold text-blue-600 mb-4">Send Query</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Document Name:</label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            value={documentName}
                            onChange={(e) => setDocumentName(e.target.value)}
                            required
                        />
                    </div>
                    
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Query:</label>
                        <textarea
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            rows="4"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            required
                        />
                    </div>
                    
                    <div className="flex justify-end space-x-2">
                        <button
                            type="button"
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                            Send
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Query;
