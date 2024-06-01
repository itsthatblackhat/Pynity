import GameObjects from './game_objects.js';

class LevelsManager {
    constructor(scene, world) {
        this.scene = scene;
        this.world = world;
        this.objects = [];
        console.log("LevelsManager constructor completed");
    }

    loadLevel(url) {
        console.log(`Loading level from URL: ${url}`);
        fetch(url)
            .then(response => {
                console.log("Fetch response received");
                return response.json();
            })
            .then(data => {
                console.log("Data loaded from URL:", data);
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
        console.log(`Adding object to scene: ${obj.name}`);
        if (!GameObjects[obj.type]) {
            console.warn(`Unknown object type: ${obj.type}`);
            return;
        }

        const { geometry, shape, material } = GameObjects[obj.type].create(obj);
        console.log(`Creating object: ${obj.name} of type: ${obj.type}`);

        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(...obj.position);
        console.log(`Mesh created for ${obj.type} at position:`, mesh.position);

        const body = new CANNON.Body({ mass: obj.mass || 1, shape });
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

export default LevelsManager;
