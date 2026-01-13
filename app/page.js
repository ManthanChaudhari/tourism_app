"use client"
import { Suspense } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import WhatWeHelp from "@/components/WhatWeHelp";
import WhyTravelWithUs from "@/components/WhyTravelWithUs";
import AdvertisementBanner from "@/components/AdvertisementBanner";
import Services from "@/components/Services";
import Destinations from "@/components/Destinations";
import PopularPackages from "@/components/PopularPackages";
import PopularHotels from "@/components/PopularHotels";
import PopularCars from "@/components/PopularCars";
import Footer from "@/components/Footer";
import AuthErrorHandler from "@/components/AuthErrorHandler";
import { useSettings } from "@/lib/hooks/useSettings";

export default function Home() {
  const { settings, loading } = useSettings();

  return (
    <div>
      <Suspense fallback={null}>
        <AuthErrorHandler />
      </Suspense>
      <Header />
      <Hero />
      {/* <Services /> */}

      {/* Conditionally render sections based on settings */}
      {!loading && settings.packages_visible && <Destinations />}
      {!loading && settings.hotels_visible && <PopularHotels />}
      {!loading && settings.cars_visible && <PopularCars />}

      <AdvertisementBanner />
      <WhatWeHelp />
      <WhyTravelWithUs />
      <Footer />
    </div>
  );
}
