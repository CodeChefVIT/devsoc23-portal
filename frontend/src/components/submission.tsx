import React from "react";
import Image, { type StaticImageData } from "next/image";
import Submission from "../../assets/submission.svg";

const submission = () => {
  return (
    <div>
      <div className="md:w[60vw] mx-5 flex flex-col  px-5 pb-16  md:mx-20 md:items-start md:px-10 lg:mx-20 lg:w-[60vw] lg:items-start lg:px-20">
        <h1 className="pt-5 text-4xl font-bold text-white ">Submission</h1>
        <div className="px-30">
          <div className="flex w-full flex-col items-start justify-between px-3 md:flex-row lg:flex-row">
            <p className="pb-3 pt-8 text-2xl font-bold text-white">
              Idea Submission
            </p>
            <p className="pb-5 pt-2 text-2xl font-bold text-white md:pt-8 lg:pt-8">
              8 Hours Remaining
            </p>
          </div>
          <div className="relative">
            <Image
              src={Submission as StaticImageData}
              alt=""
              className="w-full"
            />
            <button
              type="button"
              className="text-md absolute bottom-0 right-0 m-4 w-[40vw] rounded-md bg-[#37ABBC]  px-3 py-3 font-semibold text-white shadow-sm transition-all hover:bg-[#288391] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 md:mx-8 md:w-64 lg:mx-8 lg:w-64"
              // onClick={togglePopup}
            >
              Add a submision
            </button>
          </div>

          <div className="flex w-full flex-col items-start justify-between px-3 py-5 md:flex-row lg:flex-row">
            <p className="pb-3 pt-8 text-2xl font-bold text-white">
              Project Submission
            </p>
            <p className="pb-5 pt-2 text-2xl font-bold text-white md:pt-8 lg:pt-8">
              8 Hours Remaining
            </p>
          </div>
          <div className="relative">
            <Image
              src={Submission as StaticImageData}
              alt=""
              className="w-full"
            />
            <button
              type="button"
              className="text-md absolute bottom-0 right-0 m-4 w-[40vw] rounded-md bg-[#37ABBC] px-3 py-3 font-semibold text-white shadow-sm transition-all hover:bg-[#288391] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 md:mx-8 md:w-64 lg:mx-8 lg:w-64"
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
