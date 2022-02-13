import * as THREE from 'three';
import { OrbitControls } from 'OrbitControls';
import { GUI } from 'lil-gui';
import Stats from 'stats';

const parameters = {
	materialColor: '#ffeded',
	scrollTop: 0,
	objectDistance: 12,
	cursorX: 0,
	cursorY: 0,
	pointsCount: 200,
	cameraPositionZ: 10,
	currentScreen: 0,
};

/**
 * debug
 */
const gui = new GUI();
gui
	.addColor( parameters, 'materialColor' )
	.onChange( ( value ) => {

		material.color.set( value );
		material2.color.set( value );

	} );

gui.add( parameters, 'cameraPositionZ', 0, 100 )
	.onChange( ( value ) => {

		camera.position.z = value;

	} );

/** canvas texture */
function crateTexture() {

	var canvas = document.createElement( 'canvas' );
	const width = 128;
	const height = 128;
	canvas.width = width;
	canvas.height = height;
	var ctx = canvas.getContext( '2d' );

	var grd = ctx.createLinearGradient( 0, 0, height, 0 );
	grd.addColorStop( 0, '#393839' );
	grd.addColorStop( 0.25, '#393839' );
	grd.addColorStop( 0.3333, '#747374' );
	grd.addColorStop( 0.6666, '#747374' );
	grd.addColorStop( 0.6666, '#ffffff' );
	grd.addColorStop( 1, '#ffffff' );

	ctx.fillStyle = grd;
	ctx.fillRect( 0, 0, width, height );
	return canvas;

}

const group = new THREE.Group();
const scene = new THREE.Scene();
scene.add( group );

// texture

const gradientTexture = new THREE.CanvasTexture( crateTexture() );
gradientTexture.magFilter = THREE.NearestFilter;

// materials

const material = new THREE.MeshToonMaterial( {
	color: parameters.materialColor,
	gradientMap: gradientTexture
} );
const material2 = new THREE.PointsMaterial( { color: parameters.materialColor, size: 0.5 } );

// meshes

const mesh1 = new THREE.Mesh(
	new THREE.TorusGeometry( 1, 0.4, 16, 60 ),
	material
);

const mesh2 = new THREE.Mesh(
	new THREE.ConeGeometry( 1, 2, 32 ),
	material
);

const mesh3 = new THREE.Mesh(
	new THREE.TorusKnotGeometry( 0.8, 0.35, 100, 16 ),
	material
);

mesh1.position.y = - parameters.objectDistance * 0;
mesh2.position.y = - parameters.objectDistance * 1;
mesh3.position.y = - parameters.objectDistance * 2;


mesh1.name = 'mesh1';
mesh2.name = 'mesh2';
mesh3.name = 'mesh3';

const meshs = [ mesh1, mesh2, mesh3 ];

scene.add( mesh1, mesh2, mesh3 );

// lights

const directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
directionalLight.position.set( 1, 1, 0 );
scene.add( directionalLight );

// points

const vertices = [];

for ( let i = 0; i < parameters.pointsCount; i ++ ) {

	const x = THREE.MathUtils.randFloatSpread( 100 );
	const y = THREE.MathUtils.randFloatSpread( 100 );
	const z = THREE.MathUtils.randFloatSpread( 100 );

	vertices.push( x, y, z );

}

const geometry = new THREE.BufferGeometry();
geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
const points = new THREE.Points( geometry, material2 );

group.add( points );

// renderer

const canvas = document.querySelector( '#canvas' );
const renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true, alpha: true } );
renderer.setClearColor( '#1e1a20' );
renderer.setSize( window.innerWidth, window.innerHeight );
// document.body.appendChild( renderer.domElement );

const camera = new THREE.PerspectiveCamera( 35, window.innerWidth / window.innerHeight, 0.01, 1000 );
camera.position.z = parameters.cameraPositionZ;
group.add( camera );

// Controls

// const controls = new OrbitControls( camera, renderer.domElement );

// Stats

const stats = new Stats();
document.body.appendChild( stats.dom );

function render() {

	stats.begin();
	renderer.render( scene, camera );
	stats.end();

}

renderer.setAnimationLoop( animate );

const clock = new THREE.Clock();

let prevScreen = 0;

function animate() {

	const elapsedTime = clock.getElapsedTime();

	group.position.x = parameters.cursorX / window.innerWidth * 0.5;
	group.position.y = - parameters.cursorY / window.innerHeight * 0.5;

	camera.position.y = - parameters.scrollTop / window.innerHeight * parameters.objectDistance;

	for ( let index = 0; index < meshs.length; index ++ ) {

		const mesh = meshs[ index ];

		if ( mesh && parameters.currentScreen !== index ) {

			mesh.rotation.x = elapsedTime * 0.1;
			mesh.rotation.y = elapsedTime * 0.1;

		}

	}

	render();

}

const appDom = document.querySelector( '#app' );
appDom.addEventListener( 'scroll', ( evt ) => {

	const top = evt.target.scrollTop || 0;
	parameters.scrollTop = top;

	parameters.currentScreen = Math.round( parameters.scrollTop / window.innerHeight );

	if ( prevScreen !== parameters.currentScreen ) {

		// 动画

		const mesh = meshs[ parameters.currentScreen ];

		if ( ! mesh ) {

			return;

		}

		prevScreen = parameters.currentScreen;

		gsap.to( mesh.rotation, {
			duration: 1,
			x: mesh.rotation.x + 2 * Math.PI,
			onUpdate: function () {

				console.log( 'onUpdate' );

			},
			onComplete: function () {

				console.log( 'onComplete' );

			}
		} );

	}

} );
appDom.addEventListener( 'mousemove', ( evt ) => {

	const { clientX, clientY } = evt;
	parameters.cursorX = clientX;
	parameters.cursorY = clientY;

} );

function onResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

	render();

}

window.addEventListener( 'resize', onResize );
