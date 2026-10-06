import { Navbar } from "@/components/site/navbar";
import { Hero } from "@/components/site/hero";
import { WelcomeBanner } from "@/components/site/welcome-banner";
import { About } from "@/components/site/about";
import { Services } from "@/components/site/services";
import { Parapharmacy } from "@/components/site/parapharmacy";
import { Advice } from "@/components/site/advice";
import { Location } from "@/components/site/location";
import { Contact } from "@/components/site/contact";
import { Footer } from "@/components/site/footer";
import { MobileActionBar } from "@/components/site/mobile-action-bar";
import { Chatbot } from "@/components/site/chatbot";
import { ScrollProgress } from "@/components/site/scroll-progress";
import { CustomCursor } from "@/components/site/custom-cursor";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background overflow-x-hidden">
      <CustomCursor />
      <ScrollProgress />
      <Navbar />
      <main className="flex-1">
        <Hero />
        <WelcomeBanner />
        <About />
        <Services />
        <Parapharmacy />
        <Advice />
        <Location />
        <Contact />
      </main>
      <Footer />
      <MobileActionBar />
      <Chatbot />
    </div>
  );
}
