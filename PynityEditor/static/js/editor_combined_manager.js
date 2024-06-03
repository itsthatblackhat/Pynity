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

        const direction = new THREE.Vector3();
        const right = new THREE.Vector3();
        const up = new THREE.Vector3(0, 1, 0);

        this.camera.getWorldDirection(direction);
        right.crossVectors(up, direction).normalize();

        if (this.keys.w) {
            this.camera.position.addScaledVector(direction, 0.1);
        }
        if (this.keys.s) {
            this.camera.position.addScaledVector(direction, -0.1);
        }
        if (this.keys.a) {
            this.camera.position.addScaledVector(right, 0.1);
        }
        if (this.keys.d) {
            this.camera.position.addScaledVector(right, -0.1);
        }
        if (this.keys.space) {
            this.camera.position.y += 0.1;
        }
        if (this.keys.c) {
            this.camera.position.y -= 0.1;
        }
        if (this.keys.q) {
            this.camera.rotation.y += 0.02;
        }
        if (this.keys.e) {
            this.camera.rotation.y -= 0.02;
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

        // PIXI.Application is now available globally
        this.pixiApp = new PIXI.Application({
            width: renderer.domElement.clientWidth,
            height: renderer.domElement.clientHeight,
            backgroundColor: 0x1099bb,
            resolution: window.devicePixelRatio || 1,
        });

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
        if (!this.editMode || !event.ctrlKey) return;

        const rect = this.renderer.domElement.getBoundingClientRect();
        const mouse = new THREE.Vector2(
            ((event.clientX - rect.left) / rect.width) * 2 - 1,
            -((event.clientY - rect.top) / rect.height) * 2 + 1
        );

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, this.camera);

        console.log('Mouse position:', mouse);

        const intersects = raycaster.intersectObjects(this.objects, true);

        console.log('Intersects:', intersects);

        if (intersects.length > 0) {
            const object = intersects[0].object;
            console.log('Object clicked:', object);
            if (this.transformControls.object === object) {
                this.transformControls.detach();
            } else {
                this.transformControls.attach(object);
            }
        } else {
            console.log('No objects intersected');
        }
    }

    addObject(obj) {
        let geometry, material, mesh, pixiSprite;
        if (obj.type === 'cube') {
            geometry = new THREE.BoxGeometry(obj.size[0], obj.size[1], obj.size[2]);
            material = new THREE.MeshBasicMaterial({ color: new THREE.Color(...obj.color) });
            mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(...obj.position);
            this.scene.add(mesh);
            console.log(`Added cube at position: ${mesh.position}`);

            pixiSprite = PIXI.Sprite.from(PIXI.Texture.WHITE);
            pixiSprite.tint = 0xff0000;
            pixiSprite.width = obj.size[0] * 10;
            pixiSprite.height = obj.size[1] * 10;
            pixiSprite.position.set(obj.position[0] * 10, obj.position[1] * 10);
            this.pixiApp.stage.addChild(pixiSprite);
            console.log(`Added cube sprite at position: ${pixiSprite.position}`);
        } else if (obj.type === 'sphere') {
            geometry = new THREE.SphereGeometry(obj.size[0], 32, 32);
            material = new THREE.MeshBasicMaterial({ color: new THREE.Color(...obj.color) });
            mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(...obj.position);
            this.scene.add(mesh);
            console.log(`Added sphere at position: ${mesh.position}`);

            pixiSprite = new PIXI.Graphics();
            pixiSprite.beginFill(0x00ff00);
            pixiSprite.drawCircle(0, 0, obj.size[0] * 10);
            pixiSprite.endFill();
            pixiSprite.position.set(obj.position[0] * 10, obj.position[1] * 10);
            this.pixiApp.stage.addChild(pixiSprite);
            console.log(`Added sphere sprite at position: ${pixiSprite.position}`);
        } else if (obj.type === 'ground') {
            geometry = new THREE.BoxGeometry(obj.size[0], obj.size[1], obj.size[2]);
            material = new THREE.MeshBasicMaterial({ color: new THREE.Color(...obj.color) });
            mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(...obj.position);
            this.scene.add(mesh);
            console.log(`Added ground at position: ${mesh.position}`);
        }

        this.objects.push(mesh);
    }

    loadLevelData(levelData) {
        levelData.objects.forEach(obj => this.addObject(obj));
    }

    toggleEditMode() {
        this.editMode = !this.editMode;
        console.log(`Edit mode: ${this.editMode}`);
    }

    toggleGrid() {
        // Toggle grid logic here
        console.log("Grid toggled");
    }
}
