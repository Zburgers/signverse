import { NextRequest, NextResponse } from 'next/server';

// Sample phrase mapping for MVP
const phraseMap: Record<string, string> = {
  'hello': '/glb/hello.glb',
  'how are you': '/glb/how_are_you.glb',
  'i am fine': '/glb/i_am_fine.glb',
  'thank you': '/glb/thank_you.glb',
  'welcome': '/glb/welcome.glb',
  'good morning': '/glb/good_morning.glb',
  'good night': '/glb/good_night.glb',
  'yes': '/glb/yes.glb',
  'no': '/glb/no.glb',
};

// Function to simplify text using basic rules
// In a real app, this would use GenKit or Gemini API
function simplifyText(text: string): string {
  // Basic text simplification for MVP
  return text
    .replace(/\b(I am|I'm)\b/gi, 'I am')
    .replace(/\b(you are|you're)\b/gi, 'you are')
    .replace(/\b(they are|they're)\b/gi, 'they are')
    .replace(/\b(we are|we're)\b/gi, 'we are')
    .replace(/\b(he is|he's)\b/gi, 'he is')
    .replace(/\b(she is|she's)\b/gi, 'she is')
    .replace(/\b(it is|it's)\b/gi, 'it is')
    .replace(/\b(that is|that's)\b/gi, 'that is')
    .replace(/\b(what is|what's)\b/gi, 'what is')
    .replace(/\b(how is|how's)\b/gi, 'how is')
    .replace(/\b(who is|who's)\b/gi, 'who is')
    .replace(/\b(where is|where's)\b/gi, 'where is')
    .replace(/\b(when is|when's)\b/gi, 'when is')
    .replace(/\b(why is|why's)\b/gi, 'why is')
    .trim();
}

// Function to translate text to sign language files
function translateToSignLanguage(text: string): string[] {
  const simplifiedText = simplifyText(text.toLowerCase());
  const words = simplifiedText.split(/\s+/);
  const files: string[] = [];
  
  // First try exact phrase matches
  for (const phrase in phraseMap) {
    if (simplifiedText.includes(phrase)) {
      files.push(phraseMap[phrase]);
    }
  }
  
  // If no phrase matches, try word-by-word
  if (files.length === 0) {
    for (const word of words) {
      if (phraseMap[word]) {
        files.push(phraseMap[word]);
      }
    }
  }
  
  return files;
}

// Function to extract text from YouTube video
// In a real app, this would use YouTube API or a transcription service
async function extractTextFromYouTube(youtubeUrl: string): Promise<string> {
  // For MVP, return a sample text
  // In a real app, this would extract captions or transcribe audio
  return "Hello, how are you? Thank you for watching this video.";
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, youtubeUrl } = body;
    
    let textToTranslate = text;
    
    // If YouTube URL is provided, extract text from video
    if (youtubeUrl && !text) {
      textToTranslate = await extractTextFromYouTube(youtubeUrl);
    }
    
    // Translate text to sign language files
    const signFiles = translateToSignLanguage(textToTranslate);
    
    return NextResponse.json({ 
      success: true, 
      signFiles,
      originalText: textToTranslate
    });
  } catch (error) {
    console.error('Error in translation API:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to translate text to sign language' 
    }, { status: 500 });
  }
}
