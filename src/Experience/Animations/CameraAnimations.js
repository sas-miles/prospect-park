import * as THREE from "three";
import gsap from "gsap";
import Experience from "../Experience.js";
import { MapControls } from "three/examples/jsm/controls/MapControls.js";

export default class CameraAnimations {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.camera = this.experience.camera.instance; 
    this.time = this.experience.time;
    this.resources = this.experience.resources;
    this.controls = new MapControls(this.experience.camera.instance, this.experience.canvas)

    this.resource = this.resources.items.cameraPath;


    this.setControls()
    
    this.setCameraPath();
    this.animateCameraAlongPath();


  }

 setCameraPath() {
    if (!this.resource || !this.resource.points) {
      console.error("Resource is not loaded or does not contain points.");
      return;
    }

    // Assuming this.resource.points is an array of point objects
    const points = this.resource.points.map(
      (pt) => new THREE.Vector3(pt.x, pt.y, pt.z)
    );

    this.path = new THREE.CatmullRomCurve3(points);
  }

  animateCameraAlongPath() {

    // Ensure the path is set
    if (!this.path) {
      console.error("Path for animation is not set.");
      return;
    }
 
    // Object to hold the progress value
    const progress = { value: 0 };

    // Duration of the animation in seconds
    const duration = 6; // Adjust duration to your liking

    gsap.to(progress, {
      value: 1,
      duration: duration,
      onUpdate: () => {
        this.controls.enabled = false;

        const point = this.path.getPointAt(progress.value);

        // Update camera position
        this.camera.position.copy(point);
        this.camera.lookAt(0, 0, 0);


      },
      onComplete: () => {
        // Explicitly set the camera to the last point of the path to ensure it ends there
        const finalPoint = this.path.getPointAt(1);
        this.camera.position.copy(finalPoint);
        this.camera.lookAt(0, -10, 0);
        // this.controls.target.set(0, -10, 0);
        
        // Re-enable controls when the animation is complete
        this.controls.enabled = true;
        console.log("Camera animation complete");
      },
      ease: "power2.out",
    });
  }

  setControls() {
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.9;
    this.controls.enableRotate = true;
    this.controls.maxDistance = 100;
    this.controls.minDistance = 10;
  
    this.controls.maxPolarAngle = 70 * (Math.PI / 180); // 90 degrees
    this.controls.minPolarAngle = 70 * (Math.PI / 180); // 0 degrees
    this.controls.maxAzimuthAngle = Infinity; // Allows unrestricted rotation to the right
    this.controls.minAzimuthAngle = -Infinity; // Allows unrestricted rotation to the left
    
  
    // Define boundaries
    this.minX = -50; this.maxX = 50;
    this.minY = 0; this.maxY = 40;
    this.minZ = -50; this.maxZ = 70;
  
    // Listen for the change event
    this.controls.addEventListener('change', () => {
      // Get camera position
      const position = this.camera.position;
  
      // Check if camera is out of boundaries and adjust position
      if (position.x < this.minX) position.x = this.minX;
      else if (position.x > this.maxX) position.x = this.maxX;
      if (position.y < this.minY) position.y = this.minY;
      else if (position.y > this.maxY) position.y = this.maxY;
      if (position.z < this.minZ) position.z = this.minZ;
      else if (position.z > this.maxZ) position.z = this.maxZ;
    });
  } 
  
  update() {
    // Update controls
    this.controls.update();
  }
}

