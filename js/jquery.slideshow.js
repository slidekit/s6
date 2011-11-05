
var Slideshow = {

  // variables
  settings: {},

  isProjection: false,   // are we in projection (slideshow) mode (in contrast to screen (outline) mode)?     
  snum:   1,             // current slide # (non-zero based index e.g. starting with 1)
  smax:   1,             // max number of slides 
  incpos: 0,             // current step in slide  
  steps:   null,
  autoplayInterval: null,

  $slides: null,
  $stylesProjection: null,
  $stylesScreen: null
};


/************************************
 * lets you define your own "global" transition function
 *   passes in a reference to from and to slide wrapped in jQuery wrapper
 */

Slideshow.transition = function( $from, $to ) {
  
  $from.hide();
  $to.show();
  
  // $from.hide('fast');
  // $to.show('fast'); 
}

/* todo: move transitions code to jquery.slideshow.effects.js ?? */

/***********************
 * sample custom transition using scrollUp effect
 * inspired by Karl Swedberg's Scroll Up Headline Reader jQuery Tutorial[1]
 * [1] http://docs.jquery.com/Tutorials:Scroll_Up_Headline_Reader
 */

function transitionSlideUpSlideDown( $from, $to ) {
  $from.slideUp( 500, function() { $to.slideDown( 1000 ); } );
}

function transitionFadeOutFadeIn( $from, $to ) {
  $from.fadeOut( 500 );
  $to.fadeIn( 500 );
}

function transitionScrollUp( $from, $to ) {   
  var cheight = $from.outerHeight();

  // hide scrollbar during animation
  $( 'body' ).css( 'overflow-y', 'hidden' );

  $to.css( 'top', cheight+'px' );
  $to.show();

  $from.animate( {top: -cheight}, 'slow' );
  $to.animate( {top: 0}, 'slow', function() {
    $from.hide().css( 'top', '0px');

    // restore possible scrollbar 
    $( 'body' ).css( 'overflow-y', 'auto' );
  }); 
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
    debug             :  true
  }, options || {});

  this.isProjection = false; // are we in projection (slideshow) mode (in contrast to screen (outline) mode)?     
  this.snum = 1;      // current slide # (non-zero based index e.g. starting with 1)
  this.smax = 1;      // max number of slides 
  this.incpos = 0;    // current step in slide  
  this.steps  = null;
  this.autoplayInterval = null;

  this.$slides           = $( '.slide' );
      
  this.smax = this.$slides.length;
  
   
  this.addSlideIds();
  this.steps = this.collectSteps();
     
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
  else if( this.settings.mode == 'autoplay' )
    this.toggleAutoplay();
      
  $( document ).bind( 'keyup', $.proxy( Slideshow.keys, this ));
} // end init() 
 

  
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
    this.debug( "transition from " + cid + " to " + nid );
    this.transition( $( cid ), $( nid ) );
  }
  
  this.updatePermaLink(); 
  
  $( document ).trigger( 'slideshow.change' );
} // end go()


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
 
   
   
  
Slideshow.toggleFooter = function()
{
  $( '#footer, footer').toggle(); 
}

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
      case 65: //a
			case 80: //p
			case 83: //s
				this.toggleAutoplay();
				break;
      case 70: //f
        this.toggleFooter();
        break;
      case 68: // d
        this.toggleDebug();
        break;
		}
		$( document ).trigger( 'slideshow.keys', key );
	}
} // end keys()

Slideshow.autoplay = function()
{
  // suspend autoplay in outline view (just slideshow view)
  if( !this.isProjection )
    return;

  // next slide/step, please
  var csteps = this.steps[this.snum-1]; // current slide steps array 
  
  if( !csteps || this.incpos >= csteps.length ) {
    if( this.snum >= this.smax )
      this.goTo( 1 );   // reached end of show? start with 1st slide again (for endless cycle)
    else
      this.go(1);
  }
  else {
    this.subgo(1);
  }
} // end autoplay()

Slideshow.toggleDebug = function()
{
   this.settings.debug = !this.settings.debug;
   this.doDebug();
}

Slideshow.doDebug = function()
{
   // fix/todo: save background into oldbackground
   //  so we can restore later 
   
   if( this.settings.debug == true )
   {
      $( '#header,header' ).css( 'background', '#FCC' );
      $( '#footer,footer' ).css( 'background', '#CCF' );

      $( document ).trigger( 'slideshow.debug.on' );
   }
   else
   {
      $( '#header,header' ).css( 'background', 'transparent' );
      $( '#footer,footer' ).css( 'background', 'transparent' );

      $( document ).trigger( 'slideshow.debug.off' );
   }
}

Slideshow.toggleAutoplay = function()
{
  if( this.autoplayInterval )
  {
    clearInterval( this.autoplayInterval );
    this.autoplayInterval = null;
  }
  else
  {
   this.autoplayInterval = setInterval( this.autoplay, 2000 );
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
   
   
   $( this.settings.titleSelector, this.$slides ).bind('contextmenu', function() { 
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
"<style media='screen,projection'>               \n"+
" .slide { display: block;  }                    \n"+
" .notes, .note, .handout { display: none;   }   \n"+
" .layout { display: block; }                    \n"+
"</style>";

   var styleScreen =
"<style media='screen'>                      \n"+
"/****                                           \n"+
" * hide layout stuff (header, footer, navLinks, navList etc.) \n"+
" */                                             \n"+
"                                                \n"+
" .layout * { display: none; }                   \n"+
"                                                \n"+
" .projection { display: none; }                 \n"+
"</style>";

   var stylePrint =
"<style media='print'>                              \n"+
"                                                   \n"+
" .slide { display: block !important; }             \n"+
" .projection { display: none; }                    \n"+
" .layout, .layout * { display: none !important; }  \n"+
"                                                   \n"+
"/******                                    \n"+
" * Turn on print-specific stuff/classes    \n"+
" */                                        \n"+
"                                           \n"+
" .extra { background: transparent !important; }  \n"+
" div.extra, pre.extra, .example { font-size: 10pt; color: #333; } \n"+
" ul.extra a { font-weight: bold; }         \n"+
"                                           \n"+
"/*****                                     \n"+
" * Turn off online (screen/projection)-specific stuff/classes \n"+
" */                                        \n"+
"                                           \n"+
" p.example { display: none; }              \n"+
"                                           \n"+
"</style>";

    $( 'head' ).append( styleProjection );
    $( 'head' ).append( styleScreen );
    $( 'head' ).append( stylePrint );
}

Slideshow.addStyles();