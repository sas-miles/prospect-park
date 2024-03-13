import * as THREE from "three";
import gsap from "gsap";
import Experience from "../Experience.js";

export default class CameraAnimations{
  constructor() {
    this.experience = new Experience();
    this.eventEmitter = this.experience.eventEmitter;
    this.scene = this.experience.scene;
    this.camera = this.experience.camera.instance; 
    this.time = this.experience.time;
    this.resources = this.experience.resources;

    this.resource = this.resources.items.cameraPath;

    
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
    if (!this.path) {
        console.error("Path for animation is not set.");
        return;
    }

    const progress = { value: 0 };
    const duration = 6; // Duration in seconds
    const pitch = { angle: THREE.MathUtils.degToRad(0) }; // Start with an initial pitch angle, e.g., 0 degrees
    const targetPitch = THREE.MathUtils.degToRad(-20); // Target pitch angle of -20 degrees

    gsap.timeline({
        onStart: () => {
            this.eventEmitter.trigger('controls:disable');
            console.log("Camera animation started");
        },
        onComplete: () => {
            this.camera.rotation.x = targetPitch;
            this.eventEmitter.trigger('controls:enable');
            console.log("Camera animation complete");
        },
        ease: "power2.out",
    })
    .to(progress, {
        value: 1,
        duration: duration,
        onUpdate: () => {
            console.log("Camera animation progress:", progress.value);
            
            // Update camera position
            const point = this.path.getPointAt(progress.value);
            this.camera.position.copy(point);
            
            // Optionally, look at a fixed point or adjust yaw here
        },
    }, '0')
    .to(pitch, {
        angle: targetPitch,
        duration: duration,
        onUpdate: () => {
            // Directly apply the animated pitch to the camera's rotation
            this.camera.rotation.order = 'YXZ'; // Ensure correct rotation order
            this.camera.rotation.x = pitch.angle;
        },
    }, '0');
}

}

