class GameObjects {
    static createObject(scene, world, obj) {
        let geometry, material, mesh, shape, body;

        if (obj.type === 'cube') {
            geometry = new THREE.BoxGeometry(obj.size[0], obj.size[1], obj.size[2]);
            shape = new CANNON.Box(new CANNON.Vec3(obj.size[0] / 2, obj.size[1] / 2, obj.size[2] / 2));
        } else if (obj.type === 'sphere') {
            geometry = new THREE.SphereGeometry(obj.size[0], 32, 32);
            shape = new CANNON.Sphere(obj.size[0]);
        } else if (obj.type === 'ground') {
            geometry = new THREE.BoxGeometry(obj.size[0], obj.size[1], obj.size[2]);
            shape = new CANNON.Box(new CANNON.Vec3(obj.size[0] / 2, obj.size[1] / 2, obj.size[2] / 2));
        }

        material = new THREE.MeshBasicMaterial({ color: new THREE.Color(...obj.color) });
        mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(...obj.position);
        scene.add(mesh);

        if (obj.collision !== false) {
            body = new CANNON.Body({ mass: obj.mass, shape });
            body.position.set(...obj.position);

            if (obj.fixed) {
                body.mass = 0; // Make the body static by setting its mass to 0
                body.updateMassProperties(); // Ensure the mass properties are updated
                body.type = CANNON.Body.STATIC; // Explicitly set the body type to STATIC
            }

            world.addBody(body);
            mesh.userData.physicsBody = body; // Link the Three.js mesh to the Cannon.js body
        }

        return { mesh, body };
    }
}

export default GameObjects;
