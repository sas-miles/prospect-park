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
<<<<<<< HEAD


        
=======
>>>>>>> 3441dad26092af4b1750f45730dcb1d59550ef5f
        
    }
    

    update() {
    }
    
}
