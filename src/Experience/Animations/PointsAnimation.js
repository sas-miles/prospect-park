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
      console.log("Points: Received disable event");
    });

    this.eventEmitter.on("controls:enable", () => {
      this.isAnimationActive = false;
      this.introAnimation();
    });
  }

  introAnimation() {
    this.camera.rotation.copy(this.initialCameraRotation);
    const labelVisibility = document.querySelectorAll(".label-visibility");

    // Add a class to each labelVisibility element
    labelVisibility.forEach((label) => {
      label.classList.add("is-active-block");
    });

    console.log("Points: introAnimation", labelVisibility);

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

  animateToTarget(name, targetDiv, camX, camY, camZ) {
    this.name = name;
    this.targetDiv = targetDiv;
    const intersects = this.experience.interface.raycaster.intersectObjects(
      this.experience.interface.group.children
    );

    if (intersects.length > 0) {
      const name = intersects[0].object.name;

      if (targetDiv) {
        this.eventEmitter.trigger("controls:disable");

        this.initialCameraPosition = this.camera.position.clone();
        this.initialCameraRotation = this.camera.quaternion.clone();

        // Create a new quaternion for the target rotation
        let targetRotation = new THREE.Quaternion();
        targetRotation.setFromEuler(
          new THREE.Euler(0, THREE.MathUtils.degToRad(49), 0)
        );

        const labelVisibility = document.querySelectorAll(".label-visibility");

        // Label Visibility - Hide for all
        labelVisibility.forEach((label) => {
          label.classList.remove("is-active-block");
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

        gsap
          .timeline({
            onStart: () => {
              console.log("POI Camera animation started");
              // this.spheres.forEach((sphere) => {
              //   if (sphere.name === name) {
              //     gsap.timeline().to(
              //       this.spheres.map((sphere) => sphere.material),
              //       {
              //         opacity: 0,
              //       }
              //     );
              //   }
              // });

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

              gsap.set(pointMainVisibility, {
                duration: 0,
                opacity: 1,
              });
              gsap.set(pointsModal, { clearProps: "all" });
            },
            onComplete: () => {
              console.log("POI Camera animation complete");
              console.log("Camera target", camX, camY, camZ);
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
          .to(pointsModal, {
            duration: 0.5,
            opacity: 1,
            right: "0vw",
            ease: "power1.out",
          });
      }
    }
  }

  resetAnimation() {
    if (this.initialCameraPosition) {
      this.closeModal(this.name, this.targetDiv);

      // Store the current camera rotation
      const currentRotation = new THREE.Euler().setFromQuaternion(
        this.camera.quaternion,
        this.camera.rotation.order
      );

      gsap.to(this.camera.position, {
        duration: 2,
        x: this.initialCameraPosition.x,
        y: this.initialCameraPosition.y,
        z: this.initialCameraPosition.z,
        ease: "power1.inOut",
        // onUpdate: () => {
        //   // Preserve the current rotation during the animation
        //   this.camera.rotation.setFromQuaternion(
        //     new THREE.Quaternion().setFromEuler(currentRotation)
        //   );
        // },
      });
    }
  }

  closeModal(name, targetDiv) {
    // Fade in spheres visibility if they were hidden
    // this.experience.interface.spheres.forEach((sphere) => {
    //   if (sphere.name === name) {
    //     gsap.to(
    //       this.spheres.map((sphere) => sphere.material),
    //       {
    //         duration: 1,
    //         opacity: 1,
    //       }
    //     );
    //   }
    // });

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

          // Emit event to re-enable controls if they were disabled
          this.eventEmitter.trigger("controls:enable");
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

    // Reset label positions if they were modified
    if (this.labels[name]) {
      gsap.to(
        this.labels[name].position,
        {
          duration: 1,
          y: 2.0,
          ease: "power1.out",
        },
        0
      );
    }
  }
}
