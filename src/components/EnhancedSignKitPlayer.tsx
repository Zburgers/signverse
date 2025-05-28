"use client";

  import { useCallback, useEffect, useRef, useState } from 'react';
  import * as THREE from 'three';
  // @ts-ignore - Ignoring type issues with Three.js modules
  import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
  // @ts-ignore - Ignoring type issues with Three.js modules
  import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
  import {
    AnimationOptions,
    AnimationReference,
    RawBoneAnimation,
    BoneAnimation,
    setDefaultPose,
    convertToRawAnimation
  } from '@/lib/animationHandler';

  // Import alphabets and words animations if needed
  import * as alphabets from '@/animations/alphabets';
  import * as words from '@/animations/words';

  interface EnhancedSignKitPlayerProps {
    animations?: AnimationOptions[];
    text?: string; // Text to animate using Sign Language
    onComplete?: () => void;
    autoPlay?: boolean;
    avatarModel?: string; // Path to avatar model (xbot.glb or ybot.glb)
    showControls?: boolean;
    speed?: number; // Animation speed
    pauseDuration?: number; // Pause duration between animations
  }

  const EnhancedSignKitPlayer = ({
    animations = [],
    text,
    onComplete,
    autoPlay = true,
    avatarModel = '/models/ybot.glb',
    showControls = true,
    speed = 0.1,
    pauseDuration = 800
  }: EnhancedSignKitPlayerProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    // Three.js refs
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const controlsRef = useRef<OrbitControls | null>(null);
    const clockRef = useRef<THREE.Clock | null>(null);
    const animationRef = useRef<AnimationReference | null>(null);
    const modelRef = useRef<THREE.Object3D | null>(null);
    const mixerRef = useRef<THREE.AnimationMixer | null>(null);
    const renderLoopRef = useRef<number | null>(null);
    const animationTimerRef = useRef<NodeJS.Timeout | null>(null);
    // Flag for preventing actions during cleanup
    const isCleaningUpRef = useRef<boolean>(false);

    const [isLoading, setIsLoading] = useState(true);
    const [debugLogs, setDebugLogs] = useState<{ msg: string; level: 'info' | 'warn' | 'error' }[]>([]);
    const debugLogRef = useRef<HTMLDivElement>(null);
    const log = (msg: string, level: 'info' | 'warn' | 'error' = 'info') => {
      setDebugLogs(prev => {
        const next = [...prev, { msg, level }];
        return next.slice(-50); // Keep last 50 logs
      });
      if (level === 'error') {
        console.error(msg);
      } else if (level === 'warn') {
        console.warn(msg);
      } else {
        console.debug(msg);
      }
    };
    const clearLogs = () => setDebugLogs([]);

    const [currentAnimationIndex, setCurrentAnimationIndex] = useState(0);
    const [currentAnimationName, setCurrentAnimationName] = useState('');
    const [isPaused, setIsPaused] = useState(!autoPlay);
    // refs for dynamic speed and pauseDuration
    const speedRef = useRef(speed);
    const pauseRef = useRef(pauseDuration);

    // update refs when speed or pauseDuration props change
    useEffect(() => {
      log(`[EnhancedPlayer] speed updated to ${speed}`);
      speedRef.current = speed;
      log(`[EnhancedPlayer] pauseDuration updated to ${pauseDuration}`);
      pauseRef.current = pauseDuration;
    }, [speed, pauseDuration]);

    // Process text input into animations
    useEffect(() => {
      if (text && text.trim() !== '' && animationRef.current && !isLoading) {
        log(`[EnhancedPlayer] processText effect triggered with text='${text}', isLoading=${isLoading}, isPaused=${isPaused}`);
        const processText = () => {
          if (animationRef.current && animationRef.current.avatar) {
            log('[EnhancedPlayer] Clearing existing animations');
            animationRef.current.animations = [];

            const upperText = text.toUpperCase();
            log(`[EnhancedPlayer] Converting to uppercase: ${upperText}`);
            const wordsArray = upperText.split(' ');
            log(`[EnhancedPlayer] Split into words: ${JSON.stringify(wordsArray)}`);

            wordsArray.forEach(word => {
              log(`[EnhancedPlayer] Processing word: ${word}`);
              if ((words as any)[word]) {
                log(`[EnhancedPlayer] Found word animation for: ${word}`);
                (words as any)[word](animationRef.current);
              } else {
                for (const char of word) {
                  log(`[EnhancedPlayer] Processing char: ${char}`);
                  if ((alphabets as any)[char]) {
                    log(`[EnhancedPlayer] Found alphabet animation for: ${char}`);
                    (alphabets as any)[char](animationRef.current);
                  } else {
                    log(`[EnhancedPlayer] No animation found for char: ${char}`, 'warn');
                  }
                }
              }
            });

            if (animationRef.current && animationRef.current.pending === false && !isPaused) {
              log('[EnhancedPlayer] Starting animation');
              animationRef.current.pending = true;
              animationRef.current.animate();
            }
          } else {
            log('[EnhancedPlayer] Avatar not loaded yet', 'warn');
          }
        };

        processText();
      }
    }, [text, isLoading, isPaused]);

    // Initialize Three.js scene and load model (only on avatarModel change)
    useEffect(() => {
      if (!containerRef.current) return;
      // Reset cleanup flag so new scene can initialize
      isCleaningUpRef.current = false;
      log(`[EnhancedPlayer] Initializing scene with model: ${avatarModel}`);

      const container = containerRef.current;
      
      // Create scene
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0xf0f0f0);
      sceneRef.current = scene;

      // Create camera
      const camera = new THREE.PerspectiveCamera(
        45,
        container.clientWidth / container.clientHeight,
        0.1,
        1000
      );
      camera.position.set(0, 1.5, 3);
      cameraRef.current = camera;

      // Create renderer
      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.shadowMap.enabled = true;
      rendererRef.current = renderer;

      // Remove previous Three.js canvas if any
      const existingCanvas = container.querySelector('canvas');
      if (existingCanvas) {
        container.removeChild(existingCanvas);
      }

       container.appendChild(renderer.domElement);

      // Create controls
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.target.set(0, 1, 0);
      controls.update();
      controlsRef.current = controls;

      // Add lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
      directionalLight.position.set(5, 10, 7.5);
      directionalLight.castShadow = true;
      scene.add(directionalLight);

      // Create clock
      clockRef.current = new THREE.Clock();

      // Initialize the animation reference object
      const ref: AnimationReference = {
        flag: false,
        pending: false,
        animations: [],
        characters: [],
        scene,
        camera,
        renderer,
        avatar: null!, // Will be set after model load
        animate: () => {}, // Placeholder, will be reassigned below
      };
      animationRef.current = ref;

      // Define animation function for bone animations
      ref.animate = () => {
        const currentRef = animationRef.current;
        if (!currentRef || !currentRef.animations || currentRef.animations.length === 0 || isCleaningUpRef.current) {
          if (currentRef?.pending) currentRef.pending = false;
          return;
        }

        if (currentRef.animations[0]?.length && !currentRef.flag && !isPaused) {
          for (let i = 0; i < currentRef.animations[0].length;) {
            let [boneName, action, axis, limit, sign] = currentRef.animations[0][i];

            if (!currentRef.avatar || isCleaningUpRef.current) {
              i++;
              continue;
            }

            const bone = currentRef.avatar.getObjectByName(boneName);
            if (!bone) {
              i++;
              continue;
            }

            const validAxis = axis as 'x' | 'y' | 'z';
            const boneProperty = (bone as any)[action] as THREE.Euler | THREE.Vector3;

            const speedVal = speedRef.current;
            // const pauseVal = pauseRef.current; // remove unused var, use pauseRef.current directly in setTimeout

            if (sign === "+" && boneProperty && boneProperty[validAxis] < limit) {
              boneProperty[validAxis] += speedVal;
              boneProperty[validAxis] = Math.min(boneProperty[validAxis], limit);
              i++;
            } else if (sign === "-" && boneProperty && boneProperty[validAxis] > limit) {
              boneProperty[validAxis] -= speedVal;
              boneProperty[validAxis] = Math.max(boneProperty[validAxis], limit);
              i++;
            } else {
              currentRef.animations[0].splice(i, 1);
            }
          }
          
          if (currentRef.animations[0]?.length > 0 && !isPaused && !isCleaningUpRef.current) {
            requestAnimationFrame(currentRef.animate as FrameRequestCallback);
          }
        } else if (currentRef.animations[0]?.length === 0) {
            currentRef.flag = true;
            setTimeout(() => {
              if (currentRef && !isCleaningUpRef.current) currentRef.flag = false;
            }, pauseRef.current);
          currentRef.animations.shift();

          if (currentRef.animations.length === 0 && currentAnimationIndex < animations.length - 1) {
            setCurrentAnimationIndex(prev => prev + 1);
          } else if (currentRef.animations.length === 0 && onComplete) {
            onComplete();
          }
        }
      };

      // Define main render loop
      const renderLoop = () => {
        if (isCleaningUpRef.current) return;
        
        if (rendererRef.current && sceneRef.current && cameraRef.current) {
          if (mixerRef.current && !isPaused) {
            mixerRef.current.update(clockRef.current?.getDelta() || 0);
          }

          if (controlsRef.current) {
            controlsRef.current.update();
          }

          rendererRef.current.render(sceneRef.current, cameraRef.current);
        }
        
        if (!isCleaningUpRef.current) {
          renderLoopRef.current = requestAnimationFrame(renderLoop);
        }
      };

      renderLoop();

      // Handle resize
      const handleResize = () => {
        if (!containerRef.current || !cameraRef.current || !rendererRef.current || isCleaningUpRef.current) return;

        cameraRef.current.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
      };
      
      window.addEventListener('resize', handleResize);

      // Load avatar model
      const loader = new GLTFLoader();
      loader.load(
        avatarModel,
        (gltf) => {
          log(`[EnhancedPlayer] Model loaded callback: ${avatarModel}`);
          if (isCleaningUpRef.current) return;
          
          gltf.scene.traverse((child) => {
            if ((child as THREE.SkinnedMesh).isSkinnedMesh) {
              (child as THREE.SkinnedMesh).frustumCulled = false;
            }
          });

          const model = gltf.scene;
          scene.add(model);
          if (animationRef.current) {
            animationRef.current.avatar = model;
          }
          modelRef.current = model;

          if (animationRef.current) {
            setDefaultPose(animationRef.current);
          }

          setIsLoading(false);
          log('[EnhancedPlayer] isLoading set to false');

          if (animations.length > 0) {
            log('[EnhancedPlayer] Loading first animation');
            loadAnimation(animations[0]);
          }
        },
        (xhr) => {
          if (xhr.total > 0) {
            const pct = ((xhr.loaded / xhr.total) * 100).toFixed(2);
            log(`[EnhancedPlayer] Model load progress: ${pct}%`);
          }
        },
        (error) => {
          log(`Error loading avatar model: ${error}`, 'error');
          setIsLoading(false);
        }
      );

      // Cleanup function
      return () => {
        isCleaningUpRef.current = true;
        log('[EnhancedPlayer] Cleaning up scene');
        
        window.removeEventListener('resize', handleResize);

        if (renderLoopRef.current) {
          cancelAnimationFrame(renderLoopRef.current);
          renderLoopRef.current = null;
        }

        if (animationTimerRef.current) {
          clearTimeout(animationTimerRef.current);
          animationTimerRef.current = null;
        }

        if (mixerRef.current) {
          mixerRef.current.stopAllAction();
          mixerRef.current.uncacheRoot(mixerRef.current.getRoot());
          mixerRef.current = null;
        }

        if (controlsRef.current) {
          controlsRef.current.dispose();
          controlsRef.current = null;
        }

        if (sceneRef.current) {
          sceneRef.current.traverse((object) => {
            if ((object as THREE.Mesh).isMesh) {
              const mesh = object as THREE.Mesh;
              mesh.geometry?.dispose();

              if (Array.isArray(mesh.material)) {
                mesh.material.forEach(material => material.dispose());
              } else if (mesh.material) {
                mesh.material.dispose();
              }
            }
          });
          sceneRef.current.clear();
          sceneRef.current = null;
        }

        if (rendererRef.current) {
          const domElement = rendererRef.current.domElement;
          if (domElement && domElement.parentNode && domElement.parentNode.contains(domElement)) {
            domElement.parentNode.removeChild(domElement);
          }
          rendererRef.current.dispose();
          rendererRef.current = null;
        }

        if (modelRef.current) {
          modelRef.current = null;
        }

        // Clear animation references
        if (animationRef.current) {
          animationRef.current.pending = false;
          animationRef.current.animations = [];
          animationRef.current.avatar = null;
        }
      };
    }, [avatarModel]);

    // Load animation based on type (glb or bone)
    const loadAnimation: (animationOption: AnimationOptions) => void = useCallback((animationOption: AnimationOptions) => {
      if (!animationRef.current || isCleaningUpRef.current) return;

      setIsLoading(true);
      log(`[EnhancedPlayer] Loading animation: ${JSON.stringify(animationOption)}`);
      if (animationOption.type === 'glb') {
        const filePath = animationOption.content as string;
        const loader = new GLTFLoader();

        loader.load(
          filePath,
          (gltf) => {
            log(`[EnhancedPlayer] GLB animation loaded: ${filePath}`);
            if (!animationRef.current || !animationRef.current.scene || isCleaningUpRef.current) return;

            if (modelRef.current) {
              animationRef.current.scene.remove(modelRef.current);
              modelRef.current.traverse((obj) => {
                if ((obj as THREE.Mesh).isMesh) {
                  (obj as THREE.Mesh).geometry?.dispose();
                  if (Array.isArray((obj as THREE.Mesh).material)) {
                    ((obj as THREE.Mesh).material as THREE.Material[]).forEach(m => m.dispose());
                  } else if ((obj as THREE.Mesh).material) {
                    ((obj as THREE.Mesh).material as THREE.Material).dispose();
                  }
                }
              });
            }

            const model = gltf.scene;
            model.position.set(0, 0, 0);
            model.scale.set(1, 1, 1);

            animationRef.current.scene.add(model);
            modelRef.current = model;
            animationRef.current.avatar = model;

            if (gltf.animations.length > 0) {
              if (mixerRef.current) {
                mixerRef.current.stopAllAction();
                mixerRef.current.uncacheRoot(mixerRef.current.getRoot());
              }
              const mixer = new THREE.AnimationMixer(model);
              const animation = mixer.clipAction(gltf.animations[0]);
              animation.play();
              mixerRef.current = mixer;

              if (!isPaused) {
                const duration = animationOption.duration || animation.getClip().duration;

                if (animationTimerRef.current) {
                  clearTimeout(animationTimerRef.current);
                }

                animationTimerRef.current = setTimeout(() => {
                  if (isCleaningUpRef.current) return;
                  log('[EnhancedPlayer] GLB animation finished');
                  if (currentAnimationIndex < animations.length - 1) {
                    setCurrentAnimationIndex(prev => prev + 1);
                  } else if (onComplete) {
                    onComplete();
                  }
                }, duration * 1000);
              }
            }

            setIsLoading(false);
          },
          (xhr) => {
            if (xhr.total > 0) {
              const pct = ((xhr.loaded / xhr.total) * 100).toFixed(2);
              log(`[EnhancedPlayer] Animation load progress: ${pct}%`);
            }
          },
          (error) => {
            log(`Error loading animation: ${error}`, 'error');
            setIsLoading(false);
          }
        );
      } else if (animationOption.type === 'bone' && Array.isArray(animationOption.content)) {
        log('[EnhancedPlayer] Loading bone animation');
        const sequences = animationOption.content as any[];
        const rawQueues = sequences.map(seq => {
          if (Array.isArray(seq) && seq.length && typeof seq[0] === 'string') {
            return seq as RawBoneAnimation[];
          }
          return convertToRawAnimation(seq as BoneAnimation[]);
        });
        if (animationRef.current) {
          animationRef.current.animations = rawQueues;
          animationRef.current.pending = false;
          animationRef.current.flag = false;
          if (!isPaused) {
            log('[EnhancedPlayer] Starting bone animation');
            animationRef.current.animate();
          }
        }
        setIsLoading(false);
      }
    }, [animations, currentAnimationIndex, onComplete, isPaused]);

    // Play the next animation in the list
    const playNextAnimation = () => {
      log('[EnhancedPlayer] Next Animation button clicked');
      if (currentAnimationIndex < animations.length - 1) {
        setCurrentAnimationIndex(prev => prev + 1);
      } else if (onComplete) {
        onComplete();
      }
    };

    // Restart the current animation
    const restartAnimation = () => {
      log('[EnhancedPlayer] Restart Animation button clicked');
      if (animationRef.current && !isCleaningUpRef.current) {
        animationRef.current.pending = false;
        animationRef.current.flag = false;
        animationRef.current.animations = [];
        setDefaultPose(animationRef.current);

        if (animations[currentAnimationIndex]) {
          loadAnimation(animations[currentAnimationIndex]);
        }
      }
    };

    // Skip to the end of the current animation
    const skipToEnd = () => {
      log('[EnhancedPlayer] Skip to End button clicked');
      const avatar = animationRef.current?.avatar;
      if (!avatar || !animationRef.current?.animations.length) return;
      const currentAnim = animationRef.current.animations[0];
      if (currentAnim.length > 0) {
        const lastKey = currentAnim[currentAnim.length - 1];
        const boneName = lastKey[0];
        const bone = avatar.getObjectByName(boneName);
        if (bone) {
          const targetPosition = new THREE.Vector3();
          const targetRotation = new THREE.Euler();
          targetPosition.set(lastKey[1], lastKey[2], lastKey[3]);
          targetRotation.set(lastKey[4], lastKey[5], lastKey[6]);
          bone.position.copy(targetPosition);
          bone.rotation.copy(targetRotation);
          log(`[EnhancedPlayer] Skipped to end of animation for bone: ${boneName}`);
        }
      }
    };

    // Pause the animation
    const pauseAnimation = () => {
      log('[EnhancedPlayer] Pause button clicked');
      setIsPaused(true);
    };

    // Resume the animation
    const resumeAnimation = () => {
      log('[EnhancedPlayer] Resume button clicked');
      setIsPaused(false);
      if (animationRef.current && animationRef.current.pending === false) {
        animationRef.current.animate();
      }
    };

    // Manual control for animation speed
    const setAnimationSpeed = (newSpeed: number) => {
      log(`[EnhancedPlayer] Animation speed set to ${newSpeed}`);
      speedRef.current = newSpeed;
    };

    // Manual control for pause duration
    const setPauseDuration = (newDuration: number) => {
      log(`[EnhancedPlayer] Pause duration set to ${newDuration}`);
      pauseRef.current = newDuration;
    };

    // Stop the animation
    const stopAnimation = () => {
      log('[EnhancedPlayer] Stop Animation button clicked');
      if (animationRef.current) {
        animationRef.current.pending = false;
        animationRef.current.flag = false;
        animationRef.current.animations = [];
        // Optionally reset pose
        setDefaultPose(animationRef.current);
      }
      setIsPaused(true);
    };

    // Reset the animation and pose
    const resetAnimation = () => {
      log('[EnhancedPlayer] Reset Animation button clicked');
      if (animationRef.current) {
        animationRef.current.pending = false;
        animationRef.current.flag = false;
        animationRef.current.animations = [];
        setDefaultPose(animationRef.current);
      }
      setIsPaused(true);
    };

    useEffect(() => {
      if (debugLogRef.current) {
        debugLogRef.current.scrollTop = debugLogRef.current.scrollHeight;
      }
    }, [debugLogs]);

    return (
      <div>
        <div ref={containerRef} style={{ width: '100%', height: '100vh', position: 'relative' }}>
          {isLoading && (
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255, 255, 255, 0.8)', zIndex: 10 }}>
              <span>Loading...</span>
            </div>
          )}
          {showControls && (
            <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 10, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              <button onClick={playNextAnimation} style={{ marginRight: 10 }}>Next Animation</button>
              <button onClick={restartAnimation} style={{ marginRight: 10 }}>Restart Animation</button>
              <button onClick={skipToEnd} style={{ marginRight: 10 }}>Skip to End</button>
              <button onClick={isPaused ? resumeAnimation : pauseAnimation} style={{ marginRight: 10 }}>
                {isPaused ? 'Resume' : 'Pause'}
              </button>
              <button onClick={resetAnimation} style={{ marginRight: 10 }}>Reset</button>
              <button onClick={stopAnimation} style={{ marginRight: 10 }}>Stop</button>
            </div>
          )}
        </div>
        {/* Debug logs below the canvas */}
        <div style={{ marginTop: 16, height: 200, maxHeight: 200, minHeight: 200, overflowY: 'auto', backgroundColor: '#282828', color: 'white', padding: 8, borderRadius: 4, fontFamily: 'monospace', fontSize: 13, boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
          <div style={{ marginBottom: 8, fontWeight: 'bold', color: '#b2f7ef' }}>Debug Logs</div>
          <div ref={debugLogRef} style={{ flex: 1, overflowY: 'auto' }} id="debug-log-terminal">
            {debugLogs.length === 0 ? (
              <div style={{ color: '#888' }}>[No logs yet]</div>
            ) : (
              debugLogs.map((log, idx) => (
                <div key={idx} style={{ color: log.level === 'error' ? '#ff6b6b' : log.level === 'warn' ? '#ffd166' : '#b2f7ef', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                  {log.level === 'error' ? '[ERROR] ' : log.level === 'warn' ? '[WARN] ' : ''}{log.msg}
                </div>
              ))
            )}
          </div>
          <button onClick={clearLogs} style={{ marginTop: 8, alignSelf: 'flex-end', background: '#444', color: '#fff', border: 'none', borderRadius: 3, padding: '4px 12px', cursor: 'pointer', fontSize: 12 }}>Clear Logs</button>
        </div>
      </div>
    );
  };

  export default EnhancedSignKitPlayer;