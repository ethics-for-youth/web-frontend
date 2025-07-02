import React from 'react';
import Navbar from '../../components/Navbar';
import HeroSection from '../../components/HeroSection';
import EthicsOverview from '../../components/EthicsOverview';
import EventsSection from '../../components/EventsSection';
import Footer from '../../components/Footer';

const LandingPage = () => {
  return (
    <div className="font-sans bg-gradient-to-b from-white to-green-50 text-gray-800">
      <Navbar />
      <HeroSection />
      <EthicsOverview />
      <EventsSection />
      <Footer />
    </div>
  );
};

export default LandingPage;
