
var Slideshow = {};

Slideshow.init = function( options ) {

  var settings = $.extend({
     defaultView       : 'slideshow', // slideshow | outline
     projectionStyleId : '#styleProjection',
	   screenStyleId     : '#styleScreen',
     slideSelector     : '.slide',   // dummy (not yet working)
     titleSelector     : 'h1',       // dummy (not yet working)
     stepSelector      : '.step'    // dummy (not yet working)
  }, options || {});

  settings.isProjection = true; // are we in projection (slideshow) mode (in contrast to screen (outline) mode)?     
  settings.snum = 1;      // current slide # (non-zero based index e.g. starting with 1)
  settings.smax = 1;      // max number of slides 
  settings.incpos = 0;    // current step in slide  
  settings.steps  = null;    
   
  function debug( msg ) 
  {
    if( window.console && window.console.log )
      console.log( '[debug] ' + msg ); 
  }   

  function showHide( action )
  {
    var $navLinks = $( '#navLinks' )  
       
    switch( action ) {
      case 's': $navLinks.css( 'visibility', 'visible' );  break;
      case 'h': $navLinks.css( 'visibility', 'hidden' );   break;
      case 'c':  /* toggle control panel */
          if( $navLinks.css( 'visibility' ) != 'visible' )
             $navLinks.css( 'visibility', 'visible' );
          else
             $navLinks.css( 'visibility', 'hidden' );
          break; 
    }
  }  
   
  function updateCurrentSlideCounter()
  { 
      $( '#currentSlide' ).html( '<a id="plink" href="">'
         + '<span id="csHere">' + settings.snum + '<\/span> '
         + '<span id="csSep">\/<\/span> ' 
         + '<span id="csTotal">' + settings.smax + '<\/span>'
         + '<\/a>' );
  }
  
  function updateJumpList()
  {
      $('#jumplist').get(0).selectedIndex = (settings.snum-1);
  }
  
  function updatePermaLink()
  {
      $('#plink').get(0).href = window.location.pathname + '#slide' + settings.snum;
  }

  function goTo( target )
  {
       if( target > settings.smax || target == settings.snum ) return;
       go( target - settings.snum );
  }
 
  function go( dir )
  {
    debug( 'go: ' + dir );
  
    if( dir == 0 ) return;  /* same slide; nothing to do */

    var cid = '#slide' + settings.snum;   /* current slide (selector) id */
    var csteps = settings.steps[settings.snum-1];  /* current slide steps array */

    /* remove all step and stepcurrent classes from current slide */
   if( csteps.length > 0) {
     $( csteps ).each( function() {
       $(this).removeClass( 'step' ).removeClass( 'stepcurrent' );
     } );
   }

  /* set snum to next slide */
  settings.snum += dir;
  if( settings.snum > settings.smax ) settings.snum = settings.smax;
  if( settings.snum < 1 ) settings.snum = 1;
  
  var nid = '#slide' + settings.snum;  /* next slide (selector) id */
  var nsteps = settings.steps[settings.snum-1]; /* next slide steps array */															  
  
	if( dir < 0 ) /* go backwards? */
	{
		settings.incpos = nsteps.length;
		/* mark last step as current step */
		if( nsteps.length > 0 ) 
			$( nsteps[settings.incpos-1] ).addClass( 'stepcurrent' );		
	}
	else /* go forwards? */
	{
		settings.incpos = 0;
	  if( nsteps.length > 0 ) {
		  $( nsteps ).each( function() {
				$(this).addClass( 'step' ).removeClass( 'stepcurrent' );
			} );
		}
	}	
	
  $( cid ).hide();
  $( nid ).show();
  
  updateJumpList();
  updateCurrentSlideCounter();
  updatePermaLink(); 
}

 function subgo( dir )
 {
	debug( 'subgo: ' + dir + ', incpos before: ' + settings.incpos + ', after: ' + (settings.incpos+dir) );
	
	var csteps = settings.steps[settings.snum-1]; /* current slide steps array */
	
	if( dir > 0)
  {  /* go forward? */
		if( settings.incpos > 0 )
      $( csteps[settings.incpos-1] ).removeClass( 'stepcurrent' );
		$( csteps[settings.incpos] ).removeClass( 'step').addClass( 'stepcurrent' ); 
		settings.incpos++;
	}
  else
  { /* go backwards? */
		settings.incpos--;
		$( csteps[settings.incpos] ).removeClass( 'stepcurrent' ).addClass( 'step' );
		if( settings.incpos > 0 )
      $( csteps[settings.incpos-1] ).addClass( 'stepcurrent' );
	}
}


function notOperaFix()
{          
   $( settings.projectionStyleId ).attr( 'media','screen' );
              
   var styleScreen = $( settings.screenStyleId ).get(0);
   styleScreen.disabled = true;
}    


function toggle()
{
  // toggle between projection (slide show) mode
  //   and screen (outline) mode

  // get stylesheets 
	var styleProjection  = $( settings.projectionStyleId ).get(0);
	var styleScreen      = $( settings.screenStyleId ).get(0);
	
  if( !styleProjection.disabled )
  {
		styleProjection.disabled = true;
		styleScreen.disabled     = false;
		settings.isProjection    = false;
    $('.slide').each( function() { $(this).show(); } );
	}
  else
  {
		styleProjection.disabled = false;
		styleScreen.disabled     = true;
		settings.isProjection    = true;
    $('.slide').each( function(i) {
      if( i == (settings.snum-1) )
        $(this).show();
      else
        $(this).hide();
    });
	}
}
 
 
   function populateJumpList() {
    
     var list = $('#jumplist').get(0);
    
     $( '.slide' ).each( function(i) {              
       list.options[list.length] = new Option( (i+1)+' : '+ $(this).find('h1').text(), (i+1) );
     });
   } 
   
   function createControls()
   {	  
  
     $( '.layout' )
	    .append( "<div id='controls'>" )
	    .append( "<div id='currentSlide'>" );
 
      var $controls = $( '#controls' )
    
   	 $controls.html(  '<div id="navLinks">' 
	    + '<a accesskey="t" id="toggle" href="#">&#216;<\/a>' 
	    + '<a accesskey="z" id="prev" href="#">&laquo;<\/a>' 
	    + '<a accesskey="x" id="next" href="#">&raquo;<\/a>' 
	    + '<div id="navList"><select id="jumplist" /><\/div>' 
	    + '<\/div>' ); 
      
      $controls.mouseover( function() { showHide('s'); } );
      $controls.mouseout( function()  { showHide('h'); } );
      $('#toggle').click( function() { toggle(); } );
      $('#prev').click( function() { go(-1); } );
      $('#next').click( function() { go(1); } );
       
      $('#jumplist').change( function() { goTo( parseInt( $( '#jumplist' ).val() )); } );
  	
      populateJumpList();     
      updateCurrentSlideCounter();
   }
   
   function addSlideIds() {
     var $slides = $( '.slide' )  
       
     $slides.each( function(i) {
        $(this).attr( 'id', 'slide'+(i+1) );
        // todo: can we just use this.id = xxx
     });
       
     settings.smax = $slides.length;
   }
   
     
  function keys(key)
  {
	if (!key) {
		key = event;
		key.which = key.keyCode;
	}
	if (key.which == 84) {
		toggle();
		return;
	}
	if( settings.isProjection ) {
		switch (key.which) {
			case 32: // spacebar
			case 34: // page down
			case 39: // rightkey
			case 40: // downkey
				
        var csteps = settings.steps[settings.snum-1]; /* current slide steps array */
        
				if ( !csteps || settings.incpos >= csteps.length ) {
					go(1);
				} else {
					subgo(1);
				}
				break;
			case 33: // page up
			case 37: // leftkey
			case 38: // upkey
					
					if( !settings.steps[settings.snum-1] || settings.incpos <= 0 ) {
					  go(-1);
				  } else {
					  subgo(-1);
					}
				  break;
      case 36: // home
				goTo(1);
				break;
			case 35: // end
				goTo(smax);
				break;   
			case 67: // c
				showHide('c');
				break;
		}
	}
}


function collectStepsWorker(obj) {
	
	var steps = new Array();
	if( !obj ) 
		return steps;
	
	$(obj).children().each( function() {
	  if( $(this).hasClass( 'step' ) ) {
			
			debug( 'step found for ' + this.tagName );
			$(this).removeClass( 'step' );

			/* don't add enclosing list; instead add step class to all list items/children */
			if( $(this).is( 'ol,ul' ) ) {
				debug( '  ol or ul found; adding auto steps' );
				$(this).children().addClass( 'step' );
			}
			else
			{
				steps.push( this )
			}
		}
	 	
		steps = steps.concat( collectStepsWorker(this) );
	});
	
  return steps;
}

function collectSteps() {
	
	var steps = new Array();

  $( '.slide' ).each(	function(i) {
		debug ( $(this).attr( 'id' ) + ':' );
		steps[i] = collectStepsWorker( this );
  });
	
	$( steps ).each( function(i) {
	  debug( 'slide ' + (i+1) + ': found ' + this.length + ' steps' );	
	});
       
  return steps;
}

   // init code here
   
   addSlideIds();
   createControls();
         
   /* opera is the only browser currently supporting css projection mode */ 
   /* if( !$.browser.opera ) */
   notOperaFix();
					 
   settings.steps = collectSteps();
         
   if( settings.defaultView == 'outline' ) 
     toggle();
           
   document.onkeyup = keys;

} // end Slideshow
