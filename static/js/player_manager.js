import ControlsManager from './controls_manager.js';

class PlayerManager {
    constructor(scene, world, initialPosition) {
        this.scene = scene;
        this.world = world;
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(...initialPosition);
        this.controlsManager = new ControlsManager(this.camera);
        console.log("Player initialized at position:", this.camera.position);
    }

    getCamera() {
        return this.camera;
    }

    update() {
        this.controlsManager.updateCamera();
    }
}

export default PlayerManager;
