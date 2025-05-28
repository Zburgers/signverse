'use client';

import React, { useEffect, useRef, useState } from 'react';
// @ts-ignore
import * as THREE from 'three';

const SignLanguagePlayer = ({ text = '' }: { text?: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentLetter, setCurrentLetter] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);

  // Scene references
  const sceneRef = useRef<any>(null);
  const rendererRef = useRef<any>(null);
  const cameraRef = useRef<any>(null);
  const avatarRef = useRef<any>(null);
  const animationFrameRef = useRef<number | null>(null);
  const cleanupRef = useRef(false);

  // Mock sign language positions for letters (simplified bone rotations)
  const signPositions: Record<string, any> = {
    'A': { leftArm: { x: -0.5, y: 0.2, z: 0 }, rightArm: { x: 0.5, y: 0.2, z: 0 } },
    'B': { leftArm: { x: -0.3, y: 0.5, z: 0.2 }, rightArm: { x: 0.3, y: 0.5, z: 0.2 } },
    'C': { leftArm: { x: -0.4, y: 0.3, z: 0.1 }, rightArm: { x: 0.4, y: 0.3, z: 0.1 } },
    'D': { leftArm: { x: -0.2, y: 0.6, z: 0 }, rightArm: { x: 0.2, y: 0.6, z: 0 } },
    'E': { leftArm: { x: -0.6, y: 0.1, z: 0.1 }, rightArm: { x: 0.6, y: 0.1, z: 0.1 } },
    'F': { leftArm: { x: -0.3, y: 0.4, z: 0.3 }, rightArm: { x: 0.3, y: 0.4, z: 0.3 } },
    'G': { leftArm: { x: -0.5, y: 0.3, z: 0.2 }, rightArm: { x: 0.5, y: 0.3, z: 0.2 } },
    'H': { leftArm: { x: -0.4, y: 0.5, z: 0 }, rightArm: { x: 0.4, y: 0.5, z: 0 } },
    'I': { leftArm: { x: -0.2, y: 0.7, z: 0.1 }, rightArm: { x: 0.2, y: 0.7, z: 0.1 } },
    'J': { leftArm: { x: -0.3, y: 0.2, z: 0.4 }, rightArm: { x: 0.3, y: 0.2, z: 0.4 } },
    'K': { leftArm: { x: -0.5, y: 0.4, z: 0.1 }, rightArm: { x: 0.5, y: 0.4, z: 0.1 } },
    'L': { leftArm: { x: -0.6, y: 0.2, z: 0 }, rightArm: { x: 0.6, y: 0.2, z: 0 } },
    'M': { leftArm: { x: -0.3, y: 0.6, z: 0.2 }, rightArm: { x: 0.3, y: 0.6, z: 0.2 } },
    'N': { leftArm: { x: -0.4, y: 0.3, z: 0.3 }, rightArm: { x: 0.4, y: 0.3, z: 0.3 } },
    'O': { leftArm: { x: -0.2, y: 0.5, z: 0.1 }, rightArm: { x: 0.2, y: 0.5, z: 0.1 } },
    'P': { leftArm: { x: -0.5, y: 0.1, z: 0.2 }, rightArm: { x: 0.5, y: 0.1, z: 0.2 } },
    'Q': { leftArm: { x: -0.3, y: 0.4, z: 0 }, rightArm: { x: 0.3, y: 0.4, z: 0 } },
    'R': { leftArm: { x: -0.4, y: 0.6, z: 0.1 }, rightArm: { x: 0.4, y: 0.6, z: 0.1 } },
    'S': { leftArm: { x: -0.6, y: 0.3, z: 0 }, rightArm: { x: 0.6, y: 0.3, z: 0 } },
    'T': { leftArm: { x: -0.2, y: 0.4, z: 0.3 }, rightArm: { x: 0.2, y: 0.4, z: 0.3 } },
    'U': { leftArm: { x: -0.5, y: 0.5, z: 0.2 }, rightArm: { x: 0.5, y: 0.5, z: 0.2 } },
    'V': { leftArm: { x: -0.3, y: 0.7, z: 0 }, rightArm: { x: 0.3, y: 0.7, z: 0 } },
    'W': { leftArm: { x: -0.4, y: 0.2, z: 0.2 }, rightArm: { x: 0.4, y: 0.2, z: 0.2 } },
    'X': { leftArm: { x: -0.6, y: 0.4, z: 0.1 }, rightArm: { x: 0.6, y: 0.4, z: 0.1 } },
    'Y': { leftArm: { x: -0.2, y: 0.6, z: 0.3 }, rightArm: { x: 0.2, y: 0.6, z: 0.3 } },
    'Z': { leftArm: { x: -0.3, y: 0.3, z: 0.1 }, rightArm: { x: 0.3, y: 0.3, z: 0.1 } },
    // Common words
    'HELLO': { leftArm: { x: -0.4, y: 0.8, z: 0.2 }, rightArm: { x: 0.4, y: 0.8, z: 0.2 } },
    'THANK': { leftArm: { x: -0.3, y: 0.4, z: 0.4 }, rightArm: { x: 0.3, y: 0.4, z: 0.4 } },
    'YOU': { leftArm: { x: -0.5, y: 0.6, z: 0 }, rightArm: { x: 0.5, y: 0.6, z: 0 } },
    'PLEASE': { leftArm: { x: -0.2, y: 0.3, z: 0.2 }, rightArm: { x: 0.2, y: 0.3, z: 0.2 } }
  };

  // Initialize Three.js scene
  useEffect(() => {
    if (!containerRef.current || cleanupRef.current) return;

    const container = containerRef.current;
    
    // Remove previous Three.js canvas if any
    const existingCanvas = container.querySelector('canvas');
    if (existingCanvas) {
      container.removeChild(existingCanvas);
    }

    // Create scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f8ff);
    sceneRef.current = scene;

    // Create camera
    const camera = new THREE.PerspectiveCamera(
      50,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 1.6, 4);
    cameraRef.current = camera;

    // Create renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;
    container.appendChild(renderer.domElement);

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Create simple avatar (basic humanoid shape)
    createSimpleAvatar(scene);

    // Start render loop
    const animate = () => {
      if (cleanupRef.current) return;
      
      if (renderer && scene && camera) {
        renderer.render(scene, camera);
      }
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    animate();

    setIsLoading(false);

    // Cleanup function
    return () => {
      cleanupRef.current = true;
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      if (renderer) {
        if (container && container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
        renderer.dispose();
      }

      if (scene) {
        scene.traverse((object: any) => {
          if (object.geometry) object.geometry.dispose();
          if (object.material) {
            if (Array.isArray(object.material)) {
              object.material.forEach((material: any) => material.dispose());
            } else {
              object.material.dispose();
            }
          }
        });
      }
    };
  }, []);

  // Create simple avatar
  const createSimpleAvatar = (scene: any) => {
    const avatar = new THREE.Group();
    
    // Body
    const bodyGeometry = new THREE.CylinderGeometry(0.3, 0.4, 1.2, 8);
    const bodyMaterial = new THREE.MeshLambertMaterial({ color: 0x4a90e2 });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 0.6;
    avatar.add(body);

    // Head
    const headGeometry = new THREE.SphereGeometry(0.25, 16, 16);
    const headMaterial = new THREE.MeshLambertMaterial({ color: 0xffdbac });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 1.45;
    avatar.add(head);

    // Left arm
    const armGeometry = new THREE.CylinderGeometry(0.08, 0.1, 0.6, 8);
    const armMaterial = new THREE.MeshLambertMaterial({ color: 0xffdbac });
    const leftArm = new THREE.Mesh(armGeometry, armMaterial);
    leftArm.position.set(-0.45, 0.8, 0);
    leftArm.name = 'leftArm';
    avatar.add(leftArm);

    // Right arm
    const rightArm = new THREE.Mesh(armGeometry, armMaterial);
    rightArm.position.set(0.45, 0.8, 0);
    rightArm.name = 'rightArm';
    avatar.add(rightArm);

    // Legs
    const legGeometry = new THREE.CylinderGeometry(0.08, 0.12, 0.8, 8);
    const leftLeg = new THREE.Mesh(legGeometry, armMaterial);
    leftLeg.position.set(-0.15, -0.4, 0);
    avatar.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeometry, armMaterial);
    rightLeg.position.set(0.15, -0.4, 0);
    avatar.add(rightLeg);

    scene.add(avatar);
    avatarRef.current = avatar;
  };

  // Animate to position
  const animateToPosition = (targetPos: any, duration = 800) => {
    if (!avatarRef.current) return;

    const leftArm = avatarRef.current.getObjectByName('leftArm');
    const rightArm = avatarRef.current.getObjectByName('rightArm');

    if (!leftArm || !rightArm) return;

    const startLeft = { ...leftArm.rotation };
    const startRight = { ...rightArm.rotation };

    const startTime = Date.now();

    const animate = () => {
      if (cleanupRef.current) return;

      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Smooth easing
      const easeProgress = 1 - Math.pow(1 - progress, 3);

      // Interpolate rotations
      leftArm.rotation.x = startLeft.x + (targetPos.leftArm.x - startLeft.x) * easeProgress;
      leftArm.rotation.y = startLeft.y + (targetPos.leftArm.y - startLeft.y) * easeProgress;
      leftArm.rotation.z = startLeft.z + (targetPos.leftArm.z - startLeft.z) * easeProgress;

      rightArm.rotation.x = startRight.x + (targetPos.rightArm.x - startRight.x) * easeProgress;
      rightArm.rotation.y = startRight.y + (targetPos.rightArm.y - startRight.y) * easeProgress;
      rightArm.rotation.z = startRight.z + (targetPos.rightArm.z - startRight.z) * easeProgress;

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  };

  // Reset to neutral position
  const resetToNeutral = () => {
    const neutralPos = {
      leftArm: { x: 0, y: 0, z: 0 },
      rightArm: { x: 0, y: 0, z: 0 }
    };
    animateToPosition(neutralPos, 500);
  };

  // Animate text
  useEffect(() => {
    if (!text || !avatarRef.current || isAnimating) return;

    const animateText = async () => {
      setIsAnimating(true);
      const words = text.toUpperCase().split(' ');

      for (const word of words) {
        // Check if it's a common word first
        if (signPositions[word]) {
          setCurrentLetter(word);
          animateToPosition(signPositions[word], 1000);
          await new Promise(resolve => setTimeout(resolve, 1500));
        } else {
          // Spell out the word letter by letter
          for (const letter of word) {
            if (signPositions[letter]) {
              setCurrentLetter(letter);
              animateToPosition(signPositions[letter], 600);
              await new Promise(resolve => setTimeout(resolve, 1000));
            }
          }
        }
        
        // Pause between words
        resetToNeutral();
        await new Promise(resolve => setTimeout(resolve, 800));
      }

      setCurrentLetter('');
      setIsAnimating(false);
    };

    animateText();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, isAnimating]);

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <h2 className="text-xl font-bold">Sign Language Avatar</h2>
          <p className="text-blue-100">Converting text to sign language</p>
        </div>
        
        <div
          ref={containerRef}
          className="relative w-full h-96 bg-gradient-to-b from-sky-100 to-sky-200"
        >
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading avatar...</p>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-600">Current:</span>
              {currentLetter && (
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-bold">
                  {currentLetter}
                </span>
              )}
              {isAnimating && (
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-green-600 font-medium">Animating...</span>
                </div>
              )}
            </div>
            
            <button
              onClick={resetToNeutral}
              disabled={isAnimating}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Reset Pose
            </button>
          </div>
          
          {text && (
            <div className="mt-3 p-3 bg-white rounded border">
              <span className="text-sm font-medium text-gray-600">Text: </span>
              <span className="text-gray-800">{text}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Demo component
const SignLanguageMVP = () => {
  const [inputText, setInputText] = useState('');
  const [displayText, setDisplayText] = useState('');

  const handleSubmit = () => {
    if (inputText.trim()) {
      setDisplayText(inputText.trim());
    }
  };

  const demoTexts = [
    'HELLO',
    'THANK YOU',
    'PLEASE',
    'ABC',
    'HELLO WORLD'
  ];

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Sign Language Avatar MVP
          </h1>
          <p className="text-gray-600">
            Enter text below to see the 3D avatar perform sign language
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <SignLanguagePlayer text={displayText} />
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Enter Text</h3>
              <div className="space-y-4">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Type text to convert to sign language..."
                  className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={4}
                />
                <button
                  onClick={handleSubmit}
                  className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors font-medium"
                >
                  Animate Text
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Demo</h3>
              <div className="grid grid-cols-1 gap-2">
                {demoTexts.map((demo, index) => (
                  <button
                    key={index}
                    onClick={() => setDisplayText(demo)}
                    className="p-2 text-left bg-gray-50 hover:bg-gray-100 rounded border transition-colors"
                  >
                    {demo}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Features</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• All 26 alphabet letters</li>
                <li>• 4 common words (HELLO, THANK, YOU, PLEASE)</li>
                <li>• Smooth animation transitions</li>
                <li>• Word and letter-by-letter spelling</li>
                <li>• Simple 3D avatar</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignLanguageMVP;
