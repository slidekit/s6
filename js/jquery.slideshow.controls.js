/***********
 *
 *  control addon:
 *
 *   adds toggle, prev slide, next slide links/buttons and jump list
 *   - use key-c to toggle controls (in projection mode)
 *
 *   layout structure:
 *
 *  .layout
 *    > #controls  (holding navigation controls)
 *       > #navLinks
 *          > #toggle
 *          > #navList
 *            > #jumplist
 */


Slideshow.ctrlInit = function()
{
  this.debug( 'calling ctrlInit()' );
  
  var self = this;   // NOTE: jquery binds this in .each,.click, etc to element

  // todo: make layout into an id (not class?)
  //  do we need or allow more than one element?
       
  // if no div.layout exists, create one
  if( $( '.layout' ).length == 0 )
    $( 'body' ).append( "<div class='layout'></div>");

  $( '.layout' ).append( "<div id='controls'>" );
 
  var $controls = $( '#controls' )
    
  $controls.html(  '<div id="navLinks">'
     + '<a accesskey="t" id="toggle" href="#">&#216;<\/a>'
     + '<a accesskey="z" id="prev" href="#">&laquo;<\/a>'
     + '<a accesskey="x" id="next" href="#">&raquo;<\/a>'
     + '<div id="navList"><select id="jumplist" /><\/div>'
     + '<\/div>' );
      
  $controls.hover( function() { self.ctrlShow(); }, function() { self.ctrlHide(); });
  $('#toggle').click( function() { self.toggle(); } );
  $('#prev').click( function() { self.go(-1); } );
  $('#next').click( function() { self.go(1); } );
       
  $('#jumplist').change( function() { self.goTo( parseInt( $( '#jumplist' ).val() )); } );

  this.ctrlPopulateJumpList();
}


Slideshow.ctrlDebugOn = function()
{
  this.debug( 'calling ctrlDebugOn()' );
  $( '#controls' ).addClass( 'debug' );
}

Slideshow.ctrlDebugOff = function()
{
  this.debug( 'calling ctrlDebugOff()' );
  $( '#controls' ).removeClass( 'debug' );
}

Slideshow.ctrlKeys = function( event, key )
{
  this.debug( 'calling ctrlKeys()' );
  
  switch( key.which ) {
    case 67: // c
      this.ctrlToggle();
      break;
  }
}

Slideshow.ctrlChange = function()
{
  this.debug( 'calling ctrlChange()' );
  this.ctrlUpdateJumpList();
}

// -----------------------------------------------------

Slideshow.ctrlPopulateJumpList = function()
{    
  var self = this;   // NOTE: jquery binds this in .each to element

  var list = $('#jumplist').get(0);
    
  this.$slides.each( function(i) {
    var text = $(this).find( self.settings.titleSelector ).text();
    list.options[list.length] = new Option( (i+1)+' : '+ text, (i+1) );
  });
}

Slideshow.ctrlUpdateJumpList = function()
{
  $('#jumplist').get(0).selectedIndex = (this.snum-1);
}

Slideshow.ctrlShow = function()
{
  $( '#navLinks' ).css( 'visibility', 'visible' );
}

Slideshow.ctrlHide = function()
{
  $( '#navLinks' ).css( 'visibility', 'hidden' );
}

Slideshow.ctrlToggle = function()
{
  // toggle control panel 
  var $navLinks = $( '#navLinks' );

  if( $navLinks.css( 'visibility' ) != 'visible' )
    $navLinks.css( 'visibility', 'visible' );
  else
    $navLinks.css( 'visibility', 'hidden' );
}


// ------------------------------------------------

Slideshow.ctrlAddEvents = function()
{
  $( document ).on( 'slideshow.init',      $.proxy( Slideshow.ctrlInit, this ));
  $( document ).on( 'slideshow.debug.on',  $.proxy( Slideshow.ctrlDebugOn, this ));
  $( document ).on( 'slideshow.debug.off', $.proxy( Slideshow.ctrlDebugOff, this ));
  $( document ).on( 'slideshow.keys',      $.proxy( Slideshow.ctrlKeys, this ));
  $( document ).on( 'slideshow.change',    $.proxy( Slideshow.ctrlChange, this ));
}

Slideshow.ctrlAddStyles = function() {
  this.debug( 'add builtin controls css via inline style elements' );
  
  var styleProjection =
"<style media='screen,projection'>               \n"+
"                                                \n"+
" #controls.debug { background: #BBD; }          \n"+
"                                                \n"+
" #controls { position: fixed;                   \n"+
"              left: 60%; bottom: 0;             \n"+
"              width: 40%;                       \n"+
"              z-index: 100;                     \n"+
"              text-align: right;                \n"+
"              font-weight: bold;                \n"+
"              font-size: 120%;                  \n"+
"            }                                   \n"+
"                                                \n"+
" #controls :focus { outline: 1px dotted white;} \n"+
"                                                \n"+  
" #controls #navLinks { text-align: right; margin: 0; visibility: hidden; } \n"+

"                                                \n"+
" #controls #navLinks a { padding: 0; margin: 0 0.5em; cursor: pointer; border: none; }  \n"+
"                                                \n"+
" #controls #navLinks :link,                     \n"+
" #controls #navLinks :visited {text-decoration: none; } \n"+
"                                                \n"+
" #controls #navList #jumplist { background: white; color: black; } \n"+
"</style>";

   var styleScreen =
"<style media='screen'>                      \n"+
"/*********                                      \n"+
" * make toggle button visible and reposition to upper right corner  \n"+
" *   note: toogle button is nested inside #controls > #navLinks > #toogle \n"+
" */                                             \n"+
"                                                \n"+
" #controls,                                     \n"+
" #navLinks,                                     \n"+
" #toggle    { display: block;                   \n"+
"             visibility: visible;               \n"+
"             margin: 0; padding: 0;             \n"+
"          }                                     \n"+
"                                                \n"+
" #toggle { position: fixed;                     \n"+
"          top: 0; right: 0;                     \n"+
"          padding: 0.5em;                       \n"+
"          border-left: 1px solid;               \n"+
"          border-bottom: 1px solid;             \n"+
"          background: white;                    \n"+
"        }                                       \n"+
"</style>";

    $( 'head' ).append( styleProjection );
    $( 'head' ).append( styleScreen );
}

Slideshow.ctrlAddStyles();
Slideshow.ctrlAddEvents();