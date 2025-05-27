"use client";

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
// @ts-ignore - Ignoring type issues with Three.js modules
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
// @ts-ignore - Ignoring type issues with Three.js modules
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

interface SignKitPlayerProps {
  signFiles: string[];
  onComplete?: () => void;
  autoPlay?: boolean;
}

const SignKitPlayer = ({ signFiles, onComplete, autoPlay = true }: SignKitPlayerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentSignIndex, setCurrentSignIndex] = useState(0);
  const [currentSignName, setCurrentSignName] = useState('');
  
  // Three.js objects
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const clockRef = useRef<THREE.Clock | null>(null);
  const modelRef = useRef<THREE.Group | null>(null);
  
  // Animation state
  const animationDuration = 2.5; // Duration for each sign in seconds
  const [isPaused, setIsPaused] = useState(!autoPlay);
  const animationTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize Three.js scene
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Initialize scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);
    sceneRef.current = scene;
    
    // Initialize camera
    const camera = new THREE.PerspectiveCamera(
      45, 
      containerRef.current.clientWidth / containerRef.current.clientHeight, 
      0.1, 
      1000
    );
    camera.position.set(0, 1.5, 3);
    cameraRef.current = camera;
    
    // Initialize renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;
    
    // Add controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 1, 0);
    controls.update();
    controlsRef.current = controls;
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7.5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);
    
    // Initialize clock for animations
    clockRef.current = new THREE.Clock();
    
    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
      
      cameraRef.current.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      if (mixerRef.current && !isPaused) {
        mixerRef.current.update(clockRef.current?.getDelta() || 0);
      }
      
      if (controlsRef.current) {
        controlsRef.current.update();
      }
      
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    
    animate();
    
    // Load the first sign if available
    if (signFiles.length > 0) {
      loadSign(signFiles[0]);
    } else {
      setIsLoading(false);
    }
    
    return () => {
      window.removeEventListener('resize', handleResize);
      
      if (animationTimerRef.current) {
        clearTimeout(animationTimerRef.current);
      }
      
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
      
      rendererRef.current?.dispose();
    };
  }, []);
  
  // Handle sign file changes
  useEffect(() => {
    if (signFiles.length > 0 && currentSignIndex < signFiles.length) {
      loadSign(signFiles[currentSignIndex]);
      
      // Extract sign name from filename
      const filename = signFiles[currentSignIndex].split('/').pop() || '';
      const signName = filename.replace('.glb', '').replace(/_/g, ' ');
      setCurrentSignName(signName);
      
      // Set timer for next sign if not paused
      if (!isPaused) {
        if (animationTimerRef.current) {
          clearTimeout(animationTimerRef.current);
        }
        
        animationTimerRef.current = setTimeout(() => {
          if (currentSignIndex < signFiles.length - 1) {
            setCurrentSignIndex(prevIndex => prevIndex + 1);
          } else if (onComplete) {
            onComplete();
          }
        }, animationDuration * 1000);
      }
    }
    
    return () => {
      if (animationTimerRef.current) {
        clearTimeout(animationTimerRef.current);
      }
    };
  }, [currentSignIndex, signFiles, isPaused, onComplete]);
  
  // Load a sign GLB file
  const loadSign = (filePath: string) => {
    if (!sceneRef.current) return;
    
    setIsLoading(true);
    
    // Remove previous model if exists
    if (modelRef.current) {
      sceneRef.current.remove(modelRef.current);
    }
    
    const loader = new GLTFLoader();
    loader.load(
      filePath,
      (gltf: any) => {
        const model = gltf.scene;
        model.position.set(0, 0, 0);
        model.scale.set(1, 1, 1);
        
        sceneRef.current?.add(model);
        modelRef.current = model;
        
        // Handle animations
        if (gltf.animations.length > 0) {
          const mixer = new THREE.AnimationMixer(model);
          const animation = mixer.clipAction(gltf.animations[0]);
          animation.play();
          mixerRef.current = mixer;
        }
        
        setIsLoading(false);
      },
      (xhr: any) => {
        // Progress callback
        console.log(`${(xhr.loaded / xhr.total) * 100}% loaded`);
      },
      (error: any) => {
        console.error('Error loading GLB:', error);
        setIsLoading(false);
      }
    );
  };
  
  // Play/pause controls
  const togglePlayPause = () => {
    setIsPaused(!isPaused);
  };
  
  // Reset to beginning
  const reset = () => {
    setCurrentSignIndex(0);
  };
  
  return (
    <div className="flex flex-col w-full">
      <div 
        ref={containerRef} 
        className="relative w-full aspect-video bg-gray-100 rounded-lg overflow-hidden"
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>
      
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm font-medium">
          {currentSignName && (
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">
              {currentSignName}
            </span>
          )}
        </div>
        
        <div className="flex space-x-2">
          <button 
            onClick={togglePlayPause}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            {isPaused ? 'Play' : 'Pause'}
          </button>
          
          <button 
            onClick={reset}
            className="px-3 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignKitPlayer;
