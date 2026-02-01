import React, { useState, useEffect } from 'react';
import { CaptionOption, ContentType } from '../types';

interface CaptionCardProps {
  caption: CaptionOption;
  index: number;
  businessName: string;
  contentType: ContentType;
}

const IG_CHAR_LIMIT = 2200;

const CaptionCard: React.FC<CaptionCardProps> = ({ caption, index, businessName, contentType }) => {
  const [copied, setCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  
  const [editedHook, setEditedHook] = useState(caption.hook);
  const [editedBody, setEditedBody] = useState(caption.body);
  const [editedCTA, setEditedCTA] = useState(caption.cta);
  const [editedHashtags, setEditedHashtags] = useState(caption.hashtags || '');

  useEffect(() => {
    setEditedHook(caption.hook);
    setEditedBody(caption.body);
    setEditedCTA(caption.cta);
    setEditedHashtags(caption.hashtags || '');
  }, [caption]);

  const isStory = contentType === 'Story';
  const fullText = `${editedHook}\n\n${editedBody}\n\n${editedCTA}\n\n${editedHashtags}`;
  const charCount = fullText.length;
  const displayBusinessName = businessName.trim() || 'YourBusiness';

  const handleCopy = () => {
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([fullText], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    const safeName = displayBusinessName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    element.download = `${safeName}-caption-${index + 1}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all overflow-hidden flex flex-col h-full group">
      {/* Header */}
      <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isStory ? 'bg-pink-500' : 'bg-indigo-600'}`}></div>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Strategy {index + 1}</span>
        </div>
        <button
          onClick={() => setShowPreview(!showPreview)}
          className="text-[9px] font-black px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors uppercase tracking-widest"
        >
          {showPreview ? 'Edit Text' : 'Live View'}
        </button>
      </div>

      <div className="p-8 flex-grow overflow-y-auto">
        {showPreview ? (
          <div className={`mx-auto bg-slate-900 rounded-[2.5rem] overflow-hidden relative shadow-2xl border border-slate-800 transition-all ${isStory ? 'aspect-[9/16] w-[220px]' : 'aspect-square w-full'}`}>
             {/* IG MOCKUP TOP BAR */}
             <div className="absolute top-4 left-0 w-full px-4 flex items-center justify-between z-20">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 p-[1.5px]">
                    <div className="w-full h-full bg-slate-900 rounded-full border border-slate-900"></div>
                  </div>
                  <span className="text-[9px] font-black text-white">{displayBusinessName}</span>
                </div>
                <div className="flex gap-1">
                  <div className="w-0.5 h-0.5 rounded-full bg-white"></div>
                  <div className="w-0.5 h-0.5 rounded-full bg-white"></div>
                  <div className="w-0.5 h-0.5 rounded-full bg-white"></div>
                </div>
             </div>

             <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-slate-950">
                <div className="space-y-4">
                  <h4 className="text-white text-base font-black leading-tight uppercase tracking-tight drop-shadow-lg">{editedHook}</h4>
                  <p className="text-white/60 text-[10px] font-medium leading-relaxed max-w-[160px] mx-auto">{editedBody}</p>
                  <div className="pt-2">
                    <span className="bg-white text-slate-950 text-[10px] font-black px-5 py-2 rounded-full shadow-lg">{editedCTA}</span>
                  </div>
                </div>
                
                {isStory && caption.stickerIdea && (
                  <div className="absolute bottom-10 w-[80%] bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-4 transform rotate-[-3deg] shadow-2xl">
                    <p className="text-[7px] text-white/40 uppercase font-black tracking-widest mb-1">Engagement Sticker</p>
                    <p className="text-xs text-white font-bold leading-tight">{caption.stickerIdea}</p>
                  </div>
                )}
             </div>
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="space-y-1">
              <label className="text-[9px] font-black text-indigo-400 uppercase tracking-widest block">The Hook</label>
              <textarea 
                value={editedHook}
                onChange={(e) => setEditedHook(e.target.value)}
                rows={2}
                className="w-full font-black text-xl leading-tight text-slate-900 tracking-tight bg-transparent border-none p-0 focus:ring-0 resize-none placeholder-slate-200"
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-[9px] font-black text-slate-300 uppercase tracking-widest block">Body Copy</label>
              <textarea 
                value={editedBody}
                onChange={(e) => setEditedBody(e.target.value)}
                rows={5}
                className="w-full text-slate-600 leading-relaxed text-sm font-medium bg-transparent border-none p-0 focus:ring-0 resize-none placeholder-slate-200"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-black text-indigo-400 uppercase tracking-widest block">CTA</label>
              <input 
                value={editedCTA}
                onChange={(e) => setEditedCTA(e.target.value)}
                className="w-full text-indigo-600 font-black text-sm bg-transparent border-none p-0 focus:ring-0"
              />
            </div>
            
            <div className="pt-6 border-t border-slate-50">
              <label className="text-[9px] font-black text-slate-300 uppercase tracking-widest block mb-2">Hashtags</label>
              <p className="text-xs text-slate-400 font-medium leading-relaxed">{editedHashtags}</p>
            </div>
          </div>
        )}
      </div>

      <div className="px-8 py-5 bg-slate-50 border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className={`text-[10px] font-black tracking-widest ${charCount > IG_CHAR_LIMIT ? 'text-red-500' : 'text-slate-400'} uppercase`}>
          {charCount} / {IG_CHAR_LIMIT}
        </span>
        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={handleDownload}
            title="Download as .txt file"
            className="flex-1 sm:flex-none text-[10px] font-black px-4 py-2.5 rounded-xl border border-slate-200 text-slate-500 hover:bg-white hover:text-slate-900 transition-all uppercase tracking-widest bg-transparent shadow-sm"
          >
            TXT
          </button>
          <button
            onClick={handleCopy}
            className={`flex-[2] sm:flex-none text-[10px] font-black px-6 py-2.5 rounded-xl transition-all uppercase tracking-widest shadow-sm ${
              copied ? 'bg-green-500 text-white' : 'bg-slate-900 text-white hover:bg-black'
            }`}
          >
            {copied ? 'Copied!' : 'Copy Results'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CaptionCard;
