/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React from "react";
import Image from "next/image";
import Submission from "./../../assets/submission.svg";

const submission = () => {
  return (
    <div>
      <div className="flex flex-col items-center px-5 font-semibold md:items-start md:px-10 lg:items-start lg:px-20">
        <h1 className="pt-5 text-4xl font-bold text-white ">Submission</h1>
        <div className="px-30">
          <div className="flex flex-col items-center justify-between md:flex-row lg:flex-row">
            <p className="text-1xl pt-8 pb-5 text-white">Idea Submission</p>
            <p className="text-1xl pt-8 pb-5 text-white">8 Hours Remaining</p>
          </div>
          <div className="relative">
            <Image src={Submission} alt="" className="w-full" />
            <button
              type="button"
              className="text-md absolute bottom-0 right-0 m-4 w-64 rounded-md bg-[#37ABBC] py-3 px-3 font-semibold text-white shadow-sm transition-all hover:bg-[#288391] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 md:mx-8 lg:mx-8"
              // onClick={togglePopup}
            >
              Add a submision
            </button>
          </div>

          <div className="flex flex-col items-center justify-between md:flex-row lg:flex-row">
            <p className="text-1xl pt-8 pb-5 text-white">Project Submission</p>
            <p className="text-1xl pt-8 pb-5 text-white">8 Hours Remaining</p>
          </div>
          <div className="relative">
            <Image src={Submission} alt="" className="w-full" />
            <button
              type="button"
              className="text-md absolute bottom-0 right-0 m-4 w-64 rounded-md bg-[#37ABBC] py-3 px-3 font-semibold text-white shadow-sm transition-all hover:bg-[#288391] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 md:mx-8 lg:mx-8"
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
