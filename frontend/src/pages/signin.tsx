import { Inter } from 'next/font/google'

import styles from '../styles/signin.module.css'
import { useFormik } from 'formik'
import { z } from 'zod'
import { toFormikValidationSchema } from 'zod-formik-adapter';
import axios from 'axios';
import Link from 'next/link';
import { useState } from 'react';


export default function Home() {

  const validateSchema = z.object({
    email: z.string({ required_error: "Required", invalid_type_error: "Email must be a string" }).email("Enter a valid email"),
    password: z.string({ required_error: "Required", invalid_type_error: "Password must be a string" }).min(8, "Password should be between 8 and 20 characters").max(20, "Password should be between 8 and 20 characters")
  })

  const [sucessSnack,setSuccessSnack] = useState(false)

  const showSnackbar = (message, duration) => {
    var snackbar = document.getElementById("snackbar");
    snackbar.innerHTML = message;
    snackbar.classList.add("visible");
    snackbar.classList.remove("invisible");
    setTimeout(function () {
      snackbar.classList.remove("visible");
      snackbar.classList.add("invisible");
    }, duration);
  }

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: toFormikValidationSchema(validateSchema),
    onSubmit: async () => {
      axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/users/login`, { email: formik.values.email, password: formik.values.password })
        .then((e) => {
          console.log(e.data)
          if (e.data === 'fail') {
            setSuccessSnack(false)
            showSnackbar(e.data.err,800);
          }
          else {
            setSuccessSnack(true)
            showSnackbar("Successful ! Logging In",1000);
            localStorage.setItem("accessToken",e.data.token)
          }
        })
        .catch((e) => {
          setSuccessSnack(false)
          showSnackbar(e.response.data.err,1000);
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
          <h6 className='font-metropolis'>Create an account or<span className='ml-2 text-teal-700'>log in</span></h6>
          <form className='font-metropolis' onSubmit={formik.handleSubmit}>
            <div className={styles.formcontainer}>
              <label>Email</label>
              <input type='email' placeholder='user@email.com' name='email' onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.email} className={(formik.touched.email && formik.errors.email) ? styles.erroremailinput : styles.emailinput}></input>
              {formik.touched.email && formik.errors.email ? <span>{formik.errors.email}</span> : null}
              <label>Password</label>
              <input type='password' placeholder='Password' name='password' onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.password} className={(formik.touched.password && formik.errors.password) ? styles.errorpasswordinput : styles.passwordinput}></input>
              {formik.touched.password && formik.errors.password ? <span>{formik.errors.password}</span> : null}
              <Link href='/forgotpassword'>Forgot Password</Link>
              <button type='submit' className={'bg-teal-200 hover:cursor-pointer'}>Log in</button>
            </div>
          </form>
        </div>
        <div className={styles.rightcontainer}>
          <img src="saturn.png" className={styles.saturn} />
          <img src="stars.png" className={styles.stars} />
          <img src="astro.png" className={styles.astro} />
          <img src="mars.png" className={styles.mars} />
        </div>
      </div>
      <div id="snackbar" className={`w-fit (${sucessSnack} ? bg-green-400 : bg-red-100) (${sucessSnack} ? border-green-800 : border-red-400) (${sucessSnack} ? text-black-700 : text-red-700) border px-4 py-3 rounded transition invisible absolute bottom-4 left-4`} role='alert'>
        Snackbar message here.
      </div>
    </>
  )
}
