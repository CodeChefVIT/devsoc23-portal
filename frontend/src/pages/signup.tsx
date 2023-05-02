import { Inter } from "next/font/google";

import styles from "../styles/signup.module.css";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
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
            Create an account or
            <span className="ml-2 text-teal-700">log in</span>
          </h6>
          <form className="font-metropolis">
            <div className={styles.formcontainer}>
              <label>Email</label>
              <input type="email" placeholder="user@email.com" required></input>
              <label>Username</label>
              <input type="text" placeholder="Username" required></input>
              <label>Password</label>
              <input type="password" placeholder="Password" required></input>
              <button
                type="submit"
                className={"bg-teal-200 hover:cursor-pointer"}
              >
                Log in
              </button>
            </div>
          </form>
          <div className={styles.googlesignincontainer}>
            <span>or Login Via</span>
            <button className={"bg-teal-200 hover:cursor-pointer"}>
              <img src="google.png" className="mr-2 h-7 w-7" />
              Sign in with Google
            </button>
          </div>
        </div>
        <div className={styles.rightcontainer}>
          <img src="saturn.png" className={styles.saturn} />
          <img src="stars.png" className={styles.stars} />
          <img src="astro.png" className={styles.astro} />
          <img src="mars.png" className={styles.mars} />
        </div>
      </div>
    </>
  );
}
