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

    this.pointsItem = document.querySelectorAll(".points-of-interest_item");
    this.labelContainers = document.querySelectorAll(".label-container");
    this.markerContent = document.querySelectorAll(".marker-content_item");

    this.eventEmitter.on("controls:disable", () => {
      this.isAnimationActive = true;
      console.log("Points: Received disable event");
    });

    this.eventEmitter.on("controls:enable", () => {
      this.isAnimationActive = false;
      this.introAnimation();
    });
  }

  introAnimation() {
    const labelVisibility = document.querySelectorAll(".label-visibility");

    // Add a class to each labelVisibility element
    labelVisibility.forEach((label) => {
      label.classList.add("is-active-block");
    });

    console.log("Points: introAnimation", labelVisibility);

    gsap
      .timeline()
      .to(
        this.spheres.map((sphere) => sphere.material),
        {
          duration: 0.5,
          opacity: 1,
          ease: "power3.in",
        }
      )
      .to(labelVisibility, {
        duration: 0.5,
        opacity: 1,
        y: 0,
        ease: "power1.in",
      });
  }

  animateToTarget(targetDiv, camX, camY, camZ) {
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

        const pointsTitle = targetDiv.querySelectorAll(".points-title");
        const markerContent = targetDiv.querySelectorAll(
          ".marker-content_item"
        );
        const labelContainer = targetDiv.querySelectorAll(".label-container");

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
                  gsap.timeline().to(
                    this.spheres.map((sphere) => sphere.material),
                    {
                      opacity: 0,
                    }
                  );
                }
              });

              if (this.labels[name]) {
                gsap.to(
                  this.labels[name].position,
                  {
                    duration: 1,
                    y: -0.5,
                    ease: "power1.out",
                  },
                  0
                );
              }
              gsap.to(
                labelContainer,
                {
                  opacity: 0,
                },
                0
              );
            },
            onComplete: () => {
              console.log("POI Camera animation complete");
            },
          })
          .to(
            this.camera.position,
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
              ease: "power1.out",
            },
            0
          )
          .to(pointsTitle, {
            duration: 0.5,
            opacity: 1,
            ease: "power1.out",
          })
          .to(markerContent, {
            duration: 0.5,
            opacity: 1,
            x: "0vw",
            ease: "power1.out",
          });

        markerContent.classList.add("is-active");
      }
    }
  }

  resetAnimation() {
    if (this.initialCameraPosition && this.initialCameraRotation) {
      this.closeModal(name);

      gsap.to(this.camera.position, {
        duration: 2,
        x: this.initialCameraPosition.x,
        y: this.initialCameraPosition.y,
        z: this.initialCameraPosition.z,
        onUpdate: () => {
          this.camera.lookAt(new THREE.Vector3(0, 0, 0));
        },
        ease: "power1.inOut",
      });
      gsap.to(this.camera.rotation, {
        duration: 2,
        x: this.initialCameraRotation.x,
        y: this.initialCameraRotation.y,
        z: this.initialCameraRotation.z,
        ease: "power1.inOut",
      });
    }
  }

  closeModal(name, pointsTitle, targetDiv, camX, camY, camZ) {
    const animations = [];

    this.experience.interface.spheres.forEach((sphere) => {
      if (sphere.name === name) {
        const animation = new Promise((resolve) => {
          gsap.timeline().to(
            this.spheres.map((sphere) => sphere.material),
            {
              duration: 1,
              opacity: 1,
              onComplete: resolve,
            }
          );
        });

        animations.push(animation);
      }
    });
    const markerContentAnimation = new Promise((resolve) => {
      gsap
        .timeline()
        .to(
          pointsTitle,
          {
            duration: 0.5,
            opacity: 0,
            ease: "power1.out",
          },
          0
        )
        .to(
          this.markerContent,
          {
            duration: 0.5,
            opacity: 0,
            x: "40vw",
            ease: "power1.out",
            onComplete: resolve,
          },
          0
        );
    });

    animations.push(markerContentAnimation);

    if (this.experience.interface.labels[name]) {
      const yOffset =
        parseFloat(
          document
            .querySelector(`[data-label="${name}"]`)
            .getAttribute("labelY-offset")
        ) || 0;

      const label = this.experience.interface.labels[name];

      const labelAnimation = new Promise((resolve) => {
        gsap
          .timeline()
          .to(
            label.position,
            {
              y: yOffset + 2.0,
              duration: 0.5,
              ease: "power1.out",
              onComplete: resolve,
            },
            0
          )
          .to(document.querySelector(".label-marker-heading"), {
            opacity: 1,
            duration: 0.5,
            onComplete: resolve,
          });
      });

      animations.push(labelAnimation);
    }

    // Return a Promise that resolves when all animations are complete
    return Promise.all(animations);
  }
}
