import * as THREE from 'three';
import Experience from './Experience';

export default class Controls {
    constructor() {
        this.experience = new Experience();
        this.time = this.experience.time;
        this.renderer = this.experience.renderer
        this.sizes = this.experience.sizes;
        this.camera = this.experience.camera.instance;

        this.isDragging = false;
        this.dragStart = {x: 0, y: 0}; 
        this.rotationDeadzone = 5;
        this.movementSpeed = .3;
        this.rotateSpeed = .8;
        this.damping = 0.02
        
        this.currentRotationY = 0
        this.currentTargetPositionZ = 0
        // this.fixedPitchValue = THREE.MathUtils.degToRad(-9); 

        this.setMouse();
    }

    setMouse() {
        this.mouse = new THREE.Vector2();

        const handleMouseMove = (clientX, clientY) => {
            this.mouse.x = event.clientX / this.sizes.width * 2 - 1;
            this.mouse.y = -(event.clientY / this.sizes.height) * 2 + 1;

            if(this.isDragging){
                const deltaX = this.mouse.x - this.dragStart.x;
                const deltaY = this.mouse.y - this.dragStart.y;
                this.currentTargetPositionZ -= deltaY * this.movementSpeed;
                this.currentRotationY += deltaX * this.rotateSpeed;
            
                this.dragStart.x = this.mouse.x;
                this.dragStart.y = this.mouse.y;
            }
        }

        // triggered when the mouse moves
        window.addEventListener('mousemove', (event) => {
            this.time.trigger('mouseMove');
            handleMouseMove(event.clientX, event.clientY);
        });

        // after pressing down the mouse button
        window.addEventListener('pointerdown', () => {
            this.time.trigger('mouseDown');

            this.isDragging = true
            this.dragStart.x = this.mouse.x
            this.dragStart.y = this.mouse.y
        });

        // after releasing the mouse button
        window.addEventListener('click', () => {
            this.time.trigger('mouseUp');

            this.isDragging = false;
        });

        // touch move on mobile
        window.addEventListener('touchmove', (event) => {
            this.mouse.x = event.touches[0].clientX / this.sizes.width * 2 - 1;
            this.mouse.y = -(event.touches[0].clientY / this.sizes.height) * 2 + 1;
        });

        // touch start on mobile
        window.addEventListener('touchstart', () => {
            this.time.trigger('mouseDown');
        });

        // touch end on mobile
        window.addEventListener('touchend', () => {
            this.time.trigger('mouseUp');
        });
    }

    update() {
        // Rotate around Y axis based on currentRotationY. This affects yaw only.
        this.camera.rotation.y += (this.currentRotationY - this.camera.rotation.y) * this.damping;
        
        const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(this.camera.quaternion);

        const movementAmount = forward.multiplyScalar(this.currentTargetPositionZ);

        this.camera.position.add(movementAmount);

        // Gradually reduce the movement speed when not dragging for smooth stopping
        if (!this.isDragging) {
        this.currentTargetPositionZ *= 1 - this.damping;
         }



    }
    
    
    
}
