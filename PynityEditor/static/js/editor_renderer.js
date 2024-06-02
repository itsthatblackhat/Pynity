const TempEditorControlsManager = require('./editor_controls_manager');
const TempEditorLevelsManager = require('./editor_levels_manager');

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed');

    const canvas = document.getElementById('gameCanvas');
    const viewport = document.getElementById('viewport');
    const renderer = new THREE.WebGLRenderer({ canvas });
    resizeCanvas();

    window.addEventListener('resize', resizeCanvas);

    function resizeCanvas() {
        const width = viewport.clientWidth;
        const height = viewport.clientHeight;
        renderer.setSize(width, height);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(viewport.clientWidth, viewport.clientHeight);
        camera.aspect = viewport.clientWidth / viewport.clientHeight;
        camera.updateProjectionMatrix();
    }

    const scene = new THREE.Scene();
    const cameraManager = new TempEditorCameraManager(75, window.innerWidth / window.innerHeight, 0.1, 1000, [0, 1.6, 5]);
    const camera = cameraManager.getCamera();
    console.log('CameraManager initialized');

    const levelsManager = new TempEditorLevelsManager(scene);
    console.log('LevelsManager initialized and level loaded');

    const controlsManager = new TempEditorControlsManager(camera);
    console.log('ControlsManager initialized');

    function animate() {
        requestAnimationFrame(animate);
        controlsManager.updateCamera();
        renderer.render(scene, camera);
    }

    animate();
});
