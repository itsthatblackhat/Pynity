class ControlsManager {
    constructor(camera, playerBody) {
        this.camera = camera;
        this.playerBody = playerBody;
        this.keys = {
            w: false,
            s: false,
            a: false,
            d: false,
            space: false,
            c: false
        };
        this.mouseDown = false;
        this.mouseX = 0;
        this.mouseY = 0;
        this.jumpInProgress = false;
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

                this.camera.rotation.y -= deltaX * 0.002;
                this.camera.rotation.x -= deltaY * 0.002;
            }
        });
    }

    updateCamera() {
        const speed = 2;
        const direction = new THREE.Vector3();

        if (this.keys.w) {
            direction.z -= speed;
        }
        if (this.keys.s) {
            direction.z += speed;
        }
        if (this.keys.a) {
            direction.x -= speed;
        }
        if (this.keys.d) {
            direction.x += speed;
        }
        if (this.keys.space && !this.jumpInProgress) {
            this.jump();
        }

        this.playerBody.velocity.x += direction.x * 0.1;
        this.playerBody.velocity.z += direction.z * 0.1;

        this.camera.position.copy(this.playerBody.position);
    }

    jump() {
        if (this.playerBody.position.y <= 1.1) { // Check if player is on the ground
            this.jumpInProgress = true;
            this.playerBody.velocity.y = 5; // Jump strength
            setTimeout(() => {
                this.jumpInProgress = false;
            }, 500); // Adjust the duration as needed
        }
    }
}

export default ControlsManager;
