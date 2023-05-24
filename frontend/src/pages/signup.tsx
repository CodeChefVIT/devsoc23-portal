/* eslint-disable @next/next/no-page-custom-font */
// import { Inter } from "next/font/google";

import { useFormik } from "formik";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";
import axios from "axios";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { type ServerResponse } from "types/api";
// import { Router } from 'next/router';

import devsocpng from "../../public/devsoc.png";
import starspng from "../../public/stars.png";
import saturnpng from "../../public/saturn.png";
import astropng from "../../public/astro.png";
import marspng from "../../public/mars.png";
import stars from "../components/stars.svg";
import Image from "next/image";
import Head from "next/head";

export default function Home() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVITian, setIsVITian] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const userSchema = z.object({
    firstName: z
      .string({
        required_error: "Required",
        invalid_type_error: "First name must be a string",
      })
      .min(2, "First name must have min 2 chars")
      .max(20, "First name must have max 20 chars"),
    lastName: z
      .string({
        required_error: "Required",
        invalid_type_error: "Last name must be a string",
      })
      .min(2, "Last name must have min 2 chars")
      .max(20, "Last name must have max 20 chars"),
    email: z
      .string({
        required_error: "Required",
        invalid_type_error: "Email must be a string",
      })
      .email("Enter a valid email"),
    password: z
      .string({
        required_error: "Required",
        invalid_type_error: "Password must be a string",
      })
      .regex(
        /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
        "Password should contain atleast 8 characters, 1 uppercase, 1 lowercase, 1 number and 1 special character"
      ),
    confirmPassword: z.string({
      required_error: "Required",
      invalid_type_error: "Confirm password must be a string",
    }),
    phoneNumber: z
      .string({
        required_error: "Required",
        invalid_type_error: "Phone number must be a string",
      })
      .min(13, "Phone number must have min 13 chars")
      .max(13, "Phone number must have max 13 chars"),
    gender: z
      .literal("Male")
      .or(z.literal("Female"))
      .or(z.literal("Prefer Not to Say")),
    bio: z.string({
      required_error: "Required",
      invalid_type_error: "Bio must be a string",
    }),
    college: z.literal("VIT").or(z.literal("Others")),
    birthDate: z
      .string({
        required_error: "Required",
        invalid_type_error: "Birth date must be a string",
      })
      .regex(
        /^(19|20)\d{2}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/,
        "Enter a valid date"
      ),
    mode: z.literal("online").or(z.literal("offline")),
  });

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      phoneNumber: "",
      gender: "",
      bio: "",
      college: "",
      birthDate: "",
      mode: "",
    },
    validationSchema: toFormikValidationSchema(userSchema),
    validateOnChange: true,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        if (!process.env.NEXT_PUBLIC_SERVER_URL) return;
        const { data } = await axios.post<ServerResponse>(
          `http://${process.env.NEXT_PUBLIC_SERVER_URL}/users/signup`,
          values
        );

        if (data.status === "false") {
          setTimeout(() => {
            setIsOpen(true);
            setIsSuccess(false);
            setMessage(data.err);
          }, 0);
          setTimeout(() => {
            setIsOpen(false);
          }, 1500);
        } else {
          setTimeout(() => {
            setIsSuccess(true);
            setIsOpen(true);
            setMessage("Account successfully created!");
          }, 0);
          setTimeout(() => {
            setIsOpen(false);
          }, 1500);
          setTimeout(() => {
            router.push("/signin");
          }, 2000);
        }
      } catch (error) {
        setIsSubmitting(false);
        setIsOpen(true);
        setIsSuccess(false);
        setMessage("Something went wrong. Please try again later");
        setTimeout(() => {
          setIsOpen(false);
        }, 2000);
      }
    },
  });

  useEffect(() => {
    if (formik.values.college === "VIT") {
      setIsVITian(true);
      void formik.setFieldValue("mode", "offline");
    } else {
      setIsVITian(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik.values.college]);

  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    formik;
  return (
    <>
      <Head>
        <title>DEVSoC&apos;23 | Sign Up</title>
        <meta name="description" content="DevSoc'23 Sign Up Page" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk&display=swap"
          rel="stylesheet"
        />
      </Head>
      <div className="stars flex min-h-screen items-center scroll-smooth border-l-8 border-[#37ABBC]">
        <div className="flex w-full flex-col lg:w-[65%]">
          <Image
            src={devsocpng}
            alt="devsoc logo"
            className="absolute left-0 top-0 m-4 h-16 w-16"
          />
          <div className="mx-auto mt-24 lg:ml-32 lg:mr-0">
            <h1 className="font-spacegrostesk text-2xl font-bold text-white md:text-5xl ">
              Welcome to DEVSoC<span className="text-teal-500">&apos;23</span>
            </h1>
            <h6 className="font-metropolis text-xl font-extralight text-white md:text-3xl">
              <span className="text-teal-700">Create an account</span> or{" "}
              <Link
                href="/signin"
                className="delay-70 ease-in-out hover:text-teal-500 hover:transition"
              >
                log in
              </Link>
            </h6>
          </div>
          <form
            onSubmit={handleSubmit}
            className="mx-auto mb-8 max-w-4xl space-y-8 text-white  lg:mx-0 lg:ml-32 lg:pl-0 lg:pr-20"
          >
            <div className="space-y-8 divide-y divide-gray-200">
              <div className="pt-1">
                <div className="mt-6 grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-6">
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
                        autoComplete="firstName"
                        value={values.firstName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="First Name"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />

                      <span className="text-sm text-red-500">
                        {touched.firstName && errors.firstName}
                      </span>
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
                        placeholder="Last Name"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                      <span className="text-sm text-red-500">
                        {touched.lastName && errors.lastName}
                      </span>
                    </div>
                  </div>

                  <div className="sm:col-span-3">
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
                        placeholder="Email"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                      <span className="text-sm text-red-500">
                        {touched.email && errors.email}
                      </span>
                    </div>
                  </div>

                  <div className="sm:col-span-3">
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
                        autoComplete="password"
                        value={values.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Password"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                      <span className="text-sm text-red-500">
                        {touched.password && errors.password}
                      </span>
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label
                      htmlFor="phoneNumber"
                      className="block text-sm font-medium leading-6 text-white"
                    >
                      Phone Number (with country code)
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        name="phoneNumber"
                        id="phoneNumber"
                        autoComplete="phoneNumber"
                        value={values.phoneNumber}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="+91-1234567890"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                      <span className="text-sm text-red-500">
                        {touched.phoneNumber && errors.phoneNumber}
                      </span>
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm font-medium leading-6 text-white"
                    >
                      Confirm Password
                    </label>
                    <div className="mt-2">
                      <input
                        type="password"
                        name="confirmPassword"
                        id="confirmPassword"
                        value={values.confirmPassword}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Confirm Password"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                      <span className="text-sm text-red-500">
                        {touched.confirmPassword && errors.confirmPassword}
                      </span>
                    </div>
                  </div>

                  <div className="sm:col-span-3">
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
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 "
                      >
                        <option value="" label="Choose your gender" />
                        <option value="Male" label="Male" />
                        <option value="Female" label="Female" />
                        <option
                          value="Prefer Not to Say"
                          label="Prefer Not to Say"
                        />
                      </select>
                      <span className="text-sm text-red-500">
                        {touched.gender && errors.gender}
                      </span>
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label
                      htmlFor="birthDate"
                      className="block text-sm font-medium leading-6 text-white"
                    >
                      Date of Birth
                    </label>
                    <div className="mt-2">
                      <input
                        type="date"
                        name="birthDate"
                        id="birthDate"
                        value={values.birthDate}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                      <span className="text-sm text-red-500">
                        {touched.birthDate && errors.birthDate}
                      </span>
                    </div>
                  </div>

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
                        placeholder="Write a few setences about yourself"
                        value={values.bio}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:py-1.5 sm:text-sm sm:leading-6"
                        // defaultValue={""}
                      />
                    </div>
                    <span className="text-sm text-red-500">
                      {touched.bio && errors.bio}
                    </span>
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
                      University Name
                    </label>
                    <div className="mt-2">
                      <select
                        id="college"
                        name="college"
                        value={values.college}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 "
                      >
                        <option value="" label="Choose your university" />
                        <option value="VIT" label="VIT" />
                        <option value="Others" label="Other" />
                      </select>
                      <span className="text-sm text-red-500">
                        {touched.college && errors.college}
                      </span>
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label
                      htmlFor="mode"
                      className="block text-sm font-medium leading-6 text-white"
                    >
                      Mode of Participation
                    </label>
                    <div className="mt-2">
                      <select
                        disabled={isVITian}
                        id="mode"
                        name="mode"
                        value={values.mode}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 "
                      >
                        <option
                          value=""
                          label="Choose your mode of participation"
                        />
                        <option value="online" label="Online" />
                        <option value="offline" label="Offline" />
                      </select>
                      <span className="text-sm text-red-500">
                        {touched.mode && errors.mode}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className={`text-md rounded-md ${
                isSubmitting
                  ? "bg-[#288391] text-gray-400"
                  : "bg-[#37ABBC] text-white hover:bg-[#288391]"
              } px-7 py-3 font-semibold  shadow-sm  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
            >
              {isSubmitting ? "Submitting... " : "Submit"}
            </button>
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
        </div>
        <div className="fixed right-0 top-0 bottom-0 flex w-0 lg:w-[35%] overflow-hidden">
          {/* <Image alt="" src={saturnpng} className="h-64 w-64" />
          <Image alt="" src={starspng}  /> 
          <Image alt="" src={astropng} />
          <Image alt="" src={marspng} /> */}
        </div>
      </div>
    </>
  );
}
