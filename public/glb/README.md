# SignVerse GLB Files

This directory contains the GLB files for the SignVerse application. These files are 3D animations of Indian Sign Language (ISL) signs.

## File Naming Convention

Files are named according to the sign they represent, with underscores replacing spaces:

- `hello.glb` - The sign for 'hello'
- `how_are_you.glb` - The sign for 'how are you'
- `thank_you.glb` - The sign for 'thank you'

and so on.

## Adding New Signs

When adding new signs, follow these steps:

1. Create a GLB file with the sign animation
2. Name it according to the convention above
3. Place it in this directory
4. Update the `phraseMap` in both `src/app/page.tsx` and `src/app/api/translate/route.ts`

## Source

These GLB files would typically come from the Sign-Kit repository or a similar source. For the MVP, we're using placeholder files.
