class Plugins {

	constructor( editor ) {

		this.editor = editor;

		this.plugins = {};

	}

	registerPlugin( name, plugin ) {

		if ( this.plugins[ name ] === undefined ) {

			this.plugins[ name ] = [];

		}

		this.plugins[ name ].push( plugin );

	}

	unregisterPlugin( name, plugin ) {

		const plugins = this.plugins[ name ];

		if ( plugins ) {

			const index = this.plugins[ name ].indexOf( plugin );

			if ( index > - 1 ) this.plugins[ name ].splice( index, 1 );

		}

	}

	dispatch( pluginName, functionName, payload ) {

		const plugins = this.plugins[ pluginName ];

		if ( plugins ) {

			for ( const index in plugins ) {

				const plugin = plugins[ index ];

				if ( plugin[ functionName ] ) {

					plugin[ functionName ]( payload );

				}

			}

		}

	}

}

export { Plugins };
