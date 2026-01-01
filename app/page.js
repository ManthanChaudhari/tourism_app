"use client"
import { Suspense } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import WhatWeHelp from "@/components/WhatWeHelp";
import WhyTravelWithUs from "@/components/WhyTravelWithUs";
import AdvertisementBanner from "@/components/AdvertisementBanner";
import Services from "@/components/Services";
import Destinations from "@/components/Destinations";
import Footer from "@/components/Footer";
import AuthErrorHandler from "@/components/AuthErrorHandler";

export default function Home() {
  return (
    <div>
      <Suspense fallback={null}>
        <AuthErrorHandler />
      </Suspense>
      <Header />
      <Hero />
      {/* <Services /> */}
      <Destinations />
      <AdvertisementBanner />
      <WhatWeHelp />
      <WhyTravelWithUs />
      <Footer />
    </div>
  );
}
