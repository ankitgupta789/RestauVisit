import React, { useState,useEffect } from 'react';
import { useDispatch,useSelector } from 'react-redux';
import {addDocument} from "../services/operations/document"

const AddDocument = () => {
  const {user} =useSelector((state)=>state.profile );
  const email=user.email;
  useEffect(() => {
    const popupTextarea = document.getElementById('popupTextarea');
    if (popupTextarea) {
      popupTextarea.value = formData.instructions;
    }
  }, []); // Empty dependency array ensures that the effect runs only once after the initial render
  
  const [formData, setFormData] = useState({
    documentName: '',

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
  const handleChangePopupTextarea = (e) => {
    const { value } = e.target;
    setFormData({ ...formData, instructions: value });
  };
  const [showPopup, setShowPopup] = useState(false);
  const handleOpenPopup = () => {
    setShowPopup(true);
  };

  // Function to handle closing the popup
  const handleClosePopup = () => {
    // Get the content of the textarea inside the popup
    const popupContent = document.getElementById('popupTextarea').value;
    
    // Update the instructions value in the formData state with the popup content
    setFormData({ ...formData, instructions: popupContent });
  
    // Close the popup
    setShowPopup(false);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you can handle form submission, e.g., send data to backend or perform validation
  //  console.log(formData);
    // Reset form fields after submission if needed
    const {documentName,
    whatWeWillLearn,
    category,
    instructions}=formData;


    addDocument({documentName,
    whatWeWillLearn,
    category,
    instructions,
    email
  })

    setFormData({
      documentName: '',
      
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
            onFocus={() => {
              handleOpenPopup();
              const popupTextarea = document.getElementById('popupTextarea');
              if (popupTextarea) {
                popupTextarea.value = formData.instructions;
              }
            }}
            className="w-full border border-gray-300 rounded-md px-3 py-2 h-60"
            rows="4"
            required
          ></textarea>
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">Submit</button>
      </form>
      {/* Popup for entering large text */}
      {showPopup && (
  <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
    <div className="bg-white rounded-lg p-6 overflow-y-auto max-h-[80vh] max-w-[80vw]">
      <h2 className="text-lg font-semibold text-blue-600 mb-2">Enter Instructions</h2>
      <textarea
        id="popupTextarea"
        value={formData.instructions} // Set the value of the textarea to the instructions from formData
        onChange={handleChangePopupTextarea} // Add onChange handler if needed
        className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4 resize-none"
        rows={18} // Set the number of rows
        cols={120} // Set the number of columns
      />
      <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded" onClick={handleClosePopup}>Close</button>
    </div>
  </div>
)}
    </div>
  );
};

export default AddDocument;
