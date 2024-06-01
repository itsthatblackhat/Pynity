class PhysicsManager {
    constructor(world, objects) {
        this.world = world;
        this.objects = objects;
        this.gravitationalPhysics = new GravitationalPhysics(world, objects);
        this.electromagneticPhysics = new ElectromagneticPhysics(world, objects);
        this.collisionPhysics = new CollisionPhysics(world, objects);
        this.fluidDynamics = new FluidDynamics(world, objects);
        this.thermodynamics = new Thermodynamics(world, objects);
        this.lightPhysics = new LightPhysics(world, objects);
        this.quantumPhysics = new QuantumPhysics(world, objects);
        this.relativisticPhysics = new RelativisticPhysics(world, objects);
    }

    update(dt) {
        this.gravitationalPhysics.apply();
        this.electromagneticPhysics.apply();
        this.collisionPhysics.apply();
        this.fluidDynamics.apply();
        this.thermodynamics.apply();
        this.lightPhysics.apply();
        this.quantumPhysics.apply();
        this.relativisticPhysics.apply();
        this.world.step(dt);
        this.objects.forEach(obj => {
            obj.mesh.position.copy(obj.body.position);
            obj.mesh.quaternion.copy(obj.body.quaternion);
        });
    }
}
