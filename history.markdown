### r2011-11-05

* Add chrome fix/workaround for inline styles (projection media needs to get set to screen,projection)
* Move code to addons using new slideshow triggers; new addons include:
  * counter (slide counter e.g. 1/7)
  * controls (toggle, next, prev buttons, jumplist)
  * autoplay
  * footer/header
* Moved sample transitions to jquery.slideshow.transitions.js
* Changed .slide box-sizing to border-box (lets you use width: 100%; height: 100%;)
* Minor fixes

### r2011-11-01

* Add minimalistic.html template; all styles (projection, screen, print) inline plus no less.js used
* Clean up styles; move all styles (projection, screen, print) for controls into slideshow.js
* /shared folder now split into /js and /css folders
* Update jquery.js to 1.6.4
* Update less.js to 1.1.4
* Minor fixes

### r2011-05-22

* Adding blank5.html template (using more semantic tags e.g. header, footer, article, etc.) [Thanks Ryan McIlmoyl]

### r2011-05-21

* Switch all CSS stylesheets to use less.js CSS extension
* Update jquery to 1.6.1

### r2011-05-20  

* Easier CSS media type handling for projection (e.g. ids no longer required; plus can now handle multiple styles either using link or style tag)

### r2011-02-06

* Add right click on title handler for going back one slide
* Update jquery to 1.5

### r2010-07-18

* Adding custom slide transitions plus some sample animations (e.g. slide up/down, fade out/in)
* Adding clicker (click on title to go to next slide)
* Adding autoplay (press a/p/s-key to toggle autoplay)

### r2010-07-17

* JavaScript cleanup; everything namespaced now using Slideshow
* Removing svg gradient backgrounds; use css3 gradients instead
* Move better browser banner for IE out of core; uses conditional comments for include.

### r2009-02-19

* Add support for steps/incrementals

### r2009-02-10

* Everything is new.