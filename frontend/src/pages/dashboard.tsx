import Head from "next/head";
import Image, { type StaticImageData } from "next/image";
import { useState, useEffect, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tooltip } from "@nextui-org/react";
import { HiCheck } from "react-icons/hi";

import Devsoc from "./../../assets/logo.png";

// import Profile from "./../../assets/user-avatar.svg";
import Crown from "./../../assets/crown.svg";
import Leave from "./../../assets/leave.svg";
// import Edit from "./../../assets/edit.svg";
import Submission from "../components/submission";
// import Tracks from "./../components/tracks";
import getToken from "~/utils/GetAccessToken";
import axios, { type AxiosError } from "axios";
import { type ServerResponse } from "types/api";
import Link from "next/link";
import Loader from "~/components/Loader";
import Router from "next/router";
// import { setRevalidateHeaders } from "next/dist/server/send-payload";

interface Member {
  Id: string;
  firstName: string;
  lastName: string;
  isBoard: boolean;
  teamId: string;
}

const Dashboard = () => {
  // const text = "#20293C";
  const [accessToken, setAccessToken] = useState<string | undefined>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getToken()
      .then((token) => {
        setAccessToken(token);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [accessToken]);

  //ui texts
  const [joinTeam, setJoinTeam] = useState("Enter a code to join a team");
  const [inviteCode, setInviteCode] = useState("");
  const [textCreate, setTextCreate] = useState("Create");
  const [isLeader, setIsleader] = useState<boolean | undefined>(false);
  const [teamName, setTeamName] = useState("");
  const [teamId, setTeamId] = useState<string>("");
  const [data, setData] = useState<ServerResponse | Record<string, never>>({});
  const [teamLeaderId, setTeamLeaderId] = useState("");
  const [isdisabled, setIsDisabled] = useState(false);
  // const [isTeamNameValid, setIsTeamNameValid] = useState(true);

  // toggle states
  const [teamCode, setTeamCode] = useState("");
  const [hasTeam, setHasTeam] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  //snackbar
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [message, setMessage] = useState("");

  const [preview, setPreview] = useState<StaticImageData | string | undefined>(
    ""
  );

  let token: string | undefined = "";

  // const handleEditClick = () => {
  //   setEditMode(true);
  // };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // if (event.target.value.length > 15 || event.target.value.length < 3) {
    //   setIsTeamNameValid(false);
    //   return;
    // }
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
        const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/team/${teamId}`;

        const response = await axios.post<ServerResponse>(
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
          // console.log("Successfully updated team!");
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

  const getUser = async () => {
    if (!process.env.NEXT_PUBLIC_SERVER_URL) return;
    const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/users/me`;
    try {
      token = await getToken();
      if (!token) return;
      // const response = await fetch(url, {
      //   method: "GET",
      //   headers: {
      //     "Content-Type": "application/json",
      //     Authorization: `Bearer ${accessToken}`,
      //   },
      // });
      const { data } = await axios.get<ServerResponse>(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      // console.log(data);
      if (data.status) setPreview(data.user.image);
    } catch (err) {
      setIsOpen(true);
      setIsSuccess(false);
      setMessage("Something went wrong. Please try again later");
      setTimeout(() => {
        setIsOpen(false);
      }, 2000);
      // console.log("err");
      // void Router.push("../");
    }
  };

  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const checkIsMember = async () => {
      try {
        if (!process.env.NEXT_PUBLIC_SERVER_URL) return;
        if (!accessToken) return;

        const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/team/ismember`;

        const response = await axios.get<ServerResponse>(url, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.status === 200) {
          // console.log(data);
          setData(response.data);
          setHasTeam(response.data.inTeam);
          setTeamName(response.data.teamName);
          setInviteCode(response.data.inviteCode);
          setIsleader(response.data.isTeamLeader);
          setTeamId(response.data.teamId);
          setTeamLeaderId(response.data.teamLeader);
          // setLoading(false);
        } else {
          throw new Error("Couldn't fetch team data!");
        }
      } catch (error) {
        console.error(error);
      }
    };

    getUser()
      .then(void checkIsMember())
      .catch((error) => console.error(error));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  useEffect(() => {
    setLoading(false)
  }, [data]);

  const items: ReactNode = hasTeam
    ? data?.memberDetails.map((member: Member) => (
        <div
          key={member.Id}
          className="mb-5 flex w-full flex-row items-center justify-between rounded-2xl bg-[#20293C] py-5 pl-5 pr-6 md:pl-10 md:pr-20 lg:pl-10 lg:pr-20"
        >
          <div className="mr-20 flex flex-row items-center md:mr-20">
            {/* <Image
              src={Profile as StaticImageData}
              alt=""
              className="h-15 w-15 mr-3"
              width={40}
              height={40}
            /> */}
            <p className="w-fit text-lg font-bold text-[#61BFE7] md:text-xl lg:text-xl">
              {member.firstName.toUpperCase()} {member.lastName.toUpperCase()}
            </p>
          </div>
          <div>
            {member.Id == teamLeaderId && (
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
      setIsDisabled(true);
      const postData = async () => {
        try {
          // console.log("send");
          setJoinTeam("Joining...");
          if (!process.env.NEXT_PUBLIC_SERVER_URL) return;
          if (!accessToken) return;

          const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/team/join/${teamCode}`;

          const response = await axios.post<ServerResponse>(
            url,
            {},
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          if (response.status === 200) {
            setMessage("Successfully joined team!");
            setIsSnackbarOpen(true);
            setIsSuccess(true);
            setTimeout(() => {
              setIsSnackbarOpen(false);
              window.location.reload();
            }, 2000);
          } else if (response.status === 400) {
            setJoinTeam(response.data.err);
          } else {
            throw new Error("Failed to join team");
          }
        } catch (err) {
          if (axios.isAxiosError(err)) {
            const error = err as AxiosError<ServerResponse>;
            if (error.response?.data.err === "Id does not exist") {
              setMessage("Invalid Id");
            } else if (error.response?.data.err === "User not found") {
              setMessage("User not found");
            } else if (error.response?.data.err === "you are already in team") {
              setMessage("You are already in a team");
            } else if (error.response?.data.err === "Team not found") {
              setMessage("Team Not Found");
            } else if (
              error.response?.data.err ===
              "you cannot invite yourself for your team"
            ) {
              setMessage("You cannot invite yourself for your team");
            } else if (error.response?.data.err === "Team is full") {
              setMessage("Team is full");
            } else {
              setMessage("Something went wrong");
            }
          }
          setIsSnackbarOpen(true);
          setIsSuccess(false);
          setIsDisabled(false);
          setJoinTeam("Enter a code to join a team");
          setTimeout(() => {
            setIsSnackbarOpen(false);
          }, 2000);
        }
      };
      postData().catch((error) => console.error(error));
    }
  }, [accessToken, teamCode]);

  const handleClick = () => {
    try {
      void navigator.clipboard.writeText(inviteCode);
      // console.log("Text copied to clipboard:", inviteCode);
    } catch (err) {
      // console.error("Failed to copy text:", err);
    }
  };

  const handleLeaveTeam = () => {
    const confirm = window.confirm("Are you sure you want leave the team?");
    // console.log(confirm);
    if (!confirm) return;
    async function leave() {
      try {
        if (!process.env.NEXT_PUBLIC_SERVER_URL) return;
        if (!accessToken) return;

        const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/team/leave`;

        const response = await axios.post<ServerResponse>(
          url,
          {},
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (response.status === 200) {
          setEditMode(false);
          setHasTeam(!hasTeam);
          // console.log("Successfully left team!");
        } else {
          throw new Error("Failed to leave team");
        }
      } catch (error) {
        console.error(error);
      }
    }
    void leave();
  };

  // const logout = async () => {
  //   if (!process.env.NEXT_PUBLIC_SERVER_URL) return;
  //   const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/users/logout`;
  //   const rt = localStorage.getItem("refreshToken");
  //   if (!rt) {
  //     void Router.push("/signin");
  //   }
  //   try {
  //     await axios.post<ServerResponse>(url, {
  //       refreshToken: rt,
  //     });
  //     setMessage("Logged out successfully!");
  //     setIsOpen(true);
  //     setIsSuccess(true);
  //     localStorage.clear();
  //     setTimeout(() => {
  //       setIsOpen(false);
  //       void Router.push("/signin");
  //     }, 2000);
  //   } catch (err) {
  //     setMessage("Something went wrong. Please try again later");
  //     setIsOpen(true);
  //     setIsSuccess(false);
  //     setTimeout(() => {
  //       setIsOpen(false);
  //     }, 2000);
  //   }
  // };

  const logout = () => {
    localStorage.clear();
    void Router.push("/signin");
  };

  const handleCreateTeam = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    // console.log("team: " + teamName);
    if (teamName === undefined || teamName.length === 0) {
      alert("Team Name cannot be null!");
      return;
    } else if (teamName.length > 15) {
      alert("Team Name cannot be more than 15 characters");
      return;
    } else {
      const confirm = window.confirm(
        "Your team name will be: " +
          teamName +
          "\nAre you sure you want to create this team? \n(You cannot change your team name later)"
      );

      if (!confirm) return;

      async function create() {
        // console.log(teamName);
        try {
          if (teamName.length === 0) return;
          // console.log(accessToken);
          setTextCreate("Creating...");
          if (!process.env.NEXT_PUBLIC_SERVER_URL) return;
          if (!accessToken) return;

          const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/team/create`;

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
          // console.log(response.data);

          if (response.status === 200) {
            setTextCreate("Created!");
            setTeamName("");
            setJoinTeam("Successfully joined team!");
            setHasTeam(!hasTeam);
            setIsSnackbarOpen(true);
            setIsSuccess(true);
            setMessage("Team created successfully!");
            window.location.reload();
          } else {
            throw new Error("Failed to join team");
          }
        } catch (err) {
          setIsSnackbarOpen(true);
          setIsSuccess(false);
          setTextCreate("Create");
          if (axios.isAxiosError(err)) {
            const error = err as AxiosError<ServerResponse>;
            if (error.response?.data.err === "User not found") {
              setMessage("User not found");
            } else if (error.response?.data.err === "Already in team") {
              setMessage("You are already in a team");
            } else if (error.response?.data.err === "Name already exists") {
              setMessage("Team Name already exists");
            } else if (
              error.response?.data.err ===
              "you cannot invite yourself for your team"
            ) {
              setMessage("You cannot invite yourself for your team");
            } else if (error.response?.data.err === "Team is full") {
              setMessage("Team is full");
            } else {
              setMessage("Something went wrong");
            }
          }
        }
      }

      void create();
    }
  };

  return (
    <>
      <Head>
        <title>DEVSOC&apos;23 | Dashboard</title>
        <meta name="description" content="DEVSOC'23 Dashboard" />
        <link rel="icon" href="/devsoc.png" id="favicon" />
      </Head>
      {loading && (
        <main className="absolute inset-0 flex items-center justify-center bg-[#242E42] text-white">
          <Loader />
        </main>
      )}
      {!loading && (
        <main className="min-h-screen overflow-x-hidden bg-[#242E42]">
          <div className="mx-10 my-10 flex flex-row items-start justify-between">
            <Link className="cursor-pointer" href="/dashboard">
              <Image src={Devsoc} alt="" className="w-16 md:w-16 lg:w-16" />
            </Link>
            <div>
              <div className="flex flex-row items-center justify-between gap-4">
                <Link
                  className="cursor-pointer"
                  href="/profile"
                  title="Profile"
                >
                  <div className="h-12 w-12">
                    {!preview ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-full w-full"
                        viewBox="0 -960 960 960"
                        fill="currentColor"
                      >
                        <path d="M480-481q-66 0-108-42t-42-108q0-66 42-108t108-42q66 0 108 42t42 108q0 66-42 108t-108 42ZM160-160v-94q0-38 19-65t49-41q67-30 128.5-45T480-420q62 0 123 15.5t127.921 44.694q31.301 14.126 50.19 40.966Q800-292 800-254v94H160Zm60-60h520v-34q0-16-9.5-30.5T707-306q-64-31-117-42.5T480-360q-57 0-111 11.5T252-306q-14 7-23 21.5t-9 30.5v34Zm260-321q39 0 64.5-25.5T570-631q0-39-25.5-64.5T480-721q-39 0-64.5 25.5T390-631q0 39 25.5 64.5T480-541Zm0-90Zm0 411Z" />
                      </svg>
                    ) : (
                      <Image
                        src={preview as StaticImageData}
                        alt=""
                        className="h-full w-full rounded-full"
                        width={40}
                        height={40}
                      />
                    )}
                  </div>
                </Link>
                <div className="h-10 w-12" onClick={logout} title="">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-full w-full cursor-pointer"
                    viewBox="0 -960 960 960"
                    fill="currentColor"
                  >
                    <path
                      stroke="currentColor"
                      d="M180-120q-24 0-42-18t-18-42v-600q0-24 18-42t42-18h291v60H180v600h291v60H180Zm486-185-43-43 102-102H375v-60h348L621-612l43-43 176 176-174 174Z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="mx-0 flex w-full flex-col px-5 pb-16 pt-16  md:mx-0 md:w-full md:items-center md:px-10 lg:mx-0 lg:w-full lg:items-center lg:px-20">
            <h1 className="pb-10 text-center text-4xl font-bold text-white">
              Team Information
            </h1>
            {hasTeam ? (
              <div className="rounded-2xl bg-[#2F3B52] py-10 pl-5 pr-6 md:px-10 lg:px-10">
                <div className="flex flex-row items-center justify-between">
                  <div className="w-[80vw] pb-5 text-2xl font-bold text-white md:w-[60vw] lg:w-[60vw]">
                    {isLeader && editMode ? (
                      <div className="flex flex-row items-center justify-between text-gray-700">
                        <input
                          type="text"
                          value={teamName}
                          onChange={handleInputChange}
                          className="rounded-md bg-gray-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#37ABBC]"
                          placeholder="Enter team name..."
                        />

                        <a className="cursor-pointer" onClick={handleInputBlur}>
                          {editMode ? (
                            //TODO: To change the icon to checkmark
                            <HiCheck color="white" size={26} className="mx-3" />
                          ) : (
                            <HiCheck color="white" size={26} className="mx-3" />
                          )}
                        </a>
                      </div>
                    ) : (
                      <div className="flex flex-row items-center justify-between">
                        {teamName}
                        {/* {isLeader ? (
                          <a
                            className="cursor-pointer"
                            onClick={handleEditClick}
                          >
                            <Image
                              src={Edit as StaticImageData}
                              alt=""
                              className="mx-3"
                            />
                          </a>
                        ) : (
                          <></>
                        )} */}
                      </div>
                    )
                    }
                  </div>
                </div>
                <div>{items}</div>
                <div className="flex w-full flex-col items-center justify-between md:flex-row lg:flex-row">
                  <div className="flex flex-col items-center py-3">
                    <Tooltip
                      content={"Copied to Clipboard"}
                      trigger="click"
                      color="primary"
                    >
                      <button
                        type="button"
                        className="text-md w-[50vw] rounded-md bg-[#37ABBC] px-10 py-3 font-semibold text-white shadow-sm transition-all hover:bg-[#288391] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#37ABBC] md:w-96 lg:w-96"
                        onClick={handleClick}
                      >
                        #{inviteCode}
                      </button>
                    </Tooltip>
                    <p className="py-1 text-white">
                      Use this code to invite people
                    </p>
                  </div>
                  <div className="w-10"></div>
                  <div className="py-7">
                    <button onClick={handleLeaveTeam}>
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
                    </button>
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
                        className="rounded-lg bg-[#242E42] p-8 "
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
                              Team Name (Max 15 characters)
                            </label>
                            <input
                              className="w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#37ABBC]"
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
                              className="text-md mr-4 rounded-md bg-gray-400 px-8 py-3 font-semibold text-white shadow-sm transition-all hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#37ABBC]"
                              onClick={togglePopup}
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              onClick={handleCreateTeam}
                              className="text-md rounded-md bg-[#37ABBC] px-8 py-3 font-semibold text-white shadow-sm transition-all hover:bg-[#288391] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#37ABBC]"
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
                  <div className="flex flex-col items-center justify-center py-3">
                    <button
                      type="button"
                      className="text-md w-64 rounded-md bg-[#37ABBC] px-10 py-3 font-semibold text-white shadow-sm transition-all hover:bg-[#288391] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#37ABBC]"
                      onClick={togglePopup}
                    >
                      Create Team
                    </button>
                    <p className="py-1 pl-1 text-white">Become a leader!</p>
                  </div>
                  <div className="w-36"></div>
                  <div className="flex flex-col items-center justify-center py-3">
                    <input
                      type="text"
                      name="teamcode"
                      id="teamcode"
                      placeholder="Enter Code"
                      className="block w-64 min-w-0 flex-1 rounded-lg border-0 px-3 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#37ABBC] sm:text-sm sm:leading-6"
                      value={teamCode}
                      disabled={isdisabled}
                      onChange={(event) => setTeamCode(event.target.value)}
                    />
                    <p className="py-1 pl-1 text-white">{joinTeam}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          {/*<Tracks />*/}

          {hasTeam ? (
            <>
              <Submission />
            </>
          ) : (
            <></>
          )}

          {isSnackbarOpen && (
            <div
              className={`rounded-md ${
                isSuccess ? "bg-green-100" : "bg-red-50"
              } fixed bottom-2 right-1/2 mx-auto translate-x-1/2 p-4`}
            >
              <div className="flex items-center">
                <div className="mr-3">
                  <div
                    className={`text-sm ${
                      isSuccess ? "text-green-700" : "text-red-700"
                    }`}
                  >
                    <p>{message}</p>
                  </div>
                </div>
                <button
                  className="flex-shrink-0"
                  onClick={() => {
                    setIsOpen(false);
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke={`${isSuccess ? "green" : "red"}`}
                    className="h-6 w-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </main>
      )}
    </>
  );
};

export default Dashboard;
