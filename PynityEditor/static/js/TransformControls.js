import * as THREE from './three.module.js';

class TransformControls extends THREE.Object3D {
    constructor(camera, domElement) {
        super();

        if (domElement === undefined) console.warn('THREE.TransformControls: The second parameter "domElement" is now mandatory.');

        this.domElement = domElement || document;
        this.camera = camera;

        this.visible = false;

        this.gizmo = new TransformControlsGizmo();
        this.add(this.gizmo);

        this.plane = new TransformControlsPlane();
        this.add(this.plane);

        this.enabled = true;
        this.axis = null;
        this.mode = 'translate';
        this.translationSnap = null;
        this.rotationSnap = null;
        this.space = 'world';
        this.size = 1;
        this.dragging = false;
        this.showX = true;
        this.showY = true;
        this.showZ = true;

        this.changeEvent = { type: 'change' };
        this.mouseDownEvent = { type: 'mouseDown' };
        this.mouseUpEvent = { type: 'mouseUp', mode: this.mode };
        this.objectChangeEvent = { type: 'objectChange' };

        // Attach dom events
        this.domElement.addEventListener('mousedown', this.onPointerDown.bind(this), false);
        this.domElement.addEventListener('touchstart', this.onPointerDown.bind(this), false);

        this.domElement.addEventListener('mousemove', this.onPointerHover.bind(this), false);
        this.domElement.addEventListener('touchmove', this.onPointerHover.bind(this), false);

        this.domElement.addEventListener('mousemove', this.onPointerMove.bind(this), false);
        this.domElement.addEventListener('touchmove', this.onPointerMove.bind(this), false);

        this.domElement.addEventListener('mouseup', this.onPointerUp.bind(this), false);
        this.domElement.addEventListener('mouseout', this.onPointerUp.bind(this), false);
        this.domElement.addEventListener('touchend', this.onPointerUp.bind(this), false);
        this.domElement.addEventListener('touchcancel', this.onPointerUp.bind(this), false);
        this.domElement.addEventListener('touchleave', this.onPointerUp.bind(this), false);
    }

    onPointerHover(event) {
        if (this.object === undefined || this.dragging === true) return;

        var pointer = event.changedTouches ? event.changedTouches[0] : event;

        var rect = this.domElement.getBoundingClientRect();
        var x = (pointer.clientX - rect.left) / rect.width * 2 - 1;
        var y = - (pointer.clientY - rect.top) / rect.height * 2 + 1;

        var mouse = new THREE.Vector2(x, y);
        var raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, this.camera);

        var intersects = raycaster.intersectObjects(this.children, true);

        if (intersects.length > 0) {
            var intersection = intersects[0];
            this.axis = intersection.object.name;
        } else {
            this.axis = null;
        }
    }

    onPointerDown(event) {
        if (this.object === undefined || this.dragging === true || event.button !== 0) return;

        var pointer = event.changedTouches ? event.changedTouches[0] : event;

        var rect = this.domElement.getBoundingClientRect();
        var x = (pointer.clientX - rect.left) / rect.width * 2 - 1;
        var y = - (pointer.clientY - rect.top) / rect.height * 2 + 1;

        var mouse = new THREE.Vector2(x, y);
        var raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, this.camera);

        var intersects = raycaster.intersectObjects(this.children, true);

        if (intersects.length > 0) {
            var intersection = intersects[0];
            this.axis = intersection.object.name;
            this.dispatchEvent(this.mouseDownEvent);
        }
    }

    onPointerMove(event) {
        if (this.object === undefined || this.dragging === false || this.axis === null) return;

        var pointer = event.changedTouches ? event.changedTouches[0] : event;

        var rect = this.domElement.getBoundingClientRect();
        var x = (pointer.clientX - rect.left) / rect.width * 2 - 1;
        var y = - (pointer.clientY - rect.top) / rect.height * 2 + 1;

        var mouse = new THREE.Vector2(x, y);
        var raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, this.camera);

        var intersects = raycaster.intersectObjects([this.plane], true);

        if (intersects.length > 0) {
            var intersection = intersects[0];
            var newPosition = intersection.point;
            this.object.position.copy(newPosition);
            this.dispatchEvent(this.changeEvent);
        }
    }

    onPointerUp(event) {
        if (this.object === undefined || this.dragging === false || this.axis === null) return;

        this.dispatchEvent(this.mouseUpEvent);
        this.axis = null;
    }
}

class TransformControlsGizmo extends THREE.Object3D {
    constructor() {
        super();
        // Implement the gizmo creation logic here
    }
}

class TransformControlsPlane extends THREE.Object3D {
    constructor() {
        super();
        // Implement the plane creation logic here
    }
}

export { TransformControls };
