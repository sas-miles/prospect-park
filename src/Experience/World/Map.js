import * as THREE from "three";
import Experience from "../Experience.js";

export default class Map {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.time = this.experience.time;
    this.debug = this.experience.debug;

    // if(this.debug.active){
    //     this.debugFolder = this.debug.gui.addFolder('Map');
    // }

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

        // Store the meshes by name in an object
        this[child.name] = child;

        // Store the original material for each mesh
        child.originalMaterial = child.material;
      }
    });
  }

  getChildren(names) {
    const children = {};
    names.forEach((name) => {
      children[name] = this[name];
    });
    return children;
  }
}
