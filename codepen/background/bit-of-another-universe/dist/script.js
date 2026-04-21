var pulsers = Array.from(document.querySelectorAll('.pulser'));

pulsers.forEach(function(p, i) {
  p.animate([
    {transform: 'scale('+Math.random()+') translate3d(0,0,0) rotate(0deg)'},
    {transform: 'scale('+Math.random()+') translate3d(0,0,0) rotate(360deg)'}
  ], {
    duration: Math.random() * 5000 + 5000,
    iterations: Infinity,
    direction: 'alternate',
    easing: 'cubic-bezier(.53,-0.38,.52,1.41)'
  });
  
  p.style.animationDelay = (-10000 * i / pulsers.length) + 'ms';
});





//switched to css keyframes
function filters(p) {
  p.animate([
    {filter: 'hue-rotate(0deg) blur(3vmin)'},// blur(0px)'},
    {filter: 'hue-rotate(360deg) blur(20vmin)'}// blur('+(Math.random()*5)+'px)'}
  ], {
    //iterationComposite: 'accumulate',
    duration: 10000,
    delay: -10000 * i / pulsers.length,
    iterations: Infinity,
    direction: 'alternate'
  });
}