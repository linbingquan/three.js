import * as THREE from 'three';

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.01, 1000 );
camera.position.z = 5;

const scene = new THREE.Scene();

const mesh = new THREE.Mesh(
	new THREE.BoxGeometry(),
	new THREE.MeshBasicMaterial()
);
scene.add( mesh );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setPixelRatio( window.devicePixelRatio );

renderer.setAnimationLoop( animation );

function animation( time ) {

	mesh.rotation.x = time / 2000;
	mesh.rotation.y = time / 1000;

	renderer.render( scene, camera );

}

const app = document.querySelector( '#app' );

const containerInner = document.createElement( 'div' );
containerInner.classList.add( 'container-size' );
containerInner.style.height = '150vh';
containerInner.style.width = '150vw';

const containerScroll = document.createElement( 'div' );
containerScroll.classList.add( 'container-scroll' );
containerScroll.appendChild( containerInner );

renderer.domElement.classList.add( 'canvas' );
app.appendChild( renderer.domElement );
app.appendChild( containerScroll );

containerScroll.addEventListener( 'scroll', ( evt ) => {

	const { scrollTop, scrollLeft } = evt.target;
	camera.position.x = scrollLeft / 200;
	camera.position.y = - scrollTop / 200;

} );

// Resize

function onResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

	renderer.render( scene, camera );

}

window.addEventListener( 'resize', onResize );
