import React from "react";
import Image from "next/image";
import Track from "../../assets/tracks.png";
import Marquee from "react-fast-marquee";

const tracks = () => {
  return (
    <div className="">
      <div className="py-5">
        <div className="md:w[60vw] mx-5 flex flex-col  px-5 pb-16  md:mx-20 md:items-start md:px-10 lg:mx-20 lg:w-[100vw] lg:items-start lg:px-20">
          <h1 className="pb-10 text-4xl font-bold text-white">Tracks</h1>
          <div className="p-2"></div>
          <div className="w-full">
            <Marquee gradient={false} speed={100}>
              <div className="mx-10">
                <Image src={Track} alt="" className="w-48" />
                <p className="ml-2 py-4 text-lg font-semibold text-white">
                  Track Name
                </p>
              </div>
              <div className="mx-10">
                <Image src={Track} alt="" className="w-48" />
                <p className="ml-2 py-4 text-lg font-semibold text-white">
                  Track Name
                </p>
              </div>
              <div className="mx-10">
                <Image src={Track} alt="" className="w-48" />
                <p className="ml-2 py-4 text-lg font-semibold text-white">
                  Track Name
                </p>
              </div>
              <div className="mx-10">
                <Image src={Track} alt="" className="w-48" />
                <p className="ml-2 py-4 text-lg font-semibold text-white">
                  Track Name
                </p>
              </div>
              <div className="mx-10">
                <Image src={Track} alt="" className="w-48" />
                <p className="ml-2 py-4 text-lg font-semibold text-white">
                  Track Name
                </p>
              </div>
              <div className="mx-10">
                <Image src={Track} alt="" className="w-48" />
                <p className="ml-2 py-4 text-lg font-semibold text-white">
                  Track Name
                </p>
              </div>
              <div className="mx-10">
                <Image src={Track} alt="" className="w-48" />
                <p className="ml-2 py-4 text-lg font-semibold text-white">
                  Track Name
                </p>
              </div>
              <div className="mx-10">
                <Image src={Track} alt="" className="w-48" />
                <p className="ml-2 py-4 text-lg font-semibold text-white">
                  Track Name
                </p>
              </div>
              <div className="mx-10">
                <Image src={Track} alt="" className="w-48" />
                <p className="ml-2 py-4 text-lg font-semibold text-white">
                  Track Name
                </p>
              </div>
            </Marquee>
          </div>
        </div>
      </div>
    </div>
  );
};

export default tracks;