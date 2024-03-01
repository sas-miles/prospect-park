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


        this.setHover()
    }

    setHover() {
        let time = 0;
        const speed = .005;
        const amplitude = 0.04; // The amplitude of the wave, adjust to get the desired effect
    
        gsap.timeline({repeat: -1})
        .to(this.camera.rotation, {
            z: "+=" + (2 * Math.PI),
            duration: 40,
            ease: "none"
        }, "sync")
        .to(this.camera.position, {
            x: 0,
            z: 85,
            duration: 20,
            ease: "none"
        }, "sync")
    
        gsap.ticker.add(() => {
            time += speed;
    
            // Calculate the new rotation using the cosine function
            const newRotationY = amplitude * Math.cos(time);
    
            // Apply the new rotation to the camera
            this.camera.rotation.y = newRotationY;
        });
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