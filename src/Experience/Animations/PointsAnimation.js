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

    this.eventEmitter.on("controls:disable", () => {
      this.isAnimationActive = true;
      this.initialCameraRotation = this.camera.rotation.clone();
    });

    this.eventEmitter.on("controls:enable", () => {
      this.isAnimationActive = false;
      this.introAnimation();

      this.initialCameraRotation = this.camera.rotation.y;
    });
  }

  introAnimation() {
    // this.camera.rotation.copy(this.initialCameraRotation);
    const labelVisibility = document.querySelectorAll(".label-visibility");

    // Add a class to each labelVisibility element
    labelVisibility.forEach((label) => {
      label.classList.add("is-active-block");
    });

    gsap
      .timeline()
      // .to(
      //   this.spheres.map((sphere) => sphere.material),
      //   {
      //     duration: 0.5,
      //     opacity: 1,
      //     ease: "power3.in",
      //   }
      // )
      .to(labelVisibility, {
        duration: 0.5,
        opacity: 1,
        y: 0,
        ease: "power1.in",
      });
  }

  animateToTarget(
    name,
    targetDiv,
    camX,
    camY,
    camZ,
    camRotationY,
    requireIntersection = true
  ) {
    this.name = name;
    this.targetDiv = targetDiv;

    if (targetDiv) {
      this.initialCameraPosition = this.camera.position.clone();
      this.initialCameraRotation = this.camera.rotation.clone();
      this.eventEmitter.trigger("controls:disable");

      const labelVisibility = document.querySelectorAll(".label-visibility");

      // Label Visibility - Hide for all
      labelVisibility.forEach((label) => {
        gsap
          .timeline({
            onComplete: () => {
              label.classList.remove("is-active-block");
            },
          })
          .to(label, {
            duration: 0.5,
            opacity: 0,
            y: 3,
            ease: "power1.in",
          });
      });

      // Points Modal Visibility - Set up to show
      const pointsModal = targetDiv.querySelector(
        ".point-content-modal_visibility"
      );
      pointsModal.classList.add("is-modal-visibility");

      // Main Content Visibility - Set up to show
      const pointMainVisibility = targetDiv.querySelector(
        ".point-content-main_visibility"
      );
      pointMainVisibility.classList.add("is-active-block");

      const currentRotationY = this.camera.rotation.y;
      const targetRotationY = THREE.MathUtils.degToRad(camRotationY);

      let shortestRotationDifferenceY =
        ((targetRotationY - currentRotationY + Math.PI) % (2 * Math.PI)) -
        Math.PI;

      // Ensure the rotation difference is within a reasonable range
      if (Math.abs(shortestRotationDifferenceY) > Math.PI) {
        shortestRotationDifferenceY =
          shortestRotationDifferenceY > 0
            ? shortestRotationDifferenceY - 2 * Math.PI
            : shortestRotationDifferenceY + 2 * Math.PI;
      }

      gsap
        .timeline({
          onStart: () => {
            gsap.set(pointMainVisibility, {
              duration: 0,
              opacity: 1,
            });
            gsap.set(pointsModal, { clearProps: "all" });
          },
        })
        .to(
          this.camera.position,
          {
            duration: 2, // Animation duration in seconds
            x: camX,
            y: camY,
            z: camZ,
            ease: "power2.out",
          },
          0
        )
        .to(
          this.camera.rotation,
          {
            duration: 2, // Animation duration in seconds
            y: `+=${shortestRotationDifferenceY}`,
            ease: "power2.out",
          },
          0
        )
        .to(pointsModal, {
          duration: 0.5,
          opacity: 1,
          right: "0vw",
          ease: "power1.out",
        });
    }
  }

  closeModal(name, targetDiv) {
    // Select the elements with classes that were modified during the modal display
    const pointsModal = targetDiv.querySelector(
      ".point-content-modal_visibility"
    );
    const pointMainVisibility = targetDiv.querySelector(
      ".point-content-main_visibility"
    );
    const labelVisibility = document.querySelectorAll(".label-visibility");

    // Fade out animations for modal elements
    gsap
      .timeline({
        onComplete: () => {
          // Once animation is complete, remove classes
          pointsModal.classList.remove("is-modal-visibility");
          pointMainVisibility.classList.remove("is-active-block");

          // Revert label visibility to its initial state
          labelVisibility.forEach((label) =>
            label.classList.add("is-active-block")
          );

          this.resetAnimation();
        },
      })
      .to(
        pointsModal,
        {
          duration: 0.5,
          opacity: 0,
          x: "40vw",
          ease: "power1.out",
        },
        0
      );
  }

  resetAnimation() {
    if (this.initialCameraPosition) {
      gsap.to(this.camera.position, {
        duration: 2,
        x: this.initialCameraPosition.x,
        y: this.initialCameraPosition.y,
        z: this.initialCameraPosition.z,
        ease: "power1.out",
      });

      // Calculate the shortest rotation difference
      const currentRotationY = this.camera.rotation.y;
      const targetRotationY = this.initialCameraRotation.y;

      let shortestRotationDifferenceY =
        ((targetRotationY - currentRotationY + Math.PI) % (2 * Math.PI)) -
        Math.PI;

      // Ensure the rotation difference is within a reasonable range
      if (Math.abs(shortestRotationDifferenceY) > Math.PI) {
        shortestRotationDifferenceY =
          shortestRotationDifferenceY > 0
            ? shortestRotationDifferenceY - 2 * Math.PI
            : shortestRotationDifferenceY + 2 * Math.PI;
      }

      // Animate the camera's rotation
      gsap.to(this.camera.rotation, {
        duration: 2,
        y: `+=${shortestRotationDifferenceY}`,
        ease: "power1.inOut",
        onComplete: () => {
          this.eventEmitter.trigger("controls:enable");
        },
      });
    }
  }
}
