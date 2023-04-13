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

  const validateSchema = z.object({
    email: z.string({ required_error: "Required", invalid_type_error: "Email must be a string" }).email("Enter a valid email"),
  })
  const router = useRouter();
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
          if (status === 'fail') {
            setSuccessSnack(false)
            showSnackbar(e.data.err, 800);
          }
          else {
            setSuccessSnack(true)
            showSnackbar("Email Sent for Password Reset", 1000);
            localStorage.setItem("email", formik.values.email)
            router.push("/setnewpassword")
          }
        })
        .catch((e) => {
          setSuccessSnack(false)
          showSnackbar(e.response.data.err, 1000);
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
      </div>
      <div id="snackbar" className={`w-fit (${sucessSnack} ? bg-green-400 : bg-red-100) (${sucessSnack} ? border-green-800 : border-red-400) (${sucessSnack} ? text-black-700 : text-red-700) border px-4 py-3 rounded transition invisible absolute bottom-4 left-4`} role='alert'>
        Snackbar message here.
      </div>
    </>
  )
}
