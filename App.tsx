
import React, { useState, useEffect, useRef } from 'react';
import { generateInstagramCaptions } from './services/geminiService';
import { CaptionOption, BusinessType, Tone, ConversionGoal, ContentType } from './types';
import CaptionCard from './components/CaptionCard';
import QuickStartGuide from './components/QuickStartGuide';
import LandingPage from './components/LandingPage';
import LicenseGate from './components/LicenseGate';

const BUSINESS_TYPES: BusinessType[] = [
  'Retail & E-commerce', 
  'Food & Beverage', 
  'Health & Wellness', 
  'Real Estate', 
  'Professional Services', 
  'Beauty & Personal Care', 
  'Other'
];

const TONES: Tone[] = ['Professional', 'Playful', 'Urgent', 'Minimalist', 'Storytelling'];
const GOALS: ConversionGoal[] = ['Engagement', 'Traffic', 'Sales', 'Local', 'Awareness'];
const CONTENT_TYPES: ContentType[] = ['Feed Post', 'Story'];

const STORAGE_KEY = 'instaagent_pro_v3_state';
const LICENSE_KEY_STORAGE = 'instaagent_pro_license';

const App: React.FC = () => {
  const [view, setView] = useState<'landing' | 'gate' | 'app'>('landing');
  const [isUnlocked, setIsUnlocked] = useState(false);

  // App State
  const [topic, setTopic] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState<BusinessType>('Retail & E-commerce');
  const [tone, setTone] = useState<Tone>('Professional');
  const [goal, setGoal] = useState<ConversionGoal>('Awareness');
  const [contentType, setContentType] = useState<ContentType>('Feed Post');
  const [image, setImage] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [uploadMethod, setUploadMethod] = useState<'local' | 'url'>('local');
  const [loading, setLoading] = useState(false);
  const [captions, setCaptions] = useState<CaptionOption[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedLicense = localStorage.getItem(LICENSE_KEY_STORAGE);
    if (savedLicense) {
      setIsUnlocked(true);
      setView('app');
    }

    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setCaptions(parsed.captions || []);
        setBusinessName(parsed.businessName || '');
        setBusinessType(parsed.businessType || 'Retail & E-commerce');
        setTone(parsed.tone || 'Professional');
        setGoal(parsed.goal || 'Awareness');
        setContentType(parsed.contentType || 'Feed Post');
      } catch (e) {
        console.error("Storage Load Error:", e);
      }
    }
  }, []);

  useEffect(() => {
    if (isUnlocked) {
      const state = { captions, businessName, businessType, tone, goal, contentType };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [captions, businessName, businessType, tone, goal, contentType, isUnlocked]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setImageUrl(''); 
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImage(null);
    setImageUrl('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    const effectiveImage = uploadMethod === 'local' ? image : null;
    const effectiveUrl = uploadMethod === 'url' ? imageUrl : null;

    if (!topic.trim() && !effectiveImage && !effectiveUrl) {
      setError('Please provide a photo or topic to help the agent understand your post.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const result = await generateInstagramCaptions(
        topic, 
        businessType, 
        tone, 
        goal, 
        contentType, 
        effectiveImage || undefined,
        effectiveUrl || undefined
      );
      setCaptions(result.captions.slice(0, 3));
      setTimeout(() => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      }, 100);
    } catch (err: any) {
      setError(`AI request failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const startNewDraft = () => {
    if (window.confirm('Reset this draft?')) {
      setCaptions([]);
      setTopic('');
      setImage(null);
      setImageUrl('');
    }
  };

  const handleUnlockSuccess = (key: string) => {
    localStorage.setItem(LICENSE_KEY_STORAGE, key);
    setIsUnlocked(true);
    setView('app');
  };

  if (view === 'landing') return <LandingPage onGetStarted={() => setView('gate')} />;
  if (view === 'gate') return <LicenseGate onSuccess={handleUnlockSuccess} onBack={() => setView('landing')} />;

  const hasPreview = (uploadMethod === 'local' && image) || (uploadMethod === 'url' && imageUrl);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 pb-40">
      <QuickStartGuide isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
      
      {/* App Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-[100] px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView('landing')}>
            <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center shadow-lg">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
            </div>
            <span className="text-lg font-black tracking-tighter">InstaAgent <span className="text-indigo-600">Pro</span></span>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsGuideOpen(true)}
              className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-100 transition-all flex items-center gap-2"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Guide
            </button>
            <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center">
              <span className="text-[10px] font-black text-indigo-600 uppercase">V3</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 pt-12">
        <div className="mb-12">
           <h1 className="text-4xl font-black tracking-tight mb-2">Caption Generator</h1>
           <p className="text-slate-500 font-medium">Turn your visual assets into high-converting Instagram captions.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Controls Panel */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 space-y-8">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Post Format</label>
                <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-50 rounded-2xl">
                  {CONTENT_TYPES.map(ct => (
                    <button
                      key={ct}
                      onClick={() => setContentType(ct)}
                      className={`py-3 rounded-xl text-[10px] font-black transition-all ${
                        contentType === ct ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      {ct}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Brand Voice</label>
                <div className="flex flex-wrap gap-2">
                  {TONES.map(t => (
                    <button
                      key={t}
                      onClick={() => setTone(t)}
                      className={`px-3 py-2 rounded-xl text-[10px] font-black transition-all border ${
                        tone === t ? 'bg-slate-900 border-slate-900 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-300'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Campaign Goal</label>
                <select
                  value={goal}
                  onChange={(e) => setGoal(e.target.value as ConversionGoal)}
                  className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 text-sm font-black text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none appearance-none cursor-pointer"
                >
                  {GOALS.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>

              <div className="pt-4 border-t border-slate-50">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 block">Quick Info</label>
                <input
                  type="text"
                  placeholder="Business Name"
                  className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 text-sm font-bold text-slate-900 mb-3 outline-none focus:ring-2 focus:ring-indigo-500"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                />
                <select
                  className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer"
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value as BusinessType)}
                >
                  {BUSINESS_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Input Panel */}
          <div className="lg:col-span-8 space-y-6">
            <form onSubmit={handleGenerate} className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-10">
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Visual Asset</label>
                  <div className="flex gap-2 p-1 bg-slate-50 rounded-xl">
                    <button 
                      type="button"
                      onClick={() => setUploadMethod('local')}
                      className={`px-3 py-1 rounded-lg text-[9px] font-black transition-all ${uploadMethod === 'local' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}
                    >
                      FILE
                    </button>
                    <button 
                      type="button"
                      onClick={() => setUploadMethod('url')}
                      className={`px-3 py-1 rounded-lg text-[9px] font-black transition-all ${uploadMethod === 'url' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}
                    >
                      URL
                    </button>
                  </div>
                </div>

                <div className="relative group">
                  {uploadMethod === 'local' ? (
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className={`h-64 w-full rounded-[2rem] border-4 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden relative ${
                        image ? 'border-indigo-500 bg-indigo-50' : 'border-slate-50 bg-slate-50 hover:border-indigo-200'
                      }`}
                    >
                      {image ? (
                        <>
                          <img src={image} alt="Preview" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                             <button type="button" onClick={removeImage} className="bg-white text-slate-900 px-6 py-3 rounded-full font-black text-xs uppercase tracking-widest shadow-2xl">Remove Asset</button>
                          </div>
                        </>
                      ) : (
                        <div className="text-center p-10">
                          <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-6">
                            <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2-2v12a2 2 0 002 2z"/></svg>
                          </div>
                          <p className="text-slate-400 font-bold mb-2">Drag and drop your Instagram photo here</p>
                          <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">or click to browse local files</p>
                        </div>
                      )}
                      <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className={`h-64 w-full rounded-[2rem] border-4 border-dashed flex flex-col items-center justify-center transition-all overflow-hidden relative ${
                        imageUrl ? 'border-indigo-500 bg-indigo-50' : 'border-slate-50 bg-slate-50'
                      }`}>
                        {imageUrl ? (
                          <>
                            <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                               <button type="button" onClick={() => setImageUrl('')} className="bg-white text-slate-900 px-6 py-3 rounded-full font-black text-xs uppercase tracking-widest shadow-2xl">Clear URL</button>
                            </div>
                          </>
                        ) : (
                          <div className="text-center p-10">
                            <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-6">
                              <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>
                            </div>
                            <p className="text-slate-400 font-bold">Paste a direct image link below</p>
                          </div>
                        )}
                      </div>
                      <input 
                        type="url"
                        placeholder="https://images.unsplash.com/..."
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        className="w-full bg-slate-50 border-2 border-slate-100 focus:border-indigo-500 rounded-2xl px-6 py-4 text-sm font-medium text-slate-900 outline-none transition-all"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Post Context / Details</label>
                <textarea
                  rows={4}
                  className="w-full bg-slate-50 border-none rounded-3xl px-8 py-6 text-lg font-medium text-slate-900 placeholder-slate-300 outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none"
                  placeholder="What is this Instagram post about? (e.g. New Summer collection dropping Friday at 9am. Free shipping for first 50 orders!)"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-6 rounded-3xl text-xl font-black text-white transition-all transform hover:scale-[1.01] active:scale-[0.99] shadow-2xl ${
                  loading ? 'bg-slate-300 cursor-not-allowed' : 'bg-slate-900 hover:bg-black shadow-slate-100'
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Agent is Thinking...</span>
                  </div>
                ) : 'Generate Captions'}
              </button>
            </form>

            {error && (
              <div className="p-6 bg-red-50 border border-red-100 rounded-[2rem] flex items-center gap-4 text-red-700 animate-in fade-in zoom-in-95">
                 <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                 <p className="text-xs font-bold">{error}</p>
              </div>
            )}
          </div>
        </div>

        {/* Results Board */}
        {captions.length > 0 && (
          <div className="mt-24 space-y-12 animate-in fade-in slide-in-from-bottom-10 duration-1000">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-black tracking-tight">Caption Options</h2>
                <p className="text-sm font-medium text-slate-400 mt-1">Refined for Instagram {goal.toLowerCase()} and {tone.toLowerCase()} brand voice.</p>
              </div>
              <button onClick={startNewDraft} className="text-[10px] font-black text-slate-400 hover:text-red-500 uppercase tracking-widest px-6 py-3 rounded-full border border-slate-200 transition-all">New Draft</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {captions.map((cap, idx) => (
                <CaptionCard 
                  key={idx} 
                  caption={cap} 
                  index={idx} 
                  businessName={businessName} 
                  contentType={contentType} 
                />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
