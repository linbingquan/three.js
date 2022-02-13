import { AddObjectCommand } from '../commands/AddObjectCommand.js';


function makeLabelCanvas( name, size = 64 ) {

	const borderSize = 2;
	const canvas = document.createElement( 'canvas' );
	const ctx = canvas.getContext( '2d' );
	const font = `${size}px 'Microsoft Yahei', 'PingFang SC', 'Avenir', 'Segoe UI', 'Hiragino Sans GB', STHeiti, 'Microsoft Sans Serif', 'WenQuanYi Micro Hei', sans-serif`;
	ctx.font = font;
	const textWidth = ctx.measureText( name ).width;

	const doubleBorderSize = borderSize * 2;
	const baseSize = textWidth + doubleBorderSize;
	const width = baseSize;
	const height = width;
	ctx.canvas.width = width;
	ctx.canvas.height = height;

	// need to set font again after resizing canvas
	ctx.font = font;
	ctx.textBaseline = 'middle';
	ctx.textAlign = 'center';

	// ctx.fillStyle = 'rgba( 0, 0, 0, 0.5 )';
	ctx.fillStyle = 'transparent';
	ctx.fillRect( 0, width / 4, width, height / 2 );
	ctx.translate( width / 2, height / 2 );
	ctx.fillStyle = 'white';
	ctx.fillText( name, 0, 0 );

	return canvas;

}

window.makeLabelCanvas = makeLabelCanvas;

class LinePlugin {

	constructor( editor ) {

		this.name = 'LinePlugin';

		this.editor = editor;

		this.points = [];

		this.disabled = false;

	}

	intersects( intersects ) {

		if ( this.disabled ) {

			return;

		}

		if ( intersects ) {

			const point = intersects[ 0 ].point;

			this.addPoint( point );

		}

	}

	addPoint( point ) {

		this.points.push( point );

		if ( this.points.length >= 2 ) {

			this.addLine( this.points );

		}

	}

	addLine( points ) {

		const editor = this.editor;
		const scene = editor.scene;

		const group = new THREE.Group();
		group.name = 'MeasureLine';

		const geometry = new THREE.BufferGeometry().setFromPoints( points );
		const material = new THREE.LineBasicMaterial( { color: 0xff0000, depthTest: false } );
		const mesh = new THREE.Line( geometry, material );
		mesh.name = 'Line';
		group.add( mesh );

		const distance = this.points[ 0 ].distanceTo( this.points[ 1 ] );
		console.log( distance );
		const map = new THREE.CanvasTexture( makeLabelCanvas( 'Distance: ' + distance.toFixed( 2 ) ) );
		const sprite = new THREE.Sprite( new THREE.SpriteMaterial( { map: map, depthTest: false } ) );
		sprite.name = 'Sprite';

		new THREE.Line3( points[ 0 ], points[ 1 ] ).getCenter( sprite.position );

		group.add( sprite );

		// editor.execute( new AddObjectCommand( editor, group ) );
		scene.add( group );

		this.points = []; // clean points

	}

}

export { LinePlugin };
