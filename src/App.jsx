import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CapabilitiesExplorer from './components/CapabilitiesExplorer';
import StartStopShowcase from './components/StartStopShowcase';
import Quickstart from './components/Quickstart';
import ContactForm from './components/ContactForm';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="app">
      <Navbar />
      <main>
        <Hero />
        <CapabilitiesExplorer />
        <StartStopShowcase />
        <Quickstart />
        <ContactForm />
      </main>
      <Footer />
    </div>
  );
}
