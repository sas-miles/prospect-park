import * as THREE from "three";
import gsap from "gsap";
import Experience from "../Experience.js";

export default class Heli {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.time = this.experience.time;

    this.resource = this.resources.items.helicopter;

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

    // Loop over the animations array and create an action for each animation
    for (const animation of this.resource.animations) {
      // Use cubic spline interpolation
      for (const track of animation.tracks) {
        // track.setInterpolation(THREE.InterpolateSmooth);
      }
      this.animation.actions[animation.name] = 
        this.animation.mixer.clipAction(animation);
      this.animation.actions[animation.name].setLoop(THREE.LoopRepeat);
      console.log(`Action created: ${this.animation.actions[animation.name]}`); // Log the created action
      
    }

    // Play the animations by their names
    if (this.animation.actions["helicoptor"]) {
      console.log("Playing animation: helicoptor");
      this.animation.actions["helicoptor"].play();
    }
    if (this.animation.actions["helicoptor.bladesAction.001"]) {
      console.log("Playing animation: helicoptor.bladesAction.001");
      this.animation.actions["helicoptor.bladesAction.001"].setDuration(0.01);
      this.animation.actions["helicoptor.bladesAction.001"].play();
    }
  }

  update() {
    this.animation.mixer.update(this.time.delta * 0.0001);
  }
}
