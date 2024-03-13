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

    // Assuming initialYaw is the camera's current yaw angle
    // and finalYaw is the desired yaw angle at the end of the animation
    const initialYaw = THREE.MathUtils.degToRad(180);
    const finalYaw = THREE.MathUtils.degToRad(-20);

    // Object to track the progress of the path animation and yaw rotation
    const animationProgress = { path: 0, yaw: initialYaw };

    gsap.timeline({
        onStart: () => {
            this.eventEmitter.trigger('controls:disable');
            console.log("Camera animation started");
        },
        onComplete: () => {
            this.experience.controls.currentRotationY = finalYaw;
            this.eventEmitter.trigger('controls:enable');
            console.log("Camera animation complete");
        },
        ease: "power2.out",
    })
    .to(animationProgress, {
        path: 1,
        yaw: finalYaw,
        duration: 8, // Duration in seconds
        onUpdate: () => {
            // Update camera position along the path
            const point = this.path.getPointAt(animationProgress.path);
            this.camera.position.copy(point);

            // Apply the interpolated yaw rotation
            this.camera.rotation.y = animationProgress.yaw;

            // Optionally, update camera's pitch and roll or use lookAt here
        },
    });
}


}

