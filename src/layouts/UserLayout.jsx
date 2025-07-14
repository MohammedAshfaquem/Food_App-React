import React, { useRef } from "react";
import LandingPage from "../pages/UserHomePage";
import PopularItems from "../pages/PopularItems";
import Footer from "../components/Footer";
import OurServices from "../pages/Services";
import SpecialOffers from "../pages/SPecialOffers";

const UserLayout = () => {
  return (
    <div className="bg-[#f7f5f1]">
      {/* This is where "Home" will scroll to */}
      <div id="top" />

      <LandingPage />

      <section id="popularfoods" className="mt-10">
        <PopularItems />
      </section>

      <section id="services" className="mt-10">
        <OurServices />
      </section>

      <SpecialOffers />
      <Footer />
    </div>
  );
};

export default UserLayout;
