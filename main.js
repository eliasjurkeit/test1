//import THREE
import * as THREE from 'three';

//import CSS
import './style.css';
import {color} from "three/nodes";

// Initialize Three.js scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xFFFFFF);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("container").appendChild(renderer.domElement);

// Create a cube
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
cube.scale.set(3, 3, 3);
scene.add(cube);

// Set initial position of the cube
cube.position.set(0, 0, -5);


//--------------------------------------------------------------------------------------------------------------------------


// Create a raycaster for mouse interactions
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

let intersects = [];

// Handle mouse move events
document.addEventListener('mousemove', onMouseMove);

// Add a hover event listener to the cube
cube.addEventListener('mouseenter', () => {
    // Mouse is over the cube
    document.getElementById("label").classList.remove("hidden");
});

// Add a mouseleave event listener to the cube
cube.addEventListener('mouseleave', () => {
    // Mouse is not over the cube
    document.getElementById("label").classList.add("hidden");
});


function onMouseMove(event) {
    // Calculate mouse position in normalized device coordinates
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
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

    // Update the raycaster
    raycaster.setFromCamera(mouse, camera);

    // Check for intersections with the cube
    intersects = raycaster.intersectObject(cube);

    if (intersects.length > 0) {
        const faceNormal = intersects[0].face.normal;

        if (faceNormal.x === 1) {
            console.log("Hovering over the Right side");
            document.getElementById("label").textContent = `Hovering over right face`;
            document.getElementById("label").classList.remove("hidden");
        } else if (faceNormal.x === -1) {
            console.log("Hovering over the Left side");
            document.getElementById("label").textContent = `Hovering over left face`;
            document.getElementById("label").classList.remove("hidden");
        } else if (faceNormal.y === 1) {
            console.log("Hovering over the Top side");
            document.getElementById("label").textContent = `Hovering over top face`;
            document.getElementById("label").classList.remove("hidden");
        } else if (faceNormal.y === -1) {
            console.log("Hovering over the Bottom side");
            document.getElementById("label").textContent = `Hovering over bottom face`;
            document.getElementById("label").classList.remove("hidden");
        } else if (faceNormal.z === 1) {
            console.log("Hovering over the Front side");
            document.getElementById("label").textContent = `Hovering over front face`;
            document.getElementById("label").classList.remove("hidden");
        } else if (faceNormal.z === -1) {
            console.log("Hovering over the Back side");
            document.getElementById("label").textContent = `Hovering over back face`;
            document.getElementById("label").classList.remove("hidden");
        }
    } else {
        // Mouse is not over the cube
        document.getElementById("label").classList.add("hidden");
    }

}

animate();