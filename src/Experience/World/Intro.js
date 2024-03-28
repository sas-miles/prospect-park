import * as three from "three";
import EventEmitter from "../Utils/EventEmitter.js";
import gsap from "gsap";

import Experience from "../Experience.js";

export default class Intro extends EventEmitter {
  constructor() {
    super();
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.time = this.experience.time;
    this.debug = this.experience.debug;
    this.introPlane = this.experience.world.introPlane;

    this.wrapper = document.querySelector(".intro-wrapper-animate");
    this.credit = document.querySelector(".intro-credit-animate");
    this.title = document.querySelector(".intro-title-animate");
    this.button = document.querySelector(".intro-button-animate");
    this.introLinks = document.querySelectorAll(".intro-link-animate");

    this.setIntro();
    this.clickEvent();
  }

  setIntro() {
    gsap
      .timeline()
      .to(this.title, {
        duration: 1,
        opacity: 1,
        ease: "power2.inOut",
      })
      .to(
        this.credit,
        {
          duration: 0.5,
          opacity: 1,
          ease: "power2.out",
        },
        "a"
      )
      .to(this.button, {
        duration: 1,
        opacity: 1,
        scale: 1.03,
        ease: "power1.inOut",
      })
      .to(
        this.introLinks,
        {
          duration: 0.5,
          opacity: 1,
          y: 0,
          ease: "power2.out",
        },
        "a"
      );
  }

  clickEvent() {
    this.button.addEventListener("click", () => {
      gsap
        .timeline({
          onComplete: () => {
            setTimeout(() => {
              this.trigger("intro:ready");
            }, 0);

            this.introPlane.startFadeOut(() => {
              console.log("IntroPlane fade-out complete");
              this.scene.remove(this.introPlane.mesh); // Removal happens after fade-out completes
            });
          },
        })
        .to(this.button, { duration: 0.5, opacity: 0, ease: "power2.out" }, "a")
        .to(this.title, { duration: 0.5, opacity: 0, ease: "power2.out" }, "a")
        .to(this.credit, { duration: 0.5, opacity: 0, ease: "power2.out" }, "a")
        .to(
          this.introLinks,
          {
            duration: 0.5,
            opacity: 0,
            ease: "power2.in",
            onComplete: () => this.wrapper.remove(),
          },
          "a"
        );
    });
  }
}
