import { Inter } from "next/font/google";

import styles from "../styles/setnewpassword.module.css";
import { useFormik } from "formik";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const router = useRouter();

  const checkEmail = () => {
    const email = localStorage.getItem("email");
    if (!email) {
      router.push("/");
    }
  };

  const validateSchema = z.object({
    otp: z.number({
      required_error: "Required",
      invalid_type_error: "Enter valid OTP",
    }),
    password: z
      .string({
        required_error: "Required",
        invalid_type_error: "Password must be a string",
      })
      .min(8, "Password should be between 8 and 20 characters")
      .max(20, "Password should be between 8 and 20 characters"),
  });

  const [isOpen, setIsOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [message, setMessage] = useState("");

  const formik = useFormik({
    initialValues: {
      otp: "",
      password: "",
    },
    validationSchema: toFormikValidationSchema(validateSchema),
    onSubmit: async (e) => {
      axios
        .post(`${process.env.NEXT_PUBLIC_SERVER_URL}/users/forgot`, {
          email: localStorage.getItem("email"),
          otp: formik.values.otp.toString(),
          newpass: formik.values.password,
        })
        .then((e) => {
          console.log(e);
          const status = e.data.status;
          if (status === "false") {
            setTimeout(() => {
              setIsOpen(true);
              setIsSuccess(false);
              setMessage(e.data.err);
            }, 0);
            setTimeout(() => {
              setIsOpen(false);
            }, 1500);
          } else {
            setTimeout(function () {
              setIsSuccess(true);
              setIsOpen(true);
              setMessage("Password changed successfully !");
            }, 0);
            setTimeout(function () {
              setIsOpen(false);
            }, 1500);
            setTimeout(function () {
              localStorage.clear();
              router.push("/signin");
            }, 2000);
          }
        })
        .catch((e) => {
          console.log(e);
          if (e.message != "Request failed with status code 400") {
            setTimeout(() => {
              setIsOpen(true);
              setIsSuccess(false);
              setMessage(e.message);
            }, 0);
            setTimeout(() => {
              setIsOpen(false);
            }, 1500);
          } else {
            setTimeout(() => {
              setIsOpen(true);
              setIsSuccess(false);
              setMessage(e.response.data.message);
            }, 0);
            setTimeout(() => {
              setIsOpen(false);
            }, 1500);
          }
        });
    },
  });

  useEffect(() => {
    checkEmail();
  }, []);

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" />
      <link
        href="https://fonts.googleapis.com/css2?family=Space+Grotesk&display=swap"
        rel="stylesheet"
      />
      <div className={styles.maincontainer}>
        <div className={styles.leftcontainer}>
          <img src="devsoc.png" className={styles.devsoclogo} />
          <h1 className="font-spacegrostesk">
            Welcome to DevSoc<span className="text-teal-500">'23</span>
          </h1>
          <h6 className="font-metropolis">
            Setting new<span className="ml-2 text-teal-700">password</span>
          </h6>
          <form className="font-metropolis" onSubmit={formik.handleSubmit}>
            <div className={styles.formcontainer}>
              <label>Enter OTP</label>
              <input
                type="number"
                placeholder="000000"
                name="otp"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.otp}
                className={
                  formik.touched.otp && formik.errors.otp
                    ? styles.errorotpinput
                    : styles.otpinput
                }
              ></input>
              {formik.touched.otp && formik.errors.otp ? (
                <span>{formik.errors.otp}</span>
              ) : null}
              <label>Password</label>
              <input
                type="password"
                placeholder="Password"
                name="password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
                className={
                  formik.touched.password && formik.errors.password
                    ? styles.errorpasswordinput
                    : styles.passwordinput
                }
              ></input>
              {formik.touched.password && formik.errors.password ? (
                <span>{formik.errors.password}</span>
              ) : null}
              <button
                type="submit"
                className={"bg-teal-200 hover:cursor-pointer"}
              >
                Change Password
              </button>
            </div>
          </form>
        </div>
        <div className={styles.rightcontainer}>
          <img src="saturn.png" className={styles.saturn} />
          <img src="stars.png" className={styles.stars} />
          <img src="astro.png" className={styles.astro} />
          <img src="mars.png" className={styles.mars} />
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
      </div>
    </>
  );
}
