import * as THREE from "three";
import gsap from "gsap";

import Experience from "./Experience";

export default class Controls {
  constructor() {
    this.experience = new Experience();
    this.sizes = this.experience.sizes;
    this.time = this.experience.time;
    this.renderer = this.experience.renderer.instance;
    this.canvas = this.experience.canvas;
    this.camera = this.experience.camera.instance;
    this.cameraAnimations = this.experience.world.cameraAnimations;
    this.debug = this.experience.debug;

    // Define variables here
    this.isDragging = false;
    this.dragStart = { x: 0, y: 0 };
    this.moveSpeed = 0.001; // Speed of forward/backward movement
    this.rotateSpeed = 0.0008; // Speed of rotation
    this.damping = 0.05; // Smoothing factor for damping
    this.rotationDeadzone = 5;
    this.isCustomControlEnabled = false; // Custom control flag
    this.targetMarkerPosition = new THREE.Vector3(); // Target position for custom controls

    // Define the current state
    this.currentRotationY = 0;
    this.currentTargetPositionZ = 0;

    this.initialCameraRotation = null;

    this.fixedPitch = THREE.MathUtils.degToRad(-20);

    // Retrieve the forward direction of the camera in world space
    this.forward = new THREE.Vector3(0, 0, -1).applyQuaternion(
      this.camera.quaternion
    );

    this.normalize();

    this.boundaries = {
      minX: -30,
      maxX: 40,
      minY: 0,
      maxY: 50,
      minZ: -40,
      maxZ: 100,
    };

    this.customCursorElement = document.querySelector(".custom-cursor");
    this.secondaryCursorElement = document.querySelector(".secondary-cursor");
    this.setControls();
    this.initCursorEvents();
    this.initGlobalCursorEvents();

    this.experience.eventEmitter.on("controls:disable", () => {
      this.isAnimationActive = true;
      this.initialCameraRotation = this.camera.rotation.clone();
      // console.log('Controls: Received disable event');
    });

    this.experience.eventEmitter.on("controls:enable", () => {
      this.isAnimationActive = false;
      // this.currentRotationY = 0;
    });
  }

  normalize() {
    // Ignore the Y component by setting it to 0
    this.forward.y = 0;

    // Normalize the vector so it's a unit vector again
    this.forward.normalize();
  }

  setControls() {
    const handleMouseDown = (clientX, clientY) => {
      this.isDragging = true;
      this.dragStart.x = clientX;
      this.dragStart.y = clientY;

      if (this.customCursorElement) {
        gsap.to(this.customCursorElement, {
          scale: 1.2,
          duration: 0.3, // Adjust duration to control the speed of the scaling animation
          transformOrigin: "center center", // Ensures scaling is centered
        });
      }
    };

    const handleMouseMove = (clientX, clientY) => {
      if (!this.customCursorElement) return;

      gsap.to(this.customCursorElement, {
        x: clientX,
        y: clientY,
        duration: 0.1, // A shorter duration for movement to closely follow the mouse
        ease: "power1.out", // Use an easing function for smoother movement
      });

      // Maintain the scale if dragging
      let scaleTransform = this.isDragging ? " scale(1.2)" : " scale(1)";
      this.customCursorElement.style.transform = `translate(-50%, -50%)${scaleTransform}`;

      if (this.isDragging) {
        const deltaX = clientX - this.dragStart.x;

        // Apply deadzone for rotation
        if (Math.abs(deltaX) > this.rotationDeadzone) {
          // Horizontal Rotation
          this.currentRotationY += deltaX * this.rotateSpeed;
        }

        if (!this.isCustomControlEnabled) {
          const deltaY = clientY - this.dragStart.y;
          this.currentTargetPositionZ += deltaY * this.moveSpeed;
        }

        // Update drag start positions for the next frame
        this.dragStart.x = clientX;
        this.dragStart.y = clientY;
      }
    };

    this.renderer.domElement.addEventListener("mousedown", (event) => {
      if (event.target.tagName.toLowerCase() === "a") {
        return;
      }
      handleMouseDown(event.clientX, event.clientY);
    });

    window.addEventListener("mouseup", () => {
      this.isDragging = false;

      if (this.customCursorElement) {
        gsap.to(this.customCursorElement, {
          scale: 1,
          duration: 0.3, // Match the duration with the mouse down animation for consistency
          transformOrigin: "center center",
        });
      }
    });

    this.renderer.domElement.addEventListener("mousemove", (event) => {
      handleMouseMove(event.clientX, event.clientY);
    });

    // Touch events
    this.renderer.domElement.addEventListener(
      "touchstart",
      (event) => {
        if (event.target.tagName.toLowerCase() === "a") {
          return;
        }
        // Prevent the window from scrolling
        event.preventDefault();

        const touch = event.touches[0];
        handleMouseDown(touch.clientX, touch.clientY);
      },
      { passive: false }
    );

    this.renderer.domElement.addEventListener(
      "touchmove",
      (event) => {
        // Prevent the window from scrolling
        event.preventDefault();

        const touch = event.touches[0];
        handleMouseMove(touch.clientX, touch.clientY);
      },
      { passive: false }
    );

    window.addEventListener("touchend", () => {
      this.isDragging = false;
    });

    // Attach to the document or canvas instead
    document.addEventListener("mouseleave", () => {
      if (this.customCursorElement)
        this.customCursorElement.style.opacity = "0";
    });

    document.addEventListener("mouseenter", () => {
      if (this.customCursorElement)
        this.customCursorElement.style.opacity = "1";
    });
  }

