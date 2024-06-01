import GameObjects from './game_objects.js';

class LevelsManager {
    constructor(scene, world) {
        this.scene = scene;
        this.world = world;
        this.objects = []; // Store references to the created objects
    }

    loadLevel(apiUrl) {
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                data.objects.forEach(obj => {
                    const createdObject = GameObjects.createObject(this.scene, this.world, obj);
                    if (createdObject.body) {
                        this.objects.push(createdObject);
                    }
                });
            });
    }

    animate() {
        // Update the Three.js mesh positions based on the Cannon.js body positions
        this.objects.forEach(obj => {
            obj.mesh.position.copy(obj.body.position);
            obj.mesh.quaternion.copy(obj.body.quaternion);
        });
    }
}

export default LevelsManager;
