class CameraManager {
    constructor(fov, aspect, near, far, initialPosition) {
        this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        this.camera.position.set(...initialPosition);
        console.log("Camera initialized at position:", this.camera.position);
    }

    getCamera() {
        return this.camera;
    }
}
