import React from 'react';
import Navbar from '../../components/Navbar';
import Team from '../../components/Team';
import Footer from '../../components/Footer';

export default function TeamPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <main className="flex-1 pt-20">
        <Team />
      </main>
      <Footer />
    </div>
  );
}
