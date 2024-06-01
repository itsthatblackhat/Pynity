const GameObjects = {
    cube: {
        create: (obj) => {
            console.log(`Creating cube: ${obj.name}`);
            const geometry = new THREE.BoxGeometry(obj.size[0], obj.size[1], obj.size[2]);
            const shape = new CANNON.Box(new CANNON.Vec3(obj.size[0] / 2, obj.size[1] / 2, obj.size[2] / 2));
            const material = new THREE.MeshBasicMaterial({ color: new THREE.Color(...obj.color) });
            return { geometry, shape, material };
        }
    },
    sphere: {
        create: (obj) => {
            console.log(`Creating sphere: ${obj.name}`);
            const geometry = new THREE.SphereGeometry(obj.size[0], 32, 32);
            const shape = new CANNON.Sphere(obj.size[0]);
            const material = new THREE.MeshBasicMaterial({ color: new THREE.Color(...obj.color) });
            return { geometry, shape, material };
        }
    },
    ground: {
        create: (obj) => {
            console.log(`Creating ground: ${obj.name}`);
            const geometry = new THREE.BoxGeometry(obj.size[0], obj.size[1], obj.size[2]);
            const shape = new CANNON.Box(new CANNON.Vec3(obj.size[0] / 2, obj.size[1] / 2, obj.size[2] / 2));
            const material = new THREE.MeshBasicMaterial({ color: new THREE.Color(...obj.color) });
            return { geometry, shape, material };
        }
    },
    // Add more object types as needed
};

export default GameObjects;
