import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader.js'

import Experience from './Experience.js';

export default class PostProcessing {
    constructor() {
        this.experience = new Experience()
        this.time = this.experience.time
        this.sizes = this.experience.sizes
        this.renderer = this.experience.renderer
        this.effectComposer = new EffectComposer(this.renderer.instance)
        this.renderPass = new RenderPass()
        this.shaderPass = new ShaderPass()
        this.bloom = new UnrealBloomPass()
        this.gamma = new ShaderPass(GammaCorrectionShader)

        this.setEffectComposer()
        this.setRenderPass()
        this.setBloom ()
        this.addPasses()
        
    }

    setEffectComposer() {
        this.effectComposer.setSize(this.sizes.width, this.sizes.height)
        this.effectComposer.setPixelRatio(this.sizes.pixelRatio)

    }

    setBloom() {
        this.bloom.strength = .2
        this.bloom.radius = .8
        this.bloom.threshold = 0.3
    }

    setRenderPass() {
        this.renderPass = new RenderPass(this.experience.scene, this.experience.camera.instance)
    }

    addPasses() {
        this.effectComposer.addPass(this.renderPass)
        this.effectComposer.addPass(this.bloom)
        this.effectComposer.addPass(this.gamma)
    }

    update() {  
        this.effectComposer.render(this.time.delta)
    }

    resize() {
        this.effectComposer.setSize(this.sizes.width, this.sizes.height)
    }
}