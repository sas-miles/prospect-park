import * as THREE from "three";
import gsap from "gsap";
import Experience from "../Experience.js";

export default class Boat {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.time = this.experience.time;

    this.resource = this.resources.items.boat;

    this.setModel();
    this.setAnimation();
  }

  setModel() {
    this.model = this.resource.scene;
    this.scene.add(this.model);
    this.model.position.y -= 0.1;
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

    // Play the animations by their names
    if (this.animation.actions["Boat"]) {
      console.log("Playing animation: Boat");
      this.animation.actions["Boat"].play();
    }
    if (this.animation.actions["Boat"]) {
      console.log("Playing animation: Boat");
      this.animation.actions["Boat"].play();
    }
  }

  update() {
    this.animation.mixer.update(this.time.delta * 0.00004);
  }
}
