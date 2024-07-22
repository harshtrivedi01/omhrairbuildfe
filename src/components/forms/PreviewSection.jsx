import React, { useState } from 'react';
import axios from 'axios';
import PdfDownloadButton from '../forms/PdfDownloadButton';
import TemplateComponent from './templateComponent';
import FunctionalityOfCV from './FunctionalityOfCV';

const PreviewSection = ({
  cvRef,
  handlePrint,
  setIsPreviewing,
  formData,
  predefinedText,
  selectedTemplate,
  handleSectionInputChange,
  addSectionAdd,
  deleteSectionAdd,
  setSelectedTemplate,
  selectedFont,
  setSelectedFont,
  boxBgColor,
  setBoxBgColor,
  skillsfromapi
}) => {
  const [textSize, setTextSize] = useState(2);
  const [sectionSpacing, setSectionSpacing] = useState(2);
  const [paragraphSpacing, setParagraphSpacing] = useState(2);
  const [lineSpacing, setLineSpacing] = useState(1.5);
  const [isPreviewScreen, setIsPreviewScreen] = useState(true);
  const [accuracyPercentage, setAccuracyPercentage] = useState(null);
console.log(skillsfromapi,'api')
  
  const resumeScore = async () => {
    try {
      const token = localStorage.getItem('jobSeekerLoginToken'); // Retrieve the token from local storage
      const requestBody = {
        keyword: "Rate this resume content in percentage ? and checklist of scope improvments in manner of content and informations",
        file_location: "/etc/ai_job_portal/jobseeker/resume_uploads/black-and-white-standard-professional-resume-1719321080.pdf"
      };

      const response = await axios.post(
        'https://api.abroadium.com/api/jobseeker/file-based-ai',
        requestBody,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token // Include 'Bearer ' prefix if using Bearer token
          }
        }
      );

      // Extract only the content_acuracy_percentage from the response
      const { content_acuracy_percentage } = response.data.data;
      setAccuracyPercentage(content_acuracy_percentage);
    } catch (error) {
      console.error('Error fetching data from API', error);
    }
  };

  const updateResume = async (id) => {
    const token = localStorage.getItem('token');
    const url = `https://api.abroadium.com/api/jobseeker/resume-update/${id}`;
  
    // Ensure skillsfromapi is initialized as an empty array if it's null or undefined
    const skillsFromApiArray = Array.isArray(skillsfromapi) ? skillsfromapi : [];
  
    const payload = {
      templateData: {
        templatename: selectedTemplate || "Template1",
        details: {
          firstname: formData.details[0]?.name || "",
          lastname: formData.details[0]?.lastname || "",
          address: formData.details[0]?.address || "",
          phone: formData.details[0]?.phoneNumber || "",
          email: formData.details[0]?.email || "",
          postalcode: formData.details[0]?.postalcode || "",
          drivinglicense: formData.details[0]?.drivinglicense || "",
          nationality: formData.details[0]?.nationality || "",
          placeofbirth: formData.details[0]?.placeofbirth || "",
          dateofbirth: formData.details[0]?.dateofbirth || "",
          securityclearance: formData.details[0]?.securityclearance || "",
          city: formData.details[0]?.city || "",
          country: formData.details[0]?.country || "",
          github: formData.details[0]?.github || "",
          languages: formData.languages?.map(language => `${language.Languagename1} ${language.Languagename2}`) || [],
          projects: formData.projects || [],
          achievement: formData.achievement || [],
          photo: formData.photo || "",
          profession: formData.profession || "",
          linkdin: formData.linkdin || "",
          wantedjobtitle: formData.wantedjobtitle || "",
        },
        professionalsummary: formData.summary[0]?.summarydescription || "",
        // Combine skillsfromapi and formData.skills arrays
        skills: [...skillsFromApiArray, ...(formData.skills?.map(skill => skill.skillname) || [])] || [],
        education: formData.educations?.map(edu => ({
          degree: edu.coursename || "",
          city1: edu.schoolplace || "",
          school: edu.schoolname || "",
          start: edu.edmonth1 || "",
          edmonth2: edu.edmonth2 || "",
        })) || [],
        employmenthistory: formData.experiences?.map(exp => ({
          company_name: exp.Company || "",
          jobtitle1: exp.role || "",
          jobdescription: exp.companydescription || "",
          jobstart: exp.month1 || "",
          month2: exp.month2 || "",
          jobcity: exp.companyplace || "",
        })) || [],
        other_sections: formData.sectionadd?.map(section => ({
          sectionname: section.sectionname || "",
          sectiondescription: section.sectiondescription || "",
          sectiontitle: section.sectiontitle || "",
        })) || [],
      },
    };
  
    console.log('Payload:', JSON.stringify(payload, null, 2)); // Debugging
  
    try {
      const response = await axios.put(url, payload, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        }
      });
      console.log('Resume updated successfully:', response.data);
      
      // Handle success (e.g., show a success message, redirect, etc.)
    } catch (error) {
      console.error('Error updating resume:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
      }
    }
  };
  

  return (
    <div className='h- justify-center '>
      <div className='flex justify-end border-2 p-1 bg-slate-300 '>
        <button
          onClick={() => setIsPreviewing(false)}
          className="bg-white text-blue-800 border-blue-800 border-2 px-8 py-1 m-1 me-5 rounded-full font-bold "
        >
          Back
        </button>
      </div>
      <div className='px-10 mt-7 ms-36'>
        <h1 className='text-3xl font-bold mb-3 '>Review your resume</h1>
        <h1 className='text-lg'>Review and make any final changes to your resume, then download or email yourself a copy and apply for jobs!</h1>
      </div>
      <div className='flex justify-center mb-40'>
        <div className="w-3/6 pt-10 overflow-auto mb-10">
          <TemplateComponent
            ref={cvRef}
            data={formData}
            selectedTemplate={selectedTemplate}
            selectedFont={selectedFont}
            textSize={textSize}
            sectionSpacing={sectionSpacing}
            paragraphSpacing={paragraphSpacing}
            lineSpacing={lineSpacing}
            boxBgColor={boxBgColor}
            isPreviewScreen={isPreviewScreen}
            predefinedText={predefinedText}
            skillsfromapi={skillsfromapi}
          />
          {/* Render Additional Sections Input Fields */}
        </div>
        <div className='py-9 w-1/4'>
          <div className='flex justify-around'>
            <div className="justify-end mt-4">
              <PdfDownloadButton targetRef={cvRef} />
            </div>
            <div className='mt-4'>
              <button
                onClick={handlePrint}
                className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-blue-500 rounded-lg group bg-blue-800 group-hover:bg-blue-950 border hover:text-white dark:text-blue focus:ring-2 focus:outline-none focus:ring-blue-100 dark:focus:ring-blue-100"
              >
                <span className="relative px-9 py-5 transition-all ease-in duration-75 bg-white dark:bg-gray-100 rounded-md group-hover:bg-opacity-0 font-bold">
                  Print
                </span>
              </button>
            </div>
          </div>
          <button
            type="button"
            onClick={updateResume}
            className="ms-5 mt-5 mb-10 text-gray-900 bg-[#F7BE38] hover:bg-[#F7BE38]/90 focus:ring-4 focus:outline-none focus:ring-[#F7BE38]/50 font-bold rounded-full px-28 py-3 text-center inline-flex items-center dark:focus:ring-[#F7BE38]/50 me-2 "
          >
            Finish Resume
          </button>
          <div>
      {accuracyPercentage !== null ? (
        <div className="api-data-container border-amber-600 border-4 py-4 ms-3">
          {/* Render the content_acuracy_percentage */}
          <p className='font-semibold ms-5'>Your AI Score is Percentage: {accuracyPercentage}</p>
        </div>
      ) : (
        <button
          type="button"
          onClick={resumeScore}
          className="ms-5 mt-5 mb-10 text-gray-900 bg-[#F7BE38] hover:bg-[#F7BE38]/90 focus:ring-4 focus:outline-none focus:ring-[#F7BE38]/50 font-bold rounded-full px-24 py-3 text-center inline-flex items-center dark:focus:ring-[#F7BE38]/50 me-2 "
        >
          Check the AI Score
        </button>
      )}
    </div>

          <FunctionalityOfCV
            selectedTemplate={selectedTemplate}
            setSelectedTemplate={setSelectedTemplate}
            selectedFont={selectedFont}
            setSelectedFont={setSelectedFont}
            textSize={textSize}
            setTextSize={setTextSize}
            sectionSpacing={sectionSpacing}
            setSectionSpacing={setSectionSpacing}
            paragraphSpacing={paragraphSpacing}
            setParagraphSpacing={setParagraphSpacing}
            lineSpacing={lineSpacing}
            setLineSpacing={setLineSpacing}
            setBoxBgColor={setBoxBgColor}
          />

          <div className="additional-sections ">
            {formData.sectionadd.map((section, index) => (
              <div key={index} className="additional-section ms-5 mb-2 border-2 rounded p-2">
                <div className="flex gap-1">
                  <div className="w-3/4">
                    <label htmlFor="sectiontitle" className="block text-sm font-medium text-gray-700 mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      name="sectiontitle"
                      value={section.sectiontitle}
                      onChange={(e) => handleSectionInputChange(e, index, 'sectionadd')}
                      placeholder="Section title"
                      className="w-full p-2 mb-4 border border-black rounded-lg"
                    />
                  </div>
                  <div className="w-3/4">
                    <label htmlFor="sectionname" className="block text-sm font-medium text-gray-700 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      name="sectionname"
                      value={section.sectionname}
                      onChange={(e) => handleSectionInputChange(e, index, 'sectionadd')}
                      placeholder="Section Name"
                      className="w-full p-2 border border-black rounded-lg"
                    />
                  </div>
                </div>
                <div className="w-full">
                  <label htmlFor="sectiondescription" className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <input
                    type="text"
                    name="sectiondescription"
                    value={section.sectiondescription}
                    onChange={(e) => handleSectionInputChange(e, index, 'sectionadd')}
                    placeholder="Section description"
                    className="w-full p-2 border border-black rounded-lg"
                  />
                </div>
                <div className="flex justify-end mt-2">
                  <button className="font-bold text-lg flex items-center p-2 px-2 ms-5 border-2 border-black rounded" onClick={() => deleteSectionAdd(index)}>
                    <h3>Delete Section</h3>
                  </button>
                </div>
              </div>
            ))}
            <button className="font-bold text-lg flex items-center p-2 px- ms-5 border-2 border-black rounded" onClick={addSectionAdd}>
              <h3>+ Add Section</h3>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewSection;
