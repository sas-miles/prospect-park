import * as THREE from "three";
import gsap from "gsap";

import Experience from "../Experience.js";

import planeVertexShader from "../shaders/introPlane/vertex.glsl";
import planeFragmentShader from "../shaders/introPlane/fragment.glsl";

export default class IntroPlane {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.sizes = this.experience.sizes;
    this.resources = this.experience.resources;
    this.debug = this.experience.debug;
    this.time = this.experience.time;
    this.planeVertexShader = planeVertexShader;
    this.planeFragmentShader = planeFragmentShader;
    this.camera = this.experience.camera.instance;
    this.camera.rotation.order = "YXZ"; // Adjust rotation order

    this.camera.position.y = 80;
    this.camera.rotation.x = THREE.MathUtils.degToRad(-90);

    //Debug
    if (this.debug.active) {
      this.debugFolder = this.debug.gui.addFolder("Intro Plane");
    }

    this.isFadingOut = false;

    this.setGeometry();
    this.setMaterial();
    this.setMesh();
  }

  setGeometry() {
    this.geometry = new THREE.PlaneGeometry(2, 2, 1, 1);
  }

  setMaterial() {
    this.material = new THREE.ShaderMaterial({
      vertexShader: this.planeVertexShader,
      fragmentShader: this.planeFragmentShader,
      transparent: true,
      uniforms: {
        scale: { value: 4.0 },
        smoothness: { value: 0.01 },
        seed: { value: 46 },
        uAlpha: { value: 1 },
        uTime: { value: 1 },
      },
    });

    if (this.debug.active) {
      this.debugFolder
        .add(this.material.uniforms.scale, "value")
        .min(0)
        .max(10)
        .step(0.1)
        .name("Scale");

      this.debugFolder
        .add(this.material.uniforms.smoothness, "value")
        .min(0)
        .max(1)
        .step(0.01)
        .name("Smoothness");

      this.debugFolder
        .add(this.material.uniforms.seed, "value")
        .min(0)
        .max(100)
        .step(0.1)
        .name("Seed");

      this.debugFolder
        .add(this.material.uniforms.uAlpha, "value")
        .min(0)
        .max(1)
        .step(0.01)
        .name("Alpha");
    }
  }

  setMesh() {
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);
    this.mesh.position.set(0, -100, 0);

    if (this.debug.active) {
      this.debugFolder
        .add(this.mesh.position, "x")
        .min(-100)
        .max(100)
        .step(0.001)
        .name("Plane X");

      this.debugFolder
        .add(this.mesh.position, "y")
        .min(-100)
        .max(100)
        .step(0.001)
        .name("Plane Y");

      this.debugFolder
        .add(this.mesh.position, "z")
        .min(-100)
        .max(100)
        .step(0.001)
        .name("Plane Z");
    }
  }

  startFadeOut(onComplete) {
    this.isFadingOut = true;
    this.onFadeOutComplete = onComplete;
    console.log("Fade-out started");
  }

  update() {
    this.material.uniforms.uTime.value = this.experience.time.elapsed * 0.001; // Adjust the multiplier as needed
    const rotationSpeed = 0.0001; // Adjust this value to change the rotation speed
    this.camera.rotation.y += rotationSpeed; // Rotate around the Y axis
    if (this.isFadingOut) {
      // Adjust fade-out speed as needed
      const fadeOutSpeed = 0.0003; // Consider adjusting the speed based on time.delta for frame rate independence
      this.material.uniforms.uAlpha.value -=
        fadeOutSpeed * this.experience.time.delta;

      if (this.material.uniforms.uAlpha.value <= 0) {
        this.material.uniforms.uAlpha.value = 0;
        this.isFadingOut = false; // Mark fade-out as complete
        console.log("Fade-out complete");

        // Call the callback, which can now include removal logic
        if (typeof this.onFadeOutComplete === "function") {
          this.onFadeOutComplete();
          this.onFadeOutComplete = null; // Prevent multiple calls
        }
      }
    }
  }
}
