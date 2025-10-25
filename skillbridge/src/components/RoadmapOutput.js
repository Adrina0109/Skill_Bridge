import React from 'react';

const RoadmapOutput = ({ roadmap, error }) => {
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center">
          <svg className="h-5 w-5 text-red-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-medium text-red-800">Error Generating Roadmap</h3>
        </div>
        <p className="mt-2 text-red-700">{error}</p>
      </div>
    );
  }

  if (!roadmap) {
    return null;
  }

  const { goal, currentLevel, steps } = roadmap;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-stone-800 mb-2">
          Your Learning Roadmap
        </h2>
        <div className="flex flex-wrap gap-4 text-sm text-stone-600">
          <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full">
            Goal: {goal}
          </span>
          <span className="bg-stone-100 text-stone-800 px-3 py-1 rounded-full">
            Level: {currentLevel}
          </span>
          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
            {steps?.length || 0} Steps
          </span>
        </div>
      </div>

      {steps && steps.length > 0 ? (
        <div className="space-y-6">
          {steps.map((step, index) => (
            <div key={step.id || index} className="border border-stone-200 rounded-lg p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start space-x-4">
               
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-semibold">
                    {step.order || index + 1}
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-stone-800 mb-2">
                    {step.title}
                  </h3>
                  
                  {step.description && (
                    <p className="text-stone-600 mb-4 leading-relaxed">
                      {step.description}
                    </p>
                  )}

                  {step.resources && step.resources.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-stone-700 mb-3">
                        Learning Resources:
                      </h4>
                      <div className="grid gap-3 md:grid-cols-1 lg:grid-cols-2">
                        {step.resources.map((resource, resourceIndex) => (
                          <div key={resourceIndex} className="bg-stone-50 rounded-lg p-4 border border-stone-100">
                            <div className="flex items-start justify-between mb-2">
                              <h5 className="font-medium text-stone-800 text-sm">
                                {resource.title}
                              </h5>
                              <div className="flex space-x-1 ml-2">
                                {resource.certified && (
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    Certified
                                  </span>
                                )}
                                {resource.free && (
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    Free
                                  </span>
                                )}
                              </div>
                            </div>
                            
                            {resource.source && (
                              <p className="text-xs text-stone-500 mb-2">
                                Provider: {resource.source}
                              </p>
                            )}
                            
                            {resource.url && (
                              <a
                                href={resource.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                              >
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                                Visit Resource
                              </a>
                            )}
                            
                            {resource.estimatedHours && (
                              <p className="text-xs text-stone-500 mt-2">
                                Estimated time: {resource.estimatedHours} hours
                              </p>
                            )}
                            
                            {resource.notes && (
                              <p className="text-xs text-stone-600 mt-2 italic">
                                {resource.notes}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {step.project && (step.project.title || step.project.description) && (
                    <div className="mt-4 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                      <h4 className="text-sm font-medium text-indigo-800 mb-2">
                        Suggested Project:
                      </h4>
                      {step.project.title && (
                        <h5 className="font-medium text-indigo-700 mb-1">
                          {step.project.title}
                        </h5>
                      )}
                      {step.project.description && (
                        <p className="text-sm text-indigo-600">
                          {step.project.description}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-stone-500">No steps generated. Please try again.</p>
        </div>
      )}
    </div>
  );
};

export default RoadmapOutput;