  initCursorEvents() {
    document.addEventListener("mousemove", (e) => {
      if (this.debug.active) {
        // Remove the no-cursor class from the body
        document.body.classList.remove("no-cursor");
        // Set pointer-events to none on the custom cursor elements
        this.customCursorElement.style.pointerEvents = "none";
        this.secondaryCursorElement.style.pointerEvents = "none";
        return;
      }
      // Continue to move both cursors with the mouse
      gsap.to([this.customCursorElement, this.secondaryCursorElement], {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
        ease: "power1.out",
      });
    });

    this.canvas.addEventListener("mouseenter", () => {
      // Fade in the custom cursor and fade out the secondary cursor
      gsap.to(this.secondaryCursorElement, {
        opacity: 0,
        duration: 0.25,
        scale: 1,
      });
      gsap.to(this.customCursorElement, { opacity: 1, duration: 0.25 });
    });

    this.canvas.addEventListener("mouseleave", () => {
      // Reverse the fade directions when leaving the canvas
      gsap.to(this.customCursorElement, { opacity: 0, duration: 0.25 });
      gsap.to(this.secondaryCursorElement, {
        opacity: 1,
        duration: 0.25,
        scale: 0.8,
      });
    });
  }

  initGlobalCursorEvents() {
    document.addEventListener("mousemove", (e) => {
      if (this.debug.active) {
        // Remove the no-cursor class from the body
        document.body.classList.remove("no-cursor");
        // Set pointer-events to none on the custom cursor elements
        this.customCursorElement.style.pointerEvents = "none";
        this.secondaryCursorElement.style.pointerEvents = "none";
        return;
      }
      let isOverCanvas = this.canvas.contains(
        document.elementFromPoint(e.clientX, e.clientY)
      );
      // Simplify the logic to adjust opacity based on whether the cursor is over the canvas or not
      if (isOverCanvas) {
        gsap.to(this.customCursorElement, { opacity: 1, duration: 0.25 });
        gsap.to(this.secondaryCursorElement, { opacity: 0, duration: 0.25 });
      } else {
        gsap.to(this.customCursorElement, { opacity: 0, duration: 0.25 });
        gsap.to(this.secondaryCursorElement, { opacity: 1, duration: 0.25 });
      }
    });
  }

  enableCustomControls(markerPosition) {
    this.isCustomControlEnabled = true;
    this.targetMarkerPosition.copy(markerPosition);
    // Lock the currentTargetPositionZ when enabling custom controls to prevent movement
    this.currentTargetPositionZ = 0;
  }

  disableCustomControls() {
    this.isCustomControlEnabled = false;
    // Reset target position if necessary
    this.targetMarkerPosition.set(0, 0, 0);
  }

  updateCustomCursor() {
    if (!this.customCursorElement) return; // Ensure the custom cursor element is defined

    // Further adjustments can be made here based on camera orientation and position
  }

  update() {
    if (this.isAnimationActive) return;

    // Ensure rotation order is correct for Euler manipulation
    this.camera.rotation.order = "YXZ";

    // Smoothly interpolate the camera's yaw towards the target rotation
    const currentYaw = this.camera.rotation.y;
    const deltaYaw = this.currentRotationY - currentYaw;
    this.camera.rotation.y += deltaYaw * this.damping;

    // Fix the pitch angle
    this.camera.rotation.x = this.fixedPitch;

    // Update forward direction based on the camera's new orientation
    this.forward.set(0, 0, -1).applyQuaternion(this.camera.quaternion);
    this.normalize();

    // Calculate and apply movement
    const movementAmount = this.forward.multiplyScalar(
      this.currentTargetPositionZ
    );
    this.camera.position.add(movementAmount);

    // Damp movement when not dragging
    if (!this.isDragging) {
      this.currentTargetPositionZ *= 1 - this.damping;
    }

    this.camera.position.x = Math.max(
      this.boundaries.minX,
      Math.min(this.boundaries.maxX, this.camera.position.x)
    );
    this.camera.position.y = Math.max(
      this.boundaries.minY,
      Math.min(this.boundaries.maxY, this.camera.position.y)
    );
    this.camera.position.z = Math.max(
      this.boundaries.minZ,
      Math.min(this.boundaries.maxZ, this.camera.position.z)
    );
  }
}
