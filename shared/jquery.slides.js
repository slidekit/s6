/* Just an example for an all-in-one convenience include
   
   create your own slide.js to include your own extensions and
    change the startup (document ready) code as needed
    
    Tell us about your extentions or changes on the forum. Thank!
    Find the forum @ http://groups.google.com/group/webslideshow
 */


$.ajaxSetup({async: false});
$.getScript( 'shared/jquery.slides.core.js' );
$.ajaxSetup({async: true});

$(document).ready( function() {
        
        $( '.layout' )
	  .append( "<div id='controls'>" )
	  .append( "<div id='currentSlide'>" );

	
         defaultCheck();
         addSlideIds();
         createControls();
         
         /* opera is the only browser currently supporting css projection mode */ 
         /* if( !$.browser.opera ) */
           notOperaFix();
					 
	  steps = collectSteps();
         
         if( defaultView == 'outline' ) 
		       toggle();
           
         document.onkeyup = keys;
} );
