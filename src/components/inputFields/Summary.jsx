import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

function Summary({ summary = [], handleInputChange, }) {
  const [error, setError] = useState(null);
  const [apiResult, setApiResult] = useState('');

  const handleGetResults = async () => {
    try {
      const token = localStorage.getItem('jobSeekerLoginToken');
      const response = await fetch(`https://api.abroadium.com/api/jobseeker/ai-resume-summery-data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${token}`
        },
        body: JSON.stringify({
          key: "professional_summary",
          keyword: "professional_summary in manner of description",
          content: "Fetch professional summary",
          file_location: "/etc/ai_job_portal/jobseeker/resume_uploads/black-and-white-standard-professional-resume-1719321080.pdf"
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.status === "success" && data.data.resume_analysis && data.data.resume_analysis.professional_summary) {
          setApiResult(data.data.resume_analysis.professional_summary); // Store the summary in state
          setError(null); // Clear any previous errors
        } else {
          console.error('No search results found');
          setApiResult(''); // Clear previous result if no data found
          setError('No search results found');
        }
      } else {
        const errorData = await response.json();
       
        setApiResult(''); // Clear previous result on failure
        setError(errorData.message || 'Failed to fetch suggestions');
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setApiResult(''); // Clear previous result on error
      setError('Error fetching suggestions. Please try again.');
    }
  };

  return (
    <>
      {summary.length > 0 ? (
        summary.map((sum, index) => (
          <div key={index} className="flex mt-10 justify-center">
            <div className="m-2 px-10 flex gap-3 w-3/">
              <div>
                <div className="flex justify-between font-bold text-lg my-4">
                  <h1 className="text-xl">Professional Summary</h1>
                  <div>
                    <button className="font-bold text-lg flex items-center" onClick={handleGetResults}>
                      <svg
                        className="h-5 w-5 text-white bg-black rounded-full m-1"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                      >
                        <path fill="none" d="M0 0h24v24H0z" />
                        <line x1="9" y1="12" x2="15" y2="12" stroke="white" />
                        <line x1="12" y1="9" x2="12" y2="15" stroke="white" />
                      </svg>
                      <h3>AI - Assist</h3>
                    </button>
                  </div>
                </div>
                <div className="my-4 mb-10 font-normal">
                  Write 2-5 Sentences that highlight the value you can provide to a team and organization. Mention your previous role, experience & most importantly - your biggest achievements, best qualities, and skills.
                </div>
                <ReactQuill
                  theme="snow"
                  value={apiResult || sum.summarydescription } // Prioritize existing value or API result
                  onChange={(content) => handleInputChange({ target: { value: content, name: 'summarydescription' } }, index, 'summary')}
                  className="w-full h-40 p-2 mb-4 break-all"
                />
              </div>
            </div>
          </div>
        ))
      ) : (
        <p>No summaries available.</p>
      )}

      {/* Display error message if any */}
      {error && (
        <div className="mt-4">
          <p className="text-red-500">{error}</p>
        </div>
      )}
    </>
  );
}

export default Summary;
