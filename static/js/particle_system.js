class ParticleSystem {
    constructor(scene, physicsWorld) {
        this.scene = scene;
        this.physicsWorld = physicsWorld;
        this.particles = this.createParticles(100);
    }

    createParticles(count) {
        const particles = [];
        for (let i = 0; i < count; i++) {
            const particle = this.createParticle();
            particles.push(particle);
            this.scene.add(particle.mesh);
            this.physicsWorld.addBody(particle.body);
        }
        return particles;
    }

    createParticle() {
        const geometry = new THREE.SphereGeometry(0.05, 16, 16);
        const material = new THREE.MeshBasicMaterial({ color: new THREE.Color(Math.random(), Math.random(), Math.random()) });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(Math.random() * 10 - 5, Math.random() * 10 - 5, Math.random() * 10 - 5);

        const shape = new CANNON.Sphere(0.05);
        const body = new CANNON.Body({ mass: 0.01, shape });
        body.position.set(mesh.position.x, mesh.position.y, mesh.position.z);
        body.velocity.set(Math.random() * 0.2 - 0.1, Math.random() * 0.2 - 0.1, Math.random() * 0.2 - 0.1);

        return { mesh, body };
    }

    update() {
        this.particles.forEach(particle => {
            particle.mesh.position.copy(particle.body.position);
            particle.mesh.quaternion.copy(particle.body.quaternion);
        });
    }
}
