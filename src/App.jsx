import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import StartStopShowcase from './components/StartStopShowcase';
import CapabilitiesExplorer from './components/CapabilitiesExplorer';
import Quickstart from './components/Quickstart';
import ContactForm from './components/ContactForm';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="app">
      <Navbar />
      <main>
        <Hero />
        <StartStopShowcase />
        <CapabilitiesExplorer />
        <Quickstart />
        <ContactForm />
      </main>
      <Footer />
    </div>
  );
}
