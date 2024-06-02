// editor_combined_manager.js

export class EditorCameraManager {
    constructor(fov, aspect, near, far, initialPosition) {
        this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        this.camera.position.set(...initialPosition);
        this.camera.lookAt(0, 0, 0); // Ensure the camera is looking at the center
        console.log("Camera initialized at position:", this.camera.position);
    }

    getCamera() {
        return this.camera;
    }
}

export class EditorControlsManager {
    constructor(camera) {
        this.camera = camera;
        this.keys = {
            w: false,
            s: false,
            a: false,
            d: false,
            space: false,
            c: false,
            q: false,
            e: false
        };
        this.mouseDown = false;
        this.mouseX = 0;
        this.mouseY = 0;
        this.pitch = 0;
        this.yaw = 0;
        this.initEventListeners();
    }

    initEventListeners() {
        document.addEventListener('keydown', (event) => {
            if (event.key.toLowerCase() in this.keys) {
                this.keys[event.key.toLowerCase()] = true;
            }
        });

        document.addEventListener('keyup', (event) => {
            if (event.key.toLowerCase() in this.keys) {
                this.keys[event.key.toLowerCase()] = false;
            }
        });

        document.addEventListener('mousedown', (event) => {
            this.mouseDown = true;
            this.mouseX = event.clientX;
            this.mouseY = event.clientY;
        });

        document.addEventListener('mouseup', () => {
            this.mouseDown = false;
        });

        document.addEventListener('mousemove', (event) => {
            if (this.mouseDown) {
                const deltaX = event.clientX - this.mouseX;
                const deltaY = event.clientY - this.mouseY;
                this.mouseX = event.clientX;
                this.mouseY = event.clientY;

                this.yaw -= deltaX * 0.002;
                this.pitch -= deltaY * 0.002;

                // Clamp the pitch value to avoid flipping
                this.pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.pitch));
            }
        });
    }

    updateCamera() {
        if (!this.camera || !this.camera.position) {
            console.error('Camera or camera position is undefined');
            return;
        }

        this.camera.rotation.order = 'YXZ'; // Order of rotations: yaw (Y), pitch (X), roll (Z)
        this.camera.rotation.set(this.pitch, this.yaw, 0);
    }
}

export class EditorLevelsManager {
    constructor(scene) {
        this.scene = scene;
    }

    loadLevelData(levelData) {
        levelData.objects.forEach(obj => {
            let geometry, material, mesh;
            if (obj.type === 'cube') {
                geometry = new THREE.BoxGeometry(obj.size[0], obj.size[1], obj.size[2]);
                material = new THREE.MeshBasicMaterial({ color: new THREE.Color(...obj.color) });
                mesh = new THREE.Mesh(geometry, material);
                mesh.position.set(...obj.position);
                this.scene.add(mesh);
                console.log(`Added cube at position: ${mesh.position}`);
            } else if (obj.type === 'sphere') {
                geometry = new THREE.SphereGeometry(obj.size[0], 32, 32);
                material = new THREE.MeshBasicMaterial({ color: new THREE.Color(...obj.color) });
                mesh = new THREE.Mesh(geometry, material);
                mesh.position.set(...obj.position);
                this.scene.add(mesh);
                console.log(`Added sphere at position: ${mesh.position}`);
            }
            console.log(`Added ${obj.type} named ${obj.name}`);
        });
    }

    animate() {
        // Placeholder for any animation logic if necessary
    }
}
