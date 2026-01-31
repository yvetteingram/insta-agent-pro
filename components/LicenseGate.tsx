
import React, { useState } from 'react';

interface LicenseGateProps {
  onSuccess: (key: string) => void;
  onBack: () => void;
}

const LicenseGate: React.FC<LicenseGateProps> = ({ onSuccess, onBack }) => {
  const [key, setKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{ message: string; type: 'auth' | 'connection' } | null>(null);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanKey = key.trim().toUpperCase();
    if (!cleanKey) return;

    setLoading(true);
    setError(null);

    // Create a timeout controller to prevent the "hang"
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    try {
      const response = await fetch('/.netlify/functions/verify-license', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ licenseKey: cleanKey }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      const data = await response.json();

      if (response.ok && data.success) {
        onSuccess(cleanKey);
      } else {
        setError({ 
          message: data.error || 'Invalid license key. Please check your purchase receipt.',
          type: 'auth'
        });
      }
    } catch (err: any) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError') {
        setError({ 
          message: 'The server is taking too long to respond. Ensure your local backend (Netlify Functions) is running.',
          type: 'connection'
        });
      } else {
        setError({ 
          message: 'Connection failed. The verification server is unreachable. Check your network or local proxy settings.',
          type: 'connection'
        });
      }
      console.error('Verification error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-10 border border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-3xl -mr-16 -mt-16 opacity-50"></div>
        
        <button onClick={onBack} className="absolute top-8 left-8 text-slate-400 hover:text-slate-900 transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </button>

        <div className="text-center mb-10 mt-6">
          <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
             <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Agent Access</h2>
        </div>

        <form onSubmit={handleVerify} className="space-y-6">
          <div className="space-y-2">
            <input
              type="text"
              placeholder="PASTE LICENSE KEY"
              className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-500 rounded-2xl px-6 py-4 text-center font-black text-slate-900 transition-all outline-none tracking-widest uppercase placeholder:normal-case placeholder:font-medium placeholder:tracking-normal placeholder:text-slate-300"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-5 rounded-2xl font-black text-white transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg ${
              loading ? 'bg-slate-300' : 'bg-slate-900 hover:bg-black shadow-slate-200'
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Verifying...</span>
              </div>
            ) : 'Verify & Launch Agent'}
          </button>
        </form>

        <div className="mt-8 text-center space-y-4">
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
            No Key? <a href="https://ketorahdigital.gumroad.com/l/instaagent-pro" target="_blank" rel="noopener noreferrer" className="text-indigo-600 border-b border-indigo-200 ml-1">Get Access via Gumroad</a>
          </p>
          {error && (
            <div className={`p-4 border rounded-2xl animate-in shake duration-300 ${error.type === 'connection' ? 'bg-amber-50 border-amber-100' : 'bg-red-50 border-red-100'}`}>
              <p className={`text-[10px] font-black uppercase tracking-widest leading-relaxed ${error.type === 'connection' ? 'text-amber-700' : 'text-red-600'}`}>
                {error.message}
              </p>
              {error.type === 'connection' && (
                <p className="text-[9px] text-amber-600 mt-2 font-medium">Tip: Run "netlify dev" or check port 8888.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LicenseGate;
