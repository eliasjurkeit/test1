import * as THREE from 'three';
import './style.css';
import {color} from "three/nodes";

// Initialize Three.js scene
const container = document.getElementById('container');

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x89CFF0);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);

// Create a cube
const geometry = new THREE.BoxGeometry();
const wireframeMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
const cube = new THREE.LineSegments(new THREE.WireframeGeometry(geometry), wireframeMaterial);
cube.scale.set(3, 3, 3);
scene.add(cube);

const geometry1 = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, opacity: 0.5, transparent: true });
const cube1 = new THREE.Mesh(geometry1, material);
cube1.scale.set(3, 3, 3);
scene.add(cube1);

// Set initial position of the cube
cube.position.set(0, 0, -5);
cube1.position.set(0, 0, -5);


//--------------------------------------------------------------------------------------------------------------------------


// Create a raycaster for mouse interactions
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

let intersects = [];

// Handle mouse move events
document.addEventListener('mousemove', onMouseMove);

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

    cube1.rotation.x += 0.01;
    cube1.rotation.y += 0.01;

    renderer.render(scene, camera);

    // Update the raycaster
    raycaster.setFromCamera(mouse, camera);

    // Check for intersections with the cube
    intersects = raycaster.intersectObject(cube1);

    if (intersects.length > 0) {
        const faceNormal = intersects[0].face.normal;

        if (faceNormal.x === 1) {
            document.getElementById("popup").textContent = `Projects`;
            document.getElementById("popup").classList.remove("hidden");
        } else if (faceNormal.x === -1) {
            document.getElementById("popup").textContent = `Skills`;
            document.getElementById("popup").classList.remove("hidden");
        } else if (faceNormal.y === 1) {
            document.getElementById("popup").textContent = `Contact`;
            document.getElementById("popup").classList.remove("hidden");
        } else if (faceNormal.y === -1) {
            document.getElementById("popup").textContent = `About Me`;
            document.getElementById("popup").classList.remove("hidden");
        } else if (faceNormal.z === 1) {
            document.getElementById("popup").textContent = `Certificates`;
            document.getElementById("popup").classList.remove("hidden");
        } else if (faceNormal.z === -1) {
            document.getElementById("popup").textContent = `Education / Info`;
            document.getElementById("popup").classList.remove("hidden");
        }
    } else {
        // Mouse is not over the cube
        document.getElementById("popup").classList.add("hidden");
    }
}

animate();