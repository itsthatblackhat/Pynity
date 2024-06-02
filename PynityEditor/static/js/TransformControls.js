import * as THREE from './three.module.js';

class TransformControls extends THREE.Object3D {
    constructor(camera, domElement) {
        super();

        this.camera = camera;
        this.domElement = domElement;

        this.gizmo = new TransformControlsGizmo();
        this.add(this.gizmo);

        this.plane = new TransformControlsPlane();
        this.add(this.plane);

        this.visible = false;
        this.object = null;
        this.enabled = true;
        this.axis = null;
        this.mode = 'translate';
        this.size = 1;
        this.space = 'world';
        this.dragging = false;
        this.showX = true;
        this.showY = true;
        this.showZ = true;

        this.changeEvent = { type: 'change' };
        this.mouseDownEvent = { type: 'mouseDown' };
        this.mouseUpEvent = { type: 'mouseUp', mode: this.mode };
        this.objectChangeEvent = { type: 'objectChange' };

        this.domElement.addEventListener('mousedown', this.onPointerDown.bind(this), false);
        this.domElement.addEventListener('mousemove', this.onPointerHover.bind(this), false);
        this.domElement.addEventListener('mousemove', this.onPointerMove.bind(this), false);
        this.domElement.addEventListener('mouseup', this.onPointerUp.bind(this), false);
    }

    attach(object) {
        this.object = object;
        this.visible = true;
        this.dispatchEvent({ type: 'change' });
    }

    detach() {
        this.object = null;
        this.visible = false;
        this.dispatchEvent({ type: 'change' });
    }

    updateMatrixWorld(force) {
        if (this.object) {
            this.object.updateMatrixWorld();
        }
        super.updateMatrixWorld(force);
    }

    onPointerHover(event) {
        if (!this.enabled || this.dragging) return;

        const pointer = event.changedTouches ? event.changedTouches[0] : event;
        const rect = this.domElement.getBoundingClientRect();
        const x = (pointer.clientX - rect.left) / rect.width * 2 - 1;
        const y = - (pointer.clientY - rect.top) / rect.height * 2 + 1;
        const mouse = new THREE.Vector2(x, y);
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, this.camera);

        const intersects = raycaster.intersectObjects(this.children, true);

        if (intersects.length > 0) {
            const intersection = intersects[0];
            this.axis = intersection.object.name;
        } else {
            this.axis = null;
        }
    }

    onPointerDown(event) {
        if (!this.enabled || this.dragging || event.button !== 0) return;

        const pointer = event.changedTouches ? event.changedTouches[0] : event;
        const rect = this.domElement.getBoundingClientRect();
        const x = (pointer.clientX - rect.left) / rect.width * 2 - 1;
        const y = - (pointer.clientY - rect.top) / rect.height * 2 + 1;
        const mouse = new THREE.Vector2(x, y);
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, this.camera);

        const intersects = raycaster.intersectObjects(this.children, true);

        if (intersects.length > 0) {
            const intersection = intersects[0];
            this.axis = intersection.object.name;
            this.dispatchEvent(this.mouseDownEvent);
        }
    }

    onPointerMove(event) {
        if (!this.enabled || !this.dragging || !this.axis) return;

        const pointer = event.changedTouches ? event.changedTouches[0] : event;
        const rect = this.domElement.getBoundingClientRect();
        const x = (pointer.clientX - rect.left) / rect.width * 2 - 1;
        const y = - (pointer.clientY - rect.top) / rect.height * 2 + 1;
        const mouse = new THREE.Vector2(x, y);
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, this.camera);

        const intersects = raycaster.intersectObjects([this.plane], true);

        if (intersects.length > 0) {
            const intersection = intersects[0];
            const newPosition = intersection.point;
            this.object.position.copy(newPosition);
            this.dispatchEvent(this.changeEvent);
        }
    }

    onPointerUp(event) {
        if (!this.enabled || !this.dragging || !this.axis) return;

        this.dispatchEvent(this.mouseUpEvent);
        this.axis = null;
    }
}

class TransformControlsGizmo extends THREE.Object3D {
    constructor() {
        super();

        const gizmoMaterial = new THREE.MeshBasicMaterial({
            depthTest: false,
            depthWrite: false,
            transparent: true,
            side: THREE.DoubleSide
        });

        const arrowGeometry = new THREE.CylinderGeometry(0, 0.05, 0.2, 12);
        const lineGeometry = new THREE.BufferGeometry();
        lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute([0, 0, 0, 0, 1, 0], 3));

        this.handleGizmos = {
            X: [
                [new THREE.Mesh(arrowGeometry, gizmoMaterial.clone()), [0.5, 0, 0], [0, 0, - Math.PI / 2]],
                [new THREE.Line(lineGeometry, gizmoMaterial.clone())],
            ],
            Y: [
                [new THREE.Mesh(arrowGeometry, gizmoMaterial.clone()), [0, 0.5, 0]],
                [new THREE.Line(lineGeometry, gizmoMaterial.clone()), [0, 0, Math.PI / 2]]
            ],
            Z: [
                [new THREE.Mesh(arrowGeometry, gizmoMaterial.clone()), [0, 0, 0.5], [Math.PI / 2, 0, 0]],
                [new THREE.Line(lineGeometry, gizmoMaterial.clone())],
            ]
        };

        // Set colors after cloning material
        this.handleGizmos.X[0][0].material.color.set(0xff0000);
        this.handleGizmos.X[1][0].material.color.set(0xff0000);
        this.handleGizmos.Y[0][0].material.color.set(0x00ff00);
        this.handleGizmos.Y[1][0].material.color.set(0x00ff00);
        this.handleGizmos.Z[0][0].material.color.set(0x0000ff);
        this.handleGizmos.Z[1][0].material.color.set(0x0000ff);

        this.setupGizmos(this.handleGizmos);
    }

    setupGizmos(gizmos) {
        for (const name in gizmos) {
            const gizmo = gizmos[name];
            for (let i = 0; i < gizmo.length; i++) {
                const object = gizmo[i][0];
                const position = gizmo[i][1];
                const rotation = gizmo[i][2];
                object.name = name;
                if (position) {
                    object.position.set(position[0], position[1], position[2]);
                }
                if (rotation) {
                    object.rotation.set(rotation[0], rotation[1], rotation[2]);
                }
                this.add(object);
            }
        }
    }
}

class TransformControlsPlane extends THREE.Mesh {
    constructor() {
        super(new THREE.PlaneGeometry(100, 100, 2, 2), new THREE.MeshBasicMaterial({
            visible: false,
            wireframe: true,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.1,
            color: 0xffff00
        }));
        this.name = 'TransformControlsPlane';
    }
}

export { TransformControls };
