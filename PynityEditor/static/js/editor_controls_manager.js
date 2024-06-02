import * as THREE from './three.module.js';

export class EditorControlsManager {
    constructor(camera) {
        this.camera = camera;
        this.keys = {
            w: false,
            s: false,
            a: false,
            d: false,
            space: false,
            c: false,
            q: false,
            e: false
        };
        this.mouseDown = false;
        this.mouseX = 0;
        this.mouseY = 0;
        this.pitch = 0;
        this.yaw = 0;
        this.initEventListeners();
    }

    initEventListeners() {
        document.addEventListener('keydown', (event) => {
            if (event.key.toLowerCase() in this.keys) {
                this.keys[event.key.toLowerCase()] = true;
            }
        });

        document.addEventListener('keyup', (event) => {
            if (event.key.toLowerCase() in this.keys) {
                this.keys[event.key.toLowerCase()] = false;
            }
        });

        document.addEventListener('mousedown', (event) => {
            this.mouseDown = true;
            this.mouseX = event.clientX;
            this.mouseY = event.clientY;
        });

        document.addEventListener('mouseup', () => {
            this.mouseDown = false;
        });

        document.addEventListener('mousemove', (event) => {
            if (this.mouseDown) {
                const deltaX = event.clientX - this.mouseX;
                const deltaY = event.clientY - this.mouseY;
                this.mouseX = event.clientX;
                this.mouseY = event.clientY;

                this.yaw -= deltaX * 0.002;
                this.pitch -= deltaY * 0.002;

                // Clamp the pitch value to avoid flipping
                this.pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.pitch));
            }
        });
    }

    updateCamera() {
        if (!this.camera || !this.camera.position) {
            console.error('Camera or camera position is undefined');
            return;
        }

        const direction = new THREE.Vector3();
        const right = new THREE.Vector3();
        const up = new THREE.Vector3(0, 1, 0);

        this.camera.getWorldDirection(direction);
        right.crossVectors(up, direction).normalize();

        if (this.keys.w) {
            this.camera.position.addScaledVector(direction, 0.1);
        }
        if (this.keys.s) {
            this.camera.position.addScaledVector(direction, -0.1);
        }
        if (this.keys.a) {
            this.camera.position.addScaledVector(right, -0.1);
        }
        if (this.keys.d) {
            this.camera.position.addScaledVector(right, 0.1);
        }
        if (this.keys.space) {
            this.camera.position.y += 0.1;
        }
        if (this.keys.c) {
            this.camera.position.y -= 0.1;
        }
        if (this.keys.q) {
            this.camera.rotation.y += 0.02;
        }
        if (this.keys.e) {
            this.camera.rotation.y -= 0.02;
        }

        this.camera.rotation.order = 'YXZ'; // Order of rotations: yaw (Y), pitch (X), roll (Z)
        this.camera.rotation.set(this.pitch, this.yaw, 0);
    }
}
