import Header from "@/components/header";
import Hero from "@/components/hero";
import Stats from "@/components/stats";
import Games from "@/components/games";
import Features from "@/components/features";
import Social from "@/components/social";
import OpenSource from "@/components/open-source";
import Modders from "@/components/modders";
import Support from "@/components/support";
import Footer from "@/components/footer";
import { getStars } from "@/lib/github";

export default async function Home() {
  const stars = await getStars();

  return (
    <>
      <Header stars={stars} />
      <main>
        <Hero stars={stars} />
        <Stats />
        <Games />
        <Social />
        <Features />
        <OpenSource stars={stars} />
        <Modders />
        <Support />
      </main>
      <Footer />
    </>
  );
}
