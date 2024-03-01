import * as THREE from 'three'
import gsap from 'gsap'

import Experience from '../Experience.js'

export default class CameraAnimations {

    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.camera = this.experience.camera.instance
        this.time = this.experience.time
        this.debug = this.experience.debug

        this.cameraPath = './path/camera-path.json'
        console.log(this.cameraPath)

        //Debug
        if(this.debug.active){
            this.debugFolder = this.debug.gui.addFolder('CameraAnimations')
        }

        this.setCameraPath()
        this.setHover()
    }

    setCameraPath() {
    }

    setHover() {
    
        gsap.timeline({})
        .to(this.camera.rotation, {
            z:0,
            duration: 100,
            ease: "none"
        }, "sync")
        // .to(this.camera.position, {
        //     x: 0,
        //     z: 85,
        //     duration: 100,
        //     ease: "none"
        // }, "sync")
    }

    setIntro() {
        gsap.timeline({ease: 'power3.out'})
        .to(this.camera.rotation, {
            x: THREE.MathUtils.degToRad(-12),
            y: THREE.MathUtils.degToRad(0),
            z: THREE.MathUtils.degToRad(0),
            duration: 4,
        }, "sync")
        .to(this.camera.position, {
            x: 0,
            y: 6.59,
            z: 85,
            duration: 4
        }, "sync")
        
    }

}