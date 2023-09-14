//import THREE
import * as THREE from 'three';

//import CSS
import './style.css';

// Initialize Three.js scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("container").appendChild(renderer.domElement);

// Create a cube
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// Set initial position of the cube
cube.position.set(0, 0, -5);

// Create a raycaster for mouse interactions
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Handle mouse move events
document.addEventListener('mousemove', onMouseMove);

function onMouseMove(event) {
    // Calculate mouse position in normalized device coordinates
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Update the raycaster
    raycaster.setFromCamera(mouse, camera);

    // Check for intersections with the cube
    const intersects = raycaster.intersectObject(cube);

    if (intersects.length > 0) {
        // Mouse is over the cube
        document.getElementById("label").classList.remove("hidden");
    } else {
        // Mouse is not over the cube
        document.getElementById("label").classList.add("hidden");
    }
}

// Set up camera position
camera.position.z = 5;

// Create an animation loop
function animate() {
    requestAnimationFrame(animate);

    // Rotate the cube
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    renderer.render(scene, camera);
}

animate();