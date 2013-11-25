# S6 Format


## Media Types 

S6 supports out-of-the box three media types, that is, `projection`, `screen` and `print`:

* `projection` => display one slide at-a-time; (use option `mode: slideshow`)
* `screen`     => display all slides at-once on screen; (use option `mode: outline`) 
* `print`      => print (and print preview)

Note: Only the Opera browser has built-in support for `projection`.
On other browsers S6 uses JavaScript to switch `projection` to `screen` on startup.


## Structure, CSS Classes

     .presentation
       .slide
         .step
         .notes
         .extra
      
### Core Classes

`.presentation` (alias `.deck`, `.slides`)

Top level class for all slides

`.slide`

Marks a slide

`.step`  (alias `.incremental`, `.delayed`, `.action`, `.build`) 

Marks a slide step. Shortcut Tip: If a list gets marked up with `.step`,
all its children get marked up automatically.


### Extras

`.notes`  (alias `.note`, `.handout`)  

Marks speaker notes.

`.extra`

Marks extra text for print only.



## Styling and Slide Types

### Slide Types/Layouts

* fullscreen
* hidden

### Font Size

Absolute:

* xx-large
* x-large
* large
* small
* x-small
* xx-small

Relative:

* larger
* smaller

### Alignment

* right
* center
* left

