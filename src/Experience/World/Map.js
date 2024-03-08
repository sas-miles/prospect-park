import * as THREE from 'three'

import Experience from '../Experience.js'

export default class Map {

    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.debug = this.experience.debug

        //Debug
        if(this.debug.active){
            this.debugFolder = this.debug.gui.addFolder('Map')
        }


        //Setup
        this.resource = this.resources.items.map
        this.setModel()
    }

    setModel() {
        this.model = this.resource.scene
        this.scene.add(this.model)
        console.log(this.model)

        this.model.traverse((child) => {
            if(child instanceof THREE.Mesh){
                child.castShadow = true
                child.receiveShadow = true
            }
        })

        this.setupCameraAnimation()
    }

    setupCameraAnimation() {
        this.mixer = null
        this.camera = null

        this.model.traverse((child) => {
            if(child.isCamera){
                this.camera = child
                console.log("Camera found in gltf", this.camera)
            }
        })

        if(this.camera){
           this.mixer = new THREE.AnimationMixer(this.camera)
           this.resource.animations.forEach((clip) => {
            if (clip.name === 'Camera.001Action.001'){
                const action = this.mixer.clipAction(clip)
                action.play()
            }
           })
        } else{
            console.warn("No camera found in gltf")
        }
        setTimeout(() => {
            this.experience.eventEmitter.emit('introAnimationComplete');
        }, 5000);
        
    }


    

    update() {
        if (this.mixer){
            this.mixer.update(this.time.delta)
        }
        // console.log(this.mixer)
    }

}