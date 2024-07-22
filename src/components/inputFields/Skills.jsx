import React, { useState } from 'react';
import axios from 'axios';

const Skills = ({ skills = [], handleInputChange, addSkill, deleteSkill }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const accessToken = 'jobSeekerLoginToken'; // Replace with your actual access token

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = async () => {
    try {
      const response = await axios.post(
        'https://api.abroadium.com/api/jobseeker/ai-skills-data',
        { keyword: searchQuery },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      setSearchResults(response.data.skills || []);
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  const handleSearchResultClick = (result) => {
    const updatedSkills = [...skills];
    updatedSkills.push({ skillname: result });
    handleInputChange({ target: { name: 'skillname', value: result } });
    setSearchResults([]); // Clear search results
    setShowDropdown(false); // Hide dropdown after selection
  };

  return (
    <div className="mt-10 px-4 md:px-10 ">
       <div className="mt-4">
        <button className="text-lg font-medium text-blue-500" onClick={() => setShowDropdown(!showDropdown)}>
          AI - Assist
        </button>
        {showDropdown && (
          <div className=" mt-1 w-96 bg-white border border-black rounded-lg shadow-lg z-10">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full p-2 border border-black rounded-lg"
            />
            <button 
              className="w-full p-2 bg-blue-500 text-white rounded-lg"
              onClick={handleSearch}
            >
              Search
            </button>
            {searchResults.map((result, idx) => (
              <div
                key={idx}
                className="p-2 hover:bg-gray-200 cursor-pointer"
                onClick={() => handleSearchResultClick(result)}
              >
                {result}
              </div>
            ))}
          </div>
        )}
      </div>
      {skills.map((skill, index) => (
        <div key={index} className="mt-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor={`skillname_${index}`} className="block text-sm font-medium text-gray-700 mb-2">
                Skill Name
              </label>
              <input 
                type="text" 
                id={`skillname_${index}`}
                name="skillname" 
                value={skill.skillname}
                onChange={(e) => handleInputChange(e, index, 'skills')}
                placeholder="Skill Name" 
                className="w-full p-2 border border-black rounded-lg"
              />
            </div>
            <div>
              <label htmlFor={`skilldetails_${index}`} className="block text-sm font-medium text-gray-700 mb-2">
                Skill Details
              </label>
              <input 
                type="text" 
                id={`skilldetails_${index}`}
                name="skilldetails" 
                value={skill.skilldetails}
                onChange={(e) => handleInputChange(e, index, 'skills')}
                placeholder="Skill Details" 
                className="w-full p-2 border border-black rounded-lg"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() => deleteSkill(index)}
            className="mt-2 text-red-500"
          >
            Delete Skill
          </button>
        </div>
      ))}

     

      <button className="mt-4 text-lg font-bold flex items-center" onClick={addSkill}>
        <h3>Add Item</h3>
        <svg className="h-5 w-5 text-white bg-black rounded-full m-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path fill="none" d="M0 0h24v24H0z"/>
          <line x1="9" y1="12" x2="15" y2="12" stroke="white" />
          <line x1="12" y1="9" x2="12" y2="15" stroke="white" />
        </svg>
      </button>
    </div>
  );
};

export default Skills;
