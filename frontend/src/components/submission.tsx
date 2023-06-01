import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import getToken from "~/utils/GetAccessToken";
import axios, { type AxiosError } from "axios";
import Loader from "~/components/Loader";
import { type ServerResponse } from "types/api";
import Router from "next/router";

interface TimeLeft {
  days?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
}

const Submission = () => {
  const [loading, setLoading] = useState(true);
  const [ideaName, setIdeaName] = useState("");
  const [ideaDesc, setIdeaDesc] = useState("");
  const router = useRouter();

  const calculateTimeLeft = () => {
    const year = new Date().getFullYear();

    const difference = +new Date(`06/02/${year}`) - +new Date();

    let timeLeft: TimeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  useEffect(() => {
    const getProject = async () => {
      let accessToken: string | undefined = "";
      if (!process.env.NEXT_PUBLIC_SERVER_URL) return;
      const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/project/get`;
      try {
        accessToken = await getToken();
        if (!accessToken) return;

        const { data } = await axios.get<ServerResponse>(url, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (data.status === "true") {
          setIdeaName(data.project.projectName);
          setIdeaDesc(data.project.projectDescription.slice(0, 90));
          setLoading(false);
        } else {
          setLoading(false);
        }
      } catch (err) {
        if (axios.isAxiosError(err)) {
          const error = err as AxiosError<ServerResponse>;
          if (error.response?.data.err === "No project found") {
            setLoading(false);
          } else {
            void Router.reload();
          }
        }
      }
    };

    void getProject();
  }, []);

  return (
    <>
      {loading && (
        <div className="flex h-[100px] items-center justify-center bg-[#242E42] text-white">
          <Loader />
        </div>
      )}
      {!loading && (
        <div>
          <div className="mx-0 flex flex-col px-5 pb-16 md:mx-0 md:w-full md:items-center md:px-10 lg:mx-0 lg:w-full lg:items-center lg:px-20 ">
            <h1 className="pt-5 text-4xl font-bold text-white ">Submission</h1>
            <div className="px-30 w-full">
              <div className="flex w-full flex-col items-start justify-between px-0 md:flex-row lg:flex-row">
                <p className="pb-3 pt-8 text-2xl font-bold text-white">
                  Idea Submission
                </p>
              </div>
              <div className="flex flex-wrap gap-5 py-4">
                {timeLeft.days === 0 ? null : (
                  <div className="flex flex-row items-end gap-2">
                    <span className="font-mono text-4xl ">
                      <span>
                        <p>{timeLeft.days}</p>
                      </span>
                    </span>
                    <p>days</p>
                  </div>
                )}
                <div className="flex flex-row items-end gap-2">
                  <span className="font-mono text-4xl ">
                    <span>
                      <p>{timeLeft.hours}</p>
                    </span>
                  </span>
                  <p>hours</p>
                </div>
                <div className="flex flex-row items-end gap-2">
                  <span className="font-mono text-4xl ">
                    <span>
                      <p>{timeLeft.minutes}</p>
                    </span>
                  </span>
                  <p>minutes</p>
                </div>
                <div className="flex flex-row items-end gap-2">
                  <span className="font-mono text-4xl ">
                    <span>
                      <p>{timeLeft.seconds}</p>
                    </span>
                  </span>
                  <p>seconds</p>
                </div>
              </div>
              <div className="flex w-full flex-col rounded-2xl bg-[#2F3B52] p-5">
                <div className="inset-0 flex flex-col rounded-2xl bg-[#20293C] px-5 py-5">
                  <p className="w-fit text-lg font-bold text-[#61BFE7] md:text-xl lg:text-xl">
                    {ideaName === ""
                      ? "No idea submitted"
                      : `${ideaName.toUpperCase()}`}
                  </p>
                  <p className="break-all">
                    {ideaDesc === "" ? "" : `${ideaDesc}...`}
                  </p>
                  {/* <p className="block md:hidden">{ideaDescMob === "" ? "" : `${ideaDescMob}...`}</p> */}
                </div>
                <button
                  type="button"
                  className="text-md bottom-0 right-0 my-4 w-[40vw] rounded-md bg-[#37ABBC]  px-3 py-3 font-semibold text-white shadow-sm transition-all hover:bg-[#288391] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#37ABBC]  md:w-64  lg:w-64"
                  onClick={() => {
                    router.push("/forms/IdeaForm");
                  }}
                >
                  {ideaName === "" ? "Submit an idea" : "Edit your idea"}
                </button>
              </div>

              {/* <div className="flex w-full flex-col items-start justify-between px-3 py-5 md:flex-row lg:flex-row">
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
              onClick={() => {
                router.push("/forms/ProjectForm");
              }}
            >
              Add a submision
            </button>
          </div> */}
            </div>
            <div className="py-10"></div>
          </div>
        </div>
      )}
    </>
  );
};

export default Submission;
