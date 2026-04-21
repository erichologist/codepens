# Getting the inverted value for `background-color` via JS #1

A Pen created on CodePen.

Original URL: [https://codepen.io/erichologist/pen/ByjwRZZ](https://codepen.io/erichologist/pen/ByjwRZZ).

The idea was sparked by [this article on the `invert` CSS filter](http://davidwalsh.name/invert-colors-css), particularly the following part:  

>The values reported back by window.getComputedStyle(el) will be the original CSS values, however, so there's no way of getting the true inverted values of given properties. 

The thing is, if I have the original `background-color` and the invert filter `%`, then I can compute the inverted value. This handles the case where I set the `filter` value to `invert(100%)` and `background-color` is fully opaque, thus making the value of `styles.backgroundColor` a `rgb()` value, not a `rgba()` one. 

The first box has the original `background-color` with no filter applied.  

The second box has the original `background-color` with an `invert(100%)` filter applied. 

The third box has the background set as the inverted value computed via JS from the original `background-color` assuming full inversion (`invert(100%)`). 