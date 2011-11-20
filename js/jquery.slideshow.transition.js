
function transition( $from, $to ) {
  $from.hide();
  $to.show();
}

function transitionSlideUpSlideDown( $from, $to ) {
  $from.slideUp( 500, function() { $to.slideDown( 1000 ); } );
}

function transitionFadeOutFadeIn( $from, $to ) {
  $from.fadeOut( 500 );
  $to.fadeIn( 500 );
}

/***********************
 * sample custom transition using scrollUp effect
 * inspired by Karl Swedberg's Scroll Up Headline Reader jQuery Tutorial[1]
 * [1] http://docs.jquery.com/Tutorials:Scroll_Up_Headline_Reader
 */

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