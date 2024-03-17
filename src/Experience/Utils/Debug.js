import GUI from "lil-gui";
import Stats from "stats.js";

export default class Debug {
  constructor() {
    this.active = window.location.hash === "#debug";

    if (this.active) {
      this.gui = new GUI();
      this.gui.domElement.style.width = "25vw"; // Change the width to 300 pixels
      this.stats = new Stats();

      this.setupStats();
    }
  }

  setupStats() {
    this.stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild(this.stats.dom);
  }

  update() {
    if (this.active) {
      this.stats.begin();
      this.stats.end();
    }
  }
}
