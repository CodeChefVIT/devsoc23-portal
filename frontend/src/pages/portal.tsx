import { useState, useEffect } from "react";
import React from "react";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { IconContext } from "react-icons";
import FormData from "form-data";
import { useFormik } from "formik";
import { type Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";
import Router from "next/router";
import getToken from "~/utils/GetAccessToken";
import { type ApiResponse } from "types/api";
import axios, { type AxiosResponse } from "axios";
import Image, { type StaticImageData } from "next/image";

interface Values {
  firstName: string;
  lastName: string;
  bio: string;
  email: string;
  //password: string;
  phoneNumber: string;
  gender: string;
  college: string;
  dob: string;
}

function Portal() {
  const initialValues: Values = {
    firstName: "",
    lastName: "",
    bio: "",
    email: "",
    //password: "",
    phoneNumber: "",
    gender: "",
    college: "",
    dob: "",
  };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [message, setMessage] = useState("");

  let accessToken: string | undefined = "";
  const [dob, setValue] = React.useState<Dayjs | null>(null);

  // const portalSchema = Yup.object({
  //   firstName: Yup.string()
  //     .min(2)
  //     .max(25)
  //     .required("Please enter a First Name"),
  //   lastName: Yup.string().min(2).max(25).required("Please enter a Last Name"),
  //   bio: Yup.string().min(2).max(300).required("Please enter a valid bio"),
  //   email: Yup.string().email().required("Please enter a valid Email"),
  //   // password: Yup.string()
  //   //   .min(6)
  //   //   .max(20)
  //   //   .required("Please enter a valid Password"),
  //   phoneNumber: Yup.string()
  //     .min(10)
  //     .max(13)
  //     .required("Please enter a valid Phone Number"),
  //   gender: Yup.string().required("Please pick your Gender"),
  //   college: Yup.string()
  //     .min(2)
  //     .max(50)
  //     .required("Please enter a valid College Name"),
  //   dob: Yup.string().required("Please enter a valid Date of Birth"),
  // });

  const portalSchema = z.object({
    firstName: z.string().min(2).max(25).nonempty("Please enter a First Name"),
    lastName: z.string().min(2).max(25).nonempty("Please enter a Last Name"),
    bio: z.string().min(2).max(300).nonempty("Please enter a valid bio"),
    email: z.string().email("Please enter a valid Email").nonempty(),
    // password: z.string().min(6).max(20).nonempty("Please enter a valid Password"),
    phoneNumber: z
      .string()
      .min(10)
      .max(13)
      .nonempty("Please enter a valid Phone Number"),
    gender: z.string().nonempty("Please pick your Gender"),
    college: z
      .string()
      .min(2)
      .max(50)
      .nonempty("Please enter a valid College Name"),
    dob: z.string().nonempty("Please enter a valid Date of Birth"),
  });

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: toFormikValidationSchema(portalSchema),
    onSubmit: (values, action) => {
      setIsSubmitting(true);
      void submitUser(values);
      console.log(values);
      action.resetForm();
    },
  });

  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    formik;

  // const { values, submitForm } = useFormikContext();

  const getUser = async () => {
    if (!process.env.NEXT_PUBLIC_SERVER_URL) return;
    const url = `http://${process.env.NEXT_PUBLIC_SERVER_URL}/users/me`;
    try {
      accessToken = await getToken();
      if (!accessToken) return;
      // const response = await fetch(url, {
      //   method: "GET",
      //   headers: {
      //     "Content-Type": "application/json",
      //     Authorization: `Bearer ${accessToken}`,
      //   },
      // });
      const response: AxiosResponse<ApiResponse> = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = response.data.data;

      console.log(data);
      if (data.status) {
        values.firstName = data.user.firstName;
        values.lastName = data.user.lastName;
        values.bio = data.user.bio;
        values.email = data.user.email;
        values.gender = data.user.gender;
        values.phoneNumber = data.user.phoneNumber;
        values.college = data.user.college;
        values.dob = data.user.birthData;
        void formik.setValues(values);
        // data.setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (err) {
      console.log("err");
      // void Router.push("../");
    }
  };

  const submitUser = async (values: {
    firstName: string;
    lastName: string;
    bio: string;
    email: string;
    //password: string;
    phoneNumber: string;
    gender: string;
    college: string;
    dob: string;
  }) => {
    if (!process.env.NEXT_PUBLIC_SERVER_URL) return;
    const url = `http://${process.env.NEXT_PUBLIC_SERVER_URL}/users/update`;
    try {
      accessToken = await getToken();
      if (!accessToken) return;
      // const response = await fetch(url, {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //     Authorization: `Bearer ${accessToken}`,
      //   },
      //   body: JSON.stringify(values),
      // });
      const response: AxiosResponse<ApiResponse> = await axios.post(
        url,
        values,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      Router.reload();
      const data = response.data.data;
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

  const [selectedFile, setSelectedFile] = useState<File | undefined>();
  const [preview, setPreview] = useState<StaticImageData | string>();

  // const uploadedImage = useRef<HTMLInputElement>(null);
  const formData = new FormData();
  //console.log(uploadedImage.current);

  // const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const files = e.target.files;
  //   if (files === null) return;
  //   const file = files.item(0);
  //   if (file) {
  //     const reader = new FileReader();
  //     const { current } = uploadedImage;
  //     if (!current) return;
  //     current.files = file;
  //     reader.onload = (e) => {
  //       current.src = e.target.result;
  //     };
  //     reader.readAsDataURL(file);
  //     //console.log(uploadedImage);
  //   }
  // };

  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined);
      return;
    }

    setSelectedFile(e.target.files[0]);

    const file = e.target.files[0];
    formData.append("file", file);
    // console.log(file);
    // console.log(formData);
  };

  // console.log(errors);

  useEffect(() => {
    void getUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // const submitData = (values: FormData) => {
  //   console.log("It worked", values);
  // };

  return (
    <>
      <main>
        <div className="background-color: #242E42 md:px-[8rem] px-[2rem] pb-4 pt-[4rem]">
          <p className="text-4xl">Personal Information</p>
        </div>
        <div className="border-[2px] border-[#37ABBC]" />
        <form
          onSubmit={handleSubmit}
          className="md:px-[100px] max-w-4xl space-y-8 divide-y divide-gray-200 px-[50px] text-white"
        >
          <div className="space-y-8 divide-y divide-gray-200">
            <div className="pt-1">
              <div className="sm:col-span-6 pt-[20px]">
                <label
                  htmlFor="photo"
                  className="block text-sm font-medium leading-6 text-white"
                >
                  Photo
                </label>
                <div className="mt-2 flex items-center">
                  <span className="h-12 w-12 overflow-hidden rounded-full bg-gray-100">
                    {!selectedFile ? (
                      <svg
                        className="h-full w-full text-gray-300"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    ) : (
                      <Image
                        alt="preview"
                        src={preview as StaticImageData | string}
                        className="h-full w-full"
                      />
                    )}
                  </span>

                  <input
                    type="file"
                    id="upload"
                    className="ml-5 rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    onChange={onSelectFile}
                    hidden
                  />
                  <label htmlFor="upload">
                    <IconContext.Provider value={{ color: "#37ABBC" }}>
                      <AiOutlineCloudUpload className="pl-3 text-4xl" />
                    </IconContext.Provider>
                  </label>
                </div>
              </div>

              <div className="sm:grid-cols-6 mt-6 grid grid-cols-1 gap-x-4 gap-y-6">
                <div className="sm:col-span-3">
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium leading-6 text-white"
                  >
                    First name
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="firstName"
                      id="firstName"
                      autoComplete="given-name"
                      value={values.firstName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="sm:text-sm sm:leading-6 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                    />
                    {errors.firstName && touched.firstName ? (
                      <span className="form-error">
                        First Name should be atleast 2 characters
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium leading-6 text-white"
                  >
                    Last name
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="lastName"
                      id="lastName"
                      autoComplete="lastName"
                      value={values.lastName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="sm:text-sm sm:leading-6 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                    />
                    {errors.lastName && touched.lastName ? (
                      <span className="form-error">
                        Last Name should be atleast 2 characters
                      </span>
                    ) : null}
                  </div>
                </div>

                {/* bio / Bio */}
                <div className="sm:col-span-6">
                  <label
                    htmlFor="bio"
                    className="block text-sm font-medium leading-6 text-white"
                  >
                    About
                  </label>
                  <div className="mt-2">
                    <textarea
                      id="bio"
                      name="bio"
                      rows={3}
                      value={values.bio}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="sm:py-1.5 sm:text-sm sm:leading-6 block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                      // defaultValue={""}
                    />
                  </div>
                  <p className="mt-2 text-sm text-[#37ABBC]">
                    Write a few sentences about yourself.
                  </p>
                  {errors.bio && touched.bio ? (
                    <span className="form-error">
                      bio must be atleast 2 characters
                    </span>
                  ) : null}
                </div>

                {/* <div className="sm:col-span-3">
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium leading-6 text-white"
                  >
                    First name
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="firstName"
                      id="firstName"
                      autoComplete="given-name"
                      value={values.firstName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium leading-6 text-white"
                  >
                    Last name
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="lastName"
                      id="lastName"
                      autoComplete="lastName"
                      value={values.lastName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div> */}

                <div className="sm:col-span-6">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium leading-6 text-white"
                  >
                    Email
                  </label>
                  <div className="mt-2">
                    <input
                      type="email"
                      name="email"
                      id="email"
                      autoComplete="email"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="sm:text-sm sm:leading-6 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                    />
                    {errors.email && touched.email ? (
                      <span className="form-error">Email must be valid</span>
                    ) : null}
                  </div>
                </div>

                {/* <div className="sm:col-span-3">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium leading-6 text-white"
                  >
                    Password
                  </label>
                  <div className="mt-2">
                    <input
                      type="password"
                      name="password"
                      id="password"
                      autoComplete=""
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                    {errors.password && touched.password ? (
                      <span className="form-error">
                        Password must be atleast 6 characters
                      </span>
                    ) : null}
                  </div>
                </div> */}

                <div className="sm:col-span-6">
                  <label
                    htmlFor="phoneNumber"
                    className="block text-sm font-medium leading-6 text-white"
                  >
                    Phone Number
                  </label>
                  <div className="mt-2">
                    <input
                      type="tel"
                      name="phoneNumber"
                      id="phoneNumber"
                      autoComplete=""
                      value={values.phoneNumber}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="sm:text-sm sm:leading-6 lg:w-[49%] block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                    />
                    {errors.phoneNumber && touched.phoneNumber ? (
                      <span className="form-error">
                        Phone number must be atleast 10 characters
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="sm:col-span-6">
                  <label
                    htmlFor="gender"
                    className="block text-sm font-medium leading-6 text-white"
                  >
                    Gender
                  </label>
                  <div className="mt-2">
                    <select
                      id="gender"
                      name="gender"
                      autoComplete="gender"
                      value={values.gender}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="sm:text-sm sm:leading-6  block w-[50%] rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 "
                    >
                      <option value="" label="Choose your gender" />
                      <option value="Male" label="Male" />
                      <option value="Female" label="Female" />
                      <option
                        value="Prefer Not to Say"
                        label="Prefer Not to Say"
                      />
                    </select>
                    {errors.gender && touched.gender ? (
                      <span className="form-error">{errors.gender}</span>
                    ) : null}
                  </div>
                </div>

                {/* <div className="sm:col-span-6">
                  <label
                    htmlFor="street-address"
                    className="block text-sm font-medium leading-6 text-white"
                  >
                    Education
                  </label>
                </div> */}
                <div className="sm:col-span-3">
                  <label
                    htmlFor="college"
                    className="block text-sm font-medium leading-6 text-white"
                  >
                    College Name
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="college"
                      id="college"
                      autoComplete=""
                      value={values.college}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="sm:text-sm sm:leading-6 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                    />
                    {errors.college && touched.college ? (
                      <span className="form-error">
                        College Name must be atleast 2 characters
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="dob"
                    className="block text-sm font-medium leading-6 text-white"
                  >
                    DOB
                  </label>
                  <div className="mt-2">
                    <LocalizationProvider
                      name="dob"
                      className="sm:text-sm sm:leading-6 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                      dateAdapter={AdapterDayjs}
                    >
                      <DatePicker
                        format="DD-MM-YYYY"
                        sx={{
                          svg: { color: "white" },
                        }}
                        value={dob}
                        onChange={(newValue) => {
                          setValue(newValue);
                          void formik.setValues({ ...values, dob: newValue });
                        }}
                      />
                    </LocalizationProvider>
                    {errors.dob && touched.dob ? (
                      <span className="form-error">{errors.dob}</span>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-5">
            <div className="flex justify-start">
              <button
                type="button"
                className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="ml-3 inline-flex justify-center rounded-md bg-[#37ABBC] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Save
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
    </>
  );
}

export default Portal;
