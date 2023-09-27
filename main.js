import * as THREE from 'three';
import './style.css';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {ArcballControls} from 'three/addons/controls/ArcballControls.js';
import {TextGeometry} from 'three/addons/geometries/TextGeometry.js';
import {FontLoader} from "three/addons/loaders/FontLoader.js";

//have the closest icon to the camera be selected -> change in color of icon's 3d model + text in background

const container = document.getElementById('container');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x89CFF0);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
camera.position.z = 5;
scene.add(camera)
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);

const controls = new ArcballControls(camera, renderer.domElement, scene);
controls.addEventListener('change', render);

let modelCube;
const gltfLoader = new GLTFLoader();
gltfLoader.load('https://raw.githubusercontent.com/eliasjurkeit/test1/master/CUBE_DONE.glb', function (gltf) {
    scene.add(gltf.scene);
    modelCube = gltf.scene;
    modelCube.scale.set(1, 1, 1);
}, undefined, function (error) {
    console.error(error);
});

const uniforms = {
    pointTexture: {value: new THREE.TextureLoader().load('assets/spark1.png')}
};

const shaderMaterial = new THREE.ShaderMaterial({

    uniforms: uniforms,
    vertexShader: document.getElementById('vertexshader').textContent,
    fragmentShader: document.getElementById('fragmentshader').textContent,

    blending: THREE.AdditiveBlending,
    depthTest: false,
    transparent: true,
    vertexColors: true

});


const fontLoader = new FontLoader();
fontLoader.load('/assets/Bakery_Regular.json', function (font) {
    let fontGeometry = new TextGeometry('Projects', {
        font: font,
        size: 80,
        height: 5,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 1,
        bevelSize: 1,
        bevelOffset: 0,
        bevelSegments: 5
    });

    console.log(fontGeometry.isBufferGeometry)

    fontGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    fontGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    fontGeometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1).setUsage(THREE.DynamicDrawUsage));

    const threeDText = new THREE.Points(fontGeometry, shaderMaterial)
    threeDText.position.set(-150, 0, -100)
    scene.add(threeDText)
});

// const geometry = new THREE.PlaneGeometry( 1, 1 );
// const material = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
// const plane = new THREE.Mesh( geometry, material );
//
// scene.add(camera)
// camera.add(plane);
// plane.position.set(0, 0, -5);

const particles = 100000;



const radius = 2000;

const positions = [];
const colors = [];
const sizes = [];

const color = new THREE.Color();

for (let i = 0; i < particles; i++) {

    positions.push((Math.random() * 2 - 1) * radius);
    positions.push((Math.random() * 2 - 1) * radius);
    positions.push((Math.random() * 2 - 1) * radius);

    color.setHSL(i / particles, 1.0, 0.5);

    colors.push(color.r, color.g, color.b);

    sizes.push(20);

}


//camera.add(threeDText)

//particleSystem = new THREE.Points( geometry, shaderMaterial );
//scene.add( particleSystem );


container.appendChild(renderer.domElement);

function animate() {
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

function render() {
    renderer.render(scene, camera);
}

animate();