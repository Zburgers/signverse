# SignVerse Development Plan & Current Status

## ✅ PHASE 1: Core MVP (DEV 1) – UI, GLB Playback, Basic API

### 🔹 UI Interface (`/src/app/page.tsx`) - **COMPLETED**
- [x] Tab-based input: Text / YouTube (placeholder)
- [x] Chat-style conversation view
- [x] Avatar display section
- [x] Input submit button functionality
- [x] Display translated signs as subtitles
- [x] Responsive design + loading indicator

### 🔹 SignKitPlayer (`/src/components/SignKitPlayer.tsx`) - **COMPLETED**
- [x] Three.js canvas setup
- [x] GLTFLoader integration
- [x] Sequential animation playback logic
- [x] Pause / Reset / Play controls
- [x] Avatar rotation / camera controls (via OrbitControls)
- [x] Loading spinner while loading signs
- [ ] Error fallback for invalid GLBs (partially implemented)

### 🔹 Translation API (`/src/app/api/translate/route.ts`) - **IN PROGRESS**
- [x] Basic text input handling
- [x] Phrase-to-GLB mapping (in-code dictionary)
- [x] YouTube URL placeholder (returns sample text)
- [x] Basic text simplification (contractions expansion)
- [ ] External `mapping.json` configuration
- [ ] Advanced text processing (Gemini/GenKit)

## 🚧 PHASE 2: Core Engine Upgrade (DEV 2) – Firebase + Gemini Integration

### 📊 Current Implementation Status (as of 2025-05-27)

**What's Working:**
- Complete UI with all planned input methods (text, YouTube placeholder, chat)
- Functional Three.js avatar renderer with animation controls
- Basic text-to-sign translation using in-code phrase mapping
- Sequential playback of multiple signs
- Loading states and error handling in UI

**What Needs Work:**
1. **Backend Services**
   - [ ] Firebase Functions not yet set up
   - [x] No real YouTube API integration (placeholder only)
   - [ ] Missing AI-powered text simplification

2. **Configuration**
   - [ ] Move phrase mapping from code to `mapping.json`
   - [x] Add environment configuration for API keys
   - [ ] Set up deployment configuration

### 🔹 Firebase Backend Setup - **PENDING**
- [ ] Setup Firebase project
- [ ] Add firebase.json, functions/ directory
- [ ] Initialize Firebase Hosting + Functions
- [ ] Add Firestore database for logs (optional)
- [ ] Deploy first test function

### 🔹 Firebase Functions - **PENDING**
- [ ] Convert /translate API to cloud function
- [ ] Handle text input, route to Gemini/GenKit
- [ ] Handle fallback response for unknown phrases
- [ ] Log translation requests (optional)

### 🔹 Gemini / GenKit Integration - **PENDING**
- [ ] Configure GenKit + Google Cloud Gemini API
- [ ] Send full sentence → receive simplified, segmented ISL-compatible phrases
- [ ] Fallback to basic text simplifier if Gemini fails
- [ ] Log Gemini usage + token count (optional)
- [ ] Ensure response format matches current GLB mapping

### 🔹 Mapping Logic Upgrade - **IN PROGRESS**
- [ ] Create mapping.json in /public/ or /data/
- [ ] Format: { "how are you": "how_are_you.glb", ... }
- [ ] Auto-load mapping in both API and player
- [ ] Add dev tool to update and test mappings

## 🔄 PHASE 3: Media Input – YouTube, Video Upload, Transcription

### 🚀 Next Steps (Priority Order)

1. **Immediate (DEV 1 Completion)**
   - [ ] Implement error handling for missing/unsupported signs
   - [ ] Move phrase mapping to external `mapping.json`
   - [ ] Add loading states for API calls
   - [ ] Basic unit tests for core components

2. **Near-term (DEV 2 Preparation)**
   - [ ] Set up Firebase Functions
   - [ ] Implement Gemini/GenKit integration for text simplification
   - [ ] Create real YouTube transcription service
   - [ ] Add more sign language vocabulary (GLB files)

### 🔹 YouTube Integration - **PENDING**
- [ ] Add backend support for YouTube URL parsing
- [ ] Use YouTube Transcript API or Puppeteer fallback
- [ ] Extract and simplify transcript via Gemini
- [ ] Integrate results into sign playback queue

### 🔹 Video Upload (Optional) - **PENDING**
- [ ] Add file input (MP4/WebM)
- [ ] Run audio → text transcription (Whisper API or GCP)
- [ ] Route transcript into translation pipeline
- [ ] Show uploaded video next to avatar for comparison

## 🎨 PHASE 4: UI Polish + UX Flow Enhancements

### 📊 Current Tech Stack
- **Frontend**: Next.js 15.3.2 with App Router
- **3D Rendering**: Three.js with GLTFLoader
- **UI**: Tailwind CSS
- **State Management**: React Hooks
- **Build Tool**: Turbopack

### 🔹 Chat & Playback UI - **PARTIAL**
- [x] Auto-scroll chat on new input
- [x] Show user prompt and system response
- [x] Loading animation when fetching
- [ ] Subtitle syncing with playback (basic implementation exists)
- [ ] Minimalist color palette + logo (basic styling exists)

### 🔹 Mobile Responsiveness - **PARTIAL**
- [x] Fully responsive layout
- [ ] Touch controls for avatar manipulation (basic touch exists)
- [ ] Mobile-optimized subtitles and input flow

## 🔒 PHASE 5: Deployment & Hosting - **PENDING**

### 🔹 Vercel Setup
- [ ] Create vercel.json
- [ ] Link to GitHub repository
- [ ] Set Vercel environment variables
- [ ] Deploy working frontend + test

### 🔹 Firebase Hosting + Functions
- [ ] Deploy Firebase Functions
- [ ] Test API routing from frontend → functions
- [ ] Configure domain + HTTPS
- [ ] Add fallback page and 404 page

🧠 PHASE 6: Expansion & Realism
🔹 GLB File Expansion
 Add 20–50 new ISL signs (e.g., greetings, questions, actions)

 Use consistent bone rig / animation structure

 Store in /public/glb/ and update mapping

🔹 Multi-language Support (Future)
 Gemini to auto-detect input language

 Add mapping per language (mapping_en.json, mapping_hi.json)

 Prompt user to confirm detected language

🔹 Avatar Customization
 Allow avatar skin/clothing variants

 Option to switch between avatars

 Add background color or environment switch

## 🧪 PHASE 7: Testing, QA, and Final Launch - **PENDING**

### 🔹 Unit Testing
- [ ] API tests for /translate
- [ ] GLB loading tests (valid/invalid files)
- [ ] Phrase-to-animation integrity tests

### 🔹 User Testing
- [ ] Internal feedback loop from 3–5 testers
- [ ] Error handling test cases
- [ ] Log issues and resolve

### 🔹 Final Launch
- [ ] Announce on social media
- [ ] Demo video showcasing features
- [ ] Add basic analytics (Posthog or Firebase)

## 🧭 Optional Future Phases

### 📝 Notes
- The project is currently in a functional MVP state with core UI/UX implemented
- Backend services need to be connected for full functionality
- The codebase is well-structured and follows React/Next.js best practices
- Good test coverage and documentation will be important for future maintenance

### Future Enhancements:
- Voice Input → Transcribe → Sign
- Realtime Sign Chatbot
- Community-uploaded GLB files (crowdsourced signs)
- Educational mode for learning sign language
- User authentication and saved translations
- Custom avatar selection and personalization

