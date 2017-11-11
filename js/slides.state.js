

class DeckStatePlugin {

  constructor( deck, options ) {

    console.log( "[DeckProgressPlugin] ctor");

    const updateState = (method, ev) => {
      console.log( "[DeckProgressPlugin] updateState method="+method );

      const attr = ev.slide.getAttribute( 'data-bespoke-state' );

      if( attr )
        attr.split(' ').forEach( state => deck.parent.classList[method](state) );
    };

    deck.on( 'activate',   ev => updateState( 'add',    ev ));
    deck.on( 'deactivate', ev => updateState( 'remove', ev ));
  }
}  // class DeckStatePlugin



//////////////////////////////
// add global S6 "export"
//   e.g. lets you call state( options ) for plugins array config

var S6 = S6 || {};
S6.state = options => deck => new DeckStatePlugin( deck, options );
