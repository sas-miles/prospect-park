import Experience from "../Experience.js";
import IntroPlane from "./IntroPlane.js";
import Environment from "./Environment.js";
import Map from "./Map.js";
import Heli from "./Heli.js";
import Car from "./Car.js";
import Boat from "./Boat.js";
import EventEmitter from "../Utils/EventEmitter.js";
import Loader from "./Loader.js";
import Intro from "./Intro.js";
import CameraAnimations from "../Animations/CameraAnimations.js";

export default class World {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.introPlane = new IntroPlane();
    this.loader = new Loader();
    this.eventEmitter = new EventEmitter();

    this.resources.on("ready", () => {
      //Setup
      this.map = new Map();
      this.environment = new Environment();
      this.heli = new Heli();
      this.car = new Car();
      this.boat = new Boat();
      this.eventEmitter.trigger("ready");
    });

    // Listen for the "ready" event from the Loader
    this.loader.on("ready", () => {
      this.intro = new Intro();

      this.intro.on("intro:ready", () => {
        this.eventEmitter.trigger("intro:complete");
      });
    });
  }

  update() {
    if (this.heli) this.heli.update();
    if (this.car) this.car.update();
    if (this.boat) this.boat.update();
    if (this.introPlane) this.introPlane.update();
  }
}
