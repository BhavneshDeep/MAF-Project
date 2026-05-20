import React from 'react';
import Navbar from '../../components/Navbar';
import Collaborations from '../../components/Collaborations';
import Footer from '../../components/Footer';

export default function CollaborationsPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <main className="flex-1 pt-20">
        <Collaborations />
      </main>
      <Footer />
    </div>
  );
}
