import React from "react";
import Image, { type StaticImageData } from "next/image";
import Submission from "../../assets/submission.svg";

const submission = () => {
  return (
    <div>
      <div className="md:items-start md:px-10 lg:items-start lg:px-20 flex flex-col items-center px-5 font-semibold">
        <h1 className="pt-5 text-4xl font-bold text-white ">Submission</h1>
        <div className="px-30">
          <div className="md:flex-row lg:flex-row flex flex-col items-center justify-between">
            <p className="text-1xl pb-5 pt-8 text-white">Idea Submission</p>
            <p className="text-1xl pb-5 pt-8 text-white">8 Hours Remaining</p>
          </div>
          <div className="relative">
            <Image
              src={Submission as StaticImageData}
              alt=""
              className="w-full"
            />
            <button
              type="button"
              className="text-md md:mx-8 lg:mx-8 absolute bottom-0 right-0 m-4 w-64 rounded-md bg-[#37ABBC] px-3 py-3 font-semibold text-white shadow-sm transition-all hover:bg-[#288391] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              // onClick={togglePopup}
            >
              Add a submision
            </button>
          </div>

          <div className="md:flex-row lg:flex-row flex flex-col items-center justify-between">
            <p className="text-1xl pb-5 pt-8 text-white">Project Submission</p>
            <p className="text-1xl pb-5 pt-8 text-white">8 Hours Remaining</p>
          </div>
          <div className="relative">
            <Image
              src={Submission as StaticImageData}
              alt=""
              className="w-full"
            />
            <button
              type="button"
              className="text-md md:mx-8 lg:mx-8 absolute bottom-0 right-0 m-4 w-64 rounded-md bg-[#37ABBC] px-3 py-3 font-semibold text-white shadow-sm transition-all hover:bg-[#288391] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              // onClick={togglePopup}
            >
              Add a submision
            </button>
          </div>
        </div>
        <div className="py-10"></div>
      </div>
    </div>
  );
};

export default submission;
