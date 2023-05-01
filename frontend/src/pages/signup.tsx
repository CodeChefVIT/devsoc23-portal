import { Inter } from 'next/font/google'

import styles from '../styles/signup.module.css'
import { useFormik } from 'formik'
import { z } from 'zod'
import { toFormikValidationSchema } from 'zod-formik-adapter';
import axios from 'axios';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Router } from 'next/router';

export default function Home() {

    const router = useRouter();

    const validateSchema = z.object({
        firstname: z.string({ required_error: "Required", invalid_type_error: "First name must be a string" }),
        lastname: z.string({ required_error: "Required", invalid_type_error: "Last name must be a string" }),
        email: z.string({ required_error: "Required", invalid_type_error: "Email must be a string" }).email("Enter a valid email"),
        password: z.string({ required_error: "Required", invalid_type_error: "Password must be a string" }).min(8, "Password should be between 8 and 20 characters").max(20, "Password should be between 8 and 20 characters"),
        bio: z.string({ required_error: "Required", invalid_type_error: "Bio must be a string" }),
        gender: z.string({ required_error: "Required" }),
        collegename: z.string({ required_error: "Required", invalid_type_error: "College name must be a string" }).min(10, "College name must have min 10 chars"),
        birthday: z.string({ required_error: "Required", invalid_type_error: "Birthday must be selected" }),
        phonenumber: z.number({ required_error: "Required", invalid_type_error: "Phone no must be entered" })
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
            firstname: "",
            lastname: "",
            email: "",
            password: "",
            bio: "",
            gender: "",
            collegename: "",
            birthday: "",
            phonenumber: "",
        },
        validationSchema: toFormikValidationSchema(validateSchema),
        onSubmit: async () => {
            axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/users/signup`, { firstName: formik.values.firstname, lastName: formik.values.lastname, email: formik.values.email, password: formik.values.password, phoneNumber: "+" + formik.values.phonenumber.toString(), college: formik.values.collegename, collegeYear: "2021", bio: formik.values.bio, birthDate: formik.values.birthday })
                .then((e) => {
                    const status = e.data.status
                    if (status === 'false') {
                        setSuccessSnack(false)
                        showSnackbar(e.data.err, 1500);
                    }
                    else {
                        setSuccessSnack(true)
                        showSnackbar("Account Successfully Created !", 1500);
                        setTimeout(function () {
                            router.push("/signin")
                        }, 1500);
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
                    <h6 className='font-metropolis'><span className='text-teal-700'>Create an account</span> or <Link href="/signin" className='hover:text-teal-500 hover:transition ease-in-out delay-70'>log in</Link></h6>
                    <form className='font-metropolis' onSubmit={formik.handleSubmit}>
                        <div className={styles.formcontainer}>
                            <div className={styles.namescontainerform}>
                                <div className='flex flex-col'>
                                    <label className={styles.firstnamelabel}>First Name</label>
                                    <input type='text' placeholder='First Name' name='firstname' onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.firstname} className={(formik.touched.firstname && formik.errors.firstname) ? styles.errorfirstnameinput : styles.firstnameinput}></input>
                                    {formik.touched.firstname && formik.errors.firstname ? <div className='text-red-700 ml-32 mt-1 text-sm xl:ml-0 xl:self-center'>{formik.errors.firstname}</div> : null}
                                </div>
                                <div className='flex flex-col'>
                                    <label className={styles.lastnamelabel}>Last Name</label>
                                    <input type='text' placeholder='Last Name' name='lastname' onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.lastname} className={(formik.touched.lastname && formik.errors.lastname) ? styles.errorlastnameinput : styles.lastnameinput}></input>
                                    {formik.touched.lastname && formik.errors.lastname ? <div className='text-red-700 text-sm mt-1 ml-8 xl:ml-0 xl:self-center'>{formik.errors.lastname}</div> : null}
                                </div>
                            </div>
                            <div className={styles.emailpasswordcontainer}>
                                <div className='flex flex-col'>
                                    <label className={styles.emaillabel}>Email</label>
                                    <input type='email' placeholder='user@email.com' name='email' onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.email} className={(formik.touched.email && formik.errors.email) ? styles.erroremailinput : styles.emailinput}></input>
                                    {formik.touched.email && formik.errors.email ? <div className='text-red-700 ml-32 mt-1 text-sm xl:ml-0 xl:self-center'>{formik.errors.email}</div> : null}
                                </div>
                                <div className='flex flex-col'>
                                    <label className={styles.passwordlabel}>Password</label>
                                    <input type='password' placeholder='*******' name='password' onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.password} className={(formik.touched.password && formik.errors.password) ? styles.errorpasswordinput : styles.passwordinput}></input>
                                    {formik.touched.password && formik.errors.password ? <div className='text-red-700 text-sm mt-1 ml-8 xl:ml-0 xl:self-center'>{formik.errors.password}</div> : null}
                                </div>
                            </div>
                            <div className={styles.phonenumbercontainer}>
                                <label className={styles.phonelabel}>Phone No (with Country Code)</label>
                                <input type='number' placeholder='+919999999999' name='phonenumber' onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.phonenumber} className={(formik.touched.phonenumber && formik.errors.phonenumber) ? styles.errorphonenumberinput : styles.phonenumberinput}></input>
                                {formik.touched.phonenumber && formik.errors.phonenumber ? <div className='text-red-700 text-sm mt-1 ml-32 xl:ml-0 xl:self-center'>{formik.errors.phonenumber}</div> : null}
                            </div>
                            <div className={styles.biocontainer}>
                                <label className={styles.biolabel}>Bio</label>
                                <input type='text' placeholder='Describe yourself' name='bio' onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.bio} className={(formik.touched.bio && formik.errors.bio) ? styles.errorbioinput : styles.bioinput}></input>
                                {formik.touched.bio && formik.errors.bio ? <div className='text-red-700 text-sm mt-1 ml-32 xl:ml-0 xl:self-center'>{formik.errors.bio}</div> : null}
                            </div>
                            <div className={styles.gendercontainer}>
                                <label className={styles.genderlabel}>Gender</label>
                                <select name='gender' className={(formik.touched.gender && formik.errors.gender) ? styles.errorgenderinput : styles.genderinput} onChange={formik.handleChange} onBlur={formik.handleBlur} defaultValue={formik.values.gender}>
                                    <option value="" disabled selected hidden>Select Gender</option>
                                    <option value='male'>Male</option>
                                    <option value='female'>Female</option>
                                    <option value='other'>Other</option>
                                </select>
                                {formik.touched.gender && formik.errors.gender ? <div className='text-red-700 text-sm mt-1 ml-32 xl:ml-0 xl:self-center'>{formik.errors.gender}</div> : null}
                            </div>
                            <div className={styles.educationlabel}>Education</div>
                            <div className={styles.personaldetailscontainer}>
                                <div className='flex flex-col'>
                                    <label className={styles.collegenamelabel}>College Name</label>
                                    <input type='text' placeholder='College Name' name='collegename' onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.collegename} className={(formik.touched.collegename && formik.errors.collegename) ? styles.errorcollegenameinput : styles.collegenameinput}></input>
                                    {formik.touched.collegename && formik.errors.collegename ? <div className='text-red-700 ml-32 mt-1 text-sm xl:ml-0 xl:self-center'>{formik.errors.collegename}</div> : null}
                                </div>
                                <div className='flex flex-col'>
                                    <label className={styles.birthdaylabel}>Birthday</label>
                                    <input type='date' placeholder='Birth month' name='birthday' onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.birthday} className={(formik.touched.birthday && formik.errors.birthday) ? styles.errorbirthdayinput : styles.birthdayinput}></input>
                                    {formik.touched.birthday && formik.errors.birthday ? <div className='text-red-700 mt-1 text-sm ml-8 xl:ml-0 xl:self-center'>{formik.errors.birthday}</div> : null}
                                </div>
                            </div>
                            <button type='submit' className={'bg-teal-200 hover:cursor-pointer'}>Signup</button>
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
