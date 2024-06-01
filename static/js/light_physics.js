class LightPhysics {
    constructor(world, objects) {
        this.world = world;
        this.objects = objects;
    }

    apply() {
        const lights = this.objects.filter(obj => obj.type === 'light' || obj.brightness);
        const illuminatedObjects = this.objects.filter(obj => obj.type !== 'light' && !obj.brightness);

        lights.forEach(light => {
            illuminatedObjects.forEach(obj => {
                const distance = light.body.position.distanceTo(obj.body.position);
                const intensity = light.brightness / (distance * distance); // Inverse square law for light attenuation
                obj.mesh.material.emissiveIntensity = intensity;
            });
        });
    }
}
