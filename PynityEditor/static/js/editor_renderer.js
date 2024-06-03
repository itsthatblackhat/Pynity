import * as THREE from './three.module.js';
import { EditorCameraManager, EditorControlsManager, EditorLevelsManager } from './editor_combined_manager.js';

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed');

    const canvas = document.getElementById('gameCanvas');
    const canvasContainer = document.getElementById('canvas-container');
    const renderer = new THREE.WebGLRenderer({ canvas });
    renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);

    window.addEventListener('resize', () => {
        renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
        camera.aspect = canvasContainer.clientWidth / canvasContainer.clientHeight;
        camera.updateProjectionMatrix();
    });

    const scene = new THREE.Scene();
    console.log('Scene initialized');

    const cameraManager = new EditorCameraManager(75, canvasContainer.clientWidth / canvasContainer.clientHeight, 0.1, 1000, [0, 1.6, 5]);
    const camera = cameraManager.getCamera();
    console.log('CameraManager initialized');

    const levelsManager = new EditorLevelsManager(scene, camera, renderer);
    console.log('LevelsManager initialized');

    const controlsManager = new EditorControlsManager(camera);
    console.log('ControlsManager initialized');

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 5, 5).normalize();
    scene.add(light);
    console.log('Light added to the scene');

    fetch('levels/universe.json')
        .then(response => response.json())
        .then(levelData => levelsManager.loadLevelData(levelData));

    function animate() {
        requestAnimationFrame(animate);
        controlsManager.updateCamera();
        renderer.render(scene, camera);
        levelsManager.pixiApp.render();  // Ensure PixiJS rendering is also called
    }

    animate();

    document.getElementById('saveBtn').addEventListener('click', () => {
        console.log('Save button clicked');
    });

    document.getElementById('loadBtn').addEventListener('click', () => {
        console.log('Load button clicked');
    });

    document.getElementById('addCubeBtn').addEventListener('click', () => {
        console.log('Add Cube button clicked');
        levelsManager.addObject({
            type: 'cube',
            size: [1, 1, 1],
            color: [1, 0, 0],
            position: [0, 0, 0]
        });
    });

    document.getElementById('addSphereBtn').addEventListener('click', () => {
        console.log('Add Sphere button clicked');
        levelsManager.addObject({
            type: 'sphere',
            size: [0.5],
            color: [0, 1, 0],
            position: [2, 0, 0]
        });
    });

    document.getElementById('toggleEditModeBtn').addEventListener('click', () => {
        levelsManager.toggleEditMode();
    });

    document.getElementById('toggleGridBtn').addEventListener('click', () => {
        levelsManager.toggleGrid();
    });
});
