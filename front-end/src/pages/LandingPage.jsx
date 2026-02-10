import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#FDFCF0] font-sans selection:bg-blue-400 overflow-x-hidden text-black">
      
      {/* ADAPTIVE NAVBAR */}
      <div className="fixed top-6 left-0 w-full z-[100] pointer-events-none flex justify-center">
        <nav 
          className={`
            pointer-events-auto transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] 
            bg-white border-4 border-black flex items-center overflow-hidden
            ${isScrolled 
              ? "w-[68px] h-[68px] rounded-full px-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-x-[min(40vw,540px)]" 
              : "w-[90%] max-w-6xl rounded-2xl px-6 py-3 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] translate-x-0"
            }
          `}
        >
          {/* LOGO CONTAINER */}
          <div className="flex items-center gap-3 shrink-0">
            <div className={`bg-indigo-600 border-2 border-black rounded-lg flex items-center justify-center transition-all duration-500 ${isScrolled ? "w-11 h-11 rotate-0" : "w-10 h-10 -rotate-6"}`}>
              <span className="font-black text-white italic text-xl">F</span>
            </div>
            
            <span className={`font-black text-xl uppercase tracking-tighter transition-all duration-300 ${isScrolled ? "opacity-0 w-0 -translate-x-10" : "opacity-100 w-auto"}`}>
              Flow.io
            </span>
          </div>

          {/* LOGIN BUTTON - Collapses to zero width */}
          <div className={`ml-auto transition-all duration-300 ${isScrolled ? "opacity-0 w-0 scale-0 pointer-events-none" : "opacity-100 scale-100"}`}>
            <Link 
              to="/login" 
              className="bg-black text-white border-2 border-black px-5 py-2 font-black uppercase tracking-widest text-[10px] hover:bg-indigo-600 whitespace-nowrap"
            >
              Login
            </Link>
          </div>
        </nav>
      </div>

      {/* Hero Section */}
      <section className="relative pt-64 pb-20 px-6 overflow-hidden">
        <div className="absolute top-40 right-[-5%] w-64 h-64 bg-yellow-300 border-4 border-black rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
        <div className="absolute bottom-10 left-[-5%] w-80 h-80 bg-blue-400 border-4 border-black rounded-full mix-blend-multiply filter blur-3xl opacity-20" />

        <div className="max-w-7xl mx-auto flex flex-col items-center text-center relative z-10">
          <div className="bg-white border-2 border-black px-4 py-1 rounded-full font-black uppercase text-[10px] tracking-[0.3em] mb-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            Powered by GPT-4o + Human Insight
          </div>
          
          <h1 className="text-6xl md:text-[110px] font-black uppercase italic leading-[0.85] tracking-tighter mb-10">
            Fixing <span className="text-indigo-600">Stuff</span> <br /> 
            Just Got <br />
            <span className="relative inline-block mt-4">
               Smart.
              <svg className="absolute -bottom-4 left-0 w-full" height="15" viewBox="0 0 400 15" fill="none" preserveAspectRatio="none">
                <path d="M5 10C100 2 300 2 395 10" stroke="#4F46E5" strokeWidth="8" strokeLinecap="round"/>
              </svg>
            </span>
          </h1>

          <p className="max-w-xl text-lg md:text-xl font-bold text-slate-700 mb-12 leading-tight mt-6">
            The first support desk where AI does the heavy lifting and humans ensure the <span className="underline decoration-indigo-500 decoration-4">soul</span> stays intact.
          </p>

          <Link to="/signup" className="group relative inline-block">
            <div className="absolute inset-0 bg-black rounded-xl translate-x-2 translate-y-2 group-hover:translate-x-1 group-hover:translate-y-1 transition-transform" />
            <div className="relative bg-indigo-500 border-4 border-black px-10 py-5 rounded-xl font-black text-white uppercase tracking-widest text-xl transition-transform group-hover:-translate-x-1 group-hover:-translate-y-1">
              Start Resolving →
            </div>
          </Link>
        </div>
      </section>

      {/* Marquee */}
      <section className="border-y-4 border-black bg-white py-6 overflow-hidden flex">
        <div className="flex animate-slow-marquee gap-12 whitespace-nowrap items-center">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex gap-12 items-center">
              <span className="text-3xl font-black uppercase italic tracking-tighter">AI-Optimized</span>
              <div className="w-3 h-3 bg-indigo-600 border-2 border-black rotate-45" />
              <span className="text-3xl font-black uppercase italic tracking-tighter">Human-Moderated</span>
              <div className="w-3 h-3 bg-yellow-400 border-2 border-black rounded-full" />
              <span className="text-3xl font-black uppercase italic tracking-tighter">Lightning Fast</span>
              <div className="w-8 h-[2px] bg-black" />
            </div>
          ))}
        </div>
      </section>

      {/* Bento Grid */}
      <section id="how" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-8 bg-blue-50 border-4 border-black p-10 rounded-[2.5rem] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 text-6xl font-black text-blue-200 group-hover:text-blue-300 transition-colors">01</div>
            <h3 className="text-4xl font-black uppercase italic mb-6">Automated Triage</h3>
            <p className="text-xl font-bold text-slate-700 max-w-md italic">
              AI instantly categorizes your ticket and drafts a technical solution before a human even blinks.
            </p>
            <div className="mt-10 h-32 bg-white border-2 border-black border-dashed rounded-2xl flex items-center justify-center">
               <span className="font-mono text-xs text-slate-400">[ Ticket Analysis Sequence... 89% ]</span>
            </div>
          </div>

          <div className="md:col-span-4 bg-pink-50 border-4 border-black p-10 rounded-[2.5rem] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between hover:-rotate-2 transition-transform">
            <h3 className="text-2xl font-black uppercase italic">Human Check</h3>
            <p className="font-bold text-slate-700">A moderator reviews the AI output to ensure accuracy and tone.</p>
            <div className="w-16 h-16 bg-pink-400 border-4 border-black rounded-full flex items-center justify-center font-black">OK</div>
          </div>

          <div className="md:col-span-4 bg-amber-50 border-4 border-black p-10 rounded-[2.5rem] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:rotate-2 transition-transform">
            <div className="text-5xl mb-4">⚡</div>
            <h3 className="text-2xl font-black uppercase italic">Instant Delivery</h3>
            <p className="font-bold text-slate-700">The verified solution is delivered to your dashboard in minutes.</p>
          </div>

          <div className="md:col-span-8 bg-indigo-900 border-4 border-black p-10 rounded-[2.5rem] shadow-[8px_8px_0px_0px_rgba(79,70,229,0.3)] text-white relative">
            <h3 className="text-4xl font-black uppercase italic mb-6">Ready to scale?</h3>
            <p className="text-lg font-medium opacity-80 mb-8">Join the hundreds of teams moving at the speed of thought.</p>
            <Link to="/signup" className="bg-white text-black border-2 border-black px-8 py-3 rounded-lg font-black uppercase tracking-widest text-sm hover:bg-yellow-400 transition-colors inline-block">
              Claim Account
            </Link>
          </div>
        </div>
      </section>

      <footer className="py-20 bg-white border-t-4 border-black text-center">
        <p className="font-black uppercase tracking-[1em] text-[10px] text-slate-400 italic">No fluff • Pure flow • 2026</p>
      </footer>

      <style>{`
        @keyframes slow-marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-slow-marquee {
          animation: slow-marquee 45s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;