/**
 * @author linbingquan / https://github.com/linbingquan
 */

THREE.DrawControls = function ( camera, domElement ) {

	// THREE.Object3D.call( this );

	domElement = domElement !== undefined ? domElement : document;

	// API

	this.enabled = false;

	var scope = this;
	var vector3List = [];
	var raycaster = new THREE.Raycaster();

	function getPointer( event ) {

		var pointer = event.changedTouches ? event.changedTouches[ 0 ] : event;

		var rect = domElement.getBoundingClientRect();

		return {
			x: ( ( pointer.clientX - rect.left ) / rect.width ) * 2 - 1,
			y: ( - ( pointer.clientY - rect.top ) / rect.height ) * 2 + 1,
			button: event.button
		};

	}

	function onMouseDown( event ) {

		if ( scope.enabled === false ) return;

		event.preventDefault();

		var pointer = getPointer( event );

		raycaster.setFromCamera( pointer, camera );

		var intersect =
			raycaster.intersectObjects( editor.scene.children, true )[ 0 ] || false;

		if ( intersect ) {

			vector3List.push( intersect.point );

		}

	}

	function onMouseMove( event ) {

		if ( scope.enabled === false ) return;

	}

	function onKeyDown( event ) {

		if ( event.code === "Space" ) {

			extrudeMesh( vector3List );

			vector3List = [];

		}

	}

	function extrudeMesh( vector3List ) {

		var shape = new THREE.Shape();

		for ( let index = 0; index < vector3List.length; index ++ ) {

			const _vector3 = vector3List[ index ];
			if ( index === 0 ) {

				shape.moveTo( _vector3.x, _vector3.y );

			} else {

				shape.lineTo( _vector3.x, _vector3.y );

			}

		}

		var extrudeSettings = {
			steps: 2,
			depth: 1, // TODO: 动态获取 深度
			bevelEnabled: false,
			bevelThickness: 1,
			bevelSize: 1,
			bevelSegments: 1
		};

		var geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );
		var material = new THREE.MeshStandardMaterial();
		var mesh = new THREE.Mesh( geometry, material );

		editor.execute( new AddObjectCommand( mesh ) );

	}

	domElement.addEventListener( "mousedown", onMouseDown, false );
	domElement.addEventListener( "mousemove", onMouseMove, false );
	document.addEventListener( "keydown", onKeyDown, false );

};

// THREE.DrawControls.prototype = Object.assign( Object.create( THREE.Object3D.prototype ), {

// 	constructor: THREE.DrawControls,

// 	isDrawControls: true

// } );

THREE.DrawControls.prototype = Object.create( THREE.EventDispatcher.prototype );
THREE.DrawControls.prototype.constructor = THREE.DrawControls;
