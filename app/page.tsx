import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import AboutBitcoin from "@/components/AboutBitcoin";
import LivePrice from "@/components/LivePrice";
import Calculator_ from "@/components/Calculator";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <AboutBitcoin />
      <LivePrice />
      <Calculator_ />
      <FAQ />
      <Footer />
    </main>
  );
}
