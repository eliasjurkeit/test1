import * as THREE from 'three';
import './style.css';

const container = document.getElementById('container');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x89CFF0);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry();
const wireframeMaterial = new THREE.LineBasicMaterial({color: 0x000000});
const cube = new THREE.LineSegments(new THREE.WireframeGeometry(geometry), wireframeMaterial);
cube.scale.set(3, 3, 3);
scene.add(cube);

const material = new THREE.MeshBasicMaterial({color: 0x00ff00, opacity: 0.5, transparent: true});
const cube1 = new THREE.Mesh(geometry, material);
cube1.scale.set(3, 3, 3);
scene.add(cube1);

cube.position.set(0, 0, -5);
cube1.position.set(0, 0, -5);

camera.position.z = 5;

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

const el = document.getElementById("cursor");
const elWidth = el.offsetWidth;
const elHeight = el.offsetHeight;
const {innerWidth: width, innerHeight: height} = window;
const target = {x: width / 2, y: height / 2};
const position = {x: height, y: width};
const ease = 0.085;

let closable = false;

document.addEventListener('mousemove', onMouseMove);

document.addEventListener('click', () => {
    const popup = document.getElementById('popup');
    const close = document.getElementById('close');
    if (popup.textContent !== ""){
        close.classList.remove('hidden');
    } else {
        close.classList.add('hidden');
    }
    if (popup.textContent === 'Projects') {
        document.getElementById('projects').classList.remove('hidden')
    } else {
        document.getElementById('projects').classList.add('hidden')
    }
    if (popup.textContent === 'Skills') {
        document.getElementById('skills').classList.remove('hidden')
    } else {
        document.getElementById('skills').classList.add('hidden')
    }
    if (popup.textContent === 'Contact') {
        document.getElementById('contact').classList.remove('hidden')
    } else {
        document.getElementById('contact').classList.add('hidden')
    }
    if (popup.textContent === 'About Me') {
        document.getElementById('aboutme').classList.remove('hidden')
    } else {
        document.getElementById('aboutme').classList.add('hidden')
    }
    if (popup.textContent === 'Certificates') {
        document.getElementById('certificates').classList.remove('hidden')
    } else {
        document.getElementById('certificates').classList.add('hidden')
    }
    if (popup.textContent === 'Education / Info') {
        document.getElementById('education').classList.remove('hidden')
    } else {
        document.getElementById('education').classList.add('hidden')
    }
});

function onMouseMove(event) {
    target.x = event.clientX;
    target.y = event.clientY;
    mouse.x = (target.x / window.innerWidth) * 2 - 1;
    mouse.y = -(target.y / window.innerHeight) * 2 + 1;
}

function updateCursor() {
    const dx = target.x - position.x;
    const dy = target.y - position.y;
    const vx = dx * ease;
    const vy = dy * ease;
    position.x += vx;
    position.y += vy;
    el.style.left = `${(position.x - elWidth / 2).toFixed()}px`;
    el.style.top = `${(position.y - elHeight / 2).toFixed()}px`;
}


function animate() {
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    cube1.rotation.x += 0.01;
    cube1.rotation.y += 0.01;

    renderer.render(scene, camera);

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(cube1);

    const popup = document.getElementById('popup');
    const intro = document.getElementById('introduction');
    if (intersects.length > 0 && !closable) {
        const faceNormal = intersects[0].face.normal;
        if (Math.abs(faceNormal.x) === 1) {
            popup.textContent = faceNormal.x === 1 ? 'Projects' : 'Skills';
        } else if (Math.abs(faceNormal.y) === 1) {
            popup.textContent = faceNormal.y === 1 ? 'Contact' : 'About Me';
        } else if (Math.abs(faceNormal.z) === 1) {
            popup.textContent = faceNormal.z === 1 ? 'Certificates' : 'Education / Info';
        }
        popup.classList.remove('hidden');
        intro.classList.add('hidden');
        const cursor = document.getElementById('cursor');
        const scaleFactor = 1.7;

        cursor.style.transform = `scale(${scaleFactor})`;
        cursor.style.backgroundColor = 'red';
    } else {
        popup.textContent = '';
        popup.classList.add('hidden');
        intro.classList.remove('hidden');
        const cursor = document.getElementById('cursor');
        cursor.style.transform = 'scale(1)';
        cursor.style.backgroundColor = 'white';
    }
    updateCursor();
    requestAnimationFrame(animate);
}

animate();