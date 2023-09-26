import * as THREE from 'three';
import './style.css';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { ArcballControls } from 'three/addons/controls/ArcballControls.js';

const cameras = [ 'Orthographic', 'Perspective' ];
const cameraType = { type: 'Perspective' };

const perspectiveDistance = 2.5;
const orthographicDistance = 120;

let camera, controls, scene, renderer, gui;
let folderOptions, folderAnimations;


// const container = document.getElementById('container');
// scene = new THREE.Scene();
// scene.background = new THREE.Color(0x89CFF0);
// camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
// camera.position.z = 5;
// renderer = new THREE.WebGLRenderer({antialias: true});
// renderer.setSize(window.innerWidth, window.innerHeight);
// container.appendChild(renderer.domElement);

let modelCube;

const loader = new GLTFLoader();
loader.load( '/assets/CUBE_DONE.glb', function ( gltf ) {
    scene.add( gltf.scene );
    modelCube = gltf.scene;
    modelCube.scale.set(1, 1, 1);
}, undefined, function ( error ) {
    console.error( error );
} );


const arcballGui = {

    gizmoVisible: true,

    setArcballControls: function () {

        controls = new ArcballControls( camera, renderer.domElement, scene );
        controls.addEventListener( 'change', render );

        this.gizmoVisible = true;

        this.populateGui();

    },

    populateGui: function () {

        folderOptions.add( controls, 'enabled' ).name( 'Enable controls' );
        folderOptions.add( controls, 'enableGrid' ).name( 'Enable Grid' );
        folderOptions.add( controls, 'enableRotate' ).name( 'Enable rotate' );
        folderOptions.add( controls, 'enablePan' ).name( 'Enable pan' );
        folderOptions.add( controls, 'enableZoom' ).name( 'Enable zoom' );
        folderOptions.add( controls, 'cursorZoom' ).name( 'Cursor zoom' );
        folderOptions.add( controls, 'adjustNearFar' ).name( 'adjust near/far' );
        folderOptions.add( controls, 'scaleFactor', 1.1, 10, 0.1 ).name( 'Scale factor' );
        folderOptions.add( controls, 'minDistance', 0, 50, 0.5 ).name( 'Min distance' );
        folderOptions.add( controls, 'maxDistance', 0, 50, 0.5 ).name( 'Max distance' );
        folderOptions.add( controls, 'minZoom', 0, 50, 0.5 ).name( 'Min zoom' );
        folderOptions.add( controls, 'maxZoom', 0, 50, 0.5 ).name( 'Max zoom' );
        folderOptions.add( arcballGui, 'gizmoVisible' ).name( 'Show gizmos' ).onChange( function () {

            controls.setGizmosVisible( arcballGui.gizmoVisible );

        } );
        folderOptions.add( controls, 'copyState' ).name( 'Copy state(ctrl+c)' );
        folderOptions.add( controls, 'pasteState' ).name( 'Paste state(ctrl+v)' );
        folderOptions.add( controls, 'reset' ).name( 'Reset' );
        folderAnimations.add( controls, 'enableAnimations' ).name( 'Enable anim.' );
        folderAnimations.add( controls, 'dampingFactor', 0, 100, 1 ).name( 'Damping' );
        folderAnimations.add( controls, 'wMax', 0, 100, 1 ).name( 'Angular spd' );

    }

};

init();

function init() {

    const container = document.getElementById('container');
    document.body.appendChild( container );

    renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.toneMapping = THREE.ReinhardToneMapping;
    renderer.toneMappingExposure = 3;
    renderer.domElement.style.background = 'linear-gradient( 180deg, rgba( 0,0,0,1 ) 0%, rgba( 128,128,255,1 ) 100% )';
    container.appendChild( renderer.domElement );

    //

    scene = new THREE.Scene();

    camera = makePerspectiveCamera();
    camera.position.set( 0, 0, perspectiveDistance );
    scene.add( camera );


    new GLTFLoader()
        .load( 'assets/CUBE_DONE.glb', function ( gltf ) {
            scene.add( gltf.scene );
            render();
            window.addEventListener( 'resize', onWindowResize );
            gui = new GUI();
            gui.add( cameraType, 'type', cameras ).name( 'Choose Camera' ).onChange( function () {
                setCamera( cameraType.type );
            } );
            folderOptions = gui.addFolder( 'Arcball parameters' );
            folderAnimations = folderOptions.addFolder( 'Animations' );
            arcballGui.setArcballControls();
            render();
        } );

    let geometry = new THREE.PlaneGeometry( 1, 1 );
    let material = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
    let plane = new THREE.Mesh( geometry, material );
    camera.add( plane );
}

function makeOrthographicCamera() {

    const halfFovV = THREE.MathUtils.DEG2RAD * 45 * 0.5;
    const halfFovH = Math.atan( ( window.innerWidth / window.innerHeight ) * Math.tan( halfFovV ) );

    const halfW = perspectiveDistance * Math.tan( halfFovH );
    const halfH = perspectiveDistance * Math.tan( halfFovV );
    const near = 0.01;
    const far = 2000;
    const newCamera = new THREE.OrthographicCamera( - halfW, halfW, halfH, - halfH, near, far );
    return newCamera;

}

function makePerspectiveCamera() {

    const fov = 45;
    const aspect = window.innerWidth / window.innerHeight;
    const near = 0.01;
    const far = 2000;
    const newCamera = new THREE.PerspectiveCamera( fov, aspect, near, far );
    return newCamera;

}

function onWindowResize() {

    if ( camera.type == 'OrthographicCamera' ) {

        const halfFovV = THREE.MathUtils.DEG2RAD * 45 * 0.5;
        const halfFovH = Math.atan( ( window.innerWidth / window.innerHeight ) * Math.tan( halfFovV ) );

        const halfW = perspectiveDistance * Math.tan( halfFovH );
        const halfH = perspectiveDistance * Math.tan( halfFovV );
        camera.left = - halfW;
        camera.right = halfW;
        camera.top = halfH;
        camera.bottom = - halfH;

    } else if ( camera.type == 'PerspectiveCamera' ) {

        camera.aspect = window.innerWidth / window.innerHeight;

    }

    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

    render();

}

function render() {

    renderer.render( scene, camera );

}

function setCamera( type ) {

    if ( type == 'Orthographic' ) {

        camera = makeOrthographicCamera();
        camera.position.set( 0, 0, orthographicDistance );


    } else if ( type == 'Perspective' ) {

        camera = makePerspectiveCamera();
        camera.position.set( 0, 0, perspectiveDistance );

    }

    controls.setCamera( camera );

    render();

}


// function animate() {
//     requestAnimationFrame(animate);
//     renderer.render(scene, camera);
// }
// animate();