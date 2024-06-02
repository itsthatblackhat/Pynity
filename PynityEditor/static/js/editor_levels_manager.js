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

        try {
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

            if (mesh) {
                mesh.position.set(...obj.position);
                this.scene.add(mesh);
                console.log(`Added ${obj.type} at position: ${mesh.position.x}, ${mesh.position.y}, ${mesh.position.z}`);

                if (!mesh.layers) {
                    mesh.layers = new THREE.Layers();
                    console.log('Layers property added:', mesh.layers);
                }

                mesh.layers.enableAll();
                this.objects.push(mesh);
                console.log('Layers property:', mesh.layers);
            } else {
                console.error('Failed to create mesh for object:', obj);
            }
        } catch (error) {
            console.error('Error in addObject method:', error);
        }
    }

    loadLevelData(levelData) {
        try {
            if (Array.isArray(levelData.objects)) {
                levelData.objects.forEach(obj => {
                    console.log('Loading object:', obj);
                    this.addObject(obj);
                });
            } else {
                console.error('Level data is not in expected format:', levelData);
            }
        } catch (error) {
            console.error('Error in loadLevelData method:', error);
        }
    }

    toggleEditMode() {
        this.editMode = !this.editMode;
        console.log(`Edit mode: ${this.editMode}`);
    }
}
