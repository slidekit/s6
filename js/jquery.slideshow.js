
var Slideshow = {

  settings: {
    debug: true
  },

  isProjection: false,   // are we in projection (slideshow) mode (in contrast to screen (outline) mode)?     
  snum:   1,             // current slide # (non-zero based index e.g. starting with 1)
  smax:   1,             // max number of slides 
  incpos: 0,             // current step in slide  
  steps:   null,

  $slides: null,
  $stylesProjection: null,
  $stylesScreen: null,

  slideClasses: [ 'far-past', 'past', 'current', 'next', 'far-next' ]
};


/************************************
 * lets you define your own "global" transition function
 *   passes in a reference to from and to slide wrapped in jQuery wrapper
 *
 *  see jquery.slideshow.transition.js for more examples
 */

Slideshow.transition = function( $from, $to ) {
  // do nothing here; by default lets use css3 for transition effects
}


Slideshow.debug = function( msg ) {
  if( this.settings.debug && window.console && window.console.log  )
       window.console.log( '[debug] ' + msg );
}


Slideshow.init = function( options ) {

  this.settings = $.extend({
    mode              : 'slideshow', // slideshow | outline | autoplay
    titleSelector     : 'h1',      
    slideSelector     : '.slide',   // dummy (not yet working)
    stepSelector      : '.step',    // dummy (not yet working)
    debug             :  false,
    normalize         :  true       // normalize selectors (that is, allow aliases
                                    //  e.g. build,action,etc. for step and so on)
  }, options || {});

  this.isProjection = false; // are we in projection (slideshow) mode (in contrast to screen (outline) mode)?     
  this.snum = 1;      // current slide # (non-zero based index e.g. starting with 1)
  this.smax = 1;      // max number of slides 
  this.incpos = 0;    // current step in slide  
  this.steps  = null;

  if( this.settings.normalize == true )
    this.normalize();     

  this.$slides = $( '.slide' );
      
  this.smax = this.$slides.length;
  
  this.addSlideIds();
  this.steps = this.collectSteps();
  this.updateSlides(); // mark slides w/ far-past,past,current,next,far-next

  // $stylesProjection  holds all styles (<link rel="stylesheet"> or <style> w/ media type projection)
  // $stylesScreen      holds all styles (<link rel="stylesheet"> or <style> w/ media type screen)

  // add workaround for chrome
  //  use screen,projection instead of projection
  //  (without projection inline style tag gets not parsed into a styleSheet accesible via JavaScript)

  this.$stylesProjection = $( 'link[media*=projection], style[media*=projection]' ).not('[rel*=less]').not('[type*=less]');
  this.$stylesScreen     = $( 'link[media*=screen], style[media*=screen]' ).not('[media*=projection]').not('[rel*=less]').not('[type*=less]') ;
   
  $( document ).trigger( 'slideshow.init' );  // fire init for addons
 
  this.addClicker();
  
       
  // opera is the only browser currently supporting css projection mode 
  this.notOperaFix();

  // store possible slidenumber from hash */
  // todo: use regex to extract number
  //    might be #slide1 or just #1
 
  var gotoSlideNum = parseInt( window.location.hash.substring(1) );
  this.debug( "gotoSlideNum=" + gotoSlideNum );

  if( !isNaN( gotoSlideNum ))
  {
    this.debug( "restoring slide on (re)load #: " + gotoSlideNum );
    this.goTo( gotoSlideNum );
  }

  if( this.settings.mode == 'outline' ) 
    this.toggle();

  $( document ).trigger( 'slideshow.start' );  // fire start for addons
      
  $( document ).on( 'keyup', $.proxy( Slideshow.keys, this ));
} // end init() 
 
 
Slideshow.normalize = function() {

  // check for .presentation aliases, that is, .deck, .slides
  $( '.deck, .slides' ).addClass( 'presentation' );

  // add slide class to immediate children
  // todo: use autoslide option that lets you turn on/off option?
  $( '.presentation' ).children().addClass( 'slide' );

  // todo: scope with .slide?? e.g  .slide .incremental
  // todo: make removing "old" class an option??

  // check for .step aliases, that is, .incremental, .delayed, .action, .build
  $( '.incremental, .delayed, .action, .build' ).addClass( 'step' );

  // check for .notes aliases, that is, .note, .handout
  $( '.note, .handout' ).addClass( 'notes' );

}

