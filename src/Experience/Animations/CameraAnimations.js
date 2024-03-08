import * as THREE from 'three';
import gsap from 'gsap';
import Experience from '../Experience.js';
import EventEmitter from '../Utils/EventEmitter.js';

export default class CameraAnimations {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.mainCamera = this.experience.camera.instance; // Your main camera
    this.time = this.experience.time;
    this.resources = this.experience.resources;
    this.introCamera = this.experience.introCamera;
    this.eventEmitter = new EventEmitter(); // Create an instance of EventEmitter
    this.gltfCamera = null;
    this.setupEventListeners();
    this.loadGLTFCamera();
  }

  loadGLTFCamera() {
    this.gltf = this.resources.items.map;
    this.introCamera = this.gltf.scene.getObjectByName('Camera');
    this.experience.currentCamera = this.introCamera;
  
    // Find the camera animation clip
    const cameraAnimationClip = this.gltf.animations.find(clip => clip.name === 'Camera.001Action.001');
  
    if (cameraAnimationClip) {
      this.mixer = new THREE.AnimationMixer(this.introCamera);
      const action = this.mixer.clipAction(cameraAnimationClip);
      action.play();
      action.loop = THREE.LoopOnce;
      action.clampWhenFinished = true;
      this.mixer.addEventListener('finished', () => {
        this.eventEmitter.trigger('introAnimationFinished');
        console.log("Intro animation complete");
      });
    } else {
      console.error('Camera animation clip not found in GLTF file');
    }
  }

  setupEventListeners() {
    this.experience.eventEmitter.on('introAnimationFinished', () => {
      this.switchToMainCamera();
    });
  }

  switchToMainCamera() {
    // Perform any necessary operations to switch to the main camera
    this.experience.currentCamera = this.mainCamera;
  }

  update() {
    if (this.mixer) {
      this.mixer.update(this.time.delta*.0001);
      console.log("Updating camera animation");
    }
  }
}