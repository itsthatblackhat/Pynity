import * as THREE from './three.module.js';
import { EditorCameraManager, EditorControlsManager, EditorLevelsManager } from './editor_combined_manager.js';

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed');

    const canvas = document.getElementById('gameCanvas');
    const viewport = document.getElementById('viewport');
    const renderer = new THREE.WebGLRenderer({ canvas });
    renderer.setSize(viewport.clientWidth, viewport.clientHeight);

    window.addEventListener('resize', () => {
        renderer.setSize(viewport.clientWidth, viewport.clientHeight);
        camera.aspect = viewport.clientWidth / viewport.clientHeight;
        camera.updateProjectionMatrix();
    });

    const scene = new THREE.Scene();
    console.log('Scene initialized');

    const cameraManager = new EditorCameraManager(75, viewport.clientWidth / viewport.clientHeight, 0.1, 1000, [0, 1.6, 5]);
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
    }

    animate();

    document.getElementById('saveBtn').addEventListener('click', () => {
        console.log('Save button clicked');
    });

    document.getElementById('loadBtn').addEventListener('click', () => {
        console.log('Load button clicked');
    });

    document.getElementById('addCubeBtn').addEventListener('click', () => {
        levelsManager.addObject({
            type: 'cube',
            size: [1, 1, 1],
            color: [1, 0, 0],
            position: [Math.random() * 5, Math.random() * 5, Math.random() * 5]
        });
        console.log('Add Cube button clicked');
    });

    document.getElementById('addSphereBtn').addEventListener('click', () => {
        levelsManager.addObject({
            type: 'sphere',
            size: [0.5],
            color: [0, 0, 1],
            position: [Math.random() * 5, Math.random() * 5, Math.random() * 5]
        });
        console.log('Add Sphere button clicked');
    });

    document.getElementById('toggleEditModeBtn').addEventListener('click', () => {
        levelsManager.toggleEditMode();
    });
});
