/* eslint-disable @next/next/no-page-custom-font */
import axios, { type AxiosError } from "axios";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { type ServerResponse } from "types/api";
import Head from "next/head";

export default function Home() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const searchParams = useSearchParams();

  const email = searchParams.get("email");
  const otp = searchParams.get("otp");

  const verify = async () => {
    setIsSubmitting(true);
    if (!email || !otp) {
      return;
    }
    if (!process.env.NEXT_PUBLIC_SERVER_URL) {
      return;
    }
    const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/users/verify`;
    try {
      const send = {
        email,
        otp,
      };
      await axios.post<ServerResponse>(url, send);
      setIsSubmitting(false);
      setMessage("Verified Successfuly!");
      setIsOpen(true);
      setIsSuccess(true);
      setTimeout(() => {
        setIsOpen(false);
        void router.push("/signin");
      }, 2000);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const error = err as AxiosError<ServerResponse>;
        if (error.response?.data.err === "OTP not found") {
          setMessage("OTP not found");
        } else if (error.response?.data.err === "User not found") {
          setMessage("User not found");
        } else if (error.response?.data.err === "Incorrect OTP") {
          setMessage("Incorrect OTP");
        } else {
          setMessage("Verification Failed! Please try again.");
        }
        setIsSuccess(false);
        setIsOpen(true);
        setIsSubmitting(false);
        setTimeout(() => {
          setIsOpen(false);
          void router.push("/signin");
        }, 2000);
      }
    }
  };

  return (
    <>
      <Head>
        <title>DEVSOC&apos;23 | Verify User</title>
        <meta name="description" content="DEVSOC'23 Verify User Page" />
        <link rel="icon" href="/devsoc.png" />
      </Head>
      <main className="absolute inset-0 flex items-center justify-center bg-[#242E42] text-white">
        <button
          onClick={() => {
            // console.log("clicked");
            void verify();
          }}
          disabled={isSubmitting}
          className={`rounded-md text-base ${
            isSubmitting
              ? "bg-[#288391] text-gray-400"
              : "bg-[#37ABBC] text-white hover:bg-[#288391]"
          } px-7 py-3 font-semibold  shadow-sm  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#37ABBC]`}
        >
          {isSubmitting ? "Verifying... " : "Verify"}
        </button>
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
