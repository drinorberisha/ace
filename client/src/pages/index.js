// pages/index.js
import Head from "next/head";
import Hero from "@/components/common/Hero";
// import Header from '@/components/common/header';
import Navigation from "@/components/common/navigation";
import UserContext from "../context/userContext";
import React, { useContext } from "react";
import { MyTimeline } from "@/components/common/timeline";
import { MyCarousel } from "@/components/common/carousel";
import { MyFooter } from "@/components/common/footer";
import { MyAccordion } from "@/components/common/accordion";
import Newnav from "@/components/common/newnav";

const Home = () => {
  const { user } = useContext(UserContext);
  return (
    <div>
      <Head>
        <title>Ace Academy</title>
        <meta name="description" content="Next-Gen E-Learning Platform"></meta>
        <link rel="icon" href=""></link>
      </Head>

      {/* Navigation  */}
      <Newnav />

      {user && (
        <div className="flex items-center justify-center text-white h-full">
          Welcome to ACE - {user.username}
        </div>
      )}

      {/* Main Sections of Home  */}

      <section>
        <Hero heading="ACE" message="The place to be" />
      </section>
      <section>
        <header>
          <h2 className="mt-9 mb-3 text-4xl font-bold dark:text-gray-200">
            Carousel
          </h2>
        </header>
        <MyCarousel />
      </section>

      <section>
        <header>
          <h2 className="mt-9 mb-3 text-4xl font-bold dark:text-gray-200">
            Timeline
          </h2>
        </header>
        <MyTimeline />
      </section>
      <section>
        <header>
          <h2 className="mt-9 mb-3 text-4xl font-bold dark:text-gray-200">
            Accordion
          </h2>
        </header>
        <MyAccordion />
      </section>

      {/* Footer Section  */}
      <section>
        <header>
          <h2 className="mt-9 mb-3 text-4xl font-bold dark:text-gray-200">
            Footer
          </h2>
        </header>
        <MyFooter />
      </section>
    </div>
  );
};

export default Home;
