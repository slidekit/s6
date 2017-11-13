
/**************************************************
 * bespoke.js-compatible "micro-kernel" in JavaScript 2017+
 *  see https://github.com/bespokejs/bespoke/blob/master/lib/bespoke.js for original bespoke.js source
 */


class S6_Kernel_Deck {

  // note: use $-convention for (stored/referenced) dom elements
  //       and $$-for dom array elements

  get parent() { return this.$parent; }
  get slides() { return this.$$slides; }



  constructor( { parent, slides, plugins=[] } = {} ) {

    // parent:
    //   pass in string (css) selector
    //     -or-
    //   dom element
    this.$parent = parent.nodeType === 1 ? parent : document.querySelector( parent );

    console.log( this.$parent );             // parent dom element
    console.log( this.$parent.children );    // top-level children


    // slides:
    //   pass in string (css) selector
    //    -or-
    //  dom elements
    //    -or-
    //  empty (default) use parent's children
    const slidesCol = typeof slides === 'string' ?
                      this.$parent.querySelectorAll( slides )
                     : (slides || this.$parent.children );


    // slides -> returns HTMLCollection turn into "proper" array - why? why not?
    this.$$slides = Array.from( slidesCol );
    this.$$slides = this.$$slides.filter( el => el.nodeName !== 'SCRIPT' );

    console.log( this.$$slides );    // slides dom elements


    this.$activeSlide = null;

    this.listeners = {};

    plugins.forEach( plugin => plugin( this ) );

    if( !this.$activeSlide )
      this.activate( 0 );
  }



  createEventData( el, eventData={} ) {
    eventData.index = this.$$slides.indexOf( el );
    eventData.slide = el;
    return eventData;
  }


  off( eventName, callback ) {
    this.listeners[eventName] = (this.listeners[eventName] || [])
       .filter( listener => listener !== callback );
  }

  on( eventName, callback ) {
    const listeners = this.listeners[eventName] || (this.listeners[eventName] = []);
    listeners.push( callback );

    //  note:  used for easy unregister (return pre-made/ready-to-call off function - no more args required)
    return () => this.off( eventName, callback );
  }


  fire( eventName, eventData ) {
    console.log( "[S6.Kernel] call fire(" + eventName + ")" );

    return( this.listeners[eventName] || [] )
     .reduce( (notCancelled, callback) => notCancelled && callback(eventData) !== false, true );
  }


  destroy( customData ) {
    this.fire( 'destroy', this.createEventData( this.$activeSlide, customData ));
    this.listeners = {};
  }


  activate( index, customData ) {
    console.log( "[S6.Kernel] call activate(" + index + ")" );

    if( !this.$$slides[index] )
      return;

    if( this.$activeSlide )
      this.fire( 'deactivate', this.createEventData( this.$activeSlide, customData));

    this.$activeSlide = this.$$slides[index];
    this.fire( 'activate', this.createEventData( this.$activeSlide, customData));
  }



  slide( index, customData ) {
    // note: keep slide() without args for bespoke.js-compatibility
    //   use slideIndex property in new plugins
    if( arguments.length )
      this.fire( 'slide', this.createEventData(this.$$slides[index], customData)) && this.activate(index, customData);
    else
    {
      console.log( "[S6.Kernel] call slide() - DEPRECATED - use slideIndex property instead to get index of active slide" );
      return this.slideIndex;
    }
  }

  // returns active slide index (starting w/ zero)
  get slideIndex() { return this.$$slides.indexOf( this.$activeSlide ); }



  step( offset, customData ) {
    const slideIndex = this.$$slides.indexOf(this.$activeSlide) + offset;
    this.fire( offset > 0 ? 'next' : 'prev', this.createEventData(this.$activeSlide, customData)) && this.activate(slideIndex, customData);
  }

  next() { this.step( 1 ); }
  prev() { this.step( -1 ); }
} // class S6_Kernel_Deck



//////////////////////////////
// add global S6 "export"

var S6 = S6 || {};
S6.Deck = S6_Kernel_Deck;
