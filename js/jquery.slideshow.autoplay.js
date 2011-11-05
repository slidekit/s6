/***********
 *
 *  autoplay addon:
 *
 *   - use key-a/p/s to toggle autoplay (in projection mode)
 */


Slideshow.playInit = function()
{
  this.debug( 'calling playInit()' );

  this.playInterval = null;
}

Slideshow.playStart = function()
{
  this.debug( 'calling playStart()' );

  if( this.settings.mode == 'autoplay' )
    this.playToggle();
}


Slideshow.playKeys = function( event, key )
{
  this.debug( 'calling playKeys()' );
  
  switch( key.which ) {
    case 65: //a
    case 80: //p
    case 83: //s
      this.playToggle();
      break;
  }
}


// ------------------------------------------------


Slideshow.playWorker = function()
{
  this.debug( 'calling playWorker()' );

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
}


Slideshow.playToggle = function()
{
  this.debug( 'calling playToggle()' );

  if( this.playInterval )
  {
    this.debug( 'stopping autoplay' );
    clearInterval( this.playInterval );
    this.playInterval = null;
  }
  else
  {
    this.debug( 'starting autoplay' );
    this.playInterval = setInterval( $.proxy( Slideshow.playWorker, this), 2000 );
  }
}

// ------------------------------------------------

Slideshow.playAddEvents = function()
{
  $( document ).bind( 'slideshow.init',      $.proxy( Slideshow.playInit, this ));
  $( document ).bind( 'slideshow.start',     $.proxy( Slideshow.playStart, this ));
  $( document ).bind( 'slideshow.keys',      $.proxy( Slideshow.playKeys, this ));
}

Slideshow.playAddEvents();