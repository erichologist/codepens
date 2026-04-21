var box_inverted_css = document.querySelector('.box--inverted-css'), 
    styles = window.getComputedStyle(box_inverted_css), 
    original = styles.backgroundColor, 
    channels = original.match(/\d+/g) /* [red, green, blue] */, 
    inverted_channels = channels.map(function(ch) {
        return 255 - ch;
    }) /* [255 - red, 255 - green, 255 - blue] */, 
    inverted = 'rgb(' + inverted_channels.join(', ') + ')', 
    box_inverted_js = document.querySelector('.box--inverted-js');

box_inverted_js.style.backgroundColor = inverted;

console.log(original, inverted);