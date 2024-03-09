import * as THREE from 'three';
import { MapControls } from 'three/addons/controls/MapControls.js';
import Experience from './Experience';


export default class Controls {
    constructor() {
        this.experience = new Experience();
        this.time = this.experience.time;
        this.renderer = this.experience.renderer
        this.sizes = this.experience.sizes;
        this.scene = this.experience.scene;
        this.canvas = this.experience.canvas;
        this.camera = this.experience.camera.instance;

         
    }

    

    update() {
        // this.controls.update(this.time.delta * 0.001)
    }
    
}
