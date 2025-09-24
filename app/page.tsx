import Image from "next/image";
import Quotes from "./components/Quotes";
import PageHeader from "./components/PageHeader";
import MeetTheTeam from "./components/meetTheTeam";
import WPMPlay from "./components/wordPerMin/WPMPlay";

export default function Home() {
  return (
   <div className="w-screen max-w-full min-h-fit overflow-x-hidden bg-gradient-to-br from-yellow-400 via-slate-600 to-gray-100 bg-[length:400%_400%] animate-gradient">
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-4 sm:p-8 pb-8 gap-8 sm:gap-8 max-w-7xl mx-auto overflow-x-hidden">
    <PageHeader title="Welcome to The Jazz Corner" />
    <main className="flex flex-col gap-[32px] row-start-2 items-center pt-36">
      <MeetTheTeam
        marginTop="20rem"
        title="Meet the Team"
        subtitle="About the Jazz Corner"
        className="mt-16"
      />
      <Quotes />
      <WPMPlay />
    
    </main>
    <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
      <span>Made with the tunes of love ❤️</span>
    </footer>
  </div>
</div>
  );
}
