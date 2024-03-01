import GUI from 'lil-gui'

export default class Debug{

    constructor() {
        this.active = window.location.hash === '#debug' 
        

        if(this.active)
            this.gui = new GUI()
            this.gui.domElement.style.width = '25vw'; // Change the width to 300 pixels
            
    }


}