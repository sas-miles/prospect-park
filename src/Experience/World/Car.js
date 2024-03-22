import * as THREE from "three";
import gsap from "gsap";
import Experience from "../Experience.js";

export default class Car {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.time = this.experience.time;

    this.resource = this.resources.items.car;

    this.setModel();
    this.setAnimation();
  }

  setModel() {
    this.model = this.resource.scene;
    this.scene.add(this.model);
  }

  setAnimation() {
    this.animation = {};
    this.animation.mixer = new THREE.AnimationMixer(this.model);

    this.animation.actions = {};

    for (const animation of this.resource.animations) {
      // Use cubic spline interpolation
      for (const track of animation.tracks) {
        track.setInterpolation(THREE.InterpolateSmooth);
      }
      const action = this.animation.mixer.clipAction(animation);
      this.animation.actions[animation.name] = action;
      action.setLoop(THREE.LoopRepeat);
      // Set the timeScale based on the desired duration
      const desiredDuration = 50; // The desired duration in seconds
      action.timeScale = animation.duration / desiredDuration;
      console.log(`Action created: ${this.animation.actions[animation.name]}`); // Log the created action
    }
    if (this.animation.actions["car"]) {
      console.log("Playing animation: car");
      this.animation.actions["car"].play();
    }
  }

  update() {
    this.animation.mixer.update(this.time.delta * .001);
  }
}
