import React, { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import LandingPage from "./LandingPage";
import PopularItems from "./PopularItems";
import Footer from "../Components/Footer";
import OurServices from "./Services";

const Home = () => {
  const popularRef = useRef();   // 🔗 Ref for Popular Foods
  const servicesRef = useRef();  // 🔗 Ref for Our Services

  const location = useLocation(); // 📍 Current route info

  // 🚀 Scroll to section based on URL hash
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

      {/* 🌟 Popular Section */}
      <section ref={popularRef} id="popularfoods" className="mt-10">
        <PopularItems />
      </section>

      {/* ⚙️ Our Services Section */}
      <section ref={servicesRef} id="services" className="mt-10">
        <OurServices />
      </section>

      <Footer />
    </div>
  );
};

export default Home;
