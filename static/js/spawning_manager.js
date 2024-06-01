class SpawningManager {
    constructor(levelsManager, playerManager) {
        this.levelsManager = levelsManager;
        this.playerManager = playerManager;
    }

    spawnPlayer(position) {
        this.playerManager.camera.position.set(...position);
        console.log("Player spawned at position:", position);
    }

    spawnObjects(objects) {
        objects.forEach(obj => {
            this.levelsManager.addObjectToScene(obj);
        });
        console.log("Objects spawned.");
    }
}

export default SpawningManager;
