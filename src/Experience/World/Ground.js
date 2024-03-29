import * as THREE from 'three'

import Experience from '../Experience.js'


export default class Ground {   
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.debug = this.experience.debug  

        //Debug
        if(this.debug.active){
            this.debugFolder = this.debug.gui.addFolder('Plane')
        }

        this.setGeometry()
        this.setMaterial()
        this.setMesh()        

    }

    setGeometry(){
        this.geometry = new THREE.PlaneGeometry(5,5, 64, 64)
    }

    setMaterial(){
        this.material = new THREE.MeshStandardMaterial({
            color: '#00ff00'
        })

    }

    setMesh(){
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.scene.add(this.mesh)

        if(this.debug.active){
            this.debugFolder.add(this.mesh.position, 'x')
            .min(-5)
            .max(5)
            .step(0.001)
            .name('Plane X')   

            this.debugFolder.add(this.mesh.position, 'y')
            .min(-5)
            .max(5)
            .step(0.001)
            .name('Plane Y')

            this.debugFolder.add(this.mesh.position, 'z')
            .min(-5)
            .max(5)
            .step(0.001)
            .name('Plane Z')


        }
    }
}