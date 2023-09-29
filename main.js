import * as THREE from 'three';
import './style.css';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {ArcballControls} from 'three/addons/controls/ArcballControls.js';
import {TextGeometry} from 'three/addons/geometries/TextGeometry.js';
import {FontLoader} from "three/addons/loaders/FontLoader.js";
import {RGBELoader} from "three/addons/loaders/RGBELoader.js";
import ProjectedMaterial from 'three-projected-material'
import {RectAreaLightHelper} from "three/addons/helpers/RectAreaLightHelper.js";
import {cameraPosition, context} from "three/nodes";
import {Vector3} from "three";


//have the closest icon to the camera be selected -> change in color of icon's 3d model + text in background

let camera, renderer, scene;
let rocketIcon, personIcon, infoIcon, educationIcon, phoneIcon, toolsIcon;
let rocketText, personText, infoText, educationText, phoneText, toolsText;

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
    scene.background = new THREE.Color(0x000000);
    //scene.background = new THREE.Color(0x0000FF);

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 3000);
    scene.add(camera)
    camera.position.set(0, 0, 5);

    // TODO: Deactivate Controls
    const controls = new ArcballControls(camera, renderer.domElement, scene);
    // controls.enableGizmos = false;
    // controls.setGizmosVisible(false);
    // controls.enableZoom = false;
    // controls.enablePan = false;
    controls.addEventListener('change', render);
    controls.addEventListener('change', whenCameraMoves);

    // Content
    const video = document.getElementById('video');
    video.muted = true;
    video.play();
    video.addEventListener('play', function () {
        this.currentTime = 60;
    });

    const videoTexture = new THREE.VideoTexture(video);
    videoTexture.colorSpace = THREE.SRGBColorSpace;

    const projectionMaterial = new ProjectedMaterial({
        camera: camera, // the camera that acts as a projector
        texture: videoTexture, // the texture being projected
        //textureScale: 0.8, // scale down the texture a bit
        //textureOffset: new THREE.Vector2(0.1, 0.1), // you can translate the texture if you want
        //cover: true, // enable background-size: cover behaviour, by default it's like background-size: contain
        //color: '#ccc', // the color of the object if it's not projected on
        //roughness: 0.3, // you can pass any other option that belongs to MeshPhysicalMaterial
    })

    const fontLoader = new FontLoader();
    fontLoader.load('/assets/Bakery_Regular.json', function (font) {
        const rocketGeometry = new TextGeometry('Projects', {
            font: font,
            size: 2,
            height: 1,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 0.1,
            bevelSize: 0.1,
            bevelOffset: 0,
            bevelSegments: 5
        });
        rocketText = new THREE.Mesh(rocketGeometry, projectionMaterial);
        rocketText.position.set(-5, -0.5, -10);
        camera.add(rocketText);
        projectionMaterial.project(rocketText)

        const personGeometry = new TextGeometry('About Me', {
            font: font,
            size: 2,
            height: 1,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 0.1,
            bevelSize: 0.1,
            bevelOffset: 0,
            bevelSegments: 5
        });
        personText = new THREE.Mesh(personGeometry, projectionMaterial);
        personText.position.set(-5, -0.5, -10);
        camera.add(personText);
        projectionMaterial.project(personText)

        const infoGeometry = new TextGeometry('Info', {
            font: font,
            size: 2,
            height: 1,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 0.1,
            bevelSize: 0.1,
            bevelOffset: 0,
            bevelSegments: 5
        });
        infoText = new THREE.Mesh(infoGeometry, projectionMaterial);
        infoText.position.set(-5, -0.5, -10);
        camera.add(infoText);
        projectionMaterial.project(infoText)

        const educationGeometry = new TextGeometry('Education', {
            font: font,
            size: 2,
            height: 1,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 0.1,
            bevelSize: 0.1,
            bevelOffset: 0,
            bevelSegments: 5
        });
        educationText = new THREE.Mesh(educationGeometry, projectionMaterial);
        educationText.position.set(-5, -0.5, -10);
        camera.add(educationText);
        projectionMaterial.project(educationText)

        const phoneGeometry = new TextGeometry('Contact', {
            font: font,
            size: 2,
            height: 1,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 0.1,
            bevelSize: 0.1,
            bevelOffset: 0,
            bevelSegments: 5
        });
        phoneText = new THREE.Mesh(phoneGeometry, projectionMaterial);
        phoneText.position.set(-5, -0.5, -10);
        camera.add(phoneText);
        projectionMaterial.project(phoneText)

        const toolsGeometry = new TextGeometry('Skills', {
            font: font,
            size: 2,
            height: 1,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 0.1,
            bevelSize: 0.1,
            bevelOffset: 0,
            bevelSegments: 5
        });
        toolsText = new THREE.Mesh(toolsGeometry, projectionMaterial);
        toolsText.position.set(-5, -0.5, -10);
        camera.add(toolsText);
        projectionMaterial.project(toolsText)
    });

    const hdrEquirect = new RGBELoader().load("assets/empty_warehouse_01_2k.hdr", () => {
        hdrEquirect.mapping = THREE.EquirectangularReflectionMapping;
    }, undefined, (error) => {
        console.error(error);
    });

    const textureLoader = new THREE.TextureLoader();
    const normalMapTexture = textureLoader.load("assets/normal.jpg", () => {
    }, undefined, (error) => {
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
    gltfLoader.load('assets/CUBE_DONE.glb', function (gltf) {
        gltf.scene.traverse(function (child) {
            if (child.isMesh) {
                //child.projectionMaterial.envMap = modelEnvMap;
                const glassCube = new THREE.Mesh(child.geometry, glassMaterial);
                glassCube.scale.set(1, 1, 1);
                scene.add(glassCube);
            }
        });
        //let geometry = THREE.getObjectByName('').geometry;
        // gltf.scene.scale.set(1, 1, 1);
        // scene.add(gltf.scene);
        // findType(gltf.scene, 'Mesh');
    }, undefined, function (error) {
        console.error(error);
    });


    // Tried Rectangular Light for selection
    // const width = 1;
    // const height = 1;
    // const intensity = 1;
    // const rectLight = new THREE.RectAreaLight( 0x0BBE4, intensity,  width, height );
    // rectLight.position.set( 0, 0.75, 0 );
    // rectLight.rotateZ(THREE.MathUtils.degToRad(-90));
    // rectLight.rotateY(THREE.MathUtils.degToRad(90));
    // scene.add( rectLight )
    //
    // const rectLightHelper = new RectAreaLightHelper( rectLight );
    // rectLight.add( rectLightHelper );


    gltfLoader.load('assets/call.glb', function (gltf) {
        gltf.scene.traverse(function (child) {
            if (child.isMesh) {
                //child.projectionMaterial.envMap = modelEnvMap;
                phoneIcon = new THREE.Mesh(child.geometry, new THREE.MeshPhysicalMaterial({
                    color: 0x0BBE4,
                    roughness: 0.07,
                    transmission: 1,
                    thickness: 1.5,
                    envMap: hdrEquirect,
                    envMapIntensity: 1.5,
                    normalMap: normalMapTexture,
                    normalScale: new THREE.Vector2(0.05, 0.05),
                    clearcoat: 0.1,
                    clearcoatNormalMap: normalMapTexture,
                }));
                phoneIcon.scale.set(175, 1, 175);
                phoneIcon.position.set(0, 1, 0);
                scene.add(phoneIcon);
            }
        });
        //let geometry = THREE.getObjectByName('').geometry;
        // gltf.scene.scale.set(1, 1, 1);
        // scene.add(gltf.scene);
        // findType(gltf.scene, 'Mesh');
    }, undefined, function (error) {
        console.error(error);
    });

    gltfLoader.load('assets/edu.glb', function (gltf) {
        gltf.scene.traverse(function (child) {
            if (child.isMesh) {
                //child.projectionMaterial.envMap = modelEnvMap;
                educationIcon = new THREE.Mesh(child.geometry, new THREE.MeshPhysicalMaterial({
                    color: 0x0BBE4,
                    roughness: 0.07,
                    transmission: 1,
                    thickness: 1.5,
                    envMap: hdrEquirect,
                    envMapIntensity: 1.5,
                    normalMap: normalMapTexture,
                    normalScale: new THREE.Vector2(0.05, 0.05),
                    clearcoat: 0.1,
                    clearcoatNormalMap: normalMapTexture,
                }));
                educationIcon.scale.set(175, 1, 175);
                educationIcon.rotateX(THREE.MathUtils.degToRad(90));
                educationIcon.rotateZ(THREE.MathUtils.degToRad(180));
                educationIcon.position.set(0, 0, -1);
                scene.add(educationIcon);
            }
        });
        //let geometry = THREE.getObjectByName('').geometry;
        // gltf.scene.scale.set(1, 1, 1);
        // scene.add(gltf.scene);
        // findType(gltf.scene, 'Mesh');
    }, undefined, function (error) {
        console.error(error);
    });

    gltfLoader.load('assets/info.glb', function (gltf) {
        gltf.scene.traverse(function (child) {
            if (child.isMesh) {
                //child.projectionMaterial.envMap = modelEnvMap;
                infoIcon = new THREE.Mesh(child.geometry, new THREE.MeshPhysicalMaterial({
                    color: 0x0BBE4,
                    roughness: 0.07,
                    transmission: 1,
                    thickness: 1.5,
                    envMap: hdrEquirect,
                    envMapIntensity: 1.5,
                    normalMap: normalMapTexture,
                    normalScale: new THREE.Vector2(0.05, 0.05),
                    clearcoat: 0.1,
                    clearcoatNormalMap: normalMapTexture,
                }));
                infoIcon.scale.set(175, 1, 175);
                infoIcon.rotateX(THREE.MathUtils.degToRad(90));
                infoIcon.position.set(0, 0, 1);
                scene.add(infoIcon);
            }
        });
        //let geometry = THREE.getObjectByName('').geometry;
        // gltf.scene.scale.set(1, 1, 1);
        // scene.add(gltf.scene);
        // findType(gltf.scene, 'Mesh');
    }, undefined, function (error) {
        console.error(error);
    });

    gltfLoader.load('assets/person.glb', function (gltf) {
        gltf.scene.traverse(function (child) {
            if (child.isMesh) {
                //child.projectionMaterial.envMap = modelEnvMap;
                personIcon = new THREE.Mesh(child.geometry, new THREE.MeshPhysicalMaterial({
                    color: 0x0BBE4,
                    roughness: 0.07,
                    transmission: 1,
                    thickness: 1.5,
                    envMap: hdrEquirect,
                    envMapIntensity: 1.5,
                    normalMap: normalMapTexture,
                    normalScale: new THREE.Vector2(0.05, 0.05),
                    clearcoat: 0.1,
                    clearcoatNormalMap: normalMapTexture,
                }));
                personIcon.scale.set(175, 1, 175);
                personIcon.rotateX(THREE.MathUtils.degToRad(90));
                personIcon.rotateZ(THREE.MathUtils.degToRad(90));
                personIcon.position.set(-1, 0, 0);
                scene.add(personIcon);
            }
        });
        //let geometry = THREE.getObjectByName('').geometry;
        // gltf.scene.scale.set(1, 1, 1);
        // scene.add(gltf.scene);
        // findType(gltf.scene, 'Mesh');
    }, undefined, function (error) {
        console.error(error);
    });

    gltfLoader.load('assets/rocket.glb', function (gltf) {
        gltf.scene.traverse(function (child) {
            if (child.isMesh) {
                //child.projectionMaterial.envMap = modelEnvMap;
                rocketIcon = new THREE.Mesh(child.geometry, new THREE.MeshPhysicalMaterial({
                    color: 0x0BBE4,
                    roughness: 0.07,
                    transmission: 1,
                    thickness: 1.5,
                    envMap: hdrEquirect,
                    envMapIntensity: 1.5,
                    normalMap: normalMapTexture,
                    normalScale: new THREE.Vector2(0.05, 0.05),
                    clearcoat: 0.1,
                    clearcoatNormalMap: normalMapTexture,
                }));
                rocketIcon.scale.set(175, 1, 175);
                rocketIcon.rotateZ(THREE.MathUtils.degToRad(90));
                rocketIcon.position.set(0.75, 0, 0);
                scene.add(rocketIcon);
            }
        });
        //let geometry = THREE.getObjectByName('').geometry;
        // gltf.scene.scale.set(1, 1, 1);
        // scene.add(gltf.scene);
        // findType(gltf.scene, 'Mesh');
    }, undefined, function (error) {
        console.error(error);
    });

    gltfLoader.load('assets/tools.glb', function (gltf) {
        gltf.scene.traverse(function (child) {
            if (child.isMesh) {
                //child.projectionMaterial.envMap = modelEnvMap;
                toolsIcon = new THREE.Mesh(child.geometry, new THREE.MeshPhysicalMaterial({
                    color: 0x0BBE4,
                    roughness: 0.07,
                    transmission: 1,
                    thickness: 1.5,
                    envMap: hdrEquirect,
                    envMapIntensity: 1.5,
                    normalMap: normalMapTexture,
                    normalScale: new THREE.Vector2(0.05, 0.05),
                    clearcoat: 0.1,
                    clearcoatNormalMap: normalMapTexture,
                }));
                toolsIcon.scale.set(175, 1, 175);
                toolsIcon.rotateX(THREE.MathUtils.degToRad(180));
                toolsIcon.position.set(0.03, -1, 0.01);
                scene.add(toolsIcon);
            }
        });
        //let geometry = THREE.getObjectByName('').geometry;
        // gltf.scene.scale.set(1, 1, 1);
        // scene.add(gltf.scene);
        // findType(gltf.scene, 'Mesh');
    }, undefined, function (error) {
        console.error(error);
    });

    // control boxes
    const boxGeometry = new THREE.BoxGeometry(2, 2, 2); // as big as cube model
    const boxMaterial = new THREE.MeshBasicMaterial({color: 0x00ff00});

    const box1 = new THREE.Mesh(boxGeometry, boxMaterial);
    box1.visible = false;
    box1.position.set(-4, 0, 0);
    scene.add(box1);

    const box2 = new THREE.Mesh(boxGeometry, boxMaterial);
    box2.visible = false;
    box2.position.set(4, 0, 0);
    scene.add(box2);

    const box3 = new THREE.Mesh(boxGeometry, boxMaterial);
    box3.visible = false;
    box3.position.set(0, 0, 4);
    scene.add(box3);

    const box4 = new THREE.Mesh(boxGeometry, boxMaterial);
    box4.visible = false;
    box4.position.set(0, 0, -4);
    scene.add(box4);

    const box5 = new THREE.Mesh(boxGeometry, boxMaterial);
    box5.visible = false;
    box5.position.set(0, 4, 0);
    scene.add(box5);

    const box6 = new THREE.Mesh(boxGeometry, boxMaterial);
    box6.visible = false;
    box6.position.set(0, -4, 0);
    scene.add(box6);

    const ambientLight = new THREE.AmbientLight(0xFFFFFF, 10);
    scene.add(ambientLight);
}


//either by box method or icon method
let distances = {
    person: new THREE.Vector3(0, 0, 0),
    rocket: new THREE.Vector3(0, 0, 0),
    info: new THREE.Vector3(0, 0, 0),
    education: new THREE.Vector3(0, 0, 0),
    phone: new THREE.Vector3(0, 0, 0),
    tools: new THREE.Vector3(0, 0, 0),
}

function whenCameraMoves() {
    distances = {
        person: camera.position.distanceTo(new THREE.Vector3(-4, 0, 0)),
        rocket: camera.position.distanceTo(new THREE.Vector3(4, 0, 0)),
        info: camera.position.distanceTo(new THREE.Vector3(0, 0, 4)),
        education: camera.position.distanceTo(new THREE.Vector3(0, 0, -4)),
        phone: camera.position.distanceTo(new THREE.Vector3(0, 4, 0)),
        tools: camera.position.distanceTo(new THREE.Vector3(0, -4, 0)),
    }
    //console.log(distances)
    const minDistance = Math.min(...Object.values(distances));
    const minDistanceKey = Object.keys(distances).find(key => distances[key] === minDistance);
    if (minDistanceKey === 'person') {
        rocketText.visible = false;
        personText.visible = true;
        infoText.visible = false;
        educationText.visible = false;
        phoneText.visible = false;
        toolsText.visible = false;
    } else if (minDistanceKey === 'rocket') {
        rocketText.visible = true;
        personText.visible = false;
        infoText.visible = false;
        educationText.visible = false;
        phoneText.visible = false;
        toolsText.visible = false;
    } else if (minDistanceKey === 'info') {
        rocketText.visible = false;
        personText.visible = false;
        infoText.visible = true;
        educationText.visible = false;
        phoneText.visible = false;
        toolsText.visible = false;
    } else if (minDistanceKey === 'education') {
        rocketText.visible = false;
        personText.visible = false;
        infoText.visible = false;
        educationText.visible = true;
        phoneText.visible = false;
        toolsText.visible = false;
    } else if (minDistanceKey === 'phone') {
        phoneText.visible = true;
        rocketText.visible = false;
        personText.visible = false;
        infoText.visible = false;
        educationText.visible = false;
        toolsText.visible = false;
    } else if (minDistanceKey === 'tools') {
        rocketText.visible = false;
        personText.visible = false;
        infoText.visible = false;
        educationText.visible = false;
        phoneText.visible = false;
        toolsText.visible = true;
    }
}

function animate() {
    requestAnimationFrame(animate);
    render();
}

function render() {
    renderer.render(scene, camera);
}

animate();