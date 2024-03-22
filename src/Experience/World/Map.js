import * as THREE from "three";
import Experience from "../Experience.js";
import waterVertex from "../shaders/water/vertex.glsl";
import waterFragment from "../shaders/water/fragment.glsl";

export default class Map {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.time = this.experience.time; // Make sure this provides a continuously updating time value
    this.debug = this.experience.debug;
    this.sizes = this.experience.sizes;

    // Debugging tools setup
    // if(this.debug.active){
    //     this.debugFolder = this.debug.gui.addFolder('Map');
    // }

    this.resource = this.resources.items.map;
    this.setModel();
    this.setWaterShaderMaterial("Plane007_1");

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

  setWaterShaderMaterial(meshName) {
    this.waterMaterial = new THREE.ShaderMaterial({
      vertexShader: waterVertex,
      fragmentShader: waterFragment,
      uniforms: {
        time: { value: 0.0 },
        amplitude: { value: 0.04 }, // Adjust the amplitude for more/less wave height
        frequency: { value: new THREE.Vector2(1.9, 2.5) }, // Adjust frequency for tighter/looser waves
        speed: { value: 2.5 }, // Adjust speed for faster/slower wave animation
        waterColor: { value: new THREE.Color("#CED5FF") },
        alpha: { value: 0.4 },
      },
      transparent: true,
    });

    const mesh = this.model.getObjectByName(meshName);
    if (mesh) {
      mesh.material = this.waterMaterial;
    } else {
      console.warn(`No mesh found with the name ${meshName}`);
    }
  }

  getChildren(names) {
    const children = {};
    names.forEach((name) => {
      children[name] = this[name];
    });
    return children;
  }

  update() {
    this.waterMaterial.uniforms.time.value += 0.005; // Adjust this value for animation speed
  }
}
