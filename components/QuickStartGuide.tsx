
import React from 'react';

interface QuickStartGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

const QuickStartGuide: React.FC<QuickStartGuideProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div 
        className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-8 py-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-100">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">Quick Start Guide</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Standard Operating Procedure</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full hover:bg-slate-200 flex items-center justify-center transition-colors text-slate-400"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto space-y-8 scrollbar-hide">
          <section>
            <h3 className="text-sm font-black text-indigo-600 uppercase tracking-widest mb-3">What is InstaAgent Pro?</h3>
            <p className="text-slate-600 leading-relaxed font-medium">
              InstaAgent Pro is a professional <span className="text-indigo-600 font-bold">Instagram Caption Agent</span> built specifically for Small and Medium Businesses (SMBs). It acts as a digital Social Media Manager, using multimodal AI to turn photos and simple prompts into polished, high-converting Instagram <span className="text-indigo-600 font-bold">captions</span> in seconds.
            </p>
          </section>

          <section className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-3">The SMB Pain Points It Solves</h3>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <div className="mt-1 flex-shrink-0 w-4 h-4 rounded-full bg-red-100 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                </div>
                <p className="text-xs text-slate-600 leading-normal">
                  <span className="font-black text-slate-900">Blank Page Syndrome:</span> Eliminates creative block by providing 3 distinct caption directions instantly.
                </p>
              </li>
              <li className="flex gap-3">
                <div className="mt-1 flex-shrink-0 w-4 h-4 rounded-full bg-red-100 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                </div>
                <p className="text-xs text-slate-600 leading-normal">
                  <span className="font-black text-slate-900">Visual-to-Caption Disconnect:</span> Generic AI copy doesn't "see" your brand. Our agent analyzes your actual Instagram photo to ensure your text perfectly matches the visual vibe.
                </p>
              </li>
              <li className="flex gap-3">
                <div className="mt-1 flex-shrink-0 w-4 h-4 rounded-full bg-red-100 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                </div>
                <p className="text-xs text-slate-600 leading-normal">
                  <span className="font-black text-slate-900">Strategic Guesswork:</span> Most SMB posts lack hooks. This agent bakes high-conversion psychology (Hooks, Bodies, CTAs) into every Instagram caption.
                </p>
              </li>
            </ul>
          </section>

          <section>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-3">The 4-Step Workflow</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <span className="text-lg font-black text-indigo-200">01</span>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Configure Identity</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">Set your business name and tone. This persists so the agent maintains your unique brand voice on Instagram.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="text-lg font-black text-indigo-200">02</span>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Feed the Engine</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">Upload an Instagram photo or paste a URL and type a quick note about your post goal.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="text-lg font-black text-indigo-200">03</span>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Review & Edit</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">Adjust the hook or body text directly in the card. Use the "Preview" toggle to see the Instagram mobile view.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="text-lg font-black text-indigo-200">04</span>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Execute</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">One-click copy your refined caption to your clipboard and post it directly to Instagram.</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button 
            onClick={onClose}
            className="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all"
          >
            Got it, let's post
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuickStartGuide;
