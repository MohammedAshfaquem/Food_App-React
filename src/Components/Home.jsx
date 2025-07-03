import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import LandingPage from "../pages/LandingPage";
import PopularItems from "../pages/PopularItems";

function Home() {
  const navigate = useNavigate();
  return (
    <>
      {/* <Navbar></Navbar> */}
      <LandingPage></LandingPage>
      <PopularItems/>
    </>
  );
}

export default Home;
