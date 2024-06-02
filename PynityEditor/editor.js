document.addEventListener('DOMContentLoaded', () => {
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
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // Initialize physics world
    const world = new CANNON.World();
    world.gravity.set(0, -9.82, 0);

    const objects = [];

    // Load level data (example)
    const levelData = {
        "objects": [
            {
                "type": "cube",
                "name": "Cube1",
                "position": [1, 1, 1],
                "size": [1, 1, 1],
                "color": [1, 0, 0],
                "mass": 1
            },
            {
                "type": "cube",
                "name": "Cube2",
                "position": [-1, -1, -1],
                "size": [1, 1, 1],
                "color": [0, 1, 0],
                "mass": 1
            }
        ]
    };

    levelData.objects.forEach(obj => {
        let geometry, material, mesh, shape, body;
        if (obj.type === 'cube') {
            geometry = new THREE.BoxGeometry(obj.size[0], obj.size[1], obj.size[2]);
            shape = new CANNON.Box(new CANNON.Vec3(obj.size[0] / 2, obj.size[1] / 2, obj.size[2] / 2));
            material = new THREE.MeshBasicMaterial({ color: new THREE.Color(...obj.color) });
            mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(...obj.position);

            body = new CANNON.Body({ mass: obj.mass, shape });
            body.position.set(...obj.position);
            world.addBody(body);

            objects.push({ mesh, body });
            scene.add(mesh);
        }
    });

    function animate() {
        requestAnimationFrame(animate);
        world.step(1 / 60);
        objects.forEach(obj => {
            obj.mesh.position.copy(obj.body.position);
            obj.mesh.quaternion.copy(obj.body.quaternion);
        });
        renderer.render(scene, camera);
    }

    animate();
});
