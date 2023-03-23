import React from "react";
import Image from 'next/image'
import astro from '../public/devsoc.png'
import devsoc from '../public/devsoc.png'
import mars from '../public/mars.png'
import saturn from '../public/saturn.png'
import stars from '../public/stars.png'
import google from '../public/google.png'
import styles from '../pages/signup_page.modules.css'

const Signup = () => {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk&display=swap" rel="stylesheet" />
        <div className={styles.maincontainer}>
          <div className={styles.leftcontainer}>
            <Image src={devsoc} className={styles.devsoclogo}/>
            <h1 className='font-spacegrostesk'>Welcome to DevSoc<span className='text-teal-500'>'23</span></h1>
            <h6 className='font-metropolis'>Create an account or<span className='ml-2 text-teal-700'>log in</span></h6>
            <form className='font-metropolis'>
              <div className={styles.formcontainer}>
                <label>Email</label>
                <input type='email' placeholder='user@email.com' required></input>
                <label>Username</label>
                <input type='text' placeholder='Username' required></input>
                <label>Password</label>
                <input type='password' placeholder='Password' required></input>
                <button type='submit' className={'bg-teal-200 hover:cursor-pointer'}>Log in</button>
              </div>
            </form>
            <div className={styles.googlesignincontainer}>
              <span>or Login Via</span>
              <button className={'bg-teal-200 hover:cursor-pointer'}><Image src={google} className='mr-2 h-7 w-7'/>Sign in with Google</button>
            </div>
          </div>
          <div className={styles.rightcontainer}>
            <Image src={saturn} className={styles.saturn}/>
            <Image src={stars} className={styles.stars}/>
            <Image src={astro} className={styles.astro}/>
            <Image src={mars} className={styles.mars}/>
          </div>
        </div>
    </>
  );
};

export default Signup;