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

  // fix/todo: save background into oldbackground
  //  so we can restore later 

  $( '#header,header' ).css( 'background', '#FCC' );
  $( '#footer,footer' ).css( 'background', '#CCF' );
}

Slideshow.footerDebugOff = function()
{
  this.debug( 'calling footerDebugOff()' );
      
  $( '#header,header' ).css( 'background', 'transparent' );
  $( '#footer,footer' ).css( 'background', 'transparent' );
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

  $( '#footer, footer').toggle(); 
}

// ------------------------------------------------

Slideshow.footerAddEvents = function()
{
  $( document ).bind( 'slideshow.debug.on',  $.proxy( Slideshow.footerDebugOn, this ));
  $( document ).bind( 'slideshow.debug.off', $.proxy( Slideshow.footerDebugOff, this ));
  $( document ).bind( 'slideshow.keys',      $.proxy( Slideshow.footerKeys, this ));
}

Slideshow.footerAddEvents();