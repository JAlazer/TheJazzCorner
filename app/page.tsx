import Image from "next/image";
import WPM from "./components/wordPerMin/WordPM";
import Quotes from "./components/Quotes";
import PageHeader from "./components/PageHeader";
import MeetTheTeam from "./components/meetTheTeam";
import WPMPlay from "./components/wordPerMin/WPMPlay";

export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
  <PageHeader title="Welcome to The Jazz Corner" />
  <main className="flex flex-col gap-[32px] row-start-2 items-center">
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
  );
}
