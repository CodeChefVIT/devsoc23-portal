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

export default function Home() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const checkEmail = () => {
    const email = localStorage.getItem("email");
    if (!email) {
      router.push("/");
    }
  };

  const passwordSchema = z
    .object({
      otp: z
        .string({
          required_error: "Required",
          invalid_type_error: "OTP must be a string",
        })
        .min(6, "OTP must be 6 characters long")
        .max(6, "OTP must be 6 characters long"),
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
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    });

  const formik = useFormik({
    initialValues: {
      otp: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: toFormikValidationSchema(passwordSchema),
    validateOnChange: true,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        if (!process.env.NEXT_PUBLIC_SERVER_URL) return;
        const send = {
          email: localStorage.getItem("email"),
          otp: values.otp,
          newpass: values.password,
        };
        await axios.post<ServerResponse>(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/users/forgot`,
          send
        );
        setIsSubmitting(false);
        setIsSuccess(true);
        setIsOpen(true);
        setMessage("Password changed successfully!");
        localStorage.clear();
        setTimeout(() => {
          setIsOpen(false);
        }, 2000);
        setTimeout(() => {
          router.push("/signin");
        }, 2000);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          const error = err as AxiosError<ServerResponse>;
          if (error.response?.data.err === "Email not found") {
            setMessage("Email not found");
          } else if (error.response?.data.err === "OTP not found") {
            setMessage("OTP not found! Please try again");
            localStorage.clear();
            router.push("/forgotpassword");
          } else if (error.response?.data.err === "Incorrect OTP") {
            setMessage("Incorrect OTP");
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
    checkEmail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    formik;
  return (
    <>
      <Head>
        <title>DEVSOC&apos;23 | Set New Password</title>
        <meta name="description" content="DEVSOC'23 Set New Password Page" />
        <link rel="icon" href="/devsoc.png" />
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
          <div className="mx-12 mt-24 lg:ml-32 lg:mr-0">
            <h1 className="font-spacegrostesk text-2xl font-bold text-white md:text-5xl ">
              Welcome to DEVSOC<span className="text-teal-500">&apos;23</span>
            </h1>
            <h6 className="font-metropolis text-xl font-extralight text-white md:text-3xl">
              Forgot Password
            </h6>
          </div>
          <form
            onSubmit={handleSubmit}
            className="mx-12 mb-8 flex max-w-4xl flex-col space-y-4 text-white md:block lg:mx-0 lg:ml-32 lg:pl-0 lg:pr-20"
          >
            <div className="space-y-8 ">
              <div className="pt-1">
                <div className="mt-6 grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-6">
                  <div className="sm:col-span-5 xl:col-span-4">
                    <label
                      htmlFor="otp"
                      className="block text-sm font-medium leading-6 text-white"
                    >
                      OTP
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        name="otp"
                        id="otp"
                        value={values.otp}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="OTP"
                        className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#37ABBC] sm:text-sm sm:leading-6 ${
                          touched.otp && errors.otp
                            ? "ring-2 ring-inset ring-red-500"
                            : ""
                        }`}
                      />
                      <span className="text-sm text-red-500">
                        {touched.otp && errors.otp}
                      </span>
                    </div>
                  </div>
                  <div className="sm:col-span-5 xl:col-span-4">
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
                        }`}
                      />
                      <span className="text-sm text-red-500">
                        {touched.password && errors.password}
                      </span>
                    </div>
                  </div>
                  <div className="sm:col-span-5 xl:col-span-4">
                    <label
                      htmlFor="email"
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
                        className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#37ABBC] sm:text-sm sm:leading-6 ${
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

                  <div className="flex sm:col-span-5 xl:col-span-4">
                    <Link href="/signin" className="ml-auto">
                      Back to log in
                    </Link>
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
              } px-7 py-3 font-semibold  shadow-sm  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#37ABBC]`}
            >
              {isSubmitting ? "Reseting..." : "Reset Password"}
            </button>
          </form>
        </div>
        <div className="right fixed bottom-0 right-0 top-0 flex w-0 overflow-hidden lg:w-[35%]">
          {/* <Image alt="" src={saturnpng} className="h-64 w-64" />
          <Image alt="" src={starspng}  /> 
          <Image alt="" src={astropng} />
          <Image alt="" src={marspng} /> */}
        </div>
      </div>
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
    </>
  );
}
