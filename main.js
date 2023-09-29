import * as THREE from 'three';
import './style.css';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {ArcballControls} from 'three/addons/controls/ArcballControls.js';
import {TextGeometry} from 'three/addons/geometries/TextGeometry.js';
import {FontLoader} from "three/addons/loaders/FontLoader.js";
import {EffectComposer} from 'three/addons/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/addons/postprocessing/RenderPass.js';
import {BloomPass} from 'three/addons/postprocessing/BloomPass.js';
import {OutputPass} from 'three/addons/postprocessing/OutputPass.js';
import {RGBELoader} from "three/addons/loaders/RGBELoader.js";

//have the closest icon to the camera be selected -> change in color of icon's 3d model + text in background

let camera, renderer, scene
let modelEnvMap, modelGeometry;

init();
animate();

function init() {
    // Setup
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    const container = document.getElementById('container');
    container.appendChild(renderer.domElement);

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x89CFF0);

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 3000);
    //scene.add(camera)
    camera.position.set(0, 0, 5);

    // TODO: Deactivate Controls
    const controls = new ArcballControls(camera, renderer.domElement, scene);
    controls.addEventListener('change', render);


    // Content
    const fontLoader = new FontLoader();
    fontLoader.load('/assets/Bakery_Regular.json', function (font) {
        const textGeometry = new TextGeometry('Projects', {
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
        const projectText = new THREE.Mesh(textGeometry, new THREE.MeshBasicMaterial({color: 0x000000}));
        projectText.position.set(-150, 0, -100);
        scene.add(projectText);
    });

    const hdrEquirect = new RGBELoader().load(
        "assets/empty_warehouse_01_2k.hdr",
        () => {
            hdrEquirect.mapping = THREE.EquirectangularReflectionMapping;
        }, undefined, (error) => {
            console.error(error);
        }
    );

    const textureLoader = new THREE.TextureLoader();
    const normalMapTexture = textureLoader.load("assets/normal.jpg", () => {}, undefined, (error) => {
        console.error(error);
    });
    normalMapTexture.wrapS = THREE.RepeatWrapping;
    normalMapTexture.wrapT = THREE.RepeatWrapping;

    const glassMaterial = new THREE.MeshPhysicalMaterial({
        roughness: 0.07,
        transmission: 1,
        thickness: 1.5,
        envMap: hdrEquirect,
        envMapIntensity: 1.5,
        normalMap: normalMapTexture,
        normalScale: new THREE.Vector2(0.05, 0.05),
        clearcoat: 0.1,
        clearcoatNormalMap: normalMapTexture,
    });

    const gltfLoader = new GLTFLoader();
    gltfLoader.load('https://raw.githubusercontent.com/eliasjurkeit/test1/master/CUBE_DONE.glb', function (gltf) {
        gltf.scene.traverse( function ( child ) {
            if ( child.isMesh ) {
                //child.material.envMap = modelEnvMap;
                const glassCube = new THREE.Mesh(child.geometry, glassMaterial);
                scene.add(glassCube);
            }
        } );
        //let geometry = THREE.getObjectByName('').geometry;
        // gltf.scene.scale.set(1, 1, 1);
        // scene.add(gltf.scene);
        // findType(gltf.scene, 'Mesh');
    }, undefined, function (error) {
        console.error(error);
    });

    const ambientLight = new THREE.AmbientLight(0xFFFFFF, 10);
    scene.add(ambientLight);
}
function animate() {
    requestAnimationFrame(animate);
    render();
}

function render() {
    renderer.render(scene, camera);
}

animate();

// function findType(object, type) {
//     object.children.forEach((child) => {
//         if (child.type === type) {
//             console.log(child);
//         }
//         findType(child, type);
//     });
// }