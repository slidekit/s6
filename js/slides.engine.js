
/**************************************************
 * bespoke.js-compatible "micro-kernel" in JavaScript 2017+
 *  see https://github.com/bespokejs/bespoke/blob/master/lib/bespoke.js for original bespoke.js source
 */



class DeckEngine {

  static from( opts, plugins ) { return new DeckEngine( opts, plugins ); }

  get parent() { return this._parent; }
  get slides() { return this._slides; }




  constructor( opts, plugins=[] ) {

    const parent = opts.parent || opts;

    this._parent = parent.nodeType === 1 ? parent : document.querySelector( parent );

    console.log( this._parent );             // parent dom element
    console.log( this._parent.children );    // top-level children


    const slides = typeof opts.slides === 'string' ?
                    this._parent.querySelectorAll( opts.slides )
                  : (opts.slides || this._parent.children );


    // slides -> returns HTMLCollection turn into "proper" array - why? why not?
    this._slides = Array.from( slides );
    this._slides = this._slides.filter( el => el.nodeName !== 'SCRIPT' );

    console.log( this._slides );    // slides dom elements


    this.activeSlide = null;

    this.listeners = {};

    plugins.forEach( plugin => plugin( this ) );

    if( !this.activeSlide )
      this.activate( 0 );
  }



  createEventData( el, eventData={} ) {
    eventData.index = this._slides.indexOf( el );
    eventData.slide = el;
    return eventData;
  }


  off( eventName, callback ) {
    this.listeners[eventName] = (this.listeners[eventName] || []).filter( listener => listener !== callback );
  }

  on( eventName, callback ) {
    const listeners = this.listeners[eventName] || (this.listeners[eventName] = []);
    listeners.push( callback );

    //  note:  used for easy unregister (return pre-made/ready-to-call off function - no more args required)
    return () => this.off( eventName, callback );
  }


  fire( eventName, eventData ) {
    console.log( "[DeckEngine] call fire(" + eventName + ")" );

    return( this.listeners[eventName] || [] )
     .reduce( (notCancelled, callback) => notCancelled && callback(eventData) !== false, true );
  }


  destroy( customData ) {
    this.fire( 'destroy', this.createEventData(this.activeSlide, customData));
    this._listeners = {};
  }


  activate( index, customData ) {
    console.log( "[DeckEngine] call activate(" + index + ")" );

    if( !this.slides[index] )
      return;

    if( this.activeSlide )
      this.fire('deactivate', this.createEventData(this.activeSlide, customData));

    this.activeSlide = this.slides[index];
    this.fire( 'activate', this.createEventData(this.activeSlide, customData));
  }



  slide( index, customData ) {
    // note: keep slide() without args for bespoke.js-compatibility
    //   use slide property in new plugins
    if( arguments.length )
      this.fire( 'slide', this.createEventData(this._slides[index], customData)) && this.activate(index, customData);
    else
    {
      console.log( "[DeckEngine] call slide() - DEPRECATED - use slideIndex property instead to get index of active slide" );
      return this.slideIndex;
    }
  }

  // returns active slide index (starting w/ zero)
  get slideIndex() { return this._slides.indexOf( this.activeSlide ); }



  step( offset, customData ) {
    const slideIndex = this._slides.indexOf(this.activeSlide) + offset;
    this.fire( offset > 0 ? 'next' : 'prev', this.createEventData(this.activeSlide, customData)) && this.activate(slideIndex, customData);
  }

  next() { this.step( 1 ) }
  prev() { this.step( -1 ) }
} // class DeckEngine




var S6 = {
  Deck    : DeckEngine,                   // e.g. use like S6.Deck or S6.Classes
  // Classes  : DeckClassesPlugin,
  // Keys     : DeckKeysPlugin,
  // Progress : DeckProgressPlugin,
  classes  : options => deck => new DeckClassesPlugin( deck, options ),
  keys     : options => deck => new DeckKeysPlugin( deck, options ),
  progress : options => deck => new DeckProgressPlugin( deck, options ),
}
