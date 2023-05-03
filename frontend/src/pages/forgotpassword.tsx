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
      email: "",
    },
    validationSchema: toFormikValidationSchema(validateSchema),
    onSubmit: async (e) => {
      axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/users/forgot/mail`, { email: formik.values.email })
        .then((e) => {
          const status = e.data.status
          if (status === 'false') {
            setSuccessSnack(false)
            showSnackbar(e.data.err, 1500);
          }
          else {
            setSuccessSnack(true)
            setTimeout(function () {
              showSnackbar(e.data.message, 1500);
            }, 0);
            setTimeout(function () {
              localStorage.setItem("email", formik.values.email)
              router.push("/setnewpassword")
            }, 2000);
          }
        })
        .catch((e) => {
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
        {sucessSnack ? <div id="snackbar" className={"w-fit h-fit bg-green-400 border-green-800 text-black-700 border px-4 py-3 rounded transition invisible fixed bottom-4 left-4"} role='alert'>
          Snackbar message here.
        </div> : <div id="snackbar" className={"w-fit h-fit bg-red-100 border-red-400 text-red-700 border px-4 py-3 rounded transition invisible fixed bottom-4 left-4"} role='alert'>
          Snackbar message here.
        </div>}
      </div>
    </>
  )
}
