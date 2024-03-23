import * as THREE from "three";
import {
  CSS2DRenderer,
  CSS2DObject,
} from "three/addons/renderers/CSS2DRenderer.js";
import Experience from "./Experience.js";
import PointsAnimation from "./Animations/PointsAnimation.js";

export default class Interface {
  constructor() {
    this.experience = new Experience();
    this.debug = this.experience.debug;
    this.sizes = this.experience.sizes;
    this.scene = this.experience.scene;
    this.canvas = this.experience.canvas;
    this.time = this.experience.time;
    this.camera = this.experience.camera.instance;
    this.resources = this.experience.resources;

    this.resource = this.resources.items.Pin;
    this.model = this.resource.scene;

    this.eventEmitter = this.experience.eventEmitter;

    this.controls = this.experience.controls;

    //Debug
    if (this.debug.active) {
      this.debugFolder = this.debug.gui.addFolder("Markers");
    }

    this.group = new THREE.Group();
    this.experience.scene.add(this.group);

    this.spheres = [];
    this.labels = {};

    this.pointsAnimation = new PointsAnimation(this.spheres, this.labels);

    this.mousePosition = new THREE.Vector2();
    // this.raycaster = new THREE.Raycaster();

    this.createSpheresFromDOM();
    // this.setRaycaster();
    this.setLabels();
    this.setLabelRenderer();
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

      const camRotationY = parseFloat(item.getAttribute("cam-rotation-y"));

      const name = item.getAttribute("data-label");

      const newSphere = this.createSphere(
        x,
        y,
        z,
        camX,
        camY,
        camZ,
        camRotationY,
        name
      );
      this.group.add(newSphere);
      this.spheres.push(newSphere);
    });
  }

  createSphere(x, y, z, camX, camY, camZ, camRotationY, name) {
    const modelClone = this.model.clone();

    modelClone.traverse(function (child) {
      if (child.isMesh) {
        child.material = child.material.clone(); // Optionally clone the material if needed
        child.name = name;
        child.userData = { camX, camY, camZ, camRotationY };
      }
    });

    modelClone.position.set(x, y, z);
    modelClone.position.y = 2.0;
    modelClone.name = name;
    modelClone.userData = { camX, camY, camZ, camRotationY };

    return modelClone;
  }

  setLabels() {
    this.group.children.forEach((sphere) => {
      const { camX, camY, camZ, camRotationY } = sphere.userData;

      const sphereContainer = document.querySelector(
        `.sphere-container[data-label="${sphere.name}"]`
      );

      if (sphereContainer) {
        const labelTargets = sphereContainer.querySelectorAll(".label-target");

        labelTargets.forEach((labelTarget) => {
          const label = new CSS2DObject(labelTarget);
          label.position.set(0, 4.0, 0);
          sphere.add(label); // Attach the label to the sphere
          this.labels[sphere.name] = label;

          labelTarget.addEventListener("click", () => {
            const name = sphere.name;

            const targetDiv = document.querySelector(
              `div[data-content="${name}"]`
            );

            if (targetDiv) {
              this.pointsAnimation.animateToTarget(
                name,
                targetDiv,
                camX,
                camY,
                camZ,
                camRotationY,
                false
              );
            }
          });
        });
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

        const { camX, camY, camZ, camRotationY } = sphere.userData;

        const targetDiv = document.querySelector(
          `.points-of-interest_target[data-content="${name}"]`
        );

        if (targetDiv) {
          this.pointsAnimation.animateToTarget(
            name,
            targetDiv,
            camX,
            camY,
            camZ,
            camRotationY
          );
        }
      }
    };

    window.addEventListener("mousemove", hoverRaycast);
    window.addEventListener("click", raycast);
    window.addEventListener("touchend", raycast, { passive: false });
  }

  closeModal() {
    document.querySelectorAll(".marker-close").forEach((closeButton) => {
      closeButton.addEventListener("click", async (event) => {
        event.stopPropagation();
        const sphereContainer = document.querySelector(".sphere-container");
        const name = sphereContainer.getAttribute("data-label");

        const targetDiv = document.querySelector(
          `.points-of-interest_target[data-content="${name}"]`
        );

        if (targetDiv) {
          this.pointsAnimation.resetAnimation();
          this.pointsAnimation.closeModal(name, targetDiv);
        }
      });
    });
  }

  updateScene() {
    // Re-setup spheres and labels based on new content
    this.setSphereGroup();
    this.setLabels();

    // Re-setup event listeners for interaction
    // this.setRaycaster();
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
