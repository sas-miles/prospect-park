import * as THREE from 'three'
import gsap from 'gsap'

import Experience from '../Experience.js'

export default class CameraAnimations {

    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.camera = this.experience.camera.instance
        this.time = this.experience.time
        this.resources = this.experience.resources
        this.debug = this.experience.debug
        this.resource = this.resources.items.cameraPath

        //Debug
        if(this.debug.active){
            this.debugFolder = this.debug.gui.addFolder('CameraAnimations')
        }

        this.resource = this.resources.items.cameraPath;

        this.setCameraPath();
        this.animateCameraAlongPath();
        
        
    }
    


    setCameraPath() {
    
        if (!this.resource || !this.resource.points) {
            console.error('Resource is not loaded or does not contain points.');
            return;
        }
    
        // Assuming this.resource.points is an array of point objects
        const points = this.resource.points.map((pt) => new THREE.Vector3(pt.x, pt.y, pt.z));
    
    
        this.path = new THREE.CatmullRomCurve3(points);
    
    }
    animateCameraAlongPath() {
        // Ensure the path is set
        if (!this.path) {
            console.error('Path for animation is not set.');
            return;
        }
    
        // Object to hold the progress value
        const progress = {value: 0};
    
        // Duration of the animation in seconds
        const duration = 20; // Adjust duration to your liking
    
        gsap.to(progress, {
            value: 1,
            duration: duration,
            onUpdate: () => {
                // Use the progress value to get the current point on the path
                const point = this.path.getPointAt(progress.value);
        
                // If the animation is near completion, look at the end of the path
                let lookAtPoint;
                if (progress.value >= 0.99) { // Change this line
                    lookAtPoint = this.path.getPointAt(1);
                } else {
                    // Otherwise, look ahead on the path to orient the camera
                    lookAtPoint = this.path.getPointAt((progress.value + 0.01) % 1);
                }
        
                // Update camera position
                this.camera.position.copy(point);
        
                // Update camera orientation to look ahead
                this.camera.lookAt(lookAtPoint);
            },
            ease: "none",
        });
    }
    
    
    


}