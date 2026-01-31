
import React from 'react';

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen bg-white font-medium overflow-x-hidden">
      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-6 py-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-2xl bg-slate-900 flex items-center justify-center shadow-xl">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <span className="text-xl font-black text-slate-900 tracking-tight">InstaAgent Pro</span>
        </div>
        <button 
          onClick={onGetStarted}
          className="px-6 py-3 bg-white border border-slate-200 text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm"
        >
          Access Agent
        </button>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-32 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="animate-in slide-in-from-left-8 duration-700">
          <div className="inline-block px-4 py-2 bg-indigo-50 rounded-full border border-indigo-100 mb-6">
            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Built for SMB Owners</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-[1.3] mb-10 overflow-visible">
            Your Personal <br/>
            <span className="gradient-text italic">Instagram Caption Agent.</span>
          </h1>
          <p className="text-xl text-slate-500 leading-relaxed max-w-lg mb-12 font-medium">
            Tired of staring at a blank screen? Upload a photo and let <span className="text-slate-900 font-bold">InstaAgent Pro</span> write high-converting, scroll-stopping Instagram captions for your business in seconds.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={onGetStarted}
              className="px-10 py-5 bg-slate-900 text-white rounded-[2rem] text-lg font-black hover:bg-black transition-all shadow-2xl shadow-slate-200"
            >
              Get Started Now
            </button>
            <div className="flex items-center gap-3 px-6 py-4 bg-slate-50 rounded-[2rem] border border-slate-100">
              <div className="flex -space-x-2">
                {[1,2,3].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-300"></div>
                ))}
              </div>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Join 500+ Active SMBs</span>
            </div>
          </div>
        </div>

        <div className="relative animate-in zoom-in-95 duration-700 delay-200">
          <div className="aspect-[4/5] bg-slate-50 rounded-[3rem] border border-slate-100 shadow-2xl relative overflow-hidden p-8">
            <div className="space-y-6">
              <div className="h-12 w-3/4 bg-slate-200 rounded-2xl animate-pulse"></div>
              <div className="h-40 w-full bg-slate-200 rounded-3xl animate-pulse"></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="h-20 bg-slate-200 rounded-2xl animate-pulse"></div>
                <div className="h-20 bg-slate-200 rounded-2xl animate-pulse"></div>
              </div>
              <div className="h-16 w-full bg-indigo-100 rounded-3xl animate-pulse"></div>
            </div>
          </div>
          <div className="absolute -bottom-10 -right-10 bg-white p-6 rounded-[2.5rem] shadow-2xl border border-slate-100 max-w-xs animate-in slide-in-from-bottom-8 duration-700 delay-500">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>
              </div>
              <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Conversion Ready</span>
            </div>
            <p className="text-xs text-slate-500 font-medium">"Our engagement jumped 40% in the first week. InstaAgent Pro is like having a CMO on speed dial for our Instagram captions."</p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-slate-50 py-32 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-4">Master Your Social Presence</h2>
            <p className="text-slate-500 uppercase text-[10px] font-black tracking-[0.3em]">The InstaAgent Pro Power Stack</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                title: "Visual Intelligence", 
                desc: "We don't just write copy. InstaAgent Pro analyzes your photos to ensure the caption matches the visual vibe perfectly.",
                icon: (
                  <React.Fragment>
                    <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </React.Fragment>
                )
              },
              { 
                title: "Psychology-Backed", 
                desc: "Every caption includes a high-impact hook, value-driven body, and a clear call to action tailored for Instagram.",
                icon: <path d="M13 10V3L4 14h7v7l9-11h-7z" />
              },
              { 
                title: "Brand Consistency", 
                desc: "Choose from 5 distinct tones to ensure your business always sounds like you on Instagram.",
                icon: <path d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              }
            ].map((f, i) => (
              <div key={i} className="bg-white p-10 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all border border-slate-100 group">
                <div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center mb-8 shadow-xl group-hover:bg-indigo-600 transition-colors">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {f.icon}
                  </svg>
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-4">{f.title}</h3>
                <p className="text-slate-500 leading-relaxed text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center shadow-lg">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
             </div>
             <span className="text-xs font-black text-slate-700 uppercase tracking-widest">© 2026 InstaAgent Pro.</span>
          </div>
          <div className="flex gap-8">
            <a href="#" className="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-indigo-600 transition-colors">Privacy</a>
            <a href="#" className="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-indigo-600 transition-colors">Terms</a>
            <a href="#" className="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-indigo-600 transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