Slideshow.notOperaFix = function() {
   // 1) switch media type from projection to screen

   var self = this;   // NOTE: jquery binds this in .each to element

   this.$stylesProjection.each( function(i) {
     var styleProjection = this;
     // note: no longer used; workaround for chrome needs screen,projection to make it work (thus, no need to switch to screen)
     // styleProjection.media = 'screen';
     styleProjection.disabled = true;
     
     self.debug( "notOperaFix - stylesProjection["+i+"] switching media type from projection to screen" );
   } );
   
   this.isProjection = false;
   
   // 2) disable screen styles and enable projection styles (thus, switch into projection mode)
   this.toggle();
   
   // now we should be in project mode
} // end notOperatFix()


Slideshow.toggle = function() {
  // todo: use settings.isProjection for state tracking
  //  and change disable accordingly (plus assert that all styles are in the state as expected)

  // toggle between projection (slide show) mode
  //   and screen (outline) mode

  var self = this;   // NOTE: jquery binds this in .each to element

  this.$stylesProjection.each( function(i) {          
     var styleProjection = this;
     
     styleProjection.disabled = !styleProjection.disabled;
       
     self.debug( "toggle - stylesProjection["+i+"] disabled? " + styleProjection.disabled );
   });
  
  this.$stylesScreen.each( function(i) {          
     var styleScreen = this;

     styleScreen.disabled = !styleScreen.disabled;
       
     self.debug( "toggle - stylesScreen["+i+"] disabled? " + styleScreen.disabled );
     
     // update isProjection flag 
     self.isProjection = styleScreen.disabled;
   });
  
/*
 * note: code no longer needed; using (adding/removing) css classes hide/show)
 *

  if( this.isProjection )
  {
    this.$slides.each( function(i) {
      if( i == (self.snum-1) )
        $(this).show();
      else
        $(this).hide();
    });    
  }
  else
  {
    this.$slides.show();
  }
*/
} // end toggle()

  
Slideshow.updatePermaLink = function()
{
  // todo: unify hash marks??; use #1 for div ids instead of #slide1? 
  window.location.hash = '#'+ this.snum;
}

Slideshow.goTo = function( target )
{
 if( target > this.smax || target == this.snum )
   return;

 this.go( target - this.snum );
}
 
Slideshow.go = function( dir )
{
  this.debug( 'go: ' + dir );
  
  if( dir == 0 ) return;  /* same slide; nothing to do */

  var cid = '#slide' + this.snum;   /* current slide (selector) id */
  var csteps = this.steps[ this.snum-1 ];  /* current slide steps array */

  /* remove all step and stepcurrent classes from current slide */
  if( csteps.length > 0) {
     $( csteps ).each( function() {
       $(this).removeClass( 'step' ).removeClass( 'stepcurrent' );
     } );
   }

  /* set snum to next slide */
  this.snum += dir;
  if( this.snum > this.smax ) this.snum = this.smax;
  if( this.snum < 1 ) this.snum = 1;
  
  var nid = '#slide' + this.snum;  /* next slide (selector) id */
  var nsteps = this.steps[this.snum-1]; /* next slide steps array */
  
	if( dir < 0 ) /* go backwards? */
	{
		this.incpos = nsteps.length;
		/* mark last step as current step */
		if( nsteps.length > 0 ) 
			$( nsteps[this.incpos-1] ).addClass( 'stepcurrent' );		
	}
	else /* go forwards? */
	{
		this.incpos = 0;
	  if( nsteps.length > 0 ) {
		  $( nsteps ).each( function() {
				$(this).addClass( 'step' ).removeClass( 'stepcurrent' );
			} );
		}
	}	
	
  if( !(cid == nid) ) {
    this.updateSlides();

    this.debug( "transition from " + cid + " to " + nid );
    this.transition( $( cid ), $( nid ) );

    // only fire change event if slide changes
    $( document ).trigger( 'slideshow.change', [$( cid ), $( nid )]);
  }
  
  this.updatePermaLink();
} // end go()


