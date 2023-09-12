import './style.css'
import * as THREE from 'three';

// Define variables
let scene, camera, renderer, cube;

// Initialize Three.js scene
function init() {
    scene = new THREE.Scene();

    // Create a camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // Create a renderer
    renderer = new THREE.WebGLRenderer({ canvas: document.getElementById("canvas") });
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Create a cube
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const materials = [
        new THREE.MeshBasicMaterial({ color: 0xff0000 }), // Right side (red)
        new THREE.MeshBasicMaterial({ color: 0x00ff00 }), // Left side (green)
        new THREE.MeshBasicMaterial({ color: 0x0000ff }), // Top side (blue)
        new THREE.MeshBasicMaterial({ color: 0xffff00 }), // Bottom side (yellow)
        new THREE.MeshBasicMaterial({ color: 0xff00ff }), // Front side (magenta)
        new THREE.MeshBasicMaterial({ color: 0x00ffff })  // Back side (cyan)
    ];
    cube = new THREE.Mesh(geometry, materials);
    scene.add(cube);

    // Add click event listener to the canvas
    renderer.domElement.addEventListener("click", onClick, false);

    // Add mousemove event listener to the canvas for hover detection
    renderer.domElement.addEventListener("mousemove", onHover, false);

    scene.background = new THREE.Color(0xFFFFFF);

    //axes helper
    const axesHelper = new THREE.AxesHelper(10);
    scene.add(axesHelper);

    let light = new THREE.AmbientLight(0xffffff, 0.5);
    light.position.set(2, 0, 2);
    scene.add(light);

    //GLTF loader
    const loader = new THREE.GLTFLoader();
    loader.load('scene.gltf', function(gltf){
        scene.add(gltf.scene);
    });




    // Start animation
    animate();
}

// Handle click event
function onClick(event) {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    // Calculate mouse position
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Set the ray's origin and direction
    raycaster.setFromCamera(mouse, camera);

    // Check for intersections with the cube
    const intersects = raycaster.intersectObject(cube);

    if (intersects.length > 0) {
        // Determine which side was clicked based on the face normal
        const faceNormal = intersects[0].face.normal;

        if (faceNormal.x === 1) {
            console.log("Right side clicked");
        } else if (faceNormal.x === -1) {
            console.log("Left side clicked");
        } else if (faceNormal.y === 1) {
            console.log("Top side clicked");
        } else if (faceNormal.y === -1) {
            console.log("Bottom side clicked");
        } else if (faceNormal.z === 1) {
            console.log("Front side clicked");
        } else if (faceNormal.z === -1) {
            console.log("Back side clicked");
        }
    }
}

// Hover function
function onHover(event) {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    // Calculate mouse position
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Set the ray's origin and direction
    raycaster.setFromCamera(mouse, camera);

    // Check for intersections with the cube
    const intersects = raycaster.intersectObject(cube);

    if (intersects.length > 0) {
        // Determine which side is being hovered based on the face normal
        const faceNormal = intersects[0].face.normal;

        if (faceNormal.x === 1) {
            console.log("Hovering over the Right side");
        } else if (faceNormal.x === -1) {
            console.log("Hovering over the Left side");
        } else if (faceNormal.y === 1) {
            console.log("Hovering over the Top side");
        } else if (faceNormal.y === -1) {
            console.log("Hovering over the Bottom side");
        } else if (faceNormal.z === 1) {
            console.log("Hovering over the Front side");
        } else if (faceNormal.z === -1) {
            console.log("Hovering over the Back side");
        }
    }
}

// Animation function
function animate() {
    requestAnimationFrame(animate);

    // Rotate the cube
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    // Render the scene
    renderer.render(scene, camera);
}

// Resize event handler
function onWindowResize() {
    const newWidth = window.innerWidth;
    const newHeight = window.innerHeight;

    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(newWidth, newHeight);
}

// Listen for window resize events
window.addEventListener("resize", onWindowResize);

// Initialize the app
init();