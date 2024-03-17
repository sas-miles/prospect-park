import * as THREE from "three";
import gsap from "gsap";
import Experience from "../Experience.js";

export default class Car {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.time = this.experience.time;
    this.debug = this.experience.debug;

    //Debug
    if (this.debug.active) {
      this.debugFolder = this.debug.gui.addFolder("Car");
    }

    //Setup
    this.resource = this.resources.items.car;
    this.resourcePath = this.resources.items.carPath;
    // console.log(this.resourcePath)
    this.setModel();
    this.setPath();
    this.animateAlongPath();
  }

  setModel() {
    this.model = this.resource.scene;

    // Compute the bounding box of the model
    const box = new THREE.Box3().setFromObject(this.model);

    // Compute the center of the bounding box
    const center = box.getCenter(new THREE.Vector3());

    // Translate the model so that its center is at the origin
    this.model.position.sub(center);

    this.model.position.setY(0);

    // Create a group and add the model to it
    this.group = new THREE.Group();
    this.group.add(this.model);

    // Add the group to the scene
    this.scene.add(this.group);
  }

  setPath() {
    // Assuming this.resource.points is an array of point objects
    const points = this.resourcePath.points.map(
      (pt) => new THREE.Vector3(pt.x, pt.y, pt.z)
    );

    this.path = new THREE.CatmullRomCurve3(points);
    // Create a geometry from the points
    const geometry = new THREE.BufferGeometry().setFromPoints(points);

    if (this.debug.active) {
      // Create a material for the line
      const material = new THREE.LineBasicMaterial({ color: 0xff0000 });

      // Create a line and add it to the scene
      this.line = new THREE.Line(geometry, material);
      this.scene.add(this.line);
      this.line.position.set(0, 1, 0);

      // Add a checkbox to the GUI to show or hide the line
      this.debugFolder.add(this.line, "visible").name("Show Path");
    }
  }

  animateAlongPath() {
    if (!this.path) {
      console.log("Path is not set");
      return;
    }

    const animationProgress = { path: 0 };

    gsap.timeline().to(animationProgress, {
      path: 1,
      duration: 40,
      repeat: -1,
      onUpdate: () => {
        // Get the point on the path corresponding to the current progress
        const point = this.path.getPointAt(animationProgress.path);

        // Update the group's position
        this.group.position.copy(point);

        // Get the tangent to the path at the current point
        const tangent = this.path.getTangentAt(animationProgress.path);

        // Make the group face the direction of the tangent
        this.group.lookAt(new THREE.Vector3().addVectors(point, tangent));

        // Adjust the group's rotation
        this.group.rotation.y += THREE.MathUtils.degToRad(36); // Adjust this value as needed
      },
    });
  }
}
