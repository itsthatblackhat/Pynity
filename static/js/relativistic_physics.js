class RelativisticPhysics {
    constructor(world, objects) {
        this.world = world;
        this.objects = objects;
        this.c = 299792458; // Speed of light in meters per second
    }

    apply() {
        this.objects.forEach(obj => {
            const speed = obj.body.velocity.length();
            const gamma = 1 / Math.sqrt(1 - (speed * speed) / (this.c * this.c)); // Lorentz factor
            obj.body.timeScale = gamma; // Adjust time scale based on Lorentz factor
        });
    }
}
