// use like controls( options )( deck )
//
// adapted from
//    https://github.com/markdalgleish/presentation-bespoke.js/blob/master/src/js/bespoke-plugins.js


function controls() {
  return function( deck ) {
    console.log( "[bespoke.controls] ctor");

	const controls = document.createElement('div');

	controls.innerHTML = '' +
			'<aside class="controls">' +
			'	<a class="left" href="#">&#x25C4;</a>' +
			'	<a class="right" href="#">&#x25BA;</a>' +
			'	<a class="up" href="#">&#x25B2;</a>' +
			'	<a class="down" href="#">&#x25BC;</a>' +
			'</aside>';

	const prev = controls.querySelector('.left'),
	      next = controls.querySelector('.right');

	prev.addEventListener( 'click', ev => deck.prev() );
	next.addEventListener( 'click', ev => deck.next() );

	deck.on( 'activate', ev => {
		 prev.classList[ev.index === 0 ? 'remove' : 'add']('enabled');
		 next.classList[ev.index === deck.slides.length - 1 ? 'remove' : 'add']('enabled');
	});

	deck.parent.appendChild( controls );
  };
}
