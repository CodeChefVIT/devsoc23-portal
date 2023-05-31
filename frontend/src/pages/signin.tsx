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
import getToken from "~/utils/GetAccessToken";
import Loader from "~/components/Loader";

export default function Home() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [loader, setLoader] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [isVerified, setIsVerified] = useState(true);

  const userSchema = z.object({
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
  });

  const resend = async () => {
    setIsResending(true);
    if (!process.env.NEXT_PUBLIC_SERVER_URL) {
      return;
    }
    const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/users/otp`;
    try {
      const send = {
        email: values.email,
      };
      await axios.post<ServerResponse>(url, send);
      setIsResending(false);
      setMessage("OTP sent successfully! Please check your email");
      setIsOpen(true);
      setIsSuccess(true);
      setTimeout(() => {
        setIsOpen(false);
      }, 2000);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const error = err as AxiosError<ServerResponse>;
        if (error.response?.data.err === "User not found") {
          setMessage("User not found");
        } else if (error.response?.data.err === "Could not set otp") {
          setMessage("Unable to send OTP. Please try again later");
        } else if (error.response?.data.err === "Failed to send OTP") {
          setMessage("Unable to send OTP. Please try again later");
        } else {
          setMessage("Something went wrong. Please try again later");
        }
        setIsSuccess(false);
        setIsOpen(true);
        setIsResending(false);
        setTimeout(() => {
          setIsOpen(false);
        }, 2000);
      }
    }
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: toFormikValidationSchema(userSchema),
    validateOnChange: true,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        if (!process.env.NEXT_PUBLIC_SERVER_URL) return;
        const { data } = await axios.post<ServerResponse>(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/users/login`,
          values
        );
        setIsSubmitting(false);
        setIsSuccess(true);
        setIsOpen(true);
        setMessage("Logged in successfully!");
        localStorage.setItem("refreshToken", data.token);
        setTimeout(() => {
          setIsOpen(false);
        }, 2000);
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          const error = err as AxiosError<ServerResponse>;
          if (error.response?.data.err === "User not found") {
            setMessage("User not found");
          } else if (error.response?.data.err === "User not verified") {
            setMessage("User not verified! Please verify your email.");
            setIsVerified(false);
          } else if (error.response?.data.err === "Wrong password") {
            setMessage("Wrong password");
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
  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    formik;

  useEffect(() => {
    if (localStorage.getItem("refreshToken")) {
      void getToken().then((res) => {
        if (res) {
          router.push("/dashboard");
        } else {
          setLoader(true);
        }
      });
    } else {
      setLoader(true);
    }
    //eslint-disable-next-line
  }, []);
  return (
    <>
      <Head>
        <title>DEVSOC&apos;23 | Sign In</title>
        <meta name="description" content="DEVSOC'23 Sign In Page" />
        <link rel="icon" href="/devsoc.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk&display=swap"
          rel="stylesheet"
        />
      </Head>
      {!loader ? (
        <main className="absolute inset-0 flex items-center justify-center bg-[#242E42] text-white">
          <Loader />
        </main>
      ) : (
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
              {/* <h6 className="font-metropolis text-xl font-extralight text-white md:text-3xl">
              <Link
                href="/signup"
                className="delay-70 ease-in-out hover:text-teal-500 hover:transition"
              >
                Create an account
              </Link>{" "}
              or <span className="text-teal-700">log in</span>
            </h6> */}
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
                          className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#37ABBC] sm:text-sm sm:leading-6 
                        ${
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

                    <div className="flex sm:col-span-5 xl:col-span-4">
                      <Link href="/forgotpassword" className="ml-auto">
                        Forgot Password?
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  void resend();
                }}
                type="button"
                className={`
              ${
                isVerified ? "hidden" : ""
              }  text-md rounded-md border border-gray-300 bg-transparent px-10 py-3 font-semibold shadow-sm hover:border-transparent hover:bg-[#288391] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#37ABBC]`}
              >
                {isResending ? "Resending..." : "Resend Verification Mail"}
              </button>
              <br />
              <button
                disabled={isSubmitting}
                type="submit"
                className={`${isVerified ? "" : "hidden"}
                text-md rounded-md ${
                  isSubmitting
                    ? "bg-[#288391] text-gray-400"
                    : "bg-[#37ABBC] text-white hover:bg-[#288391]"
                } px-7 py-3 font-semibold  shadow-sm  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#37ABBC]`}
              >
                {isSubmitting ? "Logging In... " : "Log In"}
              </button>
              <h6
                className={` ${
                  isVerified ? "md:inline" : "hidden md:hidden"
                } ml-8 font-metropolis text-xl font-extralight text-white md:text-base`}
              >
                <span>New Here?</span>{" "}
                <Link
                  href="/signup"
                  className="delay-70 ease-in-out text-[#288391] hover:text-[#288391] hover:transition"
                >
                  Sign up
                </Link>
              </h6>
            </form>
          </div>
          <div className="right fixed bottom-0 right-0 top-0 flex w-0 overflow-hidden lg:w-[35%]">
            {/* <Image alt="" src={saturnpng} className="h-64 w-64" />
          <Image alt="" src={starspng}  /> 
          <Image alt="" src={astropng} />
          <Image alt="" src={marspng} /> */}
          </div>
        </div>
      )}
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
