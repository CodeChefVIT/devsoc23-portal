import Head from "next/head";
import Image, { type StaticImageData } from "next/image";
import { useState, useEffect, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tooltip } from "@nextui-org/react";

import Devsoc from "./../../assets/logo.png";

import Profile from "./../../assets/user-avatar.svg";
import Crown from "./../../assets/crown.svg";
import Leave from "./../../assets/leave.svg";
import Edit from "./../../assets/edit.svg";
import Submission from "./../components/submission";
import Tracks from "./../components/tracks";
import getToken from "~/utils/GetAccessToken";
import axios from "axios";
import { type ServerResponse } from "types/api";
import { setRevalidateHeaders } from "next/dist/server/send-payload";

interface Member {
  Id: string;
  firstName: string;
  lastName: string;
  isBoard: boolean;
  teamId: string;
}

const Dashboard = () => {
  const text = "#20293C";
  const [accessToken, setAccessToken] = useState<string | undefined>("");

  useEffect(() => {
    getToken()
      .then((token) => {
        setAccessToken(token);
        console.log(accessToken);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  //ui texts
  const [joinTeam, setJoinTeam] = useState("Enter a code to join a team");
  const [textCreate, setTextCreate] = useState("Create");
  const [isLeader, setIsleader] = useState<boolean | undefined>(false);
  const [teamName, setTeamName] = useState("");
  const [teamId, setTeamId] = useState<string>("");
  const [data, setData] = useState<ServerResponse | Record<string, never>>({});

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

  const handleInputBlur = () => {
    async function blur() {
      if (!accessToken) return;
      if (teamName.length === 0) {
        return;
      }
      try {
        if (!process.env.NEXT_PUBLIC_SERVER_URL) return;
        const url = `http://${process.env.NEXT_PUBLIC_SERVER_URL}/team/${teamId}`;

        const response = await axios.patch<ServerResponse>(
          url,
          { teamName },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

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
    }

    void blur();
  };

  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const checkIsMember = async () => {
      try {
        if (!process.env.NEXT_PUBLIC_SERVER_URL) return;
        if (!accessToken) return;

        const url = `http://${process.env.NEXT_PUBLIC_SERVER_URL}/team/ismember`;

        const response = await axios.get<ServerResponse>(url, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.status === 200) {
          setData(response.data);
          console.log(data);
          setHasTeam(response.data.inTeam);
          setIsleader(response.data.isTeamLeader);
          // setTeamId(response.data.memberDetails[0].teamId);
        } else {
          throw new Error("Couldn't fetch team data!");
        }
      } catch (error) {
        console.error(error);
      }
    };

    void checkIsMember();
  }, [accessToken]);

  const items: ReactNode = hasTeam
    ? data.memberDetails.map((member: Member) => (
        <div
          key={member.Id}
          className="md:pl-10 md:pr-20 lg:pl-10 lg:pr-20 mb-5 flex w-full flex-row items-center justify-between rounded-2xl bg-[#20293C] py-5 pl-5 pr-6"
        >
          <div className="md:mr-36  lg:mr-[30rem] mr-20 flex flex-row items-center">
            <Image
              src={Profile as StaticImageData}
              alt=""
              className="h-15 w-15 mr-3"
              width={40}
              height={40}
            />
            <p className="md:text-xl lg:text-xl text-lg font-bold text-[#61BFE7]">
              {member.firstName.toUpperCase()} {member.lastName.toUpperCase()}
            </p>
          </div>
          <div>
            {isLeader && (
              <Image
                src={Crown as StaticImageData}
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
          if (!process.env.NEXT_PUBLIC_SERVER_URL) return;
          if (!accessToken) return;

          const url = `http://${process.env.NEXT_PUBLIC_SERVER_URL}/team/join`;

          const response = await axios.post<ServerResponse>(
            url,
            { teamCode },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
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
  }, [accessToken, teamCode]);

  const handleClick = () => {
    try {
      void navigator.clipboard.writeText(text);
      console.log("Text copied to clipboard:", text);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  const handleLeaveTeam = () => {
    async function leave() {
      console.log("here");
      try {
        if (!process.env.NEXT_PUBLIC_SERVER_URL) return;
        if (!accessToken) return;

        const url = `http://${process.env.NEXT_PUBLIC_SERVER_URL}/team/leave`;

        const response = await axios.post<ServerResponse>(url, {
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
    }
    void leave();
  };

  const handleCreateTeam = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    async function create() {
      console.log(teamName);
      try {
        if (teamName.length === 0) return;
        console.log(accessToken);
        setTextCreate("Creating...");
        if (!process.env.NEXT_PUBLIC_SERVER_URL) return;
        if (!accessToken) return;

        const url = `http://${process.env.NEXT_PUBLIC_SERVER_URL}/team/create`;

        const response = await axios.post<ServerResponse>(
          url,
          { teamName: teamName },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        console.log(response.data);

        if (response.status === 200) {
          setTextCreate("Created!");
          setTeamName("");
          setJoinTeam("Successfully joined team!");
          setHasTeam(!hasTeam);
          window.location.reload();
        } else {
          throw new Error("Failed to join team");
        }
      } catch (error) {
        console.error(error);
      }
    }

    void create();
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
            <Image src={Devsoc} alt="" className="md:w-16 lg:w-16 w-16" />
          </a>
        </div>

        <div className="md:items-start md:px-10 lg:items-start lg:px-20 md:w[60vw] lg:w-[60vw] md:mx-20  lg:mx-20 mx-5 flex w-[80vw] flex-col px-5 pb-16 pt-16">
          <h1 className="pb-10 text-4xl font-bold text-white ">
            Team Information
          </h1>
          {hasTeam ? (
            <div className="md:px-10 lg:px-10 rounded-2xl bg-[#2F3B52] py-10 pl-5 pr-6">
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
                        {editMode ? (
                          //TODO: To change the icon to checkmark
                          <Image
                            src={Edit as StaticImageData}
                            alt=""
                            className="mx-3"
                          />
                        ) : (
                          <Image
                            src={Edit as StaticImageData}
                            alt=""
                            className="mx-3"
                          />
                        )}
                      </a>
                    </div>
                  ) : (
                    <div className="flex flex-row items-center justify-between">
                      {teamName}
                      <a className="cursor-pointer" onClick={handleEditClick}>
                        <Image
                          src={Edit as StaticImageData}
                          alt=""
                          className="mx-3"
                        />
                      </a>
                    </div>
                  )}
                </div>
              </div>
              <div>{items}</div>
              <div className="md:flex-col lg:flex-col flex w-full flex-row items-center justify-between">
                <div className="flex flex-col items-center py-3">
                  <Tooltip
                    content={"Copied to Clipboard"}
                    trigger="click"
                    color="primary"
                  >
                    <button
                      type="button"
                      className="text-md hover:bg-[#288391] w-64 rounded-md bg-[#37ABBC] px-10 py-3 font-semibold text-white shadow-sm transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
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
                      <Image
                        src={Leave as StaticImageData}
                        alt=""
                        className="h-15 w-15 mx-3"
                      />
                    </div>
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div className="md:px-10 lg:px-10 rounded-2xl bg-[#2F3B52] py-10 pl-5 pr-6">
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
                      <form>
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
                            value={teamName}
                            onChange={(event) =>
                              setTeamName(event.target.value)
                            }
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
                            onClick={handleCreateTeam}
                            className="text-md hover:bg-[#288391] rounded-md bg-[#37ABBC] px-8 py-3 font-semibold text-white shadow-sm transition-all"
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
              <div className="md:flex-row lg:flex-row flex flex-col justify-between">
                <div className="flex flex-col items-start justify-center py-3">
                  <button
                    type="button"
                    className="text-md hover:bg-[#288391] w-64 rounded-md bg-[#37ABBC] px-10 py-3 font-semibold text-white shadow-sm transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
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
                    className="sm:text-sm sm:leading-6 block w-64 min-w-0 flex-1 rounded-lg border-0 px-3 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
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
