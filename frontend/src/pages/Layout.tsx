import Image from "next/image";
import discord from "../../public/discord.png";

export default function Layout({ children } : { children: React.ReactNode}) {
  return (
    <>
      <main>
        <a
          href="http://discord.codechefvit.com/"
          target="_blank"
          rel="noreferrer"
        >
          <div className="side-fixed-btn">
            <Image src={discord} alt="" />
          </div>
        </a>
        {children}
      </main>
    </>
  );
}
