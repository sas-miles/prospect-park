import gsap from "gsap";
import * as THREE from "three";

import Experience from "../Experience.js";

export default class PointsAnimation {
  constructor(spheres, labels) {
    this.experience = new Experience();
    this.camera = this.experience.camera.instance;
    this.controls = this.experience.controls;
    this.eventEmitter = this.experience.eventEmitter;

    this.spheres = spheres;
    this.labels = labels;

    this.initialCameraPosition = null;
    this.initialCameraRotation = null;
  }

  animateToTarget(name, targetDiv, camX, camY, camZ) {
    const intersects = this.experience.interface.raycaster.intersectObjects(
      this.experience.interface.group.children
    );

    if (intersects.length > 0) {
      const name = intersects[0].object.name;
      console.log(name);
      if (targetDiv) {
        this.eventEmitter.trigger("controls:disable");

        this.initialCameraPosition = this.camera.position.clone();
        this.initialCameraRotation = this.camera.rotation.clone();

        // Create a new quaternion for the target rotation
        let targetRotation = new THREE.Quaternion();
        targetRotation.setFromEuler(
          new THREE.Euler(0, THREE.MathUtils.degToRad(49), 0)
        );

        gsap
          .timeline({
            onStart: () => {
              console.log("POI Camera animation started");
              this.spheres.forEach((sphere) => {
                if (sphere.name === name) {
                  sphere.visible = false;
                }
              });

              if (this.labels[name]) {
                gsap.to(this.labels[name].position, {
                  duration: 1,
                  y: -2.5,
                  ease: "power1.out",
                });
              }
            },
            onComplete: () => {
              console.log("POI Camera animation complete");
            },
          })
          .to(
            this.experience.camera.instance.position,
            {
              duration: 1, // Animation duration in seconds
              x: camX,
              y: camY,
              z: camZ,
              ease: "power1.out", // Easing function
            },
            0
          )
          .to(
            this.camera.quaternion,
            {
              duration: 1,
              x: targetRotation.x,
              y: targetRotation.y,
              z: targetRotation.z,
              w: targetRotation.w,
              ease: "power1.out", // Easing function
            },
            0
          );

        targetDiv.classList.add("is-active");
      }
    }
  }

  resetAnimation() {
    if (this.initialCameraPosition && this.initialCameraRotation) {
      gsap.to(this.camera.position, {
        duration: 1,
        x: this.initialCameraPosition.x,
        y: this.initialCameraPosition.y,
        z: this.initialCameraPosition.z,
        onUpdate: () => {
          this.camera.lookAt(new THREE.Vector3(0, 0, 0));
        },
        ease: "power1.out",
      });

      gsap.to(this.camera.rotation, {
        duration: 2,
        x: this.initialCameraRotation.x,
        y: this.initialCameraRotation.y,
        z: this.initialCameraRotation.z,
        ease: "power1.out",
      });
    }
  }

  closeModal(name) {
    this.experience.interface.spheres.forEach((sphere) => {
      if (sphere.name === name) {
        sphere.visible = true;
      }
    });

    if (this.experience.interface.labels[name]) {
      const yOffset =
        parseFloat(
          document
            .querySelector(`[data-label="${name}"]`)
            .getAttribute("labelY-offset")
        ) || 0;
      gsap
        .timeline()
        .to(this.experience.interface.labels[name].position, {
          duration: 1,
          ease: "power1.out",
        })
        .to(this.experience.interface.labels[name].position, {
          duration: 1,
          ease: "power1.out",
        })
        .to(this.experience.interface.labels[name].position, {
          duration: 1,
          y: yOffset + 2.0,
          ease: "power1.out",
        });
    }
  }
}
