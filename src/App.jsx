import React from 'react';
import Navbar from './components/Navbar';
import StartStopShowcase from './components/StartStopShowcase';
import Hero from './components/Hero';
import CapabilitiesExplorer from './components/CapabilitiesExplorer';
import Quickstart from './components/Quickstart';
import ContactForm from './components/ContactForm';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="app">
      <Navbar />
      <main>
        <StartStopShowcase />
        <Hero />
        <CapabilitiesExplorer />
        <Quickstart />
        <ContactForm />
      </main>
      <Footer />
    </div>
  );
}
