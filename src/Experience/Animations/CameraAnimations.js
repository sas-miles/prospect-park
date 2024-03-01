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

        //Debug
        if(this.debug.active){
            this.debugFolder = this.debug.gui.addFolder('CameraAnimations')
        }


        //Setup
        this.startPosition = {
            x: 0,
            y: 45,
            z: 170
        }

        this.startRotation = {
            x: THREE.MathUtils.degToRad(0),
            y: THREE.MathUtils.degToRad(0),
            z: THREE.MathUtils.degToRad(0),
        }

        this.setIntro()
    }

    setIntro() {
        this.camera.position.set(this.startPosition.x, this.startPosition.y, this.startPosition.z)
        this.camera.rotation.set(this.startRotation.x, this.startRotation.y, this.startRotation.z)

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