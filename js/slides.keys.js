
// todo: use class expression to "namespace"
//   S6.Plugins.Keys  or S6.DeckKeysPlugin for now ???


class DeckKeysPlugin {

   constructor( deck, options ) {

     document.addEventListener( 'keydown', ev => {
       if( ev.which == 34 || // PAGE DOWN
           ev.which == 39 || // RIGHT
           ev.which == 40 || // DOWN
          (ev.which == 32 && !ev.shiftKey)  // SPACE WITHOUT SHIFT
         ) deck.next();

       if( ev.which == 33 || // PAGE UP
           ev.which == 37 || // LEFT
           ev.which == 38 || // UP
          (ev.which == 32 && ev.shiftKey)  // SPACE + SHIFT
         ) deck.prev();
    });
  }
} // class DeckKeysPlugin



//////////////////////////////
// add global S6 "export"
//   e.g. lets you call keys( options ) for plugins array config

var S6 = S6 || {};
S6.keys = options => deck => new DeckKeysPlugin( deck, options );
