import Image from "next/image";
import WPM from "./components/WordPM";
import Quotes from "./components/Quotes";
import PageHeader from "./components/PageHeader";
import MeetTheTeam from "./components/meetTheTeam";

export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <PageHeader title="Welcome to The Jazz Corner" />
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
       

        <MeetTheTeam
          marginTop="20rem"
          title="Meet the Team"
          subtitle="About the Jazz Corner"
          className="mt-16"
          />

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Deploy now
          </a>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read our docs
          </a>
        </div>

        <WPM />

        

      </main>
      
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
       <span>Made with the tunes of love ❤️</span>
      </footer>
      <Quotes />
    </div>
  );
}
