import * as THREE from 'three';
import { GUI } from 'lil-gui';
import { OrbitControls } from 'OrbitControls';
import Stats from 'stats';

const parameters = {
	materialColor: '#ffeded',
	light1Color: '#e3abc2',
	light2Color: '#abe2e3',
	light3Color: '#b294db',
};

/**
 * debug
 */
const gui = new GUI();
gui.addColor( parameters, 'materialColor' )
	.onChange( ( value ) => {

		material1.color.set( value );

	} );

const scene = new THREE.Scene();

// Materials

const material1 = new THREE.MeshToonMaterial( { color: parameters.materialColor } );
const material2 = new THREE.MeshBasicMaterial( { color: '#808080' } );

const light1 = new THREE.DirectionalLight(  parameters.light1Color, 0.5 );
light1.position.set(3, 3, -3);
light1.castShadow = true;
light1.shadow.mapSize.width = 512;
light1.shadow.mapSize.height = 512;

scene.add(new THREE.DirectionalLightHelper(light1))
scene.add( light1 );

const light2 = new THREE.DirectionalLight(  parameters.light2Color, 0.5 );
light2.position.set(-3, 3, 3);
light2.castShadow = true;
light2.shadow.mapSize.width = 512;
light2.shadow.mapSize.height = 512;

scene.add(new THREE.DirectionalLightHelper(light2))
scene.add( light2 );


const light3 = new THREE.DirectionalLight(  parameters.light3Color, 0.5 );
light3.position.set(-3, 3, -3);
light3.castShadow = true;
light3.shadow.mapSize.width = 512;
light3.shadow.mapSize.height = 512;

scene.add(new THREE.DirectionalLightHelper(light3))
scene.add( light3 );

// // 添加光源
// var spotLight = new THREE.SpotLight(0xcccccc);
// spotLight.position.set(100, 300, 10);
// spotLight.castShadow = true;
// //设置阴影分辨率
// spotLight.shadow.mapSize.width = 2048;
// spotLight.shadow.mapSize.height = 2048;
// scene.add(spotLight);

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.01, 1000 );
camera.position.z = 5;
camera.position.y = 5;
camera.position.x = 5;


const cube = new THREE.Mesh(
	new THREE.BoxGeometry(),
	material1
);
cube.castShadow = true;
scene.add( cube );

// const plane = new THREE.Mesh(
// 	new THREE.PlaneGeometry( 10, 10, 10, 10 ),
// 	material2
// );
// plane.receiveShadow = true;
// plane.rotation.x = - Math.PI / 2;
// plane.position.y = - 0.5;
// scene.add( plane );

// 创建平面
var planeGeometry = new THREE.PlaneGeometry(10, 10);
var planeMaterial = new THREE.MeshLambertMaterial({color: 0x6D6565});
var plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = - Math.PI / 2;
plane.position.y = - 0.5;
// 使平面就接收物体投掷过来的阴影
plane.receiveShadow = true;
scene.add(plane)

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setPixelRatio( window.devicePixelRatio );
renderer.shadowMap.enabled = true;
// renderer.shadowMap.type = THREE.PCFSoftShadowMap;

renderer.setAnimationLoop( animation );

// Controls

const controls = new OrbitControls( camera, renderer.domElement );

function animation( time ) {

	renderer.render( scene, camera );

}

const app = document.querySelector( '#app' );
renderer.domElement.classList.add( 'canvas' );
app.appendChild( renderer.domElement );


// Resize

function onResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

	renderer.render( scene, camera );

}

window.addEventListener( 'resize', onResize );
