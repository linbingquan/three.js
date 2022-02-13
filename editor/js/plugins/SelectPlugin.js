class SelectPlugin {

	constructor( editor ) {

		this.editor = editor;

		this.selected = null;

		this.disabled = false;

	}

	intersects( intersects ) {

		if ( this.disabled ) {

			return;

		}

		if ( intersects ) {

			const object = intersects[ 0 ].object;

			this.select( object );

		} else {

			this.select( null );

		}

	}

	select( object ) {

		if ( this.selected === object ) return;

		var uuid = null;

		if ( object !== null ) {

			uuid = object.uuid;

		}

		this.selected = object;

		const editor = this.editor;

		editor.config.setKey( 'selected', uuid );

		editor.signals.objectSelected.dispatch( object );

	}

}

export { SelectPlugin };
