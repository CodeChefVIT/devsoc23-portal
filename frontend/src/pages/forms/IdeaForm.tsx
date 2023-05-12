/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import Head from "next/head";
import { useState, useEffect } from "react";
import { z } from "zod";
import Router from "next/router";
import { useFormik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import getToken from "~/utils/GetAccessToken";

const IdeaForm = () => {
  const initialValues = {
    projectName: "",
    projectTrack: "Select a track",
    projectDescription: "",
    projectFigmaLink: "",
    projectDriveLink: "",
  };
  const [loading, setLoading] = useState(false);
  const [firstTime, setFirstTime] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [message, setMessage] = useState("");

  let accessToken = "";

  const getProject = async () => {
    const url = `http://${process.env.NEXT_PUBLIC_SERVER_URL}/project/get`;
    try {
      accessToken = await getToken();
      const response: Response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      if (data.status === "true") {
        void formik.setValues({
          projectName: data.project.projectName,
          projectTrack: data.project.projectTrack,
          projectDescription: data.project.projectDescription,
          projectFigmaLink: data.project.projectFigmaLink,
          projectDriveLink: data.project.projectDriveLink,
        });
        setFirstTime(false);
        setLoading(false);
      } else {
        setFirstTime(true);
        setLoading(false);
      }
    } catch (err) {
      void Router.push("../");
    }
  };

  const projectSchema = z.object({
    projectName: z
      .string({
        required_error: "Project name is required",
        invalid_type_error: "Project name must be a string",
      })
      .max(15, { message: "Project name cannot be more than 15 characters" }),
    projectTrack: z
      .literal("Finance")
      .or(z.literal("Healthcare"))
      .or(z.literal("Track 3")),
    projectDescription: z
      .string({
        required_error: "Project description is required",
        invalid_type_error: "Project description must be a string",
      })
      .min(100, {
        message: "Description should be between 100 to 500 characters",
      })
      .max(500, {
        message: "Description should be between 100 to 500 characters",
      }),
    projectFigmaLink: z
      .string({
        required_error: "Figma link is required",
        invalid_type_error: "Figma link must be a string",
      })
      .url({ message: "Please enter a valid url" })
      .includes("figma.com", { message: "Please enter a figma link" }),
    projectDriveLink: z
      .string({
        required_error: "Google Drive link is required",
        invalid_type_error: "Google Drive link must be a string",
      })
      .url({ message: "Please enter a valid url" })
      .includes("google.com", {
        message: "Please enter a google drive link",
      }),
  });

  const submitProject = async (values: {
    projectName: string;
    projectTrack: string;
    projectDescription: string;
    projectFigmaLink: string;
    projectDriveLink: string;
  }) => {
    const url = `http://${process.env.NEXT_PUBLIC_SERVER_URL}/project/${
      firstTime ? "idea" : "update"
    }`;
    try {
      accessToken = await getToken();
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(values),
      });
      const data = await response.json();
      if (data.status === "true") {
        setIsSubmitting(false);
        setIsOpen(true);
        setIsSuccess(true);
        setMessage("Changes saved successfully");
        setTimeout(() => {
          setIsOpen(false);
        }, 2000);
      } else {
        setIsSubmitting(false);
        setIsOpen(true);
        setIsSuccess(false);
        setMessage("Something went wrong. Please try again later");
        setTimeout(() => {
          setIsOpen(false);
        }, 2000);
      }
    } catch (err) {
      setIsSubmitting(false);
      setIsOpen(true);
      setIsSuccess(false);
      setMessage("Something went wrong. Please try again later");
      setTimeout(() => {
        setIsOpen(false);
      }, 2000);
    }
  };

  const formik = useFormik({
    initialValues,
    onSubmit: (values) => {
      setIsSubmitting(true);
      void submitProject(values);
    },
    validationSchema: toFormikValidationSchema(projectSchema),
    validateOnChange: true,
    enableReinitialize: true,
  });

  // const formChecker = () => {

  useEffect(() => {
    void getProject();
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <Head>
        <title>DEVSOC&apos;23 | Idea Submission</title>
        <meta name="description" content="Idea Submission for DEVSOC'23" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {loading && (
        <main className="absolute inset-0 flex items-center justify-center bg-[#242E42] text-white">
          Loading...
        </main>
      )}
      {!loading && (
        <main className="bg-[#242E42] text-white">
          <div className="px-[2rem] pt-[4rem] pb-4 md:px-[8rem]">
            <p className="text-4xl">Post your Idea</p>
          </div>
          <div className="border-[2px] border-[#37ABBC]" />
          <form
            className="px-[2rem] md:px-[8rem]"
            onSubmit={formik.handleSubmit}
            noValidate
          >
            <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              {/* projectName */}
              <div className="col-span-4">
                <label
                  htmlFor="projectName"
                  className="text-md block pb-1 font-medium leading-6"
                >
                  Name of your project*
                </label>
                <div className="mt-2 flex rounded-lg shadow-sm">
                  <input
                    required
                    type="text"
                    name="projectName"
                    id="projectName"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.projectName}
                    placeholder="Enter your project name"
                    className={`block w-full min-w-0 flex-1 rounded-lg py-1.5 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6 ${
                      formik.touched.projectName && formik.errors.projectName
                        ? "border-2 border-red-500"
                        : ""
                    }`}
                  />
                </div>
                <label htmlFor="projectName" className="text-sm text-red-500">
                  {formik.touched.projectName && formik.errors.projectName}
                </label>
              </div>

              {/* projectTrack */}
              <div className="col-span-3">
                <label
                  htmlFor="projectTrack"
                  className="text-md block font-medium leading-6"
                >
                  Track*
                </label>
                <div className="col-span-3 mt-2">
                  <select
                    id="projectTrack"
                    name="projectTrack"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.projectTrack}
                    className={`block rounded-md py-1.5 text-gray-900 sm:text-sm sm:leading-6 ${
                      formik.touched.projectTrack && formik.errors.projectTrack
                        ? "border-b-2 border-red-500"
                        : ""
                    }`}
                  >
                    <option disabled>Select a track</option>
                    <option>Finance</option>
                    <option>Healthcare</option>
                    <option>Track 3</option>
                  </select>
                </div>
                <label htmlFor="projectTrack" className="text-sm text-red-500">
                  {formik.touched.projectTrack && formik.errors.projectTrack}
                </label>
              </div>

              {/* projectDescription */}
              <div className="col-span-4">
                <label
                  htmlFor="projectDescription"
                  className="text-md -mb-1 block font-medium leading-6"
                >
                  About your project*
                </label>
                <p className="mt-2 pb-2 text-sm text-gray-300">
                  Don&apos;t forget to include your inspiration, learnings,
                  project construction method, and difficulties you encountered
                  in your writing.
                </p>
                <div className="mt-2">
                  <textarea
                    id="projectDescription"
                    name="projectDescription"
                    placeholder="Write a brief description of your project"
                    rows={20}
                    className={`block w-full min-w-0 flex-1 rounded-lg py-1.5 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6 ${
                      formik.touched.projectDescription &&
                      formik.errors.projectDescription
                        ? "border-2 border-red-500"
                        : ""
                    }`}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.projectDescription}
                  />
                </div>
                <label
                  htmlFor="projectDescription"
                  className="text-sm text-red-500"
                >
                  {formik.touched.projectDescription &&
                    formik.errors.projectDescription}
                </label>
              </div>

              {/* projectFigmaLink */}
              <div className="col-span-4">
                <label
                  htmlFor="projectFigmaLink"
                  className="text-md -mb-1 block font-medium leading-6"
                >
                  Figma Link*
                </label>
                <p className="mt-2 pb-1 text-sm text-gray-300">
                  Make sure to give viewing permissions (Enter NA if not
                  available).
                </p>
                <div className="mt-2 flex rounded-lg shadow-sm">
                  <input
                    required
                    type="text"
                    name="projectFigmaLink"
                    id="projectFigmaLink"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.projectFigmaLink}
                    placeholder="https://www.figma.com/example"
                    className={`block w-full min-w-0 flex-1 rounded-lg py-1.5 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6 ${
                      formik.touched.projectFigmaLink &&
                      formik.errors.projectFigmaLink
                        ? "border-2 border-red-500"
                        : ""
                    }`}
                  />
                </div>
                <label
                  htmlFor="projectFigmaLink"
                  className="text-sm text-red-500"
                >
                  {formik.touched.projectFigmaLink &&
                    formik.errors.projectFigmaLink}
                </label>
              </div>

              {/* projectDriveLink */}
              <div className="col-span-4">
                <label
                  htmlFor="projectDriveLink"
                  className="text-md -mb-1 block font-medium leading-6"
                >
                  Any Other Documents?
                </label>
                <p className="mt-2 pb-1 text-sm text-gray-300">
                  Upload everything to a Google Drive folder and share the link
                  (Enter NA if not available).
                </p>
                <div className="mt-2 flex rounded-lg shadow-sm">
                  <input
                    required
                    type="text"
                    name="projectDriveLink"
                    id="projectDriveLink"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.projectDriveLink}
                    placeholder="https://www.google.com/drive/example"
                    className={`block w-full min-w-0 flex-1 rounded-lg py-1.5 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6 ${
                      formik.touched.projectDriveLink &&
                      formik.errors.projectDriveLink
                        ? "border-2 border-red-500"
                        : ""
                    }`}
                  />
                </div>
                <label
                  htmlFor="projectDriveLink"
                  className="text-sm text-red-500"
                >
                  {formik.touched.projectDriveLink &&
                    formik.errors.projectDriveLink}
                </label>
              </div>
            </div>

            <div className="py-10">
              <div className="flex justify-start">
                <button
                  disabled={isSubmitting}
                  type="submit"
                  className={`text-md rounded-md ${
                    isSubmitting
                      ? "bg-[#288391] text-gray-400"
                      : "bg-[#37ABBC] text-white hover:bg-[#288391]"
                  } py-3 px-7 font-semibold  shadow-sm  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
                >
                  {isSubmitting ? "Saving... " : "Save Changes"}
                </button>
                <button
                  type="button"
                  className="text-md ml-3 rounded-md border border-gray-300 bg-transparent py-3 px-10 font-semibold shadow-sm hover:border-transparent hover:bg-[#288391]"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
          {isOpen && (
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
              <button className="flex-shrink-0" onClick={()=>{setIsOpen(false)}}>
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

export default IdeaForm;
