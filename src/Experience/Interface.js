import * as THREE from "three";
import {
  CSS2DRenderer,
  CSS2DObject,
} from "three/addons/renderers/CSS2DRenderer.js";
import Experience from "./Experience.js";
import PointsAnimation from "./Animations/PointsAnimation.js";
import Map from "./World/Map.js";

export default class Interface {
  constructor() {
    this.experience = new Experience();
    this.debug = this.experience.debug;
    this.sizes = this.experience.sizes;
    this.scene = this.experience.scene;
    this.canvas = this.experience.canvas;
    this.camera = this.experience.camera.instance;

    this.map = new Map();
    this.boathouse = this.map.getChildren(["Boathouse"]).Boathouse;
    this.carousel = this.map.getChildren(["Carasouel005"]).Carasouel005;
    this.picnic = this.map.getChildren(["picnic002"]).picnic002;

    this.eventEmitter = this.experience.eventEmitter;

    this.controls = this.experience.controls;

    //Debug
    if (this.debug.active) {
      this.debugFolder = this.debug.gui.addFolder("Markers");
    }

    this.group = new THREE.Group();
    this.experience.scene.add(this.group);

    this.group.add(this.boathouse, this.carousel, this.picnic);

    this.spheres = [];
    this.labels = {};

    this.pointsAnimation = new PointsAnimation(this.spheres, this.labels);

    this.mousePosition = new THREE.Vector2();
    this.raycaster = new THREE.Raycaster();

    // Define the materials you want to apply to different meshes
    this.materials = {
      Boathouse: new THREE.MeshStandardMaterial({
        color: 0xe5e1e3,
        roughness: 1.0,
        metalness: 0.8,
      }),
      Carasouel005: new THREE.MeshLambertMaterial({ color: 0x00ff00 }), // Green material for Carasouel005
      picnic002: new THREE.MeshPhongMaterial({ color: 0x0000ff }), // Blue material for picnic002
    };

    this.createSpheresFromDOM();
    this.setRaycaster();
    this.setLabelRenderer();
    this.setLabels();
    this.closeModal();
    this.setDebug();
  }

  createSpheresFromDOM() {
    const sphereContainers = document.querySelectorAll(".sphere-container");

    sphereContainers.forEach((item) => {
      const x = parseFloat(item.getAttribute("data-x"));
      const y = parseFloat(item.getAttribute("data-y"));
      const z = parseFloat(item.getAttribute("data-z"));

      const camX = parseFloat(item.getAttribute("cam-x"));
      const camY = parseFloat(item.getAttribute("cam-y"));
      const camZ = parseFloat(item.getAttribute("cam-z"));

      const name = item.getAttribute("data-label");

      const newSphere = this.createSphere(x, y, z, camX, camY, camZ, name);
      this.group.add(newSphere);
      this.spheres.push(newSphere);
    });
  }

  createSphere(x, y, z, camX, camY, camZ, name) {
    const geo = new THREE.SphereGeometry(0.5);
    const mat = new THREE.MeshBasicMaterial({
      color: 0xd9d9d9,
      transparent: true,
      opacity: 0.7,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, y, z);
    mesh.name = name;
    mesh.userData = { camX, camY, camZ };
    return mesh;
  }

  setLabels() {
    this.group.children.forEach((sphere) => {
      const sphereContainer = document.querySelector(
        `.sphere-container[data-label="${sphere.name}"]`
      );

      if (sphereContainer) {
        const labelTarget = document.querySelector(
          `.label-target[data-label="${sphere.name}"]`
        );
        const label = new CSS2DObject(labelTarget);
        label.position.set(0, 2.0, 0);
        sphere.add(label); // Attach the label to the sphere

        this.labels[sphere.name] = label;
      }
    });
  }

  setLabelRenderer() {
    this.labelRenderer = new CSS2DRenderer();
    this.labelRenderer.setSize(this.sizes.width, this.sizes.height);
    this.labelRenderer.domElement.classList.add("label-renderer");
    document.body.appendChild(this.labelRenderer.domElement);
  }

  setRaycaster() {
    const hoverRaycast = (event) => {
      if (event.target.tagName.toLowerCase() === "a") {
        return;
      }

      let clientX, clientY;

      if (event.type.includes("touch")) {
        const touch = event.touches[0] || event.changedTouches[0];
        clientX = touch.clientX;
        clientY = touch.clientY;
      } else {
        clientX = event.clientX;
        clientY = event.clientY;
      }

      this.mousePosition.x = (clientX / this.sizes.width) * 2 - 1;
      this.mousePosition.y = -(clientY / this.sizes.height) * 2 + 1;

      this.raycaster.setFromCamera(
        this.mousePosition,
        this.experience.camera.instance
      );

      const intersects = this.raycaster.intersectObjects(this.group.children);
      if (intersects.length > 0) {
        const sphere = intersects[0].object;
        const name = sphere.name;
      }
    };

    const raycast = (event) => {
      if (event.target.tagName.toLowerCase() === "a") {
        return;
      }

      let clientX, clientY;

      if (event.type.includes("touch")) {
        const touch = event.touches[0] || event.changedTouches[0];
        clientX = touch.clientX;
        clientY = touch.clientY;
      } else {
        clientX = event.clientX;
        clientY = event.clientY;
      }

      this.mousePosition.x = (clientX / this.sizes.width) * 2 - 1;
      this.mousePosition.y = -(clientY / this.sizes.height) * 2 + 1;

      this.raycaster.setFromCamera(
        this.mousePosition,
        this.experience.camera.instance
      );

      const intersects = this.raycaster.intersectObjects(this.group.children);
      if (intersects.length > 0) {
        const sphere = intersects[0].object;
        const name = sphere.name;

        const { camX, camY, camZ } = sphere.userData;
        const targetDiv = document.querySelector(`div[data-content="${name}"]`);
        if (targetDiv) {
          this.pointsAnimation.animateToTarget(
            name,
            pointsTitle,
            targetDiv,
            camX,
            camY,
            camZ
          );
        }
      }
    };

    window.addEventListener("mousemove", hoverRaycast);
    window.addEventListener("click", raycast);
    window.addEventListener("touchend", raycast, { passive: false });
  }

  async closeModal() {
    document.querySelectorAll(".marker-close").forEach((closeButton) => {
      closeButton.addEventListener("click", async (event) => {
        event.stopPropagation();

        const modal = event.target.closest("div[data-content]");
        const name = modal ? modal.getAttribute("data-content") : null;

        if (name) {
          const pointsTitle = document.querySelector(
            `.points-title[data-name="${name}"]`
          );
          this.pointsAnimation.resetAnimation();
          // Wait for all animations to complete before hiding the modal
          await this.pointsAnimation.closeModal(name, pointsTitle);
        }

        // Close all modals
        document
          .querySelectorAll("div[data-content].is-active")
          .forEach((modal) => {
            setTimeout(() => {
              modal.classList.remove("is-active");
              console.log("Modal closed");
              this.eventEmitter.trigger("controls:enable");
            }, 1000);
          });
      });
    });
  }

  async reset() {
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
      this.labelRenderer.render(
        this.experience.scene,
        this.experience.camera.instance
      );
    }
  }

  setDebug() {
    if (this.debug.active) {
      this.spheres.forEach((sphere, index) => {
        const folder = this.debugFolder.addFolder(`${sphere.name}`);
        folder.add(sphere.position, "x", -80, 80, 0.001);
        folder.add(sphere.position, "y", -80, 80, 0.001);
        folder.add(sphere.position, "z", -80, 80, 0.001);
      });
    }
  }
}
