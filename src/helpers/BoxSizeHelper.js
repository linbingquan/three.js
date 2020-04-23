/**
 * @author mrdoob / http://mrdoob.com/
 * @author Mugen87 / http://github.com/Mugen87
 */

import { Box3 } from '../math/Box3.js';
import { LineSegments } from '../objects/LineSegments.js';
import { LineDashedMaterial } from '../materials/LineDashedMaterial.js';
import { CanvasTexture } from '../textures/CanvasTexture.js';
import { Sprite } from '../objects/Sprite.js';
import { SpriteMaterial } from '../materials/SpriteMaterial.js';
import { Float32BufferAttribute } from '../core/BufferAttribute.js';
import { BufferGeometry } from '../core/BufferGeometry.js';
import { Color } from '../math/Color.js';

var _box = new Box3();

function BoxSizeHelper( object, color, scalar ) {

	this.object = object;

	this.scalar = 1;

	if ( color === undefined ) color = 0xefefef;

	if ( scalar !== undefined ) this.scalar = scalar;

	var positions = new Float32Array( 12 * 6 );

	var geometry = new BufferGeometry();

	geometry.setAttribute( 'position', new Float32BufferAttribute( positions, 3 ) );

	LineSegments.call( this, geometry, new LineDashedMaterial( { color: color, dashSize: 1, gapSize: 1 } ) );

	this.type = 'BoxSizeHelper';

	this.matrixAutoUpdate = false;

	this.update();

}

BoxSizeHelper.prototype = Object.create( LineSegments.prototype );
BoxSizeHelper.prototype.constructor = BoxSizeHelper;

BoxSizeHelper.prototype.update = function ( object ) {

	if ( object !== undefined ) {

		console.warn( 'THREE.BoxSizeHelper: .update() has no longer arguments.' );

	}

	if ( this.object !== undefined ) {

		_box.setFromObject( this.object );

	}

	if ( _box.isEmpty() ) return;

	var min = _box.min.multiplyScalar( this.scalar );
	var max = _box.max.multiplyScalar( this.scalar );

	/*
	  5____4
	1/___0/|
	| 6__|_7
	2/___3/

	0: max.x, max.y, max.z
	1: min.x, max.y, max.z
	2: min.x, min.y, max.z
	3: max.x, min.y, max.z
	4: max.x, max.y, min.z
	5: min.x, max.y, min.z
	6: min.x, min.y, min.z
	7: max.x, min.y, min.z
	*/

	var position = this.geometry.attributes.position;
	var array = position.array;

	// 0 -> 1
	array[ 0 ] = max.x; array[ 1 ] = max.y; array[ 2 ] = max.z;
	array[ 3 ] = min.x; array[ 4 ] = max.y; array[ 5 ] = max.z;

	// 1 -> 2
	array[ 6 ] = min.x; array[ 7 ] = max.y; array[ 8 ] = max.z;
	array[ 9 ] = min.x; array[ 10 ] = min.y; array[ 11 ] = max.z;

	// 2 -> 3
	array[ 12 ] = min.x; array[ 13 ] = min.y; array[ 14 ] = max.z;
	array[ 15 ] = max.x; array[ 16 ] = min.y; array[ 17 ] = max.z;

	// 3 -> 0
	array[ 18 ] = max.x; array[ 19 ] = min.y; array[ 20 ] = max.z;
	array[ 21 ] = max.x; array[ 22 ] = max.y; array[ 23 ] = max.z;

	// 4 -> 5
	array[ 24 ] = max.x; array[ 25 ] = max.y; array[ 26 ] = min.z;
	array[ 27 ] = min.x; array[ 28 ] = max.y; array[ 29 ] = min.z;

	// 5 -> 6
	array[ 30 ] = min.x; array[ 31 ] = max.y; array[ 32 ] = min.z;
	array[ 33 ] = min.x; array[ 34 ] = min.y; array[ 35 ] = min.z;

	// 7 -> 6
	array[ 36 ] = min.x; array[ 37 ] = min.y; array[ 38 ] = min.z;
	array[ 39 ] = max.x; array[ 40 ] = min.y; array[ 41 ] = min.z;

	// 7 -> 4
	array[ 42 ] = max.x; array[ 43 ] = min.y; array[ 44 ] = min.z;
	array[ 45 ] = max.x; array[ 46 ] = max.y; array[ 47 ] = min.z;

	// 0 -> 4
	array[ 48 ] = max.x; array[ 49 ] = max.y; array[ 50 ] = max.z;
	array[ 51 ] = max.x; array[ 52 ] = max.y; array[ 53 ] = min.z;

	// 1 -> 5
	array[ 54 ] = min.x; array[ 55 ] = max.y; array[ 56 ] = max.z;
	array[ 57 ] = min.x; array[ 58 ] = max.y; array[ 59 ] = min.z;

	// 2 -> 6
	array[ 60 ] = min.x; array[ 61 ] = min.y; array[ 62 ] = max.z;
	array[ 63 ] = min.x; array[ 64 ] = min.y; array[ 65 ] = min.z;

	// 3 -> 7
	array[ 66 ] = max.x; array[ 67 ] = min.y; array[ 68 ] = max.z;
	array[ 69 ] = max.x; array[ 70 ] = min.y; array[ 71 ] = min.z;

	this.computeLineDistances();

	var width = Math.floor( Math.abs( max.x - min.x ) * 100 ) / 100;
	var height = Math.floor( Math.abs( max.y - min.y ) * 100 ) / 100;
	var depth = Math.floor( Math.abs( max.z - min.z ) * 100 ) / 100;

	var divWidth = document.createElement( 'div' );
	divWidth.className = 'label';
	divWidth.textContent = width + 'mm';
	var divWidthLabel = new THREE.CSS2DObject( divWidth );
	divWidthLabel.position.set( width / 2, 0, depth / 2 );
	this.add( divWidthLabel );

	var divHeight = document.createElement( 'div' );
	divHeight.className = 'label';
	divHeight.textContent = height + 'mm';
	var divHeightLabel = new THREE.CSS2DObject( divHeight );
	divHeightLabel.position.set( 0, - height / 2, depth / 2 );
	this.add( divHeightLabel );

	var divDepth = document.createElement( 'div' );
	divDepth.className = 'label';
	divDepth.textContent = depth + 'mm';
	var divDepthLabel = new THREE.CSS2DObject( divDepth );
	divDepthLabel.position.set( - width / 2, - height / 2, 0 );
	this.add( divDepthLabel );

};


BoxSizeHelper.prototype.setFromObject = function ( object ) {

	this.object = object;
	this.update();

	return this;

};

BoxSizeHelper.prototype.copy = function ( source ) {

	LineSegments.prototype.copy.call( this, source );

	this.object = source.object;

	return this;

};

BoxSizeHelper.prototype.clone = function () {

	return new this.constructor().copy( this );

};

export { BoxSizeHelper };
