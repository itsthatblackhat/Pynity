class PlayerPhysics {
    constructor(playerBody) {
        this.playerBody = playerBody;
        this.jumpInProgress = false;
        this.speed = 100; // Adjust speed for more responsive movement
        this.damping = 0.95; // Apply damping to reduce inertia
    }

    updateMovement(keys, camera) {
        const direction = new THREE.Vector3();
        const moveDirection = new THREE.Vector3();
        const forward = new THREE.Vector3();
        camera.getWorldDirection(forward);
        forward.y = 0;
        forward.normalize();

        const right = new THREE.Vector3();
        right.crossVectors(camera.up, forward);

        if (keys.w) {
            direction.z += this.speed;
        }
        if (keys.s) {
            direction.z -= this.speed;
        }
        if (keys.a) {
            direction.x += this.speed;
        }
        if (keys.d) {
            direction.x -= this.speed;
        }

        moveDirection.addScaledVector(forward, direction.z);
        moveDirection.addScaledVector(right, direction.x);

        const velocityChange = moveDirection.clone().sub(this.playerBody.velocity).multiplyScalar(0.1);
        this.playerBody.applyImpulse(new CANNON.Vec3(velocityChange.x, 0, velocityChange.z), this.playerBody.position);

        // Apply damping to reduce inertia
        this.playerBody.velocity.x *= this.damping;
        this.playerBody.velocity.z *= this.damping;

        if (keys.space && !this.jumpInProgress) {
            this.jump();
        }
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

export default PlayerPhysics;
