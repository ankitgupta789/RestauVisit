import React, { useEffect, useState } from 'react';
import { getAllQuery } from '../services/operations/query';
import { useSelector } from 'react-redux';
import { deleteQuery } from '../services/operations/query';
const MyQueries = () => {
    const [queries, setQueries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedQueryIndex, setExpandedQueryIndex] = useState(null);
    const { user } = useSelector((state) => state.profile);

    useEffect(() => {
        const fetchQueries = async () => {
            try {
                const response = await getAllQuery();
                console.log("API Response:", response);

                // Assuming the response is an object with a Query property that is an array
                if (response && Array.isArray(response.Query)) {
                    // Apply filter to queries based on user's email
                    const filteredQueries = response.Query.filter(query => query.email === user.email);
                    setQueries(filteredQueries);
                } else {
                    console.error("Unexpected response structure:", response);
                }

                setLoading(false);
            } catch (err) {
                setError(err);
                setLoading(false);
            }
        };

        fetchQueries();
    }, [user.email]); // Add user.email to the dependencies array to trigger useEffect when user's email changes

    const toggleQueryVisibility = (index) => {
        setExpandedQueryIndex((prevIndex) => (prevIndex === index ? null : index));
    };
    const handleDelete = async (queryId,Email) => {
        const result = await deleteQuery(queryId,Email); // Pass userEmail here
        if (result) {
            setQueries((prevQueries) => prevQueries.filter(query => query._id !== queryId));
        }
    };
    
    return (
        <div className="container mx-auto bg-white p-6 min-h-screen">
            {loading && <p className="text-center text-xl">Loading...</p>}
            {error && <p className="text-center text-xl text-red-500">Error: {error.message}</p>}
            {!loading && !error && Array.isArray(queries) && queries.length > 0 && (
                <div className="max-h-[75vh] overflow-y-auto">
                    <div className="grid grid-cols-1 gap-4">
                        {queries.map((query, index) => (
                            <div
                                key={index}
                                className="bg-gray-200 rounded-lg p-4 border border-gray-300 shadow-md"
                            >
                                <h2 className="text-lg font-semibold text-blue-600 mb-2">Query {index + 1}</h2>
                                <button
                                    className="text-blue-600 underline mb-2"
                                    onClick={() => toggleQueryVisibility(index)}
                                >
                                    Toggle Query
                                </button>
                                {expandedQueryIndex === index && (
                                    <div className="mb-2">
                                        <p className="text-gray-700"><strong>Document Name:</strong> {query.documentName}</p>
                                        <p className="text-gray-700"><strong>Query:</strong> {query.query}</p>
                                        <p className="text-gray-700"><strong>Submitted At:</strong> {new Date(query.createdAt).toLocaleString()}</p>
                                        <p className="text-gray-700"><strong>Submitted By:</strong> {query.userEmail}</p>
                                        <button className="text-red-600 underline" onClick={() => handleDelete(query._id,query.userEmail)}>Delete</button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {!loading && !error && Array.isArray(queries) && queries.length === 0 && (
                <p className="text-center text-xl">No queries found.</p>
            )}
        </div>
    );
};

export default MyQueries;
