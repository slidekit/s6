

class S6_Plugin_Classes {
   constructor( deck ) {
     console.log( "[S6.Plugin.Classes] ctor" );

     this.deck = deck;

     this.addClass( deck.parent, 'parent' );
     deck.slides.forEach( el => this.addClass( el, 'slide') );

     deck.on( 'activate', ev => {
        deck.slides.forEach( (el, index) => this.deactivate(el, index) );
        this.addClass( ev.slide, 'active' );
        this.removeClass( ev.slide, 'inactive' );
      })
   }


  addClass( el, cls ) {
    console.log( "[S6.Plugin.Classes] addClass >" + cls + "<" );
    el.classList.add( 'bespoke-' + cls );
  }

  removeClass( el, cls ) {
    console.log( "[S6.Plugin.Classes] removeClass >" + cls + "<" );
    el.className = el.className
          .replace( new RegExp('bespoke-' + cls +'(\\s|$)', 'g'), ' ' )
          .trim();
  }

  deactivate( el, index ) {
    const activeSlide = this.deck.slides[ this.deck.slideIndex ],
          offset      = index - this.deck.slideIndex,
          offsetClass = offset > 0 ? 'after' : 'before';

    console.log( "[S6.Plugin.Classes] deactivate index=" + index + ",offset=" + offset );
    console.log( el );

    ['before(-\\d+)?',
     'after(-\\d+)?',
     'active',
     'inactive'].forEach( cls => this.removeClass( el, cls ) );

    if( el !== activeSlide )
      ['inactive', offsetClass, `${offsetClass}-${Math.abs(offset)}`].forEach( cls => this.addClass( el, cls ) );
  }
} // class S6_Plugin_Classes


//////////////////////////////
// add global S6 "export"
//   e.g. lets you call classes( options ) for plugins array config

var S6 = S6 || {};
S6.classes = options => deck => new S6_Plugin_Classes( deck, options );
