import * as THREE from 'three'
import gsap from 'gsap'
import Experience from '../Experience.js'

export default class Heli {

    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.debug = this.experience.debug

        //Debug
        if(this.debug.active){
            this.debugFolder = this.debug.gui.addFolder('helicopter')
        }


        //Setup
        this.resource = this.resources.items.helicopter
        this.resourcePath = this.resources.items.heliPath
        console.log(this.resourcePath)
        this.setModel()
        this.setPath()
        this.animateAlongPath()
    }

    setModel() {
        this.model = this.resource.scene
        this.scene.add(this.model)

        this.model.traverse((child) => {
            if(child instanceof THREE.Mesh){
                child.castShadow = true
                child.receiveShadow = true
            }
        })
        
    }

    setPath() {
      
        // Assuming this.resource.points is an array of point objects
        const points = this.resourcePath.points.map(
        (pt) => new THREE.Vector3(pt.x, pt.y, pt.z)
        );
    
        this.path = new THREE.CatmullRomCurve3(points);
    }

    animateAlongPath() {
        if (!this.path) {
            console.error("Path for animation is not set.");
            return;
        }
    
        const animationProgress = { path: 0 }
    
        gsap.timeline()
        .to(animationProgress, {
            path: 1,
            duration: 10,
            repeat: -1,
            onUpdate: () => {
                // Get the point on the path corresponding to the current progress
                const point = this.path.getPointAt(animationProgress.path);
    
                // Update the model's position
                this.model.position.copy(point);
            }
        })
    }

    // setAnimation() {
    //     this.animation = {}
    //     this.animation.mixer = new THREE.AnimationMixer(this.model)

    //     this.animation.actions = {}

    //     this.animation.actions.idle = this.animation.mixer.clipAction(this.resource.animations[0])
    //     this.animation.actions.walking = this.animation.mixer.clipAction(this.resource.animations[1])
    //     this.animation.actions.running = this.animation.mixer.clipAction(this.resource.animations[2])   

    //     this.animation.actions.current = this.animation.actions.idle
    //     this.animation.actions.current.play()

    //     this.animation.play = (name) => {
    //         const newAction = this.animation.actions[name]
    //         const oldAction = this.animation.actions.current

    //         newAction.reset()
    //         newAction.play()
    //         newAction.crossFadeFrom(oldAction, 1)

    //         this.animation.actions.current = newAction
    //     }

    //     //Debug
    //     if(this.debug.active){
    //         const debugObject = {
    //             playIdle: () => { this.animation.play('idle') },
    //             playWalking: () => { this.animation.play('walking') },
    //             playRunning: () => { this.animation.play('running') },
    //         }

    //         this.debugFolder.add(debugObject, 'playIdle')
    //         this.debugFolder.add(debugObject, 'playWalking')
    //         this.debugFolder.add(debugObject, 'playRunning')

    //     }
    // }

    update() {
        this.animation.mixer.update(this.time.delta * 0.001)
    }

}