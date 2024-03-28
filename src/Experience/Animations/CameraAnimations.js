import * as THREE from "three";
import gsap from "gsap";
import Experience from "../Experience.js";

export default class CameraAnimations {
  constructor() {
    this.experience = new Experience();
    this.eventEmitter = this.experience.eventEmitter;
    this.scene = this.experience.scene;
    this.camera = this.experience.camera.instance;
    this.time = this.experience.time;
    this.resources = this.experience.resources;

    this.resource = this.resources.items.cameraPath;

    this.camera.rotation.order = "YXZ"; // Adjust rotation order

    this.setCameraPath();
    this.resetCameraState();
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

  resetCameraState() {
    this.camera.position.set(0, 0, 0); // Use appropriate values
    this.camera.rotation.x = THREE.MathUtils.degToRad(0);
  }

  animateCameraAlongPath() {
    if (!this.path) {
      console.error("Path for animation is not set.");
      return;
    }

    const initialPitch = THREE.MathUtils.degToRad(0); // Start with 0 degrees
    const finalPitch = THREE.MathUtils.degToRad(-20); // End with -20 degrees

    // Assuming initialYaw is the camera's current yaw angle
    // and finalYaw is the desired yaw angle at the end of the animation
    const initialYaw = THREE.MathUtils.degToRad(180);
    const finalYaw = THREE.MathUtils.degToRad(0);

    // Object to track the progress of the path animation and yaw rotation
    const animationProgress = { path: 0, yaw: initialYaw, pitch: initialPitch };

    let finalRotation = null;

    gsap
      .timeline({
        onComplete: () => {
          this.eventEmitter.trigger("controls:enable");
          // console.log("Camera animation completed");
        },
        ease: "power2.out",
      })
      .to(animationProgress, {
        path: 1,
        yaw: finalYaw,
        pitch: finalPitch,
        duration: 8, // Duration in seconds
        onUpdate: () => {
          const point = this.path.getPointAt(animationProgress.path);
          this.camera.position.copy(point);
          this.camera.rotation.y = animationProgress.yaw;
          this.camera.rotation.x = animationProgress.pitch;

          // Store the final position and rotation
          if (animationProgress.path === 1) {
            finalRotation = this.camera.rotation.clone();
          }
        },
      });
  }
}
