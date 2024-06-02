import * as THREE from './three.module.js';
import { TransformControls } from './TransformControls.js';

export class EditorCameraManager {
    constructor(fov, aspect, near, far, initialPosition) {
        this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        this.camera.position.set(...initialPosition);
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
    constructor(scene, camera, renderer) {
        this.scene = scene;
        this.transformControls = null;
        this.camera = camera;
        this.renderer = renderer;
        this.objects = [];
        this.editMode = false;

        this.initTransformControls();
        this.scene.add(this.transformControls);
        this.renderer.domElement.addEventListener('click', (event) => this.onObjectClick(event), false);
    }

    initTransformControls() {
        this.transformControls = new TransformControls(this.camera, this.renderer.domElement);
        this.transformControls.addEventListener('change', () => {
            if (this.transformControls.object) {
                const position = this.transformControls.object.position;
                console.log(`Object moved to position: ${position.x}, ${position.y}, ${position.z}`);
                this.updateObjectPosition(this.transformControls.object);
            }
        });
    }

    updateObjectPosition(object) {
        const obj = this.objects.find(o => o === object);
        if (obj) {
            obj.position.set(object.position.x, object.position.y, object.position.z);
            console.log(`Updated object position: ${obj.position.x}, ${obj.position.y}, ${obj.position.z}`);
        }
    }

    onObjectClick(event) {
        if (!this.editMode) return;
        const rect = this.renderer.domElement.getBoundingClientRect();
        const mouse = new THREE.Vector2(
            ((event.clientX - rect.left) / rect.width) * 2 - 1,
            -((event.clientY - rect.top) / rect.height) * 2 + 1
        );

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, this.camera);

        console.log('Mouse position:', mouse);

        const intersects = raycaster.intersectObjects(this.objects, true).filter(obj => obj.object && obj.object.layers);

        console.log('Intersects:', intersects);

        if (intersects.length > 0) {
            const object = intersects[0].object;
            console.log('Object clicked:', object);
            console.log('Object properties:', object);
            console.log('Object layers:', object.layers);
            this.transformControls.attach(object);
        } else {
            console.log('No objects intersected');
        }
    }

    addObject(obj) {
        let geometry, material, mesh;
        if (obj.type === 'cube') {
            geometry = new THREE.BoxGeometry(obj.size[0], obj.size[1], obj.size[2]);
            material = new THREE.MeshBasicMaterial({ color: new THREE.Color(...obj.color) });
            mesh = new THREE.Mesh(geometry, material);
        } else if (obj.type === 'sphere') {
            geometry = new THREE.SphereGeometry(obj.size[0], 32, 32);
            material = new THREE.MeshBasicMaterial({ color: new THREE.Color(...obj.color) });
            mesh = new THREE.Mesh(geometry, material);
        } else if (obj.type === 'ground') {
            geometry = new THREE.BoxGeometry(obj.size[0], obj.size[1], obj.size[2]);
            material = new THREE.MeshBasicMaterial({ color: new THREE.Color(...obj.color) });
            mesh = new THREE.Mesh(geometry, material);
        } else {
            console.error('Unsupported object type:', obj.type);
            return;
        }

        mesh.position.set(...obj.position);
        mesh.layers.enableAll(); // Enable all layers for raycasting
        this.scene.add(mesh);
        console.log(`Added ${obj.type} at position: ${mesh.position.x}, ${mesh.position.y}, ${mesh.position.z}`);

        if (!mesh.layers) {
            mesh.layers = new THREE.Layers();
            console.log('Layers property added:', mesh.layers);
        }

        mesh.layers.enableAll();
        this.objects.push(mesh);
        console.log('Layers property:', mesh.layers);
    }

    loadLevelData(levelData) {
        levelData.objects.forEach(obj => this.addObject(obj));
    }

    toggleEditMode() {
        this.editMode = !this.editMode;
        console.log(`Edit mode: ${this.editMode}`);
    }
}
