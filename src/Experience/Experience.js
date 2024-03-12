import * as THREE from 'three'
import Sizes from './Utils/Sizes.js'
import Time from './Utils/Time.js'
import EventEmitter from './Utils/EventEmitter.js'
import { GridHelper } from 'three'

import Camera from './Camera.js'
import Renderer from './Renderer.js'
import World from './World/World.js'
import Resources from './Utils/Resources.js'
import Debug from './Utils/Debug.js'
import Controls from './Controls.js'
import PostProcessing from './PostProcessing.js'
// import Interface from './Interface.js'


import sources from './sources.js'

let instance = null

export default class Experience{
    constructor (canvas) {
        //Singleton
        if(instance){
            return instance
        }

        instance = this
        //Options
        this.canvas = canvas

        //Setup
        this.debug = new Debug()
        this.sizes = new Sizes()
        this.time = new Time()
        this.scene = new THREE.Scene()
        this.resources = new Resources(sources)
        this.camera = new Camera()
        this.renderer = new Renderer()
        this.world = new World()
        this.eventEmitter = new EventEmitter()
        // this.postProcessing = new PostProcessing()
        // this.interface = new Interface()
        
        this.controls = new Controls()

        

        this.controls.on('hey', () => {
            console.log('hey I got you')
        }) 
        
        
       
        this.world.eventEmitter.on('ready', () => {
        });

        //Sizes Resize Event
        this.sizes.on('resize', () => {
            this.resize()
        })

        //Time Tick Event
        this.time.on('tick', () => {
            this.update()
        })
    }
    

    resize(){
        this.camera.resize()
        this.renderer.resize()
        this.postProcessing.resize()
    }

    update() {
        this.camera.update();

        this.renderer.update();
        // this.postProcessing.update();
        this.world.update();

      }


    //Ideally call this on each class
    destroy(){
        this.sizes.off('resize')
        this.time.off('tick')

        //Traverse the whole scene and dispose of all objects
        this.scene.traverse((child) => {
            if(child instanceof THREE.Mesh){
                child.geometry.dispose()

                for(const texture of child.material){
                    const value = child.material[key]
                    if(value && typeof value.dispose === 'function'){
                        value.dispose()
                    }
                }
                child.material.dispose()
            }
        })

        this.camera.controls.dispose()
        this.renderer.instance.dispose()

        if(this.debug.active){
            this.debug.destroy()
        }

    }
}