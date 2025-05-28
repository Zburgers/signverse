/**
 * Migration utility script to copy remaining necessary files from the client directory
 * to the main project while maintaining the correct structure.
 * 
 * Run with: node scripts/migrate-client-files.js
 */

const fs = require('fs');
const path = require('path');

// Paths
const CLIENT_DIR = path.resolve(__dirname, '../client/src');
const MAIN_DIR = path.resolve(__dirname, '../src');

// Helper to ensure directory exists
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Created directory: ${dirPath}`);
  }
}

// Helper to copy file
function copyFile(source, destination) {
  try {
    ensureDirectoryExists(path.dirname(destination));
    fs.copyFileSync(source, destination);
    console.log(`Copied: ${source} -> ${destination}`);
  } catch (error) {
    console.error(`Error copying ${source}: ${error.message}`);
  }
}

// List of files/directories to copy
const filesToCopy = [
  // Models
  { src: 'Models/xbot/xbot.glb', dest: 'models/xbot/xbot.glb' },
  { src: 'Models/xbot/xbot.png', dest: 'models/xbot/xbot.png' },
  { src: 'Models/ybot/ybot.glb', dest: 'models/ybot/ybot.glb' },
  { src: 'Models/ybot/ybot.png', dest: 'models/ybot/ybot.png' },
  
  // Animations 
  // Note: The Animations directory should be copied with care since we want to use TypeScript
  // We've already moved alphabets.js, words.js, and defaultPose.js to our src/animations directory
  
  // Other essential files from Components or Pages (if needed)
  // Check other specific files if you need more logic from the original implementation
];

// Copy files
console.log('Starting migration...');
filesToCopy.forEach(file => {
  const srcPath = path.join(CLIENT_DIR, file.src);
  const destPath = path.join(MAIN_DIR, file.dest);
  
  if (fs.existsSync(srcPath)) {
    copyFile(srcPath, destPath);
  } else {
    console.warn(`Source file not found: ${srcPath}`);
  }
});

// Special handling for public directory (if needed)
const publicSrcDir = path.resolve(__dirname, '../client/public');
const publicDestDir = path.resolve(__dirname, '../public');

if (fs.existsSync(publicSrcDir)) {
  // Copy public assets if any
  try {
    const files = fs.readdirSync(publicSrcDir);
    files.forEach(file => {
      const srcPath = path.join(publicSrcDir, file);
      const destPath = path.join(publicDestDir, file);
      
      if (fs.statSync(srcPath).isFile()) {
        copyFile(srcPath, destPath);
      }
    });
  } catch (error) {
    console.error(`Error copying public files: ${error.message}`);
  }
}

console.log('Migration completed!');
