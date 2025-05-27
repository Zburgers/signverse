import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { YoutubeTranscript } from 'youtube-transcript';

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

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
  'good': '/glb/good.glb',
  'morning': '/glb/morning.glb',
  'night': '/glb/night.glb',
  'fine': '/glb/fine.glb',
  'i': '/glb/i.glb',
  'am': '/glb/am.glb',
  'you': '/glb/you.glb',
  'are': '/glb/are.glb',
  'thanks': '/glb/thank_you.glb',
  'thank': '/glb/thank_you.glb',
};

// Function to simplify text using Gemini API
async function simplifyTextWithGemini(text: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `Simplify the following text into basic English phrases that can be mapped to sign language. 
    Break down complex sentences into simple phrases. Remove unnecessary words but keep the core meaning.
    Only return the simplified text for conversion into ISL, nothing else.
    
    Text: "${text}"`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const simplifiedText = response.text().trim();
    
    return simplifiedText;
  } catch (error) {
    console.error('Error simplifying text with Gemini:', error);
    // Fallback to basic simplification if API fails
    return text
      .replace(/[^\w\s]|_/g, ' ') // Remove punctuation
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .toLowerCase()
      .trim();
  }
}

// Function to translate text to sign language files
async function translateToSignLanguage(text: string): Promise<string[]> {
  // First, simplify the text using Gemini
  const simplifiedText = await simplifyTextWithGemini(text);
  const words = simplifiedText.split(/\s+/);
  const files: string[] = [];
  
  // First try exact phrase matches (up to 4 words)
  for (let i = 0; i < words.length; i++) {
    for (let j = 1; j <= 4 && i + j <= words.length; j++) {
      const phrase = words.slice(i, i + j).join(' ');
      if (phraseMap[phrase]) {
        files.push(phraseMap[phrase]);
        i += j - 1; // Skip words already matched in a phrase
        break;
      }
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
  
  // Remove duplicates while preserving order
  return Array.from(new Set(files));
}

// Function to extract text from YouTube video
async function extractTextFromYouTube(youtubeUrl: string): Promise<string> {
  const transcript = await YoutubeTranscript.fetchTranscript(youtubeUrl);
  return transcript.map(t => t.text).join(' ');
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, youtubeUrl } = body;
    
    if (!text && !youtubeUrl) {
      return NextResponse.json(
        { success: false, error: 'Either text or YouTube URL is required' },
        { status: 400 }
      );
    }
    
    let textToTranslate = text || '';
    
    // If YouTube URL is provided, extract text from video
    if (youtubeUrl) {
      try {
        const extractedText = await extractTextFromYouTube(youtubeUrl);
        if (extractedText) {
          textToTranslate = extractedText;
        }
      } catch (error) {
        console.error('Error extracting text from YouTube:', error);
        // Continue with the original text if YouTube extraction fails
      }
    }
    
    if (!textToTranslate.trim()) {
      return NextResponse.json(
        { success: false, error: 'No text to translate' },
        { status: 400 }
      );
    }
    
    // Translate text to sign language files
    const signFiles = await translateToSignLanguage(textToTranslate);
    
    if (signFiles.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No matching sign language files found for the input',
        originalText: textToTranslate
      }, { status: 404 });
    }
    
    return NextResponse.json({ 
      success: true, 
      signFiles,
      originalText: textToTranslate,
      simplifiedText: await simplifyTextWithGemini(textToTranslate)
    });
  } catch (error) {
    console.error('Error in translation API:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to translate text to sign language' 
    }, { status: 500 });
  }
}
