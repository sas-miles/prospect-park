import * as THREE from "three";
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import Experience from "./Experience.js";
import Controls from './Controls';

export default class Interface {
  constructor() {
    this.experience = new Experience();
    this.debug = this.experience.debug;
    this.sizes = this.experience.sizes;
    this.scene = this.experience.scene;
    this.canvas = this.experience.canvas;
    this.controls = this.experience.controls;
    this.camera = this.experience.camera.instance;

    this.group = new THREE.Group();
    this.experience.scene.add(this.group);

    this.setInstance();
  }

  setInstance() {
  }

  resize() {
    this.instance.aspect = this.sizes.width / this.sizes.height;
    this.instance.updateProjectionMatrix();
  }

  update() {
    
  }
}
    