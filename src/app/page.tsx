import Header from '@/components/Header/Header';
import Home from '@/components/Home/Home';
import ImageCarousel from '@/components/ImageCarousel/ImageCarousel';
import About from '@/components/About/About';
import Timeline from '@/components/Timeline/Timeline';
import Footer from '@/components/Footer/Footer';

export default function Page() {
  return (
    <main>
      <Header />
      <section id="home">
        <Home />
      </section>
      <section id="technologies">
        <ImageCarousel />
      </section>
      <section id="about">
        <About />
      </section>
      <section id="experience">
        <Timeline />
      </section>
      <Footer />
    </main>
  );
}
