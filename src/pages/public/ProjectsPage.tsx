import React from 'react';
import Navbar from '../../components/Navbar';
import Projects from '../../components/Projects';
import Footer from '../../components/Footer';

export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <main className="flex-1 pt-20">
        <Projects />
      </main>
      <Footer />
    </div>
  );
}
