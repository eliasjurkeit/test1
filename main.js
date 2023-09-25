import * as THREE from 'three';
import './style.css';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

//when esc then close (needs to be in html)
//use orbit controls
//make text unselectable

const container = document.getElementById('container');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x89CFF0);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.z = 5;
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);
const controls = new OrbitControls( camera, renderer.domElement );
controls.minDistance = 2;
controls.maxDistance = 10;
controls.target.set( 0, 0, - 0.2 );
controls.update();

const invisCubeGeometry = new THREE.BoxGeometry();
const invisCubeMaterial = new THREE.MeshBasicMaterial({opacity: 0, transparent: true});
const invisCube = new THREE.Mesh(invisCubeGeometry, invisCubeMaterial);
invisCube.scale.set(3, 3, 3);
scene.add(invisCube);


let modelCube;
const loader = new GLTFLoader();
loader.load( 'CUBE_DONE.glb', function ( gltf ) {
    scene.add( gltf.scene );
    modelCube = gltf.scene;
    modelCube.scale.set(1, 1, 1);
}, undefined, function ( error ) {
    console.error( error );
} );


const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// const el = document.getElementById("cursor");
// const elWidth = el.offsetWidth;
// const elHeight = el.offsetHeight;
 const {innerWidth: width, innerHeight: height} = window;
const target = {x: width / 2, y: height / 2};
// const position = {x: height, y: width};
// const ease = 0.085;

document.addEventListener('mousemove', onMouseMove);

function onMouseMove(event) {
    target.x = event.clientX;
    target.y = event.clientY;
    mouse.x = (target.x / window.innerWidth) * 2 - 1;
    mouse.y = -(target.y / window.innerHeight) * 2 + 1;
}

// function updateCursor() {
//     const dx = target.x - position.x;
//     const dy = target.y - position.y;
//     const vx = dx * ease;
//     const vy = dy * ease;
//     position.x += vx;
//     position.y += vy;
//     el.style.left = `${(position.x - elWidth / 2).toFixed()}px`;
//     el.style.top = `${(position.y - elHeight / 2).toFixed()}px`;
// }

function animate() {
    invisCube.rotation.x += 0.01;
    invisCube.rotation.y += 0.01;

    if (modelCube) {
        modelCube.rotation.x += 0.01;
        modelCube.rotation.y += 0.01;
    }
    renderer.render(scene, camera);

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(invisCube);

    const popup = document.getElementById('popup');
    const intro = document.getElementById('introduction');
    const hellyeah = document.getElementById("hellyeah");
    if (intersects.length > 0 && hellyeah.textContent === "false") {
        const faceNormal = intersects[0].face.normal;
        if (Math.abs(faceNormal.x) === 1) {
            popup.textContent = faceNormal.x === 1 ? 'Projects' : 'Skills';
        } else if (Math.abs(faceNormal.y) === 1) {
            popup.textContent = faceNormal.y === 1 ? 'Contact' : 'About Me';
        } else if (Math.abs(faceNormal.z) === 1) {
            popup.textContent = faceNormal.z === 1 ? 'Certificates & Education' : 'Info';
        }
        popup.classList.remove('hidden');
        intro.classList.add('hidden');
        // const cursor = document.getElementById('cursor');
        // const scaleFactor = 1.7;
        //
        // cursor.style.transform = `scale(${scaleFactor})`;
        // cursor.style.backgroundColor = 'red';
    } else {
        popup.textContent = '';
        popup.classList.add('hidden');
        intro.classList.remove('hidden');
        // const cursor = document.getElementById('cursor');
        // cursor.style.transform = 'scale(1)';
        // cursor.style.backgroundColor = 'white';
    }
    //updateCursor();
    controls.update();
    requestAnimationFrame(animate);
}

animate();

//----------------------------------------------------------------------------

document.addEventListener("click", onMouseClick);

function onMouseClick(event){
    if (document.getElementById("popup").textContent === "Projects"){
        document.getElementById("projects").classList.remove("hidden")
        document.getElementById("close").classList.remove("hidden")
        document.getElementById("hellyeah").textContent = "true"
    }
    if (document.getElementById("popup").textContent === "Skills"){
        document.getElementById("skills").classList.remove("hidden")
        document.getElementById("close").classList.remove("hidden")
        document.getElementById("hellyeah").textContent = "true"
    }
    if (document.getElementById("popup").textContent === "Contact"){
        document.getElementById("contact").classList.remove("hidden")
        document.getElementById("close").classList.remove("hidden")
        document.getElementById("hellyeah").textContent = "true"
    }
    if (document.getElementById("popup").textContent === "About Me"){
        document.getElementById("about").classList.remove("hidden")
        document.getElementById("close").classList.remove("hidden")
        document.getElementById("hellyeah").textContent = "true"
    }
    if (document.getElementById("popup").textContent === "Certificates & Education"){
        document.getElementById("certs").classList.remove("hidden")
        document.getElementById("close").classList.remove("hidden")
        document.getElementById("hellyeah").textContent = "true"
    }
    if (document.getElementById("popup").textContent === "Info"){
        document.getElementById("info").classList.remove("hidden")
        document.getElementById("close").classList.remove("hidden")
        document.getElementById("hellyeah").textContent = "true"
    }
}

document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
});