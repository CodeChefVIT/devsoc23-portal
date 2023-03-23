/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";

import Marquee from "react-fast-marquee";

import Devsoc from "../../assets/logo.png";
import Track from "./../../assets/tracks.png";
import Profile from "./../../assets/user-avatar.svg";
import Crown from "./../../assets/crown.svg";
import Submission from "./../../assets/submission.svg";
// import Link from "next/link";

const Dashboard: NextPage = () => {
  return (
    <>
      <Head>
        <title>Dashboard</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-h-screen bg-[#242E42]">
        <div className="flex flex-col items-start justify-start pl-5 pt-5">
          <a className="cursor-pointer" href="/">
            <Image src={Devsoc} alt="" className="w-20 md:w-20 lg:w-24" />
          </a>
        </div>
        <div className="lg:px-30 md:px-30 py-5">
          <div className="flex flex-col items-center md:items-start lg:items-start">
            <h1 className="px-0 text-4xl font-bold text-white md:px-10 lg:px-20">
              Tracks
            </h1>
            <div className="w-72 py-16 md:w-96 lg:w-fit">
              <Marquee gradient={false} speed={100}>
                <div className="">
                  <Image src={Track} alt="" />
                  <p className="ml-2 py-4 text-lg font-semibold text-white">
                    Track Name
                  </p>
                </div>
                <div className="mx-10">
                  <Image src={Track} alt="" />
                  <p className="ml-2 py-4 text-lg font-semibold text-white">
                    Track Name
                  </p>
                </div>
                <div className="mx-10">
                  <Image src={Track} alt="" />
                  <p className="ml-2 py-4 text-lg font-semibold text-white">
                    Track Name
                  </p>
                </div>
                <div className="mx-10">
                  <Image src={Track} alt="" />
                  <p className="ml-2 py-4 text-lg font-semibold text-white">
                    Track Name
                  </p>
                </div>
                <div className="mx-10">
                  <Image src={Track} alt="" />
                  <p className="ml-2 py-4 text-lg font-semibold text-white">
                    Track Name
                  </p>
                </div>
              </Marquee>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center md:items-start md:px-10 lg:items-start lg:px-20">
          <h1 className="py-5 text-4xl font-bold text-white ">
            Team Information
          </h1>
          <div className="px-30 py-10">
            <div className="rounded-lg bg-[#2F3B52] px-20 py-20 ">
              <div className="flex flex-row items-center rounded-lg bg-[#20293C] px-20 py-5">
                <div className="flex flex-row items-center pr-40">
                  <Image src={Profile} alt="" className="w-14" />
                  <p className="pl-9 text-lg text-white">Souvik Mukherjee</p>
                </div>
                <div>
                  <Image src={Crown} alt="" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center md:items-start md:px-10 lg:items-start lg:px-20">
          <h1 className="py-5 text-4xl font-bold text-white ">Submission</h1>
          <div className="px-30 py-10">
            <Image src={Submission} alt="" />
            <p className="text-1xl py-5 text-white">Idea Submission</p>

            <Image src={Submission} alt="" />
            <p className="text-1xl py-5 text-white">Project Submission</p>
          </div>
        </div>
      </main>
    </>
  );
};

export default Dashboard;
