class EditorLevelsManager {
    constructor(scene) {
        this.scene = scene;
    }

    loadLevel(url) {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                this.createScene(data);
            })
            .catch(error => {
                console.error('Error loading level:', error);
            });
    }

    createScene(data) {
        data.objects.forEach(obj => {
            let geometry, material, mesh;
            if (obj.type === 'cube') {
                geometry = new THREE.BoxGeometry(obj.size[0], obj.size[1], obj.size[2]);
                material = new THREE.MeshBasicMaterial({ color: new THREE.Color(...obj.color) });
                mesh = new THREE.Mesh(geometry, material);
                mesh.position.set(...obj.position);
                this.scene.add(mesh);
            } else if (obj.type === 'sphere') {
                geometry = new THREE.SphereGeometry(obj.size[0], 32, 32);
                material = new THREE.MeshBasicMaterial({ color: new THREE.Color(...obj.color) });
                mesh = new THREE.Mesh(geometry, material);
                mesh.position.set(...obj.position);
                this.scene.add(mesh);
            }
        });
    }
}
