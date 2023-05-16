/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React from "react";
import Image from "next/image";
import Track from "./../../assets/tracks.png";
import Marquee from "react-fast-marquee";

const tracks = () => {
  return (
    <div className="pt-6">
      <div className="lg:px-30 md:px-30 py-5">
        <div className="flex flex-col items-center md:items-start lg:items-start">
          <h1 className="px-0 text-4xl font-bold text-white md:px-10 lg:px-20">
            Tracks
          </h1>
          <div className="w-72 py-16 md:w-96 lg:w-fit">
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
