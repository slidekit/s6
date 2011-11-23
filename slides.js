var BASE_URL_PREFIX = './';

function addScript( name )
{
  var el = document.createElement( 'script' );
  el.type = 'text/javascript';
  el.src = BASE_URL_PREFIX + name;

  if(!document.head)  // fix for Firefox <4.0
    document.head = document.getElementsByTagName('head')[0];

  document.head.appendChild( el );
}

function addStyle( name, media )
{
  var el = document.createElement( 'link' );
  el.rel = 'stylesheet';
  el.type = 'text/css';
  el.href = BASE_URL_PREFIX + name;
  el.media = media;

  if(!document.head)  // fix for Firefox <4.0
    document.head = document.getElementsByTagName('head')[0];

  document.head.appendChild( el );
}

function addStyleLess( name, media )
{
  var el = document.createElement( 'link' );
  el.rel   = 'stylesheet/less';
  el.type = 'text/css';
  el.href  = BASE_URL_PREFIX + name;
  el.media = media;

  if(!document.head)  // fix for Firefox <4.0
    document.head = document.getElementsByTagName('head')[0];

  document.head.appendChild( el );
}


function letsGo()
{
  var useLess = true;

  /*********
   * add style sheet links
   */

  if( useLess )
  {
    addStyleLess( 'themes/blank5/projection.css.less', 'screen,projection' );
    addStyleLess( 'themes/blank5/screen.css.less',     'screen'            );
    addStyleLess( 'themes/blank5/print.css.less',      'print'             );
  }
  else
  {
    addStyle( 'themes/blank5/o/projection.css', 'screen,projection' );
    addStyle( 'themes/blank5/o/screen.css',     'screen'            );
    addStyle( 'themes/blank5/o/print.css',      'print'             );
  }
  
  /********
   * add js libs (less, jquery)
   */

  if( useLess )
    addScript( 'js/less-1.1.4.min.js' );

  addScript( 'js/jquery-1.7.min.js' );

  /********
   * add S6 js code
   */

  addScript( 'js/jquery.slideshow.js' );
  addScript( 'js/jquery.slideshow.counter.js' );
  addScript( 'js/jquery.slideshow.controls.js' );
  addScript( 'js/jquery.slideshow.footer.js' );
  addScript( 'js/jquery.slideshow.autoplay.js' );
  addScript( 'js/jquery.slideshow.ready.js' );

  // todo - check why we can't access Slideshow object here
  // Slideshow.debug( 'letsGo says hello' );
  // Slideshow.init();
}

// letsGo();
document.addEventListener('DOMContentLoaded', letsGo, false);