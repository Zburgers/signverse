# Dev2 Plan – Backend Text to Sign Translator

## Goals
- Build smart translator logic that maps sentence to ISL sign filenames
- Improve and expand the phrase dictionary
- Integrate optional GenAI tools for better mapping

---

## Tasks

### ✅ 1. Simple Dictionary Translator
- Use `phraseMap` to map common terms to `.glb` files
- Strip punctuations, lowercase everything
- Return array of matching filenames

### ✅ 2. Expand Dictionary
- Added basic phrases for the MVP
- Set up proper file naming convention (e.g., `how_are_you.glb`)
- Created placeholder GLB files for demonstration

### ⏳ 3. Optional: GenKit/Gemini Integration
- Implemented basic text simplification (expanding contractions)
- For full implementation, would need to integrate Gemini API

---

## Implementation Details

### Text-to-Sign Pipeline
1. User inputs text or YouTube URL
2. Text is simplified (contractions expanded, etc.)
3. Words/phrases are matched to available sign files
4. SignKitPlayer renders the sequence of signs

### Phrase Mapping
The application uses a simple dictionary to map phrases to GLB files:
```json
{
  "hello": "/glb/hello.glb",
  "how are you": "/glb/how_are_you.glb",
  "thank you": "/glb/thank_you.glb"
}
```

### Future Improvements
- Integrate with Gemini API for better text simplification
- Add real YouTube transcript extraction
- Expand the sign language vocabulary
- Implement sign language detection via webcam

---

## Expected Output
- Fully working `/api/translate/route.ts` backend
- Returns signs[] array to frontend
- Reads from phraseMap and serves static paths like `/glb/hello.glb`
