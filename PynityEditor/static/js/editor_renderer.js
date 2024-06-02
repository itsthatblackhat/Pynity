document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded and parsed");

    const canvas = document.getElementById('gameCanvas');
    console.log("Canvas element:", canvas);

    const renderer = new THREE.WebGLRenderer({ canvas });
    resizeRendererToDisplaySize(renderer);

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    camera.position.z = 5;

    const objects = [];

    // Load level data from the server
    fetch('http://127.0.0.1:5000/api/universe')
        .then(response => response.json())
        .then(levelData => {
            console.log("Level data:", levelData);
            levelData.objects.forEach(obj => {
                let geometry, material, mesh;
                if (obj.type === 'cube') {
                    geometry = new THREE.BoxGeometry(obj.size[0], obj.size[1], obj.size[2]);
                    material = new THREE.MeshBasicMaterial({ color: new THREE.Color(...obj.color) });
                    mesh = new THREE.Mesh(geometry, material);
                    mesh.position.set(...obj.position);
                    objects.push(mesh);
                    scene.add(mesh);
                    console.log("Added cube named", obj.name);
                } else if (obj.type === 'sphere') {
                    geometry = new THREE.SphereGeometry(obj.size[0], 32, 32);
                    material = new THREE.MeshBasicMaterial({ color: new THREE.Color(...obj.color) });
                    mesh = new THREE.Mesh(geometry, material);
                    mesh.position.set(...obj.position);
                    objects.push(mesh);
                    scene.add(mesh);
                    console.log("Added sphere named", obj.name);
                }
            });
            animate();
        });

    function resizeRendererToDisplaySize(renderer) {
        const canvas = renderer.domElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const needResize = canvas.width !== width || canvas.height !== height;
        if (needResize) {
            renderer.setSize(width, height, false);
        }
        return needResize;
    }

    function animate() {
        requestAnimationFrame(animate);
        if (resizeRendererToDisplaySize(renderer)) {
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }
        renderer.render(scene, camera);
    }

    window.addEventListener('resize', () => {
        const canvasContainer = document.getElementById('canvas-container');
        canvas.width = canvasContainer.clientWidth;
        canvas.height = canvasContainer.clientHeight;
        renderer.setSize(canvas.width, canvas.height);
        camera.aspect = canvas.width / canvas.height;
        camera.updateProjectionMatrix();
    });
});
