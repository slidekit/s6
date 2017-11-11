
class DeckProgressPlugin {

  constructor( deck, options ) {

    console.log( "[DeckProgressPlugin] ctor" );

    const progressParent = document.createElement('div'),
          progressBar    = document.createElement('div');

    progressParent.className = 'bespoke-progress-parent';
    progressBar.className    = 'bespoke-progress-bar';
    progressParent.appendChild( progressBar );
    deck.parent.appendChild( progressParent );

    deck.on( 'activate', ev =>
      progressBar.style.width = (ev.index * 100 / (deck.slides.length - 1)) + '%'
    );
  }
} // class DeckProgressPlugin



//////////////////////////////
// add global S6 "export"
//   e.g. lets you call progress( options ) for plugins array config

var S6 = S6 || {};
S6.progress = options => deck => new DeckProgressPlugin( deck, options );
