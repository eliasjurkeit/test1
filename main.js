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

//have the closest icon to the camera be selected -> change in color of icon's 3d model + text in background

let camera, renderer, composer, clock, fontGeometry, threeDText
let uniforms, mesh;

init();
animate();

function init() {
    const container = document.getElementById('container');

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x89CFF0);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 3000);
    camera.position.z = 4;

    clock = new THREE.Clock();

    const textureLoader = new THREE.TextureLoader();

    const cloudTexture = textureLoader.load( 'assets/cloud.png' );
    const lavaTexture = textureLoader.load( 'assets/lavatile.jpg' );

    lavaTexture.colorSpace = THREE.SRGBColorSpace;

    cloudTexture.wrapS = cloudTexture.wrapT = THREE.RepeatWrapping;
    lavaTexture.wrapS = lavaTexture.wrapT = THREE.RepeatWrapping;

    uniforms = {
        'fogDensity': { value: 0 },
        'fogColor': { value: new THREE.Vector3( 0, 0, 0 ) },
        'time': { value: 1.0 },
        'uvScale': { value: new THREE.Vector2( 3.0, 1.0 ) },
        'texture1': { value: cloudTexture },
        'texture2': { value: lavaTexture }
    };

    const size = 0.65;

    const shaderMaterial = new THREE.ShaderMaterial( {
        uniforms: uniforms,
        vertexShader: document.getElementById( 'vertexShader' ).textContent,
        fragmentShader: document.getElementById( 'fragmentShader' ).textContent
    } );

    let fontLoader = new FontLoader();
    fontLoader.load('/assets/Bakery_Regular.json', function (font) {
        fontGeometry = new TextGeometry('Projects', {
            font: font,
            size: 80,
            height: 5,
            curveSegments: 12,
            bevelEnabled: false,
            bevelThickness: 10,
            bevelSize: 8,
            bevelOffset: 0,
            bevelSegments: 5
        });

        mesh = new THREE.Mesh(fontGeometry, shaderMaterial);
        mesh.position.set(-2.5, 0, -1);
        scene.add(mesh);
    });


    // mesh = new THREE.Mesh( new THREE.TorusGeometry( size, 0.3, 30, 30 ), shaderMaterial );
    // mesh.position.set(0, 0, 3);
    // mesh.rotation.x = 0.3;
    // scene.add(mesh);

    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.autoClear = false;
    container.appendChild(renderer.domElement);

    const renderModel = new RenderPass( scene, camera );
    const effectBloom = new BloomPass( 1.25 );
    const outputPass = new OutputPass();

    composer = new EffectComposer(renderer);

    composer.addPass(renderModel);
    composer.addPass(effectBloom);
    composer.addPass(outputPass);


    const controls = new ArcballControls(camera, renderer.domElement, scene);
    controls.addEventListener('change', render);

    // const gltfLoader = new GLTFLoader();
    // gltfLoader.load('https://raw.githubusercontent.com/eliasjurkeit/test1/master/CUBE_DONE.glb', function (gltf) {
    //     gltf.scene.scale.set(1, 1, 1);
    //     scene.add(gltf.scene);
    // }, undefined, function (error) {
    //     console.error(error);
    // });

// const geometry = new THREE.PlaneGeometry( 1, 1 );
// const material = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
// const plane = new THREE.Mesh( geometry, material );
//
// scene.add(camera)
// camera.add(plane);
// plane.position.set(0, 0, -5);
//
//     let fontLoader = new FontLoader();
//     fontLoader.load('/assets/Bakery_Regular.json', function (font) {
//         fontGeometry = new TextGeometry('Projects', {
//             font: font,
//             size: 80,
//             height: 5,
//             curveSegments: 12,
//             bevelEnabled: true,
//             bevelThickness: 1,
//             bevelSize: 1,
//             bevelOffset: 0,
//             bevelSegments: 5
//         });
//
//         threeDText = new THREE.Mesh(fontGeometry, shaderMaterial);
//         threeDText.position.set(-150, 0, -100);
//         scene.add(threeDText);
//         // const threeDText = new THREE.Points(fontGeometry, shaderMaterial)
//         // threeDText.position.set(-150, 0, -100)
//         // scene.add(threeDText)
//     });
}
function animate() {
    requestAnimationFrame(animate);
    render();
}

function render() {
    const delta = 5 * clock.getDelta();
    uniforms[ 'time' ].value += 0.2 * delta;
    renderer.clear();
    composer.render(0.01);
}

animate();