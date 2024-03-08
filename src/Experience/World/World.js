import Experience from '../Experience.js'
import Environment from './Environment.js'
import Map from './Map.js'
import Floor from './Floor.js'
import Plane from './Plane.js'
import EventEmitter from '../Utils/EventEmitter.js'
import Ground from './Ground.js'


export default class World{
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.eventEmitter = new EventEmitter();
        this.resources.on('ready', () => {
            console.log('Resources ready');

            //Setup
            // this.floor = new Floor();
            // this.ground = new Ground();
            this.map = new Map();
            this.environment = new Environment();
            this.eventEmitter.trigger('ready');
        });

    }


    update() {
    }   
}