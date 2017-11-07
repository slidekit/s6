
class DeckKeysPlugin {

   constructor( deck, options ) {

     document.addEventListener( 'keydown', ev => {
       if( ev.which == 34 || // PAGE DOWN
           ev.which == 39 || // RIGHT
          (ev.which == 32 && !ev.shiftKey)  // SPACE WITHOUT SHIFT
         ) deck.next();

       if( ev.which == 33 || // PAGE UP
           ev.which == 37 || // LEFT
          (ev.which == 32 && ev.shiftKey)  // SPACE + SHIFT
         ) deck.prev();
    });
  }
} // class DeckKeysPlugin
