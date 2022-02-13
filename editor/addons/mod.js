
function addPoints( point, particles = 1 ) {

	const editor = window.editor;
	console.log( editor );

	const geometry = new THREE.BufferGeometry();

	const positions = [];
	const colors = [];

	const color = new THREE.Color();

	const n = 10;

	for ( let i = 0; i < particles; i ++ ) {

		// positions

		const x = point.x;
		const y = point.y;
		const z = point.z;

		positions.push( x, y, z );

		// colors

		const vx = ( x / n ) + 0.5;
		const vy = ( y / n ) + 0.5;
		const vz = ( z / n ) + 0.5;

		color.setRGB( vx, vy, vz );

		colors.push( color.r, color.g, color.b );

	}

	geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ) );
	geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );

	geometry.computeBoundingSphere();

	//

	const material = new THREE.PointsMaterial( { size: 0.1, vertexColors: true } );

	const points = new THREE.Points( geometry, material );
	editor.scene.add( points );


	editor.signals.rendererUpdated.dispatch();

}

function addLine( editor, points ) {

	const geometry = new THREE.BufferGeometry().setFromPoints( points );
	const material = new THREE.LineBasicMaterial( { color: 0xff0000 } );
	const mesh = new THREE.Line( geometry, material );
	editor.scene.add( mesh );
	editor.signals.rendererUpdated.dispatch();

	state.points = [];

}

function addPoint( point ) {

	state.points.push( point );

}

const state = {

	points: [],

};

function initToolbar() {

	const dom = document.getElementById( 'toolbar' );
	const div = document.createElement( 'div' );
	div.innerText = '测量';
	dom.appendChild( div );

}

function initAddons( editor ) {

	initToolbar( editor );

	window.addons = {

		state: state,

		event: {

			intersects: function ( intersects ) {

				console.log( '[api] intersects:', intersects );

				const point = intersects[ 0 ].point;
				addPoint( point );

				// addPoints( point );
				if ( state.points.length >= 2 ) {

					addLine( window.editor, state.points );

				}

			}

		}

	};

}

export { initAddons };
