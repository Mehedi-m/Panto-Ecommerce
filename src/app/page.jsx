import Experience from "./components/experience/Experience";
import Feature from "./components/feature/Feature";
import Footer from "./components/footer/Footer";
import Hero from "./components/hero/Hero";
import Material from "./components/material/Material";
import BestSellers from "./components/products/BestSellers";
import Testimonials from "./components/testimonials/Testimonials";


export default function Home() {
  return (

    <main>
      <Hero></Hero>
      <Feature></Feature>
      <BestSellers></BestSellers>
      <Experience></Experience>

      <Material></Material>
      <Testimonials></Testimonials>
      <Footer></Footer>

  
    </main>

  );
}