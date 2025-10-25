import React, { useState, useEffect } from 'react';

const LearningPathForm = ({ onSubmit, isLoading }) => {
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No authentication token found. User must login first.');
    } else {
      console.log('✅ User authenticated with token:', token.substring(0, 20) + '...');
    }
  }, []);
  const [formData, setFormData] = useState({
    skill: '',
    currentState: 'Beginner',
    duration: '',
    learningFormat: 'Video'
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.skill.trim()) {
      newErrors.skill = 'Skill is required';
    }
    
    if (!formData.duration || formData.duration <= 0) {
      newErrors.duration = 'Duration must be a positive number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const requestData = {
        goal: formData.skill,
        currentLevel: formData.currentState,
        preferences: [formData.learningFormat, `${formData.duration} days`]
      };
      
      onSubmit(requestData);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-2xl font-semibold text-stone-800 mb-6">
        Generate Your Learning Path
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
       
        <div>
          <label htmlFor="skill" className="block text-sm font-medium text-stone-700 mb-2">
            What skill do you want to learn? *
          </label>
          <input
            type="text"
            id="skill"
            name="skill"
            value={formData.skill}
            onChange={handleInputChange}
            placeholder="e.g., React Development, Data Science, Digital Marketing"
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
              errors.skill ? 'border-red-500' : 'border-stone-300'
            }`}
            disabled={isLoading}
          />
          {errors.skill && (
            <p className="mt-1 text-sm text-red-600">{errors.skill}</p>
          )}
        </div>

        <div>
          <label htmlFor="currentState" className="block text-sm font-medium text-stone-700 mb-2">
            Current Skill Level
          </label>
          <select
            id="currentState"
            name="currentState"
            value={formData.currentState}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-stone-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            disabled={isLoading}
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>

        <div>
          <label htmlFor="duration" className="block text-sm font-medium text-stone-700 mb-2">
            How many days do you have? *
          </label>
          <input
            type="number"
            id="duration"
            name="duration"
            value={formData.duration}
            onChange={handleInputChange}
            placeholder="e.g., 30, 60, 90"
            min="1"
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
              errors.duration ? 'border-red-500' : 'border-stone-300'
            }`}
            disabled={isLoading}
          />
          {errors.duration && (
            <p className="mt-1 text-sm text-red-600">{errors.duration}</p>
          )}
        </div>

        <div>
          <label htmlFor="learningFormat" className="block text-sm font-medium text-stone-700 mb-2">
            Preferred Learning Format
          </label>
          <select
            id="learningFormat"
            name="learningFormat"
            value={formData.learningFormat}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-stone-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            disabled={isLoading}
          >
            <option value="Video">Video</option>
            <option value="Data">Data</option>
            <option value="Notes">Notes</option>
          </select>
        </div>


        <div className="pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              isLoading
                ? 'bg-stone-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
            }`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating Learning Path...
              </>
            ) : (
              'Generate Learning Path'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LearningPathForm;
