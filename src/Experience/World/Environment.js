import * as THREE from 'three'

import Experience from '../Experience.js'

export default class Environment{
    constructor(){
        this.experience = new Experience()
        this.scene = this.experience.scene 
        this.resources = this.experience.resources
        this.debug = this.experience.debug
        this.fog = new THREE.FogExp2( 0xffffff, .004);

        //Debug
        if(this.debug.active){
            this.debugFolder = this.debug.gui.addFolder('Environment')
        }

        this.setSunLight()
        this.setEnvironmentMap()
        this.setFog()
    }

    setFog(){
        this.scene.fog = this.fog
    }

    setSunLight(){
        this.sunLight = new THREE.DirectionalLight('#ffffff', 4)
        this.sunLight.castShadow = true
        this.sunLight.shadow.camera.far = 100
        this.sunLight.shadow.mapSize.set(1024, 1024)
        this.sunLight.shadow.normalBias = 0.05
        this.sunLight.position.set(3, 3, -2.25)
        this.sunlightHelper = new THREE.DirectionalLightHelper(this.sunLight, 0.2)
        this.scene.add(this.sunLight, this.sunlightHelper)

        //Debug
        if(this.debug.active){
            this.debugFolder
                .add(this.sunLight, 'intensity')
                .min(0).max(10).step(0.001)
                .name('Sun Light Intensity')

            this.debugFolder
                .add(this.sunLight.position, 'x')
                .min(0).max(10).step(0.001)
                .name('Sun X')

            this.debugFolder
                .add(this.sunLight.position, 'y')
                .min(0).max(10).step(0.001)
                .name('Sun Y')

            this.debugFolder
                .add(this.sunLight.position, 'z')
                .min(0).max(10).step(0.001)
                .name('Sun Z')
        }
    }

    setEnvironmentMap(){
        this.environmentMap = {}
        this.environmentMap.intensity = 0.4
        this.environmentMap.texture = this.resources.items.environmentMapTexture
        this.environmentMap.texture.colorSpace = THREE.SRGBColorSpace

        this.scene.environment = this.environmentMap.texture

        this.environmentMap.updateMaterial = () => {
            this.scene.traverse(child => {
                if(child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial){
                    child.material.envMap = this.environmentMap.texture
                    child.material.envMapIntensity = this.environmentMap.intensity
                    child.material.needsUpdate = true
                }
            })
        }

        this.environmentMap.updateMaterial()
        this.scene.background = this.environmentMap.texture

        //Debug
        if(this.debug.active){
            this.debugFolder
                .add(this.environmentMap, 'intensity')
                .min(0).max(4).step(0.001)
                .name('Intensity')
                .onChange(this.environmentMap.updateMaterial)
        }
    }
}