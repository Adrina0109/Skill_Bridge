import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LearningPathForm from './components/LearningPathForm';
import RoadmapOutput from './components/RoadmapOutput';
import AuthPage from './components/AuthPage';
import { generateRoadmap } from './services/api';

function App() {
  const [roadmap, setRoadmap] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      setIsAuthenticated(true);
      setCurrentUser(JSON.parse(user));
    }
  }, []);


  const handleLoginSuccess = (data) => {
    setIsAuthenticated(true);
    if (data.user) {
      setCurrentUser(data.user);
    }
  };


  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setCurrentUser(null);
    setRoadmap(null);
    setError(null);
  };

  const handleGenerateRoadmap = async (formData) => {
    setIsLoading(true);
    setError(null);
    setRoadmap(null);

    try {
      const response = await generateRoadmap(formData);
      
      if (response.success && response.data) {
        setRoadmap(response.data);
      } else {
        setError('Failed to generate roadmap. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return <AuthPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar currentUser={currentUser} onLogout={handleLogout} />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
       
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-stone-900 mb-4">
            Create Your Personalized Learning Path
          </h1>
          <p className="text-xl text-stone-600 max-w-2xl mx-auto">
            Get AI-powered learning roadmaps tailored to your goals, skill level, and preferences. 
            Start your journey to mastery today.
          </p>
        </div>

        
        <div className="mb-8">
          <LearningPathForm 
            onSubmit={handleGenerateRoadmap}
            isLoading={isLoading}
          />
        </div>

        
        {(roadmap || error) && (
          <div className="mb-8">
            <RoadmapOutput 
              roadmap={roadmap}
              error={error}
            />
          </div>
        )}

        
        <div className="grid md:grid-cols-3 gap-6 mt-16">
          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-stone-800 mb-2">AI-Powered</h3>
            <p className="text-stone-600">Leverage advanced AI to create personalized learning paths</p>
          </div>
          
          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-stone-800 mb-2">Structured Learning</h3>
            <p className="text-stone-600">Step-by-step roadmap with curated resources and projects</p>
          </div>
          
          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-stone-800 mb-2">Fast & Efficient</h3>
            <p className="text-stone-600">Get your personalized learning path in seconds</p>
          </div>
        </div>
      </main>

     
      <footer className="bg-white border-t border-stone-200 mt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-stone-600">
            <p>&copy; 2024 SkillBridge. Built with React and powered by AI.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
