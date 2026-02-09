import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateTicket = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({state:false, message:""});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleError = (message)=>{
    setError({state:true, message});
    setTimeout(() => {
      setError({state:false, message:""})
    }, 3000);
  }
  
  const validateForm = () => {
    
    if (!formData.title.trim()) {
        handleError('Title is required');
        return false;
    } else if (formData.title.length < 3) {
        handleError('Title must be at least 3 characters'); 
        return false; 
    } else if (formData.title.length > 100) {
        handleError('Title cannot exceed 100 characters');
        return false;
    }
    
    if (!formData.description.trim()) {
        handleError('Description is required');
        return false;
    
    } else if (formData.description.length < 10) {
        handleError('Description must be at least 10 characters');
        return false;
      
    } else if (formData.description.length > 500) {
        handleError('Description cannot exceed 500 characters');
        return false;
    }
    return true;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const isNoErrors = validateForm();
    setLoading(true);
    
    if (isNoErrors) {

        try{
            const res = await fetch(`${import.meta.env.VITE_URL}/api/tickets`, {
                method : "POST",
                headers: {
                    "Authorization" : `Bearer ${token}`,
                    "Content-type" : "application/json"
                },
                body: JSON.stringify(formData)
            });

            if(res.ok){
                setIsSubmitted(true);
                setTimeout(() => {
                    setIsSubmitted(false);
                    setFormData({ title: '', description: '' });
                    navigate("/");
                }, 2000);
            }else{
              handleError("Failed to create new ticket");
            }

        }catch(error){
            handleError("Failed to create new ticket");
        }finally{
            setLoading(false);
        }
    }
  };
  
  const handleReset = () => {
    setFormData({ title: '', description: '' });
    setError(false);
    setIsSubmitted(false);
  };
  
  const charCount = formData.description.length;
  const maxChars = 500;
  
  return (
    <div className="min-h-screen relative bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      
        {
            error.state && (
            <div className='absolute bottom-6 right-6 bg-white shadow-lg border-l-4 border-red-500 rounded-lg px-4 py-4 z-10'>
                <p className='text-red-900 font-semibold'>
                {error.message}
                </p>
            </div>
            )
        }

      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Create New Ticket
          </h2>
          <p className="mt-2 text-lg text-gray-600">
            Fill in the details below to create new ticket
          </p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="px-6 py-8 sm:p-10">
            {isSubmitted ? (
              <div className="text-center py-10">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                  <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Successfully Submitted!</h3>
                <p className="text-gray-600">Your Ticket has been created successfully.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title Field */}
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    
                    <input
                      id="title"
                      name="title"
                      type="text"
                      value={formData.title}
                      onChange={handleChange}
                      className={`block w-full pl-10 pr-4 py-3 border rounded-xl shadow-sm focus:ring-2 focus:ring-offset-1 focus:outline-none transition-all ${error.message ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'}`}
                      placeholder="Enter a descriptive title"
                    />
                  </div>
                
                  <div className="mt-1 text-xs text-gray-500 flex justify-between">
                    <span>Keep it concise and clear</span>
                    <span>{formData.title.length}/100</span>
                  </div>
                </div>
                
                {/* Description Field */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    
                    <textarea
                      id="description"
                      name="description"
                      rows="6"
                      value={formData.description}
                      onChange={handleChange}
                      className={`block w-full pl-10 pr-4 py-3 border rounded-xl shadow-sm focus:ring-2 focus:ring-offset-1 focus:outline-none transition-all resize-none ${error.state ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'}`}
                      placeholder="Provide a detailed description..."
                    />
                  </div>
                  
                  <div className="mt-1 text-xs text-gray-500 flex justify-between">
                    <span>Be specific and detailed</span>
                    <span className={charCount > maxChars ? 'text-red-500' : ''}>
                      {charCount}/{maxChars}
                    </span>
                  </div>
                </div>
                
                {/* Form Actions */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="flex-1 inline-flex justify-center items-center px-6 py-3 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all"
                  >
                    <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                    </svg>
                    Reset
                  </button>
                  <button
                    type="submit"
                    className="flex-1 inline-flex justify-center items-center px-6 py-3 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
                  >
                    <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Submit
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTicket;