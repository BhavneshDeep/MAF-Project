import React from 'react';
import Navbar from '../../components/Navbar';
import Donations from '../../components/Donations';
import Footer from '../../components/Footer';

export default function DonationsPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <main className="flex-1 pt-20">
        <Donations />
      </main>
      <Footer />
    </div>
  );
}
