import * as THREE from 'three';
import './style.css';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {ArcballControls} from 'three/addons/controls/ArcballControls.js';

//have the closest icon to the camera be selected -> change in color of icon's 3d model + text in background

const container = document.getElementById('container');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x89CFF0);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.z = 5;
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);

const controls = new ArcballControls( camera, renderer.domElement, scene );
controls.addEventListener('change', render);

let modelCube;
const loader = new GLTFLoader();
loader.load('https://raw.githubusercontent.com/eliasjurkeit/test1/master/CUBE_DONE.glb', function (gltf) {
    scene.add(gltf.scene);
    modelCube = gltf.scene;
    modelCube.scale.set(1, 1, 1);
}, undefined, function (error) {
    console.error(error);
});

const geometry = new THREE.PlaneGeometry( 1, 1 );
const material = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
const plane = new THREE.Mesh( geometry, material );

scene.add(camera)
camera.add(plane);
plane.position.set(0, 0, -5);

container.appendChild(renderer.domElement);

function animate() {
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

function render() {
    renderer.render(scene, camera);
}

animate();