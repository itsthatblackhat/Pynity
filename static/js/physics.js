class Physics {
    constructor(world, objects) {
        this.world = world;
        this.objects = objects;
    }

    applyForces() {
        const G = 6.67430e-11; // Gravitational constant
        for (let i = 0; i < this.objects.length; i++) {
            const obj1 = this.objects[i];
            for (let j = i + 1; j < this.objects.length; j++) {
                const obj2 = this.objects[j];
                const force = this.calculateGravitationalForce(obj1, obj2);
                obj1.body.applyForce(force.clone().negate(), obj1.body.position);
                obj2.body.applyForce(force, obj2.body.position);
            }
        }
    }

    calculateGravitationalForce(obj1, obj2) {
        const distanceVector = new CANNON.Vec3().copy(obj2.body.position).vsub(obj1.body.position);
        const distance = distanceVector.length();
        if (distance === 0) return new CANNON.Vec3(0, 0, 0); // Avoid division by zero
        const forceMagnitude = (G * obj1.mass * obj2.mass) / (distance * distance);
        return distanceVector.scale(forceMagnitude / distance);
    }

    update(dt) {
        this.applyForces();
        this.world.step(dt);
        this.objects.forEach(obj => {
            obj.mesh.position.copy(obj.body.position);
            obj.mesh.quaternion.copy(obj.body.quaternion);
        });
    }
}