Slideshow.updateSlideClass = function( $slide, className )
{
  if( className )
    $slide.addClass( className );
  
  for( var i in this.slideClasses )
  {
    if( className != this.slideClasses[i] )
      $slide.removeClass( this.slideClasses[i] );
  }
}

Slideshow.updateSlides = function()
{
  var self = this;
  this.$slides.each( function( i ) {
    switch( i ) {
      case (self.snum-1)-2:
        self.updateSlideClass( $(this), 'far-past' );
        break;
      case (self.snum-1)-1:
        self.updateSlideClass( $(this), 'past' );
        break;
      case (self.snum-1):
        self.updateSlideClass( $(this), 'current' );
        break;
      case (self.snum-1)+1:
        self.updateSlideClass( $(this), 'next' );
        break;
      case (self.snum-1)+2:
        self.updateSlideClass( $(this), 'far-next' );
        break;
      default:
        self.updateSlideClass( $(this) );
        break;
     }
  });
}



Slideshow.subgo = function( dir )
{
   this.debug( 'subgo: ' + dir + ', incpos before: ' + this.incpos + ', after: ' + (this.incpos+dir) );
	
	var csteps = this.steps[this.snum-1]; /* current slide steps array */
	
	if( dir > 0)
  {  /* go forward? */
		if( this.incpos > 0 )
      $( csteps[this.incpos-1] ).removeClass( 'stepcurrent' );
		$( csteps[this.incpos] ).removeClass( 'step').addClass( 'stepcurrent' ); 
		this.incpos++;
	}
  else
  { /* go backwards? */
		this.incpos--;
		$( csteps[this.incpos] ).removeClass( 'stepcurrent' ).addClass( 'step' );
		if( this.incpos > 0 )
      $( csteps[this.incpos-1] ).addClass( 'stepcurrent' );
	}
} // end subgo()


Slideshow.keys = function( key )
{  
  this.debug( "enter keys()" );
  
  if( !key ) {
    key = event;
    key.which = key.keyCode;
  }
  if( key.which == 84 ) {
    this.toggle();  // toggle between project and screen css media mode 
    return;
  }
  if( this.isProjection ) {
    switch( key.which ) {
      case 32: // spacebar
      case 34: // page down
      case 39: // rightkey
      case 40: // downkey

      var csteps = this.steps[this.snum-1]; /* current slide steps array */
        
      if( !csteps || this.incpos >= csteps.length ) {
					this.go(1);
				} else {
					this.subgo(1);
				}
				break;
			case 33: // page up
			case 37: // leftkey
			case 38: // upkey
					
					if( !this.steps[this.snum-1] || this.incpos <= 0 ) {
					  this.go(-1);
				  } else {
					  this.subgo(-1);
					}
				  break;
      case 36: // home
				this.goTo(1);
				break;
			case 35: // end
				this.goTo( this.smax );
				break;   
      case 68: // d
        this.toggleDebug();
        break;
		}
		$( document ).trigger( 'slideshow.keys', key );
	}
} // end keys()


Slideshow.toggleDebug = function()
{
   this.settings.debug = !this.settings.debug;
   this.doDebug();
}

Slideshow.doDebug = function()
{
   if( this.settings.debug == true )
   {
      $( document ).trigger( 'slideshow.debug.on' );
   }
   else
   {
      $( document ).trigger( 'slideshow.debug.off' );
   }
}

