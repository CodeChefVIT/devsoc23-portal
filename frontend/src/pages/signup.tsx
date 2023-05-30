/* eslint-disable @next/next/no-page-custom-font */
import { useFormik } from "formik";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";
import axios, { type AxiosError } from "axios";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { type ServerResponse } from "types/api";
import devsocpng from "../../public/devsoc.png";
import Image from "next/image";
import Head from "next/head";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
// import { VisibilityIcon, VisibilityOffIcon } from "~/components/passwordIcons";

export default function Home() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVITian, setIsVITian] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isOtherCollege, setIsOtherCollege] = useState(false);
  const [age, setAge] = useState(21);

  const calculateAge = () => {
    const now = new Date(); //getting current date
    const currentY = now.getFullYear(); //extracting year from the date
    // const currentM = now.getMonth(); //extracting month from the date

    const dobget: string = (
      document.getElementById("birthDate") as HTMLInputElement
    ).value; //getting user input
    const dob = new Date(dobget); //formatting input as date
    const prevY = dob.getFullYear(); //extracting year from input date
    // const prevM = dob.getMonth(); //extracting month from input date

    const age = currentY - prevY;
    // const ageM = Math.abs(currentM - prevM); //converting any negative value to positive

    setAge(age);
    return;
  };

  const userSchema = z
    .object({
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
        .min(12, "Enter a valid phone number")
        .max(12, "Enter a valid phone number"),
      gender: z
        .literal("Male")
        .or(z.literal("Female"))
        .or(z.literal("Prefer Not to Say")),
      bio: z
        .string({
          required_error: "Required",
          invalid_type_error: "Bio must be a string",
        })
        .min(40, "Bio must have min 40 chars")
        .max(500, "Bio must have max 500 chars"),
      college: z.literal("VIT Vellore").or(z.literal("Others")),
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
      github: z
        .string({
          required_error: "Github Account is required",
          invalid_type_error: "Github Account must be a string",
        })
        .url({ message: "Please enter a valid url" })
        .includes("github.com", { message: "Please enter a github link" })
        .or(z.string().regex(/^NA$/)),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
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
      github: "",
      otherCollege: "",
    },
    validationSchema: toFormikValidationSchema(userSchema),
    validateOnChange: true,
    onSubmit: async (values) => {
      if (age < 16) {
        alert("You must be atleast 16 years old to register for DEVSOC'23");
        return;
      }
      setIsSubmitting(true);
      const send = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
        phoneNumber: values.phoneNumber,
        gender: values.gender,
        bio: values.bio,
        birthDate: values.birthDate,
        mode: values.mode,
        github: values.github,
        college: "",
      };
      if (values.college === "Others") send.college = values.otherCollege;
      else send.college = values.college;
      try {
        if (!process.env.NEXT_PUBLIC_SERVER_URL) return;
        await axios.post<ServerResponse>(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/users/signup`,
          send
        );
        setIsSubmitting(false);
        setIsSuccess(true);
        setIsOpen(true);
        setMessage("Signed up successfully! Please verify your email.");
        setTimeout(() => {
          setIsOpen(false);
        }, 2000);
        setTimeout(() => {
          router.push("/signin");
        }, 2000);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const err = error as AxiosError<ServerResponse>;
          if (err.response?.data.err === "Email already exists") {
            setMessage("Account already exists! Please Log in");
          } else {
            setMessage("Something went wrong. Please try again later");
          }
          setIsSubmitting(false);
          setIsOpen(true);
          setIsSuccess(false);
          setTimeout(() => {
            setIsOpen(false);
          }, 2000);
        }
      }
    },
  });

  useEffect(() => {
    if (formik.values.college === "VIT Vellore") {
      setIsVITian(true);
      setIsOtherCollege(false);
    } else if (formik.values.college === "Others") {
      setIsVITian(false);
      setIsOtherCollege(true);
      void formik.setFieldValue("mode", "online");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik.values.college]);

  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    formik;
  return (
    <>
      <Head>
        <title>DEVSOC&apos;23 | Sign Up</title>
        <meta name="description" content="DEVSOC'23 Sign Up Page" />
        <link rel="icon" href="/devsoc.png" id="favicon" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk&display=swap"
          rel="stylesheet"
        />
      </Head>
      <div className="stars flex min-h-screen items-center scroll-smooth ">
        <div className="flex w-full flex-col lg:w-[65%]">
          <Image
            src={devsocpng}
            alt="devsoc logo"
            className="absolute left-0 top-0 m-4 h-16 w-16"
          />
          <div className="mx-auto mt-24 lg:ml-32 lg:mr-0">
            <h1 className="font-spacegrostesk text-2xl font-bold text-white md:text-5xl ">
              Welcome to DEVSOC<span className="text-teal-500">&apos;23</span>
            </h1>
            {/* <h6 className="font-metropolis text-xl font-extralight text-white md:text-3xl">
              <span className="text-teal-700">Create an account</span> or{" "}
              <Link
                href="/signin"
                className="delay-70 ease-in-out hover:text-teal-500 hover:transition"
              >
                log in
              </Link>
            </h6> */}
          </div>
          <form
            onSubmit={handleSubmit}
            className="mx-12 mb-8 flex max-w-4xl flex-col space-y-8 text-white md:block  lg:mx-0 lg:ml-32 lg:pl-0 lg:pr-20"
          >
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
                      className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#37ABBC] sm:text-sm sm:leading-6 
                      ${
                        touched.firstName && errors.firstName
                          ? "ring-2 ring-inset ring-red-500"
                          : ""
                      }`}
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
                      className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#37ABBC] sm:text-sm sm:leading-6
                      ${
                        touched.lastName && errors.lastName
                          ? "ring-2 ring-inset ring-red-500"
                          : ""
                      }`}
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
                      className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#37ABBC] sm:text-sm sm:leading-6
                      ${
                        touched.email && errors.email
                          ? "ring-2 ring-inset ring-red-500"
                          : ""
                      }`}
                    />
                    <span className="text-sm text-red-500">
                      {touched.email && errors.email}
                    </span>
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label
                    htmlFor="phoneNumber"
                    className="block text-sm font-medium leading-6 text-white"
                  >
                    Phone Number
                  </label>
                  <div className="mt-2">
                    {/* <input
                        type="text"
                        name="phoneNumber"
                        id="phoneNumber"
                        autoComplete="phoneNumber"
                        value={values.phoneNumber}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="+91-1234567890"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#37ABBC] sm:text-sm sm:leading-6"
                      /> */}
                    <PhoneInput
                      country={"in"}
                      preferredCountries={["in"]}
                      value={values.phoneNumber}
                      onChange={(data) => {
                        void formik.setFieldValue("phoneNumber", data);
                      }}
                    />

                    <span className="text-sm text-red-500">
                      {touched.phoneNumber && errors.phoneNumber}
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
                      className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#37ABBC] sm:text-sm sm:leading-6 ${
                        touched.password && errors.password
                          ? "ring-2 ring-inset ring-red-500"
                          : ""
                      } `}
                    />
                    <span className="text-sm text-red-500">
                      {touched.password && errors.password}
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
                      className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#37ABBC] sm:text-sm sm:leading-6
                      ${
                        touched.confirmPassword && errors.confirmPassword
                          ? "ring-2 ring-inset ring-red-500"
                          : ""
                      }`}
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
                      required
                      className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#37ABBC] sm:text-sm sm:leading-6 ${
                        touched.gender && errors.gender
                          ? "ring-2 ring-inset ring-red-500"
                          : ""
                      }`}
                    >
                      <option disabled value="" label="Choose your gender" />
                      <option
                        value="Male"
                        label="Male"
                        className="text-black"
                      />
                      <option
                        value="Female"
                        label="Female"
                        className="text-black"
                      />
                      <option
                        value="Prefer Not to Say"
                        label="Prefer Not to Say"
                        className="text-black"
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
                      autoComplete="birthDate"
                      value={values.birthDate}
                      onChange={(e) => {
                        handleChange(e);
                        calculateAge();
                      }}
                      onBlur={handleBlur}
                      className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#37ABBC] sm:text-sm sm:leading-6 ${
                        touched.birthDate && errors.birthDate
                          ? "ring-2 ring-inset ring-red-500"
                          : ""
                      }`}
                    />
                    <span className="text-sm text-red-500">
                      {touched.birthDate && errors.birthDate}
                    </span>
                  </div>
                </div>

                <div className="sm:col-span-6">
                  <label
                    htmlFor="github"
                    className="block text-sm font-medium leading-6 text-white"
                  >
                    GitHub Profile (Enter NA if not applicable)
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="github"
                      id="github"
                      value={values.github}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="GitHub Profile"
                      className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#37ABBC] sm:text-sm sm:leading-6 ${
                        touched.github && errors.github
                          ? "ring-2 ring-inset ring-red-500"
                          : ""
                      }`}
                    />

                    <span className="text-sm text-red-500">
                      {touched.github && errors.github}
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
                      placeholder="Write a few sentences about yourself"
                      value={values.bio}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#37ABBC] sm:py-1.5 sm:text-sm sm:leading-6 ${
                        touched.bio && errors.bio
                          ? "ring-2 ring-inset ring-red-500"
                          : ""
                      }`}
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
                      required
                      value={values.college}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-[#37ABBC] sm:text-sm sm:leading-6 ${
                        touched.college && errors.college
                          ? "ring-2 ring-inset ring-red-500"
                          : ""
                      }`}
                    >
                      <option
                        disabled
                        value=""
                        label="Choose your university"
                      />
                      <option
                        value="VIT Vellore"
                        label="VIT Vellore"
                        className="text-black"
                      />
                      <option
                        value="Others"
                        label="Other"
                        className="text-black"
                      />
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
                      disabled={!isVITian}
                      id="mode"
                      name="mode"
                      required
                      value={values.mode}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-[#37ABBC] sm:text-sm sm:leading-6 ${
                        touched.mode && errors.mode
                          ? "ring-2 ring-inset ring-red-500"
                          : ""
                      }`}
                    >
                      <option
                        disabled
                        value=""
                        label="Choose your mode of participation"
                      />
                      <option
                        value="online"
                        label="Online"
                        className="text-black"
                      />
                      <option
                        value="offline"
                        label="Offline"
                        className="text-black"
                      />
                    </select>
                    <span className="text-sm text-red-500">
                      {touched.mode && errors.mode}
                    </span>
                  </div>
                </div>

                {isOtherCollege ? (
                  <div className="sm:col-span-6">
                    <label
                      htmlFor="otherCollege"
                      className="block text-sm font-medium leading-6 text-white"
                    >
                      College Name
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        name="otherCollege"
                        id="otherCollege"
                        value={values.otherCollege}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="College Name"
                        className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#37ABBC] sm:text-sm sm:leading-6 
                      ${
                        touched.otherCollege && errors.otherCollege
                          ? "ring-2 ring-inset ring-red-500"
                          : ""
                      }`}
                      />

                      <span className="text-sm text-red-500">
                        {touched.otherCollege && errors.otherCollege}
                      </span>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>

            <button
              disabled={isSubmitting}
              type="submit"
              className={`rounded-md text-base ${
                isSubmitting
                  ? "bg-[#288391] text-gray-400"
                  : "bg-[#37ABBC] text-white hover:bg-[#288391]"
              } px-7 py-3 font-semibold  shadow-sm  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#37ABBC]`}
            >
              {isSubmitting ? "Submitting... " : "Submit"}
            </button>
            <h6 className="ml-8 font-metropolis text-xl font-extralight text-white md:inline md:text-base">
              <span>Have an account?</span>{" "}
              <Link
                href="/signin"
                className="delay-70 text-[#288391] ease-in-out hover:text-[#288391] hover:transition"
              >
                Log in
              </Link>
            </h6>
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
                    // console.log(values.phoneNumber);
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
        <div className="right fixed bottom-0 right-0 top-0 flex w-0 overflow-hidden lg:w-[35%]">
          {/* <Image alt="" src={saturnpng} className="h-64 w-64" />
          <Image alt="" src={starspng}  /> 
          <Image alt="" src={astropng} />
          <Image alt="" src={marspng} /> */}
        </div>
      </div>
    </>
  );
}
