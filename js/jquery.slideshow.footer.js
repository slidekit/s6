/***********
 *
 *  footer/header addon:
 *
 *   adds footer/header
 *   - use key-f to toggle footer/header (in projection mode)
 *
 *   layout structure:
 *
 *  .layout
 *    > #header
 *    > #footer
 */


Slideshow.footerDebugOn = function()
{
  this.debug( 'calling footerDebugOn()' );

  $( '.layout #header,.layout header' ).addClass( 'debug' );
  $( '.layout #footer,.layout footer' ).addClass( 'debug' );
}

Slideshow.footerDebugOff = function()
{
  this.debug( 'calling footerDebugOff()' );

  $( '.layout #header,.layout header' ).removeClass( 'debug' );
  $( '.layout #footer,.layout footer' ).removeClass( 'debug' );
}

Slideshow.footerKeys = function( event, key )
{
  this.debug( 'calling footerKeys()' );
  
  switch( key.which ) {
      case 70: //f
        this.footerToggle();
        break;
  }
} 

// ------------------------------------------------

Slideshow.footerToggle = function()
{
  // todo/fix: note jquery sets inline css (e.g. display: block)
  //   but css won't get scoped for media (e.g. projection, screen, etc)
  //   thus, css changes "spill over" to all media types

  // fix: add/remove Class hidden?? instead of toggle()

  $( '.layout #footer, .layout footer').toggle(); 
}

// ------------------------------------------------

Slideshow.footerAddEvents = function()
{
  $( document ).on( 'slideshow.debug.on',  $.proxy( Slideshow.footerDebugOn, this ));
  $( document ).on( 'slideshow.debug.off', $.proxy( Slideshow.footerDebugOff, this ));
  $( document ).on( 'slideshow.keys',      $.proxy( Slideshow.footerKeys, this ));
}

Slideshow.footerAddStyles = function() {
  this.debug( 'add builtin footer/header css via inline style elements' );
  
   var styleProjection =
"<style media='screen,projection'>                   \n"+
" .layout #footer.debug,                             \n"+
" .layout  footer.debug  { background: #CCF; }       \n"+
"                                                    \n"+
" .layout #header.debug,                             \n"+
" .layout  header.debug { background: #FCC; }        \n"+
"</style>";

  $( 'head' ).append( styleProjection );
}


Slideshow.footerAddStyles();
Slideshow.footerAddEvents();