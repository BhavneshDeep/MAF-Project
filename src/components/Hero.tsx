import React from 'react';
import { ArrowRight, HelpCircle, Heart, Shield } from 'lucide-react';

export default function Hero() {
  return (
    <div className="relative bg-white min-h-[92vh] flex items-center pt-24 pb-12 overflow-hidden">
      {/* Visual background element shapes */}
      <div className="absolute top-0 right-0 w-[550px] h-[550px] bg-rose-50 rounded-full mix-blend-multiply filter blur-3xl opacity-50 -z-10 translate-x-20 -translate-y-20" />
      <div className="absolute bottom-0 left-0 w-[350px] h-[350px] bg-blue-50 rounded-full mix-blend-multiply filter blur-3xl opacity-40 -z-10 -translate-x-20 translate-y-20" />

      <div className="max-w-7xl mx-auto flex flex-col-reverse lg:flex-row items-center w-full px-4 sm:px-6 lg:px-8 gap-12 sm:gap-16 relative">
        
        {/* Left Column: Premium Pitch Content (6 cols) */}
        <div className="lg:w-1/2 w-full text-left space-y-6 sm:space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-rose-50 border border-rose-100/50 rounded-full text-rose-600 font-extrabold text-xs sm:text-sm uppercase tracking-widest shadow-sm">
              <Shield className="w-4 h-4 fill-rose-100" />
              <span>Registered Social Welfare NGO</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-gray-900 leading-tight">
              <span className="block">Serving Humanity,</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-rose-700">
                Uplifting Lives
              </span>
            </h1>
            <p className="text-gray-600 text-base sm:text-lg md:text-xl text-justify leading-relaxed max-w-xl">
              Maheshwari Action Forum (MAF) is a dedicated social welfare platform steering positive societal reforms across Pakistan. Through active scholarship grants, clean solar water pumps, and diagnostic medical clinics, we uplift the underprivileged and build sustainable futures.
            </p>
          </div>

          {/* Dynamic Statistics Panel */}
          <div className="grid grid-cols-3 gap-4 border-y border-gray-100 py-6 max-w-lg">
            <div>
              <span className="block text-2xl sm:text-3xl font-black text-rose-600">5k+</span>
              <span className="block text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Patients Treated</span>
            </div>
            <div>
              <span className="block text-2xl sm:text-3xl font-black text-rose-600">120+</span>
              <span className="block text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Scholarships</span>
            </div>
            <div>
              <span className="block text-2xl sm:text-3xl font-black text-rose-600">15+</span>
              <span className="block text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Water Wells</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 max-w-md">
            <a
              href="#donations"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-rose-600 hover:bg-rose-700 text-white text-base font-bold rounded-xl shadow-lg shadow-rose-600/10 hover:shadow-xl hover:-translate-y-0.5 transition-all"
            >
              <Heart className="w-5 h-5 fill-white" />
              <span>Donate to our Cause</span>
            </a>
            <a
              href="#projects"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-gray-200 hover:border-rose-500 hover:bg-gray-50 text-gray-700 hover:text-rose-600 text-base font-bold rounded-xl transition-all"
            >
              <span>Explore Campaigns</span>
              <ArrowRight className="h-5 w-5" />
            </a>
          </div>
        </div>

        {/* Right Column: Dynamic Media Frame (6 cols) */}
        <div className="lg:w-1/2 w-full relative">
          {/* Subtle background glow */}
          <div className="absolute inset-0 bg-gradient-to-tr from-rose-500/10 to-blue-500/10 rounded-3xl filter blur-xl transform rotate-3" />
          
          <div className="relative group">
            <img
              className="w-full h-96 sm:h-[500px] object-cover rounded-3xl shadow-2xl border-4 border-white transform transition-transform duration-500 hover:scale-[1.01]"
              src="/Assets/MAF_cover.png"
              alt="Maheshwari Action Forum board members and volunteers in action"
            />
            {/* Soft border accent */}
            <div className="absolute inset-0 border border-gray-100 rounded-3xl pointer-events-none" />
          </div>
        </div>

      </div>
    </div>
  );
}
