import * as THREE from './three.module.js';
import { TransformControls } from './TransformControls.js';

export class EditorLevelsManager {
    constructor(scene, camera, renderer) {
        this.scene = scene;
        this.transformControls = new TransformControls(camera, renderer.domElement);
        this.camera = camera;
        this.renderer = renderer;
        this.objects = [];
        this.editMode = false;

        this.scene.add(this.transformControls);
        this.renderer.domElement.addEventListener('click', (event) => this.onObjectClick(event), false);
    }

    onObjectClick(event) {
        if (!this.editMode || !event.ctrlKey) return;

        const rect = this.renderer.domElement.getBoundingClientRect();
        const mouse = new THREE.Vector2(
            ((event.clientX - rect.left) / rect.width) * 2 - 1,
            -((event.clientY - rect.top) / rect.height) * 2 + 1
        );

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, this.camera);

        const intersects = raycaster.intersectObjects(this.objects, true).filter(obj => obj.object && obj.object.layers);

        if (intersects.length > 0) {
            const object = intersects[0].object;
            if (this.transformControls.object === object) {
                this.transformControls.detach();
            } else {
                this.transformControls.attach(object);
            }
        }
    }

    addObject(obj) {
        let geometry, material, mesh;
        if (obj.type === 'cube') {
            geometry = new THREE.BoxGeometry(obj.size[0], obj.size[1], obj.size[2]);
            material = new THREE.MeshBasicMaterial({ color: new THREE.Color(...obj.color) });
            mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(...obj.position);
            mesh.layers.enableAll();
            this.scene.add(mesh);
        } else if (obj.type === 'sphere') {
            geometry = new THREE.SphereGeometry(obj.size[0], 32, 32);
            material = new THREE.MeshBasicMaterial({ color: new THREE.Color(...obj.color) });
            mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(...obj.position);
            mesh.layers.enableAll();
            this.scene.add(mesh);
        }
        this.objects.push(mesh);
    }

    loadLevelData(levelData) {
        levelData.objects.forEach(obj => this.addObject(obj));
    }

    toggleEditMode() {
        this.editMode = !this.editMode;
    }
}
