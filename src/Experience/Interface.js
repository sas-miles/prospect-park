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

    //Debug
    if (this.debug.active) {
      this.debugFolder = this.debug.gui.addFolder('Markers');
    }

    this.group = new THREE.Group();
    this.experience.scene.add(this.group);

    this.spheres = [];

    this.labels = {};
    this.labelOffsets = {};

    this.mousePosition = new THREE.Vector2();
    this.raycaster = new THREE.Raycaster();

    this.setLabelRenderer();
    this.setLabels();
  }

  setSphereGroup() {
    // Find all sphere containers from DOM
    const sphereContainers = document.querySelectorAll('.sphere-container');

    sphereContainers.forEach((item, index) => {
      // Correctly declare index here
      const x = parseFloat(item.getAttribute('data-x'));
      const y = parseFloat(item.getAttribute('data-y'));
      const z = parseFloat(item.getAttribute('data-z'));

      const name = item.getAttribute('data-label');

      // Create the sphere and set position and name
      const newSphere = this.createSphere(x, y, z, name);
      this.group.add(newSphere);
      this.spheres.push(newSphere);
    });
  }

  createSphere(x, y, z, name) {
    const geo = new THREE.SphereGeometry(0.5);
    const mat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, y, z);
    mesh.name = name; // Set the name of the mesh
    return mesh;
  }

  setLabels() {
    this.group.children.forEach((sphere) => {
      const div = document.querySelector(`[data-label="${sphere.name}"]`);

      if (div) {
        const yOffset = parseFloat(div.getAttribute('labelY-offset')) || 0;
        const label = new CSS2DObject(div);
        label.position.set(0, yOffset + 2.0, 0); // Adjust label position relative to the sphere

        sphere.add(label); // Attach the label to the sphere
        this.labels[sphere.name] = label;
      }
    });
  }

  setLabelRenderer() {
    // Initialize a new CSS2DRenderer
    this.labelRenderer = new CSS2DRenderer();
    this.labelRenderer.setSize(this.sizes.width, this.sizes.height);
    this.labelRenderer.domElement.style.position = 'absolute';
    this.labelRenderer.domElement.style.top = '0';
    this.labelRenderer.domElement.style.display = 'block';
    this.labelRenderer.domElement.style.pointerEvents = 'none';
    this.labelRenderer.domElement.style.zIndex = '0';
    document.body.appendChild(this.labelRenderer.domElement);
  }

  setRaycaster() {
    const raycast = (event) => {
      if (event.target.tagName.toLowerCase() === 'a') {
        return;
      }
      let clientX, clientY;
      if (event.type.includes('touch')) {
        // Use the first touch point for the raycast
        const touch = event.touches[0] || event.changedTouches[0];
        clientX = touch.clientX;
        clientY = touch.clientY;
      } else {
        clientX = event.clientX;
        clientY = event.clientY;
      }

      this.mousePosition.x = (clientX / this.sizes.width) * 2 - 1;
      this.mousePosition.y = -(clientY / this.sizes.height) * 2 + 1;

      this.raycaster.setFromCamera(this.mousePosition, this.experience.camera.instance);
      const intersects = this.raycaster.intersectObjects(this.group.children);

      // Close all active modals
      document.querySelectorAll('div[data-content].is-active').forEach((modal) => {
        modal.classList.remove('is-active');
      });

      if (intersects.length > 0) {
        const name = intersects[0].object.name;
        const targetDiv = document.querySelector(`div[data-content="${name}"]`);
        if (targetDiv) {
          targetDiv.classList.add('is-active');
        }
      }
    };

    // Listen for both touch and mouse events
    window.addEventListener('click', raycast);
    window.addEventListener('touchend', raycast, { passive: false }); // Use passive: false to allow preventDefault
  }

  closeModal() {
    document.querySelectorAll('.marker-close').forEach((closeButton) => {
      closeButton.addEventListener('click', (event) => {
        // Prevent the event from propagating to avoid triggering other click events
        event.stopPropagation();

        // Close all modals
        document.querySelectorAll('div[data-content].is-active').forEach((modal) => {
          modal.classList.remove('is-active');
        });
      });
    });
  }

  reset() {
    // Remove spheres from the Three.js scene and dispose of their resources
    this.spheres.forEach((sphere) => {
      this.group.remove(sphere);
      if (sphere.geometry) sphere.geometry.dispose();
      if (sphere.material) sphere.material.dispose();
    });
    this.spheres = []; // Clear the spheres array

    // For each label, remove the CSS2DObject from its parent and the corresponding DOM element
    Object.keys(this.labels).forEach((name) => {
      const label = this.labels[name];
      if (label && label.element) {
        // Remove the label from the parent in the Three.js scene
        if (label.parent) label.parent.remove(label);

        // Remove the DOM element from its parent node
        if (label.element.parentNode) {
          label.element.parentNode.removeChild(label.element);
        }
      }
    });

    this.labels = {}; // Clear the labels object
  }

  updateScene() {
    // Re-setup spheres and labels based on new content
    this.setSphereGroup();
    this.setLabels();

    // Re-setup event listeners for interaction
    this.setRaycaster();
    this.closeModal();
  }


  resize() {
    this.labelRenderer.setSize(this.sizes.width, this.sizes.height);
  }

  update() {
    if (this.labelRenderer) {
      this.labelRenderer.render(this.experience.scene, this.experience.camera.instance);
    }
  }
}
    