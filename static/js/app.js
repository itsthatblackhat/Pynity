import LevelsManager from './levels_manager.js';
import PlayerManager from './player_manager.js';
import SpawningManager from './spawning_manager.js';

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded and parsed");

    const canvas = document.getElementById('gameCanvas');
    const renderer = new THREE.WebGLRenderer({ canvas });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    console.log("Renderer initialized");

    const scene = new THREE.Scene();
    console.log("Scene initialized");

    const world = new CANNON.World();
    console.log("Physics world initialized");

    // Fetch configuration from the server
    fetch('/api/config')
        .then(response => response.json())
        .then(config => {
            console.log("Config data:", config);
            world.gravity.set(0, config.gravity, 0); // Set gravity from config
            initializeScene();
        });

    function initializeScene() {
        const playerManager = new PlayerManager(scene, world, [0, 5, 10]);
        const camera = playerManager.getCamera();
        console.log("PlayerManager initialized");

        const levelsManager = new LevelsManager(scene, world);
        console.log("LevelsManager created");
        levelsManager.loadLevel('/api/universe');
        console.log("LevelsManager initialized and level loaded");

        const spawningManager = new SpawningManager(levelsManager, playerManager);
        spawningManager.spawnPlayer([0, 5, 10]);
        console.log("SpawningManager initialized and player spawned");

        const ambientLight = new THREE.AmbientLight(0x404040);
        scene.add(ambientLight);
        console.log("Ambient light added");

        function animate() {
            requestAnimationFrame(animate);
            world.step(1 / 60);
            levelsManager.animate();
            playerManager.update();
            renderer.render(scene, camera);
            console.log("Rendering frame");
        }

        animate();
    }
});
