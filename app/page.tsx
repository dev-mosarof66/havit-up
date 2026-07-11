'use client';
import React, { useState } from 'react'
import LandingHeatmap from '@/components/LandingHeatmap'
import AuthModal from '@/components/AuthModal'

const dummyDays = (() => {
  const arr = [];
  const year = new Date().getFullYear();
  for (let d = new Date(year, 0, 1); d < new Date(year + 1, 0, 1); d.setDate(d.getDate() + 1)) {
    const yearStr = d.getFullYear();
    const monthStr = String(d.getMonth() + 1).padStart(2, '0');
    const dayStr = String(d.getDate()).padStart(2, '0');

    // Make it look like a realistic habit tracker
    const isWeekend = d.getDay() === 0 || d.getDay() === 6;
    const active = isWeekend ? Math.random() > 0.5 : Math.random() > 0.2;

    arr.push({ date: `${yearStr}-${monthStr}-${dayStr}`, active });
  }
  return arr;
})();

function page() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  const openAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  return (
    <div className='w-full max-w-7xl mx-auto flex flex-col items-center justify-center relative z-10'>

      {/* nav */}
      <div className='w-full fixed top-0 left-0 '>
        <div className='w-full max-w-7xl mx-auto flex items-center justify-between backdrop-blur-sm py-4'>
          {/* logo */}
          <div>
            <span className='font-stack text-xl font-semibold'>Habit Up</span>
          </div>

          {/* auth button */}
          <div>
            <button
              onClick={() => openAuth('login')}
              className='px-4 py-2 bg-white text-black text-sm hover:bg-white/80 rounded-none font-medium'
            >
              Log In
            </button>
          </div>
        </div>
      </div>

      {/* hero section */}
      <div className='w-full flex flex-col items-center pt-32 text-center'>-
        <h1 className='text-7xl font-bold leading-tight tracking-tight'>
          Master Your Habits,
        </h1>
        <span className='text-7xl font-bold leading-tight tracking-tight bg-[linear-gradient(180deg,#0f172a_0%,#4b5563_100%)] bg-clip-text text-transparent'>
          Transform Your Life
        </span>

        <p className='max-w-xl mx-auto text-lg  mt-6'>
          Habit Up is the simple, beautiful habit tracker that helps you build life-changing routines with ease and consistency.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
          <button
            onClick={() => openAuth('register')}
            className="px-8 py-3.5 text-base bg-white text-black font-bold rounded-none shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:shadow-[0_0_40px_rgba(255,255,255,0.25)] hover:scale-105 transition-all"
          >
            Start Tracking Free
          </button>
          <button
            onClick={() => openAuth('login')}
            className="px-8 py-3.5 text-base border border-white/20 text-white font-bold rounded-none hover:bg-white/10 transition-all"
          >
            Sign In
          </button>
        </div>

        <div className='mt-16 w-full max-w-4xl mx-auto opacity-90 hover:opacity-100 transition-opacity'>
          <LandingHeatmap days={dummyDays} />
        </div>


        {/* footer */}
        <div className="w-full flex flex-col sm:flex-row items-center justify-between mt-24 pb-8 text-gray-500 text-sm border-t border-white/10 pt-8">
          <p>© {new Date().getFullYear()} Habit Up. All rights reserved.</p>
          <a 
            href="https://buildwithmosarof.me" 
            target="_blank" 
            rel="noopener noreferrer"
            className="mt-4 sm:mt-0 px-4 py-2 text-sm border border-white/20 text-white hover:bg-white/10 transition-colors"
          >
            Meet Developer
          </a>
        </div>
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authMode}
      />

    </div>
  )
}

export default page