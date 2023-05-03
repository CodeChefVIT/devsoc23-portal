import { Inter } from 'next/font/google'

import styles from '../styles/setnewpassword.module.css'
import { useFormik } from 'formik'
import { z } from 'zod'
import { toFormikValidationSchema } from 'zod-formik-adapter';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const inter = Inter({ subsets: ['latin'] })

export default function Home() {

  const router = useRouter();

  const validateSchema = z.object({
    otp: z.number({ required_error: "Required", invalid_type_error: "Enter valid OTP" }),
    password: z.string({ required_error: "Required", invalid_type_error: "Password must be a string" }).min(8, "Password should be between 8 and 20 characters").max(20, "Password should be between 8 and 20 characters")
  })

  const [sucessSnack, setSuccessSnack] = useState(false)

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
      otp: "",
      password: "",
    },
    validationSchema: toFormikValidationSchema(validateSchema),
    onSubmit: async (e) => {
      axios.patch(`${process.env.NEXT_PUBLIC_SERVER_URL}/users/forgot`, { email: localStorage.getItem("email"), otp: formik.values.otp, newpass: formik.values.password })
        .then((e) => {
          console.log(e)
          const status = e.data.status
          if (status === 'false') {
            setSuccessSnack(false)
            showSnackbar(e.data.err, 1500);
          }
          else {
            setSuccessSnack(true)
            showSnackbar("Password Changed Successfully", 1500);
            setTimeout(function () {
              router.push("/signin")
            }, 1500);
          }
        })
        .catch((e) => {
          console.log(e)
          setSuccessSnack(false)
          if (e.message != "Request failed with status code 400") {
            showSnackbar(e.message, 1500);
          }
          else {
            showSnackbar(e.response.data.err, 1500);
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
          <h6 className='font-metropolis'>Setting new<span className='ml-2 text-teal-700'>password</span></h6>
          <form className='font-metropolis' onSubmit={formik.handleSubmit}>
            <div className={styles.formcontainer}>
              <label>Enter OTP</label>
              <input type='number' placeholder='000000' name='otp' onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.otp} className={(formik.touched.otp && formik.errors.otp) ? styles.errorotpinput : styles.otpinput}></input>
              {formik.touched.otp && formik.errors.otp ? <span>{formik.errors.otp}</span> : null}
              <label>Password</label>
              <input type='password' placeholder='Password' name='password' onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.password} className={(formik.touched.password && formik.errors.password) ? styles.errorpasswordinput : styles.passwordinput}></input>
              {formik.touched.password && formik.errors.password ? <span>{formik.errors.password}</span> : null}
              <button type='submit' className={'bg-teal-200 hover:cursor-pointer'}>Change Password</button>
            </div>
          </form>
        </div>
        <div className={styles.rightcontainer}>
          <img src="saturn.png" className={styles.saturn} />
          <img src="stars.png" className={styles.stars} />
          <img src="astro.png" className={styles.astro} />
          <img src="mars.png" className={styles.mars} />
        </div>
        {sucessSnack ? <div id="snackbar" className={"w-fit h-fit bg-green-400 border-green-800 text-black-700 border px-4 py-3 rounded transition invisible fixed bottom-4 left-4"} role='alert'>
          Snackbar message here.
        </div> : <div id="snackbar" className={"w-fit h-fit bg-red-100 border-red-400 text-red-700 border px-4 py-3 rounded transition invisible fixed bottom-4 left-4"} role='alert'>
          Snackbar message here.
        </div>}
      </div>
    </>
  )
}
