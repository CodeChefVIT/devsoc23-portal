import { type NextPage } from "next";
import Head from "next/head";
import Router from "next/router";
import { useEffect } from "react";
import Loader from "~/components/Loader";

const Home: NextPage = () => {
  useEffect(() => {
    void Router.push("/signin");
  }, []);

  return (
    <>
      <Head>
        <title>DEVSOC&apos;23</title>
        <meta name="description" content="DEVSOC'23" />
        <link rel="icon" href="/devsoc.png" />
      </Head>
      <main className="absolute inset-0 flex items-center justify-center bg-[#242E42] text-white">
        <Loader />
      </main>
    </>
  );
};

export default Home;
