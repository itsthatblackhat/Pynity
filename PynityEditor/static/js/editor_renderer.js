const EditorCameraManager = require('./editor_camera_manager');
const EditorControlsManager = require('./editor_controls_manager');
const EditorLevelsManager = require('./editor_levels_manager');

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed');

    const canvas = document.getElementById('gameCanvas');
    const renderer = new THREE.WebGLRenderer({ canvas });
    renderer.setSize(window.innerWidth, window.innerHeight);
    console.log('Renderer initialized');

    const scene = new THREE.Scene();
    console.log('Scene initialized');

    const cameraManager = new EditorCameraManager(75, window.innerWidth / window.innerHeight, 0.1, 1000, [0, 1.6, 5]);
    const camera = cameraManager.getCamera();
    console.log('CameraManager initialized');

    const levelsManager = new EditorLevelsManager(scene);
    console.log('LevelsManager initialized and level loaded');

    const controlsManager = new EditorControlsManager(camera);
    console.log('ControlsManager initialized');

    function animate() {
        requestAnimationFrame(animate);
        controlsManager.updateCamera();
        renderer.render(scene, camera);
    }

    animate();
});
