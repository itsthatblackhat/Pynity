class LevelsManager {
    constructor(scene, world) {
        this.scene = scene;
        this.world = world;
        this.objects = [];
    }

    loadLevel(url) {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                data.objects.forEach(obj => {
                    this.addObjectToScene(obj);
                });
                console.log("Level loaded successfully");
            })
            .catch(error => {
                console.error('Error loading level:', error);
            });
    }

    addObjectToScene(obj) {
        let geometry, material, mesh, shape, body;

        if (obj.type === 'cube') {
            geometry = new THREE.BoxGeometry(obj.size[0], obj.size[1], obj.size[2]);
            shape = new CANNON.Box(new CANNON.Vec3(obj.size[0] / 2, obj.size[1] / 2, obj.size[2] / 2));
            material = new THREE.MeshBasicMaterial({ color: new THREE.Color(...obj.color) });
        } else if (obj.type === 'sphere') {
            geometry = new THREE.SphereGeometry(obj.size[0], 32, 32);
            shape = new CANNON.Sphere(obj.size[0]);
            material = new THREE.MeshBasicMaterial({ color: new THREE.Color(...obj.color) });
        } else {
            console.warn(`Unknown object type: ${obj.type}`);
            return;
        }

        mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(...obj.position);
        console.log(`Mesh created for ${obj.type} at position:`, mesh.position);

        body = new CANNON.Body({ mass: obj.mass || 1, shape });
        body.position.set(...obj.position);
        this.world.addBody(body);
        console.log(`Body created for ${obj.type} at position:`, body.position);

        this.objects.push({ mesh, body });
        this.scene.add(mesh);
        console.log(`Object ${obj.name} added to scene`);
    }

    animate() {
        this.objects.forEach(obj => {
            obj.mesh.position.copy(obj.body.position);
            obj.mesh.quaternion.copy(obj.body.quaternion);
        });
    }
}
