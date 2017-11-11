// use like center( options )( deck )
//
// adapted from
//    https://github.com/markdalgleish/presentation-bespoke.js/blob/master/src/js/bespoke-plugins.js


function center() {
  return function(deck) {
 	  deck.slides.forEach( slide => {
		   var centerWrapper = document.createElement('div'),
			 children = [].slice.call(slide.childNodes, 0);

		   centerWrapper.className = 'bespoke-center-wrapper';

		   children.forEach( child => {
			   slide.removeChild(child);
			   centerWrapper.appendChild(child);
		   });

		  slide.appendChild(centerWrapper);
		  centerWrapper.style.marginTop = ((slide.offsetHeight - centerWrapper.offsetHeight) / 2) + 'px';
	  });
  };
}
