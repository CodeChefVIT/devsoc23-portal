/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tooltip } from "@nextui-org/react";

import Devsoc from "./../../assets/logo.png";

import Profile from "./../../assets/user-avatar.svg";
import Crown from "./../../assets/crown.svg";
import Leave from "./../../assets/leave.svg";
import Edit from "./../../assets/edit.svg";
import Submission from "~/components/submission";
import Tracks from "~/components/tracks";

interface Member {
  Id: string;
  firstName: string;
  lastName: string;
  isBoard: boolean;
}

interface TeamData {
  inTeam: boolean;
  memberDetails: Member[];
}

const Dashboard: NextPage = () => {
  //consts
  const baseUrl = "http://64.227.160.53:8001";
  const text = "#20293C";
  const accessToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2ODQyNjQ3MjksImlhdCI6MTY4NDI2MTEyOSwibmJmIjoxNjg0MjYxMTI5LCJyb2xlIjoiQURNSU4iLCJzdWIiOiI2NDMxYmRhY2FlMTRjN2Y2OWQ5ZDY4N2MifQ.gdnARM5W8mu7ObVaQxcc0NGjF57LlpWxru6SD9ux1Fg";

  //ui texts
  const [joinTeam, setJoinTeam] = useState("Enter a code to join a team");
  const [textCreate, setTextCreate] = useState("Create");
  const [teamName, setTeamName] = useState("Cookoff");
  const [data, setData] = useState<TeamData>({
    inTeam: false,
    memberDetails: [],
  });
  const [teamId, setTeamId] = useState("");

  // toggle states
  const [teamCode, setTeamCode] = useState("");
  const [hasTeam, setHasTeam] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTeamName(event.target.value);
  };

  const handleInputBlur = async () => {
    if (teamName.length === 0) {
      return;
    }
    try {
      const response = await fetch(`${baseUrl}/team/6451526a919ee8659e2ac9a0`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ teamName: teamName }),
      });

      if (response.status === 200) {
        setEditMode(false);
        console.log("Successfully updated team!");
      } else {
        throw new Error("Failed to update team");
      }
    } catch (error) {
      console.error(error);
    }
    setEditMode(false);
  };

  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const checkIsMember = async () => {
      try {
        const response = await fetch(`${baseUrl}/team/ismember`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setData(data);
          setHasTeam(data.inTeam);
          console.log(data);
        } else {
          throw new Error("Couldn't fetch team data!");
        }
      } catch (error) {
        console.error(error);
      }
    };

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    checkIsMember();
  }, [baseUrl, accessToken]);

  const items = hasTeam
    ? data.memberDetails.map((member) => (
        <div
          key={member.Id}
          className="mb-5 flex flex-row items-center rounded-2xl bg-[#20293C] py-5 pl-5 pr-6 md:pl-10 md:pr-20 lg:pl-10 lg:pr-20"
        >
          <div className="mr-20  flex flex-row items-center md:mr-36 lg:mr-[30rem]">
            <Image
              src={Profile}
              alt=""
              className="h-15 w-15 mr-3"
              width={40}
              height={40}
            />
            <p className="text-lg text-[#376C82] md:text-xl lg:text-xl">
              {member.firstName} {member.lastName}
            </p>
          </div>
          <div>
            {member.isBoard && (
              <Image
                src={Crown}
                alt=""
                className="h-15 w-15"
                width={20}
                height={20}
              />
            )}
          </div>
        </div>
      ))
    : null;

  useEffect(() => {
    if (teamCode.length === 6) {
      const postData = async () => {
        try {
          console.log("send");
          setJoinTeam("Joining...");
          const response = await fetch(`${baseUrl}/team/join`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ teamCode }),
          });
          if (response.status === 200) {
            setJoinTeam("Successfully joined team!");
            window.location.reload();
          } else {
            throw new Error("Failed to join team");
          }
        } catch (error) {
          console.error(error);
        }
      };
      postData().catch((error) => console.error(error));
    }
  }, [teamCode]);

  const handleClick = async () => {
    try {
      await navigator.clipboard.writeText(text);
      console.log("Text copied to clipboard:", text);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  const handleLeaveTeam = async () => {
    console.log("here");
    try {
      const response = await fetch(`${baseUrl}/team/leave`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.status === 200) {
        setEditMode(false);
        console.log("Successfully left team!");
      } else {
        throw new Error("Failed to leave team");
      }
    } catch (error) {
      console.error(error);
    }
    setHasTeam(!hasTeam);
  };

  const handleCreateTeam = async () => {
    try {
      if (teamName.length === 0) return;
      setTextCreate("Creating...");
      const response = await fetch(`${baseUrl}/team/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ teamName: teamName }),
      });
      if (response.status === 200) {
        setTextCreate("Created!");
        await response.json();
        setJoinTeam("Successfully joined team!");
        setHasTeam(!hasTeam);
        window.location.reload();
      } else {
        throw new Error("Failed to join team");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Head>
        <title>Dashboard</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-h-screen overflow-x-hidden bg-[#242E42]">
        <div className="flex flex-col items-start justify-start pl-5 pt-5">
          <a className="cursor-pointer" href="/">
            <Image src={Devsoc} alt="" className="w-16 md:w-16 lg:w-16" />
          </a>
        </div>

        <div className="flex flex-col items-center px-5 pb-16 pt-16 md:items-start md:px-10 lg:items-start lg:px-20">
          <h1 className="pb-10 text-4xl font-bold text-white ">
            Team Information
          </h1>
          {hasTeam ? (
            <div className="rounded-2xl bg-[#2F3B52] py-10 pl-5 pr-6 md:px-10 lg:px-10">
              <div className="flex flex-row items-center justify-between">
                <div className="w-full pb-5 text-2xl font-bold text-white">
                  {editMode ? (
                    <div className="flex flex-row items-center justify-between text-gray-700">
                      <input
                        type="text"
                        value={teamName}
                        onChange={handleInputChange}
                        className="rounded-md bg-gray-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter team name..."
                      />

                      <a className="cursor-pointer" onClick={handleInputBlur}>
                        <Image src={Edit} alt="" className="mx-3" />
                      </a>
                    </div>
                  ) : (
                    <div className="flex flex-row items-center justify-between">
                      {teamName}
                      <a className="cursor-pointer" onClick={handleEditClick}>
                        <Image src={Edit} alt="" className="mx-3" />
                      </a>
                    </div>
                  )}
                </div>
              </div>
              <div>{items}</div>
              <div className="flex flex-col justify-between md:flex-row lg:flex-row">
                <div className="flex flex-col items-center justify-center py-3">
                  <Tooltip
                    content={"Copied to Clipboard"}
                    trigger="click"
                    color="primary"
                  >
                    <button
                      type="button"
                      className="text-md w-64 rounded-md bg-[#37ABBC] px-10 py-3 font-semibold text-white shadow-sm transition-all hover:bg-[#288391] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      onClick={handleClick}
                    >
                      {text}
                    </button>
                  </Tooltip>
                  <p className="py-1 text-white">
                    Use this code to invite people
                  </p>
                </div>
                <div className="w-10"></div>
                <div className="py-7">
                  <a onClick={handleLeaveTeam}>
                    <div className="flex cursor-pointer flex-row items-center justify-center">
                      <p className="pt-1 text-white transition-all hover:text-gray-300">
                        Leave Team
                      </p>
                      <Image src={Leave} alt="" className="h-15 w-15 mx-3" />
                    </div>
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl bg-[#2F3B52] py-10 pl-5 pr-6 md:px-10 lg:px-10">
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    className="fixed bottom-0 left-0 right-0 top-0 z-30 flex items-center justify-center bg-gray-500 bg-opacity-50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <motion.div
                      className="rounded-lg bg-[#242E42] p-8"
                      initial={{ y: "-100vh" }}
                      animate={{ y: 0 }}
                      exit={{ y: "-100vh" }}
                    >
                      <h2 className="mb-4 text-lg font-medium text-white">
                        Create a new team
                      </h2>
                      <form onSubmit={handleCreateTeam}>
                        <div className="mb-4">
                          <label
                            className="mb-2 block text-white"
                            htmlFor="team-name"
                          >
                            Team Name
                          </label>
                          <input
                            className="w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            type="text"
                            id="team-name"
                            name="team-name"
                            placeholder="Enter team name"
                            required
                          />
                        </div>
                        <div className="flex justify-end">
                          <button
                            type="button"
                            className="text-md mr-4 rounded-md bg-gray-400 px-8 py-3 font-semibold text-white shadow-sm transition-all hover:bg-gray-500"
                            onClick={togglePopup}
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="text-md rounded-md bg-[#37ABBC] px-8 py-3 font-semibold text-white shadow-sm transition-all hover:bg-[#288391]"
                            onClick={handleCreateTeam}
                          >
                            {textCreate}
                          </button>
                        </div>
                      </form>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
              <p className="py-3 text-xl font-bold text-white">
                Sorry you are not in any team!
              </p>
              <div className="flex flex-col justify-between md:flex-row lg:flex-row">
                <div className="flex flex-col items-start justify-center py-3">
                  <button
                    type="button"
                    className="text-md w-64 rounded-md bg-[#37ABBC] px-10 py-3 font-semibold text-white shadow-sm transition-all hover:bg-[#288391] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    onClick={togglePopup}
                  >
                    Create Team
                  </button>
                  <p className="py-1 pl-1 text-white">Become leader!</p>
                </div>
                <div className="w-36"></div>
                <div className="flex flex-col items-start justify-center py-3">
                  <input
                    type="text"
                    name="teamcode"
                    id="teamcode"
                    placeholder="Enter Code"
                    className="block w-64 min-w-0 flex-1 rounded-lg border-0 px-3 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    value={teamCode}
                    disabled={teamCode.length === 6}
                    onChange={(event) => setTeamCode(event.target.value)}
                  />
                  <p className="py-1 pl-1 text-white">{joinTeam}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <Tracks />

        <Submission />
      </main>
    </>
  );
};

export default Dashboard;
