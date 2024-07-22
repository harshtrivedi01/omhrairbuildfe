import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import styles for ReactQuill

const Experience = ({ experiences = [], handleInputChange, addExperience, deleteExperience }) => {
  const [isCurrentlyWorking, setIsCurrentlyWorking] = useState(false);
  const [isExperienceComplete, setIsExperienceComplete] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedExperienceIndex, setSelectedExperienceIndex] = useState(null);
  const [editorHtml, setEditorHtml] = useState('');

  useEffect(() => {
    checkExperienceCompletion();
  }, [experiences]);

  const checkExperienceCompletion = () => {
    const complete = experiences.every(exp =>
      exp.Company &&
      exp.role &&
      exp.month1 &&
      (exp.month2 || isCurrentlyWorking) &&
      exp.companydescription
    );
    setIsExperienceComplete(complete);
  };

  const handleDescriptionChange = (html, index) => {
    setEditorHtml(html);
    handleInputChange({ target: { name: 'companydescription', value: html } }, index, 'experiences');
  };

  const toggleDropdown = (index) => {
    setShowDropdown(!showDropdown);
    setSelectedExperienceIndex(index);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = async () => {
    const accessToken = 'jobSeekerLoginToken';
   console.log(accessToken,"tokenn")
    try {
      const response = await axios.post(
        'https://api.novajobs.us/api/jobseeker/ai-resume-profexp-data',
        { query: searchQuery },
        { headers: { Authorization: accessToken } }
      );
      setSearchResults(response.data.results || []);
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSearchResultClick = (result, index) => {
    const updatedExperiences = [...experiences];
    updatedExperiences[index].companydescription = result;
    setEditorHtml(result); // Set ReactQuill editor content
    handleInputChange(
      { target: { name: 'companydescription', value: result } },
      index,
      'experiences'
    );
    setSearchResults([]);
    setShowDropdown(false);
  };

  return (
    <div className='mt-4'>
      <div className="md:px-10">
        {experiences.map((exp, index) => (
          <div key={index} className="mt-4 p-4">
            <h6 className='font-bold text-xs my-2'>* indicates a required field</h6>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label htmlFor={`Company_${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                  Who Did You Do This For?
                </label>
                <input 
                  type="text" 
                  id={`Company_${index}`}
                  name="Company" 
                  value={exp.Company}
                  onChange={(e) => handleInputChange(e, index, 'experiences')}
                  placeholder="Company Name" 
                  className="w-full p-2 border border-black rounded-lg"
                />
              </div>
              <div>
                <label htmlFor={`role_${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                  What Was Your Title? *
                </label>
                <input 
                  type="text" 
                  id={`role_${index}`}
                  name="role" 
                  value={exp.role}
                  onChange={(e) => handleInputChange(e, index, 'experiences')}
                  placeholder="Role" 
                  className="w-full p-2 border border-black rounded-lg"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label htmlFor={`month1_${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date:
                </label>
                <input 
                  type="month" 
                  id={`month1_${index}`}
                  name="month1" 
                  value={exp.month1}
                  onChange={(e) => handleInputChange(e, index, 'experiences')}
                  className="w-full p-2 border border-black rounded-lg"
                /> 
              </div>
              <div>
                <label htmlFor={`month2_${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                  End Date:
                </label>
                <input 
                  type="month" 
                  id={`month2_${index}`}
                  name="month2" 
                  value={exp.month2}
                  onChange={(e) => handleInputChange(e, index, 'experiences')}
                  disabled={isCurrentlyWorking}
                  className="w-full p-2 border border-black rounded-lg"
                />
              </div>
            </div>

            <div className="flex items-center mt-4">
              <input
                type="checkbox" 
                id={`currentlyWorking_${index}`}
                checked={isCurrentlyWorking}
                onChange={() => {
                  setIsCurrentlyWorking(!isCurrentlyWorking);
                  handleInputChange(
                    { target: { name: "month2", value: isCurrentlyWorking ? "" : "Present" } },
                    index,
                    "experiences"
                  );
                }}
                className="mr-2"
              />
              <label htmlFor={`currentlyWorking_${index}`} className="text-sm font-medium text-gray-700">
                Currently Working
              </label>
            </div>

            <div>
              <label htmlFor={`companyplace_${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                Company Location 
              </label>
              <input 
                type="text" 
                id={`companyplace_${index}`}
                name="companyplace" 
                value={exp.companyplace}
                onChange={(e) => handleInputChange(e, index, 'experiences')}
                placeholder="e.g. Delhi, India" 
                className="w-full p-2 border border-black rounded-lg"
              />
            </div>

            <div className="flex justify-between mt-4">
              <h3 className="text-lg font-medium">Description</h3>
              <button className="text-lg font-medium text-blue-500" onClick={() => toggleDropdown(index)}>
                AI - Assist
              </button>
            </div>
            {showDropdown && selectedExperienceIndex === index && (
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onKeyPress={handleSearchKeyPress}
                  className="w-full p-2 border border-black rounded-lg mt-2"
                />
                <button 
                  className="w-full p-2 bg-blue-500 text-white rounded-lg mt-2"
                  onClick={handleSearch}
                >
                  Search
                </button>
                <div className="absolute w-full mt-1 bg-white border border-black rounded-lg shadow-lg z-10">
                  {searchResults.map((result, idx) => (
                    <div
                      key={idx}
                      className="p-2 hover:bg-gray-200 cursor-pointer"
                      onClick={() => handleSearchResultClick(result, index)}
                    >
                      {result}
                    </div>
                  ))}
                </div>
              </div>
            )}
            <ReactQuill
              theme="snow"
              value={editorHtml}
              onChange={(html) => handleDescriptionChange(html, index)}
              className="mt-2 h-32"
            />

            <button
              type="button"
              onClick={() => deleteExperience(index)}
              className="mt-20 text-red-500"
            >
              Delete Experience
            </button>
          </div>
        ))}
        <button className="mt-4 text-lg font-bold flex items-center" onClick={addExperience}>
          <h3>Add Item</h3>
          <svg className="h-5 w-5 text-white bg-black rounded-full m-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path fill="none" d="M0 0h24v24H0z"/>
            <line x1="9" y1="12" x2="15" y2="12" stroke="white" />
            <line x1="12" y1="9" x2="12" y2="15" stroke="white" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Experience;
