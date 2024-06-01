document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded and parsed");

    const canvas = document.getElementById('gameCanvas');
    const renderer = new THREE.WebGLRenderer({ canvas });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    console.log("Renderer initialized");

    const scene = new THREE.Scene();
    console.log("Scene initialized");

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 5);
    console.log("Camera initialized at position:", camera.position);

    const controlsManager = new ControlsManager(camera);
    console.log("Controls manager initialized");

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0x404040, 2);
    scene.add(ambientLight);
    console.log("Ambient light added");

    // Initialize physics world
    const world = new CANNON.World();
    world.gravity.set(0, -9.82, 0);
    console.log("Physics world initialized");

    const levelsManager = new LevelsManager(scene, world);
    levelsManager.loadLevel('/api/universe');
    console.log("Levels manager initialized and universe loaded");

    function animate() {
        requestAnimationFrame(animate);
        world.step(1 / 60);
        levelsManager.animate();
        controlsManager.updateCamera();
        renderer.render(scene, camera);
        console.log("Rendering frame");
    }

    animate();
});
