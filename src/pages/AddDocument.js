import React, { useState } from 'react';
import { useDispatch,useSelector } from 'react-redux';
import {addDocument} from "../services/operations/document"

const AddDocument = () => {
  const [formData, setFormData] = useState({
    documentName: '',
    description: '',
    whatWeWillLearn: '',
    category: '',
    instructions: ''
  });
 const dispatch=useDispatch()
 //const { user } = useSelector((state) => state.profile)

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you can handle form submission, e.g., send data to backend or perform validation
  //  console.log(formData);
    // Reset form fields after submission if needed
    const {documentName,
    description,
    whatWeWillLearn,
    category,
    instructions}=formData;


    addDocument({documentName,
    description,
    whatWeWillLearn,
    category,
    instructions
  })

    setFormData({
      documentName: '',
      description: '',
      whatWeWillLearn: '',
      category: '',
      instructions: ''
    });
  };

  return (
    <div>
      <h2 className="text-3xl text-center text-yellow-500 mb-6">Add Document</h2>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        <div className="mb-4">
          <label htmlFor="documentName" className="block mb-1 text-yellow-500">Document Name</label>
          <input
            type="text"
            id="documentName"
            name="documentName"
            value={formData.documentName}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block mb-1 text-yellow-500">Description</label>
          <input
            type="text"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="whatWeWillLearn" className="block mb-1 text-yellow-500">What We Will Learn</label>
          <input
            type="text"
            id="whatWeWillLearn"
            name="whatWeWillLearn"
            value={formData.whatWeWillLearn}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="category" className="block mb-1 text-yellow-500">Category</label>
          <input
            type="text"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="instructions" className="block mb-1 text-yellow-500">Instructions</label>
          <textarea
            id="instructions"
            name="instructions"
            value={formData.instructions}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 h-60"
            rows="4"
            required
          ></textarea>
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">Submit</button>
      </form>
    </div>
  );
};

export default AddDocument;
