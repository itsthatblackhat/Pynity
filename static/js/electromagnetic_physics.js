class ElectromagneticPhysics {
    constructor(world, objects) {
        this.world = world;
        this.objects = objects;
    }

    apply() {
        const k = 8.9875517873681764e9; // Coulomb's constant
        for (let i = 0; i < this.objects.length; i++) {
            const obj1 = this.objects[i];
            for (let j = i + 1; j < this.objects.length; j++) {
                const obj2 = this.objects[j];
                const force = this.calculateElectromagneticForce(obj1, obj2);
                obj1.body.applyForce(force.clone().negate(), obj1.body.position);
                obj2.body.applyForce(force, obj2.body.position);
            }
        }
    }

    calculateElectromagneticForce(obj1, obj2) {
        if (!obj1.charge || !obj2.charge) return new CANNON.Vec3(0, 0, 0);
        const distanceVector = new CANNON.Vec3().copy(obj2.body.position).vsub(obj1.body.position);
        const distance = distanceVector.length();
        if (distance === 0) return new CANNON.Vec3(0, 0, 0); // Avoid division by zero
        const forceMagnitude = (k * obj1.charge * obj2.charge) / (distance * distance);
        return distanceVector.scale(forceMagnitude / distance);
    }
}
