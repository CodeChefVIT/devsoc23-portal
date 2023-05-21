import React from "react";
import Image from "next/image";
import Track from "../../assets/tracks.png";
import Marquee from "react-fast-marquee";

const tracks = () => {
  return (
    <div className="pt-6">
      <div className="lg:px-30 md:px-30 py-5">
        <div className="md:items-start lg:items-start flex flex-col items-center">
          <h1 className="md:px-10 lg:px-20 px-0 text-4xl font-bold text-white">
            Tracks
          </h1>
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
            </Marquee>
          </div>
        </div>
      </div>
    </div>
  );
};

export default tracks;
