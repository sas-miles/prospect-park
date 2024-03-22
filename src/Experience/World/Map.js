import * as THREE from "three";
import Experience from "../Experience.js";
import waterVertex from "../shaders/water/vertex.glsl";
import waterFragment from "../shaders/water/fragment.glsl";

export default class Map {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.time = this.experience.time;
    this.debug = this.experience.debug;
    this.sizes = this.experience.sizes;

    this.resource = this.resources.items.map;
    this.setModel();

    this.pointsofInterest = [];
  }

  setModel() {
    this.model = this.resource.scene;
    this.scene.add(this.model);

    console.log(this.model);

    this.model.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }
}
