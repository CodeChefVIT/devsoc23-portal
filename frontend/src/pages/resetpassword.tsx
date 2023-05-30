/* eslint-disable @next/next/no-page-custom-font */
import { useFormik } from "formik";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";
import axios, { type AxiosError } from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { type ServerResponse } from "types/api";
import Head from "next/head";
import getToken from "~/utils/GetAccessToken";

export default function Home() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  let accessToken: string | undefined = "";

  const resetPassSchema = z
    .object({
      oldpass: z
        .string({
          required_error: "Required",
          invalid_type_error: "Password must be a string",
        })
        .regex(
          /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
          "Password should contain atleast 8 characters, 1 uppercase, 1 lowercase, 1 number and 1 special character"
        ),
      newpass: z
        .string({
          required_error: "Required",
          invalid_type_error: "Password must be a string",
        })
        .regex(
          /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
          "Password should contain atleast 8 characters, 1 uppercase, 1 lowercase, 1 number and 1 special character"
        ),
      confirmnewpass: z.string({
        required_error: "Required",
        invalid_type_error: "Password must be a string",
      }),
    })
    .refine((data) => data.newpass === data.confirmnewpass, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    });

  const formik = useFormik({
    initialValues: {
      oldpass: "",
      newpass: "",
      confirmnewpass: "",
    },
    validationSchema: toFormikValidationSchema(resetPassSchema),
    validateOnChange: true,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        if (!process.env.NEXT_PUBLIC_SERVER_URL) return;
        accessToken = await getToken();
        if (!accessToken) {
          return;
        }
        await axios.post<ServerResponse>(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/users/reset`,
          values,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setIsSubmitting(false);
        setIsSuccess(true);
        setIsOpen(true);
        setMessage("Password changed successfully!");
        setTimeout(() => {
          setIsOpen(false);
        }, 2000);
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          const error = err as AxiosError<ServerResponse>;
          if (
            error.response?.data.err ===
            "Old password and New password cannot be the same"
          ) {
            setMessage("Old password and New password cannot be the same");
          } else if (error.response?.data.err === "Old password is incorrect") {
            setMessage("Old password is incorrect");
          } else if (
            error.response?.data.err === "User not found" ||
            error.response?.data.err === "User does not exist"
          ) {
            // setMessage("Incorrect OTP");
            localStorage.clear();
            router.push("/signin");
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
  return (
    <>
      <Head>
        <title>DEVSOC&apos;23 | Reset Password</title>
        <meta name="description" content="DEVSOC'23 Reset Password Page" />
        <link rel="icon" href="/devsoc.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk&display=swap"
          rel="stylesheet"
        />
      </Head>
      <main>
        <div className="background-color: #242E42 px-[50px] pb-4 pt-[4rem] md:px-[100px]">
          <p className="text-4xl">Reset Password</p>
        </div>
        <div className="border-[2px] border-[#37ABBC]" />
        <form
          onSubmit={handleSubmit}
          className="max-w-4xl space-y-8 px-[50px] text-white md:px-[100px]"
        >
          <div className="space-y-8 ">
            <div className="pt-1">
              <div className="mt-6 grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-6">
                <div className="sm:col-span-5 xl:col-span-4">
                  <label
                    htmlFor="oldpass"
                    className="block text-sm font-medium leading-6 text-white"
                  >
                    Current Password
                  </label>
                  <div className="mt-2">
                    <input
                      type="password"
                      name="oldpass"
                      id="oldpass"
                      value={values.oldpass}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Current Password"
                      className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#37ABBC] sm:text-sm sm:leading-6 ${
                        touched.oldpass && errors.oldpass
                          ? "ring-2 ring-inset ring-red-500"
                          : ""
                      }`}
                    />
                    <span className="text-sm text-red-500">
                      {touched.oldpass && errors.oldpass}
                    </span>
                  </div>
                </div>
                <div className="sm:col-span-5 xl:col-span-4">
                  <label
                    htmlFor="newpass"
                    className="block text-sm font-medium leading-6 text-white"
                  >
                    New Password
                  </label>
                  <div className="mt-2">
                    <input
                      type="password"
                      name="newpass"
                      id="newpass"
                      value={values.newpass}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="New Password"
                      className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#37ABBC] sm:text-sm sm:leading-6 ${
                        touched.newpass && errors.newpass
                          ? "ring-2 ring-inset ring-red-500"
                          : ""
                      }`}
                    />
                    <span className="text-sm text-red-500">
                      {touched.newpass && errors.newpass}
                    </span>
                  </div>
                </div>
                <div className="sm:col-span-5 xl:col-span-4">
                  <label
                    htmlFor="confirmnewpass"
                    className="block text-sm font-medium leading-6 text-white"
                  >
                    Confirm New Password
                  </label>
                  <div className="mt-2">
                    <input
                      type="password"
                      name="confirmnewpass"
                      id="confirmnewpass"
                      value={values.confirmnewpass}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Password"
                      className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#37ABBC] sm:text-sm sm:leading-6 ${
                        touched.confirmnewpass && errors.confirmnewpass
                          ? "ring-2 ring-inset ring-red-500"
                          : ""
                      }`}
                    />
                    <span className="text-sm text-red-500">
                      {touched.confirmnewpass && errors.confirmnewpass}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="py-5">
            <div className="flex justify-start">
              <button
                disabled={isSubmitting}
                type="submit"
                className={`text-md rounded-md ${
                  isSubmitting
                    ? "bg-[#288391] text-gray-400"
                    : "bg-[#37ABBC] text-white hover:bg-[#288391]"
                } px-7 py-3 font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#37ABBC]`}
              >
                {isSubmitting ? "Saving... " : "Save Changes"}
              </button>
              <button
                onClick={() => {
                  void router.push("/dashboard");
                }}
                type="button"
                className="text-md ml-3 rounded-md border border-gray-300 bg-transparent px-10 py-3 font-semibold shadow-sm hover:border-transparent hover:bg-[#288391] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#37ABBC]"
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
