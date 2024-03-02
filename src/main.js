import barba from '@barba/core';
import { restartWebflow } from "@finsweet/ts-utils";

import Experience from './Experience/Experience.js'

const experience = new Experience(document.querySelector('canvas.webgl'))

window.Webflow ||= [];
window.Webflow.push(async () => {
  
  barba.init({
    transitions: [{
      name: 'default-transition',
      leave() {
        console.log('leave');
      },
      enter() {
        console.log('enter');
      }
    }]
  });

})

barba.hooks.afterEnter((data) => {
  console.log('afterEnter');
  restartWebflow();
})