import * as THREE from "three";
import gsap from "gsap";
import Experience from "../Experience.js";

export default class Car {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.time = this.experience.time;
    this.debug = this.experience.debug;

    //Debug
    if (this.debug.active) {
      this.debugFolder = this.debug.gui.addFolder("Car");
    }

    //Setup
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

    // Loop over the animations array and create an action for each animation
    for (const animation of this.resource.animations) {
      console.log(`Creating action for animation: ${animation.name}`); // Log the name of the animation
      this.animation.actions[animation.name] =
        this.animation.mixer.clipAction(animation);
      this.animation.actions[animation.name].setLoop(THREE.LoopRepeat);
      console.log(`Action created: ${this.animation.actions[animation.name]}`); // Log the created action
    }
    if (this.animation.actions["car"]) {
      console.log("Playing animation: car");
      this.animation.actions["car"].play();
    } else {
      console.log("Animation 'car' not found");
    }
  }

  update() {
    this.animation.mixer.update(this.time.delta * 0.00008);
  }
}
