import { Inter } from 'next/font/google'

import styles from '../styles/forgotpassword.module.css'
import { useFormik } from 'formik'
import { z } from 'zod'
import { toFormikValidationSchema } from 'zod-formik-adapter';
import axios from 'axios';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const inter = Inter({ subsets: ['latin'] })

export default function Home() {

  const router = useRouter();

  const validateSchema = z.object({
    email: z.string({ required_error: "Required", invalid_type_error: "Email must be a string" }).email("Enter a valid email"),
  })

  const [isOpen, setIsOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [message, setMessage] = useState("");

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: toFormikValidationSchema(validateSchema),
    onSubmit: async (e) => {
      axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/users/forgot/mail`, { email: formik.values.email })
        .then((e) => {
          const status = e.data.status
          if (status === 'false') {
            setTimeout(() => {
              setIsOpen(true)
              setIsSuccess(false)
              setMessage(e.data.err)
            }, 0);
            setTimeout(() => {
              setIsOpen(false)
            }, 1500);
          }
          else {
            setTimeout(function () {
              setIsSuccess(true)
              setIsOpen(true)
              setMessage(e.data.message)
            }, 0);
            setTimeout(function () {
              setIsOpen(false)
            }, 1500);
            setTimeout(function () {
              localStorage.setItem("email", formik.values.email)
              router.push("/setnewpassword")
            }, 2000);
          }
        })
        .catch((e) => {
          if (e.message != "Request failed with status code 400") {
            setTimeout(() => {
              setIsOpen(true)
              setIsSuccess(false)
              setMessage(e.message)
            }, 0);
            setTimeout(() => {
              setIsOpen(false)
            }, 1500);
          }
          else {
            setTimeout(() => {
              setIsOpen(true)
              setIsSuccess(false)
              setMessage(e.response.data.err)
            }, 0);
            setTimeout(() => {
              setIsOpen(false)
            }, 1500);
          }
        })
    }
  })
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" />
      <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk&display=swap" rel="stylesheet" />
      <div className={styles.maincontainer}>
        <div className={styles.leftcontainer}>
          <img src="devsoc.png" className={styles.devsoclogo} />
          <h1 className='font-spacegrostesk'>Welcome to DevSoc<span className='text-teal-500'>'23</span></h1>
          <h6 className='font-metropolis'>Forgot<span className='ml-2 text-teal-700'>Password</span></h6>
          <form className='font-metropolis' onSubmit={formik.handleSubmit}>
            <div className={styles.formcontainer}>
              <label>Email</label>
              <input type='email' placeholder='user@email.com' name='email' onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.email} className={(formik.touched.email && formik.errors.email) ? styles.erroremailinput : styles.emailinput}></input>
              {formik.touched.email && formik.errors.email ? <span>{formik.errors.email}</span> : null}
              <button type='submit' className={'bg-teal-200 hover:cursor-pointer'}>Reset</button>
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
      </div>
    </>
  )
}
