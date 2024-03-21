import * as THREE from "three";

import Experience from "./Experience.js";

export default class Camera {
  constructor() {
    this.experience = new Experience();
    this.debug = this.experience.debug;
    this.sizes = this.experience.sizes;
    this.scene = this.experience.scene;
    this.canvas = this.experience.canvas;

    if (this.debug.active) {
      this.debugFolder = this.debug.gui.addFolder("Camera");
    }

    //Setup
    this.startPosition = {
      x: 0,
      y: 0,
      z: 0,
    };

    this.setInstance();
  }

  setInstance() {
    //Camera Calculation
    const sensorSize = 36; // 36mm (full-frame)
    const focalLength = 50; // 50mm lens

    const fovRadians = 2 * Math.atan(sensorSize / (2 * focalLength));
    const fovDegrees = fovRadians * (180 / Math.PI);

    const aspectRatio =
      this.experience.sizes.width / this.experience.sizes.height;
    const nearPlane = 2;
    const farPlane = 300;

    this.instance = new THREE.PerspectiveCamera(
      fovDegrees,
      aspectRatio,
      nearPlane,
      farPlane
    );
    this.scene.add(this.instance);

    //Debug
    if (this.debug.active) {
      this.debugFolder
        .add(this.instance.position, "x")
        .step(0.01)
        .min(-500)
        .max(500)
        .name("positionX")
        .onChange(() => {
          this.instance.position.x = this.instance.position.x;
        });
      this.debugFolder
        .add(this.instance.position, "y")
        .step(0.01)
        .min(-100)
        .max(100)
        .name("positionY")
        .onChange(() => {
          this.instance.position.y = this.instance.position.y;
        });
      this.debugFolder
        .add(this.instance.position, "z")
        .step(0.01)
        .min(-100)
        .max(600)
        .name("positionZ")
        .onChange(() => {
          this.instance.position.z = this.instance.position.z;
        });

      // Create separate variables for the UI
      this.rotationX = THREE.MathUtils.radToDeg(this.instance.rotation.x);
      this.rotationY = THREE.MathUtils.radToDeg(this.instance.rotation.y);
      this.rotationZ = THREE.MathUtils.radToDeg(this.instance.rotation.z);

      this.debugFolder
        .add(this, "rotationX")
        .step(1)
        .min(-360)
        .max(360)
        .name("rotationX")
        .onChange((value) => {
          this.instance.rotation.x = THREE.MathUtils.degToRad(value);
          this.experience.eventEmitter.trigger("camera.rotationChanged", [
            this.instance.rotation,
          ]);
        });

      this.debugFolder
        .add(this, "rotationY")
        .step(1)
        .min(-360)
        .max(360)
        .name("rotationY")
        .onChange((value) => {
          this.instance.rotation.y = THREE.MathUtils.degToRad(value);
          this.experience.eventEmitter.trigger("camera.rotationChanged", [
            this.instance.rotation,
          ]);
        });

      this.debugFolder
        .add(this, "rotationZ")
        .step(1)
        .min(-360)
        .max(360)
        .name("rotationZ")
        .onChange((value) => {
          this.instance.rotation.z = THREE.MathUtils.degToRad(value);
          this.experience.eventEmitter.trigger("camera.rotationChanged", [
            this.instance.rotation,
          ]);
        });
    }
  }

  resize() {
    this.instance.aspect = this.sizes.width / this.sizes.height;
    this.instance.updateProjectionMatrix();
  }

  update() {}
}
