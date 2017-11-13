

class S6_Plugin_State {

  constructor( deck, options ) {

    console.log( "[S6.Plugin.State] ctor");

    const updateState = (method, ev) => {
      console.log( "[S6.Plugin.State] updateState method="+method );

      const attr = ev.slide.getAttribute( 'data-bespoke-state' );

      if( attr )
        attr.split(' ').forEach( state => deck.parent.classList[method](state) );
    };

    deck.on( 'activate',   ev => updateState( 'add',    ev ));
    deck.on( 'deactivate', ev => updateState( 'remove', ev ));
  }
}  // class S6_Plugin_State



//////////////////////////////
// add global S6 "export"
//   e.g. lets you call state( options ) for plugins array config

var S6 = S6 || {};
S6.state = options => deck => new S6_Plugin_State( deck, options );
