# Dev1 Plan – Frontend + SignKit Avatar Integration

## Goals
- Build the SignKit-style avatar player and integrate GLB render logic
- Maintain the clean Next.js + Tailwind UI
- Ensure sentence -> animation playback loop works as expected

---

## Tasks

### ✅ 1. UI Polish
- Improve input UX: auto-focus, responsive layout
- Add loading spinner for animation load

### ✅ 2. Avatar Player
- Use `three.js` + `GLTFLoader` to render GLB animations
- Animate multiple signs sequentially from array of filenames

### ✅ 3. Assets Integration
- Place example files like `hello.glb`, `thank_you.glb` in `/public/glb/`
- Make player fetch these from static path

### ✅ 4. Optional: Add Avatar Control Features
- Speed toggle / pause-play (later)
- Visual indicator of phrase being shown

---

## Expected Output
- `SignKitPlayer.tsx` that cleanly loads and renders animations
- Fully working playback of avatar in `page.tsx`
