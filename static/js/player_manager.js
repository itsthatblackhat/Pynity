import ControlsManager from './controls_manager.js';

class PlayerManager {
    constructor(scene, world, initialPosition) {
        this.scene = scene;
        this.world = world;

        // Create a camera
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(...initialPosition);

        // Create a physical body for the player
        const playerShape = new CANNON.Sphere(1.0);
        this.body = new CANNON.Body({ mass: 1 });
        this.body.addShape(playerShape);
        this.body.position.set(...initialPosition);
        this.body.fixedRotation = true; // Prevent player from rotating due to physics interactions
        this.world.addBody(this.body);

        this.controlsManager = new ControlsManager(this.camera, this.body);
        console.log("Player initialized at position:", this.camera.position);
    }

    getCamera() {
        return this.camera;
    }

    update() {
        this.controlsManager.updateCamera();

        // Update the camera position to match the physics body
        this.camera.position.copy(this.body.position);
    }
}

export default PlayerManager;
