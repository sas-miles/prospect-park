import * as THREE from 'three'

import Experience from '../Experience.js'

export default class Environment{
    constructor(){
        this.experience = new Experience()
        this.scene = this.experience.scene 
        this.resources = this.experience.resources
        this.debug = this.experience.debug
       // this.fog = new THREE.FogExp2( 0xffffff, .004);

        //Debug
        if(this.debug.active){
            this.debugFolder = this.debug.gui.addFolder('Environment')
        }

        this.setSunLight()
        this.setEnvironmentMap()
        this.ambientLight = this.setAmbientLight()
        this.setFog()
    }

    setFog(){
        this.scene.fog = this.fog
    }

    setAmbientLight(){
        this.ambientLight = new THREE.AmbientLight('#cce6ff', 2)
        this.scene.add(this.ambientLight)

        //Debug
        if(this.debug.active){
            this.debugFolder
                .add(this.ambientLight, 'intensity')
                .min(0).max(10).step(0.001)
                .name('Ambient Light Intensity')
        }
    }

    setSunLight(){
        this.sunLight = new THREE.DirectionalLight('#FFF2CC', 3.5)
        this.sunLight.castShadow = true
        this.sunLight.shadow.camera.far = 800
        this.sunLight.shadow.camera.near = .8

        this.sunLight.shadow.camera.top = -80
        this.sunLight.shadow.camera.right = -80
        this.sunLight.shadow.camera.bottom = 80
        this.sunLight.shadow.camera.left = 80


        this.sunLight.shadow.mapSize.set(2048, 2048
        )
        this.sunLight.shadow.normalBias = 0.2
        this.sunLight.shadow.bias = -.0001
        this.sunLight.position.set(20, 40, 0)
        // this.sunlightHelper = new THREE.DirectionalLightHelper(this.sunLight, 0.2)
        this.scene.add(this.sunLight)

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
        this.environmentMap.intensity = .2
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
        this.scene.background = new THREE.Color(0xfefefe);

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