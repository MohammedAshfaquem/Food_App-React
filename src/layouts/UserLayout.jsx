import React, { useLayoutEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import LandingPage from "../pages/UserHomePage";
import PopularItems from "../pages/PopularItems";
import Footer from "../Components/Footer";
import OurServices from "../pages/Services";
import SpecialOffers from "../pages/SpecialOffers";

const UserLayout = () => {
  const location = useLocation();

  const topRef = useRef(null);
  const popularRef = useRef(null);
  const servicesRef = useRef(null);

  useLayoutEffect(() => {
    const sectionId = location.state?.scrollTo;

    if (sectionId) {
      const scrollMap = {
        top: topRef,
        popularfoods: popularRef,
        services: servicesRef,
      };

      const sectionRef = scrollMap[sectionId];
      if (sectionRef?.current) {
        sectionRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);

  return (
    <div className="bg-[#f7f5f1]">
      <div ref={topRef} id="top" />
      <LandingPage />

      <section ref={popularRef} id="popularfoods" className="mt-10">
        <PopularItems />
      </section>

      <section ref={servicesRef} id="services" className="mt-10">
        <OurServices />
      </section>

      <SpecialOffers />
      <Footer />
    </div>
  );
};

export default UserLayout;
