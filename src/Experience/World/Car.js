import * as THREE from 'three'
import gsap from 'gsap'
import Experience from '../Experience.js'

export default class Car {

    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time


        //Setup
        this.resource = this.resources.items.car
        this.resourcePath = this.resources.items.carPath
        console.log(this.resourcePath)
        this.setModel()
        this.setPath()
        this.animateAlongPath()
    }

    setModel() {
        this.model = this.resource.scene
        this.scene.add(this.model)
        console.log('Model added to scene:', this.model); // Add this line


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

}