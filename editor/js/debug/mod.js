import * as THREE from 'three';

// 简单的`throttle`函数实现
var throttle = function ( func, wait = 1000 ) {

	var lastTime = 0; // 用来记录上次执行的时刻

	return function ( ...args ) {

		var now = Date.now();

		var coolingDown = now - lastTime < wait;

		if ( coolingDown ) {

			return;

		}

		lastTime = Date.now();

		func.apply( null, args );

	};

};

const NOOP = () => {};

const throttleFn = throttle( function ( mesh, point, callback = NOOP ) {

	mesh.position.copy( point );

	callback && callback();

}, 500 );

class Debug {

	constructor( editor ) {

		this.editor = editor;

		this.init();

		this.worldPosition = new THREE.Vector3();

	}

	init() {

		const scene = this.editor.scene;

		// const canvas = document.createElement( 'canvas' );
		// const ctx = canvas.getContext( '2d' );
		// ctx.fillStyle = '#FF0000';
		// ctx.fillRect( 0, 0, 150, 75 );
		// ctx.stroke();

		// const map = new THREE.CanvasTexture( canvas );
		// const material = new THREE.SpriteMaterial( {
		// 	map: map,
        //     sizeAttenuation: false
		// 	// depthTest: false,
		// 	// depthWrite: false,
		// 	// fog: false,
		// 	// toneMapped: false,
		// 	// transparent: true
		// } );

		// const sprite = new THREE.Sprite( material );
		// sprite.name = 'DebugSprite';
		// scene.add( sprite );

		const geometry = new THREE.BoxGeometry( 1, 1, 1, 1, 1, 1 );
		const mesh = new THREE.Mesh( geometry, new THREE.MeshStandardMaterial( {
			depthTest: false,
			depthWrite: false,
			fog: false,
			toneMapped: false,
			transparent: true,
		} ) );
		mesh.name = 'DebugBox';

		scene.add( mesh );

	}

	update( point ) {

		const editor = this.editor;

		const mesh = editor.scene.getObjectByName( 'DebugBox' );

		if ( mesh ) {

			throttleFn( mesh, point, () => {

				console.log( 'sceneGraphChanged' );

				const camera = editor.camera;

				const size = 1;

				// const factor = this.worldPosition.distanceTo( camera.position ) * Math.min( 1.9 * Math.tan( Math.PI * camera.fov / 360 ) / camera.zoom, 7 );

				// mesh.scale.set( 1, 1, 1 ).multiplyScalar( factor * size / 4 ); // TODO: simplify helpers and consider decoupling from gizmo

				const signals = editor.signals;
				signals.sceneGraphChanged.dispatch();

			} );

		}

	}

}

export { Debug };
