import React, { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import LandingPage from "./LandingPage";
import PopularItems from "./PopularItems";
import Footer from "../Components/Footer";
import OurServices from "./Services";
import SpecialOffers from "./SPecialOffers";

const Home = () => {
  const popularRef = useRef();
  const servicesRef = useRef();

  const location = useLocation();

  useEffect(() => {
    if (location.hash === "#popularfoods" && popularRef.current) {
      popularRef.current.scrollIntoView({ behavior: "smooth" });
    } else if (location.hash === "#services" && servicesRef.current) {
      servicesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [location]);

  return (
    <div className="bg-[#f7f5f1]">
      <LandingPage />

      <section ref={popularRef} id="popularfoods" className="mt-10">
        <PopularItems />
      </section>

      <section ref={servicesRef} id="services" className="mt-10">
        <OurServices />
      </section>
      <SpecialOffers></SpecialOffers>

      <Footer />
    </div>
  );
};

export default Home;
