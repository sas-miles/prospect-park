import * as THREE from "three";

import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { GammaCorrectionShader } from "three/examples/jsm/shaders/GammaCorrectionShader.js";
import vignetteVertexShader from "./shaders/vignettePP/vertex.glsl";
import vignetteFragmentShader from "./shaders/vignettePP/fragment.glsl";

import Experience from "./Experience.js";

export default class PostProcessing {
  constructor() {
    this.experience = new Experience();
    this.time = this.experience.time;
    this.sizes = this.experience.sizes;
    this.renderer = this.experience.renderer;
    this.effectComposer = new EffectComposer(this.renderer.instance);
    this.renderPass = new RenderPass();
    this.shaderPass = new ShaderPass();
    this.bloom = new UnrealBloomPass();
    this.gamma = new ShaderPass(GammaCorrectionShader);
    this.debug = this.experience.debug;

    this.setEffectComposer();
    this.setRenderPass();
    this.setVignette();
    this.setBloom();
    this.addPasses();
  }

  setEffectComposer() {
    this.effectComposer.setSize(this.sizes.width, this.sizes.height);
    this.effectComposer.setPixelRatio(this.sizes.pixelRatio);
  }

  setVignette() {
    const vignetteShader = {
      uniforms: {
        tDiffuse: { value: null },
        noiseIntensity: { value: 0.0 },
        vignetteColor: { value: new THREE.Vector3(0.9, 0.9, 0.9) },
        blurStrength: { value: 0.2 },
        vignetteRadius: { value: 1.1 },
      },
      vertexShader: vignetteVertexShader,
      fragmentShader: vignetteFragmentShader,
    };

    this.vignetteShader = new ShaderPass(vignetteShader);
  }

  setBloom() {
    this.bloom.strength = 0;
    this.bloom.radius = 0.3;
    this.bloom.threshold = 0.7;
  }

  setRenderPass() {
    this.renderPass = new RenderPass(
      this.experience.scene,
      this.experience.camera.instance
    );
  }

  addPasses() {
    this.effectComposer.addPass(this.renderPass);
    this.effectComposer.addPass(this.bloom);
    this.effectComposer.addPass(this.vignetteShader);
    this.effectComposer.addPass(this.gamma);
  }

  update() {
    this.effectComposer.render(this.time.delta);
  }

  resize() {
    this.effectComposer.setSize(this.sizes.width, this.sizes.height);
  }
}
