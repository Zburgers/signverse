// Animation Handler for SignVerse
// Manages both GLB-based and bone-based animations for Indian Sign Language (ISL)

import * as THREE from 'three';
// @ts-ignore - Ignoring type issues with Three.js modules
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// Raw bone animation format from original SignVerse JS implementation
// [boneName, action, axis, limit, sign]
export type RawBoneAnimation = [string, string, string, number, string];

// Typed version of the bone animation
export interface BoneAnimation {
  boneName: string;
  action: 'rotation' | 'position';
  axis: 'x' | 'y' | 'z';
  limit: number;
  sign: '+' | '-';
}

// Animation options to support both GLB and bone-based animations
export interface AnimationOptions {
  type: 'glb' | 'bone';
  name?: string; // Name of the animation (useful for alphabets, words)
  content: string | RawBoneAnimation[][] | BoneAnimation[][];
  duration?: number;
  speed?: number;
  pauseDuration?: number;
}

// Main animation reference object that manages the animation state
export interface AnimationReference {
  flag: boolean; // Flag to control animation flow
  pending: boolean; // Whether an animation is in progress
  animations: RawBoneAnimation[][] | any[]; // Queue of animations to play
  characters: string[]; // For text-based animations
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  avatar: THREE.Group | null; // The 3D model (xbot or ybot)
  animate: () => void; // Animation function
}

// Convert Sign-Kit animation format to our standard format
export function convertSignKitAnimation(animation: RawBoneAnimation[]): BoneAnimation[] {
  return animation.map(([boneName, action, axis, limit, sign]) => ({
    boneName,
    action: action as 'rotation' | 'position',
    axis: axis as 'x' | 'y' | 'z',
    limit,
    sign: sign as '+' | '-',
  }));
}

// Convert typed BoneAnimation back to raw format for compatibility
export function convertToRawAnimation(animations: BoneAnimation[]): RawBoneAnimation[] {
  return animations.map(({ boneName, action, axis, limit, sign }) => [
    boneName,
    action,
    axis,
    limit,
    sign
  ]);
}

// Load a GLB animation file
export function loadGlbAnimation(
  path: string,
  onLoad: (model: THREE.Group, animations: THREE.AnimationClip[]) => void,
  onProgress?: (event: ProgressEvent<EventTarget>) => void,
  onError?: (error: ErrorEvent) => void
) {
  const loader = new GLTFLoader();
  loader.load(
    path,
    (gltf) => {
      gltf.scene.traverse((child) => {
        if (child.type === 'SkinnedMesh') {
          (child as THREE.SkinnedMesh).frustumCulled = false;
        }
      });
      onLoad(gltf.scene, gltf.animations);
    },
    onProgress,
    onError as any
  );
}

// Play a bone-based animation
export function playBoneAnimation(
  ref: AnimationReference,
  animations: RawBoneAnimation[][],
  speed: number = 0.1,
  pauseDuration: number = 800
) {
  // Clear any existing animations if needed
  if (ref.animations.length === 0) {
    // Add each animation sequence
    animations.forEach(sequence => {
      ref.animations.push(sequence);
    });
    
    // Start the animation if not already running
    if (ref.pending === false) {
      ref.pending = true;
      ref.animate();
    }
  } else {
    // Add to the animation queue
    animations.forEach(sequence => {
      ref.animations.push(sequence);
    });
  }
}

// Initialize the animation reference object
export function initializeAnimationRef(
  container: HTMLElement,
  modelPath: string = '/models/ybot.glb'
): Promise<AnimationReference> {
  return new Promise((resolve, reject) => {
    const ref: Partial<AnimationReference> = {};
    
    // Initialize properties
    ref.flag = false;
    ref.pending = false;
    ref.animations = [];
    ref.characters = [];
    
    // Create scene
    ref.scene = new THREE.Scene();
    ref.scene.background = new THREE.Color(0xdddddd);
    
    // Add lighting
    const spotLight = new THREE.SpotLight(0xffffff, 2);
    spotLight.position.set(0, 5, 5);
    ref.scene!.add(spotLight);
    
    // Create camera
    ref.camera = new THREE.PerspectiveCamera(
      30,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    ref.camera.position.z = 1.6;
    ref.camera.position.y = 1.4;
    
    // Create renderer
    ref.renderer = new THREE.WebGLRenderer({ antialias: true });
    ref.renderer.setSize(container.clientWidth, container.clientHeight);
    container.innerHTML = '';
    container.appendChild(ref.renderer.domElement);
    
    // Define animation function
    ref.animate = function() {
      if (ref.animations!.length === 0) {
        ref.pending = false;
        return;
      }
      
      requestAnimationFrame(ref.animate as FrameRequestCallback);
      
      if (ref.animations![0].length) {
        if (!ref.flag) {
          for (let i = 0; i < ref.animations![0].length;) {
            let [boneName, action, axis, limit, sign] = ref.animations![0][i];
            
            if (!ref.avatar) continue;
            
            const bone = ref.avatar.getObjectByName(boneName);
            if (!bone) {
              i++;
              continue;
            }
            
            // @ts-ignore - We need to bypass type checking here for THREE.js access
            if (sign === "+" && bone[action][axis] < limit) {
              // @ts-ignore
              bone[action][axis] += 0.1; // Use speed parameter in real implementation
              // @ts-ignore
              bone[action][axis] = Math.min(bone[action][axis], limit);
              i++;
            // @ts-ignore
            } else if (sign === "-" && bone[action][axis] > limit) {
              // @ts-ignore
              bone[action][axis] -= 0.1; // Use speed parameter in real implementation
              // @ts-ignore
              bone[action][axis] = Math.max(bone[action][axis], limit);
              i++;
            } else {
              ref.animations![0].splice(i, 1);
            }
          }
        }
      } else {
        ref.flag = true;
        setTimeout(() => {
          ref.flag = false;
        }, 800); // Use pauseDuration parameter in real implementation
        ref.animations!.shift();
      }
      
      ref.renderer!.render(ref.scene!, ref.camera!);
    };
    
    // Load the model
    const loader = new GLTFLoader();
    loader.load(
      modelPath,
      (gltf) => {
        gltf.scene.traverse((child) => {
          if (child.type === 'SkinnedMesh') {
            (child as THREE.SkinnedMesh).frustumCulled = false;
          }
        });
        
        ref.avatar = gltf.scene;
        ref.scene!.add(ref.avatar);
        
        // Set default pose
        setDefaultPose(ref as AnimationReference);
        
        resolve(ref as AnimationReference);
      },
      (xhr) => {
        console.log(`${(xhr.loaded / xhr.total) * 100}% loaded`);
      },
      (error) => {
        console.error('Error loading avatar model:', error);
        reject(error);
      }
    );
  });
}

// Default pose for the avatar
export function setDefaultPose(ref: AnimationReference) {
  ref.characters.push(' ');
  const animations: RawBoneAnimation[] = [];
  
  animations.push(["mixamorigNeck", "rotation", "x", Math.PI/12, "+"]);
  animations.push(["mixamorigLeftArm", "rotation", "z", -Math.PI/3, "-"]);
  animations.push(["mixamorigLeftForeArm", "rotation", "y", -Math.PI/1.5, "-"]);
  animations.push(["mixamorigRightArm", "rotation", "z", Math.PI/3, "+"]);
  animations.push(["mixamorigRightForeArm", "rotation", "y", Math.PI/1.5, "+"]);
  ref.animations.push(animations);

  if(ref.pending === false){
    ref.pending = true;
    ref.animate();
  }
}
