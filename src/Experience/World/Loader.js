import * as three from "three";
import gsap from "gsap";

import Experience from "../Experience.js";
import EventEmitter from "../Utils/EventEmitter";

export default class Loader extends EventEmitter {
  constructor() {
    super();
    this.experience = new Experience();
    this.resources = this.experience.resources;
    this.scene = this.experience.scene;
    this.time = this.experience.time;
    this.debug = this.experience.debug;

    this.loaderDiv = document.querySelector(".loader-wrapper");
    this.loadingBar = document.querySelector(".loading-bar");
    this.loadingCounter = document.querySelector(".loading-counter_text");

    this.resources.on("progress", (progress) => {
      // console.log(`Loading progress: ${progress}%`);
      this.loadingBar.style.transform = `translateX(${progress * 100 - 100}%)`;
      this.loadingCounter.textContent = `${Math.round(progress * 100)}%`;
    });
    this.setupLoad();
  }

  setupLoad() {
    this.resources.on("ready", () => {
      gsap
        .timeline({
          onComplete: () => {
            this.loaderDiv.remove();
            this.trigger("ready");
          },
        })
        .to(
          this.loadingBar,
          {
            delay: 0.5,
            opacity: 0,
            duration: 1,
            ease: "power2.in",
          },
          "bar"
        )
        .to(
          this.loadingBar.scale,
          {
            delay: 0.5,
            x: 0, // Target scale for x-axis
            duration: 1,
            ease: "power2.in",
          },
          "bar"
        )
        .to(this.loadingCounter, {
          opacity: 0,
          duration: 1,
          y: -10,
          ease: "power2.inOut",
        })
        .to(this.loaderDiv, {
          opacity: 0,
          duration: 1,
          ease: "power2.inOut",
        });
    });
  }
}
