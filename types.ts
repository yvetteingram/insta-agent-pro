
export type BusinessType = 
  | 'Retail & E-commerce' 
  | 'Food & Beverage' 
  | 'Health & Wellness' 
  | 'Real Estate' 
  | 'Professional Services' 
  | 'Beauty & Personal Care' 
  | 'Other';

export type Tone = 'Professional' | 'Playful' | 'Urgent' | 'Minimalist' | 'Storytelling';

export type ConversionGoal = 'Engagement' | 'Traffic' | 'Sales' | 'Local' | 'Awareness';

export type ContentType = 'Feed Post' | 'Story';

export interface CaptionOption {
  hook: string;
  body: string;
  cta: string;
  hashtags?: string; // New: Added for hashtags
  stickerIdea?: string; 
  audioSuggestion?: string; // Suggested music/mood
}

export interface GenerationResult {
  captions: CaptionOption[];
}
