import * as THREE from 'three';
import EventEmitter from './Utils/EventEmitter';
import Experience from './Experience';


export default class Controls extends EventEmitter{
    constructor() {
        super();
        this.experience = new Experience();
        this.time = this.experience.time;
        this.renderer = this.experience.renderer
        this.sizes = this.experience.sizes;
        this.scene = this.experience.scene;
        this.canvas = this.experience.canvas;
        this.camera = this.experience.camera.instance;


        
        
    }
    

    update() {
    }
    
}
