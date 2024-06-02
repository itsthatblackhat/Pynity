import * as THREE from './three.module.js';
import { TransformControls } from './TransformControls.js';

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

        // Filter objects to only those with 'layers' property
        const objectsWithLayers = this.objects.filter(obj => obj.layers);
        const intersects = raycaster.intersectObjects(objectsWithLayers);

        if (intersects.length > 0) {
            const object = intersects[0].object;
            this.transformControls.attach(object);
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
        }

        if (mesh) {
            mesh.position.set(...obj.position);
            this.scene.add(mesh);
            this.objects.push(mesh);
            console.log(`Added ${obj.type} at position: ${mesh.position.x}, ${mesh.position.y}, ${mesh.position.z}`);
        }
    }

    loadLevelData(levelData) {
        levelData.objects.forEach(obj => this.addObject(obj));
    }

    toggleEditMode() {
        this.editMode = !this.editMode;
        console.log(`Edit mode: ${this.editMode}`);
    }
}
