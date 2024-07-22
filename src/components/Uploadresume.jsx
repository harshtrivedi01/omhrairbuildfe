import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from '../components/images/logo3.png';
import upload from '../components/images/upload.png';
import UploadScreen from "../components/loadingscreens/uploadscreen";
import Footer from "./Footer";

function Uploadresume() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("jobSeekerLoginToken");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const handleClick2 = () => {
    setTimeout(() => {
      navigate('/');
    });
  };

  return (
    <>
      <div className="h-screen">
        <div className="flex justify-between p-2 bg-blue-300">
          <img src={logo} alt="" style={{width:'130px'}} />
        </div>
        <div className="text-center my-10">
          <h1 className="font-bold text-3xl mb-3">How do you want to build your resume?</h1>
        </div>
        <div className="flex text-center justify-center gap-10">
          <div className="my-10 p-16 border-dashed border-2 rounded-md border-blue-400">
            <img src={upload} alt="" style={{ height: '50px' }} className="ms-24" />
            <h1 className="font-bold text-xl mt-2 mb-3 text-slate-700">Drag, and drop a file here</h1>
            <button className="text-white px-4 rounded-full py-1 text-xs" style={{ backgroundColor: '#022B5F' }}>Browse</button>
          </div>
        </div>
        <div className="text-center">
          <h3 className="text-xs"><strong>Files we can read:</strong> PDF</h3>
        </div>
        <div className="ms-20 mt-10">
          <button className="px-10 rounded-full py-2 text-lg text-violet-950 font-bold border border-violet-950" onClick={handleClick2}>Back</button>
        </div>
      </div>
    </>
  );
}

export default Uploadresume;
