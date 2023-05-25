/* eslint-disable @next/next/no-page-custom-font */
import axios, { type AxiosError } from "axios";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { type ServerResponse } from "types/api";
import Head from "next/head";

export default function Home() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const searchParams = useSearchParams();

  const email = searchParams.get("email");
  const otp = searchParams.get("otp");

  const verify = async () => {
    if (!email || !otp) {
      return;
    }
    if (!process.env.NEXT_PUBLICSERVER_URL) return;
    const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/user/verifyotp`;
    try {
      const send = {
        email,
        otp,
      };
      const { data } = await axios.post<ServerResponse>(url, send);
      console.log(data);
      setMessage("Verified Successfuly!");
      setIsOpen(true);
      setIsSuccess(true);
      setTimeout(() => {
        setIsOpen(false);
        void router.push("/signin");
      }, 2500);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const error = err as AxiosError<ServerResponse>;
        if (error.response?.data.err === "OTP not found") {
          setMessage("OTP not found");
        } else if (error.response?.data.err === "Incorrect OTP") {
          setMessage("Incorrect OTP");
        } else {
          setMessage("Verification Failed! Please try again.");
        }
        setIsSuccess(false);
        setIsOpen(true);
        setTimeout(() => {
          setIsOpen(false);
          void router.push("/signin");
        }, 2500);
      }
    }
  };

  useEffect(() => {
    void verify();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Head>
        <title>DEVSoC&apos;23 | Verify User</title>
        <meta name="description" content="DevSoc'23 Sign Up Page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="absolute inset-0 flex items-center justify-center bg-[#242E42] text-white">
        Loading...
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