Slideshow.collectStepsWorker = function(obj)
{
  var self = this;   // NOTE: jquery binds this in .each,.click, etc to element
  
  var steps = []; 
  if( !obj ) 
    return steps;
	
  $(obj).children().each( function() {
    if( $(this).hasClass( 'step' ) ) {
		
      self.debug( 'step found for ' + this.tagName );
      $(this).removeClass( 'step' );

      /* don't add enclosing list; instead add step class to all list items/children */
      if( $(this).is( 'ol,ul' ) ) {
	self.debug( '  ol or ul found; adding auto steps' );
	$(this).children().addClass( 'step' );
      }
      else
      {
	steps.push( this )
      }
    }
    steps = steps.concat( self.collectStepsWorker( this ) );
  });
	
  return steps;
} // end collectStepWorkers

Slideshow.collectSteps = function()
{
  var self = this;   // NOTE: jquery binds this in .each,.click, etc to element
	
  var steps = [];

  this.$slides.each( function(i) {
    self.debug ( 'collectSteps for ' + this.id + ':' );
    steps[i] = self.collectStepsWorker( this );
  });
	
  $( steps ).each( function(i) {
    self.debug( 'slide ' + (i+1) + ': found ' + this.length + ' steps' );	
  });
       
  return steps;
} // end collectSteps()


Slideshow.addClicker = function()
{
  var self = this;   // NOTE: jquery binds this in .each,.click, etc to element

  // if you click on heading of slide -> go to next slide (or next step)
   
  $( this.settings.titleSelector, this.$slides ).click( function( ev ) {
    if(ev.which != 1) return;  // only process left clicks (e.g 1; middle and rightclick use 2 and 3)

    if( !self.isProjection )  // suspend clicker in outline view (just slideshow view)
      return;
     
    var csteps = self.steps[self.snum-1]; // current slide steps array 
    if ( !csteps || self.incpos >= csteps.length ) 
      self.go(1);
    else 
      self.subgo(1);
  });
   
   
   $( this.settings.titleSelector, this.$slides ).on('contextmenu', function() { 
      if( !self.isProjection )  // suspend clicker in outline view (just slideshow view)
        return;

      var csteps = self.steps[self.snum-1]; // current slide steps array 
      if ( !csteps || self.incpos >= csteps.length ) 
         self.go(-1);
      else 
         self.subgo(-1);

      return false;
   } );       
} // end addClicker()


Slideshow.addSlideIds = function() {
  this.$slides.each( function(i) {
    this.id = 'slide'+(i+1);
  });
}


Slideshow.addStyles = function() {
  this.debug( 'add builtin css via inline style elements' );
  
   var styleProjection =
"<style media='screen,projection'>           \n"+
" .slide  { display: block;  }               \n"+
" .notes  { display: none;   }               \n"+
" .layout { display: block;  }               \n"+
"</style>";

   var styleScreen =
"<style media='screen'>                      \n"+
"/****                                           \n"+
" * hide layout stuff (header, footer, navLinks, navList etc.) \n"+
" */                                             \n"+
"                                                \n"+
" .layout * { display: none; }                   \n"+
"</style>";

   var stylePrint =
"<style media='print'>                              \n"+
"                                                   \n"+
" .slide { display: block !important; }             \n"+
" .layout, .layout * { display: none !important; }  \n"+
"                                                   \n"+
"/******                                            \n"+
" * Turn on print-specific stuff/classes            \n"+
" */                                                \n"+
"                                                   \n"+
" .extra { display: block !important; }             \n"+
"</style>";

   // note: use prepend (not append) to make sure this
   // styles come first (and do not overrule user supplied styles)

    $( 'head' ).prepend( styleProjection );
    $( 'head' ).prepend( styleScreen );
    $( 'head' ).prepend( stylePrint );
}

Slideshow.addStyles();
