import * as THREE from "three";
import EventEmitter from "./Utils/EventEmitter";
import Experience from "./Experience";
import { CameraRig, FreeMovementControls, CameraAction, Damper} from "three-story-controls";

export default class Controls extends EventEmitter {
  constructor() {
    super();
    this.experience = new Experience();
    this.time = this.experience.time;
    this.renderer = this.experience.renderer;
    this.sizes = this.experience.sizes;
    this.scene = this.experience.scene;
    this.canvas = this.experience.canvas;
    this.camera = this.experience.camera.instance;

    this.rig = new CameraRig(this.camera, this.scene);
    this.damper = new Damper({
        values: {
            x: 0,
            y: 0,
            z: 0
        },
        dampingFactor: 0.01 // Adjust this value to control the damping strength
    });
    this.controls = new FreeMovementControls(this.rig, {
      domElement: this.canvas,
      pointerScaleFactor: 14,
      dampingFactor: 0.001
    });
    this.controls.enable();

    // Listen to the update events from the adaptors
    this.controls.keyboardAdaptor.addEventListener('update', this.onControlsUpdate.bind(this));
    this.controls.wheelAdaptor.addEventListener('update', this.onControlsUpdate.bind(this));
    this.controls.pointerAdaptor.addEventListener('update', this.onControlsUpdate.bind(this));
  }

  onControlsUpdate(event) {
    // Set the target values for the damper
    this.damper.setTarget({
      x: event.deltas.x,
      y: event.deltas.y,
      z: event.deltas.z
    });

    // Update the damper
    this.damper.update();

    const dampedValues = this.damper.getCurrentValues();
    
    this.rig.do(CameraAction.Pan, dampedValues.x);
    this.rig.do(CameraAction.Tilt, dampedValues.y);
    this.rig.do(CameraAction.Roll, dampedValues.z);
  }

  update() {
    this.controls.update(this.time.current);
  }
}