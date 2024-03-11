import * as THREE from "three";
import gsap from "gsap";
import Experience from "../Experience.js";

export default class CameraAnimations {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.camera = this.experience.camera.instance; 
    this.time = this.experience.time;
    this.resources = this.experience.resources;

    this.resource = this.resources.items.cameraPath;
    console.log(this.resource)
    
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
    const duration = 4; // Adjust duration to your liking

    gsap.to(progress, {
      value: 1,
      duration: duration,
      onUpdate: () => {

        const point = this.path.getPointAt(progress.value);

        // Update camera position
        this.camera.position.copy(point);

      },
      onComplete: () => {
        this.camera.rotation.x = -10 * (Math.PI / 180);
      },
      ease: "none",
    });
  }

  update() {
  }
}
